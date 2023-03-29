function set_colors(mode) {
    let html = document.querySelector("html");
    html.classList.remove("light-mode");
    html.classList.remove("dark-mode");
    html.classList.add(`${mode}-mode`);
    document.querySelector(".toggle-colors").innerHTML = `${mode} mode`;
    localStorage.setItem("theme", mode);
}

window.addEventListener("load", function () {
    document.querySelector(".toggle-colors").addEventListener("click", function(ev) {
        let html = document.querySelector("html");
        if (html.classList.contains("light-mode")) {
            set_colors("dark");
        } else {
            set_colors("light");
        }
    });

    let is_dark = localStorage.getItem("theme") == "dark";
    if (is_dark) {
        set_colors("dark");
    } else {
        set_colors("light");
    }

    document.querySelectorAll(".accordion-toggle").forEach((elem) => {
        elem.addEventListener("click", () => {
            elem.classList.toggle("active");

            let panel = elem.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });

        let panel = elem.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + "px";
    });
});

