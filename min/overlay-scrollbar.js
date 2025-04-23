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
      * {
        scrollbar-width: thin;
        scrollbar-color: #cfcfcf #f5f5f5;
      }

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 8px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #dadada, #b0b0b0);
        border-radius: 8px;
        border: 2px solid #f5f5f5;
        box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
        transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ffffff, #c0c0c0);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      }
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