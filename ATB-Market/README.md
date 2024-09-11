# Absolutely not real ATB website

This is a fake website for the ATB Store. It is a simple e-commerce web application that allows users to browse products, add them to a cart, and proceed to checkout. The application uses JavaScript for client-side functionality and fetches product data from a JSON file.

## Features
- User-friendly interface.
- Responsive design.
- Nice product cards.
- Display products with images, descriptions, and prices.
- Add products to the cart.
- View and update the cart.
- Checkout with a contact form.
- Responsive design with a hamburger menu for navigation.
- Feedback form that doesn't take feedbacks.
- You can find an  egg.

## Requirements

- Web browser
- Localhost server (optional)

### Installation

#### Web Browser

I don't want to teach you how install a web browser. How you even got here without one?

#### Localhost Server

Ask Google...

Ok, you don't really need a local host server to run this project. Without a server, the problem may be that it cannot connect the data, but don't worry about this because the data will be taken from GitHub pages instead of the local file.

## Usage

### Clone the Repository

#### Using Git

1. Clone the repository:
    ```sh
    git clone https://github.com/DanyilT/WebDev.git
    ```

2. Navigate to the project folder:
    - For Windows:
         ```sh
         cd WebDev\ATB-Market
         ```
    - For macOS and Linux:
         ```sh
         cd WebDev/ATB-Market
         ```

#### Downloading the ZIP File

1. Download the ZIP file from the [GitHub repository](https://github.com/DanyilT/WebDev.git) and extract it.
2. Navigate to the project folder in the extracted directory (`WebDev/ATB-Market`).

### Running the Project

#### Using a Localhost Server

- Example for Python 3:
    - Install Python 3 if you haven't already from the [official website](https://www.python.org/).
    - Navigate to the project folder in terminal. Run the following command (ensure that you are running the command in the project folder terminal):
    - **Windows**:
        ```sh
        python -m http.server
        ```
    - **macOS / Linux**:
        ```sh
        python3 -m http.server
        ```

- Open your web browser and go to [`http://localhost:8000`](http://localhost:8000).

#### Opening the `index.html` File in a Web Browser

- Double-click the `index.html` file to open it in your web browser.

#### Using GitHub Pages

- Go to the [ATB Market website](https://danyilt.github.io/WebDev/ATB-Market/).

## File Structure
- `design/figma.png`: The Figma design for the website.
- `data/products.json`: The JSON file containing product data.
- `images/`: Directory containing product images.
    - `logo.png`: The logo image for the website. All rights for logo image belong to [ATB](https://www.atbmarket.com/).
    - `products/..`: Directory containing product images.
- `scripts/`: Directory containing JavaScript files.
    - `script.js`: Main JavaScript file.
    - `gallery.js`: The JavaScript file for gallery functionality.
- `css/`: Directory containing CSS files.
    - `style.css`: Main CSS file.
    - `products.css`: The CSS file for product cards.
    - `gallery.css`: The CSS file for gallery styling.
- `pages/`: Directory containing HTML files for different pages.
    - `products.html`: The products page.
    - `gallery.html`: The gallery page.
- `index.html`: The main HTML file. The home page.
- `README.md`: You are reading it right now.

### Dependencies

- jQuery: `https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js`
- Gallery:
    - Style: `https://raw.githack.com/SochavaAG/example-mycode/master/pens/slick-slider/plugins/slick/slick.css`
    - Script: `https://raw.githack.com/SochavaAG/example-mycode/master/pens/slick-slider/plugins/slick/slick.min.js`
