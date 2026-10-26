/**
 * ==============================================================================
 * Module: ui.js (jQuery Effects, Animations, DOM Manipulation & AJAX Loading)
 * Purpose: Fulfills all jQuery requirements for the ShopEasy web store:
 *          - Asynchronous product loading from products.json with $.getJSON()
 *          - Robust .fail() error handling with graceful fallback to data.js
 *          - Dynamic jQuery interactions (.on(), .click())
 *          - Rich jQuery effects & animations:
 *            1. .fadeIn() for product catalog card reveals
 *            2. .slideToggle() for FAQ accordion items & mobile dropdown menu
 *            3. .animate() for smooth back-to-top scrolling & slide-in cart drawer
 *            4. .fadeIn().delay().fadeOut() toast notifications with METHOD CHAINING
 *          - Extensive DOM methods (.addClass(), .toggleClass(), .text(), .html(), etc.)
 *          - Theme switcher (Light/Dark mode) with localStorage persistence
 *          - Plain JS & jQuery cooperation bridge
 * Author: Student Name (Roll No.)
 * Technology: jQuery 3.7.1
 * ==============================================================================
 */

// Wrap all jQuery code inside $(document).ready()
$(document).ready(function () {
  console.log("ShopEasy jQuery UI initialized successfully.");

  /* ==========================================================================
     1. jQuery AJAX: Loading Product Data with $.getJSON() & Fallback Error Path
     ========================================================================== */

  /**
   * Loads product catalog asynchronously from products.json using jQuery.
   * Demonstrates:
   *   - $.getJSON() AJAX call
   *   - Pre-loader status message
   *   - .done() success callback passing data to plain JS store module
   *   - .fail() error callback catching AJAX failure, rendering error banner,
   *     and gracefully falling back to window.fallbackProducts.
   * 
   * VIVA NOTE:
   * If products.json cannot be retrieved (e.g. 404, network failure, or CORS
   * when opening via file:// protocol directly without a web server), the
   * .fail() handler catches the error, displays an informative notice to the user,
   * and populates the store from fallbackProducts in data.js.
   */
  function loadProductsWithAjax() {
    const $catalogContainer = $("#product-grid");
    const $featuredContainer = $("#featured-grid");

    // Display animated loading message while AJAX request executes
    if ($catalogContainer.length > 0) {
      $catalogContainer.html(`
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <p><strong>Loading products...</strong></p>
        </div>
      `);
    }

    // Execute jQuery AJAX $.getJSON request
    $.getJSON("products.json")
      .done(function (data) {
        console.log("jQuery AJAX: Products successfully loaded from products.json (" + data.length + " items).");
        
        // COOPERATION POINT: jQuery passes AJAX data directly to plain JS store.js module
        if (window.ShopEasyStore && typeof window.ShopEasyStore.init === "function") {
          window.ShopEasyStore.init(data);
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        // VIVA QUESTION: WHERE IS THE AJAX ERROR HANDLED?
        // Answer: Right here in the .fail() promise callback!
        console.warn("jQuery AJAX Failed: " + textStatus + ", " + error);
        
        // Show user-friendly error notification box
        const errorMessage = `
          <div class="error-banner" role="alert">
            <div>
              <strong>Notice:</strong> Unable to load online catalog (AJAX request blocked or file offline). 
              Loaded offline fallback catalog instead.
            </div>
            <button class="btn btn-sm btn-secondary" onclick="$(this).parent().fadeOut(300)">Dismiss</button>
          </div>
        `;

        if ($catalogContainer.length > 0) {
          $catalogContainer.before(errorMessage);
        }

        // Graceful Fallback: Initialize plain JS store using hardcoded fallbackProducts from data.js
        if (window.ShopEasyStore && typeof window.ShopEasyStore.init === "function") {
          window.ShopEasyStore.init(window.fallbackProducts || []);
        }
      });
  }

  // Initiate AJAX loading immediately on page ready
  loadProductsWithAjax();

  /* ==========================================================================
     2. jQuery Animations & Effects
     ========================================================================== */

  /**
   * Effect 1: .fadeIn() animation when product cards appear or re-render.
   * Exposed globally for plain JS store.js to call after filtering/sorting.
   */
  window.triggerProductFadeIn = function () {
    $(".product-card").hide().fadeIn(350);
  };

  /**
   * Effect 2: FAQ Accordion on index.html using jQuery .slideToggle() & .toggleClass()
   * Interaction with .on("click")
   */
  $(".faq-question").on("click", function () {
    const $item = $(this).closest(".faq-item");
    const $answer = $item.find(".faq-answer");

    // Slide toggle current answer with smooth 300ms animation
    $answer.slideToggle(300);
    
    // Toggle active state for rotating chevron icon
    $item.toggleClass("active");

    // Close other sibling accordion items for a cleaner accordion UX
    $item.siblings(".faq-item").removeClass("active").find(".faq-answer").slideUp(250);
  });

  /**
   * Effect 3: Mobile Navigation Menu Toggle using .slideToggle()
   */
  $("#mobile-nav-toggle").on("click", function () {
    $("#mobile-nav-menu").slideToggle(250);
  });

  /**
   * Effect 4: Smooth Scroll Back to Top using jQuery .animate()
   * Also controls visibility with .fadeIn() and .fadeOut() based on scroll position
   */
  const $backToTop = $("#back-to-top");

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {
      $backToTop.fadeIn(250).css("display", "flex");
    } else {
      $backToTop.fadeOut(250);
    }
  });

  $backToTop.on("click", function () {
    // Animate scrollTop property of both html and body for cross-browser support
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  /**
   * Effect 5 & Method Chaining: Notification Toast Engine
   * Meets Requirement 3.4: "Use method chaining at least once."
   * Example: $("#toast").text(msg).addClass("show").fadeIn(300).delay(2500).fadeOut(400);
   * 
   * VIVA NOTE:
   * Method chaining invokes multiple jQuery methods consecutively on the same jQuery
   * wrapper object because each method returns the jQuery instance (`this`).
   */
  window.showToastNotification = function (message) {
    const $toast = $("#toast");
    if ($toast.length === 0) return;

    // Stop any running animations, set text, add class, fadeIn, delay for 2.5s, then fadeOut
    $toast
      .stop(true, true)
      .text(message)
      .addClass("show")
      .fadeIn(300)
      .delay(2500)
      .fadeOut(400, function () {
        $(this).removeClass("show");
      });
  };

  /**
   * Effect 6: Shake invalid input fields during form validation.
   * Adds CSS classes with .addClass(), removes after animation completes.
   */
  window.shakeInvalidField = function (fieldElement) {
    const $field = $(fieldElement);
    $field.addClass("input-error shake");
    
    // Remove shake animation class after 450ms so it can trigger again on next attempt
    setTimeout(function () {
      $field.removeClass("shake");
    }, 450);
  };

  /* ==========================================================================
     3. Slide-in Mini Cart Drawer (Triggered by Header Cart Icon)
     ========================================================================== */

  /**
   * Opens slide-in cart sidebar drawer using jQuery .animate() or CSS class
   */
  function openCartSidebar() {
    $("#cart-sidebar-overlay").fadeIn(200);
    $("#cart-sidebar").addClass("open");
    $("body").css("overflow", "hidden");
  }

  function closeCartSidebar() {
    $("#cart-sidebar-overlay").fadeOut(200);
    $("#cart-sidebar").removeClass("open");
    $("body").css("overflow", "");
  }

  // Open sidebar when clicking header cart button
  $("#btn-open-cart-drawer").on("click", function (e) {
    e.preventDefault();
    openCartSidebar();
  });

  // Close sidebar on close button or overlay click
  $("#btn-close-cart-sidebar, #cart-sidebar-overlay").on("click", function () {
    closeCartSidebar();
  });

  /* ==========================================================================
     4. Bonus: Light / Dark Theme Switcher with LocalStorage
     ========================================================================== */

  const $themeToggleBtn = $("#theme-toggle");
  
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem("shopeasy_theme") || "light";
  if (savedTheme === "dark") {
    $("html").attr("data-theme", "dark");
    $themeToggleBtn.find(".theme-icon").text("☀️");
    $themeToggleBtn.find(".theme-text").text("Light Mode");
  } else {
    $("html").removeAttr("data-theme");
    $themeToggleBtn.find(".theme-icon").text("🌙");
    $themeToggleBtn.find(".theme-text").text("Dark Mode");
  }

  // Handle theme switch click
  $themeToggleBtn.on("click", function () {
    const isCurrentlyDark = $("html").attr("data-theme") === "dark";
    
    if (isCurrentlyDark) {
      // Switch to Light Mode
      $("html").removeAttr("data-theme");
      localStorage.setItem("shopeasy_theme", "light");
      $(this).find(".theme-icon").text("🌙");
      $(this).find(".theme-text").text("Dark Mode");
      window.showToastNotification("Switched to Light Mode");
    } else {
      // Switch to Dark Mode
      $("html").attr("data-theme", "dark");
      localStorage.setItem("shopeasy_theme", "dark");
      $(this).find(".theme-icon").text("☀️");
      $(this).find(".theme-text").text("Light Mode");
      window.showToastNotification("Switched to Dark Mode");
    }
  });

  /* ==========================================================================
     5. Header Search Shortcut (Quick Jump to Products Page)
     ========================================================================== */
  $("#header-search-form").on("submit", function (e) {
    e.preventDefault();
    const query = $(this).find("input").val().trim();
    if (query) {
      window.location.href = "products.html?search=" + encodeURIComponent(query);
    }
  });

  // Check URL parameters on products.html for pre-filled search
  if (window.location.pathname.includes("products.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setTimeout(function () {
        const $searchInput = $("#search-input");
        if ($searchInput.length > 0) {
          $searchInput.val(searchParam).trigger("input");
        }
      }, 300);
    }
  }
});
