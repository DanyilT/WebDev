/**
 * js/load-assets.js
 *
 * This script dynamically loads the header, footer, and sidebar content for a webpage.
 * It uses the Fetch API to retrieve HTML fragments and inserts them into the DOM.
 * The script also adjusts links based on whether the page is the homepage or a subpage.
 * If the local fetch fails, it attempts to fetch the content from a GitHub Pages URL.
 */

document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

    /**
     * Load the header content.
     * Adjusts links in the header based on the current page's location.
     * If the local fetch fails, it fetches the header from Cloudflare Pages (where the project is hosted).
     */
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
        // Catch Header from the Cloudflare Pages
        .catch(() => {
            fetch('https://danyilt-personal-portfolio.pages.dev/pages/assets/header.html')
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

    /**
     * Load the footer content.
     * Adjusts the sitemap link in the footer based on the current page's location.
     * If the local fetch fails, it fetches the footer from Cloudflare Pages (where the project is hosted).
     */
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
        // Catch Footer from the Cloudflare Pages
        .catch(() => {
            fetch('https://danyilt-personal-portfolio.pages.dev/pages/assets/footer.html')
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

    /**
     * Load the sidebar content.
     * Inserts the sidebar content into the DOM and removes the placeholder element.
     * If the local fetch fails, it fetches the sidebar from Cloudflare Pages (where the project is hosted).
     */
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
        .catch(() => {
            // Fallback: Fetch sidebar from Cloudflare Pages
            fetch('https://danyilt-personal-portfolio.pages.dev/pages/assets/sidebar.html')
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
