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
        return res.json()
    })
    .then(function (data) {
        console.log(data); 
        // Update the title element with the product name by USING THE FOLLOWING SINGLE LINE:
        //const addTitle = (document.getElementById("title").innerHTML=data.name) OR WITH THE FOLLOWING 2 LINES TOGETHER:
        const addTitle = document.getElementById("title")
        addTitle.innerHTML=data.name

        // Update the price element with the product price, by USING THE FOLLOWING SINGLE LINE: 
        //const addPrice = (document.getElementById("price").innerHTML=data.price), OR the following SINGLE LINE:
        document.getElementById("price").innerHTML = parseFloat(data.price).toLocaleString();

        
        // Add an image element with the product image URL as the source
        const addImg = document.createElement("img")
        document.querySelector(".item__img").appendChild(addImg)
        addImg.setAttribute("src", `${data.imageUrl}`)

        // Update the description element with the product description
        document.getElementById("description").innerHTML = data.description
        
        // Add color options to the select element based on the available colors for the product
        const addOption = document.getElementById("colors")
        for (color in data.colors) {
            addOption.innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
        }
    })
}
/**
 * The DOM element that represents the "Add to Cart" button.
 * @type {HTMLElement}
 */
const addToCart = document.getElementById("addToCart");
/**
 * The click event listener for the "Add to Cart" button that adds the selected product to the cart.
 * @function
 * @returns {void}
 *then,
   * Create an object that represents the product to be added to the cart.
   * @type {object}
   * @property {number} quantity - The quantity of the product to be added to the cart.
   * @property {string} color - The color of the product to be added to the cart.
   * @property {string|null} id - The ID of the product to be added to the cart.
   */
addToCart.addEventListener("click", () => {
  const addProduct = {    
    color: document.getElementById("colors").value,
    quantity: document.getElementById("quantity").value,
    id: id
  };
  alert("Your item has been added to the cart! When you are ready to purchase your order, click on the Cart tab above.");

/**
 * Store the selected product with its details to the local storage.
 * @param {Object} addProduct - The object representing the selected product with its details.
 * @param {string} addProduct.quantity - The quantity of the selected product.
 * @param {string} addProduct.color - The color of the selected product.
 * @param {string} addProduct.id - The unique ID of the selected product.
 * Checks if the local storage contains the key "addToCart".
 * If it does, parse its value to an array and assigns it to the addProductLocalStorage variable.
 * If it does not, assigns an empty array to addProductLocalStorage.
 * Then, adds the current product (addProduct) to addProductLocalStorage array.
 * Finally, updates the "addToCart" key in local storage with the updated addProductLocalStorage array.
 */
  let addProductLocalStorage = [];
  if (localStorage.getItem("addToCart") !== null) {
    // If the key "addToCart" exists in local storage, parse the value to an array and assign it to addProductLocalStorage.
    addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart"));
    // Add the current product (addProduct) to addProductLocalStorage array.
    addProductLocalStorage.push(addProduct);
    // Update the "addToCart" key in local storage with the updated addProductLocalStorage array.
    localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));
  } else {
    // If the key "addToCart" does not exist in local storage, assign an empty array to addProductLocalStorage.
    addProductLocalStorage.push(addProduct);
    // Update the "addToCart" key in local storage with the updated addProductLocalStorage array.
    localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));
  }
});

getArticle();
