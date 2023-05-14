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
    fetch(url)
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        console.log(data); 
        //const addTitle = (document.getElementById("title").innerHTML=data.name) = the following two lines are the correct way to convey this expression, initiating then manipulating the dom object; repeat with 47
        const addTitle = document.getElementById("title")
        addTitle.innerHTML=data.name
        //const addPrice = (document.getElementById("price").innerHTML=data.price) better to use the following
        document.getElementById("price").innerHTML=data.price
        const addImg = document.createElement("img")
        document.querySelector(".item__img").appendChild(addImg)
        addImg.setAttribute("src", `${data.imageUrl}`)


        document.getElementById("description").innerHTML = data.description
        const addOption = document.getElementById("colors")
        for (color in data.colors) {
            addOption.innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
        }
    })
}

const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  const addProduct = {
    quantity: document.getElementById("quantity").value,
    color: document.getElementById("colors").value,
    id: id
  };

  let addProductLocalStorage = [];
  if (localStorage.getItem("addToCart") !== null) {
    addProductLocalStorage = JSON.parse(localStorage.getItem("addToCart"));
    addProductLocalStorage.push(addProduct);
    localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));
  } else {
    addProductLocalStorage.push(addProduct);
    localStorage.setItem("addToCart", JSON.stringify(addProductLocalStorage));
  }
});

getArticle();
