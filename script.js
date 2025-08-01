document.addEventListener('DOMContentLoaded', () => {
    // --- Screen Elements ---
    const nameEntryScreen = document.getElementById('nameEntryScreen');
    const shipSelectionScreen = document.getElementById('shipSelectionScreen');
    const gameWrapper = document.getElementById('game-wrapper');
    
    // --- Input Elements ---
    const playerNameInput = document.getElementById('playerNameInput');
    const continueButton = document.getElementById('continueButton');
    const selectableShips = document.querySelectorAll('.selectable-ship');
    const startGameButton = document.getElementById('startGameButton');
    const restartButton = document.getElementById('restartButton');
    
    // --- Game Elements ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const scoreEl = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreEl = document.getElementById('finalScore');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    
    // --- Game State ---
    let playerName = "Player";
    let highScore = localStorage.getItem('galacticAnnihilatorHighScore') || 0;
    let selectedShipSrc = null;
    const playerImage = new Image();
    const enemyImage = new Image();
    let animationFrameId;
    let gameRunning = true;

    // --- Initial Flow Logic ---
    continueButton.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            playerName = name;
        }
        nameEntryScreen.classList.add('hidden');
        shipSelectionScreen.classList.remove('hidden');
    });

    selectableShips.forEach(ship => {
        ship.addEventListener('click', () => {
            selectableShips.forEach(s => s.classList.remove('selected'));
            ship.classList.add('selected');
            selectedShipSrc = ship.dataset.shipSrc;
            startGameButton.disabled = false;
            startGameButton.classList.remove('bg-gray-600', 'text-gray-400', 'cursor-not-allowed');
            startGameButton.classList.add('bg-cyan-500', 'hover:bg-cyan-400', 'text-gray-900');
        });
    });

    // --- Image Loading Logic ---
    startGameButton.addEventListener('click', () => {
        if (!selectedShipSrc) return;

        startGameButton.textContent = 'Loading Assets...';
        startGameButton.disabled = true;

        playerImage.src = selectedShipSrc;
        playerImage.onload = () => {
            // IMPORTANT: Update this path to your local enemy image
            enemyImage.src = 'SpaceshipImages/EvilShip01.png';
            enemyImage.onload = () => {
                shipSelectionScreen.classList.add('hidden');
                gameWrapper.classList.remove('hidden');
                resizeCanvas();
                init();
            };
        };
    });

    // --- Game Configuration & State Variables ---
    let config = {
        player: { width: 50, height: 45, speed: 7 },
        bullet: { width: 4, height: 12, speed: 10, color: '#ffffff' },
        enemy: { width: 40, height: 32, speed: 2, spawnInterval: 1000 },
        shootCooldown: 250
    };
    let player, bullets, enemies, keys, score, lastShotTime, enemySpawnTimer;
    let isMovingLeft = false, isMovingRight = false;

    function resizeCanvas() {
        const { width, height } = container.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        if (player) {
            player.x = (canvas.width - config.player.width) / 2;
            player.y = canvas.height - config.player.height - 20;
        }
    }

    function init() {
        gameRunning = true;
        gameOverScreen.classList.add('hidden');
        gameOverScreen.classList.remove('flex');
        canvas.focus();
        player = {
            x: (canvas.width - config.player.width) / 2,
            y: canvas.height - config.player.height - 20,
            width: config.player.width,
            height: config.player.height,
            speed: config.player.speed
        };
        bullets = [];
        enemies = [];
        keys = {};
        score = 0;
        lastShotTime = 0;
        isMovingLeft = false;
        isMovingRight = false;
        scoreEl.textContent = 'Score: 0';
        if (enemySpawnTimer) clearInterval(enemySpawnTimer);
        enemySpawnTimer = setInterval(spawnEnemy, config.enemy.spawnInterval);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        gameLoop();
    }

    restartButton.addEventListener('click', init);
    
    function addControlListeners(button, direction) {
        const start = (e) => { e.preventDefault(); if (direction === 'left') isMovingLeft = true; else isMovingRight = true; };
        const end = (e) => { e.preventDefault(); if (direction === 'left') isMovingLeft = false; else isMovingRight = false; };
        button.addEventListener('mousedown', start);
        button.addEventListener('touchstart', start);
        button.addEventListener('mouseup', end);
        button.addEventListener('touchend', end);
        button.addEventListener('mouseleave', end);
    }
    addControlListeners(leftButton, 'left');
    addControlListeners(rightButton, 'right');

    function drawPlayer() { ctx.drawImage(playerImage, player.x, player.y, player.width, player.height); }
    function drawBullets() {
        ctx.fillStyle = config.bullet.color;
        bullets.forEach(bullet => { ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height); });
    }
    function drawEnemies() {
        enemies.forEach(enemy => { ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height); });
    }

    function updatePlayer() {
        if ((keys['ArrowLeft'] || isMovingLeft) && player.x > 0) { player.x -= player.speed; }
        if ((keys['ArrowRight'] || isMovingRight) && player.x < canvas.width - player.width) { player.x += player.speed; }
    }
    function updateBullets() {
        const now = Date.now();
        if (now - lastShotTime > config.shootCooldown) {
            bullets.push({ x: player.x + player.width / 2 - config.bullet.width / 2, y: player.y, width: config.bullet.width, height: config.bullet.height, speed: config.bullet.speed });
            lastShotTime = now;
        }
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= bullets[i].speed;
            if (bullets[i].y < -bullets[i].height) { bullets.splice(i, 1); }
        }
    }
    function spawnEnemy() {
        if (!gameRunning) return;
        enemies.push({ x: Math.random() * (canvas.width - config.enemy.width), y: -config.enemy.height, width: config.enemy.width, height: config.enemy.height, speed: config.enemy.speed });
    }
    function updateEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;
            if (enemies[i].y > canvas.height) {
                gameOver();
                break;
            }
        }
    }
    
    function checkCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (bullets[i] && enemies[j] && bullets[i].x < enemies[j].x + enemies[j].width && bullets[i].x + bullets[i].width > enemies[j].x && bullets[i].y < enemies[j].y + enemies[j].height && bullets[i].y + bullets[i].height > enemies[j].y) {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += 10;
                    scoreEl.textContent = `Score: ${score}`;
                    break; 
                }
            }
        }
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (player.x < enemies[i].x + enemies[i].width && player.x + player.width > enemies[i].x && player.y < enemies[i].y + enemies[i].height && player.y + player.height > enemies[i].y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        if (!gameRunning) return; // Prevent multiple calls
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        clearInterval(enemySpawnTimer);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('galacticAnnihilatorHighScore', highScore);
        }

        finalScoreEl.textContent = `${playerName}'s Score: ${score}`;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.classList.add('flex');
    }

    function gameLoop() {
        if (!gameRunning) return;
        updatePlayer();
        updateBullets();
        updateEnemies();
        checkCollisions();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawBullets();
        drawEnemies();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
});
