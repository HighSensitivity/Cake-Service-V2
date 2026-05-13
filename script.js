// ── PRODUCT DATA ──────────────────────────────────────────────
const products = [
  {
    id: 1,
    title: 'Classic Chocolate Birthday Cake',
    category: 'birthday',
    price: 45,
    description: 'Rich layers of dark chocolate sponge with silky ganache frosting and festive decorations.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600',
    badge: 'Bestseller'
  },
  {
    id: 2,
    title: 'Strawberry Shortcake',
    category: 'birthday',
    price: 38,
    description: 'Light vanilla layers piled high with fresh strawberries and whipped cream.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600',
    badge: null
  },
  {
    id: 3,
    title: 'Rainbow Funfetti Cake',
    category: 'birthday',
    price: 42,
    description: 'A celebration in every slice — colourful sprinkles baked right into fluffy vanilla batter.',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600',
    badge: null
  },
  {
    id: 4,
    title: 'Elegant White Wedding Cake',
    category: 'wedding',
    price: 195,
    description: 'Three-tier ivory fondant masterpiece adorned with delicate sugar flowers.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600',
    badge: 'Premium'
  },
  {
    id: 5,
    title: 'Rustic Naked Wedding Cake',
    category: 'wedding',
    price: 165,
    description: 'Exposed sponge tiers decorated with fresh florals and eucalyptus for a boho vibe.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600',
    badge: null
  },
  {
    id: 6,
    title: 'Gold Drip Wedding Cake',
    category: 'wedding',
    price: 220,
    description: 'Luxurious dark chocolate tiers with edible gold drip and handcrafted sugar roses.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600',
    badge: 'Luxury'
  },
  {
    id: 7,
    title: 'Custom Photo Cake',
    category: 'custom',
    price: 65,
    description: 'Your favourite photo printed on a smooth fondant panel — fully personalised.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600',
    badge: null
  },
  {
    id: 8,
    title: 'Name & Number Cake',
    category: 'custom',
    price: 55,
    description: 'Bold numerals and hand-piped names make every milestone unforgettable.',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=600',
    badge: null
  },
  {
    id: 9,
    title: 'Character Sculpted Cake',
    category: 'custom',
    price: 95,
    description: 'Bring your favourite character to life with our hand-sculpted fondant art.',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600',
    badge: 'Popular'
  }
];

// ── CART UTILITIES ─────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem('sweetdelights_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('sweetdelights_cart', JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  badges.forEach(b => { b.textContent = count; });
}

function showToast(msg, icon = 'fa-check-circle') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

function addToCart(productId, quantity) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`${product.title} added to cart`);
}

// ── INDEX PAGE ─────────────────────────────────────────────────
function initIndexPage() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const tabsWrapper = document.querySelector('.category-tabs');
  const searchInput = document.getElementById('search');
  const quantities = {};
  products.forEach(p => { quantities[p.id] = 1; });

  let activeCategory = 'birthday';

  function renderProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchQ = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No cakes found. Try a different search.</p></div>`;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${p.id}, -1)"><i class="fas fa-minus"></i></button>
            <span class="qty-display" id="qty-${p.id}">${quantities[p.id]}</span>
            <button class="qty-btn" onclick="changeQty(${p.id}, 1)"><i class="fas fa-plus"></i></button>
          </div>
          <div class="product-footer">
            <span class="product-price">$${p.price}</span>
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${p.id}, quantities[${p.id}])">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }

  window.changeQty = function(id, delta) {
    quantities[id] = Math.max(1, (quantities[id] || 1) + delta);
    const el = document.getElementById(`qty-${id}`);
    if (el) el.textContent = quantities[id];
  };

  // Tab buttons
  if (tabsWrapper) {
    tabsWrapper.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsWrapper.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderProducts();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }

  renderProducts();
}

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initIndexPage();
});
