document.addEventListener('DOMContentLoaded', (event) => {
    // Load the header
    fetch('/scripts/assets/path/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    // Load the sidebar
    fetch('/scripts/assets/path/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar').innerHTML = data;
    });

    // Load the footer
    fetch('/scripts/assets/path/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});
