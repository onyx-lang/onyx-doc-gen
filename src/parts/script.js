function make_resizer(divider_selector, css_prop_name, side, on_resize) {
    const elem = document.querySelector(divider_selector);
    if (!elem) return;
    const root = document.documentElement;

    let mx = 0;
    let my = 0;
    let left_width = 0;
    let top_height = 0;

    const mouse_move_handler = (e) => {
        let offset = 0;
        if (css_prop_name != null) {
            if (side == "left") {
                offset = Math.max(e.clientX - elem.parentNode.getBoundingClientRect().left, 4);
            } 
            if (side == "right") {
                offset = Math.max(elem.parentNode.getBoundingClientRect().right - e.clientX, 4);
            } 
            root.style.setProperty(css_prop_name, `${offset}px`);
        }

        document.body.style.cursor = 'col-resize';
        localStorage.setItem(css_prop_name, offset);
        if (on_resize != null) on_resize(e);
    };

    const mouse_up_handler = (e) => {
        document.removeEventListener("mousemove", mouse_move_handler);
        document.removeEventListener("mouseup",   mouse_up_handler);

        document.body.style.removeProperty("cursor");
    };

    const mouse_down_handler = (e) => {
        document.addEventListener("mousemove", mouse_move_handler);
        document.addEventListener("mouseup",   mouse_up_handler);
    };

    elem.addEventListener("mousedown", mouse_down_handler);
    if (localStorage.getItem(css_prop_name) != null) {
        root.style.setProperty(css_prop_name, `${localStorage.getItem(css_prop_name)}px`);
    }
}

window.addEventListener("load", function () {
    make_resizer(".divider.left", "--left-panel-width", "left", null);
    make_resizer(".divider.right", "--right-panel-width", "right", null);

    // document.querySelectorAll(".accordion-toggle").forEach((elem) => {
    //     elem.classList.add("active");
    //     elem.addEventListener("click", () => {
    //         elem.classList.toggle("active");

    //         let panel = elem.nextElementSibling;
    //         if (panel.style.maxHeight) {
    //             panel.style.maxHeight = null;
    //         } else {
    //             panel.style.maxHeight = panel.scrollHeight + "px";
    //         }
    //     });

    //     let panel = elem.nextElementSibling;

    //     // Wow this code is hacky. I hope no one ever reads this...
    //     // I guess this is what I get for programming Javascript as an Onyx programmer.
    //     setTimeout(() => {
    //         panel.style.maxHeight = panel.scrollHeight + "px";
    //     }, 0);
    // });

    let fuse = new Fuse(window.PACKAGE_INDEX, {
        keys: ['name', 'package_name']
    });

    let searchbar = document.querySelector("#package-search");
    let results_list = document.querySelector(".search-results");

    function set_results_open(open) {
        results_list.style.display = open && results_list.childElementCount > 0 ? "block" : "none";
    }

    searchbar.addEventListener("focus", function() {
        set_results_open(true);
    });
    searchbar.addEventListener("blur", function() {
        setTimeout(() => set_results_open(false), 160);
    });

    searchbar.addEventListener("input", function(ev) {
        let result_html = "";
        let results = ev.target.value ? fuse.search(ev.target.value).slice(0, 12) : [];
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

        results_list.innerHTML = result_html;
        results_list.querySelectorAll("li").forEach(e => {
            e.addEventListener("mousedown", (ev) => {
                ev.preventDefault();
                window.location.href = e.getAttribute("data-redirect");
            });
        });
        set_results_open(true);
    });

    searchbar.addEventListener("keydown", function (ev) {
        if (ev.key == "Enter") {
            let li = results_list.querySelector(":first-child");
            if (li) window.location.href = li.getAttribute("data-redirect");
        }
        if (ev.key == "Escape") {
            set_results_open(false);
            searchbar.blur();
        }
    });
});

