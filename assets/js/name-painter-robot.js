/**
 * Name Painter Robot v1
 * A cute animated pixel robot drives across the navbar,
 * pulls out a paintbrush, and paints each letter of the name in rainbow colors.
 * Posts funny dialogue bubbles while working.
 */
(function () {
  'use strict';

  // Wait for DOM
  function init() {
    // Find the site title link in the navbar
    const titleEl = document.querySelector('.navbar-brand, .site-title a, h1.site-heading a, .navbar a.navbar-brand');
    if (!titleEl) return;

    const originalText = titleEl.textContent.trim();
    if (!originalText) return;

    // Configuration
    const ROBOT_SIZE = 28; // robot pixel size
    const PAINT_COLORS = [
      '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
      '#ff6bff', '#ff9f43', '#00d2d3', '#ff6348',
      '#7bed9f', '#eccc68', '#a29bfe', '#fd79a8',
    ];

    const DIALOGUES = [
      "Beep boop! 🎨",
      "Malen macht Spaß!",
      "Schöner Name! ✨",
      "Fast fertig...",
      "*pfeif* 🎵",
      "Kunst! KUNST!!",
      "Wer braucht Picasso?",
      "Robo-Painter 3000™",
      "01001000 01101001!",
      "Farbe läuft... 🤖",
      "Noch'n Buchstabe!",
      "Meisterwerk! 🖌️",
      "Brrr... VROOOOM!",
      "Ich liebe meinen Job!",
      "Pinselpinsel...",
      "Error 404: Talent not— jk! 😎",
      "RGB oder CMYK? 🤔",
      "*robotertanz* 🕺",
      "Schackenberg... schöön!",
      "Loading creativity...",
    ];

    // State
    let phase = 'waiting'; // waiting, driving-in, painting, driving-out, idle, repaint-cycle
    let robotX = -40;
    let robotY = 0;
    let targetX = 0;
    let currentLetterIdx = 0;
    let paintProgress = 0;
    let dialogueTimer = 0;
    let dialogueText = '';
    let dialogueFade = 0;
    let wheelFrame = 0;
    let armAngle = 0;
    let brushOut = false;
    let eyeBlink = 0;
    let antennaWiggle = 0;
    let idleTimer = 0;
    let paintedLetters = [];
    let driveSpeed = 2.5;
    let exhaust = [];

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-block;';
    titleEl.parentNode.insertBefore(wrapper, titleEl);
    wrapper.appendChild(titleEl);

    // Create canvas overlay for robot + effects
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:-20px;left:0;pointer-events:none;z-index:100;';
    wrapper.appendChild(canvas);

    // Create letter spans for individual coloring
    titleEl.innerHTML = '';
    const letterSpans = [];
    for (let i = 0; i < originalText.length; i++) {
      const span = document.createElement('span');
      span.textContent = originalText[i];
      span.style.transition = 'color 0.4s ease, text-shadow 0.4s ease';
      titleEl.appendChild(span);
      letterSpans.push(span);
      paintedLetters.push(false);
    }

    // Speech bubble element
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      position:absolute; top:-32px; left:0;
      background:rgba(13,17,23,0.95); color:#e6edf3; border:1px solid #58a6ff;
      border-radius:8px; padding:2px 8px; font-size:11px; font-family:monospace;
      white-space:nowrap; pointer-events:none; opacity:0;
      transition:opacity 0.3s ease; z-index:101;
      box-shadow: 0 2px 8px rgba(88,166,255,0.2);
    `;
    wrapper.appendChild(bubble);

    // Size canvas
    function resizeCanvas() {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width + 80;
      canvas.height = 60;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    // === ROBOT DRAWING ===
    function drawRobot(x, y) {
      const s = 1; // scale
      const cx = x, cy = y + 10;

      // Exhaust particles
      exhaust.forEach(p => {
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillStyle = '#8b949e';
        ctx.fillRect(p.x, p.y, 2, 2);
      });
      ctx.globalAlpha = 1;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.ellipse ? ctx.beginPath() : 0;
      ctx.fillRect(cx - 8, cy + 18, 20, 3);

      // Tracks/wheels
      const wf = wheelFrame % 4;
      ctx.fillStyle = '#404040';
      ctx.fillRect(cx - 8, cy + 14, 8, 5);
      ctx.fillRect(cx + 4, cy + 14, 8, 5);
      // Wheel treads
      ctx.fillStyle = '#555';
      ctx.fillRect(cx - 7 + wf, cy + 15, 2, 3);
      ctx.fillRect(cx - 3 + wf, cy + 15, 2, 3);
      ctx.fillRect(cx + 5 + wf, cy + 15, 2, 3);
      ctx.fillRect(cx + 9 + (wf > 2 ? wf-4 : wf), cy + 15, 2, 3);

      // Body
      ctx.fillStyle = '#58a6ff';
      roundRect(ctx, cx - 7, cy, 18, 14, 3);
      ctx.fill();
      // Body highlight
      ctx.fillStyle = '#79b8ff';
      ctx.fillRect(cx - 5, cy + 1, 14, 2);
      // Body shade
      ctx.fillStyle = '#3a7bd5';
      ctx.fillRect(cx - 5, cy + 11, 14, 2);

      // Belly panel
      ctx.fillStyle = '#1a3a5c';
      roundRect(ctx, cx - 4, cy + 4, 12, 6, 2);
      ctx.fill();
      // Panel lights
      const blink = Date.now() % 1000 < 500;
      ctx.fillStyle = blink ? '#6bcb77' : '#2a5a3a';
      ctx.fillRect(cx - 2, cy + 6, 2, 2);
      ctx.fillStyle = !blink ? '#ff6b6b' : '#5a2a2a';
      ctx.fillRect(cx + 1, cy + 6, 2, 2);
      ctx.fillStyle = '#ffd93d';
      ctx.fillRect(cx + 4, cy + 6, 2, 2);

      // Eyes
      const blinkNow = eyeBlink > 0;
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(cx - 3, cy - 5, 5, blinkNow ? 1 : 4);
      ctx.fillRect(cx + 3, cy - 5, 5, blinkNow ? 1 : 4);
      if (!blinkNow) {
        // Pupils
        ctx.fillStyle = '#58a6ff';
        ctx.fillRect(cx - 1, cy - 4, 2, 2);
        ctx.fillRect(cx + 5, cy - 4, 2, 2);
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - 2, cy - 5, 1, 1);
        ctx.fillRect(cx + 4, cy - 5, 1, 1);
      }

      // Head plate
      ctx.fillStyle = '#79b8ff';
      ctx.fillRect(cx - 5, cy - 7, 14, 3);
      ctx.fillStyle = '#58a6ff';
      ctx.fillRect(cx - 6, cy - 6, 16, 2);

      // Antenna
      const aw = Math.sin(antennaWiggle * 0.1) * 2;
      ctx.fillStyle = '#8b949e';
      ctx.fillRect(cx + 1 + aw, cy - 12, 2, 6);
      // Antenna ball (blinks)
      ctx.fillStyle = Date.now() % 600 < 300 ? '#ff6b6b' : '#ffd93d';
      ctx.fillRect(cx + aw, cy - 13, 4, 3);

      // Arm with brush
      if (brushOut) {
        const ax = cx + 12;
        const ay = cy + 2;
        const angle = armAngle;

        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(angle * Math.PI / 180);

        // Arm
        ctx.fillStyle = '#8b949e';
        ctx.fillRect(0, -1, 10, 3);
        // Hand
        ctx.fillStyle = '#58a6ff';
        ctx.fillRect(9, -2, 4, 5);
        // Brush handle
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(12, -1, 8, 3);
        // Brush head
        ctx.fillStyle = PAINT_COLORS[currentLetterIdx % PAINT_COLORS.length];
        ctx.fillRect(19, -3, 4, 7);
        // Brush bristles
        ctx.fillStyle = PAINT_COLORS[(currentLetterIdx + 3) % PAINT_COLORS.length];
        ctx.fillRect(22, -2, 2, 5);
        // Paint drip
        if (Math.random() < 0.05) {
          ctx.fillStyle = PAINT_COLORS[currentLetterIdx % PAINT_COLORS.length];
          ctx.fillRect(20 + Math.random()*4, 5, 1, 2);
        }

        ctx.restore();
      } else {
        // Arm tucked
        ctx.fillStyle = '#8b949e';
        ctx.fillRect(cx + 10, cy + 4, 3, 4);
      }

      // Left arm (static or waving)
      ctx.fillStyle = '#8b949e';
      if (phase === 'idle' && idleTimer % 60 < 30) {
        ctx.fillRect(cx - 10, cy + 1, 3, 5); // wave up
      } else {
        ctx.fillRect(cx - 10, cy + 4, 3, 4);
      }

      // Mouth (changes with dialogue)
      if (dialogueText && dialogueFade > 0.5) {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(cx, cy - 1, 4, 2); // talking mouth
      } else {
        ctx.fillStyle = '#e6edf3';
        ctx.fillRect(cx - 1, cy - 1, 6, 1); // smile
        ctx.fillRect(cx, cy, 4, 1);
      }
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r); ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
    }

    // === LETTER PAINTING ===
    function paintLetter(idx) {
      if (idx >= letterSpans.length) return;
      if (originalText[idx] === ' ') { paintedLetters[idx] = true; return; }

      const color = PAINT_COLORS[idx % PAINT_COLORS.length];
      letterSpans[idx].style.color = color;
      letterSpans[idx].style.textShadow = `0 0 8px ${color}40, 0 0 2px ${color}80`;
      paintedLetters[idx] = true;
    }

    function showDialogue(text) {
      dialogueText = text;
      dialogueFade = 1;
      dialogueTimer = 120;
    }

    // === ANIMATION LOOP ===
    let lastTime = 0;
    let frameCount = 0;

    function update() {
      frameCount++;

      // Wheel animation
      if (phase === 'driving-in' || phase === 'driving-out') {
        wheelFrame += 0.5;
      }

      // Eye blink
      if (eyeBlink > 0) eyeBlink--;
      if (Math.random() < 0.008) eyeBlink = 5;

      // Antenna
      antennaWiggle++;

      // Dialogue fade
      if (dialogueTimer > 0) {
        dialogueTimer--;
        if (dialogueTimer < 20) dialogueFade = dialogueTimer / 20;
      }

      // Exhaust
      if (phase === 'driving-in' || phase === 'driving-out') {
        if (frameCount % 3 === 0) {
          exhaust.push({
            x: robotX - 8, y: robotY + 22,
            vx: -1 - Math.random(), vy: -Math.random() * 0.5,
            life: 1
          });
        }
      }
      exhaust.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.03; });
      exhaust = exhaust.filter(p => p.life > 0);

      // === STATE MACHINE ===
      if (phase === 'waiting') {
        // Start after brief delay
        if (frameCount > 60) {
          phase = 'driving-in';
          robotX = -40;
          robotY = 15;
          showDialogue("Beep boop! Anfahrt! 🚗");
        }
      }

      else if (phase === 'driving-in') {
        robotX += driveSpeed;
        // Stop at first letter position
        const firstLetterX = getLetterX(currentLetterIdx);
        if (robotX >= firstLetterX - 25) {
          robotX = firstLetterX - 25;
          phase = 'brush-out';
          brushOut = true;
          armAngle = -30;
          showDialogue(DIALOGUES[Math.random() * DIALOGUES.length | 0]);
        }
      }

      else if (phase === 'brush-out') {
        armAngle += 2;
        if (armAngle >= 15) {
          phase = 'painting';
          paintProgress = 0;
        }
      }

      else if (phase === 'painting') {
        // Wiggle brush
        armAngle = 10 + Math.sin(frameCount * 0.3) * 15;

        paintProgress++;
        if (paintProgress % 12 === 0) {
          paintLetter(currentLetterIdx);
          currentLetterIdx++;

          // Random dialogue
          if (Math.random() < 0.4 || currentLetterIdx === letterSpans.length) {
            showDialogue(DIALOGUES[Math.random() * DIALOGUES.length | 0]);
          }

          if (currentLetterIdx < letterSpans.length) {
            // Skip spaces quickly
            while (currentLetterIdx < letterSpans.length && originalText[currentLetterIdx] === ' ') {
              paintLetter(currentLetterIdx);
              currentLetterIdx++;
            }
          }
        }

        // Move robot to follow current letter
        if (currentLetterIdx < letterSpans.length) {
          const lx = getLetterX(currentLetterIdx);
          const diff = (lx - 25) - robotX;
          if (Math.abs(diff) > 1) {
            robotX += Math.sign(diff) * Math.min(Math.abs(diff) * 0.08, 1.5);
            wheelFrame += 0.2;
          }
        }

        if (currentLetterIdx >= letterSpans.length) {
          phase = 'finished-pause';
          brushOut = false;
          armAngle = 0;
          showDialogue("Fertig! Meisterwerk! 🎉");
          idleTimer = 0;
        }
      }

      else if (phase === 'finished-pause') {
        idleTimer++;
        if (idleTimer > 120) {
          phase = 'driving-out';
          showDialogue("Tschüss! *vroooom* 🤖💨");
        }
      }

      else if (phase === 'driving-out') {
        robotX += driveSpeed * 1.5;
        wheelFrame += 0.5;
        if (robotX > canvas.width + 50) {
          phase = 'idle';
          idleTimer = 0;
        }
      }

      else if (phase === 'idle') {
        idleTimer++;
        // After a while, slowly fade letters back to normal, then repaint
        if (idleTimer > 600) { // ~10 seconds
          phase = 'fade-out';
          currentLetterIdx = 0;
        }
      }

      else if (phase === 'fade-out') {
        if (frameCount % 8 === 0) {
          if (currentLetterIdx < letterSpans.length) {
            letterSpans[currentLetterIdx].style.color = '';
            letterSpans[currentLetterIdx].style.textShadow = '';
            paintedLetters[currentLetterIdx] = false;
            currentLetterIdx++;
          } else {
            // Reset and restart
            currentLetterIdx = 0;
            robotX = -40;
            phase = 'driving-in';
            driveSpeed = 2 + Math.random();
            showDialogue("Nochmal! 🔄🎨");
          }
        }
      }
    }

    function getLetterX(idx) {
      if (idx >= letterSpans.length) idx = letterSpans.length - 1;
      if (idx < 0) return 0;
      const rect = letterSpans[idx].getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      return rect.left - wrapRect.left + rect.width / 2;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (phase !== 'idle' && phase !== 'waiting') {
        drawRobot(robotX, robotY);
      }

      // Update speech bubble
      if (dialogueFade > 0 && phase !== 'idle') {
        bubble.style.opacity = dialogueFade;
        bubble.textContent = dialogueText;
        bubble.style.left = (robotX - 10) + 'px';
      } else {
        bubble.style.opacity = '0';
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
