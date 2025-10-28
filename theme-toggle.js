(function(){
  'use strict';
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const storageKey = 'site-theme';

  function applyTheme(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // choix initial: localStorage > prefers-color-scheme > light
  try {
    const saved = localStorage.getItem(storageKey);
    const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(initial);
  } catch (e) {
    // si localStorage non disponible, utiliser préférence système si possible
    const initial = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    applyTheme(initial);
  }

  if (toggle) {
    toggle.addEventListener('click', function(){
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(storageKey, next); } catch(e) { /* ignore */ }
    });
  }
})();
