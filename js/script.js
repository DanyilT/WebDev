/**
 * js/script.js
 *
 * Enhances the page after the DOM is ready:
 * - Creates decorative dot grids inside elements with the `.speckled-photo` class.
 * - Loads the `.skills .items` fragment from `pages/about.html` into the current page.
 * - Adds a simple contact form submit guard for a special test value.
 *
 * All DOM mutations happen inside the DOMContentLoaded handler to ensure required
 * elements are present before manipulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Create a container element with a grid of dot elements.
     *
     * Each "line" is a row element containing multiple "dot" elements.
     *
     * @param {string} className - Class name to assign to the returned container
     * @param {number} lines - Number of rows to create inside the container
     * @param {number} dotsPerLine - Number of dot elements to create per row
     * @returns {HTMLDivElement} A div element containing the generated dot rows
     */
    function createDots(className, lines, dotsPerLine) {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add(className);

        // Create the requested number of rows
        for (let i = 0; i < lines; i++) {
            const line = document.createElement('div');
            line.classList.add('line');

            // Create the requested number of dots per row and append to the row
            for (let j = 0; j < dotsPerLine; j++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                line.appendChild(dot);
            }

            // Append the completed row to the container
            dotsContainer.appendChild(line);
        }

        return dotsContainer;
    }

    // Find the first element with the .speckled-photo class to append decorative dots
    const photoElement = document.querySelector('.speckled-photo');
    if (photoElement) {
        // Append three layers of dots with different container classes for styling
        photoElement.appendChild(createDots('dots-1', 5, 5));
        photoElement.appendChild(createDots('dots-2', 5, 5));
        photoElement.appendChild(createDots('dots-3', 5, 5));
        qwerty();
    }

    /**
     * Fetch the about page fragment and copy its `.skills .items` content into the current page.
     *
     * This function:
     * - Fetches `pages/about.html` (relative path).
     * - Parses the returned HTML into a temporary element.
     * - Selects `.skills .items` from the fetched fragment and replaces the current
     *   page's `.skills .items` innerHTML with the fetched content.
     *
     * Note: This is a simple replacement; it does not merge or deduplicate content.
     */
    function loadSkills() {
        fetch('pages/about.html')
            .then(response => response.text())
            .then(data => {
                // Create a temporary container to parse the fetched HTML string
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                // Select the skills section from the fetched fragment
                const skillsSection = tempDiv.querySelector('.skills .items');
                if (skillsSection) {
                    // Insert the skills section into the .skills .items section in index.html
                    const skillsContainer = document.querySelector('.skills .items');
                    if (skillsContainer) skillsContainer.innerHTML = skillsSection.innerHTML;
                }
            })
            .catch(error => console.error('Error loading about:', error));
    }

    // Call the functions to load and insert the skills (if on the index page)
    if (window.location.pathname.split('/').pop() === 'index.html' || window.location.pathname.split('/').pop() === '') loadSkills();

    // Old easter egg: Contact form submit guard for message 'qwerty'
    /*const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            const message = form.querySelector('textarea[name="message"]').value;
            if (message === 'qwerty') {
                event.preventDefault();
                alert('🦄?');
            }
        });
    }*/

    /**
     * Braille Easter Egg: Click dots to spell 'qwerty' in braille
     *
     * Braille patterns (using 2x3 grid, positions numbered 1-6):
     *   1 4
     *   2 5
     *   3 6
     *
     * q = 1,2,3,4,5   w = 2,4,5,6   e = 1,5   r = 1,2,3,5   t = 2,3,4,5   y = 1,3,4,5,6
     */
    function qwerty() {
        // Braille patterns for 'qwerty' - positions that should be active (1-6 mapping)
        // Using 2x3 grid within our 5x5 dot grid (using top-left 2x3 area)
        const braillePatterns = {
            q: [1, 2, 3, 4, 5],      // ⠟
            w: [2, 4, 5, 6],         // ⠺
            e: [1, 5],               // ⠑
            r: [1, 2, 3, 5],         // ⠗
            t: [2, 3, 4, 5],         // ⠞
            y: [1, 3, 4, 5, 6]       // ⠽
        };

        const brailleChars = ['⠟', '⠺', '⠑', '⠗', '⠞', '⠽']; // q w e r t y in braille

        // Check if qwerty is active in localStorage
        function isQwertyActive() {
            const qwertyData = localStorage.getItem('qwerty');
            if (!qwertyData) return false;

            const data = JSON.parse(qwertyData);
            const now = Date.now();

            // Check if 5 minutes (300000ms) have passed
            if (now - data.timestamp > 300000) {
                localStorage.removeItem('qwerty');
                return false;
            }
            return data.active;
        }

        // Save qwerty=true to localStorage with timestamp
        function activateQwerty() {
            const data = {
                active: true,
                timestamp: Date.now()
            };
            localStorage.setItem('qwerty', JSON.stringify(data));
            startBrailleSpawner();
        }

        // Spawn random braille characters on screen
        let spawnerInterval = null;
        function startBrailleSpawner() {
            if (spawnerInterval) return; // Already running

            spawnerInterval = setInterval(() => {
                if (!isQwertyActive()) {
                    clearInterval(spawnerInterval);
                    spawnerInterval = null;
                    // Remove all spawned braille elements
                    document.querySelectorAll('.braille-spawn').forEach(el => el.remove());
                    return;
                }

                // Create a braille character element
                const braille = document.createElement('div');
                braille.className = 'braille-spawn';
                braille.textContent = brailleChars[Math.floor(Math.random() * brailleChars.length)];
                braille.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * (window.innerWidth - 50)}px;
                    top: ${Math.random() * (window.innerHeight - 50)}px;
                    font-size: ${20 + Math.random() * 30}px;
                    color: var(--purple);
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: 9999;
                    animation: brailleFade 3s ease-out forwards;
                `;
                document.body.appendChild(braille);

                // Remove after animation
                setTimeout(() => braille.remove(), 3000);
            }, 500);
        }

        // Add CSS animation for braille spawns
        function addBrailleStyles() {
            if (document.getElementById('braille-styles')) return;
            const style = document.createElement('style');
            style.id = 'braille-styles';
            style.textContent = `
                @keyframes brailleFade {
                    0% { opacity: 0; transform: scale(0.5); }
                    20% { opacity: 0.7; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.2) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        addBrailleStyles();

        // Check on page load if qwerty is active
        if (isQwertyActive()) {
            startBrailleSpawner();
        }

        // Get all dots in the three dot containers
        const dotContainers = document.querySelectorAll('.dots-1, .dots-2, .dots-3');
        if (dotContainers.length === 0) return;

        // Track clicked dots for each container
        const clickedDots = new Map();

        // Map dot position in 5x5 grid to braille position (1-6)
        // Using top-left 2x3 area of 5x5 grid:
        // Row 0: col 0 = pos 1, col 1 = pos 4
        // Row 1: col 0 = pos 2, col 1 = pos 5
        // Row 2: col 0 = pos 3, col 1 = pos 6
        function getBraillePosition(rowIndex, dotIndex) {
            if (rowIndex > 2 || dotIndex > 1) return null; // Outside braille area
            const posMap = [
                [1, 4], // row 0
                [2, 5], // row 1
                [3, 6]  // row 2
            ];
            return posMap[rowIndex][dotIndex];
        }

        // Check if a set of positions matches any braille letter
        function matchBrailleLetter(positions) {
            const sortedPositions = [...positions].sort().join(',');
            for (const [letter, pattern] of Object.entries(braillePatterns)) {
                if ([...pattern].sort().join(',') === sortedPositions) {
                    return letter;
                }
            }
            return null;
        }

        // Track completed letters
        const completedLetters = new Set();
        const requiredLetters = new Set(['q', 'w', 'e', 'r', 't', 'y']);

        // Initialize each dot container
        dotContainers.forEach((container, containerIndex) => {
            clickedDots.set(containerIndex, new Set());

            const lines = container.querySelectorAll('.line');
            lines.forEach((line, rowIndex) => {
                const dots = line.querySelectorAll('.dot');
                dots.forEach((dot, dotIndex) => {
                    const braillePos = getBraillePosition(rowIndex, dotIndex);

                    // Make braille-area dots clickable
                    if (braillePos !== null) {
                        dot.style.cursor = 'pointer';
                        dot.style.transition = 'background-color 0.2s';
                        dot.dataset.braillePos = braillePos;
                        dot.dataset.container = containerIndex;

                        dot.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const pos = parseInt(dot.dataset.braillePos);
                            const contIdx = parseInt(dot.dataset.container);
                            const containerClicks = clickedDots.get(contIdx);

                            if (containerClicks.has(pos)) {
                                // Unclick the dot
                                containerClicks.delete(pos);
                                dot.style.backgroundColor = '';
                            } else {
                                // Click the dot
                                containerClicks.add(pos);
                                dot.style.backgroundColor = 'var(--purple)';
                            }

                            // Check if current pattern matches a letter
                            if (containerClicks.size > 0) {
                                const matchedLetter = matchBrailleLetter(containerClicks);
                                if (matchedLetter && requiredLetters.has(matchedLetter) && !completedLetters.has(matchedLetter)) {
                                    completedLetters.add(matchedLetter);

                                    // Get all braille dots in this container to reset them
                                    const containerEl = dotContainers[contIdx];
                                    const brailleDots = containerEl.querySelectorAll('.dot[data-braille-pos]');

                                    // Flash success and reset container for next letter
                                    brailleDots.forEach(d => {
                                        if (containerClicks.has(parseInt(d.dataset.braillePos))) {
                                            d.style.backgroundColor = '#4CAF50'; // Green flash
                                        }
                                    });

                                    setTimeout(() => {
                                        // Reset all dots in container
                                        brailleDots.forEach(d => {
                                            d.style.backgroundColor = '';
                                        });
                                        containerClicks.clear();

                                        // Check if all letters are completed
                                        if (completedLetters.size === requiredLetters.size) {
                                            setTimeout(() => {
                                                alert('🦄 You found the QWERTY braille easter egg! 🎉');
                                                activateQwerty();
                                            }, 100);
                                        }
                                    }, 300);
                                }
                            }
                        });
                    }
                });
            });
        });
    }
});
