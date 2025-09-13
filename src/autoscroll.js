// Autoscroll script: finds recent winnings container and auto-scrolls smoothly to bottom on changes.
function findRecentContainer() {
  const selectors = [
    '.recent-winnings',
    '.recent-list',
    '.recent-listing',
    '[class*="recent"]',
    '[data-role="recent-winnings"]',
    '.recent'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  // fallback: find element with heading 'Recent Winnings' then next element
  const headings = Array.from(document.querySelectorAll('h3, h4, h2, div'));
  for (const hd of headings) {
    if (/recent\s+winnings/i.test(hd.textContent || '')) {
      // return next element sibling or parent find
      if (hd.nextElementSibling) return hd.nextElementSibling;
    }
  }
  return null;
}

function hideScrollbar(el) {
  if (!el) return;
  el.style.overflow = 'auto';
  el.style.scrollBehavior = 'smooth';
  // hide scrollbar via styles in element
  el.style['-ms-overflow-style'] = 'none';
  el.style['scrollbar-width'] = 'none';
  // For webkit browsers, add a style element
  const styleId = 'autoscroll-hide-scrollbar';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .autoscroll-hide::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
  }
  el.classList.add('autoscroll-hide');
}

function attachObserver(el) {
  if (!el) return;
  // ensure it stretches
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.style.height = '100%';
  // inner wrapper detection: if children are list items, find inner container
  let inner = el.querySelector('.recent-winnings-inner') || el.firstElementChild;
  if (!inner) inner = el;
  // scroll to bottom initially
  inner.scrollTop = inner.scrollHeight;
  // Observe childList changes
  const mo = new MutationObserver((mutations) => {
    // on any addition, scroll to bottom smoothly
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        // requestAnimationFrame then scroll
        requestAnimationFrame(() => {
          try {
            inner.scrollTo({ top: inner.scrollHeight, behavior: 'smooth' });
          } catch (e) {
            inner.scrollTop = inner.scrollHeight;
          }
        });
        break;
      }
    }
  });
  mo.observe(inner, { childList: true, subtree: false });
  // Also listen for window resize to keep bottom visible
  window.addEventListener('resize', () => {
    inner.scrollTo({ top: inner.scrollHeight, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const el = findRecentContainer();
  if (el) {
    hideScrollbar(el);
    attachObserver(el);
  } else {
    // try after a delay, as React may mount later
    setTimeout(() => {
      const el2 = findRecentContainer();
      if (el2) {
        hideScrollbar(el2);
        attachObserver(el2);
      }
    }, 1000);
  }
});
