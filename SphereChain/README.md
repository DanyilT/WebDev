# 3D Blockchain Visualization

Simple Blockchain Visualization in 3D using p5.js. Each block in the blockchain is represented as a sphere, and lines can be drawn between blocks to show their connections.

## Features

- **3D Visualization**: Blocks are displayed as spheres in a 3D space.
- **Interactive Controls**: Add, remove, and toggle blocks using buttons and sliders.
- **Full-Screen Mode**: Enter full-screen mode to immerse completely.
- **Rotation**: The blockchain rotates automatically, and can be manually rotated by dragging the mouse.
- **Responsive Design**: The canvas resizes with the window.
- You can find an ester egg.

## Installation

### Requirements

- Web browser
- Localhost server (optional) (you really don't need it)

#### Web Browser

I don't want to teach you how install a web browser. How you even got here without one?

Ask Google... Oh wait, you don't have a browser...

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
        cd WebDev\SphereChain
        ```
    - For macOS and Linux:
        ```sh
        cd WebDev/SphereChain
        ```

#### Downloading the ZIP File

1. Download the ZIP file from the [GitHub repository](https://github.com/DanyilT/WebDev.git) and extract it.
2. Navigate to the project folder in the extracted directory (`WebDev/SphereChain`).

### Running the Project

#### Using a Localhost Server

- Example for Python 3:
    - Install Python 3 if you haven't already from the [official website](https://www.python.org/).
    - Run localhost server `python -m http.server` or `python3 -m http.server` in the project folder terminal.
    - Open your web browser and go to [`http://localhost:8000`](http://localhost:8000).

#### Opening the `index.html` File in a Web Browser

- Double-click the `index.html` file to open it in your web browser.

#### Using GitHub Pages

- Go to the [ChillZone website](https://danyilt.github.io/WebDev/SphereChain/).

## File Structure

- `images/sphere.png`: Image of a sphere.
- `css/style.css`: The CSS file for styling.
- `scripts/`: Contains the JavaScript files.
    - `script.js`: Main JavaScript file
    - `sketch.js`: Main logic for the 3D visualization / p5.js sketch.
- `index.html`: The main HTML file. The home page.
- `README.md`: You are reading it right now.

### Dependencies

- p5.js: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js`
