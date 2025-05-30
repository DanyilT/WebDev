// Carartartar
let cart = [];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', ()=> {
    // Fetch and display products from 'products.json'
    fetch('../data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // If the fetch fails, try to load the products from products.json on a GitHub pages URL
        .catch(() => {
            return fetch('https://danyilt.github.io/WebDev/ATB-Market/data/products.json')
                .then(response => response.json());
        })
        .then(data => {
            displayProducts(data.products);
        })
        .catch(error => console.error('Error loading the products:', error));

    // Get references to various elements
    var btnCart = document.getElementById("cart-popup-button");
    var modalCart = document.getElementById("cart-popup");
    var modalContact = document.getElementById("contact-popup");
    var closeCart = document.getElementsByClassName("close-cart")[0];
    var closeContact = document.getElementsByClassName("close-contact")[0];

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');

    // Toggle navigation menu on hamburger click
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Open the cart popup
    btnCart.onclick = function() {
        modalCart.style.display = "block";
        updateCartDisplay();
    }

    // Close the cart popup
    closeCart.onclick = function() {
        modalCart.style.display = "none";
    }

    // Close the contact popup
    closeContact.onclick = function() {
        modalContact.style.display = "none";
    }

    // Close the cart popup when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modalCart) {
            modalCart.style.display = "none";
        }
    }

    // Close the contact popup when clicking outside of it
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

    // Form submission with validation
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

            if (name === 'qwerty') {
                alert('Really? It\'s not your name. \nWhy your name is a wonderful password? 🤔');
            }

            // Display thank you message and clear cart
            alert('Thank you for your order');
            clearCart();
            $('#contact-popup').hide();
        });
    });
});

// Display products on the page
function displayProducts(products) {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = ''; // Clear existing products (if any)

    products.forEach(product => {
        // Determine an emoji based on the product name
        let emoji = '';
        switch (product.name) {
            case 'Donut':
            case 'Bitten Donut':
                emoji = '🍩';
                break;
            case 'Coca-Cola':
                emoji = '🥤';
                break;
            case 'Candy':
            case 'Candy with liqueur':
                emoji = '🍬';
                break;
            case 'Cookies':
                emoji = '🍪';
                break;
            case 'Wafers':
                emoji = '🧇';
                break;
            case 'Mandarin':
                emoji = '🍊';
                break;
            case 'Pepper':
                emoji = '🌶️';
                break;
            case 'Water':
                emoji = '💧';
                break;
            case 'Coffee':
                emoji = '☕';
                break;
            case 'Buckwheat':
                emoji = '🌾';
                break;
            default:
                emoji = '🛍️';
        }

        // Create HTML card for each product
        const productHTML = `
            <div class="product-container">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="../${product.imageUrl}" alt="${product.name}">
                        <a href="${product.link}">${product.name}</a>
                        <span>&euro; ${product.price}</span>
                    </div>
                    <div class="flip-card-back">
                        <p>${emoji}<br>${product.description}</p>
                        <div class="price-container">
                            <button class="add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-img-src="${product.imageUrl}">Add to Cart</button>
                            <button class="view-cart-btn" style="display: none;" onclick="viewCart()">View Cart</button>
                            <a href="${product.link}">${product.name}</a>
                            <span>&euro; ${product.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });
    attachEventListenersToButtons();
}

// Function to attach event listeners to 'Add to Cart' buttons
function attachEventListenersToButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseFloat(this.getAttribute('data-product-price'));
            const productImgSrc = this.getAttribute('data-product-img-src');

            // Hide the 'Add to Cart' button and show the 'View Cart' button
            this.style.display = 'none';
            this.nextElementSibling.style.display = 'block';

            // Add the product to the cart
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
}

// Function to add an item to the cart
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

// Function to display the cart popup
function viewCart() {
    document.getElementById('cart-popup').style.display = 'block';
}

// Function to clear the cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Function to open the contact info modal
function openContactInfoModal() {
    if (cart.length === 0) {
        alert('Cart is Empty');
    } else {
        document.getElementById('cart-popup').style.display = 'none';
        document.getElementById('contact-popup').style.display = 'block';
    }
}

// Function to determine if the current page is the home page
function isHomePage() {
    return window.location.pathname.endsWith('index.html');
}

// Function to update the cart display
function updateCartDisplay() {
    const cartTableBody = document.querySelector('.cart-items tbody');
    cartTableBody.innerHTML = ''; // Clear existing cart items

    cart.forEach((item, index) => {
        // Adjust image URL based on the current page
        let imageUrl = isHomePage() ? item.imgSrc : `../${item.imgSrc}`;

        const row = cartTableBody.insertRow();

        const cellImage = row.insertCell(0);
        cellImage.innerHTML = `<img src="${imageUrl}" alt="${item.name}" style="width:50px;"> ${item.name}`;

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
