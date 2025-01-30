document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});

// Dark mode styles
const style = document.createElement("style");
style.innerHTML = `
    .dark-mode {
        background-color: #121212;
        color: white;
    }
    .dark-mode .card {
        background-color: #333;
        color: white;
    }
    .dark-mode .navbar, .dark-mode .footer {
        background-color: #222;
    }
`;
document.head.appendChild(style);