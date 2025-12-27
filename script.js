// Main script - Entry point for the game
import { Game } from './game.js';

// Initialize game when window loads
window.addEventListener('load', () => {
    console.log('Life Adventure Simulator loaded!');
    
    // Check for saved game
    const hasSave = localStorage.getItem('lifeAdventureSave');
    if (hasSave && confirm('Load saved game?')) {
        // Game will auto-load via Game class
    }
    
    // Add keyboard shortcuts info
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            alert(`
Keyboard Shortcuts:
Ctrl+S - Save Game
Ctrl+L - Load Game
F1 - Show this help

Game Tips:
1. Start with a job to earn money
2. Study to increase intelligence
3. Invest in businesses for passive income
4. Maintain happiness and health
5. Avoid crime unless you're prepared for consequences!
            `);
        }
    });
    
    // Add save/load buttons to header
    const header = document.querySelector('.header');
    const saveLoadDiv = document.createElement('div');
    saveLoadDiv.className = 'save-load-buttons';
    saveLoadDiv.innerHTML = `
        <button class="action-btn" id="save-btn" style="padding: 5px 10px; font-size: 0.8rem;">
            <i class="fas fa-save"></i> Save
        </button>
        <button class="action-btn" id="load-btn" style="padding: 5px 10px; font-size: 0.8rem;">
            <i class="fas fa-folder-open"></i> Load
        </button>
        <button class="action-btn" id="reset-btn" style="padding: 5px 10px; font-size: 0.8rem; background: #ff3300;">
            <i class="fas fa-redo"></i> Reset
        </button>
    `;
    header.appendChild(saveLoadDiv);
    
    // Add button event listeners
    document.getElementById('save-btn').addEventListener('click', () => {
        if (window.game && window.game.gameState) {
            window.game.gameState.save();
        }
    });
    
    document.getElementById('load-btn').addEventListener('click', () => {
        if (window.game && window.game.gameState) {
            window.game.gameState.load();
            window.game.updateUI();
        }
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (window.game && window.game.gameState) {
            window.game.gameState.reset();
        }
    });
    
    // Add game version info
    const versionInfo = document.createElement('div');
    versionInfo.className = 'version-info';
    versionInfo.innerHTML = 'v1.0.0 | Life Adventure Simulator';
    versionInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 0.8rem;
        color: #aaa;
        z-index: 1000;
    `;
    document.body.appendChild(versionInfo);
    
    // Add help tooltips
    const tooltips = {
        'money': 'Your available cash. Spend wisely!',
        'health': 'Your physical health. Keep it above 0.',
        'intelligence': 'Affects job opportunities and success rates.',
        'reputation': 'How others perceive you. Affects relationships.',
        'happiness': 'Overall life satisfaction.',
        'energy': 'Required for most actions.'
    };
    
    // Add tooltip listeners
    Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.parentElement.title = text;
        }
    });
    
    // Initialize audio context for future sound effects
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (window.AudioContext) {
        window.audioContext = new AudioContext();
    }
    
    // Add click sound effect
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            // Play subtle click sound (optional)
            try {
                const oscillator = window.audioContext.createOscillator();
                const gainNode = window.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(window.audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(window.audioContext.currentTime + 0.1);
            } catch (error) {
                // Audio not essential, fail silently
            }
        }
    });
    
    // Add responsive behavior
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    });
    
    // Trigger initial resize check
    window.dispatchEvent(new Event('resize'));
    
    // Add welcome message
    setTimeout(() => {
        if (window.game && window.game.gameState) {
            window.game.gameState.addNotification('Welcome to Life Adventure Simulator!', 'success');
            window.game.gameState.addNotification('Start by getting a job or studying!', 'info');
            window.game.updateUI();
        }
    }, 1000);
});
