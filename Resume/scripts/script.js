document.addEventListener("DOMContentLoaded", function() {
    // This function is autoscaling the main element to fit the viewport width
    function scaleMainToFitViewport() {
        const mainElement = document.querySelector(".main");
        const bodyElement = document.body;
        const viewportWidth = window.innerWidth;

        if (viewportWidth < mainElement.offsetWidth) {
            const widthScaleFactor = viewportWidth / (mainElement.offsetWidth + parseInt(window.getComputedStyle(bodyElement).marginLeft) + parseInt(window.getComputedStyle(bodyElement).marginRight));
            mainElement.style.transform = `scale(${widthScaleFactor})`;
            mainElement.style.transformOrigin = "top left";

            const scaledHeight = mainElement.offsetHeight * widthScaleFactor;
            bodyElement.style.height = `${scaledHeight}px`;
        } else {
            mainElement.style.transform = "scale(1)";
            bodyElement.style.height = "auto";
        }
    }

    scaleMainToFitViewport();

    window.addEventListener("resize", scaleMainToFitViewport);
});

// Buttons functionality
function toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element.style.display === "none" || element.style.display === "") {
        element.style.display = "block";
        element.classList.add("fade-in");
        element.classList.remove("fade-out");
    } else {
        element.classList.add("fade-out");
        setTimeout(() => {
            element.style.display = "none";
            element.classList.remove("fade-in");
            element.classList.remove("fade-out");
        }, 500);
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = "none";
}

function ButtonActivity(index) {
    const elementsToHide = ["1", "2", "3"];
    elementsToHide.forEach(id => {
        if (id !== index) {
            hideElement(id);
        }
    });
    toggleVisibility(index);
}

function qwerty() {
    alert("What? Why does this code here at all? 👀");
}
