// ============================================
// PREMIUM LIFE ADVENTURE SIMULATOR
// Main Entry Point
// ============================================

import { Game } from './game.js';

class PremiumGame {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Premium Life Adventure Simulator Initializing...');
        
        // Initialize audio system
        this.setupAudio();
        
        // Setup controls
        this.setupControls();
        
        // Show loading screen
        this.showLoadingScreen();
        
        // Load game
        await this.loadGame();
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Start game loop
        this.startPremiumFeatures();
        
        console.log('✅ Game initialized successfully!');
    }

    setupAudio() {
        // Create Audio Context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        // Audio elements
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.soundsEnabled = true;
        this.musicEnabled = true;
        
        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    setupControls() {
        // Music toggle
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusic();
        });
        
        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.toggleSounds();
        });
        
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveGame();
        });
        
        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.loadGame();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        loadingScreen.style.display = 'flex';
        mainContainer.style.display = 'none';
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const mainContainer = document.getElementById('mainContainer');
            
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContainer.style.display = 'block';
                
                // Show welcome message
                this.showWelcomeMessage();
                
                // Start background music
                if (this.musicEnabled && this.backgroundMusic) {
                    this.backgroundMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
                }
            }, 500);
        }, 1500); // Simulate loading time
    }

    async loadGame() {
        // Initialize main game
        this.game = new Game();
        
        // Check for saved game
        const hasSave = localStorage.getItem('lifeAdventureSave');
        if (hasSave) {
            // Auto-load saved game
            this.game.gameState.load();
            this.game.updateUI();
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const icon = document.querySelector('#musicToggle i');
        
        if (this.musicEnabled) {
            icon.className = 'fas fa-volume-up';
            this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        } else {
            icon.className = 'fas fa-volume-mute';
            this.backgroundMusic.pause();
        }
    }

    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
        const icon = document.querySelector('#soundToggle i');
        
        if (this.soundsEnabled) {
            icon.className = 'fas fa-bell';
        } else {
            icon.className = 'fas fa-bell-slash';
        }
    }

    saveGame() {
        if (this.game && this.game.gameState) {
            this.game.gameState.save();
            this.playSound('success');
            this.showNotification('Game saved successfully!', 'success');
        }
    }

    async loadGame() {
        if (this.game && this.game.gameState) {
            const loaded = this.game.gameState.load();
            if (loaded) {
                this.game.updateUI();
                this.playSound('success');
                this.showNotification('Game loaded successfully!', 'success');
            }
        }
    }

    resetGame() {
        if (confirm('⚠️ Are you sure you want to reset the game?\nAll progress will be lost!')) {
            localStorage.removeItem('lifeAdventureSave');
            this.playSound('error');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    playSound(soundName) {
        if (!this.soundsEnabled) return;
        
        // Create simple sound effects
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        let frequency = 800;
        let duration = 0.1;
        
        switch(soundName) {
            case 'click':
                frequency = 1000;
                duration = 0.05;
                break;
            case 'success':
                frequency = 1200;
                duration = 0.2;
                break;
            case 'error':
                frequency = 400;
                duration = 0.3;
                break;
            case 'money':
                frequency = 1500;
                duration = 0.15;
                break;
        }
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveGame();
        }
        
        // Ctrl/Cmd + L: Load
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            this.loadGame();
        }
        
        // F1: Help
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }
        
        // 1-6: Switch tabs
        if (e.key >= '1' && e.key <= '6') {
            const tabIndex = parseInt(e.key) - 1;
            const tabs = ['home', 'city', 'business', 'relationships', 'bank', 'crime'];
            if (tabs[tabIndex]) {
                this.game.switchTab(tabs[tabIndex]);
            }
        }
    }

    showWelcomeMessage() {
        const messages = [
            "Welcome to Life Adventure Simulator Premium! 🎮",
            "Build your virtual life from scratch! 🏠",
            "Make money, start businesses, build relationships! 💼",
            "Take risks, but be careful of consequences! ⚠️",
            "Your life, your choices, your adventure! 🌟"
        ];
        
        let index = 0;
        const showNextMessage = () => {
            if (index < messages.length) {
                this.showNotification(messages[index], 'info');
                index++;
                setTimeout(showNextMessage, 3000);
            }
        };
        
        showNextMessage();
    }

    showNotification(message, type = 'info') {
        if (this.game && this.game.gameState) {
            this.game.gameState.addNotification(message, type);
            this.game.updateUI();
        }
    }

    showHelp() {
        alert(`
🎮 LIFE ADVENTURE SIMULATOR PREMIUM 🎮

📌 QUICK START:
1. Start with a job (Work button)
2. Study to increase intelligence
3. Save money in the bank
4. Invest in businesses
5. Build relationships
6. Buy properties and vehicles

🎯 KEYBOARD SHORTCUTS:
Ctrl/Cmd + S  → Save Game
Ctrl/Cmd + L  → Load Game
F1            → This Help Screen
1-6           → Switch tabs

💰 TIPS:
• Keep happiness above 50
• Maintain health and energy
• Diversify your income
• Build a family for happiness
• Save before taking big risks

⚠️ WARNING:
• Crime has consequences
• Gambling is risky
• Loans need to be repaid
• Jail time stops all activities

Enjoy your life adventure! 🚀
        `);
    }

    startPremiumFeatures() {
        // Daily bonus
        setInterval(() => {
            this.checkDailyBonus();
        }, 60000); // Check every minute
        
        // Auto-save
        setInterval(() => {
            this.saveGame();
        }, 300000); // Auto-save every 5 minutes
        
        // Update game time
        setInterval(() => {
            this.updateGameTime();
        }, 60000); // Update time every minute
    }

    checkDailyBonus() {
        const lastBonus = localStorage.getItem('lastDailyBonus');
        const now = new Date();
        const today = now.toDateString();
        
        if (!lastBonus || lastBonus !== today) {
            // Give daily bonus
            if (this.game && this.game.gameState) {
                const bonus = Math.floor(Math.random() * 500) + 100;
                this.game.gameState.addMoney(bonus);
                this.game.gameState.addNotification(`🎁 Daily Bonus: $${bonus}!`, 'success');
                this.game.updateUI();
                localStorage.setItem('lastDailyBonus', today);
            }
        }
    }

    updateGameTime() {
        const gameTimeElement = document.getElementById('gameTime');
        if (gameTimeElement && this.game && this.game.gameState) {
            const age = Math.floor(this.game.gameState.stats.age);
            const days = Math.floor((this.game.gameState.stats.age - age) * 365);
            gameTimeElement.textContent = `Age ${age}, Day ${days}`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.premiumGame = new PremiumGame();
});

// Make game accessible globally
window.Game = Game;

// Export for module support
export { PremiumGame };
