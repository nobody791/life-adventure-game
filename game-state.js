class GameState {
    constructor() {
        this.state = {
            player: {
                name: "Player",
                age: GAME_SETTINGS.startingAge,
                money: GAME_SETTINGS.startingMoney,
                intelligence: GAME_SETTINGS.startingIntelligence,
                health: GAME_SETTINGS.startingHealth,
                happiness: 75,
                energy: 90,
                social: 60
            },
            career: {
                currentJob: null,
                experience: 0,
                level: 1,
                salary: 0
            },
            assets: [...gameData.assets],
            family: [...gameData.family],
            investments: [],
            achievements: gameData.achievements.map(ach => ({...ach})),
            dreams: gameData.dreams.map(dream => ({...dream, pursued: false})),
            events: [...gameData.events],
            gameTime: {
                day: 1,
                month: 1,
                year: 2024,
                hour: 8,
                minute: 0
            },
            statistics: {
                totalEarned: 0,
                totalSpent: 0,
                jobsWorked: 0,
                investmentsMade: 0
            }
        };
        
        this.loadFromStorage();
        this.initAutoSave();
    }
    
    // Save game state to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('lifeAdventureGame', JSON.stringify(this.state));
            console.log('Game saved successfully');
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }
    
    // Load game state from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('lifeAdventureGame');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge saved state with default state
                this.state = {
                    ...this.state,
                    ...parsed,
                    player: { ...this.state.player, ...parsed.player },
                    career: { ...this.state.career, ...parsed.career },
                    gameTime: { ...this.state.gameTime, ...parsed.gameTime }
                };
                console.log('Game loaded successfully');
            }
        } catch (error) {
            console.error('Error loading game:', error);
        }
    }
    
    // Initialize auto-save
    initAutoSave() {
        setInterval(() => {
            this.saveToStorage();
            this.showNotification('Game auto-saved', 'success');
        }, GAME_SETTINGS.autoSaveInterval);
    }
    
    // Update game time (called every tick)
    updateGameTime() {
        this.state.gameTime.minute += 30;
        
        if (this.state.gameTime.minute >= 60) {
            this.state.gameTime.minute = 0;
            this.state.gameTime.hour += 1;
            
            if (this.state.gameTime.hour >= 24) {
                this.state.gameTime.hour = 0;
                this.state.gameTime.day += 1;
                
                // Check for monthly salary
                if (this.state.gameTime.day >= 30) {
                    this.state.gameTime.day = 1;
                    this.state.gameTime.month += 1;
                    this.processMonthlySalary();
                    
                    if (this.state.gameTime.month > 12) {
                        this.state.gameTime.month = 1;
                        this.state.gameTime.year += 1;
                        this.state.player.age += 1;
                        this.checkAgeEvents();
                    }
                }
            }
        }
    }
    
    // Process monthly salary
    processMonthlySalary() {
        if (this.state.career.salary > 0) {
            this.addMoney(this.state.career.salary);
            this.addEvent(`Salary received: $${this.formatNumber(this.state.career.salary)}`);
        }
        
        // Process investments
        this.state.investments.forEach(investment => {
            const returnAmount = Math.floor(investment.amount * (investment.return / 100) / 12);
            if (returnAmount > 0) {
                this.addMoney(returnAmount);
                this.addEvent(`Investment return: $${this.formatNumber(returnAmount)}`);
            }
        });
    }
    
    // Check for age-related events
    checkAgeEvents() {
        const age = this.state.player.age;
        
        if (age === 21) {
            this.addEvent('You turned 21! New opportunities unlocked!');
        } else if (age === 30) {
            this.addEvent('Welcome to your 30s! Time to build your legacy.');
        } else if (age === 40) {
            this.addEvent('You\'re 40! Mid-life achievements incoming!');
        }
        
        // Update age progress bar
        const ageProgress = (age / GAME_SETTINGS.maxAge) * 100;
        document.getElementById('age-progress').style.width = `${ageProgress}%`;
    }
    
    // Add money to player
    addMoney(amount) {
        this.state.player.money += amount;
        this.state.statistics.totalEarned += amount > 0 ? amount : 0;
        this.state.statistics.totalSpent += amount < 0 ? Math.abs(amount) : 0;
        this.updateUI();
    }
    
    // Check if player can afford something
    canAfford(amount) {
        return this.state.player.money >= amount;
    }
    
    // Add intelligence
    addIntelligence(amount) {
        this.state.player.intelligence = Math.min(100, this.state.player.intelligence + amount);
        this.updateUI();
    }
    
    // Add health
    addHealth(amount) {
        this.state.player.health = Math.min(100, this.state.player.health + amount);
        this.updateUI();
    }
    
    // Add event to log
    addEvent(title, description = '') {
        const event = {
            id: Date.now(),
            title,
            description,
            icon: 'fas fa-bell',
            time: 'Just now'
        };
        
        this.state.events.unshift(event);
        
        // Keep only last 10 events
        if (this.state.events.length > 10) {
            this.state.events.pop();
        }
        
        // Update UI if on home section
        if (document.getElementById('home-section').classList.contains('active')) {
            this.updateEventsUI();
        }
    }
    
    // Apply for job
    applyForJob(job) {
        if (this.state.player.age >= job.requirements.age && 
            this.state.player.intelligence >= job.requirements.intelligence) {
            
            this.state.career.currentJob = job;
            this.state.career.salary = job.salary;
            this.state.statistics.jobsWorked++;
            
            // Unlock achievement if first job
            if (this.state.statistics.jobsWorked === 1) {
                this.unlockAchievement(1);
            }
            
            this.addEvent(`You got hired as ${job.title}!`);
            this.showNotification(`Congratulations! You're now a ${job.title}`, 'success');
            return true;
        } else {
            this.showNotification('You don\'t meet the requirements for this job', 'error');
            return false;
        }
    }
    
    // Make investment
    makeInvestment(investment, amount) {
        if (this.canAfford(amount)) {
            this.addMoney(-amount);
            
            const playerInvestment = {
                ...investment,
                amount,
                date: { ...this.state.gameTime }
            };
            
            this.state.investments.push(playerInvestment);
            this.state.statistics.investmentsMade++;
            this.addEvent(`Invested $${this.formatNumber(amount)} in ${investment.title}`);
            this.showNotification('Investment successful!', 'success');
            return true;
        } else {
            this.showNotification('Insufficient funds', 'error');
            return false;
        }
    }
    
    // Pursue dream
    pursueDream(dream) {
        if (this.canAfford(dream.cost) && 
            this.state.player.age >= dream.requirements.age &&
            this.state.player.money >= dream.requirements.money) {
            
            this.addMoney(-dream.cost);
            dream.pursued = true;
            this.addEvent(`You achieved your dream: ${dream.title}!`);
            this.showNotification('Dream achieved!', 'success');
            return true;
        } else {
            this.showNotification('You cannot pursue this dream yet', 'error');
            return false;
        }
    }
    
    // Unlock achievement
    unlockAchievement(achievementId) {
        const achievement = this.state.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.addEvent(`Achievement unlocked: ${achievement.title}`);
            this.showNotification(`Achievement unlocked: ${achievement.title}!`, 'success');
        }
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notificationCenter = document.getElementById('notification-center');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <div>
                <p style="font-weight: 600; margin-bottom: 5px;">${message}</p>
                <small>${this.getFormattedTime()}</small>
            </div>
        `;
        
        notificationCenter.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Get formatted time string
    getFormattedTime() {
        const time = this.state.gameTime;
        const dayName = DAYS[time.day % 7];
        const monthName = MONTHS[time.month - 1];
        const hour = time.hour.toString().padStart(2, '0');
        const minute = time.minute.toString().padStart(2, '0');
        return `${dayName}, ${hour}:${min0}`;
    }
    
    // Update all UI elements
    updateUI() {
        // Update player stats
        document.getElementById('money').textContent = this.formatNumber(this.state.player.money);
        document.getElementById('intelligence').textContent = this.state.player.intelligence;
        document.getElementById('health').textContent = this.state.player.health;
        document.getElementById('age').textContent = this.state.player.age;
        
        // Update status bars
        document.querySelector('.status-item:nth-child(1) .status-fill').style.width = `${this.state.player.happiness}%`;
        document.querySelector('.status-item:nth-child(1) .status-value').textContent = `${this.state.player.happiness}%`;
        document.querySelector('.status-item:nth-child(2) .status-fill').style.width = `${this.state.player.energy}%`;
        document.querySelector('.status-item:nth-child(2) .status-value').textContent = `${this.state.player.energy}%`;
        document.querySelector('.status-item:nth-child(3) .status-fill').style.width = `${this.state.player.social}%`;
        document.querySelector('.status-item:nth-child(3) .status-value').textContent = `${this.state.player.social}%`;
        
        // Update current time
        document.getElementById('current-time').textContent = this.getFormattedTime();
        
        // Update age progress
        const ageProgress = (this.state.player.age / GAME_SETTINGS.maxAge) * 100;
        document.getElementById('age-progress').style.width = `${ageProgress}%`;
    }
    
    // Update events UI
    updateEventsUI() {
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '';
        
        this.state.events.slice(0, 5).forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-icon">
                    <i class="${event.icon}"></i>
                </div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${event.time}</div>
                </div>
            `;
            eventsList.appendChild(eventElement);
        });
    }
}

// Initialize game state
const gameState = new GameState();

// Export for other modules
export default gameState;