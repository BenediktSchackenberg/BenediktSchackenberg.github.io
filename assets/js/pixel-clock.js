/**
 * Retro Pixel Construction Clock v4
 * Workers are ALWAYS busy — carrying bricks, climbing ladders, hammering on house,
 * sweeping, and rebuilding digits when the minute changes.
 */
(function () {
  'use strict';

  const PX = 4;
  const DIGIT_W = 5, DIGIT_H = 7;
  const GPW = 64, GPH = 32;
  const CW = GPW * PX, CH = GPH * PX;

  // Colors
  const C = {
    bg: 'rgba(13,17,23,0.92)',
    digit: '#58a6ff', digitGlow: 'rgba(88,166,255,0.12)',
    helm: '#f0c040', helmShade: '#c89a20',
    body: '#e06030', bodyShade: '#b84820', stripe: '#f0c040',
    pants: '#4060a0', pantsShade: '#304878',
    skin: '#e0b080', skinShade: '#c89060',
    boots: '#503018', belt: '#3a2010',
    hammer: '#a0a0a0', handle: '#8b6914',
    particle: '#8b949e', colon: '#58a6ff',
    ground: '#2a1f0e', groundLine: '#6e4b1e',
    ladder: '#8b6914', rung: '#a07828',
    brick: '#6b3a2a', brickShade: '#4d2a1e',
    roof: '#8b4513', roofShade: '#6b3510',
    window: '#1a3a5c', windowFrame: '#4a6a8a',
    door: '#4d2a1e', scaffold: '#6e4b1e', plank: '#8b6914',
    bucket: '#4a6a8a', cone: '#e06030',
    broom: '#8b6914', broomHead: '#a08050',
  };

  const GROUND_Y = GPH - 3;
  const LADDER_X = 38;
  const SCAFFOLD_Y = GROUND_Y - 7;
  const HOUSE_X = 46;

  // Digit bitmaps
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
    const r = [];
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 5; x++)
        if (DIGITS[d][y] & (1 << (4 - x))) r.push({ x, y });
    return r;
  }

  const DX_START = 10, DY = 3, DGAP = 2;
  const DX = [DX_START, DX_START + DIGIT_W + DGAP, DX_START + 2*(DIGIT_W+DGAP)+3, DX_START + 3*(DIGIT_W+DGAP)+3];
  const COLON_X = DX_START + 2*(DIGIT_W+DGAP);

  function gpx(ctx, gx, gy, col) {
    ctx.fillStyle = col;
    ctx.fillRect(gx * PX, gy * PX, PX, PX);
  }

  // === SCENE ===
  function drawScene(ctx) {
    // Ground
    for (let x = 0; x < GPW; x++) {
      gpx(ctx, x, GROUND_Y, C.groundLine);
      gpx(ctx, x, GROUND_Y+1, C.ground);
      gpx(ctx, x, GROUND_Y+2, C.ground);
    }
    // Dirt specks
    [3,12,22,33,41,55].forEach(x => gpx(ctx, x, GROUND_Y+1, C.groundLine));

    // House
    const hx = HOUSE_X, hy = GROUND_Y;
    for (let y = hy-12; y < hy; y++) {
      for (let x = hx; x < hx+14; x++) {
        const edge = (y%3===0) || ((x + (y%2===0?0:1))%4===0);
        gpx(ctx, x, y, edge ? C.brickShade : C.brick);
      }
    }
    // Unfinished top
    for (let x = hx+8; x < hx+14; x++) { ctx.fillStyle = C.bg; ctx.fillRect(x*PX,(hy-12)*PX,PX,PX); }
    for (let x = hx+10; x < hx+14; x++) { ctx.fillStyle = C.bg; ctx.fillRect(x*PX,(hy-11)*PX,PX,PX); }
    for (let x = hx+12; x < hx+14; x++) { ctx.fillStyle = C.bg; ctx.fillRect(x*PX,(hy-10)*PX,PX,PX); }

    // Roof (partial)
    for (let i = 0; i < 7; i++) {
      gpx(ctx, hx+i, hy-13-i, C.roof);
      if (i < 5) gpx(ctx, hx+13-i, hy-13-i, C.roof);
      for (let x = hx+i+1; x < hx+13-i && i < 5; x++)
        gpx(ctx, x, hy-13-i, C.roofShade);
    }

    // Window
    for (let y = hy-8; y <= hy-5; y++)
      for (let x = hx+2; x <= hx+4; x++) gpx(ctx, x, y, C.window);
    for (let y = hy-9; y <= hy-5; y++) { gpx(ctx, hx+1, y, C.windowFrame); gpx(ctx, hx+5, y, C.windowFrame); }
    for (let x = hx+1; x <= hx+5; x++) { gpx(ctx, x, hy-9, C.windowFrame); gpx(ctx, x, hy-5, C.windowFrame); }
    gpx(ctx, hx+3, hy-7, C.windowFrame); gpx(ctx, hx+3, hy-6, C.windowFrame);

    // Door
    for (let y = hy-4; y < hy; y++)
      for (let x = hx+9; x < hx+12; x++) gpx(ctx, x, y, C.door);
    // Door handle
    gpx(ctx, hx+11, hy-2, C.helm);

    // Scaffold
    const sx = hx-3;
    for (let y = hy-15; y < hy; y++) { gpx(ctx, sx, y, C.scaffold); gpx(ctx, sx+3, y, C.scaffold); }
    for (let x = sx; x <= sx+3; x++) { gpx(ctx, x, SCAFFOLD_Y, C.plank); gpx(ctx, x, hy-14, C.plank); }
    // Cross bracing
    for (let i = 0; i < 6; i++) {
      const bx = sx + Math.round(i * 3/6);
      gpx(ctx, bx, SCAFFOLD_Y + 1 + i, C.scaffold);
    }

    // Ladder
    for (let y = hy-18; y < hy; y++) { gpx(ctx, LADDER_X, y, C.ladder); gpx(ctx, LADDER_X+2, y, C.ladder); }
    for (let y = hy-17; y < hy; y += 2) gpx(ctx, LADDER_X+1, y, C.rung);

    // Props on ground
    gpx(ctx, hx-1, hy-1, C.brick); gpx(ctx, hx-2, hy-1, C.brick); gpx(ctx, hx-1, hy-2, C.brickShade);
    gpx(ctx, hx-2, hy-2, C.brick);
    // Bucket
    gpx(ctx, LADDER_X+4, hy-1, C.bucket); gpx(ctx, LADDER_X+4, hy-2, C.bucket); gpx(ctx, LADDER_X+5, hy-1, C.bucket);
    // Cone
    gpx(ctx, 5, hy-1, C.cone); gpx(ctx, 5, hy-2, C.helm);
    // Toolbox
    gpx(ctx, 8, hy-1, C.boots); gpx(ctx, 9, hy-1, C.boots); gpx(ctx, 8, hy-2, C.hammer);
    // Wheelbarrow silhouette
    gpx(ctx, 30, hy-1, C.scaffold); gpx(ctx, 31, hy-1, C.scaffold); gpx(ctx, 31, hy-2, C.scaffold);
    gpx(ctx, 32, hy-1, C.groundLine); // wheel
  }

  // === WORKER SPRITE ===
  // Worker looks: each has unique colors
  const LOOKS = [
    { // Worker A: classic yellow helm, orange vest
      helm: '#f0c040', helmShade: '#c89a20',
      body: '#e06030', bodyShade: '#b84820', stripe: '#f0c040',
      pants: '#4060a0', pantsShade: '#304878',
      skin: '#e0b080', skinShade: '#c89060',
    },
    { // Worker B: white helm, blue vest, darker skin
      helm: '#e8e8e8', helmShade: '#b0b0b0',
      body: '#3080d0', bodyShade: '#2060a0', stripe: '#e8e8e8',
      pants: '#505050', pantsShade: '#383838',
      skin: '#c09060', skinShade: '#a07848',
    },
  ];

  function drawWorkerSprite(ctx, gx, footY, state, frame, dir, carrying, lookIdx) {
    const x = Math.round(gx) - 2;
    const y = Math.round(footY) - 8;
    const f = frame % 4;
    const L = LOOKS[lookIdx || 0];

    // Hardhat
    gpx(ctx, x+1, y, L.helm); gpx(ctx, x+2, y, L.helm); gpx(ctx, x+3, y, L.helm);
    gpx(ctx, x, y+1, L.helmShade); gpx(ctx, x+1, y+1, L.helm); gpx(ctx, x+2, y+1, L.helm);
    gpx(ctx, x+3, y+1, L.helm); gpx(ctx, x+4, y+1, L.helmShade);

    // Face
    gpx(ctx, x+1, y+2, L.skin); gpx(ctx, x+2, y+2, L.skin); gpx(ctx, x+3, y+2, L.skin);
    ctx.fillStyle = '#202020';
    ctx.fillRect((x+1)*PX+1,(y+2)*PX+1,2,2);
    ctx.fillRect((x+3)*PX+1,(y+2)*PX+1,2,2);
    // Expression
    if (state === 'hammering' && f%2===0) {
      ctx.fillRect((x+2)*PX+1,(y+2)*PX+3,2,1);
    } else if (state === 'carrying') {
      // Slight strain
      ctx.fillRect((x+2)*PX,(y+2)*PX+3,3,1);
    }

    // Neck + torso
    gpx(ctx, x+2, y+3, L.skinShade);
    gpx(ctx, x+1, y+3, L.body); gpx(ctx, x+3, y+3, L.body);
    gpx(ctx, x+1, y+4, L.body); gpx(ctx, x+2, y+4, L.stripe); gpx(ctx, x+3, y+4, L.body);
    gpx(ctx, x+1, y+5, L.bodyShade); gpx(ctx, x+2, y+5, C.belt); gpx(ctx, x+3, y+5, L.bodyShade);

    // Arms
    if (state === 'hammering') {
      const up = f%2===0;
      const as = dir>0 ? x+4 : x;
      const os = dir>0 ? x : x+4;
      gpx(ctx, as, y+4, L.skin);
      if (up) {
        gpx(ctx, as, y+3, C.handle); gpx(ctx, as, y+2, C.hammer);
        const hx2 = dir>0 ? as+1 : as-1;
        if (hx2>=0 && hx2<GPW) gpx(ctx, hx2, y+2, C.hammer);
      } else {
        gpx(ctx, as, y+5, C.handle);
        const hx2 = dir>0 ? as+1 : as-1;
        if (hx2>=0 && hx2<GPW) gpx(ctx, hx2, y+5, C.hammer);
      }
      gpx(ctx, os, y+4, L.skin);
    } else if (state === 'carrying') {
      // Both arms up holding something
      gpx(ctx, x, y+3, L.skin); gpx(ctx, x+4, y+3, L.skin);
      // The carried item (brick)
      if (carrying === 'brick') {
        gpx(ctx, x+1, y-1, C.brick); gpx(ctx, x+2, y-1, C.brick); gpx(ctx, x+3, y-1, C.brickShade);
      } else if (carrying === 'plank') {
        gpx(ctx, x-1>=0?x-1:0, y, C.plank); gpx(ctx, x+5<GPW?x+5:GPW-1, y, C.plank);
      }
    } else if (state === 'climbing') {
      gpx(ctx, x, y+3, L.skin); gpx(ctx, x+4, y+3, L.skin);
    } else if (state === 'sweeping') {
      const sw = f%2;
      const bs = dir>0 ? x+4 : x;
      gpx(ctx, bs, y+4, L.skin);
      gpx(ctx, bs, y+5, C.broom);
      gpx(ctx, bs+(dir>0?1:-1)>=0 ? bs+(dir>0?1:-1) : 0, y+6, C.broomHead);
      gpx(ctx, bs+(dir>0?(sw?2:0):(sw?-2:0)), y+7, C.broomHead);
      gpx(ctx, dir>0?x:x+4, y+5, L.skin);
    } else if (state === 'walking') {
      gpx(ctx, x, y+4+(f%2), L.skin);
      gpx(ctx, x+4, y+5-(f%2), L.skin);
    } else {
      // idle — hands on hips or at side
      gpx(ctx, x, y+5, L.skin); gpx(ctx, x+4, y+5, L.skin);
    }

    // Legs
    if (state === 'sitting') {
      gpx(ctx, x, y+6, L.pants); gpx(ctx, x+1, y+6, L.pants);
      gpx(ctx, x+3, y+6, L.pants); gpx(ctx, x+4, y+6, L.pants);
      gpx(ctx, x, y+7, C.boots); gpx(ctx, x+4, y+7, C.boots);
    } else if (state === 'walking' || state === 'carrying' || state === 'sweeping') {
      if (f===0||f===2) {
        gpx(ctx,x+1,y+6,L.pants); gpx(ctx,x+3,y+6,L.pants);
        gpx(ctx,x+1,y+7,C.boots); gpx(ctx,x+3,y+7,C.boots);
      } else if (f===1) {
        gpx(ctx,x+(dir>0?0:2),y+6,L.pants); gpx(ctx,x+(dir>0?3:4),y+6,L.pantsShade);
        gpx(ctx,x+(dir>0?0:2),y+7,C.boots); gpx(ctx,x+(dir>0?3:4),y+7,C.boots);
      } else {
        gpx(ctx,x+(dir>0?2:0),y+6,L.pants); gpx(ctx,x+(dir>0?4:1),y+6,L.pantsShade);
        gpx(ctx,x+(dir>0?2:0),y+7,C.boots); gpx(ctx,x+(dir>0?4:1),y+7,C.boots);
      }
    } else if (state === 'climbing') {
      const lo = f%2;
      gpx(ctx,x+1,y+6+lo,L.pants); gpx(ctx,x+3,y+7-lo,L.pants);
      gpx(ctx,x+1,y+7,C.boots); gpx(ctx,x+3,y+7,C.boots);
    } else {
      gpx(ctx,x+1,y+6,L.pants); gpx(ctx,x+3,y+6,L.pants);
      gpx(ctx,x+1,y+7,C.boots); gpx(ctx,x+3,y+7,C.boots);
    }
  }

  // === PARTICLE ===
  class Particle {
    constructor(x,y,col) {
      this.x=x; this.y=y;
      this.vx=(Math.random()-0.5)*1.5;
      this.vy=-Math.random()*1.0-0.3;
      this.life=1; this.size=Math.random()<0.4?0.5:1;
      this.col = col || C.particle;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.05; this.life-=0.018; }
  }

  // === WORKER AI ===
  // Activities: digit-task, carry-brick, carry-plank, sweep, climb-and-hammer, wander, idle-look, sit-rest
  class Worker {
    constructor(homeX, homeY, look) {
      this.x = homeX; this.y = homeY || GROUND_Y;
      this.homeX = homeX; this.homeY = homeY || GROUND_Y;
      this.look = look || 0;
      this.state = 'idle'; this.carrying = null;
      this.frame = 0; this.frameTick = 0; this.dir = 1;
      this.activity = null; // current higher-level activity
      this.actTimer = 20 + Math.random()*60|0;
      this.targetX = homeX; this.targetY = this.y;
      this.task = null; // digit rebuild task
      this.onScaffold = false;
      this.climbPhase = null; // 'up' or 'down'
      this.climbTarget = 0;
    }

    pickActivity() {
      // Choose random busy-work
      const r = Math.random();
      if (r < 0.2) {
        // Carry brick from pile to house
        this.activity = { type: 'carry-brick', phase: 'goto-pile' };
        this.targetX = HOUSE_X - 2; // brick pile
        this.state = 'walking';
      } else if (r < 0.35) {
        // Sweep near digits
        this.activity = { type: 'sweep', timer: 80 + Math.random()*100|0 };
        this.targetX = 10 + Math.random() * 20;
        this.state = 'walking';
      } else if (r < 0.55) {
        // Climb ladder, hammer on scaffold, come back down
        this.activity = { type: 'climb-work', phase: 'goto-ladder' };
        this.targetX = LADDER_X + 1;
        this.state = 'walking';
      } else if (r < 0.7) {
        // Carry plank
        this.activity = { type: 'carry-plank', phase: 'goto-wheelbarrow' };
        this.targetX = 30;
        this.state = 'walking';
      } else if (r < 0.85) {
        // Wander and look around
        this.activity = { type: 'wander', stops: 2 + Math.random()*3|0 };
        this.targetX = 5 + Math.random()*(GPW-12);
        this.state = 'walking';
      } else {
        // Brief sit
        this.activity = { type: 'sit', timer: 60 + Math.random()*80|0 };
        this.state = 'sitting';
      }
    }

    assignDigitTask(digitIdx, removePixels, placePixels) {
      this.task = { digitIdx, removePixels, placePixels, phase: 'approach', removeIdx:0, placeIdx:0 };
      this.activity = null;
      this.state = 'walking';
      this.carrying = null;
      // Reset to ground if on scaffold
      if (this.y !== GROUND_Y) { this.y = GROUND_Y; this.onScaffold = false; }
    }

    update(clock) {
      this.frameTick++;
      if (this.frameTick % 5 === 0) this.frame++;

      // --- DIGIT TASK (highest priority) ---
      if (this.task) {
        const t = this.task;
        const tx = DX[t.digitIdx] + 2;
        if (t.phase === 'approach') {
          if (Math.abs(tx - this.x) > 0.5) {
            this.x += Math.sign(tx - this.x) * 0.45;
            this.dir = Math.sign(tx - this.x) || 1;
            this.state = 'walking';
          } else { t.phase = 'remove'; this.state = 'hammering'; }
        } else if (t.phase === 'remove') {
          if (this.frameTick % 3 === 0) {
            if (t.removeIdx < t.removePixels.length) {
              const p = t.removePixels[t.removeIdx];
              clock.clearPixel(DX[t.digitIdx]+p.x, DY+p.y);
              clock.addParticle(DX[t.digitIdx]+p.x, DY+p.y);
              t.removeIdx++;
            } else t.phase = 'place';
          }
        } else if (t.phase === 'place') {
          this.state = 'hammering';
          if (this.frameTick % 2 === 0) {
            if (t.placeIdx < t.placePixels.length) {
              const p = t.placePixels[t.placeIdx];
              clock.setPixel(DX[t.digitIdx]+p.x, DY+p.y);
              t.placeIdx++;
            } else {
              this.task = null; this.state = 'walking';
              this.targetX = this.homeX; this.actTimer = 30;
            }
          }
        }
        return;
      }

      // --- ACTIVITY AI ---
      if (!this.activity) {
        this.actTimer--;
        if (this.actTimer <= 0) this.pickActivity();
        // Idle look-around
        if (this.state === 'idle' && this.frameTick % 80 === 0) {
          this.dir = -this.dir; // look other way
        }
        return;
      }

      const a = this.activity;

      if (a.type === 'carry-brick') {
        if (a.phase === 'goto-pile') {
          if (this._walkTo(HOUSE_X-2)) { a.phase = 'pickup'; a.pickTimer = 15; }
        } else if (a.phase === 'pickup') {
          this.state = 'idle';
          a.pickTimer--;
          if (a.pickTimer <= 0) { this.carrying = 'brick'; a.phase = 'goto-house'; this.state = 'carrying'; }
        } else if (a.phase === 'goto-house') {
          if (this._walkTo(HOUSE_X+6)) { a.phase = 'place'; a.pickTimer = 20; }
        } else if (a.phase === 'place') {
          this.state = 'hammering'; this.dir = 1;
          a.pickTimer--;
          if (a.pickTimer <= 0) {
            this.carrying = null;
            clock.addParticle(HOUSE_X+7, GROUND_Y-10);
            this.activity = null; this.actTimer = 20+Math.random()*40|0; this.state = 'walking'; this.targetX = this.homeX;
          }
        }
      } else if (a.type === 'carry-plank') {
        if (a.phase === 'goto-wheelbarrow') {
          if (this._walkTo(30)) { a.phase = 'pickup'; a.pickTimer = 12; }
        } else if (a.phase === 'pickup') {
          this.state = 'idle'; a.pickTimer--;
          if (a.pickTimer <= 0) { this.carrying = 'plank'; a.phase = 'goto-scaffold'; this.state = 'carrying'; }
        } else if (a.phase === 'goto-scaffold') {
          if (this._walkTo(HOUSE_X-4)) {
            this.carrying = null; this.activity = null; this.actTimer = 25+Math.random()*50|0;
            this.state = 'idle';
            clock.addParticle(HOUSE_X-3, GROUND_Y-1);
          }
        }
      } else if (a.type === 'sweep') {
        if (Math.abs(this.targetX - this.x) > 0.5) {
          this._walkTo(this.targetX);
        } else {
          this.state = 'sweeping';
          a.timer--;
          // Slowly drift while sweeping
          if (this.frameTick % 20 === 0) this.x += this.dir * 0.3;
          if (a.timer <= 0) {
            this.activity = null; this.actTimer = 30+Math.random()*60|0; this.state = 'idle';
          }
        }
      } else if (a.type === 'climb-work') {
        if (a.phase === 'goto-ladder') {
          if (this._walkTo(LADDER_X+1)) { a.phase = 'climb-up'; }
        } else if (a.phase === 'climb-up') {
          this.state = 'climbing'; this.x = LADDER_X+1;
          if (this.y > SCAFFOLD_Y) {
            this.y -= 0.15;
          } else {
            this.y = SCAFFOLD_Y; a.phase = 'hammer'; a.hammerTimer = 80+Math.random()*100|0;
            this.x = HOUSE_X - 2; this.dir = 1;
          }
        } else if (a.phase === 'hammer') {
          this.state = 'hammering';
          a.hammerTimer--;
          if (this.frameTick % 40 === 0) {
            clock.addParticle(this.x + this.dir*3, this.y - 4);
          }
          if (a.hammerTimer <= 0) { a.phase = 'goto-ladder-down'; }
        } else if (a.phase === 'goto-ladder-down') {
          if (Math.abs(LADDER_X+1 - this.x) > 0.5) {
            this.x += Math.sign(LADDER_X+1 - this.x) * 0.3;
            this.dir = Math.sign(LADDER_X+1 - this.x) || 1;
            this.state = 'walking';
          } else { a.phase = 'climb-down'; this.x = LADDER_X+1; }
        } else if (a.phase === 'climb-down') {
          this.state = 'climbing';
          if (this.y < GROUND_Y) {
            this.y += 0.15;
          } else {
            this.y = GROUND_Y;
            this.activity = null; this.actTimer = 30+Math.random()*50|0; this.state = 'idle';
          }
        }
      } else if (a.type === 'wander') {
        if (Math.abs(this.targetX - this.x) > 0.5) {
          this._walkTo(this.targetX);
        } else {
          this.state = 'idle';
          a.stops--;
          if (a.stops <= 0) {
            this.activity = null; this.actTimer = 20+Math.random()*40|0;
          } else {
            // Pause then pick new target
            setTimeout(() => {
              if (this.activity === a) {
                this.targetX = 5+Math.random()*(GPW-12);
                this.state = 'walking';
              }
            }, 600 + Math.random()*1000);
          }
        }
      } else if (a.type === 'sit') {
        this.state = 'sitting';
        a.timer--;
        if (a.timer <= 0) {
          this.activity = null; this.actTimer = 15+Math.random()*40|0; this.state = 'idle';
        }
      }
    }

    _walkTo(tx) {
      const dx = tx - this.x;
      if (Math.abs(dx) > 0.5) {
        this.x += Math.sign(dx) * 0.18;
        this.dir = Math.sign(dx);
        this.state = this.carrying ? 'carrying' : 'walking';
        return false;
      }
      return true;
    }

    draw(ctx) {
      drawWorkerSprite(ctx, this.x, this.y, this.state, this.frame, this.dir, this.carrying, this.look);
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
      this.canvas.width = CW; this.canvas.height = CH;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.imageSmoothingEnabled = false;

      if (window.innerWidth < 600) {
        this.canvas.style.transform = 'scale(0.55)';
        this.canvas.style.transformOrigin = 'top left';
      }

      this.digitPixels = {};
      this.particles = [];

      // 2 workers with distinct looks
      this.workers = [
        new Worker(12, null, 0),  // Yellow helm, orange vest
        new Worker(40, null, 1),  // White helm, blue vest
      ];
      this.workers[0].actTimer = 5;
      this.workers[1].actTimer = 30;

      this.lastMinute = -1;
      this.lastDigits = [-1,-1,-1,-1];
      this.colonVisible = true;
      this.colonTick = 0;
      this.initialized = false;

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    setPixel(gx,gy) { this.digitPixels[gx+','+gy] = true; }
    clearPixel(gx,gy) { delete this.digitPixels[gx+','+gy]; }
    addParticle(gx,gy,col) {
      for (let i=0; i<3; i++) this.particles.push(new Particle(gx+Math.random(),gy+Math.random(),col));
    }

    setDigitInstant(idx,d) {
      for (let y=0;y<DIGIT_H;y++) for (let x=0;x<DIGIT_W;x++) this.clearPixel(DX[idx]+x,DY+y);
      getDigitPixels(d).forEach(p => this.setPixel(DX[idx]+p.x, DY+p.y));
    }

    getTimeDigits() {
      const n = new Date(), h=n.getHours(), m=n.getMinutes();
      return [h/10|0, h%10, m/10|0, m%10];
    }

    scheduleTransition(nd) {
      for (let i=0;i<4;i++) {
        if (nd[i] !== this.lastDigits[i]) {
          const op = this.lastDigits[i]>=0 ? getDigitPixels(this.lastDigits[i]) : [];
          const np = getDigitPixels(nd[i]);
          const os = new Set(op.map(p=>p.x+','+p.y)), ns = new Set(np.map(p=>p.x+','+p.y));
          const rem = op.filter(p=>!ns.has(p.x+','+p.y)).sort(()=>Math.random()-0.5);
          const add = np.filter(p=>!os.has(p.x+','+p.y)).sort(()=>Math.random()-0.5);

          let bw=null, bd=Infinity;
          for (const w of this.workers) {
            if (w.task) continue;
            const d = Math.abs(w.x - DX[i]);
            if (d<bd) { bd=d; bw=w; }
          }
          if (bw) bw.assignDigitTask(i, rem, add);
          else this.setDigitInstant(i, nd[i]);
        }
      }
      this.lastDigits = [...nd];
    }

    loop() {
      const ctx = this.ctx;
      const cm = (new Date()).getHours()*60+(new Date()).getMinutes();
      const digits = this.getTimeDigits();

      if (!this.initialized) {
        for (let i=0;i<4;i++) this.setDigitInstant(i,digits[i]);
        this.lastDigits=[...digits]; this.lastMinute=cm; this.initialized=true;
      }
      if (cm !== this.lastMinute) { this.lastMinute=cm; this.scheduleTransition(digits); }

      this.workers.forEach(w=>w.update(this));
      this.particles.forEach(p=>p.update());
      this.particles = this.particles.filter(p=>p.life>0);
      this.colonTick++;
      if (this.colonTick%30===0) this.colonVisible=!this.colonVisible;

      // DRAW
      ctx.clearRect(0,0,CW,CH);
      ctx.fillStyle=C.bg;
      const r=8;
      ctx.beginPath(); ctx.moveTo(r,0); ctx.arcTo(CW,0,CW,CH,r);
      ctx.arcTo(CW,CH,0,CH,r); ctx.arcTo(0,CH,0,0,r); ctx.arcTo(0,0,CW,0,r); ctx.fill();

      drawScene(ctx);

      // Digits
      for (const k in this.digitPixels) {
        const [gx,gy]=k.split(',').map(Number);
        ctx.fillStyle=C.digitGlow;
        ctx.fillRect(gx*PX-1,gy*PX-1,PX+2,PX+2);
        ctx.fillStyle=C.digit;
        ctx.fillRect(gx*PX,gy*PX,PX,PX);
      }
      // Colon
      if (this.colonVisible) {
        ctx.fillStyle=C.colon;
        ctx.fillRect(COLON_X*PX,(DY+2)*PX,PX,PX);
        ctx.fillRect(COLON_X*PX,(DY+4)*PX,PX,PX);
      }
      // Particles
      this.particles.forEach(p => {
        ctx.globalAlpha=Math.max(0,p.life);
        ctx.fillStyle=p.col;
        ctx.fillRect(p.x*PX,p.y*PX,p.size*PX*0.6,p.size*PX*0.6);
      });
      ctx.globalAlpha=1;

      // Workers (sorted by Y for depth)
      this.workers.slice().sort((a,b)=>a.y-b.y).forEach(w=>w.draw(ctx));

      requestAnimationFrame(this.loop);
    }
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>new PixelClock());
  else new PixelClock();
})();
