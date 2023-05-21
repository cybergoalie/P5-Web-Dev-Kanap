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
const firstNameInput = document.getElementById('firstName');
const firstNameRegex = /^[a-zA-Z ]{2,30}$/;
const firstNameErrorMessage = 'Please enter a valid first name (2-30 alphabetic characters)';
firstNameInput.addEventListener("change", (event) => {
    validateInput(firstNameInput, firstNameRegex, firstNameErrorMessage);
});

// Validate and style the last name input
const lastNameInput = document.getElementById('lastName');
const lastNameRegex = /^[a-zA-Z ]{2,30}$/;
const lastNameErrorMessage = 'Please enter a valid last name (2-30 alphabetic characters)';
lastNameInput.addEventListener("change", (event) => {
    validateInput(lastNameInput, lastNameRegex, lastNameErrorMessage);
});

// Validate and style the address input
const addressInput = document.getElementById('address');
const addressRegex = /^[a-zA-Z0-9 ]{5,50}$/;
const addressErrorMessage = 'Please enter a valid address (5-50 alphanumeric characters)';
addressInput.addEventListener("change", (event) => {
    validateInput(addressInput, addressRegex, addressErrorMessage);
});

// Validate and style the city input
const cityInput = document.getElementById('city');
const cityRegex = /^[a-zA-Z ]{2,30}$/;
const cityErrorMessage = 'Please enter a valid city name (2-30 alphabetic characters)';
cityInput.addEventListener("change", (event) => {
    validateInput(cityInput, cityRegex, cityErrorMessage);
});

// Validate and style the email input
const emailInput = document.getElementById('email');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailErrorMessage = 'Please enter a valid email address in the format "example@domain.com"';
emailInput.addEventListener("change", (event) => {
    validateInput(emailInput, emailRegex, emailErrorMessage);
});

// Add an event listener to the form submission
document.querySelector('.cart__order__form').addEventListener('submit', function (event) {
    //Prevent the default form submission behavior
    event.preventDefault();

    // Get the contact information from the form inputs
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;

    // Create an object to store the contact information
    const contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    };

    // Retrieve cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('addToCart')); // Retrieve cart items from localStorage
   
    // Generate a unique order ID 
    const orderId = generateOrderId();

    // Create the order object
    const order = {
        orderId: orderId,
        contact: contact,
        items: cartItems
    };

    // Send the form data to the server
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .then((data) => {
            // Order successfully submitted
            console.log('Order submitted:', data);
            // Clear the cart items from localStorage
            localStorage.removeItem('addToCart');


            // Handle the response data
            const orderID = data.orderId; // Use the actual order ID returned from the server
            localStorage.setItem("orderID", orderID);

            // Show confirmation message and redirect
            const confirmationMessage = "Your order has been successfully submitted!";
            window.location.href = `./confirmation.html?orderID=${orderID}&message=${confirmationMessage}`;
        })
        .catch((error) => {
            // Error submitting the order
            console.error('There was an error submitting the order', error);
            // Show error message
            alert('Error submitting order. Please try again.');
        });
});

// Function to generate a unique order ID
function generateOrderId() {
    //Generate a random number and append a timestamp to it
    const randomNum = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();
    return 'ORDER${randomNum}${timestamp}';
}
