// Define the contact object with references to each input element
const contact = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    address: document.getElementById('address'),
    city: document.getElementById('city'),
    email: document.getElementById('email'),
};

// Validate and style the input fields
function validateInput(input, regex, errorMessage) {
    if (input.value.match(regex)) {
        input.style.backgroundColor = 'lightgreen';
        input.style.borderColor = '#ccc';
        input.setCustomValidity('');
    } else {
        input.style.backgroundColor = 'pink';
        input.style.borderColor = 'red';
        input.setCustomValidity(errorMessage);
    }
}
// Validate and style the first name input 
const firstNameInput = contact.firstName;
const firstNameRegex = /^[a-zA-Z ]{2,30}$/;
const firstNameErrorMessage = 'Please enter a valid first name (2-30 alphabetic characters)';
contact.firstName.addEventListener("change", (event) => {
    validateInput(firstNameInput, firstNameRegex, firstNameErrorMessage);
});

// Validate and style the last name input
const lastNameInput = contact.lastName;
const lastNameRegex = /^[a-zA-Z ]{2,30}$/;
const lastNameErrorMessage = 'Please enter a valid last name (2-30 alphabetic characters)';
contact.lastName.addEventListener("change", (event) => {
    validateInput(lastNameInput, lastNameRegex, lastNameErrorMessage);
});

// Validate and style the address input
const addressInput = contact.address;
const addressRegex = /^[a-zA-Z0-9 ]{5,50}$/;
const addressErrorMessage = 'Please enter a valid address (5-50 alphanumeric characters)';
contact.address.addEventListener("change", (event) => {
    validateInput(addressInput, addressRegex, addressErrorMessage);
});

// Validate and style the city input
const cityInput = contact.city;
const cityRegex = /^[a-zA-Z ]{2,30}$/;
const cityErrorMessage = 'Please enter a valid city name (2-30 alphabetic characters)';
contact.city.addEventListener("change", (event) => {
    validateInput(cityInput, cityRegex, cityErrorMessage);
});

// Validate and style the email input
const emailInput = contact.email;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailErrorMessage = 'Please enter a valid email address in the format "example@domain.com"';
contact.email.addEventListener("change", (event) => {
    validateInput(emailInput, emailRegex, emailErrorMessage);
});

// FOLLOWING IS A FUNCTION TO CREATE THE ORDER FORM, (A SIMPLE APPROACH THAT ASSUMES THERE ARE NO OTHER ELEMENTS THAT MIGHT INTERFERE WITH THE PLACEMENT OR STYLING OF THE FORM, appending it directly below the body):

// const orderForm = document.createElement('form');
// orderForm.id = 'orderForm';
// orderForm.method = 'POST';
// orderForm.action = '/submit-order';
// orderForm.noValidate = true;
// orderForm.classList.add('contact__order__form');
// document.body.appendChild(orderForm); 
// formData.append("contact",contact);
// formData.append("product",products.map((p) => p.id));

// OR BY USING THE FOLLOWING FUNCTION, WHICH LET'S YOU PLACE THE FORM INSIDE OF A CONTAINER ELEMENT:

// const orderForm = document.createElement('form');
// orderForm.id = 'orderForm';
// orderForm.method = 'POST';
// orderForm.action = '/submit-order';
// orderForm.noValidate = true;
// const contactOrderForm = document.querySelector('.contact__order__form');
// contactOrderForm.appendChild(orderForm);
// formData.append("contact",contact);
// formData.append("product",products.map((p) => p.id));

// OR the method below creates a new formData object and appends the form data to it manually; this gives you more control over what data is included and how it is formatted, but requires more code to be written:
// Create a new FormData object and populate it with the form data from orderForm

// PART 2: DEFINITION OF THE ORDER FORM AND FORM SUBMISSION
const orderForm = document.getElementsByClassName("cart__order__form")[0];
orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    //Get form input values
    const formData = new FormData(orderForm);
    console.log(formData);
    console.log(formData.get('firstName'));
    console.log(formData.get('lastName'));
    console.log(formData.get('address'));
    console.log(formData.get('city'));
    console.log(formData.get('email'));

    // Send the form data to the server
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok");
            }
        })

        // Generate a unique order ID, Store the order ID in the browser's local storage, Redirect to the confirmation page
        .then(data => {
            // Generate a unique order ID
            const orderID = Math.floor(Math.random() * 10000000000);
            // Store the order ID in the browser's local storage
            localStorage.setItem("orderID", orderID);

            const confirmationMessage = "Your order has been successfully submitted!";
            window.location.href = `./confirmation.html?orderID=${orderID}&message=${confirmationMessage}`;
        })
        .catch(error => {
            console.error("There was an error submitting the order", error);
            alert("Error submitting order");
        });
});