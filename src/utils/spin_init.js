// var SCREEN_WIDTH = window.innerWidth;
// var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 400;

var RADIUS = 180;

var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = 1;
var RADIUS_SCALE_MAX = 2;

var QUANTITY = 20;

var canvas;
var context;
var particles;

var mouseX = SCREEN_WIDTH * 0.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;
var time = null;

function init() {

    canvas = document.getElementById('j-spin');

    if (canvas && canvas.getContext) {
        context = canvas.getContext('2d');

        createParticles();

        windowResizeHandler();

        time = setInterval(loop, 1000 / 60);
    }
}

function createParticles() {
    particles = [];

    for (var i = 0; i < QUANTITY; i++) {
        var particle = {
            size: 1,
            position: { x: mouseX, y: mouseY },
            offset: { x: 0, y: 0 },
            shift: { x: mouseX, y: mouseY },
            speed: 0.01 + Math.random() * 0.04,
            targetSize: 1,
            fillColor: '#' + (Math.random() * 0x904040 + 0xaaaaaa | 0).toString(16),
            orbit: RADIUS * .5 + (RADIUS * .5 * Math.random())
        };

        particles.push(particle);
    }
}

function windowResizeHandler() {
    // SCREEN_WIDTH = window.innerWidth;
    // SCREEN_HEIGHT = window.innerHeight;

    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
}

function loop() {

    if (mouseIsDown) {
        RADIUS_SCALE += (RADIUS_SCALE_MAX - RADIUS_SCALE) * (0.02);
    }
    else {
        RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * (0.02);
    }

    RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

    context.fillStyle = 'rgba(250,250,250,0)';
    // context.fillStyle = 'rgba(40,40,40,0.2)';

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 0, len = particles.length; i < len; i++) {
        var particle = particles[i];

        var lp = { x: particle.position.x, y: particle.position.y };

        // Rotation
        particle.offset.x += particle.speed;
        particle.offset.y += particle.speed;

        // Follow mouse with some lag
        particle.shift.x += (mouseX - particle.shift.x) * (particle.speed);
        particle.shift.y += (mouseY - particle.shift.y) * (particle.speed);

        // Apply position
        particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit * RADIUS_SCALE);
        particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit * RADIUS_SCALE);

        // Limit to screen bounds
        particle.position.x = Math.max(Math.min(particle.position.x, SCREEN_WIDTH), 0);
        particle.position.y = Math.max(Math.min(particle.position.y, SCREEN_HEIGHT), 0);

        particle.size += (particle.targetSize - particle.size) * 0.01;

        if (Math.round(particle.size) == Math.round(particle.targetSize)) {
            particle.targetSize = 10 + Math.random() * 2;
        }

        context.beginPath();
        context.fillStyle = particle.fillColor;
        context.strokeStyle = particle.fillColor;
        // context.lineWidth = particle.size;
        // context.moveTo(lp.x, lp.y);
        // context.lineTo(particle.position.x, particle.position.y);
        // context.stroke();
        context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
        context.fill();
    }
}

export default {
    init: init,
    clear: () => {
        clearInterval(time);
    }
}
