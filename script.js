// ── PRODUCT DATA ──
const products = [
  { id: 1,  emoji: '📱', name: 'ProMax Smartphone X12',   desc: '6.7" AMOLED, 256GB, 108MP camera',        price: 24990, oldPrice: 32990, badge: 'HOT' },
  { id: 2,  emoji: '💻', name: 'UltraBook Slim 14"',      desc: 'Intel i7, 16GB RAM, 512GB SSD, Backlit',  price: 42500, oldPrice: 52000, badge: 'SALE' },
  { id: 3,  emoji: '🎧', name: 'BassFlow Pro Headphones', desc: 'Active Noise Cancelling, 40hr battery',   price: 3290,  oldPrice: 4500,  badge: null },
  { id: 4,  emoji: '⌚', name: 'SmartWatch Series 7',     desc: 'Heart rate, GPS, AMOLED, 5ATM water',     price: 5490,  oldPrice: 7200,  badge: 'HOT' },
  { id: 5,  emoji: '👟', name: 'CloudRun Training Shoes', desc: 'Ultra-cushioned sole, breathable mesh',   price: 3200,  oldPrice: 4000,  badge: null },
  { id: 6,  emoji: '🎮', name: 'GamePad Pro Elite',       desc: 'Wireless, 20hr battery, RGB lighting',   price: 2890,  oldPrice: 3800,  badge: 'SALE' },
  { id: 7,  emoji: '📷', name: 'SnapPro DSLR Camera',     desc: '24.2MP, 4K Video, 3-axis stabilizer',    price: 31000, oldPrice: 38500, badge: null },
  { id: 8,  emoji: '🛋️', name: 'Nordic Lounge Chair',    desc: 'Scandinavian design, premium fabric',     price: 12500, oldPrice: 15000, badge: 'HOT' },
];

// ── CART STATE ──
let cart = [];

// ── FORMAT PRICE ──
const fmt = n => '₱' + n.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// ── RENDER PRODUCTS ──
function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="col-6 col-md-4 col-lg-3 fade-in">
      <div class="product-card">
        <div class="prod-img-wrap">
          <div class="prod-emoji" aria-hidden="true">${p.emoji}</div>
          ${p.badge ? `<span class="prod-badge">${p.badge}</span>` : ''}
        </div>
        <div class="prod-body">
          <div class="prod-name">${p.name}</div>
          <div class="prod-desc">${p.desc}</div>
          <div class="prod-footer">
            <div>
              ${p.oldPrice ? `<span class="prod-old-price">${fmt(p.oldPrice)}</span>` : ''}
              <span class="prod-price">${fmt(p.price)}</span>
            </div>
            <button class="btn-add" id="addBtn-${p.id}" onclick="addToCart(${p.id})" aria-label="Add ${p.name} to cart">
              <i class="bi bi-plus-lg"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  initFadeIn();
}

// ── ADD TO CART ──
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty++;
    showToast(`${p.emoji} Quantity updated (+1)`);
  } else {
    cart.push({ ...p, qty: 1 });
    showToast(`${p.emoji} ${p.name} added to cart!`);
  }
  const btn = document.getElementById('addBtn-' + id);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="bi bi-plus-lg"></i> Add';
    }, 1400);
  }
  updateCartUI();
}

// ── UPDATE QTY ──
function updateQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

// ── REMOVE ──
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
  showToast('🗑️ Item removed from cart');
}

// ── UPDATE ALL CART UI ──
function updateCartUI() {
  const total = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cartCount').textContent = total;
  
  const itemsDiv = document.getElementById('cartItems');
  const emptyDiv = document.getElementById('cartEmpty');
  const footDiv  = document.getElementById('cartFoot');

  if (cart.length === 0) {
    emptyDiv.style.display = '';
    itemsDiv.innerHTML = '';
    footDiv.style.display = 'none';
    return;
  }

  emptyDiv.style.display = 'none';
  footDiv.style.display = '';

  itemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-img" aria-hidden="true">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-unit">${fmt(item.price)} each</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-num" aria-label="Quantity: ${item.qty}">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="ci-right">
        <div class="ci-subtotal">${fmt(item.price * item.qty)}</div>
        <button class="ci-remove" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name} from cart">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const grand    = subtotal + shipping;

  document.getElementById('sumItems').textContent    = total;
  document.getElementById('sumSubtotal').textContent = fmt(subtotal);
  document.getElementById('sumShipping').textContent = shipping === 0 ? 'FREE 🎉' : fmt(shipping);
  document.getElementById('sumTotal').textContent    = fmt(grand);
}

// ── CART OPEN / CLOSE ──
const overlay = document.getElementById('cartOverlay');
document.getElementById('cartBtn').addEventListener('click', () => {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', e => { if (e.target === overlay) closeCart(); });
function closeCart() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

// ── CHECKOUT ──
document.getElementById('checkoutBtn').addEventListener('click', () => {
  closeCart();
  showToast('🛍️ Redirecting to checkout...');
  setTimeout(() => {
    cart = [];
    updateCartUI();
    showToast('✅ Order placed! Thank you for shopping!');
  }, 2000);
});

// ── CATEGORY CHIPS ──
document.querySelectorAll('.cat-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── TOAST ──
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${msg}`;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove());
  }, 2600);
}

// ── FADE IN OBSERVER ──
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ── INIT ──
renderProducts();
updateCartUI();
document.querySelectorAll('.fade-in').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  obs.observe(el);
});