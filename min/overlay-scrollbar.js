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
        scrollbar-color: #e0e0e0 transparent;
      }

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 10px;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
        transition: background 0.3s ease, box-shadow 0.3s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #ffffff;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
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