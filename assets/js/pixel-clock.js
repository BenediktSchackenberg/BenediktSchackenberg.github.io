/**
 * Retro Pixel Construction Clock v3
 * Bigger canvas, construction site with house, ladder, spread-out workers.
 */
(function () {
  'use strict';

  const PX = 4; // bigger pixels
  const DIGIT_W = 5, DIGIT_H = 7;

  // Canvas size in game pixels
  const GPW = 64;
  const GPH = 32;
  const CW = GPW * PX; // 256
  const CH = GPH * PX; // 128

  // Colors
  const COL_BG = 'rgba(13,17,23,0.92)';
  const COL_DIGIT = '#58a6ff';
  const COL_DIGIT_GLOW = 'rgba(88,166,255,0.12)';
  const COL_HELM = '#f0c040';
  const COL_HELM_SHADE = '#c89a20';
  const COL_BODY = '#e06030';
  const COL_BODY_SHADE = '#b84820';
  const COL_VEST_STRIPE = '#f0c040';
  const COL_PANTS = '#4060a0';
  const COL_PANTS_SHADE = '#304878';
  const COL_SKIN = '#e0b080';
  const COL_SKIN_SHADE = '#c89060';
  const COL_BOOTS = '#503018';
  const COL_HAMMER = '#a0a0a0';
  const COL_HANDLE = '#8b6914';
  const COL_PARTICLE = '#8b949e';
  const COL_COLON = '#58a6ff';
  const COL_GROUND = '#2a1f0e';
  const COL_GROUND_LINE = '#6e4b1e';
  const COL_LADDER = '#8b6914';
  const COL_LADDER_RUNG = '#a07828';
  // House colors
  const COL_BRICK = '#6b3a2a';
  const COL_BRICK_SHADE = '#4d2a1e';
  const COL_ROOF = '#8b4513';
  const COL_ROOF_SHADE = '#6b3510';
  const COL_WINDOW = '#1a3a5c';
  const COL_WINDOW_FRAME = '#4a6a8a';
  const COL_DOOR = '#4d2a1e';
  const COL_SCAFFOLD = '#6e4b1e';
  const COL_SCAFFOLD_PLANK = '#8b6914';

  const GROUND_Y = GPH - 3;

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

  // Digit positions — centered horizontally in upper area
  const DIGIT_START_X = 10;
  const DIGIT_Y = 3;
  const DIGIT_GAP = 2;
  const DIGIT_X = [
    DIGIT_START_X,
    DIGIT_START_X + DIGIT_W + DIGIT_GAP,
    DIGIT_START_X + 2 * (DIGIT_W + DIGIT_GAP) + 3,
    DIGIT_START_X + 3 * (DIGIT_W + DIGIT_GAP) + 3,
  ];
  const COLON_X = DIGIT_START_X + 2 * (DIGIT_W + DIGIT_GAP);
  const COLON_Y = DIGIT_Y;

  // === HELPER ===
  function px(ctx, gx, gy, col) {
    ctx.fillStyle = col;
    ctx.fillRect(gx * PX, gy * PX, PX, PX);
  }

  // === BACKGROUND SCENE ===
  function drawScene(ctx) {
    // Ground
    for (let x = 0; x < GPW; x++) {
      px(ctx, x, GROUND_Y, COL_GROUND);
      px(ctx, x, GROUND_Y + 1, COL_GROUND);
      px(ctx, x, GROUND_Y + 2, COL_GROUND);
    }
    // Ground surface line
    for (let x = 0; x < GPW; x++) {
      px(ctx, x, GROUND_Y, COL_GROUND_LINE);
    }

    // === HOUSE (right side, partially built) ===
    const hx = 46; // house left edge
    const hy = GROUND_Y; // bottom

    // Back wall (brick pattern)
    for (let y = hy - 12; y < hy; y++) {
      for (let x = hx; x < hx + 14; x++) {
        const isBrickEdge = (y % 3 === 0) || ((x + (y % 2 === 0 ? 0 : 1)) % 4 === 0);
        px(ctx, x, y, isBrickEdge ? COL_BRICK_SHADE : COL_BRICK);
      }
    }

    // Missing bricks at top (under construction)
    for (let x = hx + 8; x < hx + 14; x++) {
      px(ctx, x, hy - 12, COL_BG.replace('0.92', '1'));
      ctx.clearRect(x * PX, (hy - 12) * PX, PX, PX);
      ctx.fillStyle = COL_BG;
      ctx.fillRect(x * PX, (hy - 12) * PX, PX, PX);
    }
    for (let x = hx + 10; x < hx + 14; x++) {
      ctx.fillStyle = COL_BG;
      ctx.fillRect(x * PX, (hy - 11) * PX, PX, PX);
    }

    // Roof (partial — left side done, right side in progress)
    for (let i = 0; i < 7; i++) {
      px(ctx, hx + i, hy - 13 - i, COL_ROOF);
      px(ctx, hx + 13 - i, hy - 13 - i, i < 5 ? COL_ROOF : COL_ROOF_SHADE);
      // Fill under roof triangle
      for (let x = hx + i + 1; x < hx + 13 - i; x++) {
        if (i < 6) px(ctx, x, hy - 13 - i, (i < 5) ? COL_ROOF_SHADE : COL_ROOF);
      }
    }

    // Window (left)
    for (let y = hy - 8; y < hy - 5; y++) {
      for (let x = hx + 2; x < hx + 5; x++) {
        px(ctx, x, y, COL_WINDOW);
      }
    }
    // Window frame
    px(ctx, hx + 1, hy - 8, COL_WINDOW_FRAME);
    px(ctx, hx + 1, hy - 7, COL_WINDOW_FRAME);
    px(ctx, hx + 1, hy - 6, COL_WINDOW_FRAME);
    px(ctx, hx + 1, hy - 5, COL_WINDOW_FRAME);
    px(ctx, hx + 5, hy - 8, COL_WINDOW_FRAME);
    px(ctx, hx + 5, hy - 7, COL_WINDOW_FRAME);
    px(ctx, hx + 5, hy - 6, COL_WINDOW_FRAME);
    px(ctx, hx + 5, hy - 5, COL_WINDOW_FRAME);
    for (let x = hx + 1; x <= hx + 5; x++) {
      px(ctx, x, hy - 9, COL_WINDOW_FRAME);
      px(ctx, x, hy - 5, COL_WINDOW_FRAME);
    }
    // Window cross
    px(ctx, hx + 3, hy - 7, COL_WINDOW_FRAME);
    px(ctx, hx + 3, hy - 6, COL_WINDOW_FRAME);

    // Door opening (right)
    for (let y = hy - 4; y < hy; y++) {
      for (let x = hx + 9; x < hx + 12; x++) {
        px(ctx, x, y, COL_DOOR);
      }
    }

    // === SCAFFOLDING (next to house) ===
    const sx = hx - 3;
    // Vertical poles
    for (let y = hy - 14; y < hy; y++) {
      px(ctx, sx, y, COL_SCAFFOLD);
      px(ctx, sx + 3, y, COL_SCAFFOLD);
    }
    // Horizontal planks
    px(ctx, sx, hy - 7, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 1, hy - 7, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 2, hy - 7, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 3, hy - 7, COL_SCAFFOLD_PLANK);
    px(ctx, sx, hy - 14, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 1, hy - 14, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 2, hy - 14, COL_SCAFFOLD_PLANK);
    px(ctx, sx + 3, hy - 14, COL_SCAFFOLD_PLANK);

    // === LADDER (between digits and house) ===
    const lx = 38;
    for (let y = hy - 16; y < hy; y++) {
      px(ctx, lx, y, COL_LADDER);
      px(ctx, lx + 2, y, COL_LADDER);
    }
    // Rungs every 3 pixels
    for (let y = hy - 15; y < hy; y += 3) {
      px(ctx, lx + 1, y, COL_LADDER_RUNG);
    }

    // === SMALL DETAILS ===
    // Pile of bricks on ground (near house)
    px(ctx, hx - 1, hy - 1, COL_BRICK);
    px(ctx, hx - 2, hy - 1, COL_BRICK);
    px(ctx, hx - 1, hy - 2, COL_BRICK_SHADE);

    // Bucket near ladder
    px(ctx, lx + 4, hy - 1, '#4a6a8a');
    px(ctx, lx + 4, hy - 2, '#4a6a8a');
    px(ctx, lx + 5, hy - 1, '#4a6a8a');

    // Small cone on ground left
    px(ctx, 5, hy - 1, COL_BODY);
    px(ctx, 5, hy - 2, COL_HELM);
  }

  // === WORKER SPRITE (8 tall, 5 wide) ===
  function drawWorkerSprite(ctx, gx, gy, state, frame, dir) {
    const x = Math.round(gx) - 2;
    const y = Math.round(gy) - 8;
    const f = frame % 4;

    // Hardhat
    px(ctx, x + 1, y, COL_HELM);
    px(ctx, x + 2, y, COL_HELM);
    px(ctx, x + 3, y, COL_HELM);
    px(ctx, x + 0, y + 1, COL_HELM_SHADE);
    px(ctx, x + 1, y + 1, COL_HELM);
    px(ctx, x + 2, y + 1, COL_HELM);
    px(ctx, x + 3, y + 1, COL_HELM);
    px(ctx, x + 4, y + 1, COL_HELM_SHADE);

    // Face
    px(ctx, x + 1, y + 2, COL_SKIN);
    px(ctx, x + 2, y + 2, COL_SKIN);
    px(ctx, x + 3, y + 2, COL_SKIN);
    // Eyes
    ctx.fillStyle = '#202020';
    ctx.fillRect((x + 1) * PX + 1, (y + 2) * PX + 1, 2, 2);
    ctx.fillRect((x + 3) * PX + 1, (y + 2) * PX + 1, 2, 2);
    // Mouth
    if (state === 'hammering' && f % 2 === 0) {
      ctx.fillRect((x + 2) * PX + 1, (y + 2) * PX + 3, 2, 1); // open mouth effort
    }

    // Neck
    px(ctx, x + 2, y + 3, COL_SKIN_SHADE);

    // Torso with vest
    px(ctx, x + 1, y + 3, COL_BODY);
    px(ctx, x + 3, y + 3, COL_BODY);
    px(ctx, x + 1, y + 4, COL_BODY);
    px(ctx, x + 2, y + 4, COL_VEST_STRIPE); // reflective stripe
    px(ctx, x + 3, y + 4, COL_BODY);
    px(ctx, x + 1, y + 5, COL_BODY_SHADE);
    px(ctx, x + 2, y + 5, COL_BODY_SHADE);
    px(ctx, x + 3, y + 5, COL_BODY_SHADE);

    // Arms + tool
    if (state === 'hammering') {
      const up = f % 2 === 0;
      const armSide = dir > 0 ? x + 4 : x + 0;
      const otherSide = dir > 0 ? x + 0 : x + 4;
      px(ctx, armSide, y + 4, COL_SKIN);
      if (up) {
        px(ctx, armSide, y + 3, COL_HANDLE);
        px(ctx, armSide, y + 2, COL_HAMMER);
        px(ctx, armSide + (dir > 0 ? 1 : -1), y + 2, COL_HAMMER);
      } else {
        px(ctx, armSide, y + 5, COL_HANDLE);
        px(ctx, armSide + (dir > 0 ? 1 : -1), y + 5, COL_HAMMER);
      }
      px(ctx, otherSide, y + 4, COL_SKIN);
    } else if (state === 'climbing') {
      // Arms up gripping ladder
      px(ctx, x + 0, y + 3, COL_SKIN);
      px(ctx, x + 4, y + 3, COL_SKIN);
    } else if (state === 'walking') {
      const swing = f % 2;
      px(ctx, x + 0, y + 4 + swing, COL_SKIN);
      px(ctx, x + 4, y + 5 - swing, COL_SKIN);
    } else {
      px(ctx, x + 0, y + 5, COL_SKIN);
      px(ctx, x + 4, y + 5, COL_SKIN);
    }

    // Belt
    px(ctx, x + 1, y + 5, COL_BOOTS);
    px(ctx, x + 3, y + 5, COL_BOOTS);

    // Legs + boots
    if (state === 'sitting') {
      px(ctx, x + 0, y + 6, COL_PANTS);
      px(ctx, x + 1, y + 6, COL_PANTS);
      px(ctx, x + 3, y + 6, COL_PANTS);
      px(ctx, x + 4, y + 6, COL_PANTS);
      px(ctx, x + 0, y + 7, COL_BOOTS);
      px(ctx, x + 4, y + 7, COL_BOOTS);
    } else if (state === 'walking') {
      if (f === 0 || f === 2) {
        px(ctx, x + 1, y + 6, COL_PANTS);
        px(ctx, x + 3, y + 6, COL_PANTS);
        px(ctx, x + 1, y + 7, COL_BOOTS);
        px(ctx, x + 3, y + 7, COL_BOOTS);
      } else if (f === 1) {
        px(ctx, x + (dir > 0 ? 0 : 2), y + 6, COL_PANTS);
        px(ctx, x + (dir > 0 ? 3 : 4), y + 6, COL_PANTS);
        px(ctx, x + (dir > 0 ? 0 : 2), y + 7, COL_BOOTS);
        px(ctx, x + (dir > 0 ? 3 : 4), y + 7, COL_BOOTS);
      } else {
        px(ctx, x + (dir > 0 ? 2 : 0), y + 6, COL_PANTS);
        px(ctx, x + (dir > 0 ? 4 : 1), y + 6, COL_PANTS);
        px(ctx, x + (dir > 0 ? 2 : 0), y + 7, COL_BOOTS);
        px(ctx, x + (dir > 0 ? 4 : 1), y + 7, COL_BOOTS);
      }
    } else if (state === 'climbing') {
      const legOff = f % 2;
      px(ctx, x + 1, y + 6 + legOff, COL_PANTS);
      px(ctx, x + 3, y + 7 - legOff, COL_PANTS);
      px(ctx, x + 1, y + 7, COL_BOOTS);
      px(ctx, x + 3, y + 7, COL_BOOTS);
    } else {
      px(ctx, x + 1, y + 6, COL_PANTS);
      px(ctx, x + 3, y + 6, COL_PANTS);
      px(ctx, x + 1, y + 7, COL_BOOTS);
      px(ctx, x + 3, y + 7, COL_BOOTS);
    }
  }

  // === PARTICLE ===
  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = -Math.random() * 1.0 - 0.3;
      this.life = 1;
      this.size = Math.random() < 0.4 ? 0.5 : 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.05;
      this.life -= 0.018;
    }
  }

  // === WORKER LOGIC ===
  class Worker {
    constructor(x, role) {
      this.x = x;
      this.homeX = x; // where they like to hang out
      this.role = role; // 'digit', 'scaffold', 'ground'
      this.state = 'idle';
      this.frame = 0;
      this.frameTick = 0;
      this.dir = 1;
      this.idleTimer = 30 + Math.random() * 100 | 0;
      this.task = null;
      this.targetX = x;
    }

    assignTask(digitIdx, removePixels, placePixels) {
      this.task = { digitIdx, removePixels, placePixels, phase: 'approach', removeIdx: 0, placeIdx: 0 };
      this.state = 'walking';
    }

    update(clock) {
      this.frameTick++;
      if (this.frameTick % 5 === 0) this.frame++;

      if (this.task) {
        const t = this.task;
        const targetX = DIGIT_X[t.digitIdx] + 2;

        if (t.phase === 'approach') {
          const dx = targetX - this.x;
          if (Math.abs(dx) > 0.5) {
            this.x += Math.sign(dx) * 0.4;
            this.dir = Math.sign(dx);
            this.state = 'walking';
          } else {
            t.phase = 'remove';
            this.state = 'hammering';
          }
        } else if (t.phase === 'remove') {
          if (this.frameTick % 3 === 0) {
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
              this.state = 'walking';
              this.targetX = this.homeX;
              this.idleTimer = 40;
            }
          }
        }
      } else {
        this.idleTimer--;
        if (this.idleTimer <= 0) {
          const r = Math.random();
          if (r < 0.15 && this.role !== 'scaffold') {
            this.state = 'sitting';
            this.idleTimer = 100 + Math.random() * 180 | 0;
          } else if (r < 0.5) {
            this.state = 'walking';
            // Wander within a zone based on role
            const range = this.role === 'scaffold' ? 8 : 20;
            this.targetX = this.homeX + (Math.random() - 0.5) * range;
            this.targetX = Math.max(3, Math.min(GPW - 5, this.targetX));
            this.idleTimer = 60 + Math.random() * 120 | 0;
          } else {
            this.state = 'idle';
            this.idleTimer = 40 + Math.random() * 80 | 0;
          }
        }
        if (this.state === 'walking' && !this.task) {
          const dx = this.targetX - this.x;
          if (Math.abs(dx) > 0.5) {
            this.x += Math.sign(dx) * 0.12;
            this.dir = Math.sign(dx);
          } else {
            this.state = 'idle';
          }
        }
      }
    }

    draw(ctx) {
      drawWorkerSprite(ctx, this.x, GROUND_Y, this.state, this.frame, this.dir);
    }
  }

  // === SCAFFOLD WORKER (on scaffold, higher up) ===
  class ScaffoldWorker {
    constructor(x, platformY) {
      this.x = x;
      this.platformY = platformY;
      this.state = 'hammering';
      this.frame = 0;
      this.frameTick = 0;
      this.dir = 1;
      this.idleTimer = 60;
    }

    update() {
      this.frameTick++;
      if (this.frameTick % 5 === 0) this.frame++;
      this.idleTimer--;
      if (this.idleTimer <= 0) {
        this.state = this.state === 'hammering' ? 'idle' : 'hammering';
        this.idleTimer = 40 + Math.random() * 100 | 0;
      }
    }

    draw(ctx) {
      drawWorkerSprite(ctx, this.x, this.platformY, this.state, this.frame, this.dir);
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
      this.canvas.style.cssText = 'position:fixed;top:140px;left:30px;z-index:9999;border-radius:8px;pointer-events:none;';
      this.canvas.width = CW;
      this.canvas.height = CH;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;

      if (window.innerWidth < 600) {
        this.canvas.style.transform = 'scale(0.55)';
        this.canvas.style.transformOrigin = 'top left';
      }

      this.digitPixels = {};
      this.particles = [];

      // Workers spread across scene
      this.workers = [
        new Worker(8, 'digit'),       // near digits, left
        new Worker(25, 'digit'),      // near digits, right
        new Worker(35, 'ground'),     // near ladder
        new Worker(50, 'ground'),     // near house
      ];

      // Worker on scaffold (high up, next to house)
      this.scaffoldWorker = new ScaffoldWorker(44, GROUND_Y - 7);

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
      this.scaffoldWorker.update();
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);
      this.colonTick++;
      if (this.colonTick % 30 === 0) this.colonVisible = !this.colonVisible;

      // === DRAW ===
      ctx.clearRect(0, 0, CW, CH);

      // Background
      ctx.fillStyle = COL_BG;
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.arcTo(CW, 0, CW, CH, r);
      ctx.arcTo(CW, CH, 0, CH, r); ctx.arcTo(0, CH, 0, 0, r);
      ctx.arcTo(0, 0, CW, 0, r); ctx.fill();

      // Scene (house, ladder, scaffold, ground)
      drawScene(ctx);

      // Digit pixels with glow
      for (const key in this.digitPixels) {
        const [gx, gy] = key.split(',').map(Number);
        ctx.fillStyle = COL_DIGIT_GLOW;
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

      // Workers
      this.workers.forEach(w => w.draw(ctx));
      this.scaffoldWorker.draw(ctx);

      requestAnimationFrame(this.loop);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PixelClock());
  } else {
    new PixelClock();
  }
})();
