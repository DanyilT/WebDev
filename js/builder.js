import { showNotification } from './builder/notification.js';
import { formatSectionName } from './builder/utils.js';

/* ==================== GLOBAL STATE ==================== */

let resumeData = null;

/* ==================== INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', async function() {
    // Load default schema and data
    resumeData = await loadDefaultContent();

    // Setup Option 1: Upload handlers
    setupUploadHandlers();

    // Setup Option 2: Form handlers (initialized empty)
    setupFormHandlers();

    // Initialize forms with default data
    await initializeDefaultForms();

    // Setup Action buttons
    setupActionButtons();
});

async function loadDefaultContent() {
    try {
        const response = await fetch('data/default.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading default data:', error);
        console.warn('Loading empty resume data.');
        return {
            customization: {
                primaryColor: '#6F00FF',
                fontFamily: 'Montserrat',
                fontSize: '10pt',
                photoUrl: ''
            },
            about: {
                subtitle: '',
                name: '',
                description: '',
                about: ''
            },
            sections: {
                main: {},
                side: {}
            }
        };
    }
}

/* ==================== UPLOAD HANDLERS (Option 1) ==================== */

function setupUploadHandlers() {
    const dropZone = document.getElementById('dropZone');
    const jsonUpload = document.getElementById('jsonUpload');
    const loadJsonUrlBtn = document.getElementById('loadJsonUrl');

    // Drag and drop
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/json') {
                processJsonFile(file);
            } else {
                showNotification('Please upload a valid JSON file', 'error');
            }
        });
    }

    // File upload via click
    if (jsonUpload) {
        jsonUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processJsonFile(file);
            }
            e.target.value = '';
        });
    }

    // Load from URL
    if (loadJsonUrlBtn) {
        loadJsonUrlBtn.addEventListener('click', handleUrlLoad);
    }
}

function processJsonFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            loadDataIntoBuilder(data);
            showNotification('JSON loaded successfully!', 'success');
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showNotification('Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
}

async function handleUrlLoad() {
    const urlInput = document.getElementById('jsonUrl');
    const url = urlInput?.value.trim();

    if (!url) {
        showNotification('Please enter a URL', 'error');
        return;
    }

    let fetchUrl = url;
    let headers = {};

    // Check if it's a JSONBin URL
    if (url.includes('jsonbin.io')) {
        // Ensure we're using the correct API endpoint
        if (!url.includes('/b/')) {
            showNotification('Invalid JSONBin URL format', 'error');
            return;
        }

        // Add /latest if not present
        if (!url.endsWith('/latest')) {
            fetchUrl = url + '/latest';
        }
    }

    try {
        // First attempt: try without API key (public bin)
        let response = await fetch(fetchUrl, { headers });

        // If access denied, prompt for API key and retry
        if (response.status === 401 || response.status === 403) {
            const key = prompt('Access denied. Enter your JSONBin.io API key:');
            if (!key || !key.trim()) {
                showNotification('API key is required for private bins', 'error');
                return;
            }

            let header = prompt('Enter the header type for your API key:\n1 for X-Master-Key\n2 for X-Access-Key', '1');
            header = header === '1' ? 'X-Master-Key' : header === '2' ? 'X-Access-Key' : null;
            if (!header) {
                showNotification('Invalid header type selected', 'error');
                return;
            }

            headers[header] = key.trim();
            response = await fetch(fetchUrl, { headers });
        }

        if (!response.ok) {
            showNotification(`Failed to load: ${response.statusText}`, 'error');
            return;
        }

        const result = await response.json();

        // JSONBin wraps data in a 'record' property
        const data = result.record || result;

        loadDataIntoBuilder(data);
        showNotification('Data loaded from URL successfully!', 'success');

    } catch (error) {
        console.error('Error loading from URL:', error);
        showNotification('Failed to load data from URL', 'error');
    }
}

function loadDataIntoBuilder(data) {
    resumeData = { ...resumeData, ...data };    // Store the loaded data
    populateForms();    // Populate all forms with the loaded data
}

/* ==================== FORM POPULATION ==================== */

function populateForms() {
    populateCustomization();    // Populate customization
    populateAboutSection();     // Populate about section
    generateDynamicSections();  // Generate and populate dynamic sections
}

function populateCustomization() {
    const { customization } = resumeData;
    if (!customization) return;

    const primaryColor = document.getElementById('primaryColor');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const photoUrl = document.getElementById('photoUrl');

    if (primaryColor && customization.primaryColor) {
        primaryColor.value = customization.primaryColor;
        document.documentElement.style.setProperty('--primary-color', customization.primaryColor);
    }

    if (fontFamily && customization.fontFamily) {
        fontFamily.value = customization.fontFamily;
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${customization.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(fontLink);
        document.documentElement.style.setProperty('--font-family', `'${customization.fontFamily}', sans-serif`);
    }

    if (fontSize && customization.fontSize) {
        // If font size not in select options, create this option
        // If just a number, default to pt. Otherwise use exactly what's in JSON.
        if (!Array.from(fontSize.options).some(opt => opt.value === customization.fontSize)) {
            const formattedFontSize = /^\d+(\.\d+)?$/.test(customization.fontSize) ? customization.fontSize + 'pt' : customization.fontSize;
            const option = document.createElement('option');
            option.value = formattedFontSize;
            option.textContent = formattedFontSize;
            fontSize.appendChild(option);
            fontSize.value = formattedFontSize;
        } else {
            fontSize.value = customization.fontSize || '10pt';
        }
    }

    if (photoUrl && customization.photoUrl) {
        photoUrl.value = customization.photoUrl;
        // Trigger preview update
        const event = new Event('input');
        photoUrl.dispatchEvent(event);
    }
}

function populateAboutSection() {
    const { about } = resumeData;
    if (!about) return;

    const fields = ['subtitle', 'name', 'about'];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input && about[field]) {
            input.value = about[field];
        }
    });
}

/* ==================== FORM HANDLERS (Option 2) ==================== */

function setupFormHandlers() {
    // Setup customization handlers
    setupColorPicker('primaryColor');
    setupFontSelector('fontFamily');
    setupFontSizeSelector('fontSize');
    setupPhotoPreview('photoUrl', 'photoPreview');

    // About section change handlers
    ['subtitle', 'name', 'description', 'about'].forEach(field => {
        document.getElementById(field)?.addEventListener('input', (e) => {
            resumeData.about[field] = e.target.value;
        });
    });
}

function setupColorPicker(elementId) {
    const colorInput = document.getElementById(elementId);
    if (!colorInput) return;

    const color = resumeData.customization?.primaryColor || '#6F00FF';
    colorInput.value = color;
    document.documentElement.style.setProperty('--primary-color', color);

    colorInput.addEventListener('change', (e) => {
        resumeData.customization.primaryColor = e.target.value;
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });
}

function setupFontSelector(elementId) {
    const fontSelect = document.getElementById(elementId);
    if (!fontSelect) return;

    const fontFamily = resumeData.customization?.fontFamily || 'Montserrat';
    fontSelect.value = fontFamily;

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(fontLink);
    document.documentElement.style.setProperty('--font-family', `'${fontFamily}', sans-serif`);

    fontSelect.addEventListener('change', (e) => {
        resumeData.customization.fontFamily = e.target.value;
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${e.target.value.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(fontLink);
        document.documentElement.style.setProperty('--font-family', `'${e.target.value}', sans-serif`);
    });
}

function setupFontSizeSelector(elementId) {
    const fontSizeSelect = document.getElementById(elementId);
    if (!fontSizeSelect) return;

    fontSizeSelect.value = resumeData.customization?.fontSize || '10pt';

    fontSizeSelect.addEventListener('change', (e) => {
        resumeData.customization.fontSize = e.target.value;
        // Don't change font size inside the builder
    });
}

function setupPhotoPreview(elementId, previewId) {
    const photoInput = document.getElementById(elementId);
    const preview = document.getElementById(previewId);
    if (!photoInput || !preview) return;

    updatePreview();
    photoInput.addEventListener('input', updatePreview);

    function updatePreview() {
        const url = photoInput.value.trim();
        if (url) {
            if (preview.parentElement && preview.parentElement.tagName === 'A') {
                preview.parentElement.href = url;
            }
            preview.src = url;
            preview.style.display = 'block';
            preview.onerror = () => {
                preview.style.display = 'none';
            };
        } else {
            preview.style.display = 'none';
        }
    }
}

async function initializeDefaultForms() {
    if (!resumeData) {
        resumeData = await loadDefaultContent();
    } else {
        resumeData = JSON.parse(JSON.stringify(resumeData));
    }
    generateDynamicSections();
}

/* ==================== DYNAMIC SECTION GENERATION ==================== */

function generateDynamicSections() {
    const formSection = document.querySelector('.form-section');
    if (!formSection) return;

    // Clear existing dynamic fieldsets
    formSection.querySelectorAll('.sections-container, .custom-section-builder, .dynamic-fieldset').forEach(el => el.remove());

    // Build main sections
    if (resumeData.sections?.main) {
        const mainContainer = createSectionsContainer('Main Sections', 'mainSections');
        buildSectionForms(mainContainer, resumeData.sections.main, 'main');
        formSection.appendChild(mainContainer);
    }

    // Build side sections
    if (resumeData.sections?.side) {
        const sideContainer = createSectionsContainer('Sidebar Sections', 'sideSections');
        buildSectionForms(sideContainer, resumeData.sections.side, 'side');
        formSection.appendChild(sideContainer);
    }

    // Add custom section builder
    formSection.appendChild(createCustomSectionBuilder());
    setupCustomSectionBuilder();
}

function createSectionsContainer(title, id) {
    const container = document.createElement('div');
    container.className = 'sections-container';
    container.id = id;
    container.innerHTML = `<h3>${title}</h3>`;
    return container;
}

function buildSectionForms(container, sections, location) {
    Object.entries(sections).forEach(([key, section]) => {
        const fieldset = createSectionFieldset(key, section, location);
        container.appendChild(fieldset);
    });
}

function createSectionFieldset(key, section, location) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'form-fieldset dynamic-fieldset';
    fieldset.dataset.sectionKey = key;
    fieldset.dataset.location = location;

    const legend = document.createElement('legend');
    legend.textContent = formatSectionName(key);
    fieldset.appendChild(legend);

    const typeLabel = document.createElement('span');
    typeLabel.className = 'section-type-label';
    typeLabel.textContent = `Type: ${section.type}`;
    fieldset.appendChild(typeLabel);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-data';

    switch (section.type) {
        case 'list':
            createListForm(contentDiv, key, section, location);
            break;
        case 'text-list':
            createTextListForm(contentDiv, key, section, location);
            break;
        case 'text':
            createTextForm(contentDiv, key, section, location);
            break;
        case 'links':
            createLinksForm(contentDiv, key, section, location);
            break;
        case 'categorized-list':
            createCategorizedListForm(contentDiv, key, section, location);
            break;
    }

    fieldset.appendChild(contentDiv);
    return fieldset;
}

/* ==================== FORM TYPE CREATORS ==================== */

function createListForm(container, key, section, location) {
    const items = section.items || [];

    // Detect if the only item is an empty placeholder
    if (items.length === 1 && !section._template) {
        const isPlaceholder = Object.values(items[0]).every(val =>
            val === "" || (Array.isArray(val) && val.length === 0)
        );

        // If it is a placeholder, save its structure and remove it from the list
        if (isPlaceholder) {
            section._template = JSON.parse(JSON.stringify(items[0]));
            items.pop();
        }
    }

    // Use the saved template, or the first item, or an empty object
    const template = section._template || items[0] || {};

    items.forEach((item, index) => {
        const card = createListEntryCard(key, template, item, index, location);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-btn';
    addBtn.textContent = `+ Add ${formatSectionName(key)} Entry`;
    addBtn.addEventListener('click', () => {
        const newItem = {};
        Object.keys(template).forEach(k => {
            newItem[k] = Array.isArray(template[k]) ? [] : '';
        });
        resumeData.sections[location][key].items.push(newItem);
        const newIndex = resumeData.sections[location][key].items.length - 1;
        const card = createListEntryCard(key, template, newItem, newIndex, location);
        container.insertBefore(card, addBtn);
    });
    container.appendChild(addBtn);
}

function createListEntryCard(key, template, item, index, location) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.index = index;

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '0.5rem';

    const title = document.createElement('strong');
    title.textContent = `Entry ${index + 1}`;
    header.appendChild(title);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        resumeData.sections[location][key].items.splice(index, 1);
        card.remove();
        // Re-index remaining cards
        const container = card.parentElement;
        container.querySelectorAll('.entry-card').forEach((c, i) => {
            c.dataset.index = i;
            c.querySelector('strong').textContent = `Entry ${i + 1}`;
        });
    });
    header.appendChild(removeBtn);
    card.appendChild(header);

    Object.keys(template).forEach(fieldKey => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = formatSectionName(fieldKey);
        group.appendChild(label);

        if (Array.isArray(template[fieldKey])) {
            // Handle array fields (like details)
            const textarea = document.createElement('textarea');
            textarea.value = (item[fieldKey] || []).join('\n');
            textarea.placeholder = `Enter each ${fieldKey} on a new line`;
            textarea.rows = 3;
            textarea.addEventListener('input', (e) => {
                resumeData.sections[location][key].items[index][fieldKey] =
                    e.target.value.split('\n').filter(v => v.trim());
            });
            group.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item[fieldKey] || '';
            input.placeholder = fieldKey;
            input.addEventListener('input', (e) => {
                resumeData.sections[location][key].items[index][fieldKey] = e.target.value;
            });
            group.appendChild(input);
        }

        card.appendChild(group);
    });

    return card;
}

function createTextListForm(container, key, section, location) {
    const items = section.items || [];

    const listDiv = document.createElement('div');
    listDiv.className = 'text-list-entries';

    items.forEach((text, index) => {
        const entry = createTextListEntry(key, text, index, location, listDiv);
        listDiv.appendChild(entry);
    });

    container.appendChild(listDiv);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-btn';
    addBtn.textContent = `+ Add Item`;
    addBtn.addEventListener('click', () => {
        resumeData.sections[location][key].items.push('');
        const newIndex = resumeData.sections[location][key].items.length - 1;
        const entry = createTextListEntry(key, '', newIndex, location, listDiv);
        listDiv.appendChild(entry);
    });
    container.appendChild(addBtn);
}

function createTextListEntry(key, value, index, location) {
    const entry = document.createElement('div');
    entry.className = 'form-group';
    entry.style.display = 'flex';
    entry.style.gap = '0.5rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.style.flex = '1';
    input.addEventListener('input', (e) => {
        resumeData.sections[location][key].items[index] = e.target.value;
    });
    entry.appendChild(input);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
        resumeData.sections[location][key].items.splice(index, 1);
        entry.remove();
    });
    entry.appendChild(removeBtn);

    return entry;
}

function createTextForm(container, key, section, location) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const textarea = document.createElement('textarea');
    textarea.value = section.content || '';
    textarea.rows = 4;
    textarea.addEventListener('input', (e) => {
        resumeData.sections[location][key].content = e.target.value;
    });
    group.appendChild(textarea);

    container.appendChild(group);
}

function createLinksForm(container, key, section, location) {
    const items = section.items || {};
    const linksDiv = document.createElement('div');
    linksDiv.className = 'links-entries';

    Object.entries(items).forEach(([label, url], index) => {
        const entry = createLinkEntry(key, label, url, index, location, linksDiv);
        linksDiv.appendChild(entry);
    });

    container.appendChild(linksDiv);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-btn';
    addBtn.textContent = `+ Add Link`;
    addBtn.addEventListener('click', () => {
        const newLabel = `link${Object.keys(resumeData.sections[location][key].items).length + 1}`;
        resumeData.sections[location][key].items[newLabel] = '';
        const entry = createLinkEntry(key, newLabel, '', Object.keys(items).length, location, linksDiv);
        linksDiv.appendChild(entry);
    });
    container.appendChild(addBtn);
}

function createLinkEntry(key, label, url, index, location) {
    const entry = document.createElement('div');
    entry.className = 'form-group';
    entry.style.display = 'flex';
    entry.style.gap = '0.5rem';
    entry.dataset.originalLabel = label;

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.value = label;
    labelInput.placeholder = 'Label';
    labelInput.style.width = '120px';
    labelInput.addEventListener('input', (e) => {
        const oldLabel = entry.dataset.originalLabel;
        const newLabel = e.target.value;
        const oldValue = resumeData.sections[location][key].items[oldLabel];
        delete resumeData.sections[location][key].items[oldLabel];
        resumeData.sections[location][key].items[newLabel] = oldValue;
        entry.dataset.originalLabel = newLabel;
    });
    entry.appendChild(labelInput);

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.value = url;
    urlInput.placeholder = 'https://...';
    urlInput.style.flex = '1';
    urlInput.addEventListener('input', (e) => {
        const currentLabel = entry.dataset.originalLabel;
        resumeData.sections[location][key].items[currentLabel] = e.target.value;
    });
    entry.appendChild(urlInput);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
        const currentLabel = entry.dataset.originalLabel;
        delete resumeData.sections[location][key].items[currentLabel];
        entry.remove();
    });
    entry.appendChild(removeBtn);

    return entry;
}

function createCategorizedListForm(container, key, section, location) {
    const items = section.items || {};

    Object.entries(items).forEach(([category, values]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-group';

        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = formatSectionName(category);
        categoryDiv.appendChild(categoryTitle);

        const entriesDiv = document.createElement('div');
        entriesDiv.className = 'category-entries';

        (values || []).forEach((value, index) => {
            const entry = createCategoryItemEntry(key, category, value, index, location, entriesDiv);
            entriesDiv.appendChild(entry);
        });

        categoryDiv.appendChild(entriesDiv);

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'add-btn';
        addBtn.textContent = `+ Add ${formatSectionName(category)}`;
        addBtn.addEventListener('click', () => {
            if (!resumeData.sections[location][key].items[category]) {
                resumeData.sections[location][key].items[category] = [];
            }
            resumeData.sections[location][key].items[category].push('');
            const newIndex = resumeData.sections[location][key].items[category].length - 1;
            const entry = createCategoryItemEntry(key, category, '', newIndex, location, entriesDiv);
            entriesDiv.appendChild(entry);
        });
        categoryDiv.appendChild(addBtn);

        container.appendChild(categoryDiv);
    });
}

function createCategoryItemEntry(key, category, value, index, location) {
    const entry = document.createElement('div');
    entry.className = 'form-group';
    entry.style.display = 'flex';
    entry.style.gap = '0.5rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.style.flex = '1';
    input.addEventListener('input', (e) => {
        resumeData.sections[location][key].items[category][index] = e.target.value;
    });
    entry.appendChild(input);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
        resumeData.sections[location][key].items[category].splice(index, 1);
        entry.remove();
    });
    entry.appendChild(removeBtn);

    return entry;
}

/* ==================== CUSTOM SECTION BUILDER ==================== */

function createCustomSectionBuilder() {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'form-fieldset custom-section-builder collapsed';

    fieldset.innerHTML = `
        <legend class="toggle-legend">Add Custom Section</legend>
        <div class="custom-builder-content">
            <div class="form-group">
                <label for="customSectionName">Section Name:</label>
                <input type="text" id="customSectionName" placeholder="e.g., Something about youuuu... because you are very interesting person.... no...">
            </div>
            <div class="form-group">
                <label for="customSectionType">Section Type:</label>
                <select id="customSectionType">
                    <option value="list">List (objects with fields)</option>
                    <option value="text-list">Text List (array of strings)</option>
                    <option value="text">Text (single block)</option>
                    <option value="links">Links (label-url pairs)</option>
                    <option value="categorized-list">Categorized List</option>
                </select>
            </div>
            <div class="form-group">
                <label for="customSectionLocation">Location:</label>
                <select id="customSectionLocation">
                    <option value="main">Main Content</option>
                    <option value="side">Sidebar</option>
                </select>
            </div>
            <div id="customFieldsContainer" style="display:none;">
                <label>Fields (for list type):</label>
                <div id="customFieldsList"></div>
                <button type="button" class="add-btn" id="addCustomFieldBtn">+ Add Field</button>
            </div>
            <button type="button" class="btn btn-primary" id="createCustomSectionBtn" style="margin-top:1rem;">Create Section</button>
        </div>
    `;

    return fieldset;
}

function setupCustomSectionBuilder() {
    const builder = document.querySelector('.custom-section-builder');
    const legend = builder?.querySelector('.toggle-legend');
    const typeSelect = document.getElementById('customSectionType');
    const fieldsContainer = document.getElementById('customFieldsContainer');
    const addFieldBtn = document.getElementById('addCustomFieldBtn');
    const createBtn = document.getElementById('createCustomSectionBtn');

    legend?.addEventListener('click', () => {
        builder.classList.toggle('collapsed');
    });

    typeSelect?.addEventListener('change', (e) => {
        fieldsContainer.style.display = e.target.value === 'list' ? 'block' : 'none';
    });

    if (typeSelect && fieldsContainer) fieldsContainer.style.display = typeSelect.value === 'list' ? 'block' : 'none';

    addFieldBtn?.addEventListener('click', addCustomField);
    createBtn?.addEventListener('click', createCustomSection);
}

function addCustomField() {
    const list = document.getElementById('customFieldsList');
    const entry = document.createElement('div');
    entry.className = 'custom-field-entry';

    entry.innerHTML = `
        <input type="text" placeholder="Field name">
        <select>
            <option value="text">Text</option>
            <option value="array">Array</option>
        </select>
        <button type="button" class="remove-btn">×</button>
    `;

    entry.querySelector('.remove-btn').addEventListener('click', () => entry.remove());
    list.appendChild(entry);
}

function createCustomSection() {
    const name = document.getElementById('customSectionName')?.value?.trim();
    const type = document.getElementById('customSectionType')?.value;
    const location = document.getElementById('customSectionLocation')?.value;

    if (!name) {
        showNotification('Please enter a section name', 'error');
        return;
    }

    const key = name.toLowerCase().replace(/\s+/g, '-');

    // Build section structure
    let section = { type };

    switch (type) {
        case 'list':
            const fields = {};
            document.querySelectorAll('#customFieldsList .custom-field-entry').forEach(entry => {
                const fieldName = entry.querySelector('input').value.trim();
                const fieldType = entry.querySelector('select').value;
                if (fieldName) {
                    fields[fieldName] = fieldType === 'array' ? [] : '';
                }
            });
            section.items = Object.keys(fields).length ? [fields] : [{}];
            break;
        case 'text-list':
            section.items = [];
            break;
        case 'text':
            section.content = '';
            break;
        case 'links':
            section.items = {};
            break;
        case 'categorized-list':
            section.items = { category1: [] };
            break;
    }

    // Add to resumeData
    resumeData.sections[location][key] = section;

    // Add to UI
    const containerId = location === 'main' ? 'mainSections' : 'sideSections';
    const container = document.getElementById(containerId);

    if (container) {
        const fieldset = createSectionFieldset(key, section, location);
        container.appendChild(fieldset);
        showNotification(`Section "${name}" created!`, 'success');

        // Reset form
        document.getElementById('customSectionName').value = '';
        document.getElementById('customFieldsList').innerHTML = '';
        document.querySelector('.custom-section-builder')?.classList.add('collapsed');
    }
}

/* ==================== COLLECT FORM DATA ==================== */

function collectFormData() {
    // Customization
    resumeData.customization = {
        primaryColor: document.getElementById('primaryColor')?.value || '#6F00FF',
        fontFamily: document.getElementById('fontFamily')?.value || 'Montserrat',
        fontSize: document.getElementById('fontSize')?.value || '10pt',
        photoUrl: document.getElementById('photoUrl')?.value || ''
    };

    // About
    resumeData.about = {
        subtitle: document.getElementById('subtitle')?.value || '',
        name: document.getElementById('name')?.value || '',
        description: document.getElementById('description')?.value || '',
        about: document.getElementById('about')?.value || ''
    };

    // Sections - Main
    document.querySelectorAll('.main-sections .section-form').forEach(sectionForm => {
        const key = sectionForm.dataset.sectionKey;
        const type = sectionForm.dataset.sectionType;
        if (!key || !type) return;

        resumeData.sections.main[key] = collectSectionData(sectionForm, type);
    });

    // Sections - Side
    document.querySelectorAll('.side-sections .section-form').forEach(sectionForm => {
        const key = sectionForm.dataset.sectionKey;
        const type = sectionForm.dataset.sectionType;
        if (!key || !type) return;

        resumeData.sections.side[key] = collectSectionData(sectionForm, type);
    });

    return resumeData;
}

function collectSectionData(sectionForm, type) {
    const section = { type, items: type === 'links' || type === 'categorized-list' ? {} : [] };

    switch (type) {
        case 'list':
            sectionForm.querySelectorAll('.entry-card').forEach(card => {
                const item = {};
                card.querySelectorAll('input, textarea').forEach(input => {
                    const field = input.dataset.field;
                    if (field === 'details') {
                        item.details = input.value.split('\n').filter(d => d.trim());
                    } else if (field) {
                        item[field] = input.value;
                    }
                });
                section.items.push(item);
            });
            break;

        case 'text-list':
            sectionForm.querySelectorAll('.text-list-entry input').forEach(input => {
                if (input.value.trim()) {
                    section.items.push(input.value.trim());
                }
            });
            break;

        case 'text':
            const textarea = sectionForm.querySelector('textarea');
            section.content = textarea?.value || '';
            break;

        case 'links':
            sectionForm.querySelectorAll('.link-entry').forEach(entry => {
                const label = entry.querySelector('input[data-field="label"]')?.value;
                const url = entry.querySelector('input[data-field="url"]')?.value;
                if (label && url) {
                    section.items[label] = url;
                }
            });
            break;

        case 'categorized-list':
            sectionForm.querySelectorAll('.category-group').forEach(group => {
                const category = group.dataset.category;
                if (!category) return;
                section.items[category] = [];
                group.querySelectorAll('.category-item-entry input').forEach(input => {
                    if (input.value.trim()) {
                        section.items[category].push(input.value.trim());
                    }
                });
            });
            break;
    }

    return section;
}

/* ==================== ACTION BUTTONS ==================== */

function setupActionButtons() {
    document.getElementById('infoBtn')?.addEventListener('click', showInstructions);
    document.getElementById('saveCacheBtn')?.addEventListener('click', saveToCache);
    document.getElementById('loadCacheBtn')?.addEventListener('click', loadFromCache);
    document.getElementById('clearCacheBtn')?.addEventListener('click', clearCache);
    document.getElementById('previewBtn')?.addEventListener('click', previewResume);
    document.getElementById('generateBtn')?.addEventListener('click', generateResume);
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportJson);
    document.getElementById('saveOnlineBtn')?.addEventListener('click', saveOnline);

    // Dropdown toggle
    setupCacheDropdown();
}

function showInstructions() {
    const instructions = `Resume Builder Instructions:

    1. Upload existing JSON data or build from scratch
    2. Customize colors, fonts, and add your photo
    3. Fill in your personal information
    4. Add sections for education, experience, projects, etc.
    5. Use "Save to Cache" to store your progress locally
    6. "Preview" opens the resume in a new tab
    7. "Export JSON" downloads your data as a file
    8. "Save Online" uploads to JSONBin for sharing`.trim();

    const existing = document.getElementById('resumeInstructionsModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'resumeInstructionsModal';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        zIndex: '9999',
        padding: '1rem'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        background: 'var(--background-color, #fff)',
        color: 'var(--text-color, #111)',
        maxWidth: '720px',
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
        padding: '1rem',
        maxHeight: '80vh',
        overflow: 'auto',
        fontFamily: 'var(--font-family, sans-serif)'
    });

    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
            <strong>Resume Builder Instructions</strong>
            <button id="closeResumeInstructions" style="background:none;border:none;font-size:1.2rem;cursor:pointer">✕</button>
        </div>
        <pre style="white-space:pre-wrap;line-height:1.4;margin:0;font-family:inherit">${instructions}</pre>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    modal.querySelector('#closeResumeInstructions')?.addEventListener('click', close);

    const onKey = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
}

function setupCacheDropdown() {
    const toggle = document.querySelector('.dropdown-toggle');
    const menu = document.querySelector('.dropdown-menu');

    toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        menu?.classList.remove('show');
    });

    // Close dropdown when selecting an option
    menu?.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    });
}

function saveToCache(localStorageItem = 'resumeData') {
    try {
        collectFormData();
        localStorage.setItem(localStorageItem, JSON.stringify(resumeData));
        showNotification(`Data saved to cache successfully! (localStorage.${localStorageItem})`, 'success');
    } catch (error) {
        showNotification('Failed to save to cache: ' + error.message, 'error');
    }
}

function loadFromCache(localStorageItem = 'resumeData') {
    try {
        const cached = localStorage.getItem(localStorageItem);
        if (cached) {
            resumeData = JSON.parse(cached);
            populateForms();
            showNotification('Data loaded from cache!', 'success');
        } else {
            showNotification('No cached data found', 'error');
        }
    } catch (error) {
        showNotification('Failed to load from cache: ' + error.message, 'error');
    }
}

function clearCache(localStorageItem = 'resumeData') {
    if (confirm('Are you sure you want to clear cached data?')) {
        localStorage.removeItem(localStorageItem);
        showNotification('Cache cleared!', 'success');
    }
}

function previewResume() {
    saveToCache('previewResumeData');
    window.open('resume.html?preview', '_blank');
}

function generateResume() {
    // Remove existing modals if any
    document.getElementById('generateResumeNoticeModal')?.remove();
    document.getElementById('generateResumeUrlModal')?.remove();

    // Modal 1: Notice
    const noticeOverlay = document.createElement('div');
    noticeOverlay.id = 'generateResumeNoticeModal';
    Object.assign(noticeOverlay.style, {
        position: 'fixed',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        zIndex: '9999',
        padding: '1rem'
    });

    const noticeModal = document.createElement('div');
    Object.assign(noticeModal.style, {
        background: 'var(--background-color, #fff)',
        color: 'var(--text-color, #111)',
        maxWidth: '600px',
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
        padding: '1.5rem',
        maxHeight: '80vh',
        overflow: 'auto',
        fontFamily: 'var(--font-family, sans-serif)'
    });

    noticeModal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <strong style="font-size:1.2rem;color:var(--danger-color, red);">⚠ Important Notice</strong>
            <button class="close-modal-btn" style="background:none;border:none;font-size:1.2rem;cursor:pointer">✕</button>
        </div>
        <div style="line-height:1.6;font-size:0.95rem">
            <p><strong>This is a static website</strong> — it does not store any data and has no backend. Your data is not saved on our servers.</p>
            <hr style="margin:1rem">
            <p><strong>Options to use your resume:</strong></p>
            <ul style="margin:0.5rem 0 1rem 1.5rem">
                <li><strong id="noticeModalPreviewBtn" style="cursor: pointer">Preview Mode:</strong> Use the Preview button to view and download a PDF version of your resume.</li>
                <li><strong id="noticeModalSaveOnlineBtn" style="cursor: pointer">JSONBin Integration:</strong> Upload your resume data to JSONBin.io, then use the bin ID to generate content on the resume page.</li>
            </ul>
            <p><strong>How it works:</strong></p>
            <p>Visit <code>resume.html?bin=YOUR_BIN_ID</code> with your JSONBin bin ID as a GET parameter.</p>
            <hr style="margin:1rem; border-color:var(--danger-color, red);">
            <dl>
            <dt><strong>⚠️ Important:</strong></dt>
            <dd style="margin-bottom: 0.5em">For the bin to work with resume generation, it <strong>must be public</strong>. However, JSONBin doesn't provide public read-only bins, meaning anyone with the bin ID can modify it. JSONBin does use version control for unauthorized updates.</dd>
            <dt><strong>💡 Best Practice:</strong></dt>
            <dd>Always keep a local copy of your data, or store a backup in a separate private bin.</dd>
            </dl>
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1.5rem;flex-wrap:wrap">
            <button class="btn btn-secondary close-modal-btn" style="flex:1;min-width:120px">Cancel</button>
            <button class="btn btn-primary" id="noticeModalSaveOnlineBtn" style="flex:1;min-width:120px">Save Online</button>
            <button class="btn btn-primary" id="noticeModalContinueBtn" style="flex:1;min-width:120px">Continue →</button>
        </div>
    `;

    noticeOverlay.appendChild(noticeModal);
    document.body.appendChild(noticeOverlay);

    // Notice modal event handlers
    const closeNotice = () => noticeOverlay.remove();
    noticeOverlay.addEventListener('click', (e) => { if (e.target === noticeOverlay) closeNotice(); });
    noticeModal.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', closeNotice));

    document.getElementById('noticeModalPreviewBtn')?.addEventListener('click', () => {
        closeNotice();
        previewResume();
    });

    document.getElementById('noticeModalSaveOnlineBtn')?.addEventListener('click', () => {
        closeNotice();
        saveOnline();
    });

    document.getElementById('noticeModalContinueBtn')?.addEventListener('click', () => {
        closeNotice();
        showUrlModal();
    });

    // Modal 2: URL Generator
    function showUrlModal() {
        const urlOverlay = document.createElement('div');
        urlOverlay.id = 'generateResumeUrlModal';
        Object.assign(urlOverlay.style, {
            position: 'fixed',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '9999',
            padding: '1rem'
        });

        const pathname = window.location.pathname;
        let basePath;
        if (pathname.endsWith('builder.html')) {
            basePath = pathname.replace('builder.html', 'resume.html');
        } else if (pathname.endsWith('index.html')) {
            basePath = pathname.replace('index.html', 'resume.html');
        } else if (pathname.endsWith('/')) {
            basePath = pathname + 'resume.html';
        } else {
            basePath = pathname.replace(/[^/]+$/, 'resume.html');
        }
        const baseUrl = `${window.location.origin}${basePath}`;

        const urlModal = document.createElement('div');
        Object.assign(urlModal.style, {
            background: 'var(--background-color, #fff)',
            color: 'var(--text-color, #111)',
            maxWidth: '500px',
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
            padding: '1.5rem',
            fontFamily: 'var(--font-family, sans-serif)'
        });

        urlModal.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                <strong style="font-size:1.2rem">👾 Generate Resume URL</strong>
                <button class="close-modal-btn" style="background:none;border:none;font-size:1.2rem;cursor:pointer">✕</button>
            </div>
            <div class="form-group" style="margin-bottom:1rem">
                <label style="display:block;margin-bottom:0.5rem"><strong>Base URL:</strong></label>
                <input type="text" id="resumeBaseUrl" value="${baseUrl}" readonly style="width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px;background:#f5f5f5">
            </div>
            <div class="form-group" style="margin-bottom:1rem">
                <label style="display:block;margin-bottom:0.5rem"><strong>JSONBin Bin ID:</strong></label>
                <input type="text" id="resumeBinIdInput" placeholder="Enter your bin ID (e.g., 683a1b2c3d4e5f6g7h8i9j0k)" style="width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px">
            </div>
            <div class="form-group" style="margin-bottom:1rem">
                <label style="display:block;margin-bottom:0.5rem"><strong>Generated URL:</strong></label>
                <input type="text" id="generatedResumeUrl" value="${baseUrl}" readonly style="width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:4px;background:#f5f5f5">
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                <button class="btn btn-secondary close-modal-btn" style="flex:1;min-width:100px">Cancel</button>
                <button class="btn btn-primary" id="copyGeneratedUrlBtn" style="flex:1;min-width:100px">Copy URL</button>
                <button class="btn btn-primary" id="openGeneratedUrlBtn" style="flex:1;min-width:100px">Open URL</button>
            </div>
        `;

        urlOverlay.appendChild(urlModal);
        document.body.appendChild(urlOverlay);

        // URL modal event handlers
        const closeUrl = () => urlOverlay.remove();
        urlOverlay.addEventListener('click', (e) => { if (e.target === urlOverlay) closeUrl(); });
        urlModal.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', closeUrl));

        const binIdInput = document.getElementById('resumeBinIdInput');
        const generatedUrlInput = document.getElementById('generatedResumeUrl');

        binIdInput?.addEventListener('input', () => {
            const binId = binIdInput.value.trim();
            generatedUrlInput.value = binId ? `${baseUrl}?bin=${binId}` : baseUrl;
        });

        document.getElementById('copyGeneratedUrlBtn')?.addEventListener('click', async () => {
            const url = generatedUrlInput.value;
            await navigator.clipboard.writeText(url);
            showNotification('URL copied to clipboard!', 'success');
        });

        document.getElementById('openGeneratedUrlBtn')?.addEventListener('click', () => {
            const url = generatedUrlInput.value;
            window.open(url, '_blank');
        });

        // Escape key handler
        const onKey = (e) => { if (e.key === 'Escape') { closeUrl(); document.removeEventListener('keydown', onKey); } };
        document.addEventListener('keydown', onKey);
    }

    // Escape key handler for notice modal
    const onKeyNotice = (e) => { if (e.key === 'Escape') { closeNotice(); document.removeEventListener('keydown', onKeyNotice); } };
    document.addEventListener('keydown', onKeyNotice);
}

function exportJson() {
    collectFormData();
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

async function saveOnline() {
    const binId = prompt('Enter your JSONBin.io bin ID (leave empty to create new):');

    try {
        const data = collectFormData();
        let headers = { 'Content-Type': 'application/json' };

        if (binId && binId.trim()) {
            // Update existing bin
            const binUrl = `https://api.jsonbin.io/v3/b/${binId.trim()}`;

            // First attempt: try without API key (public bin)
            let response = await fetch(binUrl, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data)
            });

            // If access denied, prompt for API key and retry
            if (response.status === 401 || response.status === 403) {
                const apiKey = prompt('Access denied. Enter your JSONBin.io API key:');
                if (!apiKey || !apiKey.trim()) {
                    showNotification('API key is required for private bins', 'error');
                    return;
                }

                let header = prompt('Enter the header type for your API key:\n1 for X-Master-Key\n2 for X-Access-Key', '1');
                header = header === '1' ? 'X-Master-Key' : header === '2' ? 'X-Access-Key' : null;
                if (!header) {
                    showNotification('Invalid header type selected', 'error');
                    return;
                }

                headers[header] = apiKey.trim();
                response = await fetch(binUrl, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(data)
                });
            }

            if (!response.ok) {
                showNotification(`Failed to load: ${response.statusText}`, 'error');
                return;
            }

            await navigator.clipboard.writeText(binUrl);
            showNotification(`Updated! URL copied: ${binUrl}`, 'success');

        } else {
            // Create new bin - requires API key
            const apiKey = prompt('Enter your JSONBin.io API key to create a new bin:');
            if (!apiKey || !apiKey.trim()) {
                showNotification('API key is required to create a new bin', 'error');
                return;
            }

            let header = prompt('Enter the header type for your API key:\n1 for X-Master-Key\n2 for X-Access-Key', '1');
            header = header === '1' ? 'X-Master-Key' : header === '2' ? 'X-Access-Key' : null;
            if (!header) {
                showNotification('Invalid header type selected', 'error');
                return;
            }

            let response = await fetch('https://api.jsonbin.io/v3/b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [header]: apiKey.trim(),
                    'X-Bin-Private': 'false'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                showNotification(`Invalid API key or request failed: ${response.statusText}`, 'error');
                return;
            }

            const result = await response.json();
            const binUrl = `https://api.jsonbin.io/v3/b/${result.metadata.id}`;

            await navigator.clipboard.writeText(binUrl);
            showNotification(`Created! URL copied: ${binUrl}`, 'success');
        }
    } catch (error) {
        showNotification('Failed to save: ' + error.message, 'error');
    }
}
