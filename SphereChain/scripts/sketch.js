let blockchain = [];
let blockchainLen = 0;

// Block class to represent each block in the blockchain
class Block {
    constructor(index, x, y, z) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Method to display the block as a sphere
    show() {
        push(); // Save the current drawing style settings and transformations
        translate(this.x, this.y, this.z); // Translate to the position of the block
        fill('#f3f3f3'); // Set the fill color
        sphere(25, 24, 16); // Draw a sphere with radius 25, with x polygons 24 and y polygons 16
        pop(); // Restore the previous drawing style settings and transformations
    }
}

let slider;
let useSlider = true;
let showLines = true;
let show100Blocks = false;

let rotation = 0;
let autoRotate = true;
let rotationX = 0;
let rotationY = 0;
let canvasMousePressed = false;

let rotateAroundSelf = false;

// p5.js setup function, called once when the program starts
function setup() {
    // Create a canvas with WEBGL renderer
    let canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.8, WEBGL);

    // Set border radius of the canvas
    canvas.elt.style.borderRadius = '10px';

    // Attach the canvas to the 'canvas-holder' div
    canvas.parent('canvas-holder');

    // Add the first block to the blockchain
    blockchain.push(new Block(blockchainLen, 0, 0, 0));
    blockchainLen++;

    // Mouse press and release event handlers for the canvas
    canvas.mousePressed(() => canvasMousePressed = true);
    canvas.mouseReleased(() => canvasMousePressed = false);

    // Create slider for adjusting the number of blocks
    slider = createSlider(1, 100, blockchain.length);
    slider.input(() => { useSlider = true; }); // Set useSlider to true when the slider is used
    slider.parent('slider-holder');

    // Create a button for adding a block
    let addButton = createButton('Add Block');
    addButton.mousePressed(() => { addBlock(); useSlider = false; }); // Set useSlider to false when the button is used
    addButton.parent('button-holder');

    // Create a button for toggling lines
    let toggleButton = createButton('Toggle Lines');
    toggleButton.mousePressed(toggleLines);
    toggleButton.parent('button-holder');

    // Create a button for adding/removing 100 blocks
    let add100Button = createButton('100 Blocks');
    add100Button.mousePressed(addMultipleBlocks);
    add100Button.parent('button-holder');

    // Add a button to enter full-screen mode
    let fullscreenButton = createButton('Full Screen');
    fullscreenButton.mousePressed(enterFullscreen);
    fullscreenButton.parent('button-holder');

    // Add a button to exit full-screen mode
    let exitButton = createButton('Exit Full Screen');
    exitButton.id('exit-fullscreen-button');
    exitButton.mousePressed(exitFullscreen);
    exitButton.parent('button-holder');
    exitButton.hide(); // Hide this button initially
}

// p5.js function to handle window resizing
function windowResized() {
    resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
}

// Function to toggle the visibility of lines between blocks
function toggleLines() {
    showLines = !showLines;
}

// Function to add or remove 100 blocks
function addMultipleBlocks() {
    show100Blocks = !show100Blocks;
    if (show100Blocks) {
        for (let i = 0; i < 100; i++) {
            addBlock();
        }
    } else {
        for (let i = 0; i < 100; i++) {
            blockchain.pop();
            blockchainLen--;
        }
    }
    slider.value(blockchainLen); // Update the slider when blocks are added/removed
}

// Function to enter full-screen mode
function enterFullscreen() {
    // Hide all buttons except the exit full-screen button
    selectAll('button').forEach((button) => {
        if (button.html() !== 'Exit Full Screen') {
            button.hide();
        } else {
            button.show();
        }
    });
    // Hide the text
    select('h1').hide();
    slider.hide();

    // Change the canvas size to fill the entire screen
    resizeCanvas(windowWidth, windowHeight);

    // Add the "fullscreen" class and remove the "centered" class
    select('body').addClass('fullscreen').removeClass('centered');
}

// Function to exit full-screen mode
function exitFullscreen() {
    // Show all buttons except exit full screen
    selectAll('button').forEach((button) => {
        if (button.html() !== 'Exit Full Screen') {
            button.show();
        } else {
            button.hide();
        }
    });
    // Show the text
    select('h1').show();
    slider.show();

    // Change the canvas size back to the original size
    resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);

    // Add the "centered" class and remove the "fullscreen" class
    select('body').addClass('centered').removeClass('fullscreen');
}

// p5.js draw function, called continuously to render the canvas
function draw() {
    background(50);

    // Handle mouse dragging for rotation
    if (canvasMousePressed) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        rotationX -= dy * 0.01;
        rotationY += dx * 0.01;
        autoRotate = false;
    } else if (!autoRotate && !mouseIsPressed) {
        autoRotate = true;
    }

    // Auto rotation logic
    if (autoRotate) {
        rotationY += 0.01; // Increase rotation for the next frame
    }

    // Apply rotations
    rotateX(rotationX);
    rotateY(rotationY);

    // Adjust the number of blocks based on the slider value
    if (useSlider) {
        let desiredBlocks = slider.value();
        while (blockchain.length < desiredBlocks) {
            addBlock();
        }
        while (blockchain.length > desiredBlocks) {
            blockchain.pop();
            blockchainLen--;
        }
    }

    // Draw lines between blocks if showLines is true
    if (showLines) {
        for (let i = 0; i < blockchain.length - 1; i++) {
            let block1 = blockchain[i];
            let block2 = blockchain[i + 1];

            // Calculate distance from viewer to the middle point of the line
            let middle = createVector((block1.x + block2.x) / 2, (block1.y + block2.y) / 2, (block1.z + block2.z) / 2);
            let distFromViewer = dist(0, 0, 0, middle.x, middle.y, middle.z);

            // Calculate line color based on distance
            let maxDist = sqrt(sq(width / 2) + sq(height / 2) + sq(500)); // Max possible distance
            let colorValue = map(distFromViewer, 0, maxDist, 255, 0); // Map distance to color value

            // Draw border (thicker and darker line)
            push();
            stroke(colorValue, 125); // White color for the border
            strokeWeight(3); // Thicker line for the border
            line(block1.x, block1.y, block1.z, block2.x, block2.y, block2.z);
            pop();

            // Draw chain (thinner and brighter line)
            push();
            stroke(51, 51, 51, 125); // Gray color for the chain
            strokeWeight(2); // Thinner line for the chain
            line(block1.x, block1.y, block1.z, block2.x, block2.y, block2.z);
            pop();
        }
    }

    // Draw each block in the blockchain
    for (let i = 0; i < blockchain.length; i++) {
        blockchain[i].show();
    }
}

// Function to add a new block to the blockchain
function addBlock(blocks = 1, maxAttempts = 1000) {
    for (let i = 0; i < blocks; i++) {
        for (let i = 0; i < maxAttempts; i++) {
            let x = random(-width / 2, width / 2);
            let y = random(-height / 2, height / 2);
            let z = random(-500, 500);
            let validPosition = true;
            for (let block of blockchain) {
                if (dist(x, y, z, block.x, block.y, block.z) < 50) {
                    validPosition = false;
                    break;
                }
            }
            if (validPosition) {
                blockchain.push(new Block(blockchainLen, x, y, z));
                blockchainLen++;
                slider.value(blockchainLen);
                break;
            }
        }
    }
}

// Function to handle key presses, used to add a block with the space bar
function keyPressed() {
    if (keyCode === 32) {
        addBlock();
    }
}

// Function to add a block at a specific position (used for testing, can use via console)
function addBlockAt(x, y, z) {
    blockchain.push(new Block(blockchainLen, x, y, z));
    blockchainLen++;
    slider.value(blockchainLen);
}
