document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('content/content.json');
        const data = await response.json();

        // Main
        // About
        document.getElementById('subtitle').textContent = data.about.subtitle;
        document.getElementById('name').textContent = data.about.name;
        document.getElementById('description').textContent = data.about.description;
        document.getElementById('about').textContent = data.about.about;

        // Education
        const educationSection = document.querySelector('.education');
        data.education.forEach((edu, index) => {
            const article = document.createElement('article');

            // Institution and degree
            const h4 = document.createElement('h4');
            h4.classList.add('subtitle');
            h4.textContent = edu.institution;
            article.appendChild(h4);

            const topicDiv = document.createElement('div');
            topicDiv.classList.add('topic');
            const h5 = document.createElement('h5');
            h5.textContent = edu.degree;
            topicDiv.appendChild(h5);

            // Toggle button
            const eduButton = document.createElement('button');
            const eduId = String(index + 1);
            eduButton.setAttribute('onclick', `ButtonActivity('${eduId}')`);
            eduButton.textContent = 'Subjects';
            topicDiv.appendChild(eduButton);

            article.appendChild(topicDiv);

            // Date & location
            const pElement = document.createElement('p');
            pElement.classList.add('date-location');
            pElement.textContent = `${edu.date} | ${edu.location}`;
            article.appendChild(pElement);

            // Hidden container for subjects
            const hiddenDiv = document.createElement('div');
            hiddenDiv.id = eduId;
            hiddenDiv.hidden = true;

            const dlElement = document.createElement('dl');
            Object.keys(edu.subjects).forEach((year) => {
                const dt = document.createElement('dt');
                dt.classList.add('subtitle');
                dt.textContent = year;
                dlElement.appendChild(dt);

                const semester = edu.subjects[year];
                Object.keys(semester).forEach((sem) => {
                    if (Array.isArray(semester[sem].subject)) {
                        // Create heading
                        const ddHeading = document.createElement('dd');
                        const heading = document.createElement('h5');
                        heading.textContent = sem;
                        ddHeading.appendChild(heading);
                        dlElement.appendChild(ddHeading);

                        // Create subject list
                        semester[sem].subject.forEach((subj, i) => {
                            const ddItem = document.createElement('dd');
                            const h6 = document.createElement('h6');
                            h6.innerHTML = `${subj} <span>[${semester[sem].grades[i]}]</span>`;
                            ddItem.appendChild(h6);
                            dlElement.appendChild(ddItem);
                        });
                    }
                });
            });
            hiddenDiv.appendChild(dlElement);

            // Course link
            const courseLink = document.createElement('dt');
            const linkA = document.createElement('a');
            linkA.href = edu.courseInfoLink;
            linkA.textContent = 'Course info link';
            courseLink.appendChild(linkA);
            hiddenDiv.appendChild(courseLink);

            article.appendChild(hiddenDiv);
            educationSection.appendChild(article);
        });

        // Projects
        const projectsSection = document.querySelector('.projects');
        const projectList = document.createElement('ol');

        data.projects.forEach((project) => {
            const li = document.createElement('li');
            li.innerHTML = `<span><a href="${project.link}">${project.name}</a> ... <span>[</span> ${project.technologies} <span>]</span></span>`;
            projectList.appendChild(li);
        });

        projectsSection.appendChild(projectList);

        // Experience
        const experienceSection = document.querySelector('.experience');

        data.experience.forEach((item) => {
            const article = document.createElement('article');

            const h4 = document.createElement('h4');
            h4.classList.add('subtitle');
            h4.innerHTML = `<span>${item.title}</span> ${item.place}`;
            article.appendChild(h4);

            const p = document.createElement('p');
            p.classList.add('date-location');
            p.innerHTML = `${item.date} <span>|</span> ${item.location}`;
            article.appendChild(p);

            const ul = document.createElement('ul');
            item.details.forEach((detail) => {
                const li = document.createElement('li');
                li.innerHTML = `${detail}`;
                ul.appendChild(li);
            });
            article.appendChild(ul);

            experienceSection.appendChild(article);
        });

        // Hobbies
        const hobbiesSection = document.querySelector('.hobbies-and-interests');
        const dlHobbies = document.createElement('dl');

        data["hobbies-and-interests"].forEach((hobby) => {
            const dd = document.createElement('dd');
            dd.textContent = hobby;
            dlHobbies.appendChild(dd);
        });

        hobbiesSection.appendChild(dlHobbies);

        // ------------------------------
        // Sidebar
        // Sidebar: Contacts
        const contactsSection = document.querySelector('.contacts');
        const contactsDiv = document.createElement('div');
        // Phones
        const pPhones = document.createElement('p');
        pPhones.innerHTML = '<span>C:</span>';
        Object.keys(data.contacts.phone).forEach((phoneKey) => {
            pPhones.innerHTML += ` <a href="${data.contacts.phone[phoneKey]}">[${phoneKey}]</a>`;
        });
        contactsDiv.appendChild(pPhones);
        // Email
        const pEmails = document.createElement('p');
        pEmails.innerHTML = '<span>E:</span>';
        Object.keys(data.contacts.email).forEach((emailKey) => {
            pEmails.innerHTML += ` <a href="${data.contacts.email[emailKey]}">${emailKey}</a>`;
        });
        contactsDiv.appendChild(pEmails);
        contactsSection.appendChild(contactsDiv);

        // Sidebar: Hart Skills
        const techSkillsSection = document.querySelector('.hard-skills');
        const hardList = document.createElement('ul');
        data.skills.hard.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${skill}</span>`;
            hardList.appendChild(li);
        });
        techSkillsSection.appendChild(hardList);

        // Sidebar: Soft Skills
        const softSkillsSection = document.querySelector('.soft-skills');
        const softList = document.createElement('ul');
        data.skills.soft.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${skill}</span>`;
            softList.appendChild(li);
        });
        softSkillsSection.appendChild(softList);

        // Sidebar: Languages
        const languageSection = document.querySelector('.language');
        const langList = document.createElement('ul');
        data.languages.forEach(lang => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${lang.language} ‒ ${lang.level}</span>`;
            langList.appendChild(li);
        });
        languageSection.appendChild(langList);

        // Sidebar: Links
        const linksSection = document.querySelector('.link');
        const linksList = document.createElement('ul');
        Object.keys(data.links).forEach(linkKey => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${data.links[linkKey]}">${linkKey}</a>`;
            linksList.appendChild(li);
        });
        linksSection.appendChild(linksList);

    } catch(error) {
        console.error("Error loading data:", error);
    }
});
