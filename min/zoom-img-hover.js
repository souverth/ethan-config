// ==UserScript==
// @name         Image Zoom on Hover
// @match        *://*/*
// @run-at       document-end
// ==/UserScript==

const style = document.createElement('style');
style.textContent = `
  img:hover {
    transform: scale(2.5);
    z-index: 9999;
    transition: transform 0.2s ease;
    position: relative;
  }
`;
document.head.appendChild(style);
