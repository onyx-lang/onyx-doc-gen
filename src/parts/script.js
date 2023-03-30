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

    let fuse = new Fuse(window.PACKAGE_INDEX, {
        keys: ['name', 'package_name']
    });

    let searchbar = document.querySelector("#package-search");
    searchbar.addEventListener("focus", function(ev) {
        document.querySelector(".search-results").style.display = "initial";
    });
    searchbar.addEventListener("unfocus", function(ev) {
        document.querySelector(".search-results").style.display = "none";
    });

    searchbar.addEventListener("input", function(ev) {
        let result_html = "";
        let results = fuse.search(ev.target.value, { limit: 5 });
        for (let res of results) {
            let redirection = `/packages/${res.item.package}.html#${res.item.name}`;
            let name = res.item.name;

            result_html += `
                <li data-redirect="${redirection}">
                    <span class="search-result-badge">${res.item.type}</span>
                    <span class="search-result-name">${name}</span>
                    <span class="search-result-package">${res.item.package}</span>
                </li>
            `;
        }

        document.querySelector(".search-results").innerHTML = result_html;
        document.querySelectorAll(".search-results li").forEach(e => {
            e.addEventListener("click", (ev) => {
                document.querySelector(".search-results").style.display = "none";
                window.location.href = e.getAttribute("data-redirect");
            });
        });
    });

    searchbar.addEventListener("keydown", function (ev) {
        if (ev.key == 'Enter') {
            let li = document.querySelector(".search-results :first-child");

            window.location.href = li.getAttribute("data-redirect");
        }
    });
});

