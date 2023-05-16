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
fetch("http://localhost:3000/api/orders", {
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
  const orderID = Math.floor(Math.random() * 10000000000);
  localStorage.setItem('orderID', orderID);
  const confirmationMessage = "Your order has been successfully submitted!";
  window.location.href = `../html/confirmation.html?orderID=${orderID}&message=${confirmationMessage}`;
})
.catch(error => {
  console.error("There was an error submitting the order", error);
  alert("Error submitting order");
});



console.log(formData)

// Define the contact object with references to each input element
const contact = {
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  address: document.getElementById('address'),
  city: document.getElementById('city'),
  email: document.getElementById('email'),
};

// Validate and style the first name input 
const firstNameInput = contact.firstName;
if (formData.get('firstName').match(/^[a-zA-Z ]{2,30}$/)) {
  firstNameInput.style.backgroundColor = 'lightgreen';
  firstNameInput.style.borderColor = '#ccc';
} else {
  // If the input value does not match the regex, set the background color to pink and the border color to red
  firstNameInput.style.backgroundColor = 'pink';
  firstNameInput.style.borderColor = 'red';
  // Set the custom validity error message to explain the validation parameters
  firstNameInput.setCustomValidity('Please enter a valid first name (2-30 alphabetic characters)');
};

// Validate and style the last name input
const lastNameInput = contact.lastName;
if (formData.get('lastName').match(/^[a-zA-Z ]{2,30}$/)) {
  lastNameInput.style.backgroundColor = 'lightgreen';
  lastNameInput.style.borderColor = '#ccc';
} else {
  // If the input value does not match the regex, set the background color to pink and the border color to red
  lastNameInput.style.backgroundColor = 'pink';
  lastNameInput.style.borderColor = 'red';
  // Set the custom validity error message to explain the validation parameters
  lastNameInput.setCustomValidity('Please enter a valid last name (2-30 alphabetic characters)');
}

// Validate and style the address input
const addressInput = contact.address;
if (formData.get('address').match(/^[a-zA-Z0-9 ]{5,50}$/)) {
  addressInput.style.backgroundColor = 'lightgreen';
  addressInput.style.borderColor = '#ccc';
} else {
  // If the input value does not match the regex, set the background color to pink and the border color to red
  addressInput.style.backgroundColor = 'pink';
  addressInput.style.borderColor = 'red';
  // Set the custom validity error message to explain the validation parameters
  addressInput.setCustomValidity('Please enter a valid address (5-50 alphanumeric characters)');
}

// Validate and style the city input
const cityInput = contact.city;
if (formData.get('city').match(/^[a-zA-Z ]{2,30}$/)) {
  cityInput.style.backgroundColor = 'lightgreen';
  cityInput.style.borderColor = '#ccc';
} else {
  // If the input value does not match the regex, set the background color to pink and the border color to red
  cityInput.style.backgroundColor = 'pink';
  cityInput.style.borderColor = 'red';
  // Set the custom validity error message to explain the validation parameters
  cityInput.setCustomValidity('Please enter a valid city name (2-30 alphabetic characters)');
}

// Validate and style the email input
const emailInput = contact.email;
if (formData.get('email').match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  emailInput.style.backgroundColor = 'lightgreen';
  emailInput.style.borderColor = '#ccc';
  emailInput.setCustomValidity('');
} else {
  emailInput.style.backgroundColor = 'pink';
  emailInput.style.borderColor = 'red';
  emailInput.setCustomValidity('Please enter a valid email address in the format "example@domain.com"');
}