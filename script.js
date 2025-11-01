// shop.js

// Select all "Buy Now" buttons
const buyButtons = document.querySelectorAll(".buy-btn");
const cartCount = document.getElementById("cartCount");

// Add click event to each "Buy Now" button
buyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const item = e.target.closest(".item1");
    const name = item.querySelector("h3").innerText;
    const price = item.querySelector("p").innerText;
    const image = item.querySelector("img").src;

    const product = { name, price, image, quantity: 1 };

    addToCart(product);
    updateCartCount();
  });
});

// === Add Product to Cart ===
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // SweetAlert2 toast notification
  Swal.fire({
    title: "Added to Cart 🛒",
    text: `${product.name} has been added successfully!`,
    icon: "success",
    confirmButtonColor: "#4B3621",
    timer: 2000,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
  });
}

// === Update Cart Count on the Floating Icon ===
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Update count when page loads
window.addEventListener("load", updateCartCount);

// === Highlight Active Nav Link ===
const navLinks = document.querySelectorAll(".nav-link a");
navLinks.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
