// nes.js

// Animation du texte d'accueil sur la page index.html

document.addEventListener('DOMContentLoaded', () => {
  const text = "Bienvenue sur EMUNEHESS !\n\nChargez vos ROMs pour commencer.";
  const container = document.getElementById('welcome-text');
  if (!container) return;

  container.textContent = '';
  let i = 0;
  let wordBuffer = '';
  let isTag = false;

  function createWordSpan(word) {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.transition = 'color 0.2s';
    span.addEventListener('mouseover', () => {
      span.style.color = '#0078D7'; // Couleur au survol
    });
    span.addEventListener('mouseout', () => {
      span.style.color = ''; // Couleur par défaut
    });
    return span;
  }

  function typeWriter() {
    if (i < text.length) {
      const char = text[i];

      if (char === '\n') {
        if (wordBuffer) {
          container.appendChild(createWordSpan(wordBuffer));
          wordBuffer = '';
        }
        container.appendChild(document.createElement('br'));
      } else if (char === ' ') {
        if (wordBuffer) {
          container.appendChild(createWordSpan(wordBuffer));
          wordBuffer = '';
        }
        container.appendChild(document.createTextNode(' '));
      } else {
        wordBuffer += char;
      }
      i++;
      setTimeout(typeWriter, 40);
    } else {
      // Afficher le dernier mot s'il y en a un
      if (wordBuffer) {
        container.appendChild(createWordSpan(wordBuffer));
      }
    }
  }

  typeWriter();
});
