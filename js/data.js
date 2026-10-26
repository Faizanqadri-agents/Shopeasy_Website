/**
 * ==============================================================================
 * Module: data.js (ShopEasy Fallback Product Catalog)
 * Purpose: Provides a hardcoded fallback array of products for the ShopEasy store.
 *          If jQuery's AJAX call ($.getJSON) fails (for example when opened directly
 *          via file:// protocol or during network drops), ui.js catches the error
 *          and gracefully loads this fallback dataset so the user experience is
 *          never disrupted.
 * Author: Student Name (Roll No.)
 * Technology: Plain JavaScript (ES6)
 * ==============================================================================
 */

// Fallback product dataset containing 16 diverse items across electronics, stationery, and accessories.
const fallbackProducts = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 149.99,
    category: "electronics",
    rating: 4.8,
    inStock: true,
    image: "images/prod-1.svg",
    description: "Premium over-ear wireless headphones with active noise cancellation, 40-hour battery life, and plush memory foam ear cushions."
  },
  {
    id: 2,
    name: "Ergonomic Mechanical Keyboard",
    price: 89.99,
    category: "electronics",
    rating: 4.7,
    inStock: true,
    image: "images/prod-2.svg",
    description: "Hot-swappable tactile mechanical keyboard featuring custom RGB backlighting, aircraft-grade aluminum frame, and detachable USB-C cable."
  },
  {
    id: 3,
    name: "Ultra-Slim 4K USB-C Monitor",
    price: 329.99,
    category: "electronics",
    rating: 4.9,
    inStock: true,
    image: "images/prod-3.svg",
    description: "27-inch IPS 4K UHD display with 99% sRGB color gamut, HDR support, 65W USB-C power delivery, and adjustable ergonomic stand."
  },
  {
    id: 4,
    name: "Precision Wireless Optical Mouse",
    price: 39.99,
    category: "electronics",
    rating: 4.5,
    inStock: true,
    image: "images/prod-4.svg",
    description: "Dual-mode Bluetooth & 2.4GHz rechargeable wireless mouse with adjustable DPI sensor (800-4000) and ultra-quiet click switches."
  },
  {
    id: 5,
    name: "Multi-Port USB-C Hub 8-in-1",
    price: 49.99,
    category: "electronics",
    rating: 4.3,
    inStock: false,
    image: "images/prod-5.svg",
    description: "All-in-one aluminum dongle featuring 4K HDMI, 100W Power Delivery, SD/TF card readers, gigabit Ethernet, and 3 high-speed USB 3.0 ports."
  },
  {
    id: 6,
    name: "Fast Wireless Charging Stand",
    price: 29.99,
    category: "electronics",
    rating: 4.4,
    inStock: true,
    image: "images/prod-6.svg",
    description: "Qi-certified 15W fast wireless charger with dual-coil architecture for portrait and landscape charging, temperature control, and LED indicator."
  },
  {
    id: 7,
    name: "Executive Hardcover Journal",
    price: 19.99,
    category: "stationery",
    rating: 4.9,
    inStock: true,
    image: "images/prod-7.svg",
    description: "Archival quality 120gsm bleed-proof dotted paper journal bound in premium vegan leather with ribbon bookmarks and inner accordion pocket."
  },
  {
    id: 8,
    name: "Premium Gel Pen Set 8-Pack",
    price: 14.99,
    category: "stationery",
    rating: 4.6,
    inStock: true,
    image: "images/prod-8.svg",
    description: "Ultra-smooth 0.5mm fine tip Japanese quick-dry archival black and assorted gel pens designed for seamless smudge-free handwriting."
  },
  {
    id: 9,
    name: "Minimalist Desktop Organizer",
    price: 24.99,
    category: "stationery",
    rating: 4.5,
    inStock: true,
    image: "images/prod-9.svg",
    description: "Eco-friendly bamboo desktop caddy with compartmentalized slots for notebooks, pens, stationery clips, and smartphone docking."
  },
  {
    id: 10,
    name: "Dual-Tip Pastel Highlighters",
    price: 12.49,
    category: "stationery",
    rating: 4.4,
    inStock: true,
    image: "images/prod-10.svg",
    description: "Set of 6 soft aesthetic pastel highlighters featuring both chisel and fine bullet tips with non-toxic water-based quick-drying ink."
  },
  {
    id: 11,
    name: "Brass Fountain Pen & Ink Bottle",
    price: 45.00,
    category: "stationery",
    rating: 4.8,
    inStock: false,
    image: "images/prod-11.svg",
    description: "Solid brass classic fountain pen with a stainless steel medium iridium nib, twist piston converter, and 50ml deep blue dye ink bottle."
  },
  {
    id: 12,
    name: "Heavy-Duty Metal Desk Stapler",
    price: 16.50,
    category: "stationery",
    rating: 4.2,
    inStock: true,
    image: "images/prod-12.svg",
    description: "Precision steel desktop stapler capable of binding up to 50 sheets at once, equipped with anti-jam mechanism and low-staple indicator."
  },
  {
    id: 13,
    name: "Water-Resistant Laptop Sleeve",
    price: 28.00,
    category: "accessories",
    rating: 4.6,
    inStock: true,
    image: "images/prod-13.svg",
    description: "Sleek 14-to-16 inch padded laptop sleeve made with durable hydrophobic nylon, 360-degree shock absorption edge guard, and accessory pocket."
  },
  {
    id: 14,
    name: "Ergonomic Aluminum Laptop Stand",
    price: 38.99,
    category: "accessories",
    rating: 4.7,
    inStock: true,
    image: "images/prod-14.svg",
    description: "Fully adjustable ventilated aluminum stand supporting up to 17-inch laptops for improved eye-level posture and superior cooling airflow."
  },
  {
    id: 15,
    name: "Blue Light Blocking Glasses",
    price: 22.50,
    category: "accessories",
    rating: 4.3,
    inStock: true,
    image: "images/prod-15.svg",
    description: "TR90 lightweight protective screen glasses that filter 99% of harmful digital blue light rays to reduce eyestrain and headaches."
  },
  {
    id: 16,
    name: "Braided Cable Organizers 5-Pack",
    price: 9.99,
    category: "accessories",
    rating: 4.1,
    inStock: true,
    image: "images/prod-16.svg",
    description: "Magnetic silicone cord clips with heavy-duty 3M adhesive backing to keep charging and peripheral cables neatly routed on desks."
  }
];

// Attach fallback dataset to global window object for universal browser availability
window.fallbackProducts = fallbackProducts;
