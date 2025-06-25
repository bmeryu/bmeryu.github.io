// Obtención de elementos del DOM
const splashScreen = document.getElementById('splash-screen');
const continueButton = document.getElementById('continue-button');
const gameWrapper = document.getElementById('game-wrapper');
const gameHeader = document.getElementById('game-header');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Contexto 2D para dibujar en el canvas

const player1HealthBar = document.getElementById('player1HealthBar');
const player2HealthBar = document.getElementById('player2HealthBar');
const player1PowerBar = document.getElementById('player1PowerBar');
const player2PowerBar = document.getElementById('player2PowerBar');
const player1NameDisplay = document.getElementById('player1NameDisplay');
const player2NameDisplay = document.getElementById('player2NameDisplay');

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameOverModal = document.getElementById('gameOverModal');
const winnerMessage = document.getElementById('winnerMessage');
const gameOverMessage = document.getElementById('gameOverMessage');
const controlsPanel = document.getElementById('controls-panel');

const characterGrid = document.getElementById('character-grid');
const p1SelectedCharImg = document.getElementById('p1-selected-char-img');
const p1SelectedCharName = document.getElementById('p1-selected-char-name');
const p2SelectedCharImg = document.getElementById('p2-selected-char-img');
const p2SelectedCharName = document.getElementById('p2-selected-char-name');
const selectionPrompt = document.getElementById('selection-prompt');

// Constantes del juego
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const GRAVITY = 0.7;
const BASE_PLAYER_SPEED = 4;
const BASE_JUMP_STRENGTH = 15;
const MAX_HEALTH = 150;
const PUNCH_DAMAGE = 10;
const KICK_DAMAGE = 13;
const PUNCH_RANGE = 50;
const KICK_RANGE = 60;
const ATTACK_ANIMATION_DURATION = 150;
const ATTACK_LOGIC_DURATION = 200;
const ATTACK_COOLDOWN = 550;
const BASE_KNOCKBACK_STRENGTH = 12;
const HIT_EFFECT_LIFETIME = 30;
const POWER_GAIN_PER_CLICK = 0.5;

// Constantes de la IA
const AI_ACTION_INTERVAL = 250;
const AI_MOVE_CHANCE = 0.7;
const AI_JUMP_CHANCE = 0.15;
const AI_ATTACK_CHANCE_IN_RANGE = 0.75;
const AI_KICK_CHANCE = 0.4;

// Constantes de poder y ataques especiales
const MAX_POWER = 150;
const POWER_GAIN_PER_HIT = 25;
const SUPER_PUNCH_DAMAGE = 30;
const SUPER_KICK_DAMAGE = 35;

// Constantes de Piraña
const PIRANHA_PROJECTILE_SPEED = 8;
const PIRANHA_PROJECTILE_LIFESPAN = 60;
const PIRANHA_PROJECTILE_WIDTH = 30;
const PIRANHA_PROJECTILE_HEIGHT = 20;
const PIRANHA_PROJECTILE_DAMAGE = 15;
const PIRANHA_PROJECTILE_COUNT = 3;

// Constantes de La Ex
const MONEY_RAIN_COUNT = 5;
const MONEY_RAIN_WAD_WIDTH = 30;
const MONEY_RAIN_WAD_HEIGHT = 20;
const MONEY_RAIN_DAMAGE = 10;
const MONEY_RAIN_INITIAL_Y = -MONEY_RAIN_WAD_HEIGHT;
const COIN_RAIN_DAMAGE = 5;

// Constantes de Burric
const CALCULATOR_PROJECTILE_LIFESPAN = 120;
const CALCULATOR_PROJECTILE_WIDTH = 40;
const CALCULATOR_PROJECTILE_HEIGHT = 50;
const CALCULATOR_PROJECTILE_DAMAGE = 18;
const CALCULATOR_PROJECTILE_COUNT = 5;
const CALCULATOR_INITIAL_Y = -CALCULATOR_PROJECTILE_HEIGHT;

// Constantes de Matthei Bolt
const BOLT_DASH_SPEED = 22.5;
const BOLT_DASH_COUNT = 5;
const BOLT_DASH_DAMAGE = 8;

// Constantes de El Zanjas
const ZANJAS_CRACK_DAMAGE = 40;
const ZANJAS_SWALLOWED_DURATION = 90;
const ZANJAS_CRACK_WIDTH = 150;
const ZANJAS_CRACK_MAX_HEIGHT = 80;
const ZANJAS_CRACK_LIFESPAN = 180;

// Constantes de Carolina Papelucho
const PAPELUCHO_STUN_DURATION = 180;
const PAPELUCHO_PAPER_COUNT = 20;
const PAPELUCHO_PAPER_WIDTH = 25;
const PAPELUCHO_PAPER_HEIGHT = 35;
const PAPELUCHO_PAPER_DAMAGE = 1;

// Constantes de Orsini Love
const ORSINI_KISS_SPEED = 7;
const ORSINI_KISS_LIFESPAN = 90;
const ORSINI_KISS_WIDTH = 30;
const ORSINI_KISS_HEIGHT = 25;
const ORSINI_KISS_DAMAGE = 18;
const ORSINI_KISS_COUNT = 2;

// Constantes de Escape Room Jackson
const JACKSON_INVISIBILITY_DURATION = 120;
const JACKSON_CONFUSION_DURATION = 120;
const SMOKE_PARTICLE_COUNT = 30;

// --- MODIFICACIÓN TÍA COTE INICIO ---
// Constantes para el superpoder de Tía Cote
const TIA_COTE_BEAM_DURATION = 120; 
const TIA_COTE_BEAM_WIDTH = 90;
const TIA_COTE_BEAM_DAMAGE_PER_FRAME = 0.5;
const TIA_COTE_HEART_COUNT = 15;
const TIA_COTE_HEART_SPEED = 6;
// --- MODIFICACIÓN TÍA COTE FIN ---

// Variables para el efecto de temblor de pantalla
let screenShakeMagnitude = 0;
let screenShakeTimeLeft = 0;

let gameActive = false;
let players = [];
let activeHitEffects = [];
const hitWords = ["¡POW!", "¡BAM!", "¡CRASH!", "¡KAPOW!", "¡WHAM!", "¡SLAP!", "¡BOOM!", "¡BANG!", "¡PUFF!", "¡THWACK!"];
const hitWordColors = ["#FFD700", "#FF4500", "#ADFF2F", "#00FFFF", "#FF69B4", "#FFFF00", "#FF1493"];

let backgroundMusic;

const characterBackgrounds = {
    "El Zanjas": ["img/lazanja.png"],
    "Tía Cote": ["img/glitter.png"],
    "Escape Room Jackson": ["img/happyhour.png"],
    "Piraña": ["img/lamoneda.png"],
    "La Ex": ["img/lamoneda.png"],
    "Matthei Bolt": ["img/pasillomoneda.png"],
    "Burric": ["img/pasillomoneda.png"],
    "Orsini Love": ["img/pasillomoneda.png"],
    "Carolina Papelucho": ["img/pasillomoneda.png"]
};

const characterAssets = [
    { name: "Piraña", baseColor: '#e0e0e0', previewImage: "img/personaje1-cabeza.png", textures: { head: "img/personaje1-cabeza.png", torso: "img/personaje1-torso.png", upperArm: "img/personaje1-brazos.png", foreArm: "img/personaje1-antebrazos.png", thigh: "img/personaje1-muslos.png", lowerLeg: "img/personaje1-piernasbajas.png", glove_r: "img/personaje1-guantes-d.png", glove_l: "img/personaje1-guantes-i.png", shoe: "img/personaje1-zapatos.png", superEffectTexture: "img/personaje1-super-effect.png" } },
    { name: "La Ex", baseColor: '#c0392b', previewImage: "img/personaje2-cabeza.png", textures: { head: "img/personaje2-cabeza.png", torso: "img/personaje2-torso.png", upperArm: "img/personaje2-brazos.png", foreArm: "img/personaje2-antebrazos.png", thigh: "img/personaje2-muslos.png", lowerLeg: "img/personaje2-piernasbajas.png", glove_r: "img/personaje2-guantes-d.png", glove_l: "img/personaje2-guantes-i.png", shoe: "img/personaje2-zapatos.png", superEffectTexture: "img/personaje2-super-effect.png" } },
    { name: "Burric", baseColor: '#27ae60', previewImage: "img/personaje3-cabeza.png", textures: { head: "img/personaje3-cabeza.png", torso: "img/personaje3-torso.png", upperArm: "img/personaje3-brazos.png", foreArm: "img/personaje3-antebrazos.png", thigh: "img/personaje3-muslos.png", lowerLeg: "img/personaje3-piernasbajas.png", glove_r: "img/personaje3-guantes-d.png", glove_l: "img/personaje3-guantes-i.png", shoe: "img/personaje3-zapatos.png", superEffectTexture: "img/personaje3-super-effect.png" } },
    { name: "Matthei Bolt", baseColor: '#f39c12', previewImage: "img/personaje4-cabeza.png", textures: { head: "img/personaje4-cabeza.png", torso: "img/personaje4-torso.png", upperArm: "img/personaje4-brazos.png", foreArm: "img/personaje4-antebrazos.png", thigh: "img/personaje4-muslos.png", lowerLeg: "img/personaje4-piernasbajas.png", glove_r: "img/personaje4-guantes-d.png", glove_l: "img/personaje4-guantes-i.png", shoe: "img/personaje4-zapatos.png", superEffectTexture: "img/personaje4-super-effect.png", yellowVest: "img/matthei-chaleco.png"  } },
    { name: "Carolina Papelucho", baseColor: '#d35400', previewImage: "img/personaje5-cabeza.png", textures: { head: "img/personaje5-cabeza.png", torso: "img/personaje5-torso.png", upperArm: "img/personaje5-brazos.png", foreArm: "img/personaje5-antebrazos.png", thigh: "img/personaje5-muslos.png", lowerLeg: "img/personaje5-piernasbajas.png", glove_r: "img/personaje5-guantes-d.png", glove_l: "img/personaje5-guantes-i.png", shoe: "img/personaje5-zapatos.png", superEffectTexture: "img/personaje5-super-effect.png" } },
    { name: "El Zanjas", baseColor: '#7f8c8d', previewImage: "img/personaje6-cabeza.png", textures: { head: "img/personaje6-cabeza.png", torso: "img/personaje6-torso.png", upperArm: "img/personaje6-brazos.png", foreArm: "img/personaje6-antebrazos.png", thigh: "img/personaje6-muslos.png", lowerLeg: "img/personaje6-piernasbajas.png", glove_r: "img/personaje6-guantes-d.png", glove_l: "img/personaje6-guantes-i.png", shoe: "img/personaje6-zapatos.png", superEffectTexture: "img/personaje6-super-effect.png" } },
    { name: "Orsini Love", baseColor: '#ff69b4', previewImage: "img/personaje7-cabeza.png", textures: { head: "img/personaje7-cabeza.png", torso: "img/personaje7-torso.png", upperArm: "img/personaje7-brazos.png", foreArm: "img/personaje7-antebrazos.png", thigh: "img/personaje7-muslos.png", lowerLeg: "img/personaje7-piernasbajas.png", glove_r: "img/personaje7-guantes-d.png", glove_l: "img/personaje7-guantes-i.png", shoe: "img/personaje7-zapatos.png", superEffectTexture: "img/personaje7-super-effect.png" } },
    { name: "Escape Room Jackson", baseColor: '#6c757d', previewImage: "img/personaje8-cabeza.png", textures: { head: "img/personaje8-cabeza.png", torso: "img/personaje8-torso.png", upperArm: "img/personaje8-brazos.png", foreArm: "img/personaje8-antebrazos.png", thigh: "img/personaje8-muslos.png", lowerLeg: "img/personaje8-piernasbajas.png", glove_r: "img/personaje8-guantes-d.png", glove_l: "img/personaje8-guantes-i.png", shoe: "img/personaje8-zapatos.png", superEffectTexture: "img/personaje8-super-effect.png" } },
    { name: "Tía Cote", baseColor: '#9b59b6', previewImage: "img/personaje9-cabeza.png", textures: { head: "img/personaje9-cabeza.png", torso: "img/personaje9-torso.png", upperArm: "img/personaje9-brazos.png", foreArm: "img/personaje9-antebrazos.png", thigh: "img/personaje9-muslos.png", lowerLeg: "img/personaje9-piernasbajas.png", glove_r: "img/personaje9-guantes-d.png", glove_l: "img/personaje9-guantes-i.png", shoe: "img/personaje9-zapatos.png", superEffectTexture: "img/personaje9-super-effect.png" } }
];

const bodyTypeStats = {
    normal: { width: 50, height: 100, speedMod: 1.0, damageMod: 1.0, rangeMod: 1.0, healthMod: 1.0 }
};

const ARM_GUARD_UPPER_ANGLE = Math.PI / 4.2;
const ARM_GUARD_FOREARM_BEND = -Math.PI / 1.6;
const ARM_PUNCH_UPPER_EXTEND_ANGLE = -Math.PI / 18;
const ARM_PUNCH_FOREARM_EXTEND_ANGLE = Math.PI / 30;
const ARM_PUNCH_UPPER_RECOIL_ANGLE = -Math.PI / 3;
const ARM_PUNCH_FOREARM_RECOIL_ANGLE = Math.PI / 2.2;
const LEG_ANGLE_RESTING_FRONT = Math.PI / 2 - Math.PI / 20;
const LEG_ANGLE_RESTING_BACK = Math.PI / 2 + Math.PI / 30;
const LEG_ANGLE_KICK_STRIKE = -Math.PI / 18;
const LEG_ANGLE_KICK_SUPPORT = Math.PI / 2 + Math.PI / 6;

let playerSelectedCharIndex = -1;
let pcSelectedCharIndex = -1;
let smokeParticles = [];

class Player {
    constructor(x, initialY, characterAsset, isPlayer1 = true, facingRight = true) {
        this.name = characterAsset.name;
        this.x = x;
        this.baseColor = characterAsset.baseColor;
        this.isPlayer1 = isPlayer1;
        this.facingRight = facingRight;

        this.headTextureImage = this.loadTexture(characterAsset.textures.head);
        this.bodyTextureImage = this.loadTexture(characterAsset.textures.torso);
        this.upperArmTextureImage = this.loadTexture(characterAsset.textures.upperArm);
        this.foreArmTextureImage = this.loadTexture(characterAsset.textures.foreArm);
        this.thighTextureImage = this.loadTexture(characterAsset.textures.thigh);
        this.lowerLegTextureImage = this.loadTexture(characterAsset.textures.lowerLeg);
        this.gloveTextureImage_r = this.loadTexture(characterAsset.textures.glove_r);
        this.gloveTextureImage_l = this.loadTexture(characterAsset.textures.glove_l);
        this.shoeTextureImage = this.loadTexture(characterAsset.textures.shoe);
        this.superEffectTextureImage = this.loadTexture(characterAsset.textures.superEffectTexture);
        this.yellowVestTextureImage = this.loadTexture(characterAsset.textures.yellowVest);

        this.setStats();
        this.y = initialY - this.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.health = MAX_HEALTH * this.healthMod;
        this.maxHealth = MAX_HEALTH * this.healthMod;

        this.power = 0;
        this.maxPower = MAX_POWER;
        this.isSuperCharged = false;
        this.isPerformingSuperAttackAnimation = false;
        this.activePiranhaProjectiles = [];
        this.activeMoneyWads = [];
        this.activeCoins = [];
        this.activeCalculators = [];
        this.activePapers = [];
        this.activeKisses = [];
        
        // --- MODIFICACIÓN TÍA COTE INICIO ---
        // (Se ha eliminado la variable activeTeddies, ya no se usa)
        this.isCastingBeam = false;
        this.beamTimer = 0;
        this.activeBeamHearts = [];
        // --- MODIFICACIÓN TÍA COTE FIN ---

        this.isDashing = false;
        this.dashCount = 0;
        this.dashTargetX = 0;
        this.dashDamageApplied = false;
        this.trail = [];

        this.isPunching = false;
        this.isKicking = false;
        this.attackVisualActive = false;
        this.lastAttackTime = 0;
        this.lastAIDecisionTime = 0;
        this.currentAction = null;
        this.attackArm = null;
        this.nextPunchArm = 'right';

        this.isCastingCrack = false;
        this.crackTimer = 0;
        this.crackOpponentHit = false;
        this.crackCenterX = 0;

        this.isSwallowed = false;
        this.swallowedTimer = 0;
        this.isStunned = false;
        this.stunTimer = 0;

        this.isInvisible = false;
        this.invisibilityTimer = 0;
        this.isConfused = false;
        this.confusionTimer = 0;
        this.confusionBlinkTimer = 0;
        this.showBlurred = false;
    }

    loadTexture(src) {
        if (!src) return null;
        const img = new Image();
        img.src = src;
        return img;
    }

    setStats() {
        const stats = bodyTypeStats.normal;
        this.width = stats.width;
        this.height = stats.height;
        this.speed = BASE_PLAYER_SPEED * stats.speedMod;
        this.punchDamage = PUNCH_DAMAGE * stats.damageMod;
        this.kickDamage = KICK_DAMAGE * stats.damageMod;
        this.punchRange = PUNCH_RANGE * stats.rangeMod;
        this.kickRange = KICK_RANGE * stats.rangeMod;
        this.attackCooldown = ATTACK_COOLDOWN;
        this.jumpStrength = BASE_JUMP_STRENGTH;
        this.knockbackStrength = BASE_KNOCKBACK_STRENGTH;
        this.healthMod = stats.healthMod;
        let headSizeRatioFactor = 1.5, torsoHeightRatio = 0.5, torsoWidthRatio = 0.8, armWidthRatio = 0.20, armLengthTotalRatio = 0.85, legSegmentsTotalHeightRatio = 0.26, shoeHeightRatio = 0.22, shoeWidthFactor = 1.6, legWidthRatio = 0.22, gloveSizeFactor = 3.0;
        this.headSize = (this.width * 0.5) * headSizeRatioFactor;
        this.torsoHeight = this.height * torsoHeightRatio;
        this.torsoWidth = this.width * torsoWidthRatio;
        this.armWidth = this.width * armWidthRatio;
        const totalArmLength = this.torsoHeight * armLengthTotalRatio;
        this.upperArmLength = totalArmLength * 0.5;
        this.foreArmLength = totalArmLength * 0.5;
        const totalLegSegmentsCombinedH = this.height * legSegmentsTotalHeightRatio;
        this.thighHeight = totalLegSegmentsCombinedH * 0.5;
        this.lowerLegHeight = totalLegSegmentsCombinedH * 0.5;
        this.legWidth = this.torsoWidth * legWidthRatio;
        this.gloveSize = this.armWidth * gloveSizeFactor;
        this.shoeHeight = this.height * shoeHeightRatio;
        this.shoeWidth = this.legWidth * shoeWidthFactor;
    }

    drawPartWithTexture(partName, destX, destY, destWidth, destHeight, shouldFlipHorizontally = false) {
        let currentTexture = null;
        if (partName === 'head') currentTexture = this.headTextureImage;
        else if (partName === 'torso') currentTexture = this.bodyTextureImage;
        else if (partName === 'arm_upper') currentTexture = this.upperArmTextureImage;
        else if (partName === 'arm_fore') currentTexture = this.foreArmTextureImage;
        else if (partName === 'thigh') currentTexture = this.thighTextureImage;
        else if (partName === 'lower_leg') currentTexture = this.lowerLegTextureImage;

        if (currentTexture && currentTexture.complete && currentTexture.width > 0) {
            ctx.save();
            if (shouldFlipHorizontally) {
                ctx.translate(destX + destWidth, destY);
                ctx.scale(-1, 1);
                ctx.drawImage(currentTexture, 0, 0, destWidth, destHeight);
            } else {
                ctx.drawImage(currentTexture, destX, destY, destWidth, destHeight);
            }
            ctx.restore();
        }
    }

    drawArm(isPlayerRightArmActual) {
        ctx.save();
        const totalLegSegmentsHeight = this.thighHeight + this.lowerLegHeight;
        const torsoTopY = this.y + (this.height - this.torsoHeight - totalLegSegmentsHeight - this.shoeHeight);
        const baseShoulderY = torsoTopY + this.torsoHeight * 0.25;
        let shoulderXOffset = this.facingRight ? (isPlayerRightArmActual ? this.torsoWidth * 0.30 : this.torsoWidth * 0.70) : (isPlayerRightArmActual ? this.torsoWidth * 0.70 : this.torsoWidth * 0.30);
        const shoulderX = this.x + (this.width - this.torsoWidth) / 2 + shoulderXOffset;
        const shoulderY = baseShoulderY;
        ctx.translate(shoulderX, shoulderY);
        let finalUpperArmAngle, finalForeArmAngle;
        
        // --- MODIFICACIÓN TÍA COTE INICIO ---
        if (this.isCastingBeam) {
            finalUpperArmAngle = -Math.PI / 2.5;
            finalForeArmAngle = Math.PI / 3;
        } else { // --- FIN DE LA MODIFICACIÓN, la lógica original sigue abajo
            const isPunchingThisArm = this.isPunching && this.attackVisualActive && ((isPlayerRightArmActual && this.attackArm === 'right') || (!isPlayerRightArmActual && this.attackArm === 'left'));
            if (isPunchingThisArm) {
                finalUpperArmAngle = this.facingRight ? ARM_PUNCH_UPPER_EXTEND_ANGLE : Math.PI - ARM_PUNCH_UPPER_EXTEND_ANGLE;
                finalForeArmAngle = this.facingRight ? ARM_PUNCH_FOREARM_EXTEND_ANGLE : -ARM_PUNCH_FOREARM_EXTEND_ANGLE;
            } else if (this.isPunching && this.attackVisualActive) {
                finalUpperArmAngle = this.facingRight ? ARM_PUNCH_UPPER_RECOIL_ANGLE : Math.PI - ARM_PUNCH_UPPER_RECOIL_ANGLE;
                finalForeArmAngle = this.facingRight ? ARM_PUNCH_FOREARM_RECOIL_ANGLE : -ARM_PUNCH_FOREARM_RECOIL_ANGLE;
            } else {
                finalUpperArmAngle = this.facingRight ? ARM_GUARD_UPPER_ANGLE : Math.PI - ARM_GUARD_UPPER_ANGLE;
                finalForeArmAngle = this.facingRight ? ARM_GUARD_FOREARM_BEND : -ARM_GUARD_FOREARM_BEND;
            }
        }
        
        ctx.save();
        ctx.rotate(finalUpperArmAngle);
        this.drawPartWithTexture('arm_upper', 0, -this.armWidth / 2, this.upperArmLength, this.armWidth, false);
        ctx.translate(this.upperArmLength, 0);
        ctx.rotate(finalForeArmAngle);
        this.drawPartWithTexture('arm_fore', 0, -this.armWidth / 2, this.foreArmLength, this.armWidth, false);
        let gloveTextureToUse = this.facingRight ? this.gloveTextureImage_r : this.gloveTextureImage_l;
        if (gloveTextureToUse && gloveTextureToUse.complete && gloveTextureToUse.width > 0) {
            const gloveDrawX = this.foreArmLength - (this.armWidth * 0.8);
            const gloveDrawY = -this.gloveSize / 2;
            ctx.drawImage(gloveTextureToUse, gloveDrawX, gloveDrawY, this.gloveSize, this.gloveSize);
        }
        ctx.restore();
        ctx.restore();
    }

    drawLeg(isFrontLeg) {
        ctx.save();
        const totalLegSegmentsHeight = this.thighHeight + this.lowerLegHeight;
        const hipXOffsetFactor = isFrontLeg ? 0.65 : 0.35;
        const hipXOffset = this.facingRight ? this.torsoWidth * hipXOffsetFactor : this.torsoWidth * (1 - hipXOffsetFactor);
        const hipYOffset = this.torsoHeight;
        const hipX = this.x + (this.width - this.torsoWidth) / 2 + hipXOffset;
        const hipY = this.y + (this.height - this.torsoHeight - totalLegSegmentsHeight - this.shoeHeight) + hipYOffset;
        ctx.translate(hipX, hipY);
        let angle;
        if (this.isKicking && this.attackVisualActive) {
            angle = isFrontLeg ? (this.facingRight ? LEG_ANGLE_KICK_STRIKE : Math.PI - LEG_ANGLE_KICK_STRIKE) : (this.facingRight ? LEG_ANGLE_KICK_SUPPORT : Math.PI - LEG_ANGLE_KICK_SUPPORT);
        } else {
            angle = isFrontLeg ? (this.facingRight ? LEG_ANGLE_RESTING_FRONT : Math.PI - LEG_ANGLE_RESTING_FRONT) : (this.facingRight ? LEG_ANGLE_RESTING_BACK : Math.PI - LEG_ANGLE_RESTING_BACK);
        }
        ctx.rotate(angle);
        this.drawPartWithTexture('thigh', 0, -this.legWidth / 2, this.thighHeight, this.legWidth, false);
        ctx.translate(this.thighHeight, 0);
        this.drawPartWithTexture('lower_leg', 0, -this.legWidth / 2, this.lowerLegHeight, this.legWidth, false);
        ctx.translate(this.lowerLegHeight - this.shoeHeight * 0.05, 0);
        if (this.shoeTextureImage && this.shoeTextureImage.complete && this.shoeTextureImage.width > 0) {
            ctx.drawImage(this.shoeTextureImage, -this.shoeWidth / 2, -this.shoeHeight / 2, this.shoeWidth, this.shoeHeight);
        }
        ctx.restore();
    }

    // --- MODIFICACIÓN TÍA COTE INICIO ---
    // Nuevas funciones para dibujar el superpoder de Tía Cote
    drawTiaCoteBeam() {
        if (!this.isCastingBeam) return;
        const beamProgress = 1 - (this.beamTimer / TIA_COTE_BEAM_DURATION);
        const currentAlpha = 0.8 * Math.sin(beamProgress * Math.PI);
        ctx.save();
        const beamY = this.y + this.height * 0.3;
        const beamStartX = this.facingRight ? this.x + this.width : 0;
        const beamTotalWidth = this.facingRight ? CANVAS_WIDTH - beamStartX : this.x;
        const gradient = ctx.createLinearGradient(beamStartX, beamY, beamStartX, beamY + TIA_COTE_BEAM_WIDTH);
        gradient.addColorStop(0, `rgba(255, 255, 224, ${currentAlpha * 0.5})`);
        gradient.addColorStop(0.5, `rgba(253, 224, 71, ${currentAlpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 224, ${currentAlpha * 0.5})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(beamStartX, beamY, beamTotalWidth, TIA_COTE_BEAM_WIDTH);
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.9 * currentAlpha})`;
            ctx.fillRect(beamStartX + Math.random() * beamTotalWidth, beamY + Math.random() * TIA_COTE_BEAM_WIDTH, Math.random() * 3 + 1, Math.random() * 3 + 1);
        }
        ctx.restore();
    }

    drawBeamHearts() {
        if (!this.isCastingBeam) return;
        this.activeBeamHearts.forEach(heart => {
            ctx.save();
            ctx.globalAlpha = heart.alpha;
            ctx.fillStyle = '#ff69b4';
            ctx.beginPath();
            const d = heart.size;
            const k = heart.y;
            ctx.moveTo(heart.x, k - d / 4);
            ctx.bezierCurveTo(heart.x, k - (d * 5) / 4, heart.x - d, k - d / 2, heart.x - d, k);
            ctx.bezierCurveTo(heart.x - d, k + d / 2, heart.x, k + d, heart.x, k + d);
            ctx.bezierCurveTo(heart.x, k + d, heart.x + d, k + d / 2, heart.x + d, k);
            ctx.bezierCurveTo(heart.x + d, k - d / 2, heart.x, k - (d * 5) / 4, heart.x, k - d / 4);
            ctx.fill();
            ctx.restore();
        });
    }
    // --- MODIFICACIÓN TÍA COTE FIN ---

    draw() {
        if (this.isInvisible) return;
        ctx.save();

        if (this.isDashing) {
            this.trail.forEach((pos, index) => {
                ctx.globalAlpha = (index / this.trail.length) * 0.5;
                this.drawPlayerModel(pos.x, pos.y);
            });
            ctx.globalAlpha = 1;
        }
        this.drawPlayerModel(this.x, this.y);

        // ... llamadas a dibujar otros proyectiles ...

        // --- MODIFICACIÓN TÍA COTE INICIO ---
        if (this.name === "Tía Cote") {
            this.drawTiaCoteBeam();
            this.drawBeamHearts();
        }
        // --- MODIFICACIÓN TÍA COTE FIN ---

        if (this.isCastingCrack) { this.drawZanjasCrack(); }
        if (this.isConfused) { ctx.font = `bold 24px 'Comic Sans MS'`; ctx.fillStyle = 'yellow'; ctx.textAlign = 'center'; ctx.fillText('???', this.x + this.width / 2, this.y - 20); }
        else if (this.isStunned) { ctx.font = `bold 24px 'Comic Sans MS'`; ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.fillText('!!!', this.x + this.width / 2, this.y - 20); }

        if (this.isPerformingSuperAttackAnimation && this.attackVisualActive && this.superEffectTextureImage && this.superEffectTextureImage.complete) {
            const effectWidth = this.width * 1.5;
            const effectHeight = this.height * 1.5;
            const effectX = this.x + (this.width - effectWidth) / 2;
            const effectY = this.y + (this.height - effectHeight) / 2;
            ctx.globalAlpha = 0.7;
            ctx.drawImage(this.superEffectTextureImage, effectX, effectY, effectWidth, effectHeight);
            ctx.globalAlpha = 1.0;
        }
        ctx.restore();
    }

    drawPlayerModel(x, y) {
        if (this.isSwallowed) { return; }
        const originalX = this.x;
        const originalY = this.y;
        this.x = x;
        this.y = y;

        if (this.showBlurred) { ctx.filter = 'blur(4px)'; } 
        else if ((this.isPerformingSuperAttackAnimation || this.isCastingBeam) && this.attackVisualActive) { ctx.filter = 'brightness(1.75) saturate(2.5)'; }

        const totalLegSegmentsHeight = this.thighHeight + this.lowerLegHeight;
        const torsoGlobalY = this.y + (this.height - this.torsoHeight - totalLegSegmentsHeight - this.shoeHeight);
        const torsoGlobalX = this.x + (this.width - this.torsoWidth) / 2;
        const headGlobalX = this.x + (this.width - this.headSize) / 2;
        const headGlobalY = torsoGlobalY - this.headSize;
        const visuallyBackLegIsFront = !this.facingRight;
        
        this.drawLeg(visuallyBackLegIsFront);
        this.drawLeg(!visuallyBackLegIsFront);
        
        if (this.facingRight) {
            this.drawArm(false);
            this.drawPartWithTexture('torso', torsoGlobalX, torsoGlobalY, this.torsoWidth, this.torsoHeight, !this.facingRight);

            // --- MODIFICACIÓN TÍA COTE INICIO: Corazón en el pecho ---
            if (this.name === 'Tía Cote' && this.isCastingBeam) {
                const heartSize = 15 + Math.sin(this.beamTimer * 0.2) * 5;
                const heartX = torsoGlobalX + this.torsoWidth / 2;
                const heartY = torsoGlobalY + this.torsoHeight / 2;
                ctx.save();
                ctx.fillStyle = `rgba(255, 105, 180, ${0.5 + Math.sin(this.beamTimer * 0.2) * 0.5})`;
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#ff69b4';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                const d = heartSize;
                ctx.moveTo(heartX, heartY - d / 4);
                ctx.bezierCurveTo(heartX, heartY - (d * 5) / 4, heartX - d, heartY - d / 2, heartX - d, heartY);
                ctx.bezierCurveTo(heartX - d, heartY + d / 2, heartX, heartY + d, heartX, heartY + d);
                ctx.bezierCurveTo(heartX, heartY + d, heartX + d, heartY + d / 2, heartX + d, heartY);
                ctx.bezierCurveTo(heartX + d, heartY - d / 2, heartX, heartY - (d * 5) / 4, heartX, heartY - d / 4);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            // --- MODIFICACIÓN TÍA COTE FIN ---

            if (this.name === 'Matthei Bolt' && this.isDashing) { this.drawVest(torsoGlobalX, torsoGlobalY); }
            this.drawPartWithTexture('head', headGlobalX, headGlobalY, this.headSize, this.headSize, !this.facingRight);
            this.drawArm(true);
        } else {
            this.drawArm(true);
            this.drawPartWithTexture('torso', torsoGlobalX, torsoGlobalY, this.torsoWidth, this.torsoHeight, !this.facingRight);

            // --- MODIFICACIÓN TÍA COTE INICIO: Corazón en el pecho ---
            if (this.name === 'Tía Cote' && this.isCastingBeam) {
                const heartSize = 15 + Math.sin(this.beamTimer * 0.2) * 5;
                const heartX = torsoGlobalX + this.torsoWidth / 2;
                const heartY = torsoGlobalY + this.torsoHeight / 2;
                ctx.save();
                ctx.fillStyle = `rgba(255, 105, 180, ${0.5 + Math.sin(this.beamTimer * 0.2) * 0.5})`;
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#ff69b4';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                const d = heartSize;
                ctx.moveTo(heartX, heartY - d / 4);
                ctx.bezierCurveTo(heartX, heartY - (d * 5) / 4, heartX - d, heartY - d / 2, heartX - d, heartY);
                ctx.bezierCurveTo(heartX - d, heartY + d / 2, heartX, heartY + d, heartX, heartY + d);
                ctx.bezierCurveTo(heartX, heartY + d, heartX + d, heartY + d / 2, heartX + d, heartY);
                ctx.bezierCurveTo(heartX + d, heartY - d / 2, heartX, heartY - (d * 5) / 4, heartX, heartY - d / 4);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            // --- MODIFICACIÓN TÍA COTE FIN ---

            if (this.name === 'Matthei Bolt' && this.isDashing) { this.drawVest(torsoGlobalX, torsoGlobalY); }
            this.drawPartWithTexture('head', headGlobalX, headGlobalY, this.headSize, this.headSize, !this.facingRight);
            this.drawArm(false);
        }
        ctx.filter = 'none';
        this.x = originalX;
        this.y = originalY;
    }

    // ... El resto de las funciones como updateAI, updateProyectiles, etc. ...
    
    // --- MODIFICACIÓN TÍA COTE INICIO ---
    // Nueva función para actualizar los corazones
    updateBeamHearts() {
        for (let i = this.activeBeamHearts.length - 1; i >= 0; i--) {
            const heart = this.activeBeamHearts[i];
            heart.x += heart.speedX;
            heart.alpha -= 0.015;
            if (heart.alpha <= 0) {
                this.activeBeamHearts.splice(i, 1);
            }
        }
    }

    // Nueva función para actualizar la lógica del rayo
    updateTiaCoteBeam(opponent) {
        if (!this.isCastingBeam) return;
        this.beamTimer--;
        if (this.beamTimer <= 0) {
            this.isCastingBeam = false;
            this.isPerformingSuperAttackAnimation = false;
            this.attackVisualActive = false;
            return;
        }
        const beamY = this.y + this.height * 0.3;
        const beamHitbox = { x: this.facingRight ? this.x + this.width : 0, y: beamY, width: CANVAS_WIDTH, height: TIA_COTE_BEAM_WIDTH };
        const opponentBox = { x: opponent.x, y: opponent.y, width: opponent.width, height: opponent.height };
        if (!opponent.isSwallowed && !opponent.isStunned && beamHitbox.x < opponentBox.x + opponentBox.width && beamHitbox.x + beamHitbox.width > opponentBox.x && beamHitbox.y < opponentBox.y + opponentBox.height && beamHitbox.y + beamHitbox.height > opponentBox.y) {
            opponent.takeDamage(TIA_COTE_BEAM_DAMAGE_PER_FRAME, this.facingRight);
        }
    }
    // --- MODIFICACIÓN TÍA COTE FIN ---

    update() {
        if (this.isSwallowed) { /* ... */ return; }
        if (this.isStunned) { /* ... */ return; }
        
        // --- MODIFICACIÓN TÍA COTE INICIO ---
        const opponent = players.find(p => p !== this);
        if (this.name === "Tía Cote" && opponent) {
            this.updateTiaCoteBeam(opponent);
            this.updateBeamHearts();
        }
        // --- MODIFICACIÓN TÍA COTE FIN ---

        this.updateAI();
        if (this.isInvisible) { /* ... */ return; }
        if (this.isDashing) { /* ... */ return; }
        
        this.x += this.velocityX;
        this.velocityY += GRAVITY;
        this.y += this.velocityY;

        // ... resto de la lógica de update ...
    }

    // ... (resto de las funciones de la clase Player sin cambios)
    
    // --- MODIFICACIÓN TÍA COTE INICIO ---
    // Nueva función para lanzar el superpoder
    launchTiaCoteBeamAttack() {
        this.isCastingBeam = true;
        this.beamTimer = TIA_COTE_BEAM_DURATION;
        this.isPerformingSuperAttackAnimation = true;
        this.attackVisualActive = true;
        this.activeBeamHearts = [];
        for (let i = 0; i < TIA_COTE_HEART_COUNT; i++) {
            this.activeBeamHearts.push({
                x: this.x + this.width / 2,
                y: this.y + this.height * 0.3 + Math.random() * TIA_COTE_BEAM_WIDTH,
                size: Math.random() * 8 + 8,
                speedX: (this.facingRight ? 1 : -1) * (TIA_COTE_HEART_SPEED + Math.random() * 2),
                alpha: 0.5 + Math.random() * 0.5
            });
        }
        screenShakeMagnitude = 8;
        screenShakeTimeLeft = TIA_COTE_BEAM_DURATION;
        // new Audio('audio/angelic-choir.wav').play().catch(e => console.error("Error playing sound:", e));
    }
    // --- MODIFICACIÓN TÍA COTE FIN ---

    _performAttack(isKickMove) {
        if (this.isPunching || this.isKicking || this.isCastingBeam || (Date.now() - this.lastAttackTime < this.attackCooldown)) return;
        let isSuperMove = this.isSuperCharged;
        if (isSuperMove) {
            if (this.name === "Tía Cote") {
                this.launchTiaCoteBeamAttack(); // <-- LLAMADA AL NUEVO SUPER
            } else if (this.name === "Piraña") {
                this.launchPiranhaProjectiles();
            } // ... y así sucesivamente para los otros personajes ...
            
            this.power = 0;
            this.isSuperCharged = false;
            updatePowerBars();
        } else {
            // ... lógica de ataque normal ...
        }
    }
}

// ... (Resto del archivo script.js)
