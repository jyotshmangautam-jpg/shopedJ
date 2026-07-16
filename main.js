/* ==========================================================================
   VERTEX — Landing page interactivity
   Vanilla JS. Cart + wishlist persist to localStorage. This is a front-end
   demo store: nothing here talks to a real payment processor.
   ========================================================================== */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage disabled */ }
    }
  };

  let wishlist = store.get('vertex_wishlist', []);
  let cart = store.get('vertex_cart', []);            // [{id, qty}]
  let recentSearches = store.get('vertex_recent', []);

  /* ---------------------------- Loader ---------------------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const bar = loader.querySelector('.loader-bar i');
    const pct = loader.querySelector('.loader-pct');
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(timer); }
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (p >= 100) {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.classList.add('loaded');
          playIntro();
        }, 250);
      }
    }, 140);
  }

  function playIntro() {
    if (!hasGSAP || reduceMotion) return;
    gsap.from('.hero-content > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    gsap.from('.hero-specs .spec', { y: 16, opacity: 0, duration: 0.7, delay: 0.5, stagger: 0.1 });
  }

  /* ---------------------------- Custom cursor ---------------------------- */
  function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring || reduceMotion || matchMedia('(hover: none)').matches) return;
    let rx = 0, ry = 0, x = 0, y = 0;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; });
    (function loop() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .cat-card, .product-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------- Navbar + mobile menu ---------------------------- */
  function initNav() {
    const nav = document.querySelector('.navbar');
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 40);
      updateProgress();
      toggleBackToTop();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('nav-burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => mobileMenu.classList.add('open'));
      closeBtn && closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
      mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    }
  }

  /* ---------------------------- Theme toggle ---------------------------- */
  function initTheme() {
    const saved = store.get('vertex_theme', 'dark');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      updateThemeIcon(btn, saved);
      btn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';
        if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        store.set('vertex_theme', next);
        document.querySelectorAll('[data-theme-toggle]').forEach(b => updateThemeIcon(b, next));
      });
    });
  }
  function updateThemeIcon(btn, mode) {
    btn.innerHTML = mode === 'light' ? ICONS.moon : ICONS.sun;
  }

  /* ---------------------------- Scroll progress + back to top ---------------------------- */
  function updateProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
  }
  function toggleBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.classList.toggle('show', window.scrollY > 700);
  }
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    btn && btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------------------------- Toasts ---------------------------- */
  function toast(message, type = 'success') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML = `<i></i><span>${message}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, 3200);
  }

  /* ---------------------------- Categories ---------------------------- */
  function renderCategories() {
    const grid = document.getElementById('cat-grid');
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(c => `
      <div class="cat-card glass hud reveal" data-cat="${c.id}" tabindex="0" role="button" aria-label="Shop ${c.label}">
        <div class="cat-icon">${c.icon}</div>
        <span class="mono-tag">${c.tag}</span>
        <h3>${c.label}</h3>
        <span class="cat-count">${c.count} products</span>
      </div>
    `).join('');
    grid.querySelectorAll('.cat-card').forEach(card => {
      const activate = () => {
        setActiveFilter(card.dataset.cat);
        document.getElementById('shop')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
      // subtle tilt on hover
      card.addEventListener('mousemove', (e) => {
        if (reduceMotion) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------------------- Products ---------------------------- */
  let activeFilter = 'All';

  function starRow(rating) {
    return `<span class="product-rating">${ICONS.star.replace('<svg', '<svg')}<span>${rating}</span></span>`;
  }

  function productCard(p) {
    const isWished = wishlist.includes(p.id);
    return `
      <div class="product-card glass hud reveal" data-id="${p.id}" data-cat="${p.cat}">
        <div class="product-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="wishlist-btn ${isWished ? 'active' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">${ICONS.heart}</button>
          ${p.icon}
          <div class="product-actions-overlay">
            <button class="btn btn-primary btn-sm btn-block" data-add="${p.id}">Add to Cart</button>
            <button class="btn btn-ghost btn-sm" data-quick="${p.id}" aria-label="Quick view">${ICONS.search}</button>
          </div>
        </div>
        <div class="product-body">
          <span class="product-cat">${p.cat}</span>
          <h3>${p.name}</h3>
          <div class="product-rating">${ICONS.star}<span>${p.rating}</span><span class="mono-tag">(${p.reviews})</span></div>
          <span class="product-specs">${p.specs}</span>
          <div class="product-footer">
            <span class="price">${p.oldPrice ? `<span class="old">$${p.oldPrice}</span>` : ''}$${p.price}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const list = activeFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);
    grid.innerHTML = list.length ? list.map(productCard).join('') : `<p class="cart-empty">No products in this category yet.</p>`;
    bindProductEvents();
    if (hasGSAP && !reduceMotion) {
      gsap.fromTo(grid.querySelectorAll('.product-card'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out' });
    } else {
      grid.querySelectorAll('.product-card').forEach(el => el.classList.add('is-visible'));
    }
  }

  function renderFilters() {
    const row = document.getElementById('filter-row');
    if (!row) return;
    const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
    row.innerHTML = cats.map(c => `<button class="filter-chip ${c === activeFilter ? 'active' : ''}" data-filter="${c}">${c}</button>`).join('');
    row.querySelectorAll('.filter-chip').forEach(btn => btn.addEventListener('click', () => setActiveFilter(btn.dataset.filter)));
  }

  function setActiveFilter(cat) {
    activeFilter = cat;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === cat));
    renderProducts();
  }

  function bindProductEvents() {
    document.querySelectorAll('[data-wish]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(btn.dataset.wish, btn);
      });
    });
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(btn.dataset.add); });
    });
    document.querySelectorAll('[data-quick]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openQuickView(btn.dataset.quick); });
    });
  }

  /* ---------------------------- Wishlist ---------------------------- */
  function toggleWishlist(id, btnEl) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); }
    else { wishlist.push(id); }
    store.set('vertex_wishlist', wishlist);
    updateWishlistBadge();
    document.querySelectorAll(`[data-wish="${id}"]`).forEach(b => {
      b.classList.toggle('active', wishlist.includes(id));
      b.classList.add('pulse');
      setTimeout(() => b.classList.remove('pulse'), 450);
    });
    const p = PRODUCTS.find(p => p.id === id);
    if (p) toast(wishlist.includes(id) ? `Added ${p.name} to wishlist` : `Removed ${p.name} from wishlist`);
  }
  function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-count');
    if (badge) badge.textContent = wishlist.length;
    document.getElementById('wishlist-btn')?.classList.toggle('badge-hidden', wishlist.length === 0);
  }

  /* ---------------------------- Cart ---------------------------- */
  function addToCart(id, qty = 1) {
    const line = cart.find(l => l.id === id);
    if (line) line.qty += qty; else cart.push({ id, qty });
    store.set('vertex_cart', cart);
    updateCartBadge();
    renderCart();
    openCart();
    const p = PRODUCTS.find(p => p.id === id);
    if (p) toast(`Added ${p.name} to cart`);
  }
  function changeQty(id, delta) {
    const line = cart.find(l => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
    store.set('vertex_cart', cart);
    updateCartBadge();
    renderCart();
  }
  function removeFromCart(id) {
    cart = cart.filter(l => l.id !== id);
    store.set('vertex_cart', cart);
    updateCartBadge();
    renderCart();
  }
  function updateCartBadge() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
  }
  function cartLineHTML(line) {
    const p = PRODUCTS.find(p => p.id === line.id);
    if (!p) return '';
    return `
      <div class="cart-item" data-line="${p.id}">
        <div class="cart-item-media">${p.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <span class="cart-item-name">${p.name}</span>
            <button class="cart-item-remove" data-remove="${p.id}">Remove</button>
          </div>
          <div class="qty-control">
            <button data-qty-minus="${p.id}" aria-label="Decrease quantity">−</button>
            <span>${line.qty}</span>
            <button data-qty-plus="${p.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <span class="cart-item-price">$${(p.price * line.qty).toFixed(2)}</span>
      </div>
    `;
  }
  function renderCart() {
    const wrap = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-value');
    const subEl = document.getElementById('cart-subtotal-value');
    if (!wrap) return;
    if (!cart.length) {
      wrap.innerHTML = `<div class="cart-empty">${ICONS.cart}<p>Your cart is empty.</p></div>`;
    } else {
      wrap.innerHTML = cart.map(cartLineHTML).join('');
    }
    const subtotal = cart.reduce((sum, l) => { const p = PRODUCTS.find(p => p.id === l.id); return sum + (p ? p.price * l.qty : 0); }, 0);
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 14) : 0;
    if (subEl) subEl.textContent = '$' + subtotal.toFixed(2);
    const shipEl = document.getElementById('cart-shipping-value');
    if (shipEl) shipEl.textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + (subtotal + shipping).toFixed(2);

    wrap.querySelectorAll('[data-qty-minus]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.qtyMinus, -1)));
    wrap.querySelectorAll('[data-qty-plus]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.qtyPlus, 1)));
    wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.remove)));
  }
  function openCart() { document.getElementById('cart-drawer')?.classList.add('open'); document.getElementById('cart-scrim')?.classList.add('open'); }
  function closeCart() { document.getElementById('cart-drawer')?.classList.remove('open'); document.getElementById('cart-scrim')?.classList.remove('open'); }

  function initCart() {
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-scrim')?.addEventListener('click', closeCart);
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      if (!cart.length) { toast('Your cart is empty', 'error'); return; }
      toast('This is a demo store — checkout isn\u2019t connected to real payments.');
    });
    document.getElementById('coupon-btn')?.addEventListener('click', () => {
      const input = document.getElementById('coupon-input');
      if (input && input.value.trim()) toast('Coupon codes aren\u2019t active in this demo.');
    });
    renderCart();
    updateCartBadge();
  }

  /* ---------------------------- Quick view ---------------------------- */
  function openQuickView(id) {
    const p = PRODUCTS.find(p => p.id === id);
    const modal = document.getElementById('quickview-modal');
    if (!p || !modal) return;
    modal.querySelector('.quickview-media').innerHTML = p.icon;
    modal.querySelector('[data-qv="name"]').textContent = p.name;
    modal.querySelector('[data-qv="cat"]').textContent = p.cat;
    modal.querySelector('[data-qv="desc"]').textContent = p.desc;
    modal.querySelector('[data-qv="specs"]').textContent = p.specs;
    modal.querySelector('[data-qv="rating"]').textContent = `${p.rating} (${p.reviews} reviews)`;
    modal.querySelector('[data-qv="price"]').innerHTML = (p.oldPrice ? `<span class="old">$${p.oldPrice}</span>` : '') + `$${p.price}`;
    const addBtn = modal.querySelector('[data-qv-add]');
    addBtn.onclick = () => { addToCart(p.id); closeQuickView(); };
    const wishBtn = modal.querySelector('[data-qv-wish]');
    wishBtn.classList.toggle('active', wishlist.includes(p.id));
    wishBtn.onclick = () => toggleWishlist(p.id, wishBtn);
    modal.classList.add('open');
  }
  function closeQuickView() { document.getElementById('quickview-modal')?.classList.remove('open'); }
  function initQuickView() {
    document.getElementById('quickview-close')?.addEventListener('click', closeQuickView);
    document.getElementById('quickview-modal')?.addEventListener('click', (e) => { if (e.target.id === 'quickview-modal') closeQuickView(); });
  }

  /* ---------------------------- Search ---------------------------- */
  function initSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const resultsEl = document.getElementById('search-results');
    const chipsEl = document.getElementById('search-chips');
    if (!overlay || !input) return;

    function open() {
      overlay.classList.add('open');
      renderChips();
      renderResults('');
      setTimeout(() => input.focus(), 300);
    }
    function close() { overlay.classList.remove('open'); input.value = ''; }

    document.getElementById('search-btn')?.addEventListener('click', open);
    document.getElementById('search-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    function renderChips() {
      const cats = [...new Set(PRODUCTS.map(p => p.cat))];
      chipsEl.innerHTML = cats.map(c => `<button class="filter-chip" data-search-chip="${c}">${c}</button>`).join('');
      chipsEl.querySelectorAll('[data-search-chip]').forEach(b => b.addEventListener('click', () => {
        input.value = b.dataset.searchChip;
        renderResults(input.value);
      }));
    }

    function renderResults(q) {
      const query = q.trim().toLowerCase();
      let list = query
        ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query))
        : [];

      let html = '';
      if (!query) {
        if (recentSearches.length) {
          html += `<h4>Recent Searches</h4><div class="search-chips">${recentSearches.map(r => `<button class="filter-chip" data-recent="${r}">${r}</button>`).join('')}</div>`;
        }
        html += `<h4>Popular Right Now</h4>`;
        list = PRODUCTS.slice(0, 4);
      }
      html += `<div class="search-results">${
        list.length ? list.map(p => `
          <a class="search-result-row" data-goto="${p.id}">
            <span class="thumb">${p.icon}</span>
            <span>${p.name}</span>
            <span class="mono-tag" style="margin-left:auto">$${p.price}</span>
          </a>`).join('')
        : (query ? `<p class="search-empty">No products match "${q}".</p>` : '')
      }</div>`;

      resultsEl.innerHTML = html;
      resultsEl.querySelectorAll('[data-recent]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.recent; renderResults(input.value); }));
      resultsEl.querySelectorAll('[data-goto]').forEach(row => row.addEventListener('click', () => {
        saveRecent(input.value || row.textContent.trim());
        openQuickView(row.dataset.goto);
        close();
      }));
    }

    function saveRecent(term) {
      term = term.trim();
      if (!term) return;
      recentSearches = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
      store.set('vertex_recent', recentSearches);
    }

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderResults(input.value), 120);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) saveRecent(input.value);
    });
  }

  /* ---------------------------- Testimonials ---------------------------- */
  function renderTestimonials() {
    const grid = document.getElementById('testi-grid');
    if (!grid) return;
    grid.innerHTML = TESTIMONIALS.map(t => `
      <div class="testi-card glass reveal">
        <div class="testi-stars">${Array.from({ length: 5 }).map((_, i) => `<span style="opacity:${i < t.rating ? 1 : 0.25}">${ICONS.star}</span>`).join('')}</div>
        <p class="testi-quote">${t.quote}</p>
        <div class="testi-user">
          <span class="avatar">${t.initials}</span>
          <div><b>${t.name}</b><small>${t.role}</small></div>
        </div>
      </div>
    `).join('');
  }

  /* ---------------------------- Newsletter ---------------------------- */
  function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.checkValidity()) {
          toast('You\u2019re on the list \u2014 welcome to VERTEX.');
          form.reset();
        } else {
          toast('Enter a valid email address.', 'error');
        }
      });
    });
  }

  /* ---------------------------- Scroll reveals + counters ---------------------------- */
  function initReveals() {
    if (!hasGSAP || reduceMotion) {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
    });
  }
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const run = () => {
        if (reduceMotion || !hasGSAP) { el.textContent = target.toFixed(decimals); return; }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: () => el.textContent = obj.v.toFixed(decimals)
        });
      };
      if (hasGSAP && !reduceMotion) {
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
      } else run();
    });
  }

  /* ---------------------------- Hero 3D scene ---------------------------- */
  function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof createCoreScene !== 'function') return;
    try {
      createCoreScene(canvas, { particleCount: 900, cameraZ: 7.5, parallax: 0.7 });
    } catch (e) {
      canvas.closest('.hero-canvas-wrap')?.style.setProperty('display', 'none');
    }
  }

  /* ---------------------------- Init ---------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNav();
    initTheme();
    initBackToTop();
    renderCategories();
    renderFilters();
    renderProducts();
    renderTestimonials();
    initCart();
    initQuickView();
    initSearch();
    initNewsletter();
    updateWishlistBadge();
    initHeroScene();
    initReveals();
    initCounters();
  });
})();
