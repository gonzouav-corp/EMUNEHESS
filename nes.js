// nes.js

// Animation du texte d'accueil sur la page index.html

document.addEventListener('DOMContentLoaded', () => {
  const text = "Bienvenue sur EMUNEHESS !\n\nChargez vos ROMs pour commencer.";
  const container = document.getElementById('welcome-text');
  if (!container) return;

  container.textContent = '';
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      if (text[i] === '\n') {
        container.appendChild(document.createElement('br'));
      } else {
        container.append(text[i]);
      }
      i++;
      setTimeout(typeWriter, 40);
    }
  }

  typeWriter();
});
