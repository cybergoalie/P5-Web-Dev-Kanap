/**
 * Creates a constant that holds the URL of the API endpoint to fetch product data from.
 * @type {string}
 */
const url = "http://localhost:3000/api/products/"
/**
 * The container element in the DOM to render the product data into.
 * @type {HTMLElement}
 */
const container = document.getElementById("items")
/**
 * Fetches the product data from the API endpoint and renders it to the DOM.
 * @function
 */
const getArticles = () => {
    fetch(url)
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
       /**
       * Iterates over each product in the product data and renders it to the DOM.
       * @param {Object} product - The product data.
       * @param {string} product._id - The unique identifier of the product.
       * @param {string} product.imageUrl - The URL of the image for the product.
       * @param {string} product.altTxt - The alternate text for the image.
       * @param {string} product.name - The name of the product.
       * @param {string} product.description - The description of the product.
       */
      console.log(data); 
        for (const product of data) {
          //Appends the specified string of HTML to the end of the contents of the given container element
          container.innerHTML += `
            <a href="./product.html?id=${product._id}">
              <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
              </article>
            </a>`;
        }
    })
}

getArticles();