class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });

        // Player objects
        this.player1 = null;
        this.player2 = null;

        // Combat state
        this.gameEnded = false;
        this.battleTimer = 30;
        this.battleTimerEvent = null;

        // Input handlers
        this.keys1 = null; // WASD + Spacebar
        this.keys2 = null; // Arrow keys + Shift

        // UI elements
        this.healthBar1 = null;
        this.healthBar2 = null;
        this.timerText = null;

        // Arena bounds
        this.arenaLeft = 100;
        this.arenaRight = null;
        this.groundY = null;

        // Attack cooldowns
        this.attackCooldown1 = 0;
        this.attackCooldown2 = 0;
        this.dashCooldown1 = 0;
        this.dashCooldown2 = 0;

        // Double-tap tracking for dash
        this.lastKeyPress1 = { key: null, time: 0 };
        this.lastKeyPress2 = { key: null, time: 0 };
        this.doubleTapWindow = 300; // 300ms window for double tap
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Reset combat state for new battle
        this.gameEnded = false;
        this.battleTimer = 30;
        this.battleTimerEvent = null;
        this.attackCooldown1 = 0;
        this.attackCooldown2 = 0;
        this.dashCooldown1 = 0;
        this.dashCooldown2 = 0;

        // Arena bounds will be set in createArena() based on background image

        // Get current match data
        const currentMatch = this.getCurrentMatch();
        if (!currentMatch) {
            this.scene.start('TournamentBracketScene');
            return;
        }

        // Play battle music
        if (window.audioManager) {
            window.audioManager.stopMusic();
            window.audioManager.playMusic('battleMusic');
        }

        // Create arena background
        this.createArena();

        // Create players based on their stat choices
        this.createPlayer1(currentMatch.player1);
        this.createPlayer2(currentMatch.player2);

        // Create UI
        this.createUI(currentMatch);

        // Setup input
        this.setupInput();

        // Start countdown
        this.startCountdown();
    }


    createArena() {
        // Set arena bounds immediately (CRITICAL - must happen before character creation)
        this.arenaLeft = this.cameras.main.width * 0.1; // 10% from left
        this.arenaRight = this.cameras.main.width * 0.9; // 10% from right
        this.groundY = this.cameras.main.height * 0.75; // 75% down the screen

        // Create an epic medieval ARENA OF VALOR background
        this.createEpicMedievalBackground();



        // Create an epic title banner
        const bannerGraphics = this.add.graphics();
        const titleY = 25;

        // Main title banner background
        bannerGraphics.fillStyle(0x8B0000, 0.9);
        bannerGraphics.fillRoundedRect(this.cameras.main.centerX - 200, titleY - 15, 400, 50, 10);
        bannerGraphics.lineStyle(4, 0xFFD700);
        bannerGraphics.strokeRoundedRect(this.cameras.main.centerX - 200, titleY - 15, 400, 50, 10);

        // Golden decorative corners
        bannerGraphics.fillStyle(0xFFD700);
        bannerGraphics.fillTriangle(
            this.cameras.main.centerX - 195, titleY - 10,
            this.cameras.main.centerX - 185, titleY - 10,
            this.cameras.main.centerX - 190, titleY - 5
        );
        bannerGraphics.fillTriangle(
            this.cameras.main.centerX + 185, titleY - 10,
            this.cameras.main.centerX + 195, titleY - 10,
            this.cameras.main.centerX + 190, titleY - 5
        );

        // Main title with Roman-style lettering
        const title = this.add.text(this.cameras.main.centerX, titleY + 10, '⚔️ ARENA OF VALOR ⚔️', {
            fontSize: '28px',
            fill: '#FFD700',
            fontFamily: 'serif',
            fontStyle: 'bold',
            stroke: '#8B0000',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 8,
                fill: true
            }
        }).setOrigin(0.5);

        // Subtitle banner
        const subtitleBanner = this.add.graphics();
        subtitleBanner.fillStyle(0x8B0000, 0.7);
        subtitleBanner.fillRoundedRect(this.cameras.main.centerX - 150, titleY + 40, 300, 25, 5);
        subtitleBanner.lineStyle(2, 0xB8860B);
        subtitleBanner.strokeRoundedRect(this.cameras.main.centerX - 150, titleY + 40, 300, 25, 5);

        // Latin subtitle
        const subtitle = this.add.text(this.cameras.main.centerX, titleY + 52, 'MORITURI TE SALUTANT', {
            fontSize: '14px',
            fill: '#DAA520',
            fontFamily: 'serif',
            fontStyle: 'italic',
            stroke: '#4A0000',
            strokeThickness: 2
        }).setOrigin(0.5);


        // Floating particles around title
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.gameEnded) {
                    const particle = this.add.circle(
                        this.cameras.main.centerX + Phaser.Math.Between(-180, 180),
                        titleY + Phaser.Math.Between(-10, 60),
                        2,
                        0xFFD700,
                        0.8
                    );

                    this.tweens.add({
                        targets: particle,
                        y: particle.y - 30,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => particle.destroy()
                    });
                }
            },
            repeat: -1
        });
    }


    createPlayer1(playerData) {
        const stats = this.getPlayerStats(playerData.statChoice);

        // Create warrior container
        this.player1 = this.add.container(200, this.groundY - 25);

        // Create warrior parts - fix color scheme (blue team gets blue clothes)
        this.player1.parts = this.createWarriorParts('red');
        Object.values(this.player1.parts).forEach(part => this.player1.add(part));

        // Add physics properties
        this.player1.body = {
            x: this.player1.x - 15,
            y: this.player1.y - 25,
            width: 30,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facingRight: true
        };

        // Player stats
        this.player1.stats = stats;
        this.player1.health = stats.health;
        this.player1.playerData = playerData;
        this.player1.isAttacking = false;
        this.player1.isDashing = false;
        this.player1.isWalking = false;
        this.player1.walkFrame = 0;

        // Attack hitbox (invisible)
        this.player1.attackHitbox = this.add.rectangle(0, 0, 60, 40, 0xff0000, 0);
    }

    createPlayer2(playerData) {
        const stats = this.getPlayerStats(playerData.statChoice);

        // Create warrior container
        this.player2 = this.add.container(this.cameras.main.width - 200, this.groundY - 25);

        // Create warrior parts - fix color scheme (red team gets red clothes)
        this.player2.parts = this.createWarriorParts('blue');
        Object.values(this.player2.parts).forEach(part => this.player2.add(part));

        // Flip player 2 to face left
        this.player2.setScale(-1, 1);

        // Add physics properties
        this.player2.body = {
            x: this.player2.x - 15,
            y: this.player2.y - 25,
            width: 30,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facingRight: false
        };

        // Player stats
        this.player2.stats = stats;
        this.player2.health = stats.health;
        this.player2.playerData = playerData;
        this.player2.isAttacking = false;
        this.player2.isDashing = false;
        this.player2.isWalking = false;
        this.player2.walkFrame = 0;

        // Attack hitbox (invisible)
        this.player2.attackHitbox = this.add.rectangle(0, 0, 60, 40, 0xff0000, 0);
    }

    getPlayerStats(statChoice) {
        switch(statChoice) {
            case 'damage': // PATH OF FURY
                return { health: 80, damage: 25, speed: 200 };
            case 'health': // PATH OF ENDURANCE
                return { health: 120, damage: 15, speed: 200 };
            default:
                return { health: 80, damage: 25, speed: 200 }; // Default to PATH OF FURY
        }
    }

    createUI(currentMatch) {
        const topY = 80;

        // Player names and health bars
        this.add.text(150, topY - 30, currentMatch.player1.name, {
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width - 150, topY - 30, currentMatch.player2.name, {
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Health bar backgrounds
        this.add.rectangle(150, topY, 200, 20, 0x2c3e50).setStrokeStyle(2, 0x34495e);
        this.add.rectangle(this.cameras.main.width - 150, topY, 200, 20, 0x2c3e50).setStrokeStyle(2, 0x34495e);

        // Health bars
        this.healthBar1 = this.add.rectangle(150, topY, 196, 16, 0xe74c3c);
        this.healthBar2 = this.add.rectangle(this.cameras.main.width - 150, topY, 196, 16, 0x3498db);

        // Timer (moved upwards)
        this.timerText = this.add.text(this.cameras.main.centerX, topY + 70, '30', {
            fontSize: '36px',
            fill: '#f39c12',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Controls display
        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 60,
            'P1: WASD + SPACE (Attack) + Double-tap A/D (Dash)', {
            fontSize: '14px',
            fill: '#000000'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 40,
            'P2: ARROWS + SHIFT (Attack) + Double-tap ←/→ (Dash)', {
            fontSize: '14px',
            fill: '#000000'
        }).setOrigin(0.5);
    }

    setupInput() {
        // Player 1 controls (WASD + Spacebar)
        this.keys1 = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        // Player 2 controls (Arrow keys + Shift)
        this.keys2 = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        };
    }

    startCountdown() {
        this.gameEnded = true; // Prevent movement during countdown

        let count = 3;
        const countdownText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, '3', {
            fontSize: '72px',
            fill: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                count--;
                if (count > 0) {
                    countdownText.setText(count.toString());
                } else if (count === 0) {
                    countdownText.setText('FIGHT!').setFill('#27ae60');
                } else {
                    countdownText.destroy();
                    this.gameEnded = false; // Allow movement
                    this.startBattleTimer();
                }
            },
            repeat: 3
        });
    }

    startBattleTimer() {
        this.battleTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.battleTimer--;
                this.timerText.setText(this.battleTimer.toString());

                if (this.battleTimer <= 0) {
                    this.endBattle('time');
                }
            },
            repeat: 29
        });
    }

    createWarriorParts(color) {
        const parts = {};

        // Color schemes
        const colors = {
            blue: { main: 0x3498db, dark: 0x2980b9, accent: 0x2c3e50 },
            red: { main: 0xe74c3c, dark: 0xc0392b, accent: 0x8b4513 }
        };

        const scheme = colors[color];

        // Head
        parts.head = this.add.circle(0, -20, 8, 0xf4d1ae);

        // Helmet
        parts.helmet = this.add.graphics();
        parts.helmet.fillStyle(scheme.accent);
        parts.helmet.fillEllipse(0, -20, 18, 16);
        parts.helmet.lineStyle(2, scheme.dark);
        parts.helmet.strokeEllipse(0, -20, 18, 16);

        // Body (torso)
        parts.body = this.add.graphics();
        parts.body.fillStyle(scheme.main);
        parts.body.fillRect(-8, -10, 16, 20);
        parts.body.lineStyle(2, scheme.dark);
        parts.body.strokeRect(-8, -10, 16, 20);

        // Arms (will be animated)
        parts.leftArm = this.add.graphics();
        parts.leftArm.fillStyle(scheme.main);
        parts.leftArm.fillEllipse(-12, -5, 6, 15);
        parts.leftArm.lineStyle(1, scheme.dark);
        parts.leftArm.strokeEllipse(-12, -5, 6, 15);

        parts.rightArm = this.add.graphics();
        parts.rightArm.fillStyle(scheme.main);
        parts.rightArm.fillEllipse(12, -5, 6, 15);
        parts.rightArm.lineStyle(1, scheme.dark);
        parts.rightArm.strokeEllipse(12, -5, 6, 15);

        // Legs (will be animated)
        parts.leftLeg = this.add.graphics();
        parts.leftLeg.fillStyle(scheme.accent);
        parts.leftLeg.fillEllipse(-5, 15, 6, 15);
        parts.leftLeg.lineStyle(1, scheme.dark);
        parts.leftLeg.strokeEllipse(-5, 15, 6, 15);

        parts.rightLeg = this.add.graphics();
        parts.rightLeg.fillStyle(scheme.accent);
        parts.rightLeg.fillEllipse(5, 15, 6, 15);
        parts.rightLeg.lineStyle(1, scheme.dark);
        parts.rightLeg.strokeEllipse(5, 15, 6, 15);

        // Sword
        parts.sword = this.add.graphics();
        parts.sword.lineStyle(3, 0xc0c0c0);
        parts.sword.lineBetween(15, -10, 15, -25); // Blade
        parts.sword.lineStyle(5, scheme.accent);
        parts.sword.lineBetween(15, -8, 15, -5); // Hilt
        parts.sword.fillStyle(0xffd700);
        parts.sword.fillCircle(15, -5, 2); // Pommel

        // Store references for animation
        return parts;
    }

    checkPlayerCollision(player1, player2) {
        // Safety checks
        if (!player1 || !player2 || !player1.body || !player2.body) {
            return false;
        }

        const p1Left = player1.body.x;
        const p1Right = player1.body.x + player1.body.width;
        const p2Left = player2.body.x;
        const p2Right = player2.body.x + player2.body.width;

        // Check if players overlap horizontally
        return !(p1Right <= p2Left || p1Left >= p2Right);
    }

    getCurrentMatch() {
        const tournamentData = this.registry.get('tournamentData');
        const currentRound = tournamentData.bracket[tournamentData.currentRound - 1];
        return currentRound ? currentRound.matches[tournamentData.currentMatch] : null;
    }

    update(time, delta) {
        if (this.gameEnded) return;

        // Update cooldowns
        this.attackCooldown1 = Math.max(0, this.attackCooldown1 - delta);
        this.attackCooldown2 = Math.max(0, this.attackCooldown2 - delta);
        this.dashCooldown1 = Math.max(0, this.dashCooldown1 - delta);
        this.dashCooldown2 = Math.max(0, this.dashCooldown2 - delta);

        // Handle player input and movement
        this.handlePlayer1Input(delta);
        this.handlePlayer2Input(delta);

        // Update physics
        this.updatePlayerPhysics(this.player1, delta);
        this.updatePlayerPhysics(this.player2, delta);

        // Update attack hitboxes
        this.updateAttackHitboxes();

        // Update animations
        this.updatePlayerAnimations(this.player1, delta);
        this.updatePlayerAnimations(this.player2, delta);

        // Check for attacks
        this.checkAttacks();
    }

    handlePlayer1Input(delta) {
        const player = this.player1;
        const keys = this.keys1;
        const speed = player.stats.speed;

        // Store intended movement
        let intendedVelocityX = 0;

        // Check for double-tap dash
        const currentTime = Date.now();
        if (Phaser.Input.Keyboard.JustDown(keys.left)) {
            if (this.lastKeyPress1.key === 'left' &&
                currentTime - this.lastKeyPress1.time < this.doubleTapWindow &&
                this.dashCooldown1 <= 0) {
                this.performDash(player, 1, 'left');
                this.dashCooldown1 = 1000;
            }
            this.lastKeyPress1 = { key: 'left', time: currentTime };
        }

        if (Phaser.Input.Keyboard.JustDown(keys.right)) {
            if (this.lastKeyPress1.key === 'right' &&
                currentTime - this.lastKeyPress1.time < this.doubleTapWindow &&
                this.dashCooldown1 <= 0) {
                this.performDash(player, 1, 'right');
                this.dashCooldown1 = 1000;
            }
            this.lastKeyPress1 = { key: 'right', time: currentTime };
        }

        // Horizontal movement
        if (keys.left.isDown) {
            intendedVelocityX = -speed;
            if (player.body.facingRight) {
                player.body.facingRight = false;
                this.flipPlayer(player, false);
            }
            player.isWalking = true;
        } else if (keys.right.isDown) {
            intendedVelocityX = speed;
            if (!player.body.facingRight) {
                player.body.facingRight = true;
                this.flipPlayer(player, true);
            }
            player.isWalking = true;
        } else {
            intendedVelocityX = 0;
            player.isWalking = false;
        }

        // Check collision before applying movement
        const otherPlayer = this.player2;
        const tempX = player.body.x + intendedVelocityX * (1/60);

        // Create temporary body position for collision check
        const tempBody = {
            x: tempX,
            y: player.body.y,
            width: player.body.width,
            height: player.body.height
        };

        // Only apply movement if no collision
        if (!this.checkPlayerCollision(tempBody, otherPlayer.body)) {
            player.body.velocityX = intendedVelocityX;
        } else {
            player.body.velocityX = 0;
            player.isWalking = false;
        }

        // Apply friction when not moving
        if (intendedVelocityX === 0) {
            player.body.velocityX *= 0.8;
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(keys.up) && player.body.grounded) {
            player.body.velocityY = -550; // Increased for platforms
            player.body.grounded = false;
        }

        // Fast fall when pressing S while airborne or to drop through platforms
        if (keys.down.isDown && !player.body.grounded && player.body.velocityY > 0) {
            player.body.velocityY += 600 * (1/60); // Increase fall speed
        }

        // Drop through platforms when pressing S while grounded on a platform (not ground)
        if (Phaser.Input.Keyboard.JustDown(keys.down) && player.body.grounded && player.body.y + player.body.height < this.groundY - 10) {
            player.body.grounded = false;
            player.body.velocityY = 100; // Small downward velocity to start falling
        }

        // Attack
        if (Phaser.Input.Keyboard.JustDown(keys.attack) && this.attackCooldown1 <= 0) {
            this.performAttack(player, 1);
            this.attackCooldown1 = 500; // 0.5 second cooldown
        }
    }

    handlePlayer2Input(delta) {
        const player = this.player2;
        const keys = this.keys2;
        const speed = player.stats.speed;

        // Store intended movement
        let intendedVelocityX = 0;

        // Check for double-tap dash
        const currentTime = Date.now();
        if (Phaser.Input.Keyboard.JustDown(keys.left)) {
            if (this.lastKeyPress2.key === 'left' &&
                currentTime - this.lastKeyPress2.time < this.doubleTapWindow &&
                this.dashCooldown2 <= 0) {
                this.performDash(player, 2, 'left');
                this.dashCooldown2 = 1000;
            }
            this.lastKeyPress2 = { key: 'left', time: currentTime };
        }

        if (Phaser.Input.Keyboard.JustDown(keys.right)) {
            if (this.lastKeyPress2.key === 'right' &&
                currentTime - this.lastKeyPress2.time < this.doubleTapWindow &&
                this.dashCooldown2 <= 0) {
                this.performDash(player, 2, 'right');
                this.dashCooldown2 = 1000;
            }
            this.lastKeyPress2 = { key: 'right', time: currentTime };
        }

        // Horizontal movement
        if (keys.left.isDown) {
            intendedVelocityX = -speed; // Moving left
            if (player.body.facingRight) {
                player.body.facingRight = false;
                this.flipPlayer(player, false);
            }
            player.isWalking = true;
        } else if (keys.right.isDown) {
            intendedVelocityX = speed; // Moving right
            if (!player.body.facingRight) {
                player.body.facingRight = true;
                this.flipPlayer(player, true);
            }
            player.isWalking = true;
        } else {
            intendedVelocityX = 0;
            player.isWalking = false;
        }

        // Check collision before applying movement
        const otherPlayer = this.player1;
        const tempX = player.body.x + intendedVelocityX * (1/60);

        // Create temporary body position for collision check
        const tempBody = {
            x: tempX,
            y: player.body.y,
            width: player.body.width,
            height: player.body.height
        };

        // Only apply movement if no collision
        if (!this.checkPlayerCollision(tempBody, otherPlayer.body)) {
            player.body.velocityX = intendedVelocityX;
        } else {
            player.body.velocityX = 0;
            player.isWalking = false;
        }

        // Apply friction when not moving
        if (intendedVelocityX === 0) {
            player.body.velocityX *= 0.8;
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(keys.up) && player.body.grounded) {
            player.body.velocityY = -550; // Increased for platforms
            player.body.grounded = false;
        }

        // Fast fall when pressing down arrow while airborne or to drop through platforms
        if (keys.down.isDown && !player.body.grounded && player.body.velocityY > 0) {
            player.body.velocityY += 600 * (1/60); // Increase fall speed
        }

        // Drop through platforms when pressing down arrow while grounded on a platform (not ground)
        if (Phaser.Input.Keyboard.JustDown(keys.down) && player.body.grounded && player.body.y + player.body.height < this.groundY - 10) {
            player.body.grounded = false;
            player.body.velocityY = 100; // Small downward velocity to start falling
        }

        // Attack
        if (Phaser.Input.Keyboard.JustDown(keys.attack) && this.attackCooldown2 <= 0) {
            this.performAttack(player, 2);
            this.attackCooldown2 = 500; // 0.5 second cooldown
        }
    }

    updatePlayerPhysics(player, delta) {
        const deltaSeconds = delta / 1000;

        // Apply gravity
        if (!player.body.grounded) {
            player.body.velocityY += 800 * deltaSeconds; // Gravity
        }

        // Update position
        player.body.x += player.body.velocityX * deltaSeconds;
        player.body.y += player.body.velocityY * deltaSeconds;

        // Constrain to arena bounds
        if (player.body.x < this.arenaLeft) {
            player.body.x = this.arenaLeft;
            player.body.velocityX = 0;
        } else if (player.body.x + player.body.width > this.arenaRight) {
            player.body.x = this.arenaRight - player.body.width;
            player.body.velocityX = 0;
        }

        // Platform collision detection
        let onPlatform = false;
        if (this.platforms) {
            for (const platform of this.platforms) {
                const playerLeft = player.body.x;
                const playerRight = player.body.x + player.body.width;
                const playerTop = player.body.y;
                const playerBottom = player.body.y + player.body.height;

                const platformLeft = platform.x;
                const platformRight = platform.x + platform.width;
                const platformTop = platform.y;
                const platformBottom = platform.y + platform.height;

                // Check if player overlaps horizontally with platform
                if (playerRight > platformLeft && playerLeft < platformRight) {

                    // LANDING ON TOP - player falling down onto platform
                    if (player.body.velocityY > 0 &&
                        playerBottom >= platformTop &&
                        playerTop < platformTop) {

                        player.body.y = platformTop - player.body.height;
                        player.body.velocityY = 0;
                        player.body.grounded = true;
                        onPlatform = true;
                        player.x = player.body.x + player.body.width / 2;
                        player.y = player.body.y + player.body.height / 2;
                        return;
                    }

                    // HITTING FROM BELOW - player jumping up into platform
                    if (player.body.velocityY < 0 &&
                        playerTop <= platformBottom &&
                        playerBottom > platformBottom) {

                        player.body.y = platformBottom;
                        player.body.velocityY = 0;
                        player.x = player.body.x + player.body.width / 2;
                        player.y = player.body.y + player.body.height / 2;
                        return;
                    }

                    // STANDING ON PLATFORM - check if player is still on platform
                    if (player.body.grounded &&
                        Math.abs(playerBottom - platformTop) < 5) {
                        onPlatform = true;
                    }
                }
            }

            // If player was grounded but is no longer on any platform, start falling
            if (player.body.grounded && !onPlatform && player.body.y + player.body.height < this.groundY - 10) {
                player.body.grounded = false;
            }
        }

        // Ground collision
        if (player.body.y + player.body.height >= this.groundY) {
            player.body.y = this.groundY - player.body.height;
            player.body.velocityY = 0;
            player.body.grounded = true;
        }

        // Update sprite position
        player.x = player.body.x + player.body.width / 2;
        player.y = player.body.y + player.body.height / 2;
    }

    flipPlayer(player, facingRight) {
        // Flip the player sprite
        player.setScale(facingRight ? 1 : -1, 1);
    }

    updatePlayerAnimations(player, delta) {
        if (!player.parts) return;

        // Walking animation
        if (player.isWalking && player.body.grounded) {
            player.walkFrame += delta * 0.01;

            // Leg animation (swinging back and forth)
            const legSwing = Math.sin(player.walkFrame) * 0.2;
            player.parts.leftLeg.rotation = legSwing;
            player.parts.rightLeg.rotation = -legSwing;
        } else {
            // Reset legs to neutral position
            player.parts.leftLeg.rotation = 0;
            player.parts.rightLeg.rotation = 0;
        }

        // Breathing animation (subtle body movement)
        const breathe = Math.sin(Date.now() * 0.002) * 0.02;
        player.parts.body.scaleY = 1 + breathe;
    }

    updateAttackHitboxes() {
        // Player 1 attack hitbox
        if (this.player1.body.facingRight) {
            this.player1.attackHitbox.x = this.player1.x + 50;
        } else {
            this.player1.attackHitbox.x = this.player1.x - 50;
        }
        this.player1.attackHitbox.y = this.player1.y;

        // Player 2 attack hitbox
        if (this.player2.body.facingRight) {
            this.player2.attackHitbox.x = this.player2.x + 50;
        } else {
            this.player2.attackHitbox.x = this.player2.x - 50;
        }
        this.player2.attackHitbox.y = this.player2.y;
    }

    performAttack(player, playerNum) {
        if (!player.parts) return;

        // Play sword swing sound
        if (window.audioManager) {
            window.audioManager.playSound('swordSwing');
        }

        // Sword swing animation
        const sword = player.parts.sword;
        // Always swing downward regardless of facing direction
        const swingDirection = Math.PI / 3;

        // Sword swing from top to bottom
        this.tweens.add({
            targets: sword,
            rotation: swingDirection,
            duration: 100,
            ease: 'Power2',
            yoyo: true
        });

        // Right arm swing animation (always downward)
        this.tweens.add({
            targets: player.parts.rightArm,
            rotation: Math.PI / 4,
            duration: 100,
            ease: 'Power2',
            yoyo: true
        });

        // Body lunge animation
        const attackDirection = player.body.facingRight ? 1 : -1;
        this.tweens.add({
            targets: player,
            x: player.x + (attackDirection * 10),
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });

        // Mark that this player is attacking
        player.isAttacking = true;
        this.time.delayedCall(200, () => {
            player.isAttacking = false;
        });
    }

    performDash(player, playerNum, direction) {
        if (!player.parts) return;

        // Play dash sound
        if (window.audioManager) {
            window.audioManager.playSound('buttonClick'); // Dash sound
        }

        // Calculate dash direction based on key pressed
        const dashDirection = direction === 'left' ? -1 : 1;
        const dashDistance = 240; // Double the distance for better dodging

        // Calculate target position
        const otherPlayer = player === this.player1 ? this.player2 : this.player1;
        const targetX = player.body.x + (dashDirection * dashDistance);

        // Ensure dash doesn't go out of arena bounds
        const clampedTargetX = Math.max(this.arenaLeft, Math.min(targetX, this.arenaRight - player.body.width));

        // Check if dash would cause collision
        const tempBody = {
            x: clampedTargetX,
            y: player.body.y,
            width: player.body.width,
            height: player.body.height
        };

        let finalTargetX = clampedTargetX;
        if (this.checkPlayerCollision(tempBody, otherPlayer.body)) {
            // Find the closest safe position
            const step = dashDirection > 0 ? -10 : 10;
            let testX = clampedTargetX;
            while (Math.abs(testX - player.body.x) > 20) {
                testX += step;
                const testBody = {
                    x: testX,
                    y: player.body.y,
                    width: player.body.width,
                    height: player.body.height
                };
                if (!this.checkPlayerCollision(testBody, otherPlayer.body)) {
                    finalTargetX = testX;
                    break;
                }
            }
        }

        // Perform the dash with smooth animation
        player.isDashing = true;

        this.tweens.add({
            targets: player.body,
            x: finalTargetX,
            duration: 150,
            ease: 'Power2'
        });

        // Update facing direction
        if (dashDirection === -1 && player.body.facingRight) {
            player.body.facingRight = false;
            this.flipPlayer(player, false);
        } else if (dashDirection === 1 && !player.body.facingRight) {
            player.body.facingRight = true;
            this.flipPlayer(player, true);
        }

        // Dash animation - lean forward
        this.tweens.add({
            targets: player,
            rotation: dashDirection * 0.2,
            duration: 120,
            yoyo: true,
            ease: 'Power2'
        });

        // Body stretch effect
        this.tweens.add({
            targets: player.parts.body,
            scaleX: 1.4,
            scaleY: 0.8,
            duration: 120,
            yoyo: true,
            ease: 'Power2'
        });

        // Create dash effects - fix color assignment
        const effectPlayerNum = player === this.player1 ? 2 : 1; // Swap the numbers to fix colors
        this.createDashEffect(player, effectPlayerNum);

        // Stop dashing after animation completes
        this.time.delayedCall(150, () => {
            player.isDashing = false;
            player.body.velocityX = 0; // Stop any residual velocity
        });
    }

    createDashEffect(player, playerNum) {
        // Dash afterimage effect
        for (let i = 0; i < 5; i++) {
            const afterimage = this.add.container(
                player.x - (player.body.facingRight ? i * 12 : -i * 12),
                player.y
            );

            // Create simplified warrior silhouette
            const silhouette = this.add.circle(0, 0, 15, playerNum === 1 ? 0x3498db : 0xe74c3c, 0.3 - i * 0.05);
            afterimage.add(silhouette);

            this.tweens.add({
                targets: afterimage,
                alpha: 0,
                duration: 300,
                onComplete: () => afterimage.destroy()
            });
        }

        // Ground dust effect
        for (let i = 0; i < 6; i++) {
            const dust = this.add.circle(
                player.x + Phaser.Math.Between(-10, 10),
                player.y + 25,
                Phaser.Math.Between(3, 6),
                0x8b4513,
                0.6
            );

            this.tweens.add({
                targets: dust,
                x: dust.x + Phaser.Math.Between(-20, 20),
                y: dust.y + Phaser.Math.Between(5, 15),
                alpha: 0,
                duration: 400,
                onComplete: () => dust.destroy()
            });
        }
    }

    checkAttacks() {
        // Safety checks
        if (!this.player1 || !this.player2) {
            return;
        }

        // Check if player 1 hits player 2
        if (this.player1.isAttacking && this.player1.attackHitbox && this.checkCollision(this.player1.attackHitbox, this.player2)) {
            this.dealDamage(this.player2, this.player1.stats.damage);
            this.player1.isAttacking = false; // Prevent multiple hits
        }

        // Check if player 2 hits player 1
        if (this.player2.isAttacking && this.player2.attackHitbox && this.checkCollision(this.player2.attackHitbox, this.player1)) {
            this.dealDamage(this.player1, this.player2.stats.damage);
            this.player2.isAttacking = false; // Prevent multiple hits
        }
    }

    checkCollision(hitbox, target) {
        // Safety checks
        if (!hitbox || !target) {
            return false;
        }

        try {
            const hitboxBounds = hitbox.getBounds();
            const targetBounds = target.getBounds();

            return Phaser.Geom.Rectangle.Overlaps(hitboxBounds, targetBounds);
        } catch (error) {
            console.warn('Collision detection error:', error);
            return false;
        }
    }

    dealDamage(target, damage) {
        target.health -= damage;

        // Show damage number with style
        const damageText = this.add.text(target.x, target.y - 40, `-${damage}`, {
            fontSize: '24px',
            fill: '#ff4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Animate damage number
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 60,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });

        // Hit impact effect
        this.createHitEffect(target);

        // Hit flash on target
        this.tweens.add({
            targets: target,
            alpha: 0.3,
            duration: 100,
            yoyo: true
        });

        // Knockback effect
        const knockbackDirection = target === this.player1 ? -1 : 1;
        target.body.velocityX += knockbackDirection * 150;

        // Update health bar
        this.updateHealthBars();

        // Check for victory
        if (target.health <= 0) {
            const winner = target === this.player1 ? this.player2 : this.player1;
            this.endBattle('knockout', winner);
        }

        // Play hit sound
        if (window.audioManager) {
            window.audioManager.playSound('swordHit'); // Hit sound effect
        }
    }

    createHitEffect(target) {
        // Simple impact flash
        const impactFlash = this.add.circle(target.x, target.y, 25, 0xffffff, 0.8);

        this.tweens.add({
            targets: impactFlash,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => impactFlash.destroy()
        });

        // Screen shake
        this.cameras.main.shake(100, 0.01);
    }

    startSuddenDeath() {
        this.gameEnded = true;

        // Show sudden death message
        const suddenDeathText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY,
            'SUDDEN DEATH!\nFirst hit wins!', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // Flash effect
        this.tweens.add({
            targets: suddenDeathText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                suddenDeathText.destroy();
                this.gameEnded = false;

                // Set both players to 1 HP for sudden death
                this.player1.health = 1;
                this.player2.health = 1;
                this.updateHealthBars();

                // Flash health bars red
                this.tweens.add({
                    targets: [this.healthBar1, this.healthBar2],
                    tint: 0xff0000,
                    duration: 1000,
                    yoyo: true
                });

                // Change timer to "SUDDEN DEATH"
                this.timerText.setText('SUDDEN DEATH').setFill('#ff0000');
            }
        });
    }

    updateHealthBars() {
        // Player 1 health bar
        const health1Percent = Math.max(0, this.player1.health / this.player1.stats.health);
        this.healthBar1.scaleX = health1Percent;

        // Player 2 health bar
        const health2Percent = Math.max(0, this.player2.health / this.player2.stats.health);
        this.healthBar2.scaleX = health2Percent;
    }

    endBattle(reason, winner = null) {
        if (this.gameEnded) return;

        this.gameEnded = true;

        // Stop and clean up the timer
        if (this.battleTimerEvent) {
            this.battleTimerEvent.destroy();
            this.battleTimerEvent = null;
        }

        // Determine winner
        if (reason === 'time') {
            if (this.player1.health > this.player2.health) {
                winner = this.player1;
            } else if (this.player2.health > this.player1.health) {
                winner = this.player2;
            } else {
                // Tie - enter sudden death
                this.startSuddenDeath();
                return;
            }
        }

        // Update tournament data
        this.updateTournamentData(winner);

        // Show victory message with buttons
        this.showVictoryMessage(winner);
    }

    updateTournamentData(winner) {
        const tournamentData = this.registry.get('tournamentData');
        const currentRound = tournamentData.bracket[tournamentData.currentRound - 1];
        const currentMatch = currentRound.matches[tournamentData.currentMatch];

        // Set the winner and mark match as completed
        currentMatch.winner = winner.playerData;
        currentMatch.completed = true;

        // Mark loser as eliminated
        const loser = winner === this.player1 ? this.player2 : this.player1;
        loser.playerData.eliminated = true;

        // Advance to next match in current round
        const remainingMatches = currentRound.matches.filter(match => !match.completed);
        if (remainingMatches.length > 0) {
            // Find next uncompleted match in current round
            for (let i = 0; i < currentRound.matches.length; i++) {
                if (!currentRound.matches[i].completed) {
                    tournamentData.currentMatch = i;
                    break;
                }
            }
        } else {
            // All matches in current round complete, will be handled by TournamentBracketScene
            tournamentData.currentMatch = 0;
        }

        this.registry.set('tournamentData', tournamentData);
    }

    showVictoryMessage(winner) {
        const winnerName = winner.playerData.name;
        const loser = winner === this.player1 ? this.player2 : this.player1;
        const reason = this.battleTimer <= 0 ? 'TIME!' : 'KNOCKOUT!';

        // Clear screen
        this.children.removeAll();

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Victory overlay
        this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8);

        // Winner announcement
        this.add.text(centerX, centerY - 150, '🏆 WINNER! 🏆', {
            fontSize: '48px',
            fill: '#ffd93d',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 80, winnerName, {
            fontSize: '36px',
            fill: '#2ecc71',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 40, `defeats ${loser.playerData.name}`, {
            fontSize: '24px',
            fill: '#95a5a6'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 10, reason, {
            fontSize: '20px',
            fill: '#e74c3c',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Show different message based on if this is the final match
        const isFinalMatch = this.isFinalMatch();
        const message = isFinalMatch ?
            `The Throne of Valor belongs to ${winnerName}` :
            `${winnerName} proceeds to the next round`;

        this.add.text(centerX, centerY + 30, message, {
            fontSize: '20px',
            fill: '#fbbf24',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Continue buttons
        this.createContinueButtons(centerX, this.cameras.main.height - 120);

        // Play victory sound
        if (window.audioManager) {
            window.audioManager.playSound('winnerAnnounce');
        }
    }

    isFinalMatch() {
        const tournamentData = this.registry.get('tournamentData');
        const currentRound = tournamentData.bracket[tournamentData.currentRound - 1];

        // Check if this is the last round and it only has one match
        return tournamentData.currentRound === tournamentData.bracket.length &&
               currentRound && currentRound.matches.length === 1;
    }

    createContinueButtons(centerX, y) {
        const isFinalMatch = this.isFinalMatch();

        if (isFinalMatch) {
            // Show only results button for final match
            const resultsButton = this.add.rectangle(centerX, y, 250, 60, 0xfbbf24)
                .setInteractive()
                .setStrokeStyle(3, 0xf59e0b);

            this.add.text(centerX, y, 'VIEW FINAL RESULTS', {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            resultsButton.on('pointerdown', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonClick');
                }
                this.scene.start('TournamentResultsScene');
            });
            resultsButton.on('pointerover', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonHover');
                }
                resultsButton.setFillStyle(0xf59e0b);
            });
            resultsButton.on('pointerout', () => {
                resultsButton.setFillStyle(0xfbbf24);
            });
        } else {
            // Regular match buttons
            // Next round button
            const nextRoundButton = this.add.rectangle(centerX - 120, y, 200, 60, 0x10b981)
                .setInteractive()
                .setStrokeStyle(3, 0x059669);

            this.add.text(centerX - 120, y, 'NEXT ROUND', {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Back to tournament button
            const bracketButton = this.add.rectangle(centerX + 120, y, 200, 60, 0x8b5cf6)
                .setInteractive()
                .setStrokeStyle(3, 0xa855f7);

            this.add.text(centerX + 120, y, 'VIEW BRACKET', {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Button interactions
            nextRoundButton.on('pointerdown', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonClick');
                }
                this.proceedToNextRound();
            });
            nextRoundButton.on('pointerover', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonHover');
                }
                nextRoundButton.setFillStyle(0x059669);
            });
            nextRoundButton.on('pointerout', () => {
                nextRoundButton.setFillStyle(0x10b981);
            });

            bracketButton.on('pointerdown', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonClick');
                }
                this.viewBracket();
            });
            bracketButton.on('pointerover', () => {
                if (window.audioManager) {
                    window.audioManager.playSound('buttonHover');
                }
                bracketButton.setFillStyle(0xa855f7);
            });
            bracketButton.on('pointerout', () => {
                bracketButton.setFillStyle(0x8b5cf6);
            });
        }
    }

    proceedToNextRound() {
        const tournamentData = this.registry.get('tournamentData');

        // Check if current round is complete
        const currentRound = tournamentData.bracket[tournamentData.currentRound - 1];
        const remainingMatches = currentRound.matches.filter(match => !match.completed);

        if (remainingMatches.length > 0) {
            // More matches in current round - find next uncompleted match
            for (let i = 0; i < currentRound.matches.length; i++) {
                if (!currentRound.matches[i].completed) {
                    tournamentData.currentMatch = i;
                    break;
                }
            }
            this.registry.set('tournamentData', tournamentData);
            this.scene.start('CharacterSelectionScene');
        } else {
            // Round complete, advance to next round
            this.advanceToNextRound();
        }
    }

    advanceToNextRound() {
        const tournamentData = this.registry.get('tournamentData');

        // Check if tournament is complete
        const currentRound = tournamentData.bracket[tournamentData.currentRound - 1];
        const winners = currentRound.matches.map(match => match.winner);

        if (winners.length === 1) {
            // Tournament complete!
            this.scene.start('TournamentResultsScene');
            return;
        }

        // Create next round
        tournamentData.currentRound++;
        tournamentData.currentMatch = 0;

        // Update the next round's matches with winners
        if (tournamentData.bracket[tournamentData.currentRound - 1]) {
            const nextRound = tournamentData.bracket[tournamentData.currentRound - 1];

            // Update existing matches in next round with winners
            let winnerIndex = 0;
            for (let matchIndex = 0; matchIndex < nextRound.matches.length; matchIndex++) {
                const match = nextRound.matches[matchIndex];

                // Replace TBD players with actual winners
                if (winnerIndex < winners.length) {
                    match.player1 = winners[winnerIndex];
                    winnerIndex++;
                }
                if (winnerIndex < winners.length) {
                    match.player2 = winners[winnerIndex];
                    winnerIndex++;
                }

                // Reset match state
                match.winner = null;
                match.completed = false;
            }
        }

        this.registry.set('tournamentData', tournamentData);
        this.scene.start('CharacterSelectionScene');
    }

    viewBracket() {
        // Don't reset tournament when viewing bracket
        this.scene.start('TournamentBracketScene');
    }

    preload() {
        // Load the background image from root
        // Removed background image loading
    }

    createEpicMedievalBackground() {
        // Create a Roman Colosseum-style arena background
        const graphics = this.add.graphics();
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create dramatic sunset sky
        graphics.fillGradientStyle(0x4A90E2, 0x4A90E2, 0xFF6B35, 0xFF6B35, 1);
        graphics.fillRect(0, 0, width, height);

        // Add clouds
        graphics.fillStyle(0xF5F5DC, 0.3);
        graphics.fillEllipse(width * 0.2, height * 0.15, 80, 40);
        graphics.fillEllipse(width * 0.7, height * 0.2, 100, 50);
        graphics.fillEllipse(width * 0.9, height * 0.12, 60, 30);

        // Outer arena walls with depth
        graphics.fillStyle(0x8B7D6B);
        graphics.fillRoundedRect(20, height * 0.05, width - 40, height * 0.9, 25);
        graphics.lineStyle(8, 0x5D4E37);
        graphics.strokeRoundedRect(20, height * 0.05, width - 40, height * 0.9, 25);

        // Inner arena walls
        graphics.fillStyle(0x9C8B7A);
        graphics.fillRoundedRect(60, height * 0.12, width - 120, height * 0.76, 15);
        graphics.lineStyle(4, 0x6B5B4A);
        graphics.strokeRoundedRect(60, height * 0.12, width - 120, height * 0.76, 15);

        // Roman columns
        for (let i = 0; i < 6; i++) {
            const colX = 100 + (i * (width - 200) / 5);
            const colY = height * 0.15;
            const columnHeight = this.groundY - colY; // Extend columns to ground level

            // Column shaft (extending to ground)
            graphics.fillStyle(0x778899);
            graphics.fillRect(colX - 10, colY, 20, columnHeight);
            graphics.lineStyle(2, 0x556677);
            graphics.strokeRect(colX - 10, colY, 20, columnHeight);

            // Column base (at ground level)
            graphics.fillStyle(0x708090);
            graphics.fillRect(colX - 15, this.groundY - 20, 30, 20);

            // Column capital (at top)
            graphics.fillStyle(0x708090);
            graphics.fillRect(colX - 18, colY - 15, 36, 15);
        }

        // Arena floor - detailed stone pattern covering entire bottom area
        const floorY = this.groundY;

        // Base stone floor covering entire width
        graphics.fillStyle(0x8B8680);
        graphics.fillRect(0, floorY, width, height - floorY);

        // Stone block pattern across entire floor
        const blockWidth = 40;
        const blockHeight = 20;
        for (let x = 0; x < width; x += blockWidth) {
            for (let y = floorY; y < height; y += blockHeight) {
                const offset = (Math.floor(y / blockHeight) % 2) * (blockWidth / 2);
                graphics.lineStyle(2, 0x696969);
                graphics.strokeRect(x + offset, y, blockWidth, blockHeight);
            }
        }



        // Spectator stands removed temporarily


        // Imperial box (made taller)
        graphics.fillStyle(0x8B0000);
        graphics.fillRect(centerX - 60, 40, 120, 100);
        graphics.lineStyle(4, 0x800000);
        graphics.strokeRect(centerX - 60, 40, 120, 100);

        // Golden decorative trim
        graphics.lineStyle(3, 0xFFD700);
        graphics.strokeRect(centerX - 55, 45, 110, 90);

        // Trophy Crown (same as winner screen)
        const crownY = 110; // Moved down within the taller box

        const crownTrophy = this.add.text(centerX, crownY, '🏆', {
            fontSize: '32px'
        }).setOrigin(0.5);

        // SPQR banner
        graphics.fillStyle(0x8B0000);
        graphics.fillRect(centerX - 30, 125, 60, 40);
        graphics.lineStyle(2, 0x800000);
        graphics.strokeRect(centerX - 30, 125, 60, 40);

        // Create podium-style platforms
        this.createPodiumPlatforms();
    }

    createPodiumPlatforms() {
        const graphics = this.add.graphics();
        const arenaWidth = this.arenaRight - this.arenaLeft;

        // Platform dimensions
        const platformWidth = arenaWidth * 0.3; // 30% width each
        const middleGap = arenaWidth * 0.1; // 10% gap in middle
        const sideGap = arenaWidth * 0.05; // 5% gap on each side

        // Platform positions
        const leftPlatformX = this.arenaLeft + sideGap;
        const rightPlatformX = this.arenaRight - sideGap - platformWidth;
        const upperPlatformY = this.groundY - 120;
        const middlePlatformY = this.groundY - 200;

        // Set depth to ensure platforms appear above background but behind players
        graphics.setDepth(1);

        // Left upper platform - enhanced stone appearance
        graphics.fillStyle(0xA0A0A0);
        graphics.fillRoundedRect(leftPlatformX, upperPlatformY, platformWidth, 25, 5);
        graphics.lineStyle(4, 0x505050);
        graphics.strokeRoundedRect(leftPlatformX, upperPlatformY, platformWidth, 25, 5);

        // Stone block detail on left platform
        graphics.lineStyle(1, 0x5A5A5A);
        for (let i = 0; i < 3; i++) {
            const blockX = leftPlatformX + (i * platformWidth / 3);
            graphics.strokeRect(blockX, upperPlatformY, platformWidth / 3, 25);
        }

        // Right upper platform - enhanced stone appearance
        graphics.fillStyle(0xA0A0A0);
        graphics.fillRoundedRect(rightPlatformX, upperPlatformY, platformWidth, 25, 5);
        graphics.lineStyle(4, 0x505050);
        graphics.strokeRoundedRect(rightPlatformX, upperPlatformY, platformWidth, 25, 5);

        // Stone block detail on right platform
        graphics.lineStyle(1, 0x5A5A5A);
        for (let i = 0; i < 3; i++) {
            const blockX = rightPlatformX + (i * platformWidth / 3);
            graphics.strokeRect(blockX, upperPlatformY, platformWidth / 3, 25);
        }

        // Middle top platform (smaller) - enhanced stone appearance
        const middlePlatformWidth = arenaWidth * 0.25;
        const middlePlatformX = this.cameras.main.centerX - middlePlatformWidth / 2;
        graphics.fillStyle(0xA0A0A0);
        graphics.fillRoundedRect(middlePlatformX, middlePlatformY, middlePlatformWidth, 25, 5);
        graphics.lineStyle(4, 0x505050);
        graphics.strokeRoundedRect(middlePlatformX, middlePlatformY, middlePlatformWidth, 25, 5);

        // Stone block detail on middle platform
        graphics.lineStyle(1, 0x5A5A5A);
        for (let i = 0; i < 2; i++) {
            const blockX = middlePlatformX + (i * middlePlatformWidth / 2);
            graphics.strokeRect(blockX, middlePlatformY, middlePlatformWidth / 2, 25);
        }


        // Store platform positions for collision detection (adjusted for new height)
        this.platforms = [
            { x: leftPlatformX, y: upperPlatformY, width: platformWidth, height: 25 },
            { x: rightPlatformX, y: upperPlatformY, width: platformWidth, height: 25 },
            { x: middlePlatformX, y: middlePlatformY, width: middlePlatformWidth, height: 25 }
        ];
    }
}
