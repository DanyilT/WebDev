document.addEventListener('DOMContentLoaded', () => {
    function createDots(className, lines, dotsPerLine) {
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add(className);

        for (let i = 0; i < lines; i++) {
            const line = document.createElement('div');
            line.classList.add('line');

            for (let j = 0; j < dotsPerLine; j++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                line.appendChild(dot);
            }

            dotsContainer.appendChild(line);
        }

        return dotsContainer;
    }

    const photoElement = document.querySelector('.speckled-photo');
    if (photoElement) {
        photoElement.appendChild(createDots('dots-1', 5, 5));
        photoElement.appendChild(createDots('dots-2', 5, 5));
        photoElement.appendChild(createDots('dots-3', 5, 5));
    }

    function loadSkills() {
        fetch('pages/about.html')
            .then(response => response.text())
            .then(data => {
                // Create a temporary DOM element to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                // Select the skills section
                const skillsSection = tempDiv.querySelector('.skills .items');
                if (skillsSection) {
                    // Insert the skills section into the .skills .items section in index.html
                    const skillsContainer = document.querySelector('.skills .items');
                    skillsContainer.innerHTML = skillsSection.innerHTML;
                }
            })
            .catch(error => console.error('Error loading about:', error));
    }

    // Call the functions to load and insert the skills
    loadSkills();

    // Add event listener to the contact form
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
