/**
 * Jatin Diwakar — Portfolio Client Script
 * Handles navigation scroll-spy, rail pulse tracking, interactive elements,
 * JSON response copying, and mock API form submission.
 */

(function () {
  'use strict';

  // Section & DOM element references
  const sections = ['home', 'about', 'stack', 'projects', 'experience', 'education', 'contact'];
  const railNodes = document.querySelectorAll('.rail-node');
  const railPulse = document.getElementById('railPulse');
  const railLine = document.getElementById('railLine');
  const topLinks = document.querySelectorAll('.topnav a');
  const topNav = document.getElementById('topnav');

  // Map sections to 4 primary M/E/R/N rail milestone keys
  const nodeMap = {
    stack: 'm',
    projects: 'e',
    experience: 'r',
    education: 'r',
    contact: 'n'
  };

  let currentActiveId = 'home';

  /**
   * Update rail pulse position based on active target element
   */
  function updateRailPulse(key) {
    if (!railPulse || !railLine) return;

    if (!key) {
      // If above milestones (home / about), glide pulse to the line origin
      railPulse.style.top = '0%';
      return;
    }

    const targetNode = document.querySelector(`.rail-node[data-key="${key}"]`);
    if (targetNode) {
      const lineRect = railLine.getBoundingClientRect();
      const nodeRect = targetNode.getBoundingClientRect();
      if (lineRect.height > 0) {
        const pct = ((nodeRect.top + nodeRect.height / 2) - lineRect.top) / lineRect.height * 100;
        railPulse.style.top = Math.max(0, Math.min(100, pct)) + '%';
      }
    }
  }

  /**
   * Set active section across desktop rail & mobile topnav
   */
  function setActive(id) {
    if (!id || id === currentActiveId && document.querySelector('.topnav a.active')) return;
    currentActiveId = id;

    // 1. Mobile top nav pills
    let activeTopLink = null;
    topLinks.forEach(function (link) {
      const isActive = link.dataset.key === id;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
      if (isActive) activeTopLink = link;
    });

    // Auto-scroll mobile topnav horizontally if active link is out of view
    if (activeTopLink && topNav && window.innerWidth <= 900) {
      const navRect = topNav.getBoundingClientRect();
      const linkRect = activeTopLink.getBoundingClientRect();
      if (linkRect.left < navRect.left || linkRect.right > navRect.right) {
        activeTopLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // 2. Desktop rail nodes
    const key = nodeMap[id];
    railNodes.forEach(function (node) {
      const isActive = node.dataset.key === key;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-current', isActive ? 'step' : 'false');
    });

    // 3. Rail pulse tracking
    updateRailPulse(key);
  }

  // Section observer for accurate scroll-spy
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // Re-calculate pulse position on window resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateRailPulse(nodeMap[currentActiveId]);
    }, 100);
  });

  // Rail node clicks (smooth scroll to target section)
  railNodes.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Topnav clicks (smooth scroll)
  topLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Reveal-on-scroll using IntersectionObserver
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Initialize JSON panel copy buttons
  document.querySelectorAll('.response-panel').forEach(function (panel) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-json-btn';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy JSON response');
    copyBtn.textContent = 'copy';

    copyBtn.addEventListener('click', function () {
      // Extract clean text from response panel excluding button text
      const clone = panel.cloneNode(true);
      const btnInClone = clone.querySelector('.copy-json-btn');
      if (btnInClone) btnInClone.remove();
      const textToCopy = clone.innerText.trim();

      navigator.clipboard.writeText(textToCopy).then(function () {
        copyBtn.textContent = 'copied ✓';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.textContent = 'copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        copyBtn.textContent = 'copied';
      });
    });

    panel.appendChild(copyBtn);
  });

  // Contact form handling with realistic HTTP POST lifecycle
  const form = document.getElementById('contactForm');
  const responseBox = document.getElementById('contactResponse');

  if (form && responseBox) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('cf-name');
      const emailInput = document.getElementById('cf-email');
      const messageInput = document.getElementById('cf-message');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple client validation
      if (!name || !email || !message) {
        responseBox.textContent = '400 Bad Request — Please fill in all required fields.';
        responseBox.className = 'contact-response show error';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        responseBox.textContent = '422 Unprocessable Entity — Please provide a valid email address.';
        responseBox.className = 'contact-response show error';
        return;
      }

      // Simulated sending state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'POST /contact [sending...]';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        responseBox.textContent = '201 Created — Message received! Thank you, Jatin will reply shortly.';
        responseBox.className = 'contact-response show';

        form.reset();
      }, 450);
    });
  }

  // Set initial rail pulse position once styles are painted
  window.addEventListener('load', function () {
    updateRailPulse(nodeMap[currentActiveId]);
  });
})();
