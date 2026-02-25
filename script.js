// --- DOM Selectors ---
// A single object to hold all your selectors
const selectors = {
  // Navigation & Mobile
  hamburger: ".hamburger",
  mobileMenu: "#mobileMenu",
  closeBtn: "#closeBtn",

  // FAQ
  faqToggles: ".faq-modal",

  // Products
  productsRow1: "#products-row1",
  productsRow2: "#products-row2",
  addToCartBtn: ".add-to-cart",
  productCard: ".product-card",
  productName: ".name",
  productPrice: ".price",
  productImage: "img",
  wishlistHeart: ".wishlist-heart",

  // Cart
  cartCount: ".cart-count",
  cartPopup: "#cart-popup",
  cartItemsContainer: "#cart-items",
  closeCartBtn: "#close-cart",
  cartContainer: ".cart-container",
  cartCountHeader: ".carts-length h3",
  subtotalPrice: ".total span",
};
// --- Global Data & State ---
// Store product data as objects with numeric prices
const products = [
  // Row 1
  {
    id: 1,
    name: "Compact Nightstand",
    price: 180.0,
    tag: "Featured",
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/compact-wood-nightstand-15.jpg",
    imgHover:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    name: "Steel Garden Armchair",
    price: 180.0,
    tag: "-19% off",
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/steel-garden-armchair-1-600x750.jpg",
    imgHover:
      "https://images.pexels.com/photos/5622834/pexels-photo-5622834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    name: "Tact Mirror",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/tact-mirror-2-600x840.jpeg",
    imgHover:
      "https://images.pexels.com/photos/6315800/pexels-photo-6315800.jpeg",
  },
  {
    id: 4,
    name: "Rocking Armchair",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/linen-rocking-armchair-3.jpeg",
    imgHover:
      "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  // Row 2
  {
    id: 5,
    name: "Amber Capsule",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/amber-capsule-7.jpeg",
    imgHover:
      "https://images.pexels.com/photos/763148/pexels-photo-763148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 6,
    name: "Round Bedside Table",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/round-bedside-table-1-600x900.jpeg",
    imgHover:
      "https://images.pexels.com/photos/279768/pexels-photo-279768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 7,
    name: "Glass Display Sideboard",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/glass-display-sideboard-2.jpeg",
    imgHover:
      "https://images.pexels.com/photos/5623053/pexels-photo-5623053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 8,
    name: "Ambientec Lamp",
    price: 180.0,
    img: "https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/ambientec-4.jpeg",
    imgHover:
      "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg",
  },
];

let cart = [];

// --- Cached DOM Elements ---
const getElement = (selector) => document.querySelector(selector);
const getAllElements = (selector) => document.querySelectorAll(selector);

const mobileMenu = getElement(selectors.mobileMenu);
const cartPopup = getElement(selectors.cartPopup);
const cartItemsContainer = getElement(selectors.cartItemsContainer);
const cartCount = getElement(selectors.cartCount);
const productsRow1 = getElement(selectors.productsRow1);
const productsRow2 = getElement(selectors.productsRow2);

// New variables for overlay and body
const body = document.body;
const emptyMessage = document.querySelector(".empty-cart-message");
const emptyMessageContainer = document.querySelector(
  ".empty-cart-message-container"
);

// --- UI Rendering Functions ---
function renderProducts() {
  products.forEach((product, index) => {
    const card = `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img class="main-img" src="${product.img}" alt="${product.name}" />
          <img class="hover-img" src="${product.imgHover}" alt="${
      product.name
    } hover" />
          ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ""}
        </div>
        <div class="product-info">
          <h3 class="name">
            ${
              product.name
            } <span ><svg class="wishlist-heart" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M4.087 6.477a4.565 4.565 0 0 1 6.456 0L12 7.934l1.457-1.457a4.565 4.565 0 0 1 6.456 6.457l-1.457 1.456l.013.013l-6.456 6.457l-.013-.013l-.013.013l-6.456-6.457l.013-.013l-1.457-1.456a4.565 4.565 0 0 1 0-6.457Z"/>
</svg></span>
          </h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart"><span ><svg
                  class="plus"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z"
                    clip-rule="evenodd"
                  />
                </svg></span>Add to cart</button>
        </div>
      </div>
    `;
    if (index < 4) {
      productsRow1.innerHTML += card;
    } else {
      productsRow2.innerHTML += card;
    }
  });
}
function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const lowerPart = document.querySelector(".lower-part");
  const cartHeader = getElement(selectors.cartCountHeader);

  cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
  cartCount.innerText = totalItems;

  if (totalItems === 0) {
    cartHeader.innerText = "";
    // cartHeader.style.width = "420px";
    cartHeader.parentNode.style.border = "none";
    cartItemsContainer.innerHTML = "";
    lowerPart.style.display = "none";
    // Show the empty cart message
    emptyMessageContainer.style.display = "flex";
  } else {
    cartHeader.innerText = `Your cart (${totalItems} ${
      totalItems === 1 ? "item" : "items"
    })`;
    cartHeader.style.width = "";
    cartHeader.parentNode.style.border = "";
    lowerPart.style.display = "block";
    // Hide the empty cart message
    emptyMessageContainer.style.display = "none";

    const subtotalSpan = getElement(selectors.subtotalPrice);
    subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;

    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const totalPrice = item.price * item.quantity;
      const div = document.createElement("div");
      div.classList.add("per-item");
      div.dataset.index = index;
      div.innerHTML = `
                <button class="item-remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <img class="item-image" src="${item.img}" alt="${item.name}" />
                <div class="cart-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="counter">
                        <button class="decrease">−</button>
                        <p class="quantity">${item.quantity}</p>
                        <button class="increase">+</button>
                    </div>
                </div>
                <p class="total-price">$${totalPrice.toFixed(2)}</p>
            `;
      cartItemsContainer.appendChild(div);
    });
  }
}
// --- Event Handling Logic ---
function handleProductClicks(event) {
  const addToCartBtn = event.target.closest(selectors.addToCartBtn);
  if (!addToCartBtn) return;

  // Add loading state
  addToCartBtn.classList.add("loading");

  // Simulate a delay for the loading spinner
  setTimeout(() => {
    // Remove loading state after 2 seconds
    addToCartBtn.classList.remove("loading");

    const card = event.target.closest(selectors.productCard);
    const productId = parseInt(card.dataset.productId);
    const selectedProduct = products.find((p) => p.id === productId);

    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...selectedProduct, quantity: 1 });
    }
    updateCartUI();

    // Open the cart popup and show overlay
    cartPopup.classList.add("active");
    body.classList.add("no-scroll");
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "block";
  }, 2000); // 2000 milliseconds = 2 seconds
}
function handleCartClicks(event) {
  const itemElement = event.target.closest(".per-item");
  if (!itemElement) return;

  const index = parseInt(itemElement.dataset.index);

  if (event.target.classList.contains("increase")) {
    cart[index].quantity++;
  } else if (event.target.classList.contains("decrease")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
  } else if (event.target.closest(".item-remove")) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// --- Initialization & Event Listeners ---
function setupEventListeners() {
  const overlay = document.querySelector(".overlay");
  // Mobile Menu Toggles
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu .close");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("change");
    mobileMenu.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    hamburger.classList.toggle("change");
    mobileMenu.classList.toggle("active");
  });

  // Wishlist Heart Toggles
  const hearts = getAllElements(selectors.wishlistHeart);
  hearts.forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("filled");
    });
  });

  // FAQ Toggles
  const faqToggles = getAllElements(selectors.faqToggles);

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const answer = toggle.nextElementSibling;
      const span = toggle.querySelector("span"); // span holds the SVG
      const isAlreadyActive = toggle.classList.contains("active");

      // Close all others
      faqToggles.forEach((otherToggle) => {
        const otherAnswer = otherToggle.nextElementSibling;
        const otherSpan = otherToggle.querySelector("span");

        otherToggle.classList.remove("active");
        otherAnswer.classList.remove("active");

        // Reset to PLUS svg
        otherSpan.innerHTML = `
        <svg class="plus-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
          <path fill="currentColor" fill-rule="evenodd"
            d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z"
            clip-rule="evenodd"/>
        </svg>
      `;
      });

      // Open clicked one
      if (!isAlreadyActive) {
        toggle.classList.add("active");
        answer.classList.add("active");

        // Switch to MINUS svg
        span.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
        </svg>
      `;
      }
    });
  });

  // Open cart
  getElement(selectors.cartContainer).addEventListener("click", () => {
    cartPopup.classList.add("active");
    body.classList.add("no-scroll");
    overlay.style.display = "block"; // show overlay
  });

  // Close cart
  getElement(selectors.closeCartBtn).addEventListener("click", () => {
    cartPopup.classList.remove("active");
    body.classList.remove("no-scroll");
    overlay.style.display = "none"; // hide overlay
  });

  // Also close cart when clicking on overlay
  overlay.addEventListener("click", () => {
    cartPopup.classList.remove("active");
    body.classList.remove("no-scroll");
    overlay.style.display = "none";
  });
  // Event delegation for adding/changing cart items
  productsRow1.addEventListener("click", handleProductClicks);
  productsRow2.addEventListener("click", handleProductClicks);
  cartItemsContainer.addEventListener("click", handleCartClicks);
}

const scrollBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
  // Calculate if the user is at the bottom of the page
  const atBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;

  if (atBottom) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
function init() {
  renderProducts();
  setupEventListeners();
  updateCartUI();
}

init();
