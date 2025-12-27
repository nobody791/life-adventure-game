// ============================================
// LIFEVERSE PRO - PREMIUM GAME ENGINE
// ============================================

class LifeVersePro {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🎮 LifeVerse Pro Initializing...');
        
        // Initialize game state
        this.gameState = window.gameState || {};
        
        // Setup UI
        this.setupUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game systems
        this.startGameSystems();
        
        // Show welcome
        this.showWelcome();
        
        console.log('✅ LifeVerse Pro Ready!');
    }

    setupUI() {
        // Initialize tooltips
        this.initTooltips();
        
        // Update initial UI
        this.updateUI();
        
        // Setup particles
        this.setupParticles();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.currentTarget.dataset.tab);
            });
        });
        
        // Mobile nav
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.currentTarget.dataset.tab);
            });
        });
        
        // Action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });
        
        // Control buttons
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveGame());
        document.getElementById('claimBonus').addEventListener('click', () => this.claimDailyBonus());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startGameSystems() {
        // Game loop
        this.gameLoop = setInterval(() => {
            this.updateGameTime();
            this.updateUI();
        }, 1000);
        
        // Auto-save every 5 minutes
        setInterval(() => {
            this.saveGame();
            this.showToast('Game auto-saved', 'success');
        }, 300000);
        
        // Daily bonus timer
        this.startBonusTimer();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
        
        // Update mobile nav
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Play click sound
        this.playSound('click');
    }

    handleAction(action) {
        this.playSound('click');
        
        switch(action) {
            case 'work':
                this.doWork();
                break;
            case 'study':
                this.doStudy();
                break;
            case 'socialize':
                this.doSocialize();
                break;
            case 'rest':
                this.doRest();
                break;
            case 'gamble':
                this.openCasino();
                break;
            case 'bank':
                this.openBank();
                break;
            case 'mall':
                this.openMall();
                break;
            case 'gym':
                this.goToGym();
                break;
            case 'date':
                this.goOnDate();
                break;
            case 'marry':
                this.getMarried();
                break;
        }
    }

    doWork() {
        if (!this.checkEnergy(20)) return;
        
        const earnings = Math.floor(Math.random() * 1000) + 500;
        this.addMoney(earnings);
        this.updateStat('energy', -20);
        this.addActivity(`Worked and earned $${earnings}`);
        this.showToast(`+$${earnings} from work`, 'success');
    }

    doStudy() {
        if (!this.checkEnergy(15)) return;
        
        const intelGain = Math.floor(Math.random() * 10) + 5;
        this.updateStat('intelligence', intelGain);
        this.updateStat('energy', -15);
        this.addActivity(`Studied and gained ${intelGain} IQ`);
        this.showToast(`+${intelGain} Intelligence`, 'info');
    }

    doSocialize() {
        if (!this.checkEnergy(10)) return;
        
        const happinessGain = Math.floor(Math.random() * 20) + 5;
        this.updateStat('happiness', happinessGain);
        this.updateStat('energy', -10);
        this.addActivity(`Socialized and improved mood`);
        this.showToast(`+${happinessGain} Happiness`, 'success');
    }

    doRest() {
        const energyGain = Math.floor(Math.random() * 30) + 20;
        this.updateStat('energy', energyGain);
        this.addActivity(`Rested and recovered energy`);
        this.showToast(`+${energyGain} Energy`, 'info');
    }

    openCasino() {
        const modal = this.createModal('Golden Casino', `
            <div class="casino-game">
                <div class="game-header">
                    <h4>High Stakes Gambling</h4>
                    <p>Risk: High | Reward: 2x</p>
                </div>
                <div class="game-controls">
                    <div class="bet-amount">
                        <label>Bet Amount:</label>
                        <input type="range" min="100" max="10000" value="1000" id="betSlider">
                        <span id="betAmount">$1,000</span>
                    </div>
                    <button class="btn-primary" id="placeBet">Place Bet</button>
                </div>
                <div class="game-result" id="gameResult"></div>
            </div>
        `);
        
        modal.querySelector('#betSlider').addEventListener('input', (e) => {
            modal.querySelector('#betAmount').textContent = `$${parseInt(e.target.value).toLocaleString()}`;
        });
        
        modal.querySelector('#placeBet').addEventListener('click', () => {
            const bet = parseInt(modal.querySelector('#betSlider').value);
            this.playGamble(bet);
        });
        
        this.showModal(modal);
    }

    playGamble(bet) {
        if (!this.checkMoney(bet)) return;
        
        const win = Math.random() > 0.55;
        this.addMoney(-bet);
        
        if (win) {
            const winAmount = bet * 2;
            this.addMoney(winAmount);
            this.showToast(`🎉 Won $${winAmount}!`, 'success');
            this.addActivity(`Won $${winAmount} gambling`);
            this.confetti();
        } else {
            this.showToast(`Lost $${bet}`, 'error');
            this.addActivity(`Lost $${bet} gambling`);
        }
        
        this.closeModal();
    }

    openBank() {
        const modal = this.createModal('Banking Center', `
            <div class="bank-interface">
                <div class="bank-balance">
                    <h4>Account Overview</h4>
                    <div class="balance-card">
                        <i class="fas fa-wallet"></i>
                        <div class="balance-info">
                            <span>Cash</span>
                            <span class="balance-amount">$${this.getStat('money').toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="balance-card">
                        <i class="fas fa-university"></i>
                        <div class="balance-info">
                            <span>Bank Balance</span>
                            <span class="balance-amount" id="bankTotal">$${(this.gameState.bank || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bank-actions">
                    <div class="action-group">
                        <h5>Deposit</h5>
                        <input type="number" id="depositAmount" placeholder="Amount" min="1">
                        <button class="btn-outline" id="depositBtn">Deposit</button>
                    </div>
                    
                    <div class="action-group">
                        <h5>Withdraw</h5>
                        <input type="number" id="withdrawAmount" placeholder="Amount" min="1">
                        <button class="btn-outline" id="withdrawBtn">Withdraw</button>
                    </div>
                </div>
                
                <div class="loans-section">
                    <h5>Loans</h5>
                    <div class="loan-options">
                        <button class="loan-option" data-amount="10000">
                            <span>Quick Loan</span>
                            <span>$10,000</span>
                        </button>
                        <button class="loan-option" data-amount="50000">
                            <span>Business Loan</span>
                            <span>$50,000</span>
                        </button>
                        <button class="loan-option" data-amount="100000">
                            <span>Premium Loan</span>
                            <span>$100,000</span>
                        </button>
                    </div>
                </div>
            </div>
        `);
        
        // Add bank functionality
        modal.querySelector('#depositBtn').addEventListener('click', () => {
            const amount = parseInt(modal.querySelector('#depositAmount').value) || 0;
            if (amount > 0) this.depositToBank(amount);
        });
        
        modal.querySelector('#withdrawBtn').addEventListener('click', () => {
            const amount = parseInt(modal.querySelector('#withdrawAmount').value) || 0;
            if (amount > 0) this.withdrawFromBank(amount);
        });
        
        modal.querySelectorAll('.loan-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                this.takeLoan(amount);
            });
        });
        
        this.showModal(modal);
    }

    depositToBank(amount) {
        if (!this.checkMoney(amount)) return;
        
        this.addMoney(-amount);
        this.gameState.bank = (this.gameState.bank || 0) + amount;
        this.showToast(`Deposited $${amount}`, 'success');
        this.addActivity(`Deposited $${amount} to bank`);
        this.closeModal();
    }

    withdrawFromBank(amount) {
        if ((this.gameState.bank || 0) < amount) {
            this.showToast('Insufficient bank balance', 'error');
            return;
        }
        
        this.gameState.bank -= amount;
        this.addMoney(amount);
        this.showToast(`Withdrew $${amount}`, 'success');
        this.addActivity(`Withdrew $${amount} from bank`);
        this.closeModal();
    }

    takeLoan(amount) {
        this.gameState.loans = this.gameState.loans || [];
        this.gameState.loans.push({
            amount: amount,
            interest: 0.1,
            taken: Date.now()
        });
        
        this.addMoney(amount);
        this.showToast(`Loan of $${amount} approved`, 'info');
        this.addActivity(`Took $${amount} loan`);
        this.closeModal();
    }

    openMall() {
        const items = [
            { name: 'Smartphone', price: 1000, icon: 'fa-mobile' },
            { name: 'Laptop', price: 1500, icon: 'fa-laptop' },
            { name: 'Watch', price: 5000, icon: 'fa-clock' },
            { name: 'Jewelry', price: 10000, icon: 'fa-gem' },
            { name: 'Car', price: 50000, icon: 'fa-car' },
            { name: 'House', price: 200000, icon: 'fa-house' }
        ];
        
        const itemsHTML = items.map(item => `
            <div class="shop-item" data-price="${item.price}">
                <i class="fas ${item.icon}"></i>
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price.toLocaleString()}</span>
                </div>
                <button class="btn-outline buy-btn">Buy</button>
            </div>
        `).join('');
        
        const modal = this.createModal('Grand Mall', `
            <div class="mall-interface">
                <div class="shop-items">
                    ${itemsHTML}
                </div>
            </div>
        `);
        
        modal.querySelectorAll('.buy-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const item = items[index];
                this.buyItem(item);
            });
        });
        
        this.showModal(modal);
    }

    buyItem(item) {
        if (!this.checkMoney(item.price)) return;
        
        this.addMoney(-item.price);
        this.gameState.inventory = this.gameState.inventory || [];
        this.gameState.inventory.push(item);
        this.showToast(`Purchased ${item.name}`, 'success');
        this.addActivity(`Bought ${item.name} for $${item.price}`);
        this.closeModal();
    }

    goToGym() {
        if (!this.checkMoney(100)) return;
        
        this.addMoney(-100);
        const healthGain = Math.floor(Math.random() * 15) + 10;
        this.updateStat('health', healthGain);
        this.updateStat('energy', -20);
        this.showToast(`+${healthGain} Health from gym`, 'success');
        this.addActivity('Worked out at gym');
    }

    goOnDate() {
        if (!this.checkMoney(500)) return;
        
        this.addMoney(-500);
        const success = Math.random() > 0.4;
        
        if (success) {
            this.updateStat('happiness', 25);
            this.showToast('Great date!', 'success');
            this.addActivity('Went on a successful date');
        } else {
            this.updateStat('happiness', -10);
            this.showToast('Bad date...', 'error');
            this.addActivity('Had an awkward date');
        }
    }

    getMarried() {
        if (!this.checkMoney(20000)) return;
        
        this.addMoney(-20000);
        this.gameState.family = this.gameState.family || [];
        const spouseName = ['Emma', 'Liam', 'Olivia', 'Noah'][Math.floor(Math.random() * 4)];
        
        this.gameState.family.push({
            name: spouseName,
            relation: 'spouse'
        });
        
        this.updateStat('happiness', 50);
        this.showToast(`Married ${spouseName}!`, 'success');
        this.addActivity(`Married ${spouseName}`);
        this.confetti();
    }

    checkEnergy(amount) {
        if (this.getStat('energy') < amount) {
            this.showToast('Not enough energy', 'error');
            return false;
        }
        return true;
    }

    checkMoney(amount) {
        if (this.getStat('money') < amount) {
            this.showToast('Not enough money', 'error');
            return false;
        }
        return true;
    }

    addMoney(amount) {
        this.gameState.money = (this.gameState.money || 10000) + amount;
        this.updateUI();
    }

    updateStat(stat, amount) {
        this.gameState[stat] = (this.gameState[stat] || 100) + amount;
        
        // Clamp values
        if (['health', 'energy', 'happiness'].includes(stat)) {
            this.gameState[stat] = Math.max(0, Math.min(100, this.gameState[stat]));
        }
        
        this.updateUI();
    }

    getStat(stat) {
        return this.gameState[stat] || 
               (stat === 'money' ? 10000 : 
                stat === 'health' ? 100 : 
                stat === 'intelligence' ? 50 : 
                stat === 'energy' ? 85 : 
                stat === 'happiness' ? 70 : 50);
    }

    updateGameTime() {
        this.gameState.days = (this.gameState.days || 1) + 0.0001;
        
        // Age increases every 365 days
        if (this.gameState.days % 365 < 0.001) {
            this.gameState.age = (this.gameState.age || 18) + 1;
            this.showToast(`Happy Birthday! Now age ${this.gameState.age}`, 'info');
        }
    }

    updateUI() {
        // Update stats
        document.getElementById('money').textContent = `$${this.getStat('money').toLocaleString()}`;
        document.getElementById('health').textContent = this.getStat('health');
        document.getElementById('intelligence').textContent = this.getStat('intelligence');
        document.getElementById('energy').textContent = this.getStat('energy');
        document.getElementById('happiness').textContent = this.getStat('happiness');
        document.getElementById('reputation').textContent = this.getStat('reputation');
        
        // Update age and days
        if (this.gameState.age) {
            document.getElementById('age').textContent = Math.floor(this.gameState.age);
            document.getElementById('days').textContent = Math.floor(this.gameState.days || 1);
        }
        
        // Update net worth
        const networth = this.getStat('money') + (this.gameState.bank || 0);
        document.getElementById('networth').textContent = `$${networth.toLocaleString()}`;
        
        // Update progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const stat = bar.parentElement.parentElement.querySelector('.stat-number').id;
            const value = this.getStat(stat);
            bar.style.width = `${value}%`;
        });
        
        // Update inventory count
        const invCount = (this.gameState.inventory || []).length;
        document.getElementById('inventoryCount').textContent = invCount;
        
        // Update family
        this.updateFamilyUI();
        
        // Update assets
        this.updateAssetsUI();
    }

    updateFamilyUI() {
        const familyList = document.getElementById('familyList');
        const family = this.gameState.family || [];
        
        if (family.length === 0) {
            familyList.innerHTML = `
                <div class="empty-family">
                    <i class="fas fa-user-plus"></i>
                    <p>No family members yet</p>
                </div>
            `;
        } else {
            familyList.innerHTML = family.map(member => `
                <div class="family-member">
                    <i class="fas fa-user"></i>
                    <div class="member-info">
                        <span class="member-name">${member.name}</span>
                        <span class="member-relation">${member.relation}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateAssetsUI() {
        // Property count
        const properties = (this.gameState.properties || []).length;
        document.getElementById('propertyCount').textContent = properties;
        
        // Vehicle count
        const vehicles = (this.gameState.vehicles || []).length;
        document.getElementById('vehicleCount').textContent = vehicles;
        
        // Business count
        const businesses = (this.gameState.businesses || []).length;
        document.getElementById('businessCount').textContent = businesses;
        
        // Bank balance
        const bankBalance = this.gameState.bank || 0;
        document.getElementById('bankBalance').textContent = `$${bankBalance.toLocaleString()}`;
    }

    addActivity(message) {
        const feed = document.getElementById('activityFeed');
        const activity = document.createElement('div');
        activity.className = 'activity-item';
        activity.innerHTML = `
            <i class="fas fa-gamepad"></i>
            <div class="activity-content">
                <p>${message}</p>
                <span class="activity-time">Just now</span>
            </div>
        `;
        feed.insertBefore(activity, feed.firstChild);
        
        // Keep only last 5 activities
        while (feed.children.length > 5) {
            feed.removeChild(feed.lastChild);
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    playSound(type) {
        // Simple sound implementation
        try {
            const audio = document.getElementById(`${type}Sound`);
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        } catch (e) {
            // Sound not critical
        }
    }

    toggleSound() {
        const btn = document.getElementById('soundToggle');
        const icon = btn.querySelector('i');
        const muted = icon.classList.contains('fa-volume-xmark');
        
        if (muted) {
            icon.className = 'fas fa-volume-high';
            this.playSound('click');
        } else {
            icon.className = 'fas fa-volume-xmark';
        }
    }

    saveGame() {
        try {
            localStorage.setItem('lifeverse_save', JSON.stringify(this.gameState));
            this.showToast('Game saved successfully', 'success');
        } catch (e) {
            this.showToast('Save failed', 'error');
        }
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('lifeverse_save');
            if (saved) {
                this.gameState = JSON.parse(saved);
                this.updateUI();
                this.showToast('Game loaded', 'success');
            }
        } catch (e) {
            this.showToast('Load failed', 'error');
        }
    }

    startBonusTimer() {
        const lastBonus = localStorage.getItem('last_bonus');
        const now = Date.now();
        
        if (!lastBonus || (now - parseInt(lastBonus)) > 86400000) {
            document.getElementById('claimBonus').disabled = false;
        } else {
            this.updateBonusTimer(parseInt(lastBonus) + 86400000 - now);
        }
    }

    updateBonusTimer(timeLeft) {
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        document.getElementById('bonusTimer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const progress = ((86400000 - timeLeft) / 86400000) * 175;
        document.querySelector('.timer-progress').style.strokeDashoffset = 175 - progress;
    }

    claimDailyBonus() {
        const bonus = Math.floor(Math.random() * 5000) + 1000;
        this.addMoney(bonus);
        localStorage.setItem('last_bonus', Date.now().toString());
        document.getElementById('claimBonus').disabled = true;
        this.showToast(`🎁 Daily Bonus: $${bonus}!`, 'success');
        this.confetti();
    }

    confetti() {
        try {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (e) {
            // Confetti not critical
        }
    }

    showWelcome() {
        setTimeout(() => {
            this.showToast('Welcome to LifeVerse Pro! 🎮', 'info');
            this.addActivity('Game started. Welcome to LifeVerse!');
        }, 1000);
    }

    setupParticles() {
        // Simple particle system
        const particles = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 20 + 10}s infinite linear;
            `;
            particles.appendChild(particle);
        }
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    initTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[title]').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.title;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
                
                e.target._tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    handleKeyboard(e) {
        // Quick shortcuts
        switch(e.key) {
            case '1': this.switchTab('dashboard'); break;
            case '2': this.switchTab('career'); break;
            case '3': this.switchTab('business'); break;
            case '4': this.switchTab('relationships'); break;
            case '5': this.switchTab('crime'); break;
            case 's': if (e.ctrlKey) this.saveGame(); break;
            case 'l': if (e.ctrlKey) this.loadGame(); break;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new LifeVersePro();
});

// Make available globally
window.LifeVersePro = LifeVersePro;
