# Throne of Valor - Complete Game Documentation

## 🏰 Game Overview

**Throne of Valor** is a medieval-fantasy tournament-style fighting game built with Phaser.js. Players compete in elimination tournaments of varying sizes (2-16 players) to claim the ultimate prize: the Throne of Valor. The game features real-time combat, multiple arena types, character customization paths, and a comprehensive audio system.

**Technical Specifications:**
- **Engine:** Phaser.js 3.70.0
- **Resolution:** Fixed 1280x720 (16:9 aspect ratio)
- **Platform:** Web browser (HTML5)
- **Audio:** Web Audio API with comprehensive sound system
- **Input:** Keyboard controls for 2-player local gameplay

---

## 🎮 Core Game Flow

### Main Menu Scene (`MainMenuScene.js`)
- **Tournament Size Selection**: Choose from 2, 4, 8, or 16 players
- **Visual Design**: Animated background particles, glowing title effects
- **Difficulty Indicators**:
  - 2-4 players: "QUICK" (green)
  - 8 players: "STANDARD" (yellow)
  - 16 players: "EPIC" (red)
- **Audio**: Menu background music with interactive sound effects

### Tournament Bracket Scene (`TournamentBracketScene.js`)
- **Dynamic Bracket Display**: Automatically scales layout based on player count
- **Visual Features**:
  - Color-coded round headers
  - Match containers with completion status
  - Winner indicators with crown emoji (👑)
  - Dynamic font sizing for optimal readability
- **Navigation**: Start tournament, continue tournament, or return to main menu
- **Auto-advancement**: Automatically handles round progression

### Instructions Scene (`InstructionsScene.js`)
- **Game Lore**: Medieval tournament theme with Latin motto "MORITURI TE SALUTANT"
- **Character Path Explanation**: Details on Fury vs Endurance paths
- **Visual Design**: Modal popup with glow effects and emoji icons

---

## ⚔️ Character System

### Character Paths (`CharacterSelectionScene.js`)
Players must choose their warrior's destiny before each battle:

#### Path of Fury (Red)
- **Health**: 80 HP
- **Damage**: 25 per attack
- **Speed**: 200 units/second
- **Philosophy**: "Unleash devastating power, risk frailty"
- **Visual**: Red color scheme, aggressive styling

#### Path of Endurance (Green)
- **Health**: 120 HP
- **Damage**: 15 per attack
- **Speed**: 200 units/second
- **Philosophy**: "Become unbreakable, temper your strike"
- **Visual**: Green color scheme, defensive styling

### Visual Character Design
- **Warrior Components**: Head, helmet, body, arms, legs with team colors
- **Team Colors**: Red team (Player 1) and Blue team (Player 2)
- **Animation States**: Idle, walking, attacking, dashing
- **Scaling**: Player 2 horizontally flipped to face left

---

## 🏟️ Battle System

### Arena Types (`BattleScene.js`)
The game features 4 distinct randomly-selected arena types:

#### 1. Default Arena
- **Theme**: Epic medieval colosseum
- **Features**: Multi-level platforms, decorative pillars
- **Title**: "ARENA OF VALOR" with "MORITURI TE SALUTANT"
- **Platforms**: Strategic positioning for tactical combat
- **Visual**: Stone construction with royal banners

#### 2. Ground-Only Arena
- **Theme**: Minimalist battlefield
- **Features**: Single ground platform, open sky
- **Focus**: Pure ground-based combat
- **Visual**: Simple brown platform against blue sky

#### 3. Lava Arena
- **Theme**: Dangerous volcanic battleground
- **Features**: 4 floating platforms above lava field
- **Hazards**: Animated lava bubbles and flame effects
- **Strategy**: Platform-jumping combat with environmental danger
- **Visual**: Dark red/orange color scheme with particle effects

#### 4. Spike Arena
- **Theme**: Deadly trap-filled arena
- **Features**: Spike-lined walls and ceiling
- **Hazards**: Dangerous spikes on multiple sides
- **Warning**: Skull symbol indicating extreme danger
- **Visual**: Dark theme with menacing spike formations

### Combat Mechanics

#### Movement System
- **Ground Movement**: Left/right movement with physics
- **Jumping**: Vertical movement with gravity
- **Dashing**: Double-tap movement keys for quick dash
- **Arena Bounds**: Confined to arena boundaries
- **Platform Physics**: Collision detection with arena platforms

#### Attack System
- **Melee Combat**: Close-range sword attacks
- **Attack Cooldown**: Prevents spam attacking
- **Damage Calculation**: Based on character path selection
- **Hit Detection**: Rectangular hitbox collision system
- **Knockback Effects**: Visual feedback on successful hits

#### Weapon System
- **Weapon Spawning**: Random weapon drops every 5 seconds
- **Weapon Types**: Various melee and ranged weapons
- **Pickup System**: Players can collect and equip weapons
- **Enhanced Damage**: Weapons modify attack damage
- **Visual Integration**: Weapons appear on character sprites

#### Health & Status
- **Health Bars**: Visual health tracking for both players
- **Real-time Updates**: Health bars scale with current HP
- **Color Coding**: Red (Player 1) and Blue (Player 2)
- **Death Condition**: Battle ends when player reaches 0 HP

### Battle Timer & Victory Conditions

#### Time Management
- **Battle Duration**: 30-second rounds
- **Countdown**: 3-second battle start countdown
- **Timer Display**: Large center-screen timer
- **Overtime**: Sudden death mode for ties

#### Victory Conditions
1. **Elimination**: Reduce opponent's health to 0
2. **Time Victory**: Higher health percentage when time expires
3. **Sudden Death**: Triggered on equal health percentages (±1%)

### Controls
**Player 1 (Red):**
- Movement: WASD keys
- Attack: SPACEBAR
- Dash: Double-tap A or D

**Player 2 (Blue):**
- Movement: Arrow keys
- Attack: SHIFT key
- Dash: Double-tap LEFT or RIGHT arrows

---

## 🎵 Audio System

### AudioManager (`AudioManager.js`)
Comprehensive Web Audio API implementation with browser compatibility.

#### Music System
- **Menu Music**: Ambient background for main menu
- **Battle Music**: Dynamic combat soundtrack
- **Victory Music**: Triumphant celebration themes
- **Volume Control**: Separate music (30%) and SFX (60%) levels
- **Seamless Transitions**: Automatic music switching between scenes

#### Sound Effects Library
**Interface Sounds:**
- Button hover effects
- Button click confirmations
- Path selection chimes
- Tournament start fanfare

**Combat Audio:**
- Sword swing sounds
- Impact/hit effects
- Weapon pickup audio
- Dash movement whoosh
- Heavy hit impacts
- Critical hit effects

**Event Audio:**
- Battle start horn
- Victory fanfare
- Winner announcements
- Health pickup sounds

#### Technical Features
- **User Interaction Compliance**: Respects browser autoplay policies
- **Context Management**: Automatic AudioContext initialization
- **Error Handling**: Graceful fallback for unsupported browsers
- **Performance**: Efficient sound generation and playback

---

## 🏆 Tournament System

### Tournament Structure
- **Bracket Generation**: Automatic single-elimination brackets
- **Player Shuffling**: Random seeding for fair competition
- **Round Progression**: Automatic advancement through rounds
- **Winner Tracking**: Complete tournament history maintenance

### Tournament Results (`TournamentResultsScene.js`)
#### Champion Celebration
- **Visual Effects**: Confetti animation system with multiple particle types
- **Champion Display**: Crown imagery and royal styling
- **Tournament Statistics**: Complete breakdown of tournament metrics

#### Results Display
- **Complete Bracket**: Final tournament bracket with all results
- **Match Results**: Detailed winner/loser information for each match
- **Statistics Panel**:
  - Total players participated
  - Number of rounds completed
  - Total matches played
  - Elimination count
- **Navigation**: Options to start new tournament or return to menu

### Winner Selection (`WinnerSelectionScene.js`)
Manual winner selection system for tournament progression:
- **Battle Outcome Display**: Shows current match details
- **Player Statistics**: Character path information and stats
- **Winner Buttons**: Interactive selection for match victor
- **Result Announcement**: Dramatic winner reveal with animations
- **Tournament Flow**: Automatic progression to next round or finals

---

## 🎨 Visual Design & User Interface

### Design Philosophy
- **Medieval Fantasy Theme**: Royal colors, medieval typography
- **Color Palette**: Purple (#8b5cf6), gold (#fbbf24), dark grays
- **Visual Hierarchy**: Clear information organization
- **Responsive Elements**: Dynamic scaling for different tournament sizes

### UI Components
#### Buttons & Interactions
- **Hover Effects**: Color transitions and scaling animations
- **Click Feedback**: Visual depression and sound confirmation
- **Glow Effects**: Subtle ambient lighting on interactive elements
- **State Management**: Visual feedback for active/inactive states

#### Health Bars & HUD
- **Real-time Health**: Smooth health bar animations
- **Player Identification**: Clear name display and color coding
- **Timer Display**: Prominent countdown timer
- **Control Instructions**: On-screen control reminders

#### Animations & Effects
- **Particle Systems**: Background ambiance and celebration effects
- **Tween Animations**: Smooth transitions and micro-interactions
- **Visual Feedback**: Attack effects, damage indicators
- **Scene Transitions**: Smooth navigation between game states

---

## 🏗️ Technical Architecture

### File Structure
```
Game/
├── index.html              # Main HTML entry point
├── js/
│   ├── game.js            # Phaser configuration and initialization
│   ├── audio/
│   │   └── AudioManager.js # Complete audio system
│   └── scenes/
│       ├── MainMenuScene.js          # Tournament size selection
│       ├── TournamentBracketScene.js # Bracket display and navigation
│       ├── InstructionsScene.js     # Game tutorial and lore
│       ├── CharacterSelectionScene.js # Character path selection
│       ├── BattleScene.js           # Core combat gameplay
│       ├── WinnerSelectionScene.js  # Manual winner selection
│       └── TournamentResultsScene.js # Final results and celebration
├── Screenshots/           # Visual documentation
│   ├── One.png           # Default arena screenshot
│   ├── Two.png           # Lava arena screenshot
│   ├── Three.png         # Ground-only arena screenshot
│   └── Four.png          # Spike arena screenshot
└── Thumbnail.png         # Game promotional image
```

### Core Systems
#### Game State Management
- **Tournament Data**: Centralized player and match tracking
- **Scene Registry**: Phaser's built-in state management
- **Data Persistence**: Tournament progress maintained across scenes
- **Error Handling**: Graceful fallbacks for missing data

#### Physics & Collision
- **Custom Physics**: Lightweight physics implementation
- **Collision Detection**: Rectangle-based collision system
- **Platform Integration**: Multi-level arena support
- **Boundary Management**: Arena containment system

#### Performance Optimization
- **Fixed Resolution**: Consistent 1280x720 rendering
- **Efficient Animations**: Tween-based animation system
- **Resource Management**: Proper cleanup and memory management
- **Responsive Scaling**: Dynamic UI scaling for various tournament sizes

---

## 🎯 Game Features Summary

### Core Features
✅ **Tournament System**: 2-16 player single-elimination tournaments
✅ **Character Customization**: Fury vs Endurance path selection
✅ **Real-time Combat**: Physics-based fighting with weapons
✅ **Multiple Arenas**: 4 distinct arena types with unique challenges
✅ **Audio System**: Complete music and sound effects
✅ **Visual Polish**: Animations, particles, and professional UI

### Advanced Features
✅ **Dynamic Scaling**: UI adapts to tournament size
✅ **Random Elements**: Arena selection and weapon spawning
✅ **Tournament Persistence**: Save progress between battles
✅ **Celebration System**: Confetti and victory animations
✅ **Browser Compliance**: Respects autoplay policies
✅ **Responsive Design**: Consistent experience across devices

### Technical Features
✅ **Modular Architecture**: Clean separation of concerns
✅ **Error Handling**: Graceful degradation for audio issues
✅ **Performance Optimization**: Efficient rendering and physics
✅ **Code Documentation**: Comprehensive inline documentation
✅ **Visual Documentation**: Complete screenshot library

---

## 🚀 Getting Started

### System Requirements
- **Browser**: Modern web browser with HTML5 and Web Audio API support
- **Controls**: Keyboard for player input
- **Resolution**: Optimized for 1280x720 display
- **Audio**: Web Audio API for full audio experience

### Launch Instructions
1. Open `index.html` in a web browser
2. Wait for game assets to load (loading spinner will disappear)
3. Click or interact to initialize audio system
4. Select tournament size from main menu
5. Begin your quest for the Throne of Valor!

### Controls Reference
**Player 1:** WASD + SPACE (attack) + Double-tap A/D (dash)
**Player 2:** Arrows + SHIFT (attack) + Double-tap ←/→ (dash)

---

*"MORITURI TE SALUTANT" - Those who are about to die salute you*

**Throne of Valor** represents a complete tournament fighting game with professional-grade features, polished presentation, and engaging gameplay mechanics. Every aspect from the audio system to the visual effects has been carefully crafted to deliver an immersive medieval combat experience.