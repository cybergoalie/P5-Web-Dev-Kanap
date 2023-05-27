// Retrieve order details from the server
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderID');

// Display the order ID on the confirmation page
document.getElementById('orderId').innerText = orderId;

