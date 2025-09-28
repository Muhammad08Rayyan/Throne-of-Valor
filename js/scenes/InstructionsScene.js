class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionsScene' });
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Dark overlay
        this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.9);

        // Instructions popup with improved styling (sized for 1280x720)
        const popupWidth = 800;
        const popupHeight = 600;
        const popupShadow = this.add.rectangle(centerX + 5, centerY + 5, popupWidth, popupHeight, 0x000000, 0.4);
        const popup = this.add.rectangle(centerX, centerY, popupWidth, popupHeight, 0x1e293b)
            .setStrokeStyle(4, 0x8b5cf6);

        // Popup glow effect
        const glow = this.add.rectangle(centerX, centerY, popupWidth + 20, popupHeight + 20, 0x8b5cf6, 0.1);


        // Instructions text with better spacing
        const instructions = [
            '⚔️ THE THRONE AWAITS ⚔️',
            '',
            '• Warriors gather to claim the ultimate prize',
            '• Only the worthy shall ascend to the Throne of Valor',
            '• Each battle determines the fate of legends',
            '• Your legacy hangs in the balance',
            '',
            '🛡️ CHOOSE YOUR DESTINY 🛡️',
            '• Before each clash, forge your warrior\'s path:',
            '  - PATH OF FURY: Unleash devastating power, risk frailty',
            '  - PATH OF ENDURANCE: Become unbreakable, temper your strike',
            '  - PATH OF BALANCE: Walk the middle road of ancient masters',
            '',
            '👑 CLAIM YOUR BIRTHRIGHT 👑',
            '• Conquer all who stand before you',
            '• Etch your name in the annals of history',
            '• The throne remembers only the victorious!'
        ];

        instructions.forEach((line, index) => {
            const isHeader = line.includes('⚔️') || line.includes('🛡️') || line.includes('👑');
            const fontSize = isHeader ? '22px' : '17px';
            const color = isHeader ? '#fbbf24' : '#e2e8f0';

            this.add.text(centerX, centerY - 240 + (index * 27), line, {
                fontSize: fontSize,
                fill: color,
                fontStyle: isHeader ? 'bold' : 'normal'
            }).setOrigin(0.5);
        });

        // OK button with improved styling
        const buttonShadow = this.add.rectangle(centerX + 3, centerY + 273, 180, 60, 0x000000, 0.3);
        const okButton = this.add.rectangle(centerX, centerY + 270, 180, 60, 0x10b981)
            .setInteractive()
            .setStrokeStyle(3, 0x059669);

        const buttonGlow = this.add.rectangle(centerX, centerY + 270, 190, 70, 0x10b981, 0.2);

        this.add.text(centerX, centerY + 270, 'GOT IT!', {
            fontSize: '22px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        okButton.on('pointerdown', () => {
            // Play click sound
            if (window.audioManager) {
                window.audioManager.playSound('buttonClick');
            }
            this.closeInstructions();
        });
        okButton.on('pointerover', () => {
            // Play hover sound
            if (window.audioManager) {
                window.audioManager.playSound('buttonHover');
            }
            okButton.setFillStyle(0x059669);
            buttonGlow.setAlpha(0.4);
        });
        okButton.on('pointerout', () => {
            okButton.setFillStyle(0x10b981);
            buttonGlow.setAlpha(0.2);
        });
    }

    closeInstructions() {
        this.scene.start('CharacterSelectionScene');
    }
}