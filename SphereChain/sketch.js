let blockchain = [];
let blockchainLen = 0;

class Block {
    constructor(index, x, y, z) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    show() {
        push(); // saves the current drawing style settings and transformations
        translate(this.x, this.y, this.z); // translate to the position of the block
        fill('#f3f3f3');
        sphere(25, 24, 16); // draw a sphere with radius 25, with x polygons 24 and y polygons 16
        pop(); // restores the previous drawing style settings and transformations
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

function setup() {
    let canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.8, WEBGL); // Set width to 80% of window width; using WEBGL renderer
    
    // Set border radius of the canvas
    canvas.elt.style.borderRadius = '10px';
    
    canvas.parent('canvas-holder');
    blockchain.push(new Block(blockchainLen, 0, 0, 0));
    blockchainLen++;

    // Mouse press and release event handlers for the canvas
    canvas.mousePressed(() => canvasMousePressed = true);
    canvas.mouseReleased(() => canvasMousePressed = false);

    // Create slider
    slider = createSlider(1, 100, blockchain.length);
    slider.input(() => { useSlider = true; });  // Sets useSlider to true when the slider is used
    slider.parent('slider-holder');

    // Create a button for adding a block
    let addButton = createButton('Add Block');
    addButton.mousePressed(() => { addBlock(); useSlider = false; });  // Sets useSlider to false when the button is used
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
    exitButton.hide();  // Hide this button initially
}

function windowResized() {
    resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
}

function toggleLines() {
    showLines = !showLines; // Flip the value of showLines
}

function addMultipleBlocks() {
    show100Blocks = !show100Blocks;  // Toggle the flag
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
    slider.value(blockchainLen);  // Update the slider when blocks are added/removed
}

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

function draw() {
    background(50);

    if (canvasMousePressed) {
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        rotationX -= dy * 0.01;
        rotationY += dx * 0.01;
        autoRotate = false; // Stop auto rotation
    } else if (!autoRotate && !mouseIsPressed) {
        // Resume auto rotation when the mouse is released after dragging
        autoRotate = true;
    }

    if (autoRotate) {
        // Increase rotation for the next frame
        rotationY += 0.01;
    }

    rotateX(rotationX);
    rotateY(rotationY);

    // Slider
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

    if (showLines) {
        // Draw chains
        for (let i = 0; i < blockchain.length - 1; i++) {
            let block1 = blockchain[i];
            let block2 = blockchain[i + 1];

            // Calculate distance from viewer to the middle point of the line
            let middle = createVector((block1.x + block2.x) / 2, (block1.y + block2.y) / 2, (block1.z + block2.z) / 2);
            let distFromViewer = dist(0, 0, 0, middle.x, middle.y, middle.z);

            // Calculate line color based on distance
            let maxDist = sqrt(sq(width / 2) + sq(height / 2) + sq(500)); // max possible distance
            let colorValue = map(distFromViewer, 0, maxDist, 255, 0); // map distance to color value


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

    // Draw blocks
    for (let i = 0; i < blockchain.length; i++) {
        blockchain[i].show();
    }
}

function addBlock() {
    let maxAttempts = 1000; // Limit the number of attempts to find a valid position
    for (let i = 0; i < maxAttempts; i++) {
        let x = random(-width/2, width/2);
        let y = random(-height/2, height/2);
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
