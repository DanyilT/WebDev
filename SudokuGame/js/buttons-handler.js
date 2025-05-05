document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.getElementById('showInfoBtn');
    const infoContainer = document.querySelector('.info-container');
    const restartBtn = document.getElementById('newGameBtn');
    const checkSolutionBtn = document.getElementById('checkSolutionBtn');
    const difficultySelect = document.getElementById('difficulty');

    // Function to toggle info visibility
    function toggleInfo() {
        document.querySelector('.score-board .scores').innerHTML = `<p>${Object.entries(JSON.parse(localStorage.getItem('winLevels')) || { beginner: 0, easy: 0, medium: 0, hard: 0, expert: 0 }).map(([level, wins]) => {
            const winBadge = wins > 0 ? ` <span class="win-badge">${wins} ⭐</span>` : `<b>${wins}</b>`;
            return `${level.charAt(0).toUpperCase() + level.slice(1)}: ${winBadge}`;
        }).join(' | ')}</p>`;

        if (infoContainer.style.display === 'none') {
            infoContainer.style.display = 'block';
            infoBtn.textContent = 'Hide Info (i)';
            infoContainer.scrollIntoView({behavior: 'smooth'});
        } else {
            infoContainer.style.display = 'none';
            infoBtn.textContent = 'Show Info (i)';
            infoContainer.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    // Initially hide info, add click event to button
    infoContainer.style.display = 'none';
    infoBtn.addEventListener('click', toggleInfo);

    document.addEventListener('keydown', function(e) {
        // Show/hide info panel
        if (e.key === 'i') {
            toggleInfo();
        }

        // New game shortcut
        if (e.key === 'r') {
            restartBtn.click();
        }

        // Check solution with Enter only when no cell is focused
        if (e.key === 'Enter') {
            // Check if the event originated from a cell (not just what's currently focused)
            if (!e.target.classList || !e.target.classList.contains('cell')) {
                checkSolutionBtn.click();
            }
        }

        // Check solution with Shift+Enter, Ctrl+Enter, or Cmd+Enter (regardless of focus)
        if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // Prevent default actions
            checkSolutionBtn.click();
        }

        // Change difficulty level with Shift+number
        if (e.shiftKey) {
            // Check for number keys by their key codes (49-53 are key codes for 1-5)
            const keyCode = e.keyCode || e.which;
            if (keyCode >= 49 && keyCode <= 53) {
                e.preventDefault();
                const difficultyIndex = keyCode - 49; // Convert to 0-based index
                const difficultyOptions = ['beginner', 'easy', 'medium', 'hard', 'expert'];

                difficultySelect.value = difficultyOptions[difficultyIndex];

                // Manually trigger change event
                const event = new Event('change', {
                    'bubbles': true,
                    'cancelable': true
                });
                difficultySelect.dispatchEvent(event);
            }
        }
    });
});
