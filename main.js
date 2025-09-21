class Firework {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.targetY = Math.random() * window.innerHeight * 0.5;
        this.speed = Math.random() * 3 + 2;
        this.particles = [];
        this.exploded = false;
        this.hue = Math.random() * 360;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(this.x, this.y, this.hue));
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fillRect(this.x, this.y, 2, 10);
        } else {
            this.particles.forEach(particle => particle.draw(ctx));
        }
    }

    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.hue = hue + Math.random() * 30 - 15;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fillRect(this.x, this.y, 2, 2);
        ctx.restore();
    }
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

const fireworks = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        fireworks.push(new Firework());
    }

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        if (firework.isDead()) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();