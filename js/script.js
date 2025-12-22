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

    // TODO: Need a better easter egg...
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            const message = form.querySelector('textarea[name="message"]').value;
            if (message === 'qwerty') {
                event.preventDefault();
                alert('🦄?');
            }
        });
    }
});
