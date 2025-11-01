// cart.js

const cartTable = document.querySelector("#cartTable tbody");
const totalAmount = document.querySelector("#totalAmount");
const checkoutForm = document.getElementById("checkoutForm");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartTable.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
    const subtotal = priceValue * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" width="60"> ${item.name}</td>
      <td>₦${priceValue.toLocaleString()}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" style="width:50px" onchange="updateQty(${index}, this.value)">
      </td>
      <td>₦${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
      <td><button onclick="removeItem(${index})">Remove</button></td>
    `;
    cartTable.appendChild(row);
  });

  totalAmount.textContent = `Total: ₦${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQty(index, qty) {
  cart[index].quantity = parseInt(qty);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// === Handle Checkout Form Submission ===
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Get customer info
  const customer = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  localStorage.setItem("customerInfo", JSON.stringify(customer));

  const total = cart.reduce((sum, item) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + priceValue * item.quantity;
  }, 0);

  payWithPaystack(total, customer);
});

// === Paystack Payment Function ===
function payWithPaystack(total, customer) {
  const handler = PaystackPop.setup({
    key: "pk_test_439e03abb254399d1cf5b13621214fcc61358945", // Replace with your Paystack Public Key
    email: customer.email,
    amount: total * 100, // in kobo
    currency: "NGN",
    ref: "ELLABLINGS-" + Math.floor(Math.random() * 1000000000),
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: customer.name,
        },
        {
          display_name: "Phone",
          variable_name: "customer_phone",
          value: customer.phone,
        },
        {
          display_name: "Delivery Address",
          variable_name: "customer_address",
          value: customer.address,
        },
      ],
    },
    callback: function (response) {
      alert("Payment successful! Reference: " + response.reference);

      // Store order summary locally
      const order = {
        reference: response.reference,
        date: new Date().toLocaleString(),
        customer,
        cart,
        total,
      };

      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart & customer info
      localStorage.removeItem("cart");
      localStorage.removeItem("customerInfo");

      alert("Thank you, " + customer.name + "! Your order has been received.");
      location.reload();
    },
    onClose: function () {
      alert("Transaction cancelled.");
    },
  });

  handler.openIframe();
}

renderCart();
