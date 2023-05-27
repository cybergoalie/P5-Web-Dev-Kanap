//PART 1: DECLARATION OF VARIABLES AND CONSTANTS (declares and initializes the variables used in the script)
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
let totalQuantityElement; //Rename the global variable to avoid confusion
let filteredProducts = []; // Declare filteredProducts at the global

//PART 2: RETRIEVAL OF CART DATA FROM LOCAL STORAGE AND PARSING IT AS JSON (Checks if `localStorage` is available, retrieves cart data from the `localStorage` using the key "addToCart", and parses the retrieved cart data as JSON and assigns it to the `products` variable)
if (typeof localStorage !== 'undefined') {
  //Retrieves the cart daata from the `localStorage` using the key "addToCart" and assigns it to the `cartData` variable.
  const cartData = localStorage.getItem("addToCart");
  //Checks if `cartData` exists (i.e., the cart data is not empty or `null`)
  if (cartData) {
    //Parses the `cartData` as JSON and assigns the resulting array to the `products` variable
    products = JSON.parse(cartData)
    console.log(products)
  }
}

//PART 3: RETRIEVAL OF DOM ELEMENTS (Checks if the `document` object is available, and if so retrieves the necessary DOM elements using their IDs and assigns them to the corresponding variables.
if (typeof document !== 'undefined') {
  //Retrieves/Gets the DOM element with the ID "cart__items" and assigns it to the `cartContainer` variable.
  cartContainer = document.getElementById("cart__items");
  console.log(cartContainer);
  //Retrieves/Gets the DOM element with the ID "totalPrice" and assigns it to the `totalPrice` variable.
  totalPrice = document.getElementById("totalPrice");
  console.log(totalPrice);
  //Retrieves/Gets the DOM element with the ID "totalQuantity" and assigns it to the `totalQuantity` variable.
  totalQuantityElement = document.getElementById("totalQuantity");
  console.log(totalQuantityElement);
}

//PART 4: DEFINE THE `CALCULATETOTALQUANTITY` FUNCTION (Used to calculate the total quantity of products in the cart, and update the total quantity element with the calculated value)
const calculateTotalQuantity = (filteredProducts) => {
  let totalQuantity = 0;
  // Iterate through products and sum up the quantities
  filteredProducts.forEach((product) => {
    totalQuantity += product.quantity;
  });
  console.log(totalQuantity);
  // Update the total quantity element
  totalQuantityElement.innerHTML = totalQuantity;
};

//PART 5: DEFINE THE `CALCULATETOTALPRICE` FUNCTION (Used to calculate the total price of the products in the cart, fetch the necessary product data using the product IDs, calculate the total price by multiplying the product price with the quantity, and update the total price element with the calculated value)
/**
 * Calculates and displays the total price.
 * @function calculateTotalPrice
 * @returns {void}
 */
const calculateTotalPrice = (filteredProducts) => {
  let total = 0;

  // Create an array to store the fetch promises
  const productFetches = filteredProducts.map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
  );

  Promise.all(productFetches)
    .then((data) => {
      data.forEach((product, index) => {
        total += product.price * filteredProducts[index].quantity;
      });
      const formattedTotal = total.toLocaleString(); // Format the total price with commas
      totalPrice.innerText = formattedTotal;
    })
    // The catch() method will always get called whenever an error is encountered at any point along the promise chain:
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
};

//PART 6: DEFINE THE `RENDERCARTITEMS` FUNCTION (Creates an object to store the grouped products, iterates through the products and groups by model and color, calculates the cart's total quantity, clears the content of the cart container, fetches the product data for each grouped product, iterates through the grouped products and adds them to the cart container, adds event listeners for delete buttons and quantity changes, updates the filteredProducts array and localStorage, then invokes the `calculateTotalPrice` and `calculateTotalQuantity functions)
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
    const key = `${product.id}-${product.color}`;
    if (groupedProducts[key]) {
      // Product with the same model and color already exists, adjust the quantity
      groupedProducts[key].quantity += Number(product.quantity);
    } else {
      // New product with unique model and color, add it to the groupedProducts object
      groupedProducts[key] = {
        ...product, // `...` is a spread operator used to create a new object that combines the properties of an existing `product` object with an additional property `quantity`
        quantity: Number(product.quantity),
      };
    }
    console.log(groupedProducts);
    // Increment the cart total quantity by the product quantity
    cartTotalQuantity += product.quantity;
  });
  //Update the total quantity element
  totalQuantityElement.innerHTML = calculateTotalQuantity(filteredProducts);
  /**
  * Clears the content of the cart container.
  */
  cartContainer.innerHTML = "";
  const productFetches = Object.values(groupedProducts).map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
  );

  Object.values(groupedProducts).forEach((product) => {
    if (product.quantity > 0) {
      filteredProducts.push(product);
    }
  });

  // Update the total quantity element
  calculateTotalQuantity(filteredProducts);
  // Calculate and display the total price
  calculateTotalPrice(filteredProducts);

  // Wait for all fetches to complete before rendering the cart items using a 'Promise, then, catch' block
  Promise.all(productFetches)
    .then((data) => {
     

      Object.values(groupedProducts).forEach((product, index) => {
        const key = `${product.id}-${product.color}`;
        if (!key) {
          return; //Skip products with undefined keys
        }
        if (product.quantity > 0) {
          const item = document.createElement("div");
          item.classList.add("cart__item");
          item.dataset.id = product.id;
          item.dataset.color = product.color;
          const formattedPrice = data[index].price.toLocaleString(); // Format the price with commas
          item.innerHTML = `
            <div class="cart__item__img">
              <a href="./product.html?id=${product.id}">
                <img src="${data[index].imageUrl}" alt="${data[index].altTxt}">
              </a>
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
                <h2>${data[index].name}</h2>
                <p>${product.color}</p>
                <p>€ ${formattedPrice}</p> <!-- Display the formatted price -->
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
           //Filter out items left over with no numerical value after grouping into separate colors
      filteredProducts = Object.values(groupedProducts).filter((product) => product.quantity > 0);
      // Iterate through products and add them to the cart, (...if they have a quantity greater than 0 to exclude the ungrouped product remaining after grouping was done)
      console.log(filteredProducts)
          cartContainer.appendChild(item);
        };
      });

      // Delete item event listener
      const deleteButtons = cartContainer.querySelectorAll(".deleteItem");
      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", (event) => {
          const deleteButton = event.target;
          const item = deleteButton.closest('.cart__item');
          if (item) {
            const productId = item.getAttribute('data-id');
            const productColor = item.getAttribute('data-color');

            // Remove the item from products array
            products = products.filter((product) => !(product.id === productId && product.color === productColor));

            item.remove();

            // Update the filteredProducts array
            filteredProducts = filteredProducts.filter((product) => !(product.id === productId && product.color === productColor));

            calculateTotalPrice(filteredProducts);
            calculateTotalQuantity(filteredProducts);
            localStorage.setItem("addToCart", JSON.stringify(filteredProducts));
          }
        });
      });
      // Add event listener to change quantity
      const itemQuantities = cartContainer.querySelectorAll(".itemQuantity");
      itemQuantities.forEach((itemQuantity) => {
        itemQuantity.addEventListener("change", (event) => {
          const newQuantity = Number(itemQuantity.value);
          // Update the quantity in the groupedProducts object
          const item = itemQuantity.closest('.cart__item');
          const productId = item.getAttribute('data-id');
          const productColor = item.getAttribute('data-color');

          // Update the quantity in the groupedProducts object
          groupedProducts[`${productId}-${productColor}`].quantity = newQuantity;

          // Update the quantity in the filteredProducts array
          const productIndex = filteredProducts.findIndex((product) => product.id === productId && product.color === productColor);
          if (productIndex !== -1) {
            filteredProducts[productIndex].quantity = newQuantity;
          }

          // Update the local storage
          localStorage.setItem("addToCart", JSON.stringify(filteredProducts));

          // Update the total price
          calculateTotalPrice(filteredProducts);
          calculateTotalQuantity(filteredProducts);
        });
      });

    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
};

//PART 7: INVOCATION OF `RENDERCARTITEMS` FUNCTION TO RENDER THE CART ITEMS ON THE PAGE
renderCartItems();