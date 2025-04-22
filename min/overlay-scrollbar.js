// ==UserScript==
// @name         Overlay Scrollbars Auto-hide (Fast, CSP-safe)
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function () {
  const jsURL = 'https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.13.0/js/OverlayScrollbars.min.js';

  function injectScript(src, onload, onerror) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = onload;
    script.onerror = onerror;
    document.head.appendChild(script);
  }

  function injectFallbackCSS() {
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow-x: hidden !important;
      }
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
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
      scrollbar-width: thin;
      overflow-x: hidden;
      scrollbar-color: rgba(120,120,120,0.3) transparent;
    `;
    document.head.appendChild(style);
  }

  const init = setInterval(() => {
    if (!document.body || !document.head) return;
    clearInterval(init);

    injectScript(jsURL, () => {
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
        injectFallbackCSS();
      }
    }, () => {
      console.warn('OverlayScrollbars bị chặn hoặc lỗi tải.');
      injectFallbackCSS();
    });
  }, 20);
})();
