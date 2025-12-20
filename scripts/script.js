document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('h1');
    const footer = document.querySelector('p');

    header.addEventListener('click', () => {
        header.style.display = 'none';
        footer.style.display = 'block';
    });

    footer.addEventListener('click', () => {
        footer.style.display = 'none';
        header.style.display = 'block';
    });

    footer.style.display = 'none';
});
