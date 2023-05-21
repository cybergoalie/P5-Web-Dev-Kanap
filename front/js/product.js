/**
 * URLSearchParams interface provides utility methods to work with the query string of a URL.
 * @external URLSearchParams
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams}
 */

/**
 * The parameters object that represents the query string of the current URL.
 * @type {URLSearchParams}
 */
const params = new URL(document.location).searchParams;

/**
 * The ID of the product to fetch from the API.
 * @type {string|null}
 */
const id = params.get("id");

/**
 * The URL to fetch the product data from.
 * @type {string}
 */
const url = `http://localhost:3000/api/products/${id}`;

/**
 * The DOM element that will contain the product information.
 * @type {HTMLElement}
 */
const container = document.getElementById("items");


/**
 * Fetches the product with the specified ID and updates the product page with the details.
 * @function getArticle
 * @returns {void}
 */
const getArticle = () => {
  // Fetch the product data from the API
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      // Update the title element with the product name
      document.getElementById("title").innerHTML = data.name;

      // Update the price element with the product price
      document.getElementById("price").innerHTML = parseFloat(data.price).toLocaleString();

      // Add an image element with the product image URL as the source
      const addImg = document.createElement("img");
      document.querySelector(".item__img").appendChild(addImg);
      addImg.setAttribute("src", `${data.imageUrl}`);

      // Update the description element with the product description
      document.getElementById("description").innerHTML = data.description;

      // Add color options to the select element based on the available colors for the product
      const addOption = document.getElementById("colors");
      for (const color of data.colors) {
        addOption.innerHTML += `<option value="${color}">${color}</option>`;
      }
    });
};

/**
 * The DOM element that represents the "Add to Cart" button.
 * @type {HTMLElement}
 */
const addToCart = document.getElementById("addToCart");
/**
 * The click event listener for the "Add to Cart" button that adds the selected product to the cart.
 */
addToCart.addEventListener("click", () => {
  // Get the selected color and quantity
  const selectedColor = document.getElementById("colors").value;
  // Assigns the variable (a storage location that can hold a value, in this case with a value that remains 'constant' throughout the program execution) `quantity` to the result of the `parseInt` function, which retrieves the HTML element with the ID "quantity", calls the `getElementById` method on the `document` object, which represents the current HTML doc, and by passing "quantity" as the argument, selects the element with the ID "quantity"; once the element with "quantity" is selected, the .value property, which represents the current value entered into the input element, is accessed; finally, after taking a string of information from the HTML element with the ID "quantity" as input, it parses it to obtain an integer, whose value is passed as the argument to `parseInt`, ensuring that `quantity` contains an integer value rather than a string.
  const quantity = parseInt(document.getElementById("quantity").value);

  // Check if a color is selected
  if (!selectedColor) {
    alert("Please select a color in order to add the item to your cart.");
    return;
  }

  // Create an object that represents the product to be added to the cart
  const addProduct = {
    color: selectedColor,
    quantity: quantity,
    id: id,
  };

  alert("Your item has been added to the cart! When you are ready to purchase your order, click on the Cart tab above.");

  // Store the selected product with its details to the local storage
  let addProductLocalStorage = [];
  if (localStorage.getItem("addToCart") !== null) {
    // If the key "addToCart" exists in local storage, parse the value to an array and assign it to addProductLocalStorage.
    addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart"));
  }
  // Add the selected product to the addProductLocalStorage array
  addProductLocalStorage.push(addProduct);

  // Convert the addProductLocalStorage array to a JSON string and store it in the "addToCart" key of local storage
  localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));

  // Reset color option to the default choice
  document.getElementById("colors").selectedIndex = 0;

  // Reset the number of articles to the default value
  document.getElementById("quantity").value = 1;

  // Update the total quantity in the cart 
  const cartTotalQuantity = document.getElementById("cartTotalQuantity");
  if (cartTotalQuantity) {
    const currentQuantity = parseInt(cartTotalQuantity.textContent);
    cartTotalQuantity.textContent = currentQuantity + quantity;
  }
});

getArticle();