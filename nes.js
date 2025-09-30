const romInput = document.getElementById('romInput');
const btnRun = document.getElementById('btnRun');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');
const btnSaveState = document.getElementById('btnSaveState');
const btnLoadState = document.getElementById('btnLoadState');
const status = document.getElementById('status');
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

const imgData = ctx.createImageData(256, 240);
let nes = null;
let running = false;
let rafId = null;
let savedState = null;

function makeNes() {
  return new jsnes.NES({
    onFrame: function(frameBuffer) {
      for (let i = 0, j = 0; i < frameBuffer.length; i += 3, j += 4) {
        imgData.data[j] = frameBuffer[i];
        imgData.data[j+1] = frameBuffer[i+1];
        imgData.data[j+2] = frameBuffer[i+2];
        imgData.data[j+3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    onAudioSample: function() {}
  });
}

function startLoop() {
  if (rafId) return;
  function frame() {
    if (nes && running) nes.frame();
    rafId = requestAnimationFrame(frame);
  }
  frame();
}

romInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  status.textContent = `Chargement de ${f.name}...`;
  const reader = new FileReader();
  reader.onload = function() {
    try {
      const romData = new Uint8Array(reader.result);
      nes = makeNes();
      nes.loadROM(romData);
    } catch (err) {
      status.textContent = "Erreur au chargement : " + err.message;
      return;
    }
    status.textContent = `${f.name} chargé — prêt.`;
    btnRun.disabled = false;
    btnPause.disabled = false;
    btnReset.disabled = false;
    btnSaveState.disabled = false;
    btnLoadState.disabled = false;
  };
  reader.readAsArrayBuffer(f);
});

btnRun.addEventListener('click', () => { running = true; status.textContent = "En cours..."; startLoop(); });
btnPause.addEventListener('click', () => { running = false; status.textContent = "En pause."; });
btnReset.addEventListener('click', () => { if(nes) nes.reset(); status.textContent = "Reset effectué."; });

btnSaveState.addEventListener('click', () => {
  if (!nes) return;
  if (nes.toJSON) { savedState = JSON.stringify(nes.toJSON()); status.textContent = "État sauvegardé."; }
  else status.textContent = "Sauvegarde non supportée.";
});

btnLoadState.addEventListener('click', () => {
  if (!nes || !savedState) { status.textContent = "Aucun état à charger."; return; }
  if (nes.fromJSON) { nes.fromJSON(JSON.parse(savedState)); status.textContent = "État chargé."; }
  else status.textContent = "Chargement d'état non supporté.";
});

// Mapping clavier simple
window.addEventListener('keydown', (ev) => {
  if (!nes) return;
  const map = {'ArrowLeft':0x80,'ArrowRight':0x40,'ArrowUp':0x20,'ArrowDown':0x10,'z':0x01,'Z':0x01,'x':0x02,'X':0x02};
  const b = map[ev.key]; if (b!==undefined) { nes.controller1.state |= b; ev.preventDefault(); }
});
window.addEventListener('keyup', (ev) => {
  if (!nes) return;
  const map = {'ArrowLeft':0x80,'ArrowRight':0x40,'ArrowUp':0x20,'ArrowDown':0x10,'z':0x01,'Z':0x01,'x':0x02,'X':0x02};
  const b = map[ev.key]; if (b!==undefined) { nes.controller1.state &= ~b; ev.preventDefault(); }
});
