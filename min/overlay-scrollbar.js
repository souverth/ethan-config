// ==UserScript==
// @name         Overlay Scrollbars
// @description  Custom scrollbars using the OverlayScrollbars library
// @version      1.0.0
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
  const cssURL = 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.0/css/OverlayScrollbars.min.css';
  const jsURL = 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.0/js/OverlayScrollbars.min.js';

  function inject(tag, attributes) {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    document.head.appendChild(element);
    return element;
  }

  function initializeOverlayScrollbars() {
    try {
      OverlayScrollbars(document.body, {
        className: 'os-theme-dark',
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: 500,
          clickScrolling: true,
          dragScrolling: true
        }
      });
      console.info('OverlayScrollbars initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize OverlayScrollbars:', error);
    }
  }

  const readyInterval = setInterval(() => {
    if (!document.head) return;
    clearInterval(readyInterval);

    inject('link', { rel: 'stylesheet', href: cssURL });
    const script = inject('script', { src: jsURL });
    script.onload = initializeOverlayScrollbars;
    script.onerror = () => console.error('Failed to load OverlayScrollbars script.');
  }, 10);
})();
