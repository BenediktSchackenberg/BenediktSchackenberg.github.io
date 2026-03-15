/**
 * Retro Pixel Construction Clock
 * Pixel-art digital clock with detailed construction worker sprites.
 * Inspired by standard-time.com — but retro/pixel style.
 */
(function () {
  'use strict';

  // === CONFIG ===
  const PX = 3; // each "game pixel" = 3 canvas pixels
  const DIGIT_W = 5, DIGIT_H = 7;
  const COLON_W = 2;
  const GAP = 1;
  const MARGIN = 2;

  // Layout: M [d0 5] G [d1 5] G [: 2] G [d2 5] G [d3 5] M
  const CONTENT_W = 2 * MARGIN + 4 * DIGIT_W + 4 * GAP + COLON_W; // 30
  const CANVAS_GP_W = CONTENT_W + 14; // extra room for workers wandering
  const CANVAS_GP_H = 20; // more vertical room
  const CANVAS_W = CANVAS_GP_W * PX;
  const CANVAS_H = CANVAS_GP_H * PX;

  // Colors
  const COL_BG = 'rgba(13,17,23,0.9)';
  const COL_DIGIT = '#58a6ff';
  const COL_HELM = '#f0c040';
  const COL_HELM_SHADE = '#c89a20';
  const COL_BODY = '#e06030';
  const COL_BODY_SHADE = '#b84820';
  const COL_PANTS = '#4060a0';
  const COL_PANTS_SHADE = '#304878';
  const COL_SKIN = '#e0b080';
  const COL_SKIN_SHADE = '#c89060';
  const COL_BOOTS = '#503018';
  const COL_HAMMER_HEAD = '#a0a0a0';
  const COL_HAMMER_HANDLE = '#8b6914';
  const COL_PARTICLE = '#8b949e';
  const COL_COLON = '#58a6ff';
  const COL_SCAFFOLD = '#6e4b1e';

  // 5x7 digit bitmaps
  const DIGITS = [
    [0b11111,0b10001,0b10001,0b10001,0b10001,0b10001,0b11111],
    [0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
    [0b11111,0b00001,0b00001,0b11111,0b10000,0b10000,0b11111],
    [0b11111,0b00001,0b00001,0b11111,0b00001,0b00001,0b11111],
    [0b10001,0b10001,0b10001,0b11111,0b00001,0b00001,0b00001],
    [0b11111,0b10000,0b10000,0b11111,0b00001,0b00001,0b11111],
    [0b11111,0b10000,0b10000,0b11111,0b10001,0b10001,0b11111],
    [0b11111,0b00001,0b00001,0b00010,0b00100,0b00100,0b00100],
    [0b11111,0b10001,0b10001,0b11111,0b10001,0b10001,0b11111],
    [0b11111,0b10001,0b10001,0b11111,0b00001,0b00001,0b11111],
  ];

  function getDigitPixels(d) {
    const px = [];
    const bm = DIGITS[d];
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 5; x++)
        if (bm[y] & (1 << (4 - x))) px.push({ x, y });
    return px;
  }

  // Digit positions
  const DIGIT_X = [];
  let cx = MARGIN + 5;
  for (let i = 0; i < 4; i++) {
    if (i === 2) cx += COLON_W + GAP; // after colon
    DIGIT_X.push(cx);
    cx += DIGIT_W + GAP;
  }
  const DIGIT_Y = MARGIN + 2;
  const COLON_X = DIGIT_X[1] + DIGIT_W + GAP;
  const COLON_Y = DIGIT_Y;
  const GROUND_Y = CANVAS_GP_H - 2; // ground line

  // === PARTICLE ===
  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = -Math.random() * 0.8 - 0.3;
      this.life = 1;
      this.size = Math.random() < 0.5 ? 0.5 : 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.04; // gravity
      this.life -= 0.02;
    }
  }

  // === DETAILED WORKER SPRITE DRAWING ===
  // Workers are 5 game-pixels wide, 8 game-pixels tall
  // Drawn pixel-by-pixel for proper retro character look

  function drawPx(ctx, gx, gy, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(gx * PX), Math.round(gy * PX), PX, PX);
  }

  function drawWorker(ctx, gx, gy, state, frame, dir) {
    // gx, gy = game pixel coords of bottom-center
    // Worker is 5 wide, 8 tall. Origin at bottom-center (foot level)
    const x = Math.round(gx) - 2; // left edge
    const y = Math.round(gy) - 8; // top edge
    const f = frame % 4;

    // -- HARDHAT (row 0-1) --
    // Brim wider than head
    drawPx(ctx, x + 1, y, COL_HELM);
    drawPx(ctx, x + 2, y, COL_HELM);
    drawPx(ctx, x + 3, y, COL_HELM);
    // Hat top highlight
    drawPx(ctx, x + 0, y + 1, COL_HELM_SHADE);
    drawPx(ctx, x + 1, y + 1, COL_HELM);
    drawPx(ctx, x + 2, y + 1, COL_HELM);
    drawPx(ctx, x + 3, y + 1, COL_HELM);
    drawPx(ctx, x + 4, y + 1, COL_HELM_SHADE);

    // -- FACE (row 2) --
    drawPx(ctx, x + 1, y + 2, COL_SKIN);
    drawPx(ctx, x + 2, y + 2, COL_SKIN);
    drawPx(ctx, x + 3, y + 2, COL_SKIN);
    // Eyes (tiny dark dots)
    ctx.fillStyle = '#303030';
    ctx.fillRect(Math.round((x + 1) * PX) + 1, Math.round((y + 2) * PX) + 1, 1, 1);
    if (state !== 'sitting') {
      ctx.fillRect(Math.round((x + 3) * PX) + 1, Math.round((y + 2) * PX) + 1, 1, 1);
    }

    // -- NECK (row 3) --
    drawPx(ctx, x + 2, y + 3, COL_SKIN_SHADE);

    // -- BODY / VEST (row 3-5) --
    // Safety vest (orange with yellow stripe)
    drawPx(ctx, x + 1, y + 3, COL_BODY);
    drawPx(ctx, x + 3, y + 3, COL_BODY);
    drawPx(ctx, x + 1, y + 4, COL_BODY);
    drawPx(ctx, x + 2, y + 4, COL_HELM); // yellow reflective stripe
    drawPx(ctx, x + 3, y + 4, COL_BODY);
    drawPx(ctx, x + 1, y + 5, COL_BODY_SHADE);
    drawPx(ctx, x + 2, y + 5, COL_BODY_SHADE);
    drawPx(ctx, x + 3, y + 5, COL_BODY_SHADE);

    // -- ARMS --
    if (state === 'hammering') {
      // One arm out to side with hammer
      const hammerUp = f % 2 === 0;
      if (dir > 0) {
        drawPx(ctx, x + 4, y + 4, COL_SKIN); // arm
        // Hammer
        if (hammerUp) {
          drawPx(ctx, x + 4, y + 3, COL_HAMMER_HANDLE);
          drawPx(ctx, x + 4, y + 2, COL_HAMMER_HEAD);
          drawPx(ctx, x + 5 > CANVAS_GP_W - 1 ? CANVAS_GP_W - 1 : x + 5, y + 2, COL_HAMMER_HEAD);
        } else {
          drawPx(ctx, x + 5 > CANVAS_GP_W - 1 ? CANVAS_GP_W - 1 : x + 5, y + 4, COL_HAMMER_HANDLE);
          drawPx(ctx, x + 5 > CANVAS_GP_W - 1 ? CANVAS_GP_W - 1 : x + 5, y + 5, COL_HAMMER_HEAD);
        }
        drawPx(ctx, x + 0, y + 4, COL_SKIN); // other arm at side
      } else {
        drawPx(ctx, x + 0, y + 4, COL_SKIN);
        if (hammerUp) {
          drawPx(ctx, x + 0, y + 3, COL_HAMMER_HANDLE);
          drawPx(ctx, x + 0, y + 2, COL_HAMMER_HEAD);
          drawPx(ctx, x - 1 < 0 ? 0 : x - 1, y + 2, COL_HAMMER_HEAD);
        } else {
          drawPx(ctx, x - 1 < 0 ? 0 : x - 1, y + 4, COL_HAMMER_HANDLE);
          drawPx(ctx, x - 1 < 0 ? 0 : x - 1, y + 5, COL_HAMMER_HEAD);
        }
        drawPx(ctx, x + 4, y + 4, COL_SKIN);
      }
    } else {
      // Arms at sides or swinging (walking)
      if (state === 'walking') {
        const swing = f % 2 === 0;
        drawPx(ctx, x + 0, y + (swing ? 4 : 5), COL_SKIN);
        drawPx(ctx, x + 4, y + (swing ? 5 : 4), COL_SKIN);
      } else {
        drawPx(ctx, x + 0, y + 4, COL_SKIN);
        drawPx(ctx, x + 4, y + 4, COL_SKIN);
      }
    }

    // -- PANTS (row 6) --
    if (state === 'sitting') {
      // Legs horizontal
      drawPx(ctx, x + 0, y + 6, COL_PANTS);
      drawPx(ctx, x + 1, y + 6, COL_PANTS);
      drawPx(ctx, x + 2, y + 6, COL_PANTS_SHADE);
      drawPx(ctx, x + 3, y + 6, COL_PANTS);
      drawPx(ctx, x + 4, y + 6, COL_PANTS);
      // Boots sticking out
      drawPx(ctx, x + 0, y + 7, COL_BOOTS);
      drawPx(ctx, x + 4, y + 7, COL_BOOTS);
    } else if (state === 'walking') {
      // Walking leg animation
      if (f === 0 || f === 2) {
        drawPx(ctx, x + 1, y + 6, COL_PANTS);
        drawPx(ctx, x + 3, y + 6, COL_PANTS);
        drawPx(ctx, x + 1, y + 7, COL_BOOTS);
        drawPx(ctx, x + 3, y + 7, COL_BOOTS);
      } else if (f === 1) {
        // Left leg forward, right leg back
        drawPx(ctx, x + (dir > 0 ? 0 : 2), y + 6, COL_PANTS);
        drawPx(ctx, x + (dir > 0 ? 3 : 1), y + 6, COL_PANTS);
        drawPx(ctx, x + (dir > 0 ? 0 : 2), y + 7, COL_BOOTS);
        drawPx(ctx, x + (dir > 0 ? 4 : 1), y + 7, COL_BOOTS);
      } else {
        drawPx(ctx, x + (dir > 0 ? 2 : 0), y + 6, COL_PANTS);
        drawPx(ctx, x + (dir > 0 ? 1 : 3), y + 6, COL_PANTS);
        drawPx(ctx, x + (dir > 0 ? 2 : 0), y + 7, COL_BOOTS);
        drawPx(ctx, x + (dir > 0 ? 1 : 4), y + 7, COL_BOOTS);
      }
    } else {
      // Standing
      drawPx(ctx, x + 1, y + 6, COL_PANTS);
      drawPx(ctx, x + 3, y + 6, COL_PANTS);
      drawPx(ctx, x + 1, y + 7, COL_BOOTS);
      drawPx(ctx, x + 3, y + 7, COL_BOOTS);
    }
  }

  // === WORKER LOGIC ===
  class Worker {
    constructor(x) {
      this.x = x;
      this.state = 'idle';
      this.frame = 0;
      this.frameTick = 0;
      this.dir = 1;
      this.idleTimer = 30 + Math.random() * 120 | 0;
      this.task = null;
    }

    assignTask(digitIdx, removePixels, placePixels) {
      this.task = { digitIdx, removePixels, placePixels, phase: 'approach', removeIdx: 0, placeIdx: 0 };
      this.state = 'walking';
    }

    update(clock) {
      this.frameTick++;
      if (this.frameTick % 6 === 0) this.frame++;

      if (this.task) {
        const t = this.task;
        const targetX = DIGIT_X[t.digitIdx] + 2;

        if (t.phase === 'approach') {
          const dx = targetX - this.x;
          if (Math.abs(dx) > 0.4) {
            this.x += Math.sign(dx) * 0.35;
            this.dir = Math.sign(dx);
            this.state = 'walking';
          } else {
            t.phase = 'remove';
            this.state = 'hammering';
          }
        } else if (t.phase === 'remove') {
          if (this.frameTick % 4 === 0) {
            if (t.removeIdx < t.removePixels.length) {
              const p = t.removePixels[t.removeIdx];
              clock.clearPixel(DIGIT_X[t.digitIdx] + p.x, DIGIT_Y + p.y);
              clock.addParticle(DIGIT_X[t.digitIdx] + p.x, DIGIT_Y + p.y);
              t.removeIdx++;
            } else {
              t.phase = 'place';
            }
          }
        } else if (t.phase === 'place') {
          if (this.frameTick % 3 === 0) {
            if (t.placeIdx < t.placePixels.length) {
              const p = t.placePixels[t.placeIdx];
              clock.setPixel(DIGIT_X[t.digitIdx] + p.x, DIGIT_Y + p.y);
              t.placeIdx++;
            } else {
              this.task = null;
              this.state = 'idle';
              this.idleTimer = 50;
            }
          }
        }
      } else {
        this.idleTimer--;
        if (this.idleTimer <= 0) {
          const r = Math.random();
          if (r < 0.25) {
            this.state = 'sitting';
            this.idleTimer = 120 + Math.random() * 200 | 0;
          } else {
            this.state = 'walking';
            this.targetX = 4 + Math.random() * (CANVAS_GP_W - 10);
            this.idleTimer = 80 + Math.random() * 150 | 0;
          }
        }
        if (this.state === 'walking' && !this.task) {
          const dx = (this.targetX || this.x) - this.x;
          if (Math.abs(dx) > 0.4) {
            this.x += Math.sign(dx) * 0.12;
            this.dir = Math.sign(dx);
          } else {
            this.state = 'idle';
          }
        }
      }
    }

    draw(ctx) {
      drawWorker(ctx, this.x, GROUND_Y, this.state, this.frame, this.dir);
    }
  }

  // === MAIN CLOCK ===
  class PixelClock {
    constructor() {
      this.canvas = document.getElementById('pixel-clock-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pixel-clock-canvas';
        document.body.appendChild(this.canvas);
      }
      // Position: right of the site title area
      this.canvas.style.cssText = 'position:fixed;top:8px;right:20px;z-index:9999;border-radius:8px;pointer-events:none;';
      this.canvas.width = CANVAS_W;
      this.canvas.height = CANVAS_H;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;

      // Mobile scaling
      if (window.innerWidth < 600) {
        this.canvas.style.transform = 'scale(0.65)';
        this.canvas.style.transformOrigin = 'top right';
      }

      this.digitPixels = {};
      this.particles = [];
      this.workers = [
        new Worker(6),
        new Worker(20),
        new Worker(34),
      ];

      this.lastMinute = -1;
      this.lastDigits = [-1, -1, -1, -1];
      this.colonVisible = true;
      this.colonTick = 0;
      this.initialized = false;

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    setPixel(gx, gy) { this.digitPixels[gx + ',' + gy] = true; }
    clearPixel(gx, gy) { delete this.digitPixels[gx + ',' + gy]; }
    addParticle(gx, gy) {
      for (let i = 0; i < 3; i++)
        this.particles.push(new Particle(gx + Math.random(), gy + Math.random()));
    }

    setDigitInstant(idx, d) {
      for (let y = 0; y < DIGIT_H; y++)
        for (let x = 0; x < DIGIT_W; x++)
          this.clearPixel(DIGIT_X[idx] + x, DIGIT_Y + y);
      getDigitPixels(d).forEach(p => this.setPixel(DIGIT_X[idx] + p.x, DIGIT_Y + p.y));
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
          const oldSet = new Set(oldPx.map(p => p.x + ',' + p.y));
          const newSet = new Set(newPx.map(p => p.x + ',' + p.y));
          const toRemove = oldPx.filter(p => !newSet.has(p.x + ',' + p.y)).sort(() => Math.random() - 0.5);
          const toPlace = newPx.filter(p => !oldSet.has(p.x + ',' + p.y)).sort(() => Math.random() - 0.5);

          let bestW = null, bestDist = Infinity;
          for (const w of this.workers) {
            if (w.task) continue;
            const dist = Math.abs(w.x - DIGIT_X[i]);
            if (dist < bestDist) { bestDist = dist; bestW = w; }
          }
          if (bestW) bestW.assignTask(i, toRemove, toPlace);
          else this.setDigitInstant(i, newDigits[i]);
        }
      }
      this.lastDigits = [...newDigits];
    }

    loop() {
      const ctx = this.ctx;
      const now = new Date();
      const currentMinute = now.getHours() * 60 + now.getMinutes();
      const digits = this.getTimeDigits();

      if (!this.initialized) {
        for (let i = 0; i < 4; i++) this.setDigitInstant(i, digits[i]);
        this.lastDigits = [...digits];
        this.lastMinute = currentMinute;
        this.initialized = true;
      }

      if (currentMinute !== this.lastMinute) {
        this.lastMinute = currentMinute;
        this.scheduleTransition(digits);
      }

      this.workers.forEach(w => w.update(this));
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);
      this.colonTick++;
      if (this.colonTick % 30 === 0) this.colonVisible = !this.colonVisible;

      // === DRAW ===
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      ctx.fillStyle = COL_BG;
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.arcTo(CANVAS_W, 0, CANVAS_W, CANVAS_H, r);
      ctx.arcTo(CANVAS_W, CANVAS_H, 0, CANVAS_H, r);
      ctx.arcTo(0, CANVAS_H, 0, 0, r);
      ctx.arcTo(0, 0, CANVAS_W, 0, r);
      ctx.fill();

      // Ground line (subtle scaffold/platform look)
      ctx.fillStyle = COL_SCAFFOLD;
      ctx.fillRect(PX, (GROUND_Y) * PX, CANVAS_W - 2 * PX, 1);

      // Digit pixels
      for (const key in this.digitPixels) {
        const [gx, gy] = key.split(',').map(Number);
        // Slight glow effect
        ctx.fillStyle = 'rgba(88,166,255,0.15)';
        ctx.fillRect(gx * PX - 1, gy * PX - 1, PX + 2, PX + 2);
        ctx.fillStyle = COL_DIGIT;
        ctx.fillRect(gx * PX, gy * PX, PX, PX);
      }

      // Colon
      if (this.colonVisible) {
        ctx.fillStyle = COL_COLON;
        ctx.fillRect(COLON_X * PX, (COLON_Y + 2) * PX, PX, PX);
        ctx.fillRect(COLON_X * PX, (COLON_Y + 4) * PX, PX, PX);
      }

      // Particles
      this.particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = COL_PARTICLE;
        const s = p.size * PX * 0.6;
        ctx.fillRect(p.x * PX, p.y * PX, s, s);
      });
      ctx.globalAlpha = 1;

      // Workers (drawn last, on top)
      this.workers.forEach(w => w.draw(ctx));

      requestAnimationFrame(this.loop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PixelClock());
  } else {
    new PixelClock();
  }
})();
