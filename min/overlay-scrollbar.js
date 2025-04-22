// ==UserScript==
// @name         Overlay Scrollbars Auto-hide (Fast)
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function () {
  const cssURL = 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.0/css/OverlayScrollbars.min.css';
  const jsURL = 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.0/js/OverlayScrollbars.min.js';

  function inject(tag, attr) {
    const el = document.createElement(tag);
    Object.assign(el, attr);
    document.head.appendChild(el);
    return el;
  }

  function fallbackScroll() {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px; height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(150,150,150,0.2), rgba(100,100,100,0.3));
        border-radius: 10px;
        backdrop-filter: blur(2px);
        transition: background 0.3s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(130,130,130,0.5), rgba(80,80,80,0.7));
      }
      scrollbar-width: thin;
      scrollbar-color: rgba(120,120,120,0.3) transparent;
    `;
    document.head.appendChild(style);
  }

  const ready = setInterval(() => {
    if (!document.head) return;
    clearInterval(ready);

    inject('link', { rel: 'stylesheet', href: cssURL });
    const script = inject('script', { src: jsURL });
    script.onload = () => {
      try {
        OverlayScrollbars(document.body, {
          className: 'os-theme-dark',
          scrollbars: {
            autoHide: 'scroll',
            autoHideDelay: 800,
            clickScrolling: true,
            dragScrolling: true
          }
        });
      } catch (e) {
        console.warn('OverlayScrollbars failed:', e);
        fallbackScroll();
      }
    };
    script.onerror = fallbackScroll;
  }, 5);
})();
