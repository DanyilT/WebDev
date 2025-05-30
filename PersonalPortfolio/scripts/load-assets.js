document.addEventListener('DOMContentLoaded', (event) => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

    // Load the header
    fetch(isHomePage ? 'pages/assets/header.html' : 'assets/header.html')
        .then(response => response.text())
        .then(data => {
            const header = new DOMParser().parseFromString(data, 'text/html').querySelector('header');
            header.querySelectorAll('a').forEach((link, index) => {
                const href = link.getAttribute('href');
                if (href && index !== 0) {
                    link.setAttribute('href', (isHomePage ? 'pages/' : '') + href);
                }
            });
            if (!isHomePage) {
                header.querySelector('a:first-child').setAttribute('href', '../index.html');
            }

            document.getElementById('header').insertAdjacentHTML('beforebegin', header.outerHTML);
            document.getElementById('header').remove();
        })
        // Catch Header from the GitHub Pages
        .catch(() => {
            fetch('https://danyilt.github.io/WebDev/PersonalPortfolio/pages/assets/header.html')
                .then(response => response.text())
                .then(data => {
                    const header = new DOMParser().parseFromString(data, 'text/html').querySelector('header');
                    header.querySelectorAll('a').forEach((link, index) => {
                        const href = link.getAttribute('href');
                        if (href && index !== 0) {
                            link.setAttribute('href', (isHomePage ? 'pages/' : '') + href);
                        }
                    });
                    if (!isHomePage) {
                        header.querySelector('a:first-child').setAttribute('href', '../index.html');
                    }

                    document.getElementById('header').insertAdjacentHTML('beforebegin', header.outerHTML);
                    document.getElementById('header').remove();
                });
        });

    // Load the footer
    fetch(isHomePage ? 'pages/assets/footer.html' : 'assets/footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = new DOMParser().parseFromString(data, 'text/html').querySelector('footer');
            const sitemapLink = footer.querySelector('a[href*="sitemap.html"]');
            if (isHomePage) {
                sitemapLink.setAttribute('href', 'pages/' + sitemapLink.getAttribute('href'));
            }

            document.getElementById('footer').insertAdjacentHTML('beforebegin', footer.outerHTML);
            document.getElementById('footer').remove();
        })
        // Catch Footer from the GitHub Pages
        .catch(() => {
            fetch('https://danyilt.github.io/WebDev/PersonalPortfolio/pages/assets/footer.html')
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
        });

    // Load the sidebar
    fetch(isHomePage ? 'pages/assets/sidebar.html' : 'assets/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar').insertAdjacentHTML('beforebegin', data);
            document.getElementById('sidebar').remove();

            document.querySelectorAll('#links').forEach(link => {
                link.insertAdjacentHTML('beforebegin', data);
                link.remove();
            });
        })
        // Catch Sidebar from the GitHub Pages
        .catch(() => {
            fetch('https://danyilt.github.io/WebDev/PersonalPortfolio/pages/assets/sidebar.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('sidebar').insertAdjacentHTML('beforebegin', data);
                    document.getElementById('sidebar').remove();

                    document.querySelectorAll('#links').forEach(link => {
                        link.insertAdjacentHTML('beforebegin', data);
                        link.remove();
                    });
                });
        });
});
