document.addEventListener('DOMContentLoaded', () => {
  initPage();
  initLocationModal();
  initChatModal();
  initAccountModal();
  initLoginForm();
  initSignupForm();
  initFormToggle();
  const menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach(button => {
      button.addEventListener('click', () => {
          const page = button.getAttribute('data-page');
          const modal = button.getAttribute('data-modal');

          if (page) {
              // Implement your page navigation logic here
          }

          if (modal) {
              // Implement your modal window logic here
          }
      });
  });
});

function initPage() {
  const currentPage = document.location.pathname.split('/').pop();

  if (currentPage === 'index.html' || currentPage === '') {
      // Initialize the modal windows for the main page
      carousel();
  } else if (currentPage === 'assortiment.html') {
      // Initialize the modal windows for the assortment page
      initOrderModal(); 
  }
}

function carousel() {
  const carouselInner = document.querySelector('.carousel-inner');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  let activeIndex = 0;

  function goToItem(index) {
      carouselItems[activeIndex].classList.remove('active');
      activeIndex = index;
      carouselItems[activeIndex].classList.add('active');
  }

  function goToNextItem() {
      const nextIndex = (activeIndex + 1) % carouselItems.length;
      goToItem(nextIndex);
  }

  function goToPrevItem() {
      const prevIndex = (activeIndex - 1 + carouselItems.length) % carouselItems.length;
      goToItem(prevIndex);
  }

  nextBtn.addEventListener('click', goToNextItem);
  prevBtn.addEventListener('click', goToPrevItem);

  setInterval(goToNextItem, 3200);
}

function initOrderModal() {
  const orderModal = document.getElementById('order-modal');
  const orderModalClose = document.getElementById('order-modal-close');
  const productNameElement = document.getElementById('order-product-name');
  const productImageElement = document.getElementById('order-product-image');
  const productDescriptionElement = document.getElementById('order-product-description');
  const productPriceElement = document.getElementById('order-product-price');
  const orderSizeElement = document.getElementById('order-size');
  const orderPortionElement = document.getElementById('order-portion');
  const placeOrderButton = document.getElementById('place-order-btn');
  const productItems = document.querySelectorAll('.product-item');

  productItems.forEach((item) => {
      item.addEventListener('click', () => {
          const name = item.getAttribute('data-name');
          const description = item.getAttribute('data-description');
          const price = item.getAttribute('data-price');
          const image = item.getAttribute('data-image');

          productNameElement.textContent = name;
          productImageElement.src = image;
          productImageElement.alt = name;
          productDescriptionElement.textContent = description;
          productPriceElement.textContent = `Price: ${price}`;

          orderModal.style.display = 'block';

          const basePrice = parseFloat(price.slice(1));
          orderSizeElement.addEventListener('change', updatePrice);
          orderPortionElement.addEventListener('input', updatePrice);
          
          function updatePrice() {
            const sizeMultiplier = parseFloat(orderSizeElement.value);
            const portions = parseInt(orderPortionElement.value, 10);
            const newSizePrice = basePrice * sizeMultiplier * portions;
            productPriceElement.textContent = `Price: $${newSizePrice.toFixed(2)}`;
          }
          updatePrice(); // Call this once to initialize the price display
      });
  });

  orderModalClose.addEventListener('click', () => {
      orderModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === orderModal) {
          orderModal.style.display = 'none';
      }
  });
}

function initLocationModal() {
  const locationModal = document.getElementById('location-modal');
  const locationBtn = document.querySelector('[data-modal="location"]');
  const closeBtn = document.querySelector('.close');

  locationBtn.addEventListener('click', () => {
      locationModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
      locationModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === locationModal) {
          locationModal.style.display = 'none';
      }
  });
}

function initChatModal() {
  const chatModal = document.getElementById('chat-modal');
  const chatBtn = document.querySelector('[data-modal="chat"]');
  const closeBtn = chatModal.querySelector('.close');

  chatBtn.addEventListener('click', () => {
      chatModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
      chatModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === chatModal) {
          chatModal.style.display = 'none';
      }
  });
}

function initAccountModal() {
  const accountModal = document.getElementById('account-modal');
  const accountBtn = document.querySelector('[data-modal="account"]');
  const closeBtn = accountModal.querySelector('.close');

  accountBtn.addEventListener('click', () => {
      accountModal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
      accountModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === accountModal) {
          accountModal.style.display = 'none';
      }
  });
}

function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Handle the login form submission here
  });
}

function initSignupForm() {
  const signupForm = document.getElementById('signup-form');
  signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Handle the signup form submission here
  });
}

function initFormToggle() {
  const toggleFormsBtn = document.getElementById('toggle-forms-btn');
  const loginFormContainer = document.getElementById('login-form-container');
  const signupFormContainer = document.getElementById('signup-form-container');

  let showingLoginForm = true;
  toggleFormsBtn.textContent = "Don't have an account? Sign Up";
  loginFormContainer.style.display = 'block';
  signupFormContainer.style.display = 'none';

  toggleFormsBtn.addEventListener('click', () => {
      showingLoginForm = !showingLoginForm;
      if (showingLoginForm) {
          toggleFormsBtn.textContent = "Don't have an account? Sign Up";
          loginFormContainer.style.display = 'block';
          signupFormContainer.style.display = 'none';
      } else {
          toggleFormsBtn.textContent = 'Already have an account? Log In';
          loginFormContainer.style.display = 'none';
          signupFormContainer.style.display = 'block';
      }
  });
}
