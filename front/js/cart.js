//PART 1: DECLARATION OF VARIABLES AND CONSTANTS (PRODUCTS, CARTCONTAINER, TOTALPRICE)
/**
 * The array of products in the shopping cart.
 * @type {Array<{quantity: string, color: string, id: string}>}
 */
let products = [];

/**
 * The container element for the shopping cart.
 * @type {HTMLElement}
 */
let cartContainer;

/**
 * The total price element.
 * @type {HTMLElement}
 */
let totalPrice;

//PART 2: RETRIEVAL OF CART DATA FROM LOCAL STORAGE AND PARSING IT AS JSON
if (typeof localStorage !== 'undefined') {
  //Retrieves the cart daata from the `localStorage` using the key "addToCart" and assigns it to the `cartData` variable.
  const cartData = localStorage.getItem("addToCart");
  //Checks if `cartData` exists (i.e., the cart data is not empty or `null`)
  if (cartData) {
    //Parses the `cartData` as JSON and assigns the resulting array to the `products` variable
    products = JSON.parse(cartData)
    console.log(products)
  }
};

//PART 3: RETRIEVAL OF DOM ELEMENTS (CARTCONTAINER, TOTALPRICE) IF DOCUMENT IS DEFINED
if (typeof document !== 'undefined') {
  //Retrieves/Gets the DOM element with the ID "cart__items" and assigns it to the `cartContainer` variable.
  cartContainer = document.getElementById("cart__items");
  console.log(cartContainer);
  //Retrieves/Gets the DOM element with the ID "totalPrice" and assigns it to the `totalPrice` variable.
  totalPrice = document.getElementById("totalPrice");
  console.log(totalPrice);
  //Retrieves/Gets the DOM element with the ID "totalQuantity" and assigns it to the `totalQuantity` variable.
  totalQuantity = document.getElementById("totalQuantity");
  console.log(totalQuantity);
};

//PART 4: DEFINE THE `RENDERCARTITEMS` FUNCTION
/**
 * Renders the shopping cart items.
 * @function renderCartItems
 * @returns {void}
 */
const renderCartItems = () => {
  // Create an object to store the grouped products
  const groupedProducts = {};
  let cartTotalQuantity = 0; // Initialize the cart total quantity

  // Iterate through products and group them by model and color
  products.forEach((product) => {
    const key = `${product.model}-${product.color}`;
    if (groupedProducts[key]) {
      // Product with the same model and color already exists, adjust the quantity
      groupedProducts[key].quantity += Number(product.quantity);
    } else {
      // New product with unique model and color, add it to the groupedProducts object
      groupedProducts[key] = {
        ...product,
        quantity: Number(product.quantity),
      };
    };
    console.log(groupedProducts);
    // Increment the cart total quantity by the product quantity
    cartTotalQuantity += product.quantity;
  });
  //Update the total quantity element
  totalQuantity.innerHTML = cartTotalQuantity;

  /**
  * Clears the content of the cart container.
  */
  cartContainer.innerHTML = "";

  const productFetches = Object.values(groupedProducts).map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
  );

  // Wait for all fetches to complete before rendering the cart items
  Promise.all(productFetches)
    .then((data) => {
      // Iterate through products and add them to the cart, (...if they have a quantity greater than 0 to exclude the ungrouped product remaining after grouping was done)
      Object.values(groupedProducts).forEach((product, index) => {
        if (product.quantity > 0) {
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
                <p>${data[index].price / 100}</p>
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
          itemQuantity.addEventListener("change", (event) => {
            const newQuantity = Number(itemQuantity.value);
            // Update the quantity in the groupedProducts object
            groupedProducts[`${product.model}-${product.color}`].quantity = newQuantity;
            // Update the quantity in the products array
            products.forEach((product) => {
              if (product.id === item.dataset.id && product.color === item.dataset.color) {
                product.quantity = newQuantity;
              }
            });
            // Update the total quantity element
            totalQuantity.innerHTML = calculateTotalQuantity();
            // Update the local storage
            localStorage.setItem("addToCart", JSON.stringify(products));
            // Calculate and display the total price
            calculateTotalPrice();
          });

          // Add event listener to delete item
          const deleteItem = item.querySelector(".deleteItem");
          deleteItem.addEventListener("click", (event) => {
            const deleteButton = event.target;
            const product = deleteButton.closest('.cart__item');
            if (product) {
              const productId = product.getAttribute('data-id');
              const productColor = product.getAttribute('data-color');
              const index = products.findIndex((product) => product.id === productId && product.color === productColor);
              products.splice(index, 1);
              localStorage.setItem("addToCart", JSON.stringify(products));
              renderCartItems();
              calculateTotalPrice();
            };
          });

          //Calls the `calculateTotalPrice` function to calculate and display the total price.
          calculateTotalPrice();
        };
      });
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
};

//PART 5: DEFINE THE `CALCULATETOTALQUANTITY` FUNCTION
const calculateTotalQuantity = () => {
  let totalQuantity = 0;
  // Iterate through products and sum up the quantities
  products.forEach((product) => {
    totalQuantity += product.quantity;
  });
  return totalQuantity;
};

//PART 6: DEFINE THE `CALCULATETOTALPRICE` FUNCTION
/**
 * Calculates and displays the total price.
 * @function calculateTotalPrice
 * @returns {void}
 */
const calculateTotalPrice = () => {
  let total = 0;

  // Create an array to store the fetch promises
  const productFetches = products.map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
  );
  Promise.all(productFetches)
    .then((data) => {
      data.forEach((product, index) => {
        total += product.price * products[index].quantity;
      });
      totalPrice.innerText = `${(total / 100).toFixed(2)}`; // Format the total price with two decimal places
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
};
//PART 7: INVOCATION OF `RENDERCARTITEMS` FUNCTION TO RENDER THE CART ITEMS ON THE PAGE
//Calls the `renderCartItems` function to render the cart items on the page.
renderCartItems();