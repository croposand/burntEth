const button = document.getElementById("themeToggler");

const toggleTheme = (theme) => {
    document.getElementsByTagName("html")[0].dataset.theme = theme;
    localStorage.setItem("theme", theme)
}

let d = localStorage.getItem("theme");
if (!d) d = "light";
toggleTheme(d);

button.onclick = () => {
    toggleTheme(d = d == "light" ? "dark" : "light")
}