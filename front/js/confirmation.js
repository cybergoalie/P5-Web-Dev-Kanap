// Retrieve order details from the server
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderID');


document.addEventListener('DOMContentLoaded', function () {
    
    console.log('Order ID:', orderId); // Added console.log statement

    // Display the order ID on the confirmation page
    document.getElementById('orderId').innerText = orderId;

    // Scroll to the orderId section
    const orderIdSection = document.querySelector('#orderId');
    if (orderIdSection) {
        orderIdSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});
