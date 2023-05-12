/**
 * The array of products in the shopping cart.
 * @type {Array<{quantity: string, color: string, id: string}>}
 */
const products = JSON.parse(localStorage.getItem("addToCart"));

/**
 * The container element for the shopping cart.
 * @type {HTMLElement}
 */
const cartContainer = document.getElementById("cart__items");

/**
 * The total price element.
 * @type {HTMLElement}
 */
const totalPrice = document.getElementById("totalPrice");

/**
 * Renders the shopping cart items.
 * @function renderCartItems
 * @returns {void}
 */
const renderCartItems = () => {
  // Clear previous content
  cartContainer.innerHTML = "";

  // Iterate through products and add them to the cart
  products.forEach((product) => {
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
      .then((data) => {
        const item = document.createElement("div");
        item.classList.add("cart__item");
        item.innerHTML = `
        <div class="cart__item__img">
          <img src="${data.imageUrl}" alt="${data.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${data.name}</h2>
            <p>${product.color}</p>
            <p>${data.price / 100}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      `;
        cartContainer.appendChild(item);

        // Add event listener to delete item
        const deleteItem = item.querySelector(".deleteItem");
        deleteItem.addEventListener("click", () => {
          const index = products.findIndex((p) => p.id === data._id && p.color === product.color);
          products.splice(index, 1);
          localStorage.setItem("addToCart", JSON.stringify(products));
          renderCartItems();
          calculateTotalPrice();
        });

        // Add event listener to change quantity
        const itemQuantity = item.querySelector(".itemQuantity");
        itemQuantity.addEventListener("change", () => {
          product.quantity = itemQuantity.value;
          localStorage.setItem("addToCart", JSON.stringify(products));
          calculateTotalPrice();
        });

        // Calculate the total price
        calculateTotalPrice();
      });
  });
};

/**
 * Calculates and displays the total price.
 * @function calculateTotalPrice
 * @returns {void}
 */
const calculateTotalPrice = () => {
  let total = 0;
  products.forEach((product) => {
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
      .then((data) => {
        total += data.price * product.quantity;
        totalPrice.innerText = `${total / 100}€`;
      });
  });
};

renderCartItems();

const orderForm = document.getElementById("orderForm");

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the form data
  const formData = new FormData(orderForm);

  // Send the form data to the server
  fetch("http://localhost:3000/api/orders", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Generate a unique order ID
      const orderID = Math.floor(Math.random() * 10000000000);

      // Store the order ID in the browser's local storage
      localStorage.setItem('orderID', orderID);

      // Redirect to the confirmation page
      window.location.href = './confirmation.html';
    })
    .catch((error) => {
      console.error("There was an error sending the form data", error);
    });
});
