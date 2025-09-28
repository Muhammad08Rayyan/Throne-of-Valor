// Game initialization with responsive canvas sizing
function getCanvasConfig() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Support for common resolutions
    if (screenWidth >= 1920 && screenHeight >= 1080) {
        return { width: 1920, height: 1080 };
    } else if (screenWidth >= 1600 && screenHeight >= 1000) {
        return { width: 1600, height: 1000 };
    } else if (screenWidth >= 1280 && screenHeight >= 720) {
        return { width: 1280, height: 720 };
    } else {
        return { width: 1280, height: 720 }; // Fallback
    }
}

const canvasConfig = getCanvasConfig();

const config = {
    type: Phaser.AUTO,
    width: canvasConfig.width,
    height: canvasConfig.height,
    parent: 'game-container',
    backgroundColor: '#0f172a',
    scene: [
        MainMenuScene,
        TournamentBracketScene,
        InstructionsScene,
        CharacterSelectionScene,
        BattleScene,
        TournamentResultsScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 1280,
            height: 720
        },
        max: {
            width: 1920,
            height: 1080
        }
    }
};

// Tournament data
const tournamentData = {
    playerCount: 0,
    players: [],
    bracket: [],
    currentRound: 1,
    currentMatch: 0
};

// Hide loading overlay
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Start game when page loads
window.onload = () => {
    try {
        // Check if all scene classes are loaded
        if (typeof MainMenuScene === 'undefined') {
            console.error('Scene classes not loaded yet');
            setTimeout(() => window.onload(), 100);
            return;
        }

        const game = new Phaser.Game(config);
        game.registry.set('tournamentData', tournamentData);

        // Hide loading overlay when game is ready
        game.events.once('ready', () => {
            hideLoadingOverlay();
            // Audio initialization is now handled automatically by AudioManager
        });

    } catch (error) {
        console.error('Game failed to start:', error);
        hideLoadingOverlay();
    }
};