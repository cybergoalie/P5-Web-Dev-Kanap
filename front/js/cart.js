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
let totalQuantityElement; //Rename the global variable to avoid confusion
let filteredProducts = []; // Declare filteredProducts at the global

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
  totalQuantityElement = document.getElementById("totalQuantity");
  console.log(totalQuantityElement);
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

  filteredProducts = []; //Declare filteredProducts variable outside of Promise.all callback in order to create an array to hold the filtered products
  Object.values(groupedProducts).forEach((product) => {
    if (product.quantity > 0) {
      filteredProducts.push(product);
    }
  });

  // Update the total quantity element
  calculateTotalQuantity(filteredProducts);

  // Wait for all fetches to complete before rendering the cart items
  Promise.all(productFetches)
    .then((data) => {
      //Filter out deleted items
      filteredProducts = Object.values(groupedProducts).filter((product) => product.quantity > 0);
      // Iterate through products and add them to the cart, (...if they have a quantity greater than 0 to exclude the ungrouped product remaining after grouping was done)
      console.log(filteredProducts)
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

            renderCartItems();
            calculateTotalPrice(filteredProducts);
            localStorage.setItem("addToCart", JSON.stringify(products));
          }
        }
        });
    });
  // Add event listener to change quantity
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
      // Calculate and display the total quantity
      calculateTotalQuantity(filteredProducts);
      // Calculate and display the total price
      calculateTotalPrice(filteredProducts);
      // Update the local storage
      localStorage.setItem("addToCart", JSON.stringify(products));
    });
  });

})

    .catch ((error) => {
  console.error("Error fetching product data:", error);
});
//Calls the `calculateTotalPrice` function to calculate and display the total price.
calculateTotalPrice(filteredProducts);
};


//PART 5: DEFINE THE `CALCULATETOTALQUANTITY` FUNCTION
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

//PART 6: DEFINE THE `CALCULATETOTALPRICE` FUNCTION
/**
 * Calculates and displays the total price.
 * @function calculateTotalPrice
 * @returns {void}
 */
const calculateTotalPrice = () => {
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
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
};
//PART 7: INVOCATION OF `RENDERCARTITEMS` FUNCTION TO RENDER THE CART ITEMS ON THE PAGE
//Calls the `renderCartItems` function to render the cart items on the page.
renderCartItems();