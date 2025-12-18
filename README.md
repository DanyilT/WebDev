# Resume Builder

A static resume builder web application that generates professional resumes without storing any data on servers.

## 🖼 Pages

**CloudFlare Pages:** [danyilt-resume-builder.pages.dev](https://danyilt-resume-builder.pages.dev)

> [!TIP]  
> This project is linked to **CloudFlare Pages**  
> Any changes pushed to the `page/resume-builder` branch will automatically deploy a new version of the site. (so it always up-to-date with the repository)

## ✨ Features

- **Static Website** — No backend, no data stored on servers
- **Local Cache** — Save/load your resume data in browser storage
- **PDF Preview** — View and download your resume as PDF
- **JSONBin Integration** — Upload resume data to JSONBin.io for sharing
- **Export/Import** — Export resume data as JSON file

## 🚪 Usage

### Building Your Resume

1. Fill in the form fields (name, subtitle, about, etc.)
2. Use the **Save** button to cache your data locally
3. Click **Preview** to view and download as PDF (`?preview`)

### Sharing Your Resume

1. Click **Save Online** to upload data to JSONBin.io
2. Copy your bin ID
3. Share your resume via: `https://danyilt-resume-builder.pages.dev/resume.html?bin=YOUR_BIN_ID`

> [!WARNING]  
> Your bin must be **public**, so the resume generator can access (read) your data.

> [!CAUTION]  
> Note that making your bin public has security implications.  
> Because JSONBin.io public bins are readable and writable by anyone with the bin ID:  
> It will allow anyone with your public bin ID to read/write data from/to your bin.

## 💉 Local Development

1. **Clone the repository and switch to the resume-builder branch:**
    ```bash
    # Clone the repository
    git clone https://github.com/DanyilT/WebDev.git --single-branch --branch page/resume-builder resume-builder
    cd resume-builder
    ````

2. **Open `index.html` in your browser:**
    ```bash
    open index.html
    ```

3. ***Alternatively*, serve the project using a local server:**  
   Using `serve`:
    ```bash
    npx serve .
    ```
   Or using Python:
    ```bash
    python -m http.server 8000
    ```

## 🔬 Project Structure

```
├── index.html       # Resume builder form
├── resume.html      # Resume display page
├── js/
│   ├── builder/     # Helpers for builder
│   │   ├── notifications.js    # Notification handling
│   │   └── utils.js            # Utility functions
│   ├── builder.js   # Main application logic
│   └── resume.js    # Resume generation logic
├── css/
│   ├── builder.css  # Main application styles
│   └── resume.css   # Resume styles
├── images/
│   └── favicon.ico  # Default favicon
├── data/
│   └── default.json # Default resume schema and content
├── LICENSE
└── README.md
```

## 🚽 Source Code

[GitHub Repository](https://github.com/DanyilT/WebDev/tree/page/resume-builder)

## 🎀 License

This project is licensed under the [MIT License](https://opensource.org/license/mit). See the [LICENSE](LICENSE) file for details.
