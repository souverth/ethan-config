// ==UserScript==
// @name         Disable Lazy Loading Images
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.setAttribute('loading', 'eager');
});