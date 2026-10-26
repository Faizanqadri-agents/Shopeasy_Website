# ShopEasy: A Front-End Web Store

**Course:** Web Engineering – Assignment No. 2  
**Theme:** Electronics & Stationery Store  
**Student Details:** Student Name (Roll No. XXXXXX)  
**Submission:** GitHub Repository Link + ZIP file + Live In-Class Demo  
**GitHub Repository:** `https://github.com/your-username/shopeasy-web-store` *(Replace with your repository link)*

---

## 1. Project Overview & Theme

**ShopEasy** is a complete, production-grade, responsive front-end online web store engineered without any backend framework. Designed for the modern tech professional, university student, and home office worker, the store curates premium hardware electronics, archival stationery instruments, and ergonomic workspace accessories.

Customers can:
- Seamlessly browse through 16 catalog products loaded asynchronously via jQuery AJAX.
- Perform real-time, live search queries by title or description.
- Filter products dynamically across categories (`electronics`, `stationery`, `accessories`).
- Sort catalog items immutably using modern ES6 array operations without mutating the underlying data.
- Inspect full product specifications via a details modal driven by `Array.prototype.find()`.
- Add, update, and remove items with real-time recalculation of subtotals, volume discounts, taxes, and shipping rates using `Array.prototype.reduce()` and Rest parameters.
- Apply discount vouchers (`SAVE10`, `STUDENT20`, `FREESHIP`).
- Experience persistent shopping across page reloads and browser sessions via `localStorage`.
- Toggle between Light and Dark themes with saved user preferences.
- Fill out comprehensive checkout and customer contact forms featuring strict HTML5 validation and custom client-side JavaScript regex checking.

---

## 2. Technologies Used

- **HTML5:** Semantic architecture (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>`, `<table>`, `<fieldset>`), accessible forms with strict HTML5 attributes.
- **CSS3:** Custom styles, CSS variables (`:root` & `[data-theme="dark"]`), Flexbox, CSS Grid (`grid-template-columns`), media query breakpoints at `768px` and `480px`, CSS animations (`@keyframes shake`, `@keyframes spin`).
- **JavaScript (ES6):** `const`/`let` exclusively (no `var`), arrow functions, destructuring, template literals, spread operator (`[...items]`), rest parameter (`...itemTotals`), `Array.prototype.map()`, `filter()`, `find()`, `reduce()`, event delegation with `event.target.closest()`, `localStorage` with `try/catch`.
- **jQuery 3.7.1:** `$(document).ready()`, AJAX `$.getJSON()` with error fallback (`.fail()`), effects (`.fadeIn()`, `.slideToggle()`, `.animate()`), DOM manipulation (`.addClass()`, `.removeClass()`, `.toggleClass()`, `.text()`, `.html()`), method chaining.
- **Assets:** Scalable, locally generated SVG graphics for crisp visuals without remote network latency.

---

## 3. Folder & File Structure

```
shopeasy/
├── index.html            # Home: hero banner, perks list, featured products, FAQ accordion, theme toggle
├── products.html         # Catalog: live search, category pills, sort select, product grid, details modal
├── cart.html             # Cart & Checkout: accessible table, quantity controls, totals, checkout form, order confirmation
├── contact.html          # Contact Us: physical store information, support hours list, interactive contact form
├── products.json         # Master product dataset (16 items across 3 categories) loaded via jQuery AJAX
├── css/
│   └── style.css         # Unified stylesheet containing CSS variables, Flexbox, Grid, animations, and media queries
├── js/
│   ├── data.js           # Fallback product array (fallbackProducts) ensuring zero-failure offline operation
│   ├── store.js          # Core plain ES6 JavaScript: search, filter, sort with spread, details with find, cart with reduce, form validation
│   └── ui.js             # jQuery UI: AJAX with error handling, slideToggle accordion, mobile menu, toast with chaining, back-to-top animate
├── images/               # Scalable local SVG illustrations (logo, hero graphics, and 16 product previews)
├── screenshots/          # High-resolution screenshots of responsive desktop/mobile views and feature proofs
└── README.md             # Project documentation, instructions, rubric compliance matrix, and viva answers
```

---

## 4. How to Run the Project

### Why `file://` Does Not Work:
Modern web browsers (Google Chrome, Microsoft Edge, Mozilla Firefox) enforce strict Cross-Origin Resource Sharing (CORS) and security sandboxing on the `file://` protocol. If you double-click `index.html` directly from Windows Explorer, the browser will block jQuery's AJAX `$.getJSON("products.json")` call with a CORS/security restriction. 

*(Note: ShopEasy is equipped with a graceful fallback in `ui.js` that automatically catches this error in `.fail()` and loads `data.js`, but for full AJAX demonstration, running via a local HTTP server is required.)*

### Running with VS Code Live Server (Recommended):
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and choose the `shopeasy/` directory.
3. Install the **Live Server** extension by *Ritwick Dey* (Extension ID: `ritwickdey.LiveServer`) if not already installed.
4. Right-click `index.html` in the Explorer sidebar and click **"Open with Live Server"** (or click "Go Live" on the bottom status bar).
5. The store will open automatically in your browser at `http://127.0.0.1:5500/index.html`.

### Running with Python (Alternative):
If you have Python installed, open PowerShell or Terminal in the `shopeasy/` directory and run:
```bash
python -m http.server 5500
```
Then navigate to `http://localhost:5500` in any web browser.

---

## 5. Assignment Requirements & Compliance Checklist

| Section | Required Feature | Implemented In | Status |
| :--- | :--- | :--- | :--- |
| **HTML (1.5)** | 4 linked pages with common navigation bar and active indicator | `index.html`, `products.html`, `cart.html`, `contact.html` | **Done** |
| | Semantic tags on every page: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` | All 4 HTML files | **Done** |
| | Valid HTML5, doctype, meta charset, viewport, title, meaningful `alt` text on images | All 4 HTML files | **Done** |
| | At least one ordered or unordered list (`<ul>`, `<ol>`) | `index.html` (perks), `contact.html` (hours & steps), footers | **Done** |
| | At least one `<table>` (cart table & order summary table) | `cart.html` (`.cart-table`, `.order-summary-table`) | **Done** |
| | Forms with >= 6 fields of different types (text, email, tel, select, radio, checkbox, textarea) | `cart.html` (9 fields) & `contact.html` (7 fields) | **Done** |
| | HTML5 validation attributes (`required`, `pattern`, `minlength`, `min`, `maxlength`) | All form inputs across `cart.html` & `contact.html` | **Done** |
| | Accessible `<label for>`, `<fieldset>`, `<legend>`, ARIA labels | All forms and interactive elements | **Done** |
| **CSS (2.0)** | One external stylesheet linked from all pages (`css/style.css`), no inline styles | `css/style.css` | **Done** |
| | CSS variables (`:root` and `[data-theme="dark"]`) for palette, typography, spacing | `css/style.css` (lines 20–100) | **Done** |
| | Selectors: element, class, id, attribute (`input[type="radio"]`), pseudo-classes (`:hover`, `:focus`, `:nth-child`) | `css/style.css` throughout | **Done** |
| | Box model: global `*, *::before, *::after { box-sizing: border-box; }` | `css/style.css` (lines 104–110) | **Done** |
| | Flexbox for navbar, header actions, cart items, footer | `css/style.css` (`.navbar`, `.nav-actions`, `.cart-item-cell`) | **Done** |
| | CSS Grid for product catalog and featured products | `css/style.css` (`.product-grid`, `.hero-grid`, `.perks-grid`) | **Done** |
| | Responsive media queries at `768px` and `480px` with column changes (4 -> 2 -> 1) | `css/style.css` (lines 720–810) | **Done** |
| | Visible hover/focus states, invalid input styles, shake animation, out-of-stock badge | `css/style.css` | **Done** |
| **JS (2.5)** | Catalog with >= 12 products (16 items) with id, name, price, category, rating, inStock | `products.json` & `js/data.js` | **Done** |
| | Dynamic rendering of product cards via DOM creation (not hardcoded in HTML) | `js/store.js` (`renderProductGrid`) | **Done** |
| | Live search by name and category filtering working concurrently using `filter()` | `js/store.js` (`getFilteredProducts`) | **Done** |
| | Sort by price (asc/desc), name, and rating using `sort()` on a spread copy `[...products]` | `js/store.js` (`sortProductList`) | **Done** |
| | Product details view using `Array.prototype.find()` | `js/store.js` (`showProductDetails`) | **Done** |
| | Cart add, remove, quantity update (+ / - / input) with stock checks | `js/store.js` (`addToCart`, `removeFromCart`, `updateCartQuantity`) | **Done** |
| | Calculation of subtotal, discounts, and total with `reduce()` (explicit initial value 0) | `js/store.js` (`calculateOrderTotals`) | **Done** |
| | Function using a **REST parameter** (`...itemTotals`) and spread in multiple places | `js/store.js` (`calculateOrderTotals`, `sortProductList`, `renderFeaturedProducts`) | **Done** |
| | Event delegation via `addEventListener` on parents with `event.target.closest()` | `js/store.js` (`initEventDelegation`) | **Done** |
| | Client-side form validation with `preventDefault()`, regex, clear error spans next to fields | `js/store.js` (`initCheckoutFormValidation`, `initContactFormValidation`) | **Done** |
| | Cart persistence across page reloads via `localStorage` with `try...catch` | `js/store.js` (`loadCartFromStorage`, `saveCartToStorage`) | **Done** |
| | Header cart badge showing item count across all pages | `js/store.js` (`updateHeaderCartBadge`) | **Done** |
| **jQuery (1.5)**| All jQuery inside `$(document).ready(function() { ... })` | `js/ui.js` | **Done** |
| | AJAX load from `products.json` via `$.getJSON()` with loader and `.fail()` fallback | `js/ui.js` (`loadProductsWithAjax`) | **Done** |
| | At least 3 jQuery selectors and events (`.on()`, `.click()`) | `js/ui.js` (FAQ clicks, mobile toggle, theme toggle, back to top) | **Done** |
| | At least 3 effects: `.fadeIn()`, `.slideToggle()`, `.animate()` | `js/ui.js` (product fade, FAQ accordion, scroll to top, cart slide) | **Done** |
| | DOM methods: `.addClass()`, `.removeClass()`, `.toggleClass()`, `.text()`, `.html()`, etc. | `js/ui.js` throughout | **Done** |
| | Method chaining clearly demonstrated | `js/ui.js` (`#toast.text().addClass().fadeIn().delay().fadeOut()`) | **Done** |
| | Plain JavaScript & jQuery cooperation bridge | `store.js` defines `window.ShopEasyStore.init()`, `ui.js` calls it with AJAX data | **Done** |
| **Bonus** | `localStorage` cart persistence surviving page refresh | `js/store.js` | **Done** |
| | Light and Dark theme switcher with `localStorage` preference | `js/ui.js` & `css/style.css` (`[data-theme="dark"]`) | **Done** |
| | Promotional coupon code system (`SAVE10`, `STUDENT20`, `FREESHIP`) | `js/store.js` (`applyCouponCode`, `calculateOrderTotals`) | **Done** |

---

## 6. Suggested Git Commit History (Step-by-Step)

Here is a recommended sequence of 12 meaningful git commits to build your repository history:

1. **`feat: initialize repository and project structure`**
   - Files: `.gitignore`, `README.md`
2. **`feat(data): create 16-item product catalog JSON and fallback dataset`**
   - Files: `products.json`, `js/data.js`
3. **`feat(assets): generate local SVG logos, hero illustration and product graphics`**
   - Files: `images/logo.svg`, `images/hero-illustration.svg`, `images/prod-*.svg`
4. **`feat(html): implement semantic HTML5 structure for Home page`**
   - Files: `index.html`
5. **`feat(html): implement catalog, cart, checkout and contact HTML pages`**
   - Files: `products.html`, `cart.html`, `contact.html`
6. **`feat(css): build responsive CSS with variables, Flexbox, and CSS Grid layout`**
   - Files: `css/style.css`
7. **`feat(css): implement 768px and 480px media queries and dark mode styling`**
   - Files: `css/style.css`
8. **`feat(js): build dynamic product card rendering and details modal with find()`**
   - Files: `js/store.js`
9. **`feat(js): implement live search, category filtering and immutable sort with spread`**
   - Files: `js/store.js`
10. **`feat(js): build cart engine with reduce(), rest parameter, and localStorage persistence`**
    - Files: `js/store.js`
11. **`feat(js): add client-side form validation with regex and error indicators`**
    - Files: `js/store.js`
12. **`feat(jquery): implement AJAX loading, slideToggle accordion, chaining and animations`**
    - Files: `js/ui.js`

---

## 7. Viva Preparation Questions & Detailed Answers

### Q1: Why do we copy the array before sorting?
**Answer:** In JavaScript, `Array.prototype.sort()` mutates (changes) the original array in-place. If we sorted the master product catalog directly, the initial order would be permanently overwritten, making it impossible to restore the "Featured" or default order. In `js/store.js`, we use the ES6 spread operator `[...items].sort(...)` to create a shallow clone of the array first, ensuring the sorting operation is pure and immutable without side effects on the original catalog.

### Q2: What is the difference between `filter` and `find`? Where did you use each?
**Answer:**
- `Array.prototype.filter()` evaluates a condition across all elements and returns a **new array** containing all elements that match. We used `filter()` in `getFilteredProducts()` in `store.js` to return multiple products matching the selected category and search string.
- `Array.prototype.find()` stops execution as soon as a match is found and returns the **single object** itself (or `undefined`). We used `find()` in `showProductDetails(productId)` and `addToCart(productId)` to retrieve a single specific product by its unique `id`.

### Q3: Explain how your cart total is calculated with `reduce`. What is the starting value?
**Answer:** In `calculateOrderTotals()` inside `store.js`, we compute the subtotal by calling:
```javascript
const subtotal = itemTotals.reduce((accumulatedTotal, currentLinePrice) => {
  return accumulatedTotal + currentLinePrice;
}, 0);
```
The starting value is explicitly specified as `0`. If an initial value were omitted, `reduce` would use the first array element as the initial accumulator. Providing `0` ensures that even if the cart is empty (an empty array `[]`), `reduce` evaluates cleanly to `0` rather than throwing a `TypeError: Reduce of empty array with no initial value`.

### Q4: What does event delegation do and why did you need it for dynamically added buttons?
**Answer:** Event delegation attaches a single event listener to a permanent ancestor element (like `document` or the catalog container) rather than binding listeners to individual buttons. In our application, product cards and cart table rows are generated dynamically at runtime via JavaScript after AJAX data arrives. If we used standard `document.querySelectorAll('.btn-add-cart').forEach()`, buttons created in the future would have no listeners attached. Event delegation uses event bubbling and `event.target.closest('.btn-add-cart')` to catch all current and future clicks reliably with zero memory leaks.

### Q5: What happens if the AJAX request fails? Show where you handle the error.
**Answer:** In `js/ui.js`, our jQuery AJAX call uses `$.getJSON("products.json")`. We explicitly chain a `.fail(function (jqxhr, textStatus, error) { ... })` callback. If the AJAX request fails (due to a 404, network drop, or browser CORS restrictions when opened with `file://`), the `.fail()` handler displays a warning banner informing the user that offline mode is active, and immediately falls back to `window.fallbackProducts` from `js/data.js` by invoking `ShopEasyStore.init(window.fallbackProducts)`.

### Q6: Show one place where jQuery and plain JavaScript work together. Could you do the same effect in plain JavaScript?
**Answer:** In `js/ui.js`, after jQuery successfully fetches `products.json` via AJAX (or upon fallback), it passes the data array to plain JavaScript by calling `window.ShopEasyStore.init(data)`. Conversely, when `store.js` finishes filtering or sorting products, it calls `window.triggerProductFadeIn()` to execute jQuery's smooth `.fadeIn()` animation. 
*Could we do this in plain JavaScript?* Yes, plain JavaScript can achieve smooth fade-ins using CSS transitions/opacity or the Web Animations API (`element.animate([{ opacity: 0 }, { opacity: 1 }], 350)`), but jQuery provides concise, cross-browser syntax in a single method call.

### Q7: How does your page change at the 768px breakpoint and why?
**Answer:** In `css/style.css`, `@media (max-width: 768px)` adapts the layout for tablet and small-screen viewports:
1. The desktop `.nav-links` are hidden, and the `.mobile-nav-toggle` hamburger button is revealed, triggering the collapsible `.mobile-nav-menu` via jQuery `.slideToggle()`.
2. The product grid (`.product-grid`) transitions from a 4-column layout to a 2-column layout (`grid-template-columns: repeat(2, 1fr)`) to maintain comfortable card width and readability.
3. The hero section (`.hero-grid`) and cart layout (`.cart-layout`) transition from two columns to stacked single-column layouts so tables, summary cards, and inputs do not suffer from horizontal truncation.
