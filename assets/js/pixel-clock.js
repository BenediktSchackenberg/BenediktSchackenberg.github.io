/**
 * Retro Pixel Construction Clock
 * Pixel-art digital clock with construction worker sprites that rebuild digits each minute.
 * Inspired by standard-time.com — but retro/pixel style.
 */
(function () {
  'use strict';

  // === CONFIG ===
  const PX = 3; // each "game pixel" = 3 canvas pixels
  const DIGIT_W = 5, DIGIT_H = 7;
  const COLON_W = 2;
  const GAP = 1; // gap between elements in game pixels
  const MARGIN = 2; // margin around content
  // Total width: 4 digits * 5 + colon 2 + 4 gaps + 2*margin = 20+2+4+4 = 30 game px => 90 canvas px ... let's compute
  // Layout: M M [d0 5] G [d1 5] G [: 2] G [d2 5] G [d3 5] M M
  // = 2 + 5 + 1 + 5 + 1 + 2 + 1 + 5 + 1 + 5 + 2 = 30 game px
  const CANVAS_GP_W = 30 + 12; // extra room for workers = 42
  const CANVAS_GP_H = 18; // digits 7 high + margin + worker space
  const CANVAS_W = CANVAS_GP_W * PX; // 126
  const CANVAS_H = CANVAS_GP_H * PX; // 54

  // Colors
  const COL_BG = 'rgba(13,17,23,0.85)';
  const COL_DIGIT = '#58a6ff';
  const COL_DIGIT_DIM = '#1a3a5c';
  const COL_HELM = '#f0c040';
  const COL_BODY = '#e06030';
  const COL_PANTS = '#4060a0';
  const COL_SKIN = '#e0b080';
  const COL_PARTICLE = '#8b949e';
  const COL_COLON = '#58a6ff';

  // 5x7 digit bitmaps (each digit is array of 7 rows, each row 5 bits)
  const DIGITS = [
    [0b11111,0b10001,0b10001,0b10001,0b10001,0b10001,0b11111], // 0
    [0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110], // 1
    [0b11111,0b00001,0b00001,0b11111,0b10000,0b10000,0b11111], // 2
    [0b11111,0b00001,0b00001,0b11111,0b00001,0b00001,0b11111], // 3
    [0b10001,0b10001,0b10001,0b11111,0b00001,0b00001,0b00001], // 4
    [0b11111,0b10000,0b10000,0b11111,0b00001,0b00001,0b11111], // 5
    [0b11111,0b10000,0b10000,0b11111,0b10001,0b10001,0b11111], // 6
    [0b11111,0b00001,0b00001,0b00010,0b00100,0b00100,0b00100], // 7
    [0b11111,0b10001,0b10001,0b11111,0b10001,0b10001,0b11111], // 8
    [0b11111,0b10001,0b10001,0b11111,0b00001,0b00001,0b11111], // 9
  ];

  function getDigitPixels(d) {
    const px = [];
    const bm = DIGITS[d];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 5; x++) {
        if (bm[y] & (1 << (4 - x))) px.push({ x, y });
      }
    }
    return px;
  }

  // Digit positions (game pixel coords, top-left of each digit area)
  const DIGIT_X = [
    MARGIN + 4,
    MARGIN + 4 + DIGIT_W + GAP,
    MARGIN + 4 + 2 * (DIGIT_W + GAP) + COLON_W + GAP,
    MARGIN + 4 + 3 * (DIGIT_W + GAP) + COLON_W + GAP,
  ];
  const DIGIT_Y = MARGIN + 2; // top margin for digits
  const COLON_X = MARGIN + 4 + 2 * (DIGIT_W + GAP) - 1;
  const COLON_Y = DIGIT_Y;

  // === PARTICLE SYSTEM ===
  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = -Math.random() * 0.5 - 0.2;
      this.life = 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.03;
      this.life -= 0.025;
    }
  }

  // === WORKER ===
  class Worker {
    constructor(x) {
      this.x = x; this.y = CANVAS_GP_H - 5;
      this.targetX = x;
      this.state = 'idle'; // idle, walking, hammering, sitting
      this.frame = 0;
      this.frameTick = 0;
      this.dir = 1;
      this.hammerCount = 0;
      this.idleTimer = Math.random() * 200 | 0;
      this.task = null; // { digitIdx, pixelList, phase: 'remove'|'place', idx }
    }

    assignTask(digitIdx, removePixels, placePixels) {
      this.task = { digitIdx, removePixels, placePixels, phase: 'approach', removeIdx: 0, placeIdx: 0 };
      this.targetX = DIGIT_X[digitIdx] + 2;
      this.state = 'walking';
    }

    update(clock) {
      this.frameTick++;
      if (this.frameTick % 8 === 0) this.frame = (this.frame + 1) % 4;

      if (this.task) {
        const t = this.task;
        if (t.phase === 'approach') {
          // Walk toward digit
          const dx = this.targetX - this.x;
          if (Math.abs(dx) > 0.3) {
            this.x += Math.sign(dx) * 0.3;
            this.dir = Math.sign(dx);
            this.state = 'walking';
          } else {
            t.phase = 'remove';
            this.state = 'hammering';
            this.hammerCount = 0;
          }
        } else if (t.phase === 'remove') {
          if (this.frameTick % 6 === 0) {
            if (t.removeIdx < t.removePixels.length) {
              const p = t.removePixels[t.removeIdx];
              const gx = DIGIT_X[t.digitIdx] + p.x;
              const gy = DIGIT_Y + p.y;
              clock.clearPixel(gx, gy);
              clock.addParticle(gx, gy);
              t.removeIdx++;
            } else {
              t.phase = 'place';
            }
          }
        } else if (t.phase === 'place') {
          if (this.frameTick % 5 === 0) {
            if (t.placeIdx < t.placePixels.length) {
              const p = t.placePixels[t.placeIdx];
              const gx = DIGIT_X[t.digitIdx] + p.x;
              const gy = DIGIT_Y + p.y;
              clock.setPixel(gx, gy);
              t.placeIdx++;
            } else {
              t.phase = 'done';
              this.task = null;
              this.state = 'idle';
              this.idleTimer = 60;
            }
          }
        }
      } else {
        // Idle behavior
        this.idleTimer--;
        if (this.idleTimer <= 0) {
          if (Math.random() < 0.3) {
            this.state = 'sitting';
            this.idleTimer = 100 + Math.random() * 200 | 0;
          } else {
            this.targetX = MARGIN + 2 + Math.random() * (CANVAS_GP_W - 6);
            this.state = 'walking';
            this.idleTimer = 80 + Math.random() * 150 | 0;
          }
        }
        if (this.state === 'walking' && !this.task) {
          const dx = this.targetX - this.x;
          if (Math.abs(dx) > 0.3) {
            this.x += Math.sign(dx) * 0.15;
            this.dir = Math.sign(dx);
          } else {
            this.state = 'idle';
          }
        }
      }
    }

    draw(ctx) {
      const px = PX;
      const sx = Math.round(this.x * px);
      const sy = Math.round(this.y * px);
      const f = this.frame;

      // Helm
      ctx.fillStyle = COL_HELM;
      ctx.fillRect(sx, sy, px * 3, px);

      // Skin (head)
      ctx.fillStyle = COL_SKIN;
      ctx.fillRect(sx, sy + px, px * 3, px);

      // Body
      ctx.fillStyle = COL_BODY;
      const bodyY = sy + px * 2;
      ctx.fillRect(sx, bodyY, px * 3, px * 2);

      if (this.state === 'hammering' && f % 2 === 0) {
        // Hammer arm extends
        ctx.fillStyle = COL_HELM;
        const armX = this.dir > 0 ? sx + px * 3 : sx - px * 2;
        ctx.fillRect(armX, bodyY, px * 2, px);
      }

      // Pants
      ctx.fillStyle = COL_PANTS;
      const legY = sy + px * 4;

      if (this.state === 'walking') {
        // Walking animation
        const legOff = f % 2 === 0 ? 0 : px;
        ctx.fillRect(sx, legY + (f % 2 === 0 ? 0 : px / 2), px, px);
        ctx.fillRect(sx + px * 2, legY + (f % 2 === 0 ? px / 2 : 0), px, px);
      } else if (this.state === 'sitting') {
        ctx.fillRect(sx, legY - px / 2, px * 3, px);
      } else {
        ctx.fillRect(sx, legY, px, px);
        ctx.fillRect(sx + px * 2, legY, px, px);
      }
    }
  }

  // === MAIN CLOCK ===
  class PixelClock {
    constructor() {
      this.canvas = document.getElementById('pixel-clock-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pixel-clock-canvas';
        this.canvas.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999;border-radius:6px;pointer-events:none;';
        document.body.appendChild(this.canvas);
      }
      this.canvas.width = CANVAS_W;
      this.canvas.height = CANVAS_H;
      this.ctx = this.canvas.getContext('2d');

      // Check mobile
      if (window.innerWidth < 480) {
        this.canvas.style.transform = 'scale(0.7)';
        this.canvas.style.transformOrigin = 'top left';
      }

      // Digit pixel grid state: which pixels are "on"
      this.digitPixels = {}; // key "gx,gy" => true

      this.particles = [];
      this.workers = [
        new Worker(4),
        new Worker(18),
        new Worker(32),
      ];

      this.lastMinute = -1;
      this.lastDigits = [-1, -1, -1, -1];
      this.colonVisible = true;
      this.colonTick = 0;
      this.initialized = false;

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    setPixel(gx, gy) {
      this.digitPixels[gx + ',' + gy] = true;
    }
    clearPixel(gx, gy) {
      delete this.digitPixels[gx + ',' + gy];
    }
    addParticle(gx, gy) {
      for (let i = 0; i < 2; i++) {
        this.particles.push(new Particle(gx + Math.random(), gy + Math.random()));
      }
    }

    setDigitInstant(idx, d) {
      const pixels = getDigitPixels(d);
      // Clear old
      for (let y = 0; y < DIGIT_H; y++)
        for (let x = 0; x < DIGIT_W; x++)
          this.clearPixel(DIGIT_X[idx] + x, DIGIT_Y + y);
      // Set new
      pixels.forEach(p => this.setPixel(DIGIT_X[idx] + p.x, DIGIT_Y + p.y));
    }

    getTimeDigits() {
      const now = new Date();
      const h = now.getHours(), m = now.getMinutes();
      return [Math.floor(h / 10), h % 10, Math.floor(m / 10), m % 10];
    }

    scheduleTransition(newDigits) {
      for (let i = 0; i < 4; i++) {
        if (newDigits[i] !== this.lastDigits[i]) {
          const oldPx = this.lastDigits[i] >= 0 ? getDigitPixels(this.lastDigits[i]) : [];
          const newPx = getDigitPixels(newDigits[i]);
          // Compute diff
          const oldSet = new Set(oldPx.map(p => p.x + ',' + p.y));
          const newSet = new Set(newPx.map(p => p.x + ',' + p.y));
          const toRemove = oldPx.filter(p => !newSet.has(p.x + ',' + p.y));
          const toPlace = newPx.filter(p => !oldSet.has(p.x + ',' + p.y));
          // Shuffle for visual variety
          toRemove.sort(() => Math.random() - 0.5);
          toPlace.sort(() => Math.random() - 0.5);

          // Assign nearest free worker
          let bestW = null, bestDist = Infinity;
          for (const w of this.workers) {
            if (w.task) continue;
            const dist = Math.abs(w.x - DIGIT_X[i]);
            if (dist < bestDist) { bestDist = dist; bestW = w; }
          }
          if (bestW) {
            bestW.assignTask(i, toRemove, toPlace);
          } else {
            // No free worker, instant update
            this.setDigitInstant(i, newDigits[i]);
          }
        }
      }
      this.lastDigits = [...newDigits];
    }

    loop() {
      const ctx = this.ctx;
      const now = new Date();
      const currentMinute = now.getHours() * 60 + now.getMinutes();
      const digits = this.getTimeDigits();

      // First frame: set digits instantly
      if (!this.initialized) {
        for (let i = 0; i < 4; i++) this.setDigitInstant(i, digits[i]);
        this.lastDigits = [...digits];
        this.lastMinute = currentMinute;
        this.initialized = true;
      }

      // Detect minute change
      if (currentMinute !== this.lastMinute) {
        this.lastMinute = currentMinute;
        this.scheduleTransition(digits);
      }

      // Update workers
      this.workers.forEach(w => w.update(this));

      // Update particles
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);

      // Colon blink
      this.colonTick++;
      if (this.colonTick % 30 === 0) this.colonVisible = !this.colonVisible;

      // === DRAW ===
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      ctx.fillStyle = COL_BG;
      ctx.beginPath();
      // Rounded rect
      const r = 6;
      ctx.moveTo(r, 0);
      ctx.arcTo(CANVAS_W, 0, CANVAS_W, CANVAS_H, r);
      ctx.arcTo(CANVAS_W, CANVAS_H, 0, CANVAS_H, r);
      ctx.arcTo(0, CANVAS_H, 0, 0, r);
      ctx.arcTo(0, 0, CANVAS_W, 0, r);
      ctx.fill();

      // Draw digit pixels
      ctx.fillStyle = COL_DIGIT;
      for (const key in this.digitPixels) {
        const [gx, gy] = key.split(',').map(Number);
        ctx.fillRect(gx * PX, gy * PX, PX, PX);
      }

      // Draw colon
      if (this.colonVisible) {
        ctx.fillStyle = COL_COLON;
        ctx.fillRect(COLON_X * PX, (COLON_Y + 2) * PX, PX, PX);
        ctx.fillRect(COLON_X * PX, (COLON_Y + 4) * PX, PX, PX);
      }

      // Draw particles
      this.particles.forEach(p => {
        ctx.fillStyle = COL_PARTICLE;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x * PX, p.y * PX, PX / 2, PX / 2);
      });
      ctx.globalAlpha = 1;

      // Draw workers
      this.workers.forEach(w => w.draw(ctx));

      requestAnimationFrame(this.loop);
    }
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PixelClock());
  } else {
    new PixelClock();
  }
})();
