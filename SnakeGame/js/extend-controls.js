document.addEventListener('DOMContentLoaded', function() {
    const gameCanvas = document.getElementById('game');

    // Swipe detection variables
    let startX, startY, endX, endY;

    // Detect swipe gestures
    gameCanvas.addEventListener('touchstart', function(e) {
        e.preventDefault() // Prevent default touch behavior like page refresh, scrolling, zooming
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    gameCanvas.addEventListener('touchmove', function(e) {
        e.preventDefault() // Prevent default touch behavior like page refresh, scrolling, zooming
        const touch = e.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;
    });

    gameCanvas.addEventListener('touchend', function() {
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                // Swipe right
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            } else {
                // Swipe left
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                // Swipe down
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            } else {
                // Swipe up
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            }
        }
    });

    // Remap WASD keys to arrow keys
    document.addEventListener('keydown', function(e) {
        switch (e.key.toLowerCase()) {
            case 'w':
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
                e.preventDefault();
                break;
            case 'a':
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                e.preventDefault();
                break;
            case 's':
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                e.preventDefault();
                break;
            case 'd':
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                e.preventDefault();
                break;
        }
    });
});
