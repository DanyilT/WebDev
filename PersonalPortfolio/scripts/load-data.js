document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === '') {
        // Load data for the index page
        fetch('data/data.json')
            .then(response => response.json())
            .then(data => {
                // Update index page text
                document.getElementById('setText-title').textContent = data.index.title;
                document.getElementById('setText-description').innerHTML = data.index.description;
                document.getElementById('setText-currently-working-on').textContent = data.index['currently-working-on'];

                // Load first three projects from projects data
                loadProjects(data.projects.projects.slice(0, 3));
                loadSkills(data);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else if (page === 'about.html') {
        // Load data for the about page
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => {
                // Update main body text
                document.getElementById('setText-body').innerHTML = data.about.body.map(paragraph => `<p>${paragraph}</p>`).join('');

                loadSkills(data);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else if (page === 'projects.html') {
        // Load data for the projects page
        fetch('../data/data.json')
            .then(response => response.json())
            .then(data => {
                loadProjects(data.projects.projects);
                loadGithubProjects(data.projects.github);
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }

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
                return `<div class="project">
                  <img src="${project.img}" alt="${project.title}">
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

    function loadGithubProjects(githubArray) {
        // Select the container for GitHub projects within the '.projects.git-hub' section
        const container = document.querySelector('section.projects.git-hub .items');
        if (container && githubArray && githubArray.length) {
            container.innerHTML = githubArray.map(project => {
                return `<div class="project">
                  <img src="../images/GitHub-IconlyPro/GitHub-black.svg" alt="GitHub Logo">
                  <h3>${project.title}</h3>
                  <a class="button-purple" href="${project.button}">Visit GitHub</a>
                </div>`;
            }).join('');
        }
    }
});
