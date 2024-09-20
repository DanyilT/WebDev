# WebDev

This repository contains various website projects. Below is a list of the projects along with their URLs.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features / WebSites](#features--websites)
- [Requirements](#requirements)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## Features / WebSites

### [Portfolio Website](PersonalPortfolio)
A portfolio showcasing my projects and skills.
- **URL:** [Portfolio Website](https://danyilt.github.io/WebDev/PersonalPortfolio/)

[//]: # (- **URL:** [Portfolio Website]&#40;https://dany-portfolio.netlify.app/&#41;)

### [ChillZone Website](ChillZone)
A website for a relaxation and entertainment zone.
- **URL:** [ChillZone Website](https://danyilt.github.io/WebDev/ChillZone/)

[//]: # (- **URL:** [ChillZone Website]&#40;https://danyt-chillzone.com&#41;)

### [Blockchain Visualisation](SphereChain)
A visual representation of blockchain technology.
- **URL:** [Blockchain Visualisation](https://danyilt.github.io/WebDev/SphereChain/)

[//]: # (- **URL:** [Blockchain Visualisation]&#40;https://danyt-spherechain.online&#41;)

### [ATB Market](ATB-Market)
A website for the best grocery store.
- **URL:** [ATB Market](https://danyilt.github.io/WebDev/ATB-Market/)

### [Coffee Shop Example](CoffeeShop)
A sample website for a coffee shop.
- **URL:** [Coffee Shop Example](https://danyilt.github.io/WebDev/CoffeeShop/index.html)

[//]: # (- **URL:** [Coffee Shop Example]&#40;https://espressoempire.000webhostapp.com&#41;)

### [Win95](win95)
A ~~nostalgic~~ recreation of the Windows 95 interface.
- **URL:** [Win95](https://danyilt.github.io/WebDev/win95/)

[//]: # (- **URL:** [Win95]&#40;https://project-win95.danytyma.repl.co/&#41;)

### [My CV](Resume)
An online resume showcasing my skills and experience.
- **URL:** [My CV](https://danyilt.github.io/WebDev/Resume/)

[//]: # (- **URL:** [My CV]&#40;https://danyil-tymchuk-resume.netlify.app&#41;)

## Requirements

This is WebDev repository, so you need a web browser to view the websites. Also, if you want you can use local server to run the websites.

- Web browser
- Localhost server (optional)

### Installation

#### Web Browser

I don't want to teach you how install a web browser. How you even got here without one?

Ask Google... Oh wait, you don't have a browser...

#### Localhost Server

You can use a localhost server to run the websites locally. Here are some options:

- **Python**:
    - Install Python from the [official website](https://www.python.org/).
    - Run the following command in the terminal in the repository directory to start the server:
        - Windows:
            ```bash
            python -m http.server
            ```
        - macOS/Linux:
            ```bash
            python3 -m http.server
            ```
    - Open the browser and go to `http://localhost:8000/`.
    - Navigate to the desired website.

## Usage

### Clone the Repository

#### Using Git

1. Install Git
    - If you don't have Git installed, you can download and install it from the [official Git website](https://git-scm.com/downloads).
2. Clone the repository:
    ```sh
    git clone https://github.com/DanyilT/WebDev.git
    ```
3. Navigate to the project folder:
    ```sh
   cd <project-folder>
    ```

#### Downloading the ZIP File

1. Download the ZIP file from the [GitHub repository](https://github.com/DanyilT/WebDev.git) and extract it.
2. Navigate to the project folder in the extracted directory.

### Running the Project

#### Using a Localhost Server

- Example for Python 3:
    - Install Python 3 if you haven't already from the [official website](https://www.python.org/).
    - Run localhost server `python -m http.server`(for Windows) or `python3 -m http.server`(for macOS/Linux) in the project folder terminal.
    - Open your web browser and go to [`http://localhost:8000`](http://localhost:8000).

#### Opening the `index.html` File in a Web Browser

- Double-click the Project's `index.html` file to open it in your web browser.

#### Using GitHub Pages

- Go to the [ChillZone website](https://danyilt.github.io/WebDev/).

## File Structure

The repository is structured as follows:

- [`ATB-Market/..`](ATB-Market): ATB Market website project.
    - [`index.html`](ATB-Market/index.html): Main HTML file for the website.
    - [`README.md`](ATB-Market/README.md): Documentation for the ATB Market website.

- [`ChillZone/..`](ChillZone): ChillZone website project.
    - [`index.html`](ChillZone/index.html): Main HTML file for the website.
    - [`README.md`](ChillZone/README.md): Documentation for the ChillZone website.

- [`CoffeeShop/..`](CoffeeShop): Coffee Shop Example website project.
    - [`index.html`](CoffeeShop/index.html): Main HTML file for the website.
    - [`README.md`](CoffeeShop/README.md): Documentation for the Coffee Shop Example website.

- [`PersonalPortfolio/..`](PersonalPortfolio): Portfolio Website project.
    - [`index.html`](PersonalPortfolio/index.html): Main HTML file for the website.
    - [`README.md`](PersonalPortfolio/README.md): Documentation for the Portfolio Website.

- [`Resume/..`](Resume): My CV website project.
    - [`index.html`](Resume/index.html): Main HTML file for the website.
    - [`README.md`](Resume/README.md): Documentation for the My CV website.

- [`SphereChain/..`](SphereChain): Blockchain Visualisation website project.
    - [`index.html`](SphereChain/index.html): Main HTML file for the website.
    - [`README.md`](SphereChain/README.md): Documentation for the Blockchain Visualisation website.

- [`win95/..`](win95): Win95 website project.
    - [`index.html`](win95/index.html): Main HTML file for the website.
    - [`README.md`](win95/README.md): Documentation for the Win95 website.

- [`.gitignore`](.gitignore): Git ignore file to exclude certain files and directories from version control.
- [`LICENSE`](LICENSE): License information for the repository.
- [`README.md`](README.md): Main documentation file for the repository.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Add some feature"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.
