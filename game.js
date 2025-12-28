import gameState from './game-state.js';
import { gameData, GAME_SETTINGS } from './data.js';

class LifeAdventureGame {
    constructor() {
        this.gameActive = false;
        this.gameLoopInterval = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadGameData();
        this.startGameLoop();
        this.gameActive = true;
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            gameState.showNotification('Welcome to Life Odyssey! Start your adventure.', 'success');
            
            // Play background music if user interacts
            document.addEventListener('click', () => {
                const bgMusic = document.getElementById('bg-music');
                if (bgMusic.paused) {
                    bgMusic.volume = 0.3;
                    bgMusic.play().catch(e => console.log('Autoplay prevented'));
                }
            }, { once: true });
        }, 2000);
    }
    
    bindEvents() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchSection(btn.dataset.section));
        });
        
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });
        
        // Relation buttons
        document.querySelectorAll('.relation-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleRelation(btn.dataset.relation));
        });
        
        // Sound controls
        document.addEventListener('click', () => {
            const clickSound = document.getElementById('click-sound');
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Sound play prevented'));
        });
    }
    
    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.game-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected section and activate nav button
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }
    
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'home':
                gameState.updateEventsUI();
                break;
            case 'work':
                this.loadJobs();
                this.updateCurrentJob();
                break;
            case 'economy':
                this.loadInvestments();
                this.updateAssets();
                break;
            case 'family':
                this.loadFamily();
                break;
            case 'dreams':
                this.loadDreams();
                this.loadAchievements();
                break;
        }
    }
    
    loadGameData() {
        // Initial UI update
        gameState.updateUI();
        gameState.updateEventsUI();
    }
    
    startGameLoop() {
        this.gameLoopInterval = setInterval(() => {
            this.gameTick();
        }, GAME_SETTINGS.tickInterval);
    }
    
    gameTick() {
        // Update game time
        gameState.updateGameTime();
        
        // Natural stat changes
        gameState.state.player.energy = Math.max(0, gameState.state.player.energy - 5);
        gameState.state.player.health = Math.max(0, gameState.state.player.health - 1);
        gameState.state.player.social = Math.max(0, gameState.state.player.social - 2);
        
        // Random events
        if (Math.random() < 0.3) {
            this.generateRandomEvent();
        }
        
        // Update UI
        gameState.updateUI();
    }
    
    generateRandomEvent() {
        const events = [
            {
                title: 'Unexpected Bonus',
                description: 'You received a bonus at work!',
                money: 500,
                probability: 0.2
            },
            {
                title: 'Medical Bill',
                description: 'Unexpected health expense',
                money: -300,
                probability: 0.15
            },
            {
                title: 'Investment Opportunity',
                description: 'Special investment offer available',
                probability: 0.25
            },
            {
                title: 'Social Invitation',
                description: 'Friends invited you to an event',
                social: 10,
                probability: 0.2
            },
            {
                title: 'Learning Opportunity',
                description: 'Free online course available',
                intelligence: 5,
                probability: 0.2
            }
        ];
        
        const event = events.find(e => Math.random() < e.probability);
        if (event) {
            if (event.money) gameState.addMoney(event.money);
            if (event.social) gameState.state.player.social = Math.min(100, gameState.state.player.social + event.social);
            if (event.intelligence) gameState.addIntelligence(event.intelligence);
            
            gameState.addEvent(event.title, event.description);
            gameState.showNotification(event.title, event.money > 0 ? 'success' : 'error');
        }
    }
    
    handleAction(action) {
        switch(action) {
            case 'rest':
                if (gameState.state.player.energy < 100) {
                    gameState.state.player.energy = Math.min(100, gameState.state.player.energy + 30);
                    gameState.state.player.health = Math.min(100, gameState.state.player.health + 5);
                    gameState.addEvent('You rested and recovered energy');
                    gameState.showNotification('Energy restored!', 'success');
                }
                break;
                
            case 'study':
                if (gameState.state.player.energy >= 20) {
                    gameState.state.player.energy -= 20;
                    gameState.addIntelligence(5);
                    gameState.addEvent('Studied and gained knowledge');
                    gameState.showNotification('Intelligence increased!', 'success');
                } else {
                    gameState.showNotification('Not enough energy to study', 'error');
                }
                break;
                
            case 'socialize':
                if (gameState.state.player.energy >= 15 && gameState.state.player.money >= 50) {
                    gameState.state.player.energy -= 15;
                    gameState.addMoney(-50);
                    gameState.state.player.social = Math.min(100, gameState.state.player.social + 15);
                    gameState.state.player.happiness = Math.min(100, gameState.state.player.happiness + 10);
                    gameState.addEvent('Socialized with friends');
                    gameState.showNotification('Social connections improved!', 'success');
                } else {
                    gameState.showNotification('Need energy and money to socialize', 'error');
                }
                break;
                
            case 'exercise':
                if (gameState.state.player.energy >= 25) {
                    gameState.state.player.energy -= 25;
                    gameState.addHealth(10);
                    gameState.state.player.happiness = Math.min(100, gameState.state.player.happiness + 5);
                    gameState.addEvent('Exercised and improved health');
                    gameState.showNotification('Health improved!', 'success');
                } else {
                    gameState.showNotification('Not enough energy to exercise', 'error');
                }
                break;
        }
        
        gameState.updateUI();
    }
    
    loadJobs() {
        const jobList = document.getElementById('job-list');
        jobList.innerHTML = '';
        
        gameData.jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'job-card';
            jobElement.innerHTML = `
                <div class="job-header">
                    <div class="job-title">
                        <i class="${job.icon}"></i>
                        ${job.title}
                    </div>
                    <div class="job-salary">$${gameState.formatNumber(job.salary)}/month</div>
                </div>
                <div class="job-requirements">${job.description}</div>
                <div class="job-details">
                    <small>Requirements: Age ${job.requirements.age}, Intelligence ${job.requirements.intelligence}</small>
                </div>
                <button class="job-apply" data-job-id="${job.id}">Apply Now</button>
            `;
            
            jobList.appendChild(jobElement);
            
            // Add event listener to apply button
            jobElement.querySelector('.job-apply').addEventListener('click', () => {
                if (gameState.applyForJob(job)) {
                    this.updateCurrentJob();
                    this.loadJobs(); // Refresh job list
                }
            });
        });
    }
    
    updateCurrentJob() {
        const currentJobDiv = document.getElementById('current-job');
        const job = gameState.state.career.currentJob;
        
        if (job) {
            currentJobDiv.innerHTML = `
                <div class="job-header">
                    <div class="job-title">
                        <i class="${job.icon}"></i>
                        ${job.title}
                    </div>
                    <div class="job-salary">$${gameState.formatNumber(job.salary)}/month</div>
                </div>
                <div class="job-requirements">${job.description}</div>
                <div class="job-details">
                    <small>Next salary in ${30 - gameState.state.gameTime.day} days</small>
                </div>
            `;
        } else {
            currentJobDiv.innerHTML = `<p>No job selected. Apply for a job to start earning!</p>`;
        }
    }
    
    loadInvestments() {
        const investmentList = document.getElementById('investment-list');
        investmentList.innerHTML = '';
        
        gameData.investments.forEach(investment => {
            const investmentElement = document.createElement('div');
            investmentElement.className = 'investment-card';
            investmentElement.innerHTML = `
                <div class="investment-header">
                    <div class="investment-title">
                        <i class="${investment.icon}"></i>
                        ${investment.title}
                    </div>
                    <div class="investment-return">${investment.return}% return</div>
                </div>
                <div class="investment-details">${investment.description}</div>
                <div class="investment-info">
                    <small>Min: $${gameState.formatNumber(investment.minAmount)} | Risk: ${investment.risk}</small>
                </div>
                <button class="investment-buy" data-investment-id="${investment.id}">Invest</button>
            `;
            
            investmentList.appendChild(investmentElement);
            
            // Add event listener to invest button
            investmentElement.querySelector('.investment-buy').addEventListener('click', () => {
                this.showInvestmentModal(investment);
            });
        });
    }
    
    showInvestmentModal(investment) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Invest in ${investment.title}</h3>
                <p>${investment.description}</p>
                <p>Expected return: ${investment.return}% annually</p>
                <p>Risk level: ${investment.risk}</p>
                <div class="modal-input">
                    <label>Investment Amount (min: $${gameState.formatNumber(investment.minAmount)})</label>
                    <input type="number" id="investment-amount" value="${investment.minAmount}" min="${investment.minAmount}" max="${gameState.state.player.money}">
                </div>
                <div class="modal-buttons">
                    <button class="modal-cancel">Cancel</button>
                    <button class="modal-confirm">Confirm Investment</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('investment-amount').value);
            if (amount >= investment.minAmount && gameState.makeInvestment(investment, amount)) {
                modal.remove();
                this.loadInvestments();
            }
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    updateAssets() {
        const assetsGrid = document.querySelector('.assets-grid');
        assetsGrid.innerHTML = '';
        
        gameState.state.assets.forEach(asset => {
            const assetElement = document.createElement('div');
            assetElement.className = 'asset-card';
            assetElement.innerHTML = `
                <i class="${asset.icon}"></i>
                <span>${asset.name}</span>
                <small>Value: $${gameState.formatNumber(asset.value)}</small>
            `;
            assetsGrid.appendChild(assetElement);
        });
        
        // Add buy asset button
        const buyAssetCard = document.createElement('div');
        buyAssetCard.className = 'asset-card buy-asset';
        buyAssetCard.innerHTML = `
            <i class="fas fa-plus-circle"></i>
            <span>Buy New Asset</span>
            <small>Expand your portfolio</small>
        `;
        buyAssetCard.addEventListener('click', () => this.showAssetStore());
        assetsGrid.appendChild(buyAssetCard);
    }
    
    showAssetStore() {
        const assets = [
            { name: 'Better Car', value: 35000, icon: 'fas fa-car' },
            { name: 'Larger Apartment', value: 120000, icon: 'fas fa-home' },
            { name: 'Laptop', value: 1500, icon: 'fas fa-laptop' },
            { name: 'Stocks Bundle', value: 10000, icon: 'fas fa-chart-line' }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Asset Store</h3>
                <div class="store-items">
                    ${assets.map(asset => `
                        <div class="store-item">
                            <i class="${asset.icon}"></i>
                            <div>
                                <h4>${asset.name}</h4>
                                <p>$${gameState.formatNumber(asset.value)}</p>
                            </div>
                            <button class="buy-btn" data-asset='${JSON.stringify(asset)}'>Buy</button>
                        </div>
                    `).join('')}
                </div>
                <button class="modal-cancel">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add buy functionality
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const asset = JSON.parse(btn.dataset.asset);
                if (gameState.canAfford(asset.value)) {
                    gameState.addMoney(-asset.value);
                    gameState.state.assets.push(asset);
                    gameState.addEvent(`Purchased ${asset.name}`);
                    gameState.showNotification(`Purchased ${asset.name}!`, 'success');
                    this.updateAssets();
                    modal.remove();
                } else {
                    gameState.showNotification('Insufficient funds', 'error');
                }
            });
        });
        
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    loadFamily() {
        const familyMembers = document.getElementById('family-members');
        familyMembers.innerHTML = '';
        
        gameState.state.family.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'family-member';
            memberElement.innerHTML = `
                <div class="member-avatar">
                    <i class="${member.icon}"></i>
                </div>
                <div class="member-name">${member.name}</div>
                <div class="member-relation">${member.relation}</div>
                <div class="member-happiness">Happiness: ${member.happiness}%</div>
            `;
            familyMembers.appendChild(memberElement);
        });
        
        // Add add family member button if less than 5
        if (gameState.state.family.length < 5) {
            const addMember = document.createElement('div');
            addMember.className = 'family-member add-member';
            addMember.innerHTML = `
                <div class="member-avatar">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="member-name">Add Member</div>
                <div class="member-relation">Expand Family</div>
            `;
            addMember.addEventListener('click', () => this.addFamilyMember());
            familyMembers.appendChild(addMember);
        }
    }
    
    addFamilyMember() {
        const relations = ['Partner', 'Child', 'Parent', 'Sibling', 'Friend'];
        const names = ['Emma', 'James', 'Sophia', 'Michael', 'Olivia', 'William', 'Ava', 'Alexander'];
        
        const newMember = {
            id: Date.now(),
            name: names[Math.floor(Math.random() * names.length)],
            relation: relations[Math.floor(Math.random() * relations.length)],
            happiness: 80,
            icon: Math.random() > 0.5 ? 'fas fa-male' : 'fas fa-female'
        };
        
        gameState.state.family.push(newMember);
        gameState.addEvent(`New family member: ${newMember.name} (${newMember.relation})`);
        gameState.showNotification('Family expanded!', 'success');
        this.loadFamily();
    }
    
    handleRelation(action) {
        switch(action) {
            case 'date':
                if (gameState.state.player.money >= 100 && gameState.state.player.energy >= 20) {
                    gameState.addMoney(-100);
                    gameState.state.player.energy -= 20;
                    gameState.state.player.social = Math.min(100, gameState.state.player.social + 20);
                    gameState.state.player.happiness = Math.min(100, gameState.state.player.happiness + 15);
                    gameState.addEvent('Went on a date');
                    gameState.showNotification('Great date! Social and happiness increased.', 'success');
                } else {
                    gameState.showNotification('Need money and energy for a date', 'error');
                }
                break;
                
            case 'marry':
                if (gameState.state.player.money >= 5000 && gameState.state.player.age >= 21) {
                    gameState.addMoney(-5000);
                    gameState.addEvent('Got married!');
                    gameState.showNotification('Congratulations on your marriage!', 'success');
                    gameState.unlockAchievement(5);
                    
                    // Add spouse to family if not already there
                    if (!gameState.state.family.some(m => m.relation === 'Spouse')) {
                        gameState.state.family.push({
                            id: Date.now(),
                            name: 'Spouse',
                            relation: 'Spouse',
                            happiness: 90,
                            icon: 'fas fa-ring'
                        });
                        this.loadFamily();
                    }
                } else {
                    gameState.showNotification('Need $5,000 and be at least 21 years old to marry', 'error');
                }
                break;
                
            case 'child':
                if (gameState.state.family.some(m => m.relation === 'Spouse') && 
                    gameState.state.player.money >= 2000) {
                    gameState.addMoney(-2000);
                    gameState.addEvent('Had a child!');
                    gameState.showNotification('Congratulations on the new family member!', 'success');
                    gameState.unlockAchievement(6);
                    
                    gameState.state.family.push({
                        id: Date.now(),
                        name: 'Baby',
                        relation: 'Child',
                        happiness: 100,
                        icon: 'fas fa-baby'
                    });
                    this.loadFamily();
                } else {
                    gameState.showNotification('Need to be married and have $2,000 to have a child', 'error');
                }
                break;
        }
        
        gameState.updateUI();
    }
    
    loadDreams() {
        const dreamsList = document.getElementById('dreams-list');
        dreamsList.innerHTML = '';
        
        gameState.state.dreams.forEach(dream => {
            const dreamElement = document.createElement('div');
            dreamElement.className = `dream-card ${dream.pursued ? 'achieved' : ''}`;
            dreamElement.innerHTML = `
                <div class="dream-header">
                    <div class="dream-title">
                        <i class="${dream.icon}"></i>
                        ${dream.title}
                    </div>
                    <div class="dream-cost">$${gameState.formatNumber(dream.cost)}</div>
                </div>
                <div class="dream-description">${dream.description}</div>
                <div class="dream-info">
                    <small>Requirements: Age ${dream.requirements.age}, Money $${gameState.formatNumber(dream.requirements.money)}</small>
                </div>
                <button class="dream-pursue" data-dream-id="${dream.id}" ${dream.pursued ? 'disabled' : ''}>
                    ${dream.pursued ? 'Achieved!' : 'Pursue Dream'}
                </button>
            `;
            
            dreamsList.appendChild(dreamElement);
            
            if (!dream.pursued) {
                dreamElement.querySelector('.dream-pursue').addEventListener('click', () => {
                    if (gameState.pursueDream(dream)) {
                        this.loadDreams();
                        this.loadAchievements();
                    }
                });
            }
        });
    }
    
    loadAchievements() {
        const achievementGrid = document.getElementById('achievement-grid');
        achievementGrid.innerHTML = '';
        
        gameState.state.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon" style="${achievement.unlocked ? '' : 'opacity: 0.5;'}">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-name">${achievement.title}</div>
                ${achievement.unlocked ? '<div class="achievement-badge"><i class="fas fa-check"></i></div>' : ''}
            `;
            achievementGrid.appendChild(achievementElement);
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new LifeAdventureGame();
});

// Export game class
export default LifeAdventureGame;