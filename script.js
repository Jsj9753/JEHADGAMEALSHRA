const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 50, y: 300, width: 30, height: 30, dy: 0, jumping: false };
let ground = 350;
let gravity = 1;
let obstacles = [];
let frame = 0;
let score = 0;

function drawPlayer() {
    ctx.fillStyle = '#b5651d';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = '#d4af37';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

function updateObstacles() {
    if (frame % 100 === 0) {
        obstacles.push({ x: canvas.width, y: ground, width: 20, height: 30 });
    }
    for (let obs of obstacles) {
        obs.x -= 5;
    }
    obstacles = obstacles.filter(o => o.x + o.width > 0);
}

function checkCollision() {
    for (let obs of obstacles) {
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            return true;
        }
    }
    return false;
}

function updatePlayer() {
    if (player.jumping) {
        player.dy += gravity;
        player.y += player.dy;
        if (player.y >= ground - player.height) {
            player.y = ground - player.height;
            player.dy = 0;
            player.jumping = false;
        }
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.fillText("النتيجة: " + score, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    drawScore();
    updateObstacles();
    updatePlayer();
    if (checkCollision()) {
        document.getElementById('message').innerText = 'انتهت اللعبة! نتيجتك: ' + score;
        return;
    }
    score++;
    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !player.jumping) {
        player.jumping = true;
        player.dy = -15;
    }
});

gameLoop();
