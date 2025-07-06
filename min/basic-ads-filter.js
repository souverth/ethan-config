// ==UserScript==
// @name         YouTube Ad Blocker FullScope
// @description  Block all YouTube ads: video, overlay, sidebar, homepage
// @version      1.3.0
// @match        *://www.youtube.com/*
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const PLAYER_AD_SELECTORS = [
    '.video-ads',
    '.ytp-ad-module',
    '.ytp-ad-overlay-container',
    '.ytp-ad-preview-container',
    '.ytp-ad-player-overlay',
    '.ytp-ad-skip-button',
    '.ytp-ad-overlay-image',
    'iframe[src*="doubleclick.net"]'
  ];

  const PAGE_AD_SELECTORS = [
    '#masthead-ad',
    'ytd-display-ad-renderer',
    'ytd-promoted-video-renderer',
    'ytd-banner-promo-renderer',
    'ytd-ad-slot-renderer',
    '.ytd-search-pyv-renderer',
    'ytd-player-legacy-desktop-watch-ads-renderer'
  ];

  const SHORTS_SELECTORS = [
  'ytd-rich-section-renderer',
  'ytd-reel-shelf-renderer',
  'ytd-reel-video-renderer',
  'a[href^="/shorts/"]',
  'ytd-reel-player-overlay-renderer'
];

  function removeAds() {
    [...PLAYER_AD_SELECTORS, ...PAGE_AD_SELECTORS, ...SHORTS_SELECTORS].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.tagName === 'VIDEO' || el.closest('#player')) return;
        el.remove();
      });
    });
  }

  function skipVideoAd() {
    const video = document.querySelector('video');
    const isAd = document.querySelector('.ad-showing');
    const skipBtn = document.querySelector('.ytp-ad-skip-button');

    if (skipBtn) skipBtn.click();

    if (video && isAd && video.duration > 0 && video.currentTime < video.duration) {
      video.currentTime = video.duration;
    }
  }

  const observer = new MutationObserver(() => {
    removeAds();
    skipVideoAd();
  });

  observer.observe(document, { childList: true, subtree: true });

  window.addEventListener('load', () => {
    removeAds();
    skipVideoAd();
  });

  setInterval(() => {
    removeAds();
    skipVideoAd();
  }, 2000);
})();

// Chuyển hướng nếu vào trang shorts trực tiếp
if (location.pathname.startsWith('/shorts/')) {
  const videoId = location.pathname.split('/')[2];
  if (videoId) {
    location.replace(`/watch?v=${videoId}`);
  }
}
