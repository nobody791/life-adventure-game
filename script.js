// Add this CSS for modals
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 20px;
        padding: 25px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .modal-content h3 {
        margin-bottom: 15px;
        color: var(--dark-color);
        font-family: 'Montserrat', sans-serif;
    }
    
    .modal-input {
        margin: 20px 0;
    }
    
    .modal-input label {
        display: block;
        margin-bottom: 8px;
        color: var(--gray-color);
        font-size: 14px;
    }
    
    .modal-input input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-size: 16px;
        transition: var(--transition);
    }
    
    .modal-input input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .modal-buttons {
        display: flex;
        gap: 15px;
        margin-top: 25px;
    }
    
    .modal-buttons button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
    }
    
    .modal-cancel {
        background: #f8f9fa;
        color: var(--gray-color);
    }
    
    .modal-confirm {
        background: linear-gradient(135deg, var(--primary-color), #8A84FF);
        color: white;
    }
    
    .store-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 20px 0;
    }
    
    .store-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .store-item i {
        font-size: 24px;
        color: var(--primary-color);
    }
    
    .store-item h4 {
        font-size: 16px;
        margin-bottom: 5px;
    }
    
    .store-item p {
        color: var(--success-color);
        font-weight: 600;
    }
    
    .buy-btn {
        margin-left: auto;
        background: linear-gradient(135deg, var(--primary-color), #8A84FF);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .buy-btn:hover {
        transform: scale(1.05);
    }
    
    .achievement-item.unlocked {
        opacity: 1;
    }
    
    .achievement-item.locked {
        opacity: 0.7;
    }
    
    .achievement-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        background: var(--success-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
    }
`;
document.head.appendChild(modalStyles);

// Save/Reset functionality
const saveResetHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <div style="display: flex; gap: 10px;">
            <button id="save-game" style="background: var(--success-color); color: white; border: none; padding: 10px 15px; border-radius: 20px; cursor: pointer;">
                <i class="fas fa-save"></i> Save
            </button>
            <button id="reset-game" style="background: var(--danger-color); color: white; border: none; padding: 10px 15px; border-radius: 20px; cursor: pointer;">
                <i class="fas fa-redo"></i> Reset
            </button>
        </div>
    </div>
`;

document.body.insertAdjacentHTML('beforeend', saveResetHTML);

document.getElementById('save-game').addEventListener('click', () => {
    gameState.saveToStorage();
    gameState.showNotification('Game saved successfully!', 'success');
});

document.getElementById('reset-game').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        localStorage.removeItem('lifeAdventureGame');
        location.reload();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        gameState.saveToStorage();
        gameState.showNotification('Game saved (Ctrl+S)', 'success');
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
    }
});

// Add vibration feedback for mobile
if ('vibrate' in navigator) {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            navigator.vibrate(50);
        }
    });
}

// PWA installation prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), #8A84FF);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(installBtn);
    
    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                gameState.showNotification('App installed successfully!', 'success');
            }
            deferredPrompt = null;
        });
    });
});

// Online/offline detection
window.addEventListener('online', () => {
    gameState.showNotification('Back online', 'success');
});

window.addEventListener('offline', () => {
    gameState.showNotification('You are offline', 'warning');
});