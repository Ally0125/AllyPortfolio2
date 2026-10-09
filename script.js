(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ---------- Rotating role text ---------- */
  var roleEl = document.getElementById('role');
  var cursorEl = document.querySelector('.cursor');
  var roles = ['Software Testing', 'App Testing', 'Product Analysis', 'Product Management'];

  if (roleEl) {
    if (reduceMotion) {
      if (cursorEl) cursorEl.style.display = 'none';
      var idx = 0;
      setInterval(function () {
        idx = (idx + 1) % roles.length;
        roleEl.textContent = roles[idx];
      }, 3000);
    } else {
      var roleIndex = 0;
      var charIndex = 0;
      var deleting = false;

      var tick = function () {
        var word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          roleEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            return setTimeout(tick, 1800);
          }
          return setTimeout(tick, 80);
        }
        charIndex--;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          return setTimeout(tick, 350);
        }
        setTimeout(tick, 40);
      };

      setTimeout(tick, 1800);
    }
  }

  /* ---------- More About Me modal ---------- */
  var modal = document.getElementById('about-modal');
  var tabs = Array.prototype.slice.call(modal.querySelectorAll('.tab'));
  var panels = Array.prototype.slice.call(modal.querySelectorAll('.panel'));
  var lastTrigger = null;

  function selectTab(name, focusTab) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== 'panel-' + name;
    });
    modal.querySelector('.modal-body').scrollTop = 0;
  }

  function openModal(tabName, trigger) {
    lastTrigger = trigger || null;
    selectTab(tabName || 'education', false);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.openModal, btn);
    });
  });

  modal.querySelector('[data-close-modal]').addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  modal.addEventListener('close', function () {
    if (lastTrigger) lastTrigger.focus();
  });

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      selectTab(tab.dataset.tab, false);
    });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        selectTab(next.dataset.tab, true);
      }
    });
  });

  /* ---------- Highlight current section in the nav ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var current = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', current);
          if (current) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Internship timeline reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var reveal = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    revealEls.forEach(function (el) { reveal.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
