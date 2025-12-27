import GameData from './data.js';
import gameState from './game-state.js';

// DOM Elements
let elements = {};

// Initialize game
class Game {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadGame();
        this.updateUI();
        this.startGameLoop();
    }

    // Cache DOM elements
    initializeElements() {
        elements = {
            // Stats
            money: document.getElementById('money'),
            health: document.getElementById('health'),
            intelligence: document.getElementById('intelligence'),
            reputation: document.getElementById('reputation'),
            age: document.getElementById('age'),
            happiness: document.getElementById('happiness'),
            energy: document.getElementById('energy'),
            happinessBar: document.getElementById('happiness-bar'),
            energyBar: document.getElementById('energy-bar'),
            
            // Tabs
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Lists
            inventory: document.getElementById('inventory'),
            familyMembers: document.getElementById('family-members'),
            businesses: document.getElementById('businesses'),
            relationships: document.getElementById('relationships'),
            notifications: document.getElementById('notifications'),
            vehicles: document.getElementById('vehicles'),
            properties: document.getElementById('properties'),
            gameLog: document.getElementById('game-log'),
            
            // Bank
            cashAmount: document.getElementById('cash-amount'),
            bankBalance: document.getElementById('bank-balance'),
            loanAmount: document.getElementById('loan-amount'),
            bankAmount: document.getElementById('bank-amount'),
            
            // Modals
            modals: document.querySelectorAll('.modal'),
            carModal: document.getElementById('car-modal'),
            propertyModal: document.getElementById('property-modal'),
            eventModal: document.getElementById('event-modal')
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });

        // City locations
        document.querySelectorAll('.city-location').forEach(location => {
            location.addEventListener('click', () => this.handleCityLocation(location.dataset.location));
        });

        // Crime buttons
        document.querySelectorAll('.crime-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const crimeOption = e.target.closest('.crime-option');
                if (crimeOption) {
                    this.handleCrime(crimeOption.dataset.crime);
                }
            });
        });

        // Bank buttons
        document.querySelectorAll('.bank-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleBankAction(btn.dataset.action));
        });

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Save/Load buttons
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                gameState.save();
            }
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                gameState.load();
                this.updateUI();
            }
        });

        // Auto-save every minute
        setInterval(() => {
            gameState.save();
        }, 60000);
    }

    // Load game from localStorage
    loadGame() {
        gameState.load();
    }

    // Update all UI elements
    updateUI() {
        this.updateStats();
        this.updateInventory();
        this.updateFamily();
        this.updateBusinesses();
        this.updateRelationships();
        this.updateNotifications();
        this.updateVehicles();
        this.updateProperties();
        this.updateBank();
        this.updateGameLog();
        this.updateProgressBars();
    }

    // Update stats display
    updateStats() {
        const stats = gameState.stats;
        
        elements.money.textContent = `$${stats.money.toLocaleString()}`;
        elements.health.textContent = stats.health;
        elements.intelligence.textContent = stats.intelligence;
        elements.reputation.textContent = stats.reputation;
        elements.age.textContent = stats.age;
        elements.happiness.textContent = stats.happiness;
        elements.energy.textContent = stats.energy;
        
        elements.cashAmount.textContent = `$${stats.money.toLocaleString()}`;
        elements.bankBalance.textContent = `$${stats.bankBalance.toLocaleString()}`;
        elements.loanAmount.textContent = `$${stats.loan.toLocaleString()}`;
    }

    // Update progress bars
    updateProgressBars() {
        const stats = gameState.stats;
        
        elements.happinessBar.style.width = `${stats.happiness}%`;
        elements.energyBar.style.width = `${stats.energy}%`;
    }

    // Update inventory display
    updateInventory() {
        const inventory = gameState.inventory;
        elements.inventory.innerHTML = '';
        
        if (inventory.length === 0) {
            elements.inventory.innerHTML = '<div class="inventory-item">Empty</div>';
            return;
        }
        
        inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <strong>${item.name}</strong>
                <div>$${item.price.toLocaleString()}</div>
            `;
            elements.inventory.appendChild(itemElement);
        });
    }

    // Update family display
    updateFamily() {
        const family = gameState.family;
        elements.familyMembers.innerHTML = '';
        
        if (family.length === 0) {
            elements.familyMembers.innerHTML = '<p>No family members</p>';
            return;
        }
        
        family.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'family-member';
            memberElement.innerHTML = `
                <strong>${member.name}</strong>
                <div>${member.relation}</div>
            `;
            elements.familyMembers.appendChild(memberElement);
        });
    }

    // Update businesses display
    updateBusinesses() {
        const businesses = gameState.businesses;
        elements.businesses.innerHTML = '';
        
        if (businesses.length === 0) {
            elements.businesses.innerHTML = '<p>No businesses</p>';
            return;
        }
        
        businesses.forEach(business => {
            const businessElement = document.createElement('div');
            businessElement.className = 'investment-option';
            businessElement.innerHTML = `
                <h4>${business.name}</h4>
                <p>Income: $${business.income.toLocaleString()}/month</p>
                <p>Risk: ${business.risk}%</p>
            `;
            elements.businesses.appendChild(businessElement);
        });
    }

    // Update relationships display
    updateRelationships() {
        const relationships = gameState.relationships;
        elements.relationships.innerHTML = '';
        
        if (relationships.length === 0) {
            elements.relationships.innerHTML = '<p>No relationships</p>';
            return;
        }
        
        relationships.forEach(rel => {
            const relElement = document.createElement('div');
            relElement.className = 'relationship-item';
            relElement.innerHTML = `
                <strong>${rel.name}</strong>
                <div>Status: ${rel.status}</div>
            `;
            elements.relationships.appendChild(relElement);
        });
    }

    // Update notifications
    updateNotifications() {
        const notifications = gameState.notifications;
        elements.notifications.innerHTML = '';
        
        notifications.forEach(notification => {
            const notifElement = document.createElement('div');
            notifElement.className = `notification ${notification.type}`;
            notifElement.innerHTML = notification.message;
            elements.notifications.appendChild(notifElement);
        });
    }

    // Update vehicles
    updateVehicles() {
        const vehicles = gameState.vehicles;
        elements.vehicles.innerHTML = '';
        
        if (vehicles.length === 0) {
            elements.vehicles.innerHTML = '<p>No vehicles</p>';
            return;
        }
        
        vehicles.forEach(vehicle => {
            const vehicleElement = document.createElement('div');
            vehicleElement.className = 'inventory-item';
            vehicleElement.innerHTML = `
                <strong>${vehicle.name}</strong>
                <div>Speed: ${vehicle.speed}</div>
            `;
            elements.vehicles.appendChild(vehicleElement);
        });
    }

    // Update properties
    updateProperties() {
        const properties = gameState.properties;
        elements.properties.innerHTML = '';
        
        if (properties.length === 0) {
            elements.properties.innerHTML = '<p>No properties</p>';
            return;
        }
        
        properties.forEach(property => {
            const propertyElement = document.createElement('div');
            propertyElement.className = 'inventory-item';
            propertyElement.innerHTML = `
                <strong>${property.name}</strong>
                <div>Comfort: ${property.comfort}</div>
            `;
            elements.properties.appendChild(propertyElement);
        });
    }

    // Update bank info
    updateBank() {
        const stats = gameState.stats;
        elements.bankBalance.textContent = `$${stats.bankBalance.toLocaleString()}`;
        elements.loanAmount.textContent = `$${stats.loan.toLocaleString()}`;
    }

    // Update game log
    updateGameLog() {
        const gameLog = gameState.gameLog;
        elements.gameLog.innerHTML = '';
        
        gameLog.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
                <span class="log-time">${log.time}</span>
                <span class="log-message">${log.message}</span>
            `;
            elements.gameLog.appendChild(logElement);
        });
    }

    // Handle actions
    handleAction(action) {
        switch (action) {
            case 'work':
                gameState.work();
                break;
            case 'study':
                gameState.study();
                break;
            case 'socialize':
                gameState.socialize();
                break;
            case 'rest':
                gameState.rest();
                break;
            case 'gamble':
                gameState.gamble();
                break;
            case 'crime':
                this.switchTab('crime');
                break;
            case 'marry':
                gameState.marry();
                break;
            case 'child':
                gameState.haveChild();
                break;
            case 'buy-car':
                this.openCarModal();
                break;
            case 'buy-property':
                this.openPropertyModal();
                break;
            case 'date':
                this.goOnDate();
                break;
            case 'meet':
                this.meetNewPeople();
                break;
        }
        
        this.updateUI();
    }

    // Handle city locations
    handleCityLocation(location) {
        switch (location) {
            case 'casino':
                gameState.gamble();
                break;
            case 'dealership':
                this.openCarModal();
                break;
            case 'mall':
                this.openMall();
                break;
            case 'gym':
                this.goToGym();
                break;
            case 'college':
                this.goToCollege();
                break;
            case 'nightclub':
                gameState.socialize();
                break;
        }
        
        this.updateUI();
    }

    // Handle crime
    handleCrime(crimeType) {
        const crime = GameData.crimes.find(c => c.id === crimeType);
        if (crime) {
            gameState.commitCrime(crime);
            this.updateUI();
        }
    }

    // Handle bank actions
    handleBankAction(action) {
        const amount = parseInt(elements.bankAmount.value) || 0;
        
        if (amount <= 0) {
            gameState.addNotification('Please enter a valid amount', 'warning');
            return;
        }
        
        switch (action) {
            case 'deposit':
                gameState.deposit(amount);
                break;
            case 'withdraw':
                gameState.withdraw(amount);
                break;
            case 'loan':
                gameState.takeLoan(amount);
                break;
            case 'repay':
                gameState.repayLoan(amount);
                break;
        }
        
        elements.bankAmount.value = '';
        this.updateUI();
    }

    // Open car modal
    openCarModal() {
        const modal = elements.carModal;
        const carsList = modal.querySelector('#cars-list');
        
        carsList.innerHTML = '';
        GameData.cars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.className = 'car-item';
            carElement.innerHTML = `
                <h4>${car.image} ${car.name}</h4>
                <p>Price: $${car.price.toLocaleString()}</p>
                <p>Speed: ${car.speed} | Comfort: ${car.comfort}</p>
                <button class="buy-btn" data-id="${car.id}">Buy</button>
            `;
            
            carElement.querySelector('.buy-btn').addEventListener('click', () => {
                gameState.buyVehicle(car);
                this.updateUI();
            });
            
            carsList.appendChild(carElement);
        });
        
        modal.classList.add('active');
    }

    // Open property modal
    openPropertyModal() {
        const modal = elements.propertyModal;
        const propertiesList = modal.querySelector('#properties-list');
        
        propertiesList.innerHTML = '';
        GameData.properties.forEach(property => {
            const propertyElement = document.createElement('div');
            propertyElement.className = 'property-item';
            propertyElement.innerHTML = `
                <h4>${property.image} ${property.name}</h4>
                <p>Price: $${property.price.toLocaleString()}</p>
                <p>Rent: $${property.rent.toLocaleString()}/month</p>
                <p>Comfort: ${property.comfort}</p>
                <button class="buy-btn" data-id="${property.id}">Buy</button>
            `;
            
            propertyElement.querySelector('.buy-btn').addEventListener('click', () => {
                gameState.buyProperty(property);
                this.updateUI();
            });
            
            propertiesList.appendChild(propertyElement);
        });
        
        modal.classList.add('active');
    }

    // Go on date
    goOnDate() {
        if (!gameState.canAfford(500)) {
            gameState.addNotification("You need $500 for a date!", 'warning');
            return;
        }
        
        gameState.addMoney(-500);
        const success = Math.random() > 0.3;
        
        if (success) {
            const name = GameData.familyNames[Math.floor(Math.random() * GameData.familyNames.length)];
            gameState.relationships.push({
                name: name,
                status: 'dating',
                happiness: 50
            });
            gameState.addNotification(`Great date with ${name}!`, 'success');
            gameState.addLog(`Date with ${name}`);
        } else {
            gameState.addNotification('The date didn\'t go well...', 'danger');
            gameState.addLog('Bad date');
        }
        
        this.updateUI();
    }

    // Meet new people
    meetNewPeople() {
        const name = GameData.familyNames[Math.floor(Math.random() * GameData.familyNames.length)];
        gameState.relationships.push({
            name: name,
            status: 'friend',
            happiness: 30
        });
        
        gameState.addNotification(`Met ${name}!`, 'success');
        gameState.addLog(`Met ${name}`);
        this.updateUI();
    }

    // Go to gym
    goToGym() {
        if (!gameState.canAfford(100)) {
            gameState.addNotification("You need $100 for gym membership!", 'warning');
            return;
        }
        
        gameState.addMoney(-100);
        const healthGain = Math.floor(Math.random() * 10) + 5;
        gameState.updateStat('health', healthGain);
        gameState.updateStat('energy', -15);
        
        gameState.addNotification(`Worked out at gym! Health +${healthGain}`, 'success');
        gameState.addLog(`Gym: +${healthGain} health`);
        this.updateUI();
    }

    // Go to college
    goToCollege() {
        const education = GameData.education.find(e => e.id === 'college');
        if (!gameState.canAfford(education.cost)) {
            gameState.addNotification(`You need $${education.cost.toLocaleString()} for college!`, 'warning');
            return;
        }
        
        gameState.addMoney(-education.cost);
        gameState.updateStat('intelligence', education.intelligenceGain);
        gameState.stats.education = 'college';
        
        gameState.addNotification(`Graduated from college! Intelligence +${education.intelligenceGain}`, 'success');
        gameState.addLog(`College graduation`);
        this.updateUI();
    }

    // Open mall
    openMall() {
        // Show item purchase options
        const randomItem = GameData.items[Math.floor(Math.random() * GameData.items.length)];
        
        if (confirm(`Would you like to buy ${randomItem.name} for $${randomItem.price}?`)) {
            if (!gameState.canAfford(randomItem.price)) {
                gameState.addNotification("Not enough money!", 'danger');
                return;
            }
            
            gameState.addMoney(-randomItem.price);
            gameState.addItem(randomItem);
            gameState.addNotification(`Bought ${randomItem.name}!`, 'success');
            this.updateUI();
        }
    }

    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab contents
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
        
        // Update mobile nav
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
    }

    // Close all modals
    closeModals() {
        elements.modals.forEach(modal => modal.classList.remove('active'));
    }

    // Game loop for periodic updates
    startGameLoop() {
        setInterval(() => {
            // Age progression
            gameState.stats.age += 0.1;
            elements.age.textContent = Math.floor(gameState.stats.age);
            
            // Natural stat changes
            if (Math.random() > 0.7) {
                gameState.updateStat('energy', 1);
            }
            if (Math.random() > 0.8) {
                gameState.updateStat('happiness', -1);
            }
            
            // Business income
            gameState.businesses.forEach(business => {
                if (Math.random() > business.risk / 100) {
                    gameState.addMoney(business.income);
                    gameState.addLog(`${business.name}: +$${business.income}`);
                }
            });
            
            // Property rent
            gameState.properties.forEach(property => {
                if (property.rented) {
                    gameState.addMoney(property.rent);
                }
            });
            
            // Jail time reduction
            if (gameState.stats.jailTime > 0) {
                gameState.stats.jailTime--;
                if (gameState.stats.jailTime === 0) {
                    gameState.addNotification('You are free from jail!', 'success');
                }
            }
            
            // Random events
            if (Math.random() > 0.95) {
                this.triggerRandomEvent();
            }
            
            this.updateUI();
        }, 10000); // Update every 10 seconds
    }

    // Trigger random event
    triggerRandomEvent() {
        const event = GameData.events[Math.floor(Math.random() * GameData.events.length)];
        const modal = elements.eventModal;
        
        modal.querySelector('#event-title').textContent = event.title;
        modal.querySelector('#event-description').textContent = event.description;
        
        const choicesContainer = modal.querySelector('#event-choices');
        choicesContainer.innerHTML = '';
        
        event.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                // Apply effects
                Object.entries(choice.effect).forEach(([stat, value]) => {
                    if (stat === 'money') {
                        gameState.addMoney(value);
                    } else {
                        gameState.updateStat(stat, value);
                    }
                });
                
                this.closeModals();
                this.updateUI();
                
                if (choice.nextEvent) {
                    // Trigger next event if exists
                    setTimeout(() => this.triggerRandomEvent(), 1000);
                }
            });
            
            choicesContainer.appendChild(button);
        });
        
        modal.classList.add('active');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

// Export for debugging
export { Game, gameState };
