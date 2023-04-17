const url = "http://localhost:3000/api/products/"
const container = document.getElementById("items")


const getArticles = () => {
    fetch(url)
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        // for(index in data) {
        //     const product=data[index];
        //     console.log(product);
        //   container.innerHTML += `<a href="./product.html?id=42">
        //   <article>
        //     <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
        //     <h3 class="productName">${product.name}</h3>
        //     <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        //   </article>
        // </a>`;
        // }
        // or the following method, utilizing a different style of 'dynamic interpolation using the `` symbol to encapsulate several lines of a single string concatenated'... 
        for(product in data) {
            console.log(data);
          container.innerHTML += `<a href="./product.html?id=42">
          <article>
            <img src="${data[product].imageUrl}" alt="${data[product].altTxt}">
            <h3 class="productName">${data[product].name}</h3>
            <p class="productDescription">${data[product].description}</p>
          </article>
        </a>`;
        }
    })
}


getArticles()

// localStorage.setItem("lastname", "Smith");
// localStorage.getItem("lastname");