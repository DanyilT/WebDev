document.addEventListener('DOMContentLoaded', (event) => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    // Load the header
    fetch('pages/assets/header.html')
        .then(response => response.text())
        .then(data => {
            const header = new DOMParser().parseFromString(data, 'text/html').querySelector('header');
            header.querySelectorAll('a').forEach((link, index) => {
                const href = link.getAttribute('href');
                if (href && index !== 0) {
                    link.setAttribute('href', (isHomePage ? 'pages/' : '../') + href);
                }
            });
            if (!isHomePage) {
                header.querySelector('a:first-child').setAttribute('href', '../index.html');
            }

            document.getElementById('header').insertAdjacentHTML('beforebegin', header.outerHTML);
            document.getElementById('header').remove();
        });

    // Load the footer
    fetch('pages/assets/footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = new DOMParser().parseFromString(data, 'text/html').querySelector('footer');
            const sitemapLink = footer.querySelector('a[href*="sitemap.html"]');
            if (isHomePage) {
                sitemapLink.setAttribute('href', 'pages/' + sitemapLink.getAttribute('href'));
            }

            document.getElementById('footer').insertAdjacentHTML('beforebegin', footer.outerHTML);
            document.getElementById('footer').remove();
        });

    // Load the sidebar
    fetch('pages/assets/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar').insertAdjacentHTML('beforebegin', data);
            document.getElementById('links').insertAdjacentHTML('beforebegin', data);

            document.getElementById('sidebar').remove();
            document.getElementById('links').remove();
        });
});
