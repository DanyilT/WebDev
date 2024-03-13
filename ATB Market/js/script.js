let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    // Opening the cart popup
    var btnCart = document.getElementById("cart-popup-button");
    var modalCart = document.getElementById("cart-popup");
    var modalContact = document.getElementById("contact-popup");
    var closeCart = document.getElementsByClassName("close-cart")[0];
    var closeContact = document.getElementsByClassName("close-contact")[0];

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');

    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    btnCart.onclick = function() {
        modalCart.style.display = "block";
        updateCartDisplay();
    }
    
    closeCart.onclick = function() {
        modalCart.style.display = "none";
    }

    closeContact.onclick = function() {
        modalContact.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modalCart) {
            modalCart.style.display = "none";
        }
    }

    document.getElementById("contact-popup").onclick = function(event) {
        if (event.target == modalContact) {
            modalContact.style.display = "none";
        }
    }

    // Load cart from localStorage if it exists
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartDisplay();
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));
            const productImgSrc = this.getAttribute('data-product-img-src');
    
            // Hide the 'Add to Cart' button and show the 'View Cart' button
            this.style.display = 'none';
            this.nextElementSibling.style.display = 'inline-block';
    
            // Add the product to the cart (simplified logic)
            const cartItem = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                imgSrc: productImgSrc
            };
            
            addToCart(cartItem);
            updateCartDisplay();
        });
    });

    $(document).ready(function() {
        // Form submission with validation
        $('#contact-form').submit(function(event) {
            event.preventDefault();
    
            var name = $('#name').val();
            var email = $('#email').val();
            var address = $('#address').val();
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
            // Basic validation checks
            if (name === '' || address === '' || !emailRegex.test(email)) {
                alert('Please ensure all fields are filled correctly.');
                return;
            }
    
            // Display thank you message
            alert('Thank you for your order');
            clearCart();
            $('#contact-popup').hide();
        });
    });
});

function updateCartDisplay() {
    const cartTableBody = document.querySelector('.cart-items tbody');
    cartTableBody.innerHTML = '';

    cart.forEach((item, index) => {
        const row = cartTableBody.insertRow();
        
        const cellImage = row.insertCell(0);
        cellImage.innerHTML = `<img src="${item.imgSrc}" alt="${item.name}" style="width:50px;"> ${item.name}`;

        const cellPrice = row.insertCell(1);
        cellPrice.textContent = `€${item.price}`;

        const cellQuantity = row.insertCell(2);
        cellQuantity.innerHTML = `<input type="number" value="${item.quantity}" min="0" class="cart-quantity" data-product-id="${item.id}">`;

        const cellTotal = row.insertCell(3);
        cellTotal.textContent = `€${(item.price * item.quantity).toFixed(2)}`;

        // Attach an event listener to the quantity input
        const quantityInput = cellQuantity.querySelector('input');
        quantityInput.addEventListener('change', (e) => {
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
                item.quantity = newQty;
            } else {
                // Remove item if quantity is less than or equal to 0
                cart.splice(index, 1);
            }
            // Save updated cart to localStorage and update display
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        });
    });

    // Update the overall total
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Calculate shipping
    const shippingCost = totalPrice > 50 ? 0 : 10;
    const grandTotal = totalPrice + shippingCost;

    // Display shipping cost with a tooltip
    const shippingDisplay = document.querySelector('.shipping-cost');
    shippingDisplay.innerHTML = `<b>Shipping:</b> €${shippingCost} <span class="tooltip-text">Free shipping above €50</span>`;
    
    // Show shipping info tooltip on hover
    shippingDisplay.title = "Free shipping for orders over €50";

    // Update total price display to include shipping
    document.querySelector('.total-price').innerHTML = `<b>Total:</b> €${grandTotal.toFixed(2)}`;
    
    if (cart.length === 0) {
        document.querySelector('.shipping-cost').textContent = ``;
        document.querySelector('.total-price').innerHTML = 'Cart is Empty';
        document.querySelector('.total-price').title = "Free shipping for orders over €50";
    }
}

function addToCart(item) {
    // Check if cart already has the item and update quantity if it does
    let itemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push(item);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function viewCart() {
    // Logic to display the cart popup
    document.getElementById('cart-popup').style.display = 'block';
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function openContactInfoModal() {
    if (cart.length === 0) {
        alert('Cart is Empty');
    } else {
        document.getElementById('cart-popup').style.display = 'none';
        document.getElementById('contact-popup').style.display = 'block';
    }
}
