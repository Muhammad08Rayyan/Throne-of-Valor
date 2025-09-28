class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.currentMusic = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.6;
        this.initialized = false;
        this.userHasInteracted = false;

        // Don't initialize audio context immediately - wait for user interaction
        this.setupUserInteractionListener();
    }

    setupUserInteractionListener() {
        const handleUserInteraction = async () => {
            if (!this.userHasInteracted) {
                this.userHasInteracted = true;
                await this.initAudioContext();

                // Remove listeners after first interaction
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('keydown', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
                document.removeEventListener('pointerdown', handleUserInteraction);
            }
        };

        // Listen for any user interaction
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('pointerdown', handleUserInteraction);
    }

    async initAudioContext() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.createSounds();
            this.initialized = true;

            console.log('Audio system initialized successfully after user interaction');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    // Resume audio context (required for Chrome's autoplay policy)
    async resumeAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // Create sound effects using Web Audio API
    createSounds() {
        if (!this.audioContext) return;

        // Button hover sound - short beep
        this.sounds.buttonHover = this.createTone(800, 0.1, 'sine');

        // Button click sound - satisfying click
        this.sounds.buttonClick = this.createTone(600, 0.15, 'square');

        // Victory fanfare - triumphant sound
        this.sounds.victory = this.createVictoryFanfare();

        // Battle start - dramatic horn
        this.sounds.battleStart = this.createBattleHorn();

        // Tournament start - grand opening
        this.sounds.tournamentStart = this.createTournamentFanfare();

        // Path selection - mystical chime
        this.sounds.pathSelect = this.createPathSelectSound();

        // Winner announcement - celebration
        this.sounds.winnerAnnounce = this.createWinnerSound();

        // Combat sounds
        this.sounds.swordSwing = this.createSwordSwingSound();
        this.sounds.swordHit = this.createSwordHitSound();

        // Background music themes
        this.sounds.menuMusic = this.createMenuMusic();
        this.sounds.battleMusic = this.createBattleMusic();
        this.sounds.victoryMusic = this.createVictoryMusic();
    }

    createTone(frequency, duration, waveform = 'sine') {
        return () => {
            if (!this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveform;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createVictoryFanfare() {
        return () => {
            if (!this.audioContext) return;

            // Multi-note victory sequence
            const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();

                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);

                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    osc.type = 'triangle';

                    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, this.audioContext.currentTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

                    osc.start();
                    osc.stop(this.audioContext.currentTime + 0.5);
                }, index * 150);
            });
        };
    }

    createBattleHorn() {
        return () => {
            if (!this.audioContext) return;

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(330, this.audioContext.currentTime + 0.3);
            osc.type = 'sawtooth';

            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, this.audioContext.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

            osc.start();
            osc.stop(this.audioContext.currentTime + 0.8);
        };
    }

    createTournamentFanfare() {
        return () => {
            if (!this.audioContext) return;

            // Grand opening with multiple harmonies
            const baseFreqs = [174, 220, 261, 329]; // F3, A3, C4, E4

            baseFreqs.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                osc.type = 'triangle';

                const volume = this.sfxVolume * (0.3 - index * 0.05);
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.2);
                gain.gain.linearRampToValueAtTime(volume * 0.7, this.audioContext.currentTime + 0.8);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);

                osc.start();
                osc.stop(this.audioContext.currentTime + 1.5);
            });
        };
    }

    createPathSelectSound() {
        return () => {
            if (!this.audioContext) return;

            // Mystical chime with reverb-like effect
            [1, 1.2, 1.5].forEach((multiplier, index) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();

                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);

                    osc.frequency.setValueAtTime(880 * multiplier, this.audioContext.currentTime);
                    osc.type = 'sine';

                    const volume = this.sfxVolume * (0.3 - index * 0.1);
                    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);

                    osc.start();
                    osc.stop(this.audioContext.currentTime + 0.6);
                }, index * 50);
            });
        };
    }

    createWinnerSound() {
        return () => {
            if (!this.audioContext) return;

            // Celebration bells
            const frequencies = [1047, 1319, 1568, 2093]; // C6, E6, G6, C7
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();

                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);

                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    osc.type = 'sine';

                    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, this.audioContext.currentTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

                    osc.start();
                    osc.stop(this.audioContext.currentTime + 1.0);
                }, index * 100);
            });
        };
    }

    // Background music creation
    createMenuMusic() {
        const frequencies = [261, 329, 392, 523]; // C4, E4, G4, C5
        let oscillators = [];
        let isPlaying = false;
        let loopTimeout = null;

        return {
            start: () => {
                if (!this.audioContext || isPlaying) return;
                isPlaying = true;

                const playLoop = () => {
                    if (!isPlaying) return;

                    frequencies.forEach((freq, index) => {
                        setTimeout(() => {
                            if (!isPlaying) return;

                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();

                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);

                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            osc.type = 'triangle';

                            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime + 0.1);
                            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.05, this.audioContext.currentTime + 0.8);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

                            osc.start();
                            osc.stop(this.audioContext.currentTime + 1.0);

                            oscillators.push(osc);
                        }, index * 250);
                    });

                    loopTimeout = setTimeout(playLoop, 2000);
                };

                playLoop();
            },
            stop: () => {
                isPlaying = false;
                if (loopTimeout) {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                }
                oscillators.forEach(osc => {
                    try { osc.stop(); } catch(e) {}
                });
                oscillators = [];
            }
        };
    }

    createBattleMusic() {
        let isPlaying = false;
        let oscillators = [];
        let loopTimeout = null;

        return {
            start: () => {
                if (!this.audioContext || isPlaying) return;
                isPlaying = true;

                const playDramaticLoop = () => {
                    if (!isPlaying) return;

                    // Dramatic battle rhythm
                    const battleFreqs = [220, 246, 293, 330]; // A3, B3, D4, E4

                    battleFreqs.forEach((freq, index) => {
                        setTimeout(() => {
                            if (!isPlaying) return;

                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();

                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);

                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            osc.type = 'sawtooth';

                            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, this.audioContext.currentTime + 0.05);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

                            osc.start();
                            osc.stop(this.audioContext.currentTime + 0.4);

                            oscillators.push(osc);
                        }, index * 200);
                    });

                    loopTimeout = setTimeout(playDramaticLoop, 1200);
                };

                playDramaticLoop();
            },
            stop: () => {
                isPlaying = false;
                if (loopTimeout) {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                }
                oscillators.forEach(osc => {
                    try { osc.stop(); } catch(e) {}
                });
                oscillators = [];
            }
        };
    }

    createVictoryMusic() {
        let isPlaying = false;
        let oscillators = [];
        let loopTimeout = null;

        return {
            start: () => {
                if (!this.audioContext || isPlaying) return;
                isPlaying = true;

                const playVictoryLoop = () => {
                    if (!isPlaying) return;

                    // Triumphant victory melody
                    const victoryMelody = [523, 659, 784, 1047, 784, 659, 523]; // C5-E5-G5-C6-G5-E5-C5

                    victoryMelody.forEach((freq, index) => {
                        setTimeout(() => {
                            if (!isPlaying) return;

                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();

                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);

                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            osc.type = 'triangle';

                            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.2, this.audioContext.currentTime + 0.05);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);

                            osc.start();
                            osc.stop(this.audioContext.currentTime + 0.6);

                            oscillators.push(osc);
                        }, index * 300);
                    });

                    loopTimeout = setTimeout(playVictoryLoop, 3000);
                };

                playVictoryLoop();
            },
            stop: () => {
                isPlaying = false;
                if (loopTimeout) {
                    clearTimeout(loopTimeout);
                    loopTimeout = null;
                }
                oscillators.forEach(osc => {
                    try { osc.stop(); } catch(e) {}
                });
                oscillators = [];
            }
        };
    }

    createSwordSwingSound() {
        return () => {
            if (!this.audioContext) return;

            // Create swoosh effect - high frequency noise that drops quickly
            const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            // Generate white noise that fades to simulate sword cutting through air
            for (let i = 0; i < noiseBuffer.length; i++) {
                const fadeOut = 1 - (i / noiseBuffer.length);
                output[i] = (Math.random() * 2 - 1) * fadeOut * fadeOut;
            }

            const noiseSource = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();
            const gainNode = this.audioContext.createGain();

            noiseSource.buffer = noiseBuffer;
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(2000, this.audioContext.currentTime); // High frequency swoosh
            filter.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

            noiseSource.start();
            noiseSource.stop(this.audioContext.currentTime + 0.2);
        };
    }

    createSwordHitSound() {
        return () => {
            if (!this.audioContext) return;

            // Create metallic clang - multiple frequencies for metallic sound
            const frequencies = [800, 1200, 1600, 2400]; // Metallic harmonics

            frequencies.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                osc.type = 'square'; // Harsh metallic sound

                const volume = this.sfxVolume * (0.4 - index * 0.08); // Decreasing volume for each harmonic
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

                osc.start();
                osc.stop(this.audioContext.currentTime + 0.3);
            });

            // Add sharp impact noise
            setTimeout(() => {
                const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);

                for (let i = 0; i < noiseBuffer.length; i++) {
                    const decay = 1 - (i / noiseBuffer.length);
                    output[i] = (Math.random() * 2 - 1) * decay * decay * decay;
                }

                const noiseSource = this.audioContext.createBufferSource();
                const noiseGain = this.audioContext.createGain();

                noiseSource.buffer = noiseBuffer;
                noiseSource.connect(noiseGain);
                noiseGain.connect(this.audioContext.destination);

                noiseGain.gain.setValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime);

                noiseSource.start();
                noiseSource.stop(this.audioContext.currentTime + 0.1);
            }, 5);
        };
    }

    // Public methods to play sounds
    async playSound(soundName) {
        if (!this.userHasInteracted || !this.initialized) return;

        await this.resumeAudio();

        if (this.sounds[soundName]) {
            if (typeof this.sounds[soundName] === 'function') {
                this.sounds[soundName]();
            }
        }
    }

    async playMusic(musicName) {
        if (!this.userHasInteracted) {
            // User hasn't interacted yet, music will start after first interaction
            return;
        }

        if (!this.initialized) {
            console.warn('Audio not initialized yet');
            return;
        }

        await this.resumeAudio();

        // Stop current music
        if (this.currentMusic && this.currentMusic.stop) {
            this.currentMusic.stop();
        }

        // Start new music immediately
        if (this.sounds[musicName] && this.sounds[musicName].start) {
            this.currentMusic = this.sounds[musicName];
            this.currentMusic.start();
        }
    }

    stopMusic() {
        if (this.currentMusic && this.currentMusic.stop) {
            try {
                this.currentMusic.stop();
            } catch (e) {
                console.warn('Error stopping music:', e);
            }
            this.currentMusic = null;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

// Global audio manager instance
window.audioManager = new AudioManager();