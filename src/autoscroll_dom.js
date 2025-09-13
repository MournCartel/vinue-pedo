
// DOM-based autoscroll for recent winnings (newest at top, fade in)
(function() {
  function init() {
    const container = document.querySelector('.recent-list, .recent-winnings, .recent-container');
    if (!container) return false;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) { // element
            node.classList.add('fade-in');
          }
        }
      }
      // keep scroll locked to top (newest visible)
      container.scrollTop = 0;
    });
    observer.observe(container, { childList: true });
    // initial scroll
    container.scrollTop = 0;
    return true;
  }
  let tries = 0;
  const iv = setInterval(() => {
    if (init() || ++tries > 20) clearInterval(iv);
  }, 250);
})();
