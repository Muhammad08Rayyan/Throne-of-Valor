# Throne of Valor - Combat System Design Document

## Overview
This document outlines the requirements for implementing the actual combat/battle system to replace the current manual winner selection. The goal is to create an engaging, skill-based fighting game while maintaining the tournament structure and medieval theme.

## Core Combat Requirements

### 🎮 Battle Mechanics

#### **Combat Style**
- **Genre**: 2D fighting game with platform elements
- **Perspective**: Side-scrolling view with both players visible
- **Controls**: Keyboard-based combat (WASD + attack keys for Player 1, Arrow keys + attack keys for Player 2)
- **Duration**: Matches should last 30 seconds for optimal tournament pacing
- **Win Condition**: Reduce opponent's health to zero OR time limit with health comparison

#### **Player Stats Implementation**
The existing stat path system translates into simple, clear combat differences:

1. **PATH OF FURY (High Damage)**
   - Base Health: 80 HP
   - Attack Damage: 25 per hit
   - Movement Speed: Standard

2. **PATH OF ENDURANCE (High Health)**
   - Base Health: 120 HP
   - Attack Damage: 15 per hit
   - Movement Speed: Standard

3. **PATH OF BALANCE (Balanced)**
   - Base Health: 100 HP
   - Attack Damage: 20 per hit
   - Movement Speed: Standard

#### **Combat Actions**
- **Basic Attack**: Primary damage dealing move (spacebar/shift)
- **Dash**: Quick movement burst for positioning and dodging (S/Down arrow)
- **Jump**: Vertical movement for positioning (W/Up arrow)
- **Move Left/Right**: Horizontal movement (A,D/Left,Right arrows)

### 🎨 Visual Combat Design

#### **Battle Arena**
- **Setting**: Medieval arena matching the game's theme
- **Layout**: Completely flat arena surface
- **Size**: Fixed arena boundaries to prevent infinite running
- **Background**: Crowd/colosseum atmosphere with particle effects
- **Visual Elements**: Torches, stone architecture, royal banners

#### **Character Representation**
- **Style**: Simple geometric shapes or basic sprite representations
- **Differentiation**: Clear visual distinction between Player 1 and Player 2
- **Colors**: Match the tournament size cards (different colors per player)

#### **Combat Feedback**
- **Health Bars**: Clear, prominent health displays for both players
- **Damage Numbers**: Floating damage text when hits connect
- **Hit Effects**: Screen shake, particle effects, color flashes
- **Status Indicators**: Show match timer and health status
- **Timer Display**: Match countdown timer

### 🎯 User Experience Flow

#### **Pre-Battle Sequence**
1. **Transition from Character Selection**: Both players have chosen their paths
2. **Arena Introduction**: Brief arena view with player introductions
3. **Stat Display**: Show each player's chosen path and brief stat overview
4. **Countdown**: "3... 2... 1... FIGHT!" countdown with audio
5. **Battle Start**: Players gain control simultaneously

#### **During Battle**
1. **Real-time Combat**: Players control their characters directly
2. **Visual Feedback**: All actions have immediate visual/audio feedback
3. **Status Updates**: Health bars update in real-time
4. **Combat Effects**: Simple hit effects and damage feedback
5. **Audio Cues**: Combat sounds, hit confirmations, ability activations

#### **Battle Resolution**
1. **Victory Condition Met**: Health reaches zero OR time expires
2. **Winner Announcement**: Clear declaration of match result
3. **Battle Statistics**: Optional brief stats (damage dealt, hits landed, etc.)
4. **Celebration**: Winner celebration animation/effects
5. **Tournament Progression**: Automatic advancement to next match or round

#### **Integration with Existing Tournament System**
- **Scene Replacement**: Replace `WinnerSelectionScene` with new `BattleScene`
- **Result Integration**: Battle outcome feeds into existing tournament progression
- **Same Tournament Flow**: Maintains current bracket advancement and final match detection
- **Audio Integration**: Combat music and sound effects using existing AudioManager

## Technical Requirements

### 🔧 Combat System Architecture

#### **New Scene: BattleScene.js**
Replace the current `WinnerSelectionScene.js` with a new combat scene that handles:
- Player input management
- Physics and collision detection
- Health and damage calculations
- Animation and visual effects
- Timer management
- Victory condition checking

#### **Player Input System**
```
Player 1 Controls:
- W: Jump
- A: Move Left
- S: Dash
- D: Move Right
- Spacebar: Basic Attack

Player 2 Controls:
- Up Arrow: Jump
- Left Arrow: Move Left
- Down Arrow: Dash
- Right Arrow: Move Right
- Shift: Basic Attack
```

#### **Physics Requirements**
- **Collision Detection**: Player-to-player collision for attacks
- **Boundary Checking**: Arena boundaries to prevent players leaving the stage
- **Gravity Simulation**: Realistic jumping and falling mechanics
- **Movement Smoothing**: Fluid character movement and animations

#### **Health & Damage System**
- **Health Management**: Real-time health tracking and updates
- **Damage Calculation**: Fixed damage values based on character path
- **Simple Combat**: Straightforward attack and dash mechanics

### 🎵 Audio Integration

#### **New Combat Audio**
Using the existing AudioManager system, add:
- **Combat Music**: Intense battle track during fights
- **Attack Sounds**: Simple attack sound effect
- **Impact Effects**: Hit confirmation sounds
- **Dash Sounds**: Quick movement dash audio feedback
- **Arena Ambiance**: Crowd cheering, environmental audio

#### **Audio Timing**
- **Pre-Battle**: Dramatic buildup music during countdown
- **Combat**: High-energy battle music throughout the fight
- **Victory**: Brief victory fanfare before returning to tournament music
- **Seamless Integration**: Smooth transitions to existing tournament audio

### 🎨 Visual Effects System

#### **Animation Requirements**
- **Character Animations**: Attack, movement, idle, hit reaction, dash, jump
- **Effect Animations**: Damage numbers, hit sparks, critical hit effects
- **Path-Specific Effects**: Different visual styles for each stat path
- **UI Animations**: Health bar updates, timer countdown, victory celebration

#### **Particle Systems**
- **Combat Effects**: Hit sparks, dust clouds, magic effects
- **Environmental**: Arena atmosphere, torch flames, background ambiance
- **Victory Effects**: Celebration particles, winner spotlight
- **Path Effects**: Continuous visual indicators for each character path

## Detailed Feature Specifications

### ⚔️ Combat Mechanics Deep Dive

#### **Attack System**
- **Single Attack Type**:
  - Animation: Quick punch/sword swing
  - Damage: Path-dependent fixed damage (Fury: 25, Endurance: 15, Balance: 20)
  - Speed: Fast startup, quick recovery
  - Range: Short to medium
  - Cooldown: Brief recovery time to prevent button mashing

#### **Movement System**
- **Dash Mechanics**:
  - Quick burst of movement in current direction
  - Brief cooldown after use
  - Can be used for dodging attacks
  - Enhanced mobility option

#### **Basic Movement**
- **Walking**: Standard left/right movement
- **Jumping**: Vertical movement with gravity
- **Air Movement**: Limited air control during jumps
- **Dashing**: Quick directional movement burst

#### **Path Differences**
Each path has simple, clear advantages:

##### **PATH OF FURY**
- **High Damage**: 25 damage per hit (highest)
- **Low Health**: 80 HP (lowest)

##### **PATH OF ENDURANCE**
- **High Health**: 120 HP (highest)
- **Low Damage**: 15 damage per hit (lowest)

##### **PATH OF BALANCE**
- **Balanced Stats**: 100 HP, 20 damage per hit
- **Standard Movement**: Same speed as other paths

### 🏆 Victory Conditions & Scoring

#### **Primary Win Conditions**
1. **Knockout**: Reduce opponent's health to 0
2. **Time Victory**: Higher health when timer reaches 0

#### **Timer System**
- **Match Duration**: 30 seconds maximum
- **Countdown Display**: Clear, prominent timer
- **Fast Matches**: Quick, exciting tournament pacing

#### **Tiebreaker Rules**
1. **Higher Health**: Player with higher HP wins
2. **If Identical Health**: Sudden death - first hit wins

### 🎭 Presentation & Polish

#### **Victory Celebration**
- **Winner Animation**: Character celebration pose/animation
- **Victory Message**: Simple victory text
- **Effect Cascade**: Particles, screen effects, audio fanfare
- **Smooth Transition**: Lead into existing tournament progression

#### **Defeat Handling**
- **Loser Animation**: Respectful defeat pose (not humiliating)
- **Encouragement**: Positive messaging about the match
- **Quick Transition**: Don't dwell on defeat, move to next match

#### **Spectacle Elements**
- **Dramatic Moments**: Screen effects on final blows
- **Comeback Potential**: Close matches should feel exciting
- **Path Identity**: Each stat path should feel distinctly different to play

## Integration Points

### 🔄 Tournament System Integration

#### **Scene Flow Update**
```
Current: CharacterSelectionScene → WinnerSelectionScene → Tournament Progression
New:     CharacterSelectionScene → BattleScene → Tournament Progression
```

#### **Data Flow**
- **Input**: Player stat choices from character selection
- **Processing**: Real combat with stat-based mechanics
- **Output**: Battle result feeds into existing tournament advancement logic

#### **Backwards Compatibility**
- **Tournament Logic**: No changes needed to bracket management
- **Player Objects**: Same structure, just different path interpretation
- **Scene Transitions**: Replace one scene, maintain all others

### 🎨 UI/UX Consistency

#### **Visual Coherence**
- **Color Scheme**: Maintain purple/gold medieval theme
- **Typography**: Same fonts and text styling
- **Button Design**: Consistent with existing UI elements
- **Animations**: Match the quality and style of existing transitions

#### **Audio Continuity**
- **Music Progression**: Natural evolution from character selection music
- **Sound Effects**: Same quality and style as existing audio
- **Volume Balance**: Consistent with current audio levels

## Success Criteria

### 🎯 Core Functionality Goals
- ✅ **Playable Combat**: Two players can fight with responsive controls
- ✅ **Stat Differentiation**: Each path feels meaningfully different
- ✅ **Fair Balance**: No path has overwhelming advantage
- ✅ **Quick Resolution**: Matches conclude within reasonable time
- ✅ **Tournament Integration**: Seamlessly feeds results into bracket system

### 🎨 User Experience Goals
- ✅ **Intuitive Controls**: Players can understand combat within 10 seconds
- ✅ **Visual Clarity**: Always clear who's winning and what's happening
- ✅ **Engaging Combat**: Combat feels satisfying and skill-based
- ✅ **Thematic Consistency**: Maintains medieval/heroic game theme
- ✅ **Smooth Performance**: 60fps combat with no lag or stuttering

### 🏆 Polish Standards
- ✅ **Professional Feel**: Combat quality matches existing tournament system
- ✅ **Accessibility**: Clear visual and audio feedback for all actions
- ✅ **Replayability**: Each match feels unique based on player choices
- ✅ **Spectacle**: Exciting to watch for tournament observers
- ✅ **Skill Ceiling**: Depth for players who want to master the combat

## Development Phases

### Phase 1: Core Combat (MVP)
- Basic movement and attack system
- Health management and victory conditions
- Simple visual feedback
- Integration with tournament system

### Phase 2: Path Differentiation
- Implement unique mechanics for each stat path
- Visual effects for different abilities
- Balanced gameplay testing

### Phase 3: Polish & Effects
- Advanced animations and particles
- Audio integration and combat music
- Victory celebrations and transitions
- Performance optimization

### Phase 4: Final Integration
- Seamless tournament flow testing
- All resolution support
- Audio system integration
- Bug fixes and final polish

This combat system will transform Throne of Valor from a tournament management game into a complete fighting tournament experience, where skill and strategy determine the champions of the realm.