/**
 * Represents the parameters of the URL.
 * @type {URLSearchParams}
 */
const params = new URL(document.location).searchParams;

/**
 * The ID of the product.
 * @type {string}
 */
const id = params.get("id");

/**
 * The URL of the product API endpoint.
 * @type {string}
 */
const url = `http://localhost:3000/api/products/${id}`;

/**
 * The container element for the product details.
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
        const addTitle = (document.getElementById("title").innerHTML=data.name)
        const addPrice = (document.getElementById("price").innerHTML=data.price)
        const addImg = document.createElement("img")
        document.querySelector(".item__img").appendChild(addImg)
        addImg.setAttribute("src", `${data.imageUrl}`)

        const addDescription = (document.getElementById("description").innerHTML = data.description)
        const addOption = document.getElementById("colors")
        for (color in data.colors) {
            addOption.innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
        }
    })
}

/**
 * The "Add to Cart" button element.
 * @type {HTMLElement}
 */
const addToCart = document.getElementById("addToCart");

addToCart.addEventListener("click", () => {
    /**
     * The product to be added to the shopping cart.
     * @type {{quantity: string, color: string, id: string}}
     */
    const addProduct = {
        quantity: document.getElementById("quantity").value,
        color: document.getElementById("colors").value,
        id: id
    };

    /**
     * The array of products in the shopping cart.
     * @type {Array<{quantity: string, color: string, id: string}>}
     */
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
