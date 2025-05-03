const searchPage = () => {};

window.addEventListener("load", () => {
    const header = document.querySelector("header.site-header");
    const siteName = document.createElement("span");
    siteName.textContent = "BusTimeTable ヘルプ";
    siteName.style.fontWeight = "bold";
    siteName.style.fontSize = "20px";
    siteName.style.marginLeft = "10px";
    header.appendChild(siteName);
    const searchBox = document.createElement("input");
    searchBox.type = "search";
    searchBox.classList.add("search-box");
    searchBox.onkeydown = searchPage;
    searchBox.style.outline = "0";
    searchBox.style.marginLeft = document.documentElement.clientWidth - 500 + "px";
    searchBox.style.display = "inline";
    setInterval(() => {
        searchBox.style.marginLeft = document.documentElement.clientWidth - 500 + "px";
    }, 300);
    header.appendChild(searchBox);
    const pagesView = document.getElementById("pages-view");
    fetch("Pages.xml")
        .then((response) => response.text())
        .then((XmlText) => {
            const domParser = new DOMParser();
            const pagesXml = domParser.parseFromString(XmlText, "text/xml");
            const pageList = pagesXml.documentElement;
            const pagesArray = Array.from(pageList.children);
            pagesArray.forEach((page) => {
                const pageBox = document.createElement("a");
                pageBox.classList.add("page-box");
                pageBox.href = page.getElementsByTagName("url")[0].textContent;
                const pageTitle = document.createElement("h3");
                pageTitle.classList.add("page-title");
                pageTitle.textContent = page.getElementsByTagName("title")[0].textContent;
                pageBox.appendChild(pageTitle);
                const pageDescription = document.createElement("p");
                pageDescription.classList.add("page-description");
                pageDescription.textContent = page.getElementsByTagName("description")[0].textContent;
                pageBox.appendChild(pageDescription);
                pagesView.appendChild(pageBox);
            });
        });
});
