/**
 * ==============================================================================
 * Module: store.js (ShopEasy Core Business Logic & State Management)
 * Purpose: Implements all pure ES6 JavaScript logic for ShopEasy:
 *          - Product rendering (dynamic DOM creation)
 *          - Live search and category filtering with Array.prototype.filter()
 *          - Immutable sorting with spread operator [...products] and sort()
 *          - Product lookup using Array.prototype.find()
 *          - Cart management (add, remove, quantity update, localStorage persistence)
 *          - Order total computations using Array.prototype.reduce() & Rest parameters
 *          - Event delegation for dynamically created product and cart elements
 *          - Client-side form validation with regex, error messaging, & preventDefault()
 * Author: Student Name (Roll No.)
 * Technology: Pure JavaScript (ES6+), No libraries/frameworks inside this module
 * ==============================================================================
 */

// Global Store State
const storeState = {
  products: [],          // Active catalog of products loaded via AJAX or fallback
  cart: [],              // Shopping cart items: [{ id, name, price, image, quantity, inStock }]
  activeCategory: "all", // Currently selected category filter
  searchQuery: "",       // Current live search string
  activeSort: "featured",// Current sort option
  appliedCoupon: null    // Applied discount coupon code object
};

// Available promotional coupons for the bonus coupon engine
const AVAILABLE_COUPONS = {
  "SAVE10": { code: "SAVE10", discountPercent: 10, description: "10% off entire order" },
  "STUDENT20": { code: "STUDENT20", discountPercent: 20, description: "20% student discount" },
  "FREESHIP": { code: "FREESHIP", freeShipping: true, description: "Free standard shipping" }
};

/* ==========================================================================
   1. LocalStorage Cart Persistence (Bonus Requirement & Cross-page state)
   ========================================================================== */

/**
 * Loads saved cart items from browser localStorage with try/catch error handling.
 */
function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("shopeasy_cart");
    if (savedCart) {
      storeState.cart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.warn("Unable to read cart from localStorage:", error);
    storeState.cart = [];
  }
  updateHeaderCartBadge();
}

/**
 * Persists the current cart state to localStorage.
 */
function saveCartToStorage() {
  try {
    localStorage.setItem("shopeasy_cart", JSON.stringify(storeState.cart));
  } catch (error) {
    console.warn("Unable to save cart to localStorage:", error);
  }
  updateHeaderCartBadge();
}

/**
 * Updates the cart badge count in the header navigation across all pages.
 */
function updateHeaderCartBadge() {
  // Array.prototype.reduce() with explicit initial value 0
  const totalCount = storeState.cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  const badgeElements = document.querySelectorAll(".cart-badge");
  badgeElements.forEach(badge => {
    badge.textContent = totalCount;
  });
}

/* ==========================================================================
   2. Product Display & Dynamic Element Building
   ========================================================================== */

/**
 * Generates rating star HTML string based on numerical rating.
 * @param {number} rating - Product rating (e.g., 4.7)
 * @returns {string} HTML markup for stars
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHtml = "";
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += "★";
  }
  if (hasHalfStar) {
    starsHtml += "½";
  }
  return `<span class="rating-stars" title="${rating} out of 5 stars">${starsHtml} <span class="rating-count">(${rating})</span></span>`;
}

/**
 * Builds and renders product cards dynamically into a given container.
 * Meets Requirement 3.3: "Display products dynamically ... by building elements from the array (not typed by hand)".
 * @param {Array} productsList - List of product objects
 * @param {HTMLElement} container - Target container element
 */
function renderProductGrid(productsList, container) {
  if (!container) return;
  
  // Clear existing items or loading spinners
  container.innerHTML = "";
  
  if (productsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search terms or clearing category filters.</p>
        <button class="btn btn-secondary btn-sm" id="btn-reset-filters">Reset All Filters</button>
      </div>
    `;
    return;
  }
  
  // DocumentFragment for efficient batch DOM insertion
  const fragment = document.createDocumentFragment();
  
  productsList.forEach(product => {
    const { id, name, price, category, rating, inStock, image, description } = product;
    
    // Create semantic <article> element for each product card
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("data-id", id);
    card.setAttribute("data-category", category);
    
    // In-stock vs Out-of-stock badge
    const stockBadge = inStock
      ? `<span class="badge badge-in-stock">In Stock</span>`
      : `<span class="badge badge-out-of-stock">Sold Out</span>`;
      
    // Button state based on stock availability
    const cartButton = inStock
      ? `<button class="btn btn-primary btn-sm btn-add-cart" data-id="${id}" aria-label="Add ${name} to cart">Add to Cart</button>`
      : `<button class="btn btn-secondary btn-sm" disabled aria-disabled="true">Out of Stock</button>`;
      
    card.innerHTML = `
      <div class="card-img-wrapper btn-view-details" data-id="${id}">
        <div class="card-badge-pos">${stockBadge}</div>
        <img src="${image}" alt="${name} product image" loading="lazy">
      </div>
      <div class="card-body">
        <span class="card-category">${category}</span>
        <h3 class="card-title btn-view-details" data-id="${id}">${name}</h3>
        <p class="card-desc">${description}</p>
        <div class="card-meta">
          <span class="card-price">$${price.toFixed(2)}</span>
          ${generateStarRating(rating)}
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary btn-sm btn-view-details" data-id="${id}">Details</button>
          ${cartButton}
        </div>
      </div>
    `;
    
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
  
  // Update result count if present
  const countDisplay = document.getElementById("results-count");
  if (countDisplay) {
    countDisplay.textContent = `Showing ${productsList.length} of ${storeState.products.length} products`;
  }
}

/**
 * Renders top-rated featured products for the Home page.
 * @param {Array} products - Catalog of products
 * @param {HTMLElement} container - Home featured container
 */
function renderFeaturedProducts(products, container) {
  if (!container) return;
  // Use filter and sort with spread to extract top 4 rated in-stock products
  const featured = [...products]
    .filter(p => p.inStock)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
    
  renderProductGrid(featured, container);
}

/* ==========================================================================
   3. Search, Filter & Immutable Sorting
   ========================================================================== */

/**
 * Filters the master products list based on active category and live search query.
 * Meets Requirement 3.3: "Search by name and filter by category using filter()".
 * @returns {Array} Filtered list of products
 */
function getFilteredProducts() {
  const query = storeState.searchQuery.trim().toLowerCase();
  const category = storeState.activeCategory.toLowerCase();
  
  return storeState.products.filter(product => {
    // Category match check
    const matchesCategory = (category === "all" || product.category.toLowerCase() === category);
    
    // Search query match check (searches product name and description)
    const matchesSearch = query === "" || 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query);
      
    return matchesCategory && matchesSearch;
  });
}

/**
 * Sorts products without mutating the original array.
 * Meets Requirement 3.3: "Sort by price ... name or rating using sort() without
 * changing the original array (use spread)."
 * 
 * VIVA NOTE: Array.prototype.sort() mutates the array in-place.
 * By using the spread operator [...filteredList], we create a shallow copy
 * before calling sort(), preserving the original order of the master dataset.
 * 
 * @param {string} criteria - Selected sort criteria
 * @param {Array} items - Array of products to sort
 * @returns {Array} Newly sorted array copy
 */
function sortProductList(criteria, items) {
  // Spread operator makes a shallow clone so the input array is never mutated
  const clonedItems = [...items];
  
  switch (criteria) {
    case "price-asc":
      return clonedItems.sort((a, b) => a.price - b.price);
    case "price-desc":
      return clonedItems.sort((a, b) => b.price - a.price);
    case "name-asc":
      return clonedItems.sort((a, b) => a.name.localeCompare(b.name));
    case "rating-desc":
      return clonedItems.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      // Return default ordering
      return clonedItems;
  }
}

/**
 * Orchestrates filtering and sorting, then triggers UI re-render.
 */
function updateCatalogDisplay() {
  const container = document.getElementById("product-grid");
  if (!container) return;
  
  const filtered = getFilteredProducts();
  const sorted = sortProductList(storeState.activeSort, filtered);
  renderProductGrid(sorted, container);
  
  // Trigger jQuery fade-in effect if available
  if (typeof window.triggerProductFadeIn === "function") {
    window.triggerProductFadeIn();
  }
}

/* ==========================================================================
   4. Product Details Modal using Array.prototype.find()
   ========================================================================== */

/**
 * Finds a product by its unique ID and populates the details modal dialog.
 * Meets Requirement 3.3: "Show product details using find()".
 * 
 * VIVA NOTE: filter() returns an array containing all matching elements,
 * whereas find() returns the single first element satisfying the predicate,
 * which is optimal for unique primary key (ID) lookups.
 * 
 * @param {number} productId - The ID of the clicked product
 */
function showProductDetails(productId) {
  const numericId = parseInt(productId, 10);
  const product = storeState.products.find(p => p.id === numericId);
  
  if (!product) return;
  
  const modalOverlay = document.getElementById("product-modal");
  if (!modalOverlay) return;
  
  const { id, name, price, category, rating, inStock, image, description } = product;
  
  // Populate modal fields
  document.getElementById("modal-product-title").textContent = name;
  document.getElementById("modal-product-category").textContent = category.toUpperCase();
  document.getElementById("modal-product-price").textContent = `$${price.toFixed(2)}`;
  document.getElementById("modal-product-desc").textContent = description;
  document.getElementById("modal-product-rating").innerHTML = generateStarRating(rating);
  
  const modalImg = document.getElementById("modal-product-img");
  modalImg.src = image;
  modalImg.alt = `${name} detailed preview`;
  
  const stockEl = document.getElementById("modal-product-stock");
  stockEl.innerHTML = inStock
    ? `<span class="badge badge-in-stock">In Stock</span>`
    : `<span class="badge badge-out-of-stock">Currently Out of Stock</span>`;
    
  const addBtn = document.getElementById("modal-btn-add-cart");
  if (addBtn) {
    addBtn.setAttribute("data-id", id);
    addBtn.disabled = !inStock;
    addBtn.textContent = inStock ? "Add to Cart" : "Out of Stock";
  }
  
  // Show modal
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

/**
 * Closes the active product details modal.
 */
function closeProductDetails() {
  const modalOverlay = document.getElementById("product-modal");
  if (modalOverlay) {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "";
  }
}

/* ==========================================================================
   5. Cart Logic, Math & Rest Parameter Engine
   ========================================================================== */

/**
 * Adds an item to the shopping cart or increments its quantity if already present.
 * @param {number} productId - ID of product to add
 * @param {number} [quantity=1] - Quantity to add
 */
function addToCart(productId, quantity = 1) {
  const numericId = parseInt(productId, 10);
  const product = storeState.products.find(p => p.id === numericId);
  
  if (!product || !product.inStock) {
    if (typeof window.showToastNotification === "function") {
      window.showToastNotification("Sorry, this item is currently out of stock!");
    }
    return;
  }
  
  const existingItem = storeState.cart.find(item => item.id === numericId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // Add new cart item object
    storeState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity,
      inStock: product.inStock
    });
  }
  
  saveCartToStorage();
  
  // Notify user via jQuery toast
  if (typeof window.showToastNotification === "function") {
    window.showToastNotification(`Added "${product.name}" to cart!`);
  }
  
  // Re-render cart if currently on cart.html
  renderCartTable();
  renderMiniCartDrawer();
}

/**
 * Removes an item completely from the cart.
 * @param {number} productId - ID of product to remove
 */
function removeFromCart(productId) {
  const numericId = parseInt(productId, 10);
  const itemIndex = storeState.cart.findIndex(item => item.id === numericId);
  
  if (itemIndex > -1) {
    const [removedItem] = storeState.cart.splice(itemIndex, 1);
    saveCartToStorage();
    renderCartTable();
    renderMiniCartDrawer();
    
    if (typeof window.showToastNotification === "function") {
      window.showToastNotification(`Removed "${removedItem.name}" from cart.`);
    }
  }
}

/**
 * Updates quantity of a cart item with strict boundary checks.
 * @param {number} productId - ID of product
 * @param {number} newQuantity - Desired new quantity
 */
function updateCartQuantity(productId, newQuantity) {
  const numericId = parseInt(productId, 10);
  const item = storeState.cart.find(item => item.id === numericId);
  
  if (!item) return;
  
  const parsedQty = parseInt(newQuantity, 10);
  
  if (isNaN(parsedQty) || parsedQty <= 0) {
    // If quantity is 0 or less, remove item from cart
    removeFromCart(numericId);
    return;
  }
  
  item.quantity = parsedQty;
  saveCartToStorage();
  renderCartTable();
  renderMiniCartDrawer();
}

/**
 * Calculates order totals demonstrating a REST PARAMETER and Array.prototype.reduce().
 * Meets Requirement 3.3: "Calculate subtotal, discount and grand total with reduce().
 * Write at least one function using a rest parameter."
 * 
 * VIVA NOTE:
 * - A rest parameter (...itemTotals) bundles arbitrary comma-separated numerical arguments
 *   into a real JavaScript Array instance.
 * - Array.prototype.reduce() executes a reducer callback on each element with an explicit
 *   initial value (0), accumulating the exact aggregate cost safely without type coercion.
 * 
 * @param {number} discountRate - Percentage discount rate (e.g. 0.10 for 10%)
 * @param {number} couponDeduction - Fixed dollar coupon deduction
 * @param {boolean} isFreeShipping - Flag for waived shipping
 * @param {...number} itemTotals - REST PARAMETER collecting individual product line subtotals
 * @returns {Object} Comprehensive breakdown of subtotal, discounts, tax, shipping, and grand total
 */
function calculateOrderTotals(discountRate, couponDeduction, isFreeShipping, ...itemTotals) {
  // Use reduce with explicit initial value 0 to calculate subtotal
  const subtotal = itemTotals.reduce((accumulatedTotal, currentLinePrice) => {
    return accumulatedTotal + currentLinePrice;
  }, 0);
  
  // Calculate automatic volume discount (e.g., 10% off when subtotal exceeds $500)
  const volumeDiscount = subtotal > 500 ? subtotal * discountRate : 0;
  
  // Combine automatic discount and applied coupon deduction
  const totalDiscount = volumeDiscount + couponDeduction;
  
  // Calculate standard 5% sales tax on the discounted subtotal
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const tax = taxableAmount * 0.05;
  
  // Shipping calculation: Free if cart is empty or eligible, otherwise $15.00
  let shipping = 0;
  if (subtotal > 0) {
    shipping = (subtotal >= 150 || isFreeShipping) ? 0 : 15.00;
  }
  
  // Calculate final grand total
  const grandTotal = Math.max(0, taxableAmount + tax + shipping);
  
  return {
    subtotal,
    volumeDiscount,
    couponDeduction,
    totalDiscount,
    tax,
    shipping,
    grandTotal
  };
}

/**
 * Applies a coupon code to the current cart.
 * @param {string} code - The entered coupon code
 */
function applyCouponCode(code) {
  const cleanCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[cleanCode];
  
  if (!coupon) {
    if (typeof window.showToastNotification === "function") {
      window.showToastNotification("Invalid promo code. Try SAVE10, STUDENT20, or FREESHIP.");
    }
    return false;
  }
  
  storeState.appliedCoupon = coupon;
  if (typeof window.showToastNotification === "function") {
    window.showToastNotification(`Coupon "${cleanCode}" applied successfully!`);
  }
  renderCartTable();
  return true;
}

/**
 * Removes the currently active coupon.
 */
function removeCouponCode() {
  storeState.appliedCoupon = null;
  renderCartTable();
}

/**
 * Renders the full cart table and order summary box on cart.html.
 */
function renderCartTable() {
  const tbody = document.getElementById("cart-table-body");
  const emptyPlaceholder = document.getElementById("cart-empty-state");
  const tableWrapper = document.getElementById("cart-table-wrapper");
  const summaryBox = document.getElementById("order-summary-box");
  
  if (!tbody) return;
  
  if (storeState.cart.length === 0) {
    if (tableWrapper) tableWrapper.style.display = "none";
    if (summaryBox) summaryBox.style.display = "none";
    if (emptyPlaceholder) emptyPlaceholder.style.display = "block";
    return;
  }
  
  if (tableWrapper) tableWrapper.style.display = "block";
  if (summaryBox) summaryBox.style.display = "block";
  if (emptyPlaceholder) emptyPlaceholder.style.display = "none";
  
  tbody.innerHTML = "";
  
  // Build line item prices array for rest parameter calculation
  const lineItemPrices = storeState.cart.map(item => item.price * item.quantity);
  
  // Extract coupon parameters
  let couponDeduction = 0;
  let isFreeShipping = false;
  
  if (storeState.appliedCoupon) {
    if (storeState.appliedCoupon.freeShipping) {
      isFreeShipping = true;
    }
    if (storeState.appliedCoupon.discountPercent) {
      // Calculate coupon discount percentage
      const rawSubtotal = lineItemPrices.reduce((a, b) => a + b, 0);
      couponDeduction = rawSubtotal * (storeState.appliedCoupon.discountPercent / 100);
    }
  }
  
  // Execute rest parameter function: spread lineItemPrices into ...itemTotals
  const totals = calculateOrderTotals(0.10, couponDeduction, isFreeShipping, ...lineItemPrices);
  
  // Populate cart table rows
  storeState.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", item.id);
    
    tr.innerHTML = `
      <td>
        <div class="cart-item-cell">
          <img src="${item.image}" alt="${item.name}" class="cart-thumb">
          <div>
            <strong>${item.name}</strong>
            <div class="badge badge-category">${item.category}</div>
          </div>
        </div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="qty-control">
          <button class="qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <input type="number" class="qty-input input-cart-qty" data-id="${item.id}" value="${item.quantity}" min="1" max="99" aria-label="Item quantity">
          <button class="qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td><strong>$${itemTotal.toFixed(2)}</strong></td>
      <td>
        <button class="btn btn-danger btn-sm btn-remove-cart" data-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Update Order Summary UI Elements
  const elSubtotal = document.getElementById("summary-subtotal");
  const elDiscount = document.getElementById("summary-discount");
  const elTax = document.getElementById("summary-tax");
  const elShipping = document.getElementById("summary-shipping");
  const elGrandTotal = document.getElementById("summary-grand-total");
  
  if (elSubtotal) elSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
  if (elDiscount) elDiscount.textContent = `-$${totals.totalDiscount.toFixed(2)}`;
  if (elTax) elTax.textContent = `$${totals.tax.toFixed(2)}`;
  if (elShipping) elShipping.textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
  if (elGrandTotal) elGrandTotal.textContent = `$${totals.grandTotal.toFixed(2)}`;
  
  // Coupon badge state
  const couponBadgeContainer = document.getElementById("applied-coupon-container");
  if (couponBadgeContainer) {
    if (storeState.appliedCoupon) {
      couponBadgeContainer.innerHTML = `
        <div class="coupon-applied-tag">
          <span>🏷️ ${storeState.appliedCoupon.code} (${storeState.appliedCoupon.description})</span>
          <button type="button" class="btn btn-sm" id="btn-remove-coupon" style="padding:0 4px; border:none; background:transparent; cursor:pointer;" aria-label="Remove coupon">✕</button>
        </div>
      `;
    } else {
      couponBadgeContainer.innerHTML = "";
    }
  }
}

/**
 * Renders the slide-in mini cart drawer (triggered from header icon).
 */
function renderMiniCartDrawer() {
  const container = document.getElementById("sidebar-cart-items");
  const subtotalDisplay = document.getElementById("sidebar-cart-subtotal");
  
  if (!container) return;
  
  container.innerHTML = "";
  
  if (storeState.cart.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); margin-top: 2rem;">Your cart is currently empty.</p>`;
    if (subtotalDisplay) subtotalDisplay.textContent = "$0.00";
    return;
  }
  
  const lineItemPrices = storeState.cart.map(item => item.price * item.quantity);
  const totals = calculateOrderTotals(0, 0, false, ...lineItemPrices);
  
  storeState.cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "sidebar-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="sidebar-item-img">
      <div class="sidebar-item-info">
        <h4 class="sidebar-item-title">${item.name}</h4>
        <div class="sidebar-item-price">${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</div>
      </div>
      <button class="btn btn-sm btn-danger btn-remove-cart" data-id="${item.id}" title="Remove item">✕</button>
    `;
    container.appendChild(div);
  });
  
  if (subtotalDisplay) {
    subtotalDisplay.textContent = `$${totals.subtotal.toFixed(2)}`;
  }
}

/* ==========================================================================
   6. Event Delegation
   ========================================================================== */

/**
 * Attaches unified event delegation listeners on high-level parent containers.
 * Meets Requirement 3.3: "Handle events with addEventListener including event delegation
 * for product and cart buttons."
 * 
 * VIVA NOTE:
 * Event Delegation attaches a single event listener to a permanent ancestor element
 * instead of binding hundreds of individual listeners to dynamically generated DOM nodes.
 * By inspecting event.target.closest(), events bubbling up from buttons created in the
 * future are cleanly captured without memory leaks.
 */
function initEventDelegation() {
  // 1. Delegated clicks on Product Grid (Products & Home Featured)
  document.addEventListener("click", event => {
    // Add to Cart Button Click
    const addCartBtn = event.target.closest(".btn-add-cart");
    if (addCartBtn) {
      const productId = addCartBtn.getAttribute("data-id");
      addToCart(productId, 1);
      return;
    }
    
    // View Product Details Click
    const detailsTrigger = event.target.closest(".btn-view-details");
    if (detailsTrigger) {
      const productId = detailsTrigger.getAttribute("data-id");
      showProductDetails(productId);
      return;
    }
    
    // Remove Item from Cart Button
    const removeCartBtn = event.target.closest(".btn-remove-cart");
    if (removeCartBtn) {
      const productId = removeCartBtn.getAttribute("data-id");
      removeFromCart(productId);
      return;
    }
    
    // Quantity Plus Button
    const plusBtn = event.target.closest(".btn-qty-plus");
    if (plusBtn) {
      const productId = plusBtn.getAttribute("data-id");
      const item = storeState.cart.find(i => i.id === parseInt(productId, 10));
      if (item) {
        updateCartQuantity(productId, item.quantity + 1);
      }
      return;
    }
    
    // Quantity Minus Button
    const minusBtn = event.target.closest(".btn-qty-minus");
    if (minusBtn) {
      const productId = minusBtn.getAttribute("data-id");
      const item = storeState.cart.find(i => i.id === parseInt(productId, 10));
      if (item && item.quantity > 1) {
        updateCartQuantity(productId, item.quantity - 1);
      } else {
        removeFromCart(productId);
      }
      return;
    }
    
    // Reset Filters Button
    const resetBtn = event.target.closest("#btn-reset-filters");
    if (resetBtn) {
      storeState.searchQuery = "";
      storeState.activeCategory = "all";
      storeState.activeSort = "featured";
      
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = "";
      
      const sortSelect = document.getElementById("sort-select");
      if (sortSelect) sortSelect.value = "featured";
      
      document.querySelectorAll(".cat-pill").forEach(pill => {
        pill.classList.toggle("active", pill.getAttribute("data-category") === "all");
      });
      
      updateCatalogDisplay();
      return;
    }
    
    // Remove Coupon Button
    const removeCouponBtn = event.target.closest("#btn-remove-coupon");
    if (removeCouponBtn) {
      removeCouponCode();
      return;
    }
    
    // Close Modal Button or clicking outside dialog
    if (event.target.closest("#modal-close-btn") || event.target.classList.contains("modal-overlay")) {
      closeProductDetails();
      return;
    }
  });
  
  // 2. Delegated Input Change for Quantity Input Fields
  document.addEventListener("change", event => {
    const qtyInput = event.target.closest(".input-cart-qty");
    if (qtyInput) {
      const productId = qtyInput.getAttribute("data-id");
      updateCartQuantity(productId, qtyInput.value);
    }
  });
}

/* ==========================================================================
   7. Form Validation (Checkout & Contact)
   ========================================================================== */

/**
 * Validates the Checkout Form using custom regex checks and stops invalid submit.
 * Meets Requirement 3.3: "JavaScript form validation on checkout: show clear error
 * messages next to fields and stop submission when invalid (preventDefault())."
 */
function initCheckoutFormValidation() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  
  form.addEventListener("submit", event => {
    // Stop native submission
    event.preventDefault();
    
    // Check if cart is empty before submission
    if (storeState.cart.length === 0) {
      if (typeof window.showToastNotification === "function") {
        window.showToastNotification("Your cart is empty! Add products before checking out.");
      }
      return;
    }
    
    let isValid = true;
    
    // Helper validation function
    const validateField = (inputEl, errorEl, condition, message) => {
      if (!condition) {
        isValid = false;
        errorEl.textContent = message;
        errorEl.classList.add("visible");
        inputEl.classList.add("input-error");
        
        // Trigger jQuery shake effect if available
        if (typeof window.shakeInvalidField === "function") {
          window.shakeInvalidField(inputEl);
        }
      } else {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
        inputEl.classList.remove("input-error");
      }
    };
    
    // 1. Full Name: Required, minlength 3
    const nameInput = document.getElementById("checkout-name");
    const nameErr = document.getElementById("error-checkout-name");
    validateField(nameInput, nameErr, nameInput.value.trim().length >= 3, "Please enter your full name (at least 3 characters).");
    
    // 2. Email: Valid RFC standard email regex
    const emailInput = document.getElementById("checkout-email");
    const emailErr = document.getElementById("error-checkout-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailErr, emailRegex.test(emailInput.value.trim()), "Please enter a valid email address (e.g., alex@example.com).");
    
    // 3. Telephone: International or local phone regex (at least 10 digits)
    const phoneInput = document.getElementById("checkout-phone");
    const phoneErr = document.getElementById("error-checkout-phone");
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    validateField(phoneInput, phoneErr, phoneRegex.test(phoneInput.value.trim()), "Please enter a valid 10-digit phone number (e.g., +1 (555) 234-5678 or 555-234-5678).");
    
    // 4. Address: Required, minlength 5
    const addrInput = document.getElementById("checkout-address");
    const addrErr = document.getElementById("error-checkout-address");
    validateField(addrInput, addrErr, addrInput.value.trim().length >= 5, "Please enter a complete delivery street address.");
    
    // 5. City: Select dropdown required
    const cityInput = document.getElementById("checkout-city");
    const cityErr = document.getElementById("error-checkout-city");
    validateField(cityInput, cityErr, cityInput.value !== "", "Please select your delivery city.");
    
    // 6. Postal Code: 5 digit numeric code
    const zipInput = document.getElementById("checkout-zip");
    const zipErr = document.getElementById("error-checkout-zip");
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    validateField(zipInput, zipErr, zipRegex.test(zipInput.value.trim()), "Please enter a valid 5-digit postal zip code.");
    
    // 7. Payment Method: Radio group required
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const paymentErr = document.getElementById("error-checkout-payment");
    const isPaymentSelected = Array.from(paymentRadios).some(radio => radio.checked);
    if (!isPaymentSelected) {
      isValid = false;
      paymentErr.textContent = "Please choose a payment method.";
      paymentErr.classList.add("visible");
    } else {
      paymentErr.textContent = "";
      paymentErr.classList.remove("visible");
    }
    
    // 8. Terms Checkbox: Required
    const termsInput = document.getElementById("checkout-terms");
    const termsErr = document.getElementById("error-checkout-terms");
    validateField(termsInput, termsErr, termsInput.checked, "You must agree to the terms & conditions to proceed.");
    
    // If all fields are valid, finalize order
    if (isValid) {
      processOrderSuccess({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addrInput.value.trim(),
        city: cityInput.value,
        zip: zipInput.value.trim()
      });
    }
  });
  
  // Real-time error removal when user starts correcting inputs
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      const errEl = document.getElementById(`error-${input.id}`);
      if (errEl) {
        errEl.classList.remove("visible");
      }
    });
  });
}

/**
 * Handles post-validation order processing, renders order summary table, and clears the cart.
 * @param {Object} customerInfo - Validated customer details
 */
function processOrderSuccess(customerInfo) {
  const lineItemPrices = storeState.cart.map(item => item.price * item.quantity);
  let couponDeduction = 0;
  let isFreeShipping = false;
  
  if (storeState.appliedCoupon) {
    if (storeState.appliedCoupon.freeShipping) isFreeShipping = true;
    if (storeState.appliedCoupon.discountPercent) {
      couponDeduction = lineItemPrices.reduce((a, b) => a + b, 0) * (storeState.appliedCoupon.discountPercent / 100);
    }
  }
  
  const totals = calculateOrderTotals(0.10, couponDeduction, isFreeShipping, ...lineItemPrices);
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  
  // Display success container
  const checkoutSection = document.getElementById("checkout-section");
  const successContainer = document.getElementById("order-success-container");
  
  if (checkoutSection) checkoutSection.style.display = "none";
  if (successContainer) {
    successContainer.style.display = "block";
    
    // Build Order Summary Table (HTML Requirement: At least one table)
    let itemsRows = "";
    storeState.cart.forEach(item => {
      itemsRows += `
        <tr>
          <td>${item.name} (${item.quantity} × $${item.price.toFixed(2)})</td>
          <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `;
    });
    
    successContainer.innerHTML = `
      <div class="order-success-card">
        <div class="order-success-icon">✅</div>
        <h2>Thank You For Your Order!</h2>
        <p>Order Reference: <strong>#${orderId}</strong></p>
        <p>A confirmation email has been dispatched to <strong>${customerInfo.email}</strong>.</p>
        
        <table class="order-summary-table" aria-label="Completed order receipt summary">
          <thead>
            <tr>
              <th>Ordered Item</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr>
              <td>Subtotal</td>
              <td style="text-align: right;">$${totals.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Discounts</td>
              <td style="text-align: right; color: var(--color-success);">-$${totals.totalDiscount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Tax (5%)</td>
              <td style="text-align: right;">$${totals.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td style="text-align: right;">${totals.shipping === 0 ? "FREE" : "$" + totals.shipping.toFixed(2)}</td>
            </tr>
            <tr style="font-weight: 800; font-size: 1.1rem; border-top: 2px solid var(--color-border-dark);">
              <td>Grand Total Paid</td>
              <td style="text-align: right;">$${totals.grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 1.5rem;">
          Shipping to: <strong>${customerInfo.address}, ${customerInfo.city} ${customerInfo.zip}</strong>
        </p>
        <div style="margin-top: 2rem;">
          <a href="products.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    `;
    
    // Clear cart and storage
    storeState.cart = [];
    storeState.appliedCoupon = null;
    saveCartToStorage();
    renderCartTable();
    renderMiniCartDrawer();
  }
}

/**
 * Validates the Contact Form on contact.html.
 */
function initContactFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  
  form.addEventListener("submit", event => {
    event.preventDefault();
    let isValid = true;
    
    const nameInput = document.getElementById("contact-name");
    const nameErr = document.getElementById("error-contact-name");
    if (nameInput.value.trim().length < 2) {
      isValid = false;
      nameErr.textContent = "Please enter your name.";
      nameErr.classList.add("visible");
      nameInput.classList.add("input-error");
    } else {
      nameErr.textContent = "";
      nameErr.classList.remove("visible");
      nameInput.classList.remove("input-error");
    }
    
    const emailInput = document.getElementById("contact-email");
    const emailErr = document.getElementById("error-contact-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      isValid = false;
      emailErr.textContent = "Please provide a valid email.";
      emailErr.classList.add("visible");
      emailInput.classList.add("input-error");
    } else {
      emailErr.textContent = "";
      emailErr.classList.remove("visible");
      emailInput.classList.remove("input-error");
    }
    
    const msgInput = document.getElementById("contact-message");
    const msgErr = document.getElementById("error-contact-message");
    if (msgInput.value.trim().length < 10) {
      isValid = false;
      msgErr.textContent = "Please write a message with at least 10 characters.";
      msgErr.classList.add("visible");
      msgInput.classList.add("input-error");
    } else {
      msgErr.textContent = "";
      msgErr.classList.remove("visible");
      msgInput.classList.remove("input-error");
    }
    
    if (isValid) {
      if (typeof window.showToastNotification === "function") {
        window.showToastNotification("Thank you! Your message has been received.");
      }
      form.reset();
    }
  });
  
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      const errEl = document.getElementById(`error-${input.id}`);
      if (errEl) errEl.classList.remove("visible");
    });
  });
}

/* ==========================================================================
   8. Global Initialization & Export
   ========================================================================== */

/**
 * Initializes the store with the provided product dataset.
 * Called by ui.js upon AJAX success (or fallback catch).
 * Demonstrates plain JavaScript and jQuery cooperation.
 * @param {Array} loadedProducts - Catalog of product objects
 */
function initShopEasyStore(loadedProducts) {
  storeState.products = Array.isArray(loadedProducts) && loadedProducts.length > 0
    ? loadedProducts
    : window.fallbackProducts;
    
  loadCartFromStorage();
  initEventDelegation();
  initCheckoutFormValidation();
  initContactFormValidation();
  
  // Render products if container is present on active page
  const catalogContainer = document.getElementById("product-grid");
  if (catalogContainer) {
    updateCatalogDisplay();
  }
  
  // Render featured on home page
  const featuredContainer = document.getElementById("featured-grid");
  if (featuredContainer) {
    renderFeaturedProducts(storeState.products, featuredContainer);
  }
  
  // Render cart table if on cart page
  renderCartTable();
  renderMiniCartDrawer();
  
  // Setup search input live listener
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", event => {
      storeState.searchQuery = event.target.value;
      updateCatalogDisplay();
    });
  }
  
  // Setup sort dropdown listener
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", event => {
      storeState.activeSort = event.target.value;
      updateCatalogDisplay();
    });
  }
  
  // Setup category pills listener
  const categoryPills = document.querySelectorAll(".cat-pill");
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      storeState.activeCategory = pill.getAttribute("data-category");
      updateCatalogDisplay();
    });
  });
  
  // Setup coupon code form listener
  const couponForm = document.getElementById("coupon-form");
  if (couponForm) {
    couponForm.addEventListener("submit", event => {
      event.preventDefault();
      const codeInput = document.getElementById("coupon-code-input");
      if (codeInput) {
        applyCouponCode(codeInput.value);
        codeInput.value = "";
      }
    });
  }
}

// Expose public API to window for jQuery cooperation in ui.js
window.ShopEasyStore = {
  init: initShopEasyStore,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  showProductDetails,
  closeProductDetails,
  getStoreState: () => storeState
};
