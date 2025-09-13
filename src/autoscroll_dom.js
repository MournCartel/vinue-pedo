
// DOM-based autoscroll for recent winnings (safe, non-React)
(function() {
  function findRecentContainer() {
    // Find element with heading 'Recent' then get next element or a child with many children
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,div,span,button'));
    for (const h of headings) {
      if (h.textContent && h.textContent.trim().toLowerCase() === 'recent') {
        // try next element sibling
        let cand = h.nextElementSibling;
        if (cand && (cand.children.length >= 1)) return cand;
        // try parent queries
        const parent = h.parentElement;
        if (parent) {
          const lists = parent.querySelectorAll('div, ul');
          for (const l of lists) {
            if (l.children.length >= 2) return l;
          }
        }
      }
    }
    // fallback selectors
    const selectors = ['.recent-winnings', '.recent-list', '.recent-items', '.recent', '.recent-container', '.recent-list-wrapper', '.recent-pane', '.recent-sidebar'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function sanitizeContainer(container) {
    // remove stray text nodes like '/n'
    for (const node of Array.from(container.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node.textContent.replace(/\\s+/g, '');
        if (t === '' || t === '/n' || t === '\\n' ) node.remove();
      }
    }
  }

  function init() {
    const container = findRecentContainer();
    if (!container) return false;
    // apply class for styling
    container.classList.add('mourgan-hide-scroll');
    // ensure position relative for fade overlay
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    // add mutation observer
    const observer = new MutationObserver((mutations) => {
      sanitizeContainer(container);
      // scroll to bottom smoothly (fast)
      try {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } catch(e) {
        container.scrollTop = container.scrollHeight;
      }
    });
    observer.observe(container, { childList: true, subtree: false });
    // also scroll on resize/window load and when called manually
    window.addEventListener('resize', () => { try { container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }); } catch(e){} });
    // initial scroll (delay slightly to allow first render)
    setTimeout(()=>{ try{ container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }); }catch(e){} }, 120);
    return true;
  }

  // Try to initialize repeatedly for a short period (React may mount later)
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    const ok = init();
    if (ok || attempts > 30) clearInterval(interval);
  }, 200);
})();
