/**
 * js/load-data.js
 *
 * Load JSON data and populate HTML elements based on the current page.
 * This script fetches data from `data/data.json` and updates various parts of the webpage
 * depending on whether the user is on the index, about, projects, or resume page.
 */

document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();

    // Load sidebar links for all pages
    fetch((page === 'index.html' || page === '') ? 'data/data.json' : '../data/data.json')
        .then(response => response.json())
        .then(data => {
            loadSidebarLinks(data.site.links);
        })
        .catch(error => console.error('Error loading sidebar links:', error));

    // Load footer copy for all pages
    fetch((page === 'index.html' || page === '') ? 'data/data.json' : '../data/data.json')
        .then(response => response.json())
        .then(data => {
            loadFooterCopy(data.site.footer);
        })
        .catch(error => console.error('Error loading sidebar links:', error));

    // Load page-specific data based on the current page.
    if (page === 'index.html' || page === '') {
        // Load data for the index page
        fetch('data/data.json')
            .then(response => response.json())
            .then(data => {
                // Update index page text
                document.getElementById('setText-title').textContent = data.index.title;
                document.getElementById('setText-description').innerHTML = data.index.description;
                document.getElementById('setText-currently-working-on').textContent = data.index['currently-working-on'].title || data.index['currently-working-on'];
                data.index['currently-working-on'].link ? document.getElementById('setText-currently-working-on').onclick = () => { window.open(data.index['currently-working-on'].link, '_blank') } : null;

                // Load first three projects from projects data
                loadProjects(data.projects.projects.slice(0, 3));
                loadSkills(data);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else if (page === 'about.html' || page === 'about') {
        // Load data for the about page
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => {
                // Update main body text
                document.getElementById('setText-body').innerHTML = data.about.body.map(paragraph => `<p>${paragraph}</p>`).join('');

                loadSkills(data);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else if (page === 'projects.html' || page === 'projects') {
        // Load data for the projects page
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => {
                loadProjects(data.projects.projects);
                loadGithubProjects(data.projects.github);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else if (page === 'resume.html' || page === 'resume') {
        // Load data (resume link) for the resume page
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => {
                const resume = data.site.resume.url;
                console.log(resume);
                const resumeIframe = document.getElementById('resume');
                if (resumeIframe) resumeIframe.setAttribute('src', resume);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }

    /**
     * Load social links into all aside/sidebar elements.
     * @param {Object} links - Object containing social link URLs.
     */
    function loadSidebarLinks(links) {
        const applyLinks = () => {
            const asides = document.querySelectorAll('aside');
            if (!asides.length) {
                // Defer until next frame if asides are not yet in the DOM
                requestAnimationFrame(applyLinks);
                return;
            }

            asides.forEach(aside => {
                const githubLink = aside.querySelector('a[href*="github"]');
                const linkedinLink = aside.querySelector('a[href*="linkedin"]');
                const instagramLink = aside.querySelector('a[href*="instagram"]');
                const twitterLink = aside.querySelector('a[href*="twitter"]');
                const telegramLink = aside.querySelector('a[href*="telegram"]');
                const emailLink = aside.querySelector('a[href*="mailto"]');

                if (githubLink && links?.github) githubLink.setAttribute('href', links.github);
                if (linkedinLink && links?.linkedin) linkedinLink.setAttribute('href', links.linkedin);
                if (instagramLink && links?.instagram) instagramLink.setAttribute('href', links.instagram);
                if (twitterLink && links?.twitter) twitterLink.setAttribute('href', links.twitter);
                if (telegramLink && links?.telegram) telegramLink.setAttribute('href', links.telegram);
                if (emailLink && links?.email) emailLink.setAttribute('href', links.email);
            });
        };

        applyLinks();
    }

    /**
     * Load footer copy into the footer element.
     * @param footerData
     */
    function loadFooterCopy(footerData) {
        const footer = document.querySelector('footer .copy');
        if (footer) {
            footer.innerHTML = `${footerData.copy} ${footerData.source ? `[ <a href="${footerData.source}">source</a> ]` : ''}`;
        }
    }

    /**
     * Load skills into the about page.
     * @param data
     */
    function loadSkills(data) {
        // Update Hard Skills
        const hardSkills = data.about.skills.hard;
        const hardContainers = ['setText-hard-skills-1', 'setText-hard-skills-2'];
        const hardKeys = Object.keys(hardSkills);

        hardContainers.forEach((id, index) => {
            const container = document.getElementById(id);
            if (container && hardKeys[index]) {
                container.innerHTML = `<h4>${hardKeys[index]}</h4><p>${hardSkills[hardKeys[index]].join(' | ')}</p>`;
            }
        });

        // Update Soft Skills
        const softSkills = data.about.skills.soft;
        const softContainers = ['setText-soft-skills-1', 'setText-soft-skills-2'];
        const softKeys = Object.keys(softSkills);

        softContainers.forEach((id, index) => {
            const container = document.getElementById(id);
            if (container && softKeys[index]) {
                container.innerHTML = `<h4>${softKeys[index]}</h4><p>${softSkills[softKeys[index]].join('<br>')}</p>`;
            }
        });
    }

    /**
     * Load projects into the '.projects' section.
     * @param projectsArray
     */
    function loadProjects(projectsArray) {
        // Select the container for normal projects (exclude the GitHub projects section)
        const container = document.querySelector('section.projects:not(.git-hub) .items');
        if (container && projectsArray && projectsArray.length) {
            container.innerHTML = projectsArray.map(project => {
                let btnsHtml = '';
                if (project.buttons) {
                    for (const key in project.buttons) {
                        if (key === 'other-links') {
                            const otherLinks = project.buttons['other-links'];
                            const linksHtml = Object.entries(otherLinks)
                                .map(([text, href]) => `<a class="button-gray" href="${href}">${text}</a>`)
                                .join(' ');
                            btnsHtml += `<div class="other-links">${linksHtml}</div>`;
                        } else {
                            btnsHtml += `<a class="button-purple" href="${project.buttons[key]}">${key}</a>`;
                        }
                    }
                }
                let imgSrc = page === 'projects.html' ? project.img : project.img.replace('../', '');
                return `<div class="project">
                  <img src="${imgSrc}" alt="${project.title}">
                  <p>${project.description.join('<br>')}</p>
                  <div class="main-text">
                    <h3>${project.title}</h3>
                    <p>${project.details.join('<br>')}</p>
                  </div>
                  <div class="buttons">
                    ${btnsHtml}
                  </div>
                </div>`;
            }).join('');
        }
    }

    /**
     * Load GitHub projects into the '.projects.git-hub' section.
     * @param githubArray
     */
    function loadGithubProjects(githubArray) {
        // Select the container for GitHub projects within the '.projects.git-hub' section
        const container = document.querySelector('section.projects.git-hub .items');
        if (container && githubArray && githubArray.length) {
            container.innerHTML = githubArray.map(project => {
                return `<div class="project">
                  <img src="../img/github.iconlypro/github-black.svg" alt="GitHub Logo">
                  <h3>${project.title}</h3>
                  <a class="button-purple" href="${project.button}">Visit GitHub</a>
                </div>`;
            }).join('');
        }
    }
});
