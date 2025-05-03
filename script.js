
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 50,
    y: 550,
    width: 30,
    height: 50,
    color: "#6d4c41",
    dx: 0,
    dy: 0,
    onGround: false
};

const gravity = 0.8;
const ground = 600;
let obstacles = [{ x: 200, y: 580, width: 50, height: 20 }, { x: 300, y: 560, width: 50, height: 20 }];
let treasure = { x: 600, y: 550, width: 40, height: 40 };
let gameWon = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = "#ff7675";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function drawTreasure() {
    ctx.fillStyle = "#f9ca24";
    ctx.fillRect(treasure.x, treasure.y, treasure.width, treasure.height);
}

function movePlayer() {
    player.dy += gravity;
    player.x += player.dx;
    player.y += player.dy;

    // حدود الأرض
    if (player.y + player.height >= ground) {
        player.y = ground - player.height;
        player.dy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    // التصادم مع العقبات
    for (let obs of obstacles) {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y + player.height >= obs.y &&
            player.y + player.height <= obs.y + obs.height
        ) {
            player.y = obs.y - player.height;
            player.dy = 0;
            player.onGround = true;
        }
    }

    // الفوز
    if (
        player.x < treasure.x + treasure.width &&
        player.x + player.width > treasure.x &&
        player.y < treasure.y + treasure.height &&
        player.y + player.height > treasure.y
    ) {
        gameWon = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    drawTreasure();

    if (gameWon) {
        ctx.fillStyle = "#2d3436";
        ctx.font = "24px sans-serif";
        ctx.fillText("لقد وجدت الكنز!", 90, 300);
        return;
    }

    movePlayer();
    requestAnimationFrame(draw);
}

document.getElementById("left").addEventListener("touchstart", () => player.dx = -3);
document.getElementById("right").addEventListener("touchstart", () => player.dx = 3);
document.getElementById("left").addEventListener("touchend", () => player.dx = 0);
document.getElementById("right").addEventListener("touchend", () => player.dx = 0);

document.getElementById("jump").addEventListener("click", () => {
    if (player.onGround) {
        player.dy = -12;
        player.onGround = false;
    }
});

draw();
