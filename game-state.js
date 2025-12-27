// Game State Management
class GameState {
    constructor() {
        this.stats = {
            money: 10000,
            health: 100,
            intelligence: 50,
            reputation: 50,
            age: 18,
            happiness: 70,
            energy: 85,
            jailTime: 0,
            job: null,
            education: 'highschool',
            bankBalance: 0,
            loan: 0
        };

        this.inventory = [];
        this.vehicles = [];
        this.properties = [];
        this.businesses = [];
        this.family = [];
        this.relationships = [];
        this.stockPortfolio = {};
        this.gameLog = [];
        this.notifications = [];
        this.currentJob = null;
        this.currentLocation = 'home';
        this.lastActionTime = Date.now();
        this.gameStarted = false;
    }

    // Update stats with validation
    updateStat(stat, value) {
        if (this.stats[stat] !== undefined) {
            this.stats[stat] += value;
            
            // Clamp values
            if (stat === 'health' || stat === 'happiness' || stat === 'energy') {
                this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat]));
            }
            if (stat === 'reputation') {
                this.stats[stat] = Math.max(0, Math.min(100, this.stats[stat]));
            }
            
            return true;
        }
        return false;
    }

    // Add money with validation
    addMoney(amount) {
        this.stats.money += amount;
        if (this.stats.money < 0) {
            this.stats.money = 0;
            return false;
        }
        return true;
    }

    // Check if player can afford something
    canAfford(amount) {
        return this.stats.money >= amount;
    }

    // Add item to inventory
    addItem(item) {
        this.inventory.push({
            ...item,
            id: Date.now() + Math.random(),
            acquired: new Date().toISOString()
        });
    }

    // Remove item from inventory
    removeItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
    }

    // Buy a vehicle
    buyVehicle(vehicle) {
        if (!this.canAfford(vehicle.price)) {
            this.addNotification("You don't have enough money!", 'danger');
            return false;
        }
        
        this.addMoney(-vehicle.price);
        this.vehicles.push({
            ...vehicle,
            id: Date.now() + Math.random(),
            bought: new Date().toISOString()
        });
        
        this.addNotification(`Bought ${vehicle.name} for $${vehicle.price.toLocaleString()}!`, 'success');
        this.addLog(`Purchased ${vehicle.name}`);
        return true;
    }

    // Buy a property
    buyProperty(property) {
        if (!this.canAfford(property.price)) {
            this.addNotification("You don't have enough money!", 'danger');
            return false;
        }
        
        this.addMoney(-property.price);
        this.properties.push({
            ...property,
            id: Date.now() + Math.random(),
            bought: new Date().toISOString(),
            rented: false
        });
        
        this.addNotification(`Bought ${property.name} for $${property.price.toLocaleString()}!`, 'success');
        this.addLog(`Purchased ${property.name}`);
        return true;
    }

    // Start a business
    startBusiness(business) {
        if (!this.canAfford(business.price)) {
            this.addNotification("You don't have enough money!", 'danger');
            return false;
        }
        
        this.addMoney(-business.price);
        this.businesses.push({
            ...business,
            id: Date.now() + Math.random(),
            started: new Date().toISOString(),
            profit: 0
        });
        
        this.addNotification(`Started ${business.name} business!`, 'success');
        this.addLog(`Started ${business.name} business`);
        return true;
    }

    // Commit crime
    commitCrime(crime) {
        const successChance = 100 - crime.risk;
        const success = Math.random() * 100 < successChance;
        
        if (success) {
            const reward = Math.floor(Math.random() * (crime.maxReward - crime.minReward + 1)) + crime.minReward;
            this.addMoney(reward);
            this.updateStat('reputation', -crime.reputationLoss);
            
            this.addNotification(`Successfully committed ${crime.name}! Got $${reward.toLocaleString()}`, 'success');
            this.addLog(`Committed ${crime.name}: +$${reward}`);
        } else {
            const jailChance = crime.jailChance;
            if (Math.random() * 100 < jailChance) {
                this.stats.jailTime += crime.jailTime;
                this.addNotification(`Caught! Sent to jail for ${crime.jailTime} days!`, 'danger');
                this.addLog(`Arrested for ${crime.name}: ${crime.jailTime} days jail`);
            } else {
                this.addNotification(`Failed ${crime.name} but escaped!`, 'warning');
                this.addLog(`Failed ${crime.name}`);
            }
            this.updateStat('reputation', -crime.reputationLoss);
        }
        
        return success;
    }

    // Work at job
    work() {
        if (!this.currentJob) {
            this.addNotification("You don't have a job!", 'warning');
            return false;
        }
        
        if (this.stats.energy < this.currentJob.energyCost) {
            this.addNotification("Not enough energy to work!", 'warning');
            return false;
        }
        
        const salary = this.currentJob.salary;
        this.addMoney(salary);
        this.updateStat('energy', -this.currentJob.energyCost);
        this.updateStat('happiness', -5);
        
        this.addNotification(`Worked and earned $${salary.toLocaleString()}`, 'success');
        this.addLog(`Work: +$${salary}`);
        return true;
    }

    // Study
    study() {
        if (this.stats.energy < 20) {
            this.addNotification("Not enough energy to study!", 'warning');
            return false;
        }
        
        const intelGain = Math.floor(Math.random() * 5) + 5;
        this.updateStat('intelligence', intelGain);
        this.updateStat('energy', -20);
        
        this.addNotification(`Studied and gained ${intelGain} intelligence`, 'success');
        this.addLog(`Study: +${intelGain} intelligence`);
        return true;
    }

    // Socialize
    socialize() {
        if (this.stats.energy < 15) {
            this.addNotification("Not enough energy to socialize!", 'warning');
            return false;
        }
        
        const happinessGain = Math.floor(Math.random() * 15) + 5;
        const reputationGain = Math.floor(Math.random() * 5) + 1;
        
        this.updateStat('happiness', happinessGain);
        this.updateStat('reputation', reputationGain);
        this.updateStat('energy', -15);
        
        this.addNotification(`Socialized and improved happiness`, 'success');
        this.addLog(`Socialize: +${happinessGain} happiness`);
        return true;
    }

    // Rest
    rest() {
        const energyGain = Math.floor(Math.random() * 30) + 20;
        const healthGain = Math.floor(Math.random() * 5) + 1;
        
        this.updateStat('energy', energyGain);
        this.updateStat('health', healthGain);
        
        this.addNotification(`Rested and recovered energy`, 'success');
        this.addLog(`Rest: +${energyGain} energy`);
        return true;
    }

    // Gamble
    gamble() {
        if (!this.canAfford(1000)) {
            this.addNotification("You need at least $1,000 to gamble!", 'warning');
            return false;
        }
        
        const stake = Math.min(1000, this.stats.money);
        this.addMoney(-stake);
        
        const win = Math.random() > 0.55; // 45% chance to win
        if (win) {
            const winAmount = stake * 2;
            this.addMoney(winAmount);
            this.updateStat('happiness', 10);
            this.addNotification(`Won $${winAmount.toLocaleString()} gambling!`, 'success');
            this.addLog(`Gambling: Won $${winAmount}`);
        } else {
            this.updateStat('happiness', -10);
            this.addNotification(`Lost $${stake.toLocaleString()} gambling!`, 'danger');
            this.addLog(`Gambling: Lost $${stake}`);
        }
        
        return win;
    }

    // Bank deposit
    deposit(amount) {
        if (!this.canAfford(amount)) {
            this.addNotification("Not enough cash!", 'danger');
            return false;
        }
        
        this.addMoney(-amount);
        this.stats.bankBalance += amount;
        
        this.addNotification(`Deposited $${amount.toLocaleString()} to bank`, 'success');
        this.addLog(`Deposit: $${amount}`);
        return true;
    }

    // Bank withdraw
    withdraw(amount) {
        if (this.stats.bankBalance < amount) {
            this.addNotification("Not enough funds in bank!", 'danger');
            return false;
        }
        
        this.stats.bankBalance -= amount;
        this.addMoney(amount);
        
        this.addNotification(`Withdrew $${amount.toLocaleString()} from bank`, 'success');
        this.addLog(`Withdraw: $${amount}`);
        return true;
    }

    // Take loan
    takeLoan(amount) {
        const maxLoan = this.stats.money * 10;
        if (amount > maxLoan) {
            this.addNotification(`Maximum loan amount is $${maxLoan.toLocaleString()}`, 'warning');
            return false;
        }
        
        this.stats.loan += amount;
        this.addMoney(amount);
        
        this.addNotification(`Took loan of $${amount.toLocaleString()}`, 'success');
        this.addLog(`Loan: +$${amount}`);
        return true;
    }

    // Repay loan
    repayLoan(amount) {
        if (!this.canAfford(amount)) {
            this.addNotification("Not enough money to repay!", 'danger');
            return false;
        }
        
        const repayAmount = Math.min(amount, this.stats.loan);
        this.addMoney(-repayAmount);
        this.stats.loan -= repayAmount;
        
        this.addNotification(`Repaid $${repayAmount.toLocaleString()} of loan`, 'success');
        this.addLog(`Loan repayment: $${repayAmount}`);
        return true;
    }

    // Get married
    marry() {
        if (this.family.some(member => member.relation === 'spouse')) {
            this.addNotification("You're already married!", 'warning');
            return false;
        }
        
        if (!this.canAfford(20000)) {
            this.addNotification("You need $20,000 for a wedding!", 'danger');
            return false;
        }
        
        this.addMoney(-20000);
        const spouseName = GameData.familyNames[Math.floor(Math.random() * GameData.familyNames.length)];
        
        this.family.push({
            name: spouseName,
            relation: 'spouse',
            happiness: 50
        });
        
        this.updateStat('happiness', 30);
        this.addNotification(`Married ${spouseName}!`, 'success');
        this.addLog(`Married ${spouseName}`);
        return true;
    }

    // Have child
    haveChild() {
        if (!this.family.some(member => member.relation === 'spouse')) {
            this.addNotification("You need to be married first!", 'warning');
            return false;
        }
        
        if (!this.canAfford(10000)) {
            this.addNotification("You need $10,000 for child expenses!", 'danger');
            return false;
        }
        
        this.addMoney(-10000);
        const childName = GameData.familyNames[Math.floor(Math.random() * GameData.familyNames.length)];
        
        this.family.push({
            name: childName,
            relation: 'child',
            age: 0
        });
        
        this.updateStat('happiness', 20);
        this.addNotification(`Had a child named ${childName}!`, 'success');
        this.addLog(`New child: ${childName}`);
        return true;
    }

    // Add notification
    addNotification(message, type = 'info') {
        this.notifications.unshift({
            id: Date.now() + Math.random(),
            message,
            type,
            time: new Date().toISOString()
        });
        
        // Keep only last 10 notifications
        if (this.notifications.length > 10) {
            this.notifications.pop();
        }
    }

    // Add to game log
    addLog(message) {
        this.gameLog.unshift({
            id: Date.now() + Math.random(),
            message,
            time: new Date().toLocaleTimeString()
        });
        
        // Keep only last 20 log entries
        if (this.gameLog.length > 20) {
            this.gameLog.pop();
        }
    }

    // Save game state to localStorage
    save() {
        const saveData = {
            stats: this.stats,
            inventory: this.inventory,
            vehicles: this.vehicles,
            properties: this.properties,
            businesses: this.businesses,
            family: this.family,
            relationships: this.relationships,
            stockPortfolio: this.stockPortfolio,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('lifeAdventureSave', JSON.stringify(saveData));
        this.addNotification('Game saved successfully!', 'success');
    }

    // Load game state from localStorage
    load() {
        const saveData = localStorage.getItem('lifeAdventureSave');
        if (saveData) {
            try {
                const loaded = JSON.parse(saveData);
                Object.assign(this.stats, loaded.stats);
                this.inventory = loaded.inventory || [];
                this.vehicles = loaded.vehicles || [];
                this.properties = loaded.properties || [];
                this.businesses = loaded.businesses || [];
                this.family = loaded.family || [];
                this.relationships = loaded.relationships || [];
                this.stockPortfolio = loaded.stockPortfolio || {};
                
                this.addNotification('Game loaded successfully!', 'success');
                return true;
            } catch (error) {
                console.error('Failed to load save:', error);
                this.addNotification('Failed to load save game', 'danger');
            }
        }
        return false;
    }

    // Reset game
    reset() {
        if (confirm('Are you sure you want to reset? All progress will be lost!')) {
            localStorage.removeItem('lifeAdventureSave');
            window.location.reload();
        }
    }
}

// Create global game state instance
const gameState = new GameState();
export default gameState;
