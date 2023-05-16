/**
 * The array of products in the shopping cart.
 * @type {Array<{quantity: string, color: string, id: string}>}
 */
const products = JSON.parse(localStorage.getItem("addToCart"));
console.log(products)

/**
 * The container element for the shopping cart.
 * @type {HTMLElement}
 */
const cartContainer = document.getElementById("cart__items");
console.log(cartContainer)
/**
 * The total price element.
 * @type {HTMLElement}
 */
const totalPrice = document.getElementById("totalPrice");
console.log(totalPrice)
/**
 * Renders the shopping cart items.
 * @function renderCartItems
 * @returns {void}
 */
const renderCartItems = () => {
/**
 * Clears the content of the cart container.
 */
  cartContainer.innerHTML = "";

  // products.forEach((product) => { 
  //   OR
const productFetches = products.map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
);

Promise.all(productFetches)
  .then((data) => {
    // Iterate through products and add them to the cart
    products.forEach((product, index) => {
      const item = document.createElement("div");
      item.classList.add("cart__item");
      item.dataset.id = product.id;
        item.dataset.color = product.color;
        item.innerHTML = `
        <div class="cart__item__img">
          <img src="${data[index].imageUrl}" alt="${data[index].altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${data[index].name}</h2>
            <p>${product.color}</p>
            <p>${data[index].price / 100}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantity : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Delete</p>
            </div>
          </div>
        </div>
      `;
        cartContainer.appendChild(item);
        
        // Add event listener to change quantity
        const itemQuantity = item.querySelector(".itemQuantity");
        itemQuantity.addEventListener("change", () => {
          product.quantity = itemQuantity.value;
          localStorage.setItem("addToCart", JSON.stringify(products));
          calculateTotalPrice();
        });

        // Add event listener to delete item
        const deleteItem = item.querySelector(".deleteItem");
        deleteItem.addEventListener("click", () => {
          const index = products.findIndex((p) => p.id === data._id && p.color === product.color);
          products.splice(index, 1);
          localStorage.setItem("addToCart", JSON.stringify(products));
          renderCartItems();
          calculateTotalPrice();
        });

        // Calculate the total price
        calculateTotalPrice();
      });
  })
  .catch((error) => {
    console.error("Error fetching product data:", error);
  });
};

/**
 * Calculates and displays the total price.
 * @function calculateTotalPrice
 * @returns {void}
 */
const calculateTotalPrice = () => {
  let total = 0;

  //Fetch product data for all items
  const productFetches = products.map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
  );
  Promise.all(productFetches)
      .then((data) => {
        data.forEach((product, index) => {
        total += product.price * products[index].quantity;
        });
        totalPrice.innerText = `${total / 100}€`;
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
};

renderCartItems();