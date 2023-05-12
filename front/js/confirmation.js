// Retrieve the order ID from the browser's local storage
const orderID = localStorage.getItem('orderID');

// Display the order ID on the confirmation page
document.getElementById('orderId').innerText = orderID;

// Get the order details from the server
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

fetch(`http://localhost:3000/api/orders/${orderId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    // Display the order details on the confirmation page
    document.getElementById('firstName').innerText = data.contact.firstName;
    document.getElementById('lastName').innerText = data.contact.lastName;
    document.getElementById('address').innerText = `${data.contact.address}, ${data.contact.city}`;
    document.getElementById('email').innerText = data.contact.email;
    document.getElementById('orderId').innerText = data.orderId;
    document.getElementById('totalPrice').innerText = `${data.products.reduce((acc, cur) => acc + cur.price, 0) / 100} €`;
  })
  .catch((error) => {
    console.error('There was an error fetching the order details', error);
  });
