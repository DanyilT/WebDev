import { formatSectionName, formatContactLabel } from './builder/utils.js';

document.addEventListener("DOMContentLoaded", () => {
    // If preview mode, load data from localStorage and show action buttons
    if (new URLSearchParams(window.location.search).has('preview')) {
        const storedData = localStorage.getItem('previewResumeData');
        if (!storedData) {
            console.error("No resume data found in localStorage for preview mode.");
            // window.location.href = 'index.html';
            window.close();
            return;
        }
        try {
            const data = JSON.parse(storedData);

            applyCustomization(data.customization);
            renderAbout(data.about);
            renderPhoto(data.customization?.photoUrl);
            renderSections(data.sections);

        } catch (e) {
            console.error("Error parsing stored data:", e);
        }
    }

    // Load data from jsonbin.io, get public bin id from URL params (?bin=BIN_ID)
    // or Load data from local JSON file
    const binId = new URLSearchParams(window.location.search).get('bin');
    const file = new URLSearchParams(window.location.search).get('file');

    if (binId || file) {
        fetch(binId ? `https://api.jsonbin.io/v3/b/${binId}/latest` : file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (binId) data = data.record;

            applyCustomization(data.customization);
            renderAbout(data.about);
            renderPhoto(data.customization?.photoUrl);
            renderSections(data.sections);
        })
        .catch(error => {
            console.error("Error fetching resume data:", error);
            qwerty(binId);
        });
    }
});

function applyCustomization(customization) {
    if (!customization) return;

    const root = document.documentElement;

    if (customization.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', customization.primaryColor);
    }

    if (customization.fontFamily) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${customization.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(fontLink);
        root.style.setProperty('--font-family', `'${customization.fontFamily}', sans-serif`);
    }

    if (customization.fontSize) {
        root.style.setProperty('--font-size', customization.fontSize);
    }
}

function renderAbout(about) {
    if (!about) return;

    document.getElementById('subtitle').textContent = about.subtitle || '';
    document.getElementById('name').textContent = about.name || '';
    document.getElementById('about').textContent = about.about || '';
}

function renderPhoto(photoUrl) {
    const photo = document.getElementById('photo');
    if (photo && photoUrl) {
        photo.src = photoUrl;
        photo.style.display = 'block';
        setFavicon(photoUrl);
    } else if (photo) {
        photo.style.display = 'none';
    }
}

function setFavicon(photoUrl) {
    if (!photoUrl) return;

    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) existingFavicon.remove();

    // Create and add new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = photoUrl;
    document.head.appendChild(favicon);
}

function renderSections(sections) {
    if (!sections) return;

    // Render main sections
    if (sections.main) {
        const mainEl = document.querySelector('main');
        Object.entries(sections.main).forEach(([key, section]) => {
            const sectionEl = createSection(key, section);
            mainEl.appendChild(sectionEl);
        });
    }

    // Render sidebar sections
    if (sections.side) {
        const sidebar = document.querySelector('.sidebar');
        Object.entries(sections.side).forEach(([key, section]) => {
            const sectionEl = createSidebarSection(key, section);
            sidebar.appendChild(sectionEl);
        });
    }
}

/* ==================== CREATE SECTIONS ==================== */

function createSection(key, section) {
    if (!section || !section.type) return null;

    const sectionEl = document.createElement('section');
    sectionEl.className = `${key} ${section.type}-section fade-in`;
    sectionEl.id = `${key}Section`;

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = formatSectionName(key);
    sectionEl.appendChild(title);

    switch (section.type) {
        case 'list':
            renderListSection(sectionEl, key, section.items);
            break;
        case 'text-list':
            renderTextListSection(sectionEl, section.items);
            break;
        case 'text':
            renderTextSection(sectionEl, section.content);
            break;
        case 'links':
            renderLinksSection(sectionEl, section.items);
            break;
        case 'categorized-list':
            renderCategorizedListSection(sectionEl, section.items);
            break;
    }

    return sectionEl;
}

function createSidebarSection(key, section) {
    if (!section || !section.type) return null;

    const div = document.createElement('div');
    div.className = `sidebar-text ${key} ${section.type}-section fade-in`;
    div.id = `${key}Section`;

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = formatSectionName(key);
    div.appendChild(title);

    switch (section.type) {
        case 'list':
            renderListSection(div, key, section.items);
            break;
        case 'text-list':
            renderSidebarTextList(div, section.items);
            break;
        case 'text':
            renderTextSection(div, section.content);
            break;
        case 'links':
            renderSidebarLinks(div, section.items);
            break;
        case 'categorized-list':
            renderCategorizedListSection(div, section.items);
            break;
    }

    return div;
}

/* ==================== RENDER SECTIONS ==================== */

function renderListSection(container, key, items) {
    if (!items || !items.length) return;

    container.classList.add('list-section');

    // Special handling for projects
    if (key === 'projects') {
        container.classList.add('projects-section');
        renderProjectsSection(container, items);
        return;
    }

    // Special handling for education
    if (key === 'education') {
        container.classList.add('education-section');
        renderEducationSection(container, items);
        return;
    }

    // Special handling for experience
    if (key === 'experience') {
        container.classList.add('experience-section');
        renderExperienceSection(container, items);
        return;
    }

    // If key is languages, render differently in sidebar
    if (key === 'languages' && items) {
        renderLanguages(container, items);
    }

    items.forEach(item => {
        const article = document.createElement('article');

        // Determine the primary title field
        const titleField = item.institution || item.title || item.name || item.place || '';

        if (titleField) {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'topic';

            const h4 = document.createElement('h4');
            h4.className = 'subtitle';
            h4.textContent = titleField;

            topicDiv.appendChild(h4);
            article.appendChild(topicDiv);
        }

        container.appendChild(article);
    });
}

function renderTextListSection(container, items) {
    if (!items || !items?.length) return;

    container.classList.add('text-list-section');

    const dl = document.createElement('dl');
    items.forEach(text => {
        const dd = document.createElement('dd');
        dd.textContent = text;
        dl.appendChild(dd);
    });
    container.appendChild(dl);
}

function renderTextSection(container, content) {
    if (!content) return;

    const p = document.createElement('p');
    p.textContent = content;
    container.appendChild(p);
}

function renderLinksSection(container, items) {
    if (!items || Object.keys(items).length === 0) return;

    const ul = document.createElement('ul');
    Object.entries(items).forEach(([label, url]) => {
        if (url) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.textContent = label;
            a.target = '_blank';
            li.appendChild(a);
            ul.appendChild(li);
        }
    });
    container.appendChild(ul);
}

function renderCategorizedListSection(container, items) {
    if (!items) return;

    Object.entries(items).forEach(([category, values]) => {
        if (!values?.length) return;

        const group = document.createElement('div');
        group.className = 'category-group';

        const h4 = document.createElement('h4');
        h4.textContent = formatSectionName(category);
        group.appendChild(h4);

        const ul = document.createElement('ul');
        values.forEach(value => {
            const li = document.createElement('li');
            // li.textContent = value;
            li.innerHTML = `<span>${value}</span>`;
            ul.appendChild(li);
        });
        group.appendChild(ul);

        container.appendChild(group);
    });
}

function renderSidebarTextList(container, items) {
    if (!items || !items.length) return;

    const ul = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item}</span>`;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function renderSidebarLinks(container, items) {
    if (!items || Object.keys(items).length === 0) return;

    container.classList.add('links-section');

    // Check if it's contacts (has phone/email keys)
    const isContacts = items.phone || items.email;

    if (isContacts) {
        Object.entries(items).forEach(([key, url]) => {
            if (url) {
                const p = document.createElement('p');
                const label = key.charAt(0).toUpperCase();
                p.innerHTML = `<span>${label}:</span> <a href="${url}">${formatContactLabel(key, url)}</a>`;
                container.appendChild(p);
            }
        });
    } else {
        const ul = document.createElement('ul');
        Object.entries(items).forEach(([label, url]) => {
            if (url) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${url}" target="_blank">${label}</a>`;
                ul.appendChild(li);
            }
        });
        container.appendChild(ul);
    }
}

/* ==================== RENDER SPECIFIC SECTIONS ==================== */

function renderEducationSection(container, items) {
    items.forEach(item => {
        const article = document.createElement('article');

        // Institution as h4 and Date | Location date-location (inside topic div)
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';

        if (item.institution) {
            const h4 = document.createElement('h4');
            h4.className = 'subtitle';
            h4.textContent = item.institution;
            topicDiv.appendChild(h4);
        }

        // Date and location
        if (item.date || item.location) {
            const p = document.createElement('p');
            p.className = 'date-location';
            const parts = [item?.date, item?.location].filter(Boolean);
            p.innerHTML = parts.join(' <span>|</span> ');
            topicDiv.appendChild(p);
        }

        article.appendChild(topicDiv);

        // Degree line with link - h5
        if (item.degree || item.degreeLevel || item.GPA) {
            const h5 = document.createElement('h5');
            h5.className = 'degree-line';

            // Degree with optional link
            if (item.degree) {
                if (item.courseInfoLink) {
                    const link = document.createElement('a');
                    link.href = item.courseInfoLink;
                    link.target = '_blank';
                    link.className = 'degree-link';
                    link.textContent = item.degree;
                    if (item.degreeLevel) {
                        link.textContent += ` (${item.degreeLevel})`;
                    }
                    h5.appendChild(link);
                } else {
                    let text = item.degree;
                    if (item.degreeLevel) {
                        text += ` (${item.degreeLevel})`;
                    }
                    h5.appendChild(document.createTextNode(text));
                }
            }

            // GPA
            if (item.GPA || item.certificateGrade) {
                const separator = document.createElement('span');
                separator.textContent = ' | ';
                h5.appendChild(separator);

                const gpaSpan = document.createElement('span');
                gpaSpan.className = 'gpa';
                gpaSpan.textContent = item.GPA ? `GPA: ${item.GPA}` : item.certificateGrade ? `Certificate Grade: ${item.certificateGrade}` : '';
                h5.appendChild(gpaSpan);
            }

            article.appendChild(h5);
        }

        // Description
        if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'edu-description';
            desc.textContent = item.description;
            article.appendChild(desc);
        }

        container.appendChild(article);
    });
}

function renderExperienceSection(container, items) {
    items.forEach(item => {
        const article = document.createElement('article');

        // Company/Position as h4
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';

        if (item.title) {
            const h4 = document.createElement('h4');
            h4.className = 'subtitle';
            h4.textContent = item.title;

            if (item.company) {
                const span = document.createElement('span');
                span.className = 'company-name';
                span.textContent = ' ' + item.company;
                h4.appendChild(span);
            }
            topicDiv.appendChild(h4);
        }

        // Date and location
        if (item.date || item.location) {
            const p = document.createElement('p');
            p.className = 'date-location';
            const parts = [item?.date, item?.location].filter(Boolean);
            p.innerHTML = parts.join(' <span>|</span> ');
            topicDiv.appendChild(p);
        }

        article.appendChild(topicDiv);

        // Description
        if (item.description) {
            const desc = document.createElement('p');
            desc.className = 'exp-description';
            desc.textContent = item.description;
            article.appendChild(desc);
        }

        // Details/responsibilities list
        if (item.details?.length) {
            const ul = document.createElement('ul');
            item.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                ul.appendChild(li);
            });
            article.appendChild(ul);
        }

        container.appendChild(article);
    });
}

function renderProjectsSection(container, items) {
    const ul = document.createElement('ul');
    ul.className = 'project-list';

    items.forEach(project => {
        const li = document.createElement('li');
        li.className = 'project-item';

        // Project name with link
        const nameSpan = document.createElement('span');
        nameSpan.className = 'project-name';
        const link = document.createElement('a');
        link.href = project.link || '#';
        link.target = '_blank';
        link.textContent = project.name || 'Untitled';
        nameSpan.appendChild(link);
        li.appendChild(nameSpan);

        // Dots
        const dots = document.createElement('span');
        dots.className = 'project-dots';
        li.appendChild(dots);

        // Tech
        const tech = document.createElement('span');
        tech.className = 'project-tech';
        tech.innerHTML = `<span>[</span> ${project.tech || project.technologies || ''} <span>]</span>`;
        li.appendChild(tech);

        // Description tooltip
        if (project.desc || project.description) {
            const desc = document.createElement('div');
            desc.className = 'project-desc';
            desc.textContent = project.desc || project.description;
            li.appendChild(desc);
        }

        ul.appendChild(li);
    });

    container.appendChild(ul);
}

function renderLanguages(container, items) {
    const section = document.createElement('div');
    section.className = 'languages-section';

    const list = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        if (typeof item === 'object' && item.language) {
            li.innerHTML = `<span>${item.language}</span>${item.level ? ` - ${item.level}` : ''}`;
        } else {
            li.textContent = item;
        }
        list.appendChild(li);
    });
    section.appendChild(list);

    container.appendChild(section);
}

/* ==================== END OF FILE ==================== */

//qwerty
function qwerty(binId) {
    if (binId === 'qwerty') {
        console.log(String.fromCharCode(89,111,117,39,118,101,32,102,111,117,110,100,32,116,104,101,32,101,97,115,116,101,114,32,101,103,103,33));
        console.warn("You are a potato now...");
        console.warn("Live your best potato life!");
        console.warn("Be aware of the sweet potato... they are not what they seem..");

        // remove anything inside main and sidebar and create new potato-themed resume
        document.body.style.backgroundColor = '#f4e1d2';

        fetch('data/potato.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            applyCustomization(data.customization);
            renderAbout(data.about);
            renderPhoto(data.customization?.photoUrl);
            renderSections(data.sections);
        })
        .catch(error => {
            console.error("Error fetching resume data:", error);
        });
    }
}
