const topUrl = document.getElementById("top-url").content;

window.addEventListener("load", () => {
    const header = document.querySelector("header.site-header");
    const siteNameLink = document.createElement("a");
    siteNameLink.href = topUrl;
    header.appendChild(siteNameLink);
    const siteName = document.createElement("span");
    siteName.textContent = "BusTimeTable ドキュメント";
    siteName.id = "site-name";
    siteNameLink.appendChild(siteName);
    const detailSearchBox = document.createElement("input");
    detailSearchBox.id = "search-box";
    detailSearchBox.type = "search";
    detailSearchBox.classList.add("search-box");
    detailSearchBox.onkeydown = (event) => {
        if (event.key == "Enter") {
            const detailSearchBox = document.getElementById("search-box");
            if (detailSearchBox.value == "") {
                location.href = `${topUrl}search`;
            } else {
                location.href = `${topUrl}search/?word=${detailSearchBox.value}`;
            }
        }
    };
    detailSearchBox.style.outline = "0";
    detailSearchBox.style.marginLeft = document.documentElement.clientWidth - 550 + "px";
    setInterval(() => {
        detailSearchBox.style.marginLeft = document.documentElement.clientWidth - 550 + "px";
    }, 300);
    header.appendChild(detailSearchBox);
    const pageInfoView = document.getElementById("page-info-view");
    if (pageInfoView != null) {
        fetch(topUrl + "Pages.xml")
            .then((response) => response.text())
            .then((XmlText) => {
                const domParser = new DOMParser();
                const pagesXml = domParser.parseFromString(XmlText, "text/xml");
                const pageList = pagesXml.documentElement;
                const pagesArray = Array.from(pageList.children);
                const matchPage = pagesArray.filter((page) => {
                    const pageId = page.getElementsByTagName("id")[0].textContent;
                    return pageId == document.getElementById("page-id").content;
                })[0];
                const pageTitleElement = document.createElement("h2");
                pageTitleElement.textContent = matchPage.getElementsByTagName("title")[0].textContent;
                pageInfoView.appendChild(pageTitleElement);
                const tagList = Array.from(matchPage.getElementsByTagName("tags")[0].children);
                if (tagList.length > 0) {
                    const pageTagsBox = document.createElement("div");
                    pageTagsBox.appendChild(document.createTextNode("タグ: "));
                    tagList.forEach((tag) => {
                        const tagName = tag.textContent;
                        const tagLink = document.createElement("a");
                        tagLink.href = topUrl + `search?tag=${tagName}`;
                        const tagSpan = document.createElement("span");
                        tagSpan.classList.add("tag-span");
                        tagSpan.textContent = tagName;
                        tagLink.appendChild(tagSpan);
                        pageTagsBox.appendChild(tagLink);
                    });
                    pageInfoView.appendChild(pageTagsBox);
                }
            });
    }
    const pageName = document.getElementById("page-name").content;
    if (pageName == "top-page") {
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
                    const pageTitleElement = document.createElement("h3");
                    pageTitleElement.classList.add("page-title");
                    pageTitleElement.textContent = page.getElementsByTagName("title")[0].textContent;
                    pageBox.appendChild(pageTitleElement);
                    const pageDescriptionElement = document.createElement("p");
                    pageDescriptionElement.classList.add("page-description");
                    pageDescriptionElement.textContent = page.getElementsByTagName("description")[0].textContent;
                    pageBox.appendChild(pageDescriptionElement);
                    pagesView.appendChild(pageBox);
                });
            });
    }
    if (pageName == "search-page") {
        const params = new URLSearchParams(location.search);
        if (params.get("word") != null) {
            const searchResultHeader = document.getElementsByClassName("search-result-element");
            Array.from(searchResultHeader).forEach((element) => {
                element.style.display = "block";
            });
            const pagesView = document.getElementById("pages-view");
            fetch(topUrl + "Pages.xml")
                .then((response) => response.text())
                .then((XmlText) => {
                    const domParser = new DOMParser();
                    const pagesXml = domParser.parseFromString(XmlText, "text/xml");
                    const pageList = pagesXml.documentElement;
                    const pagesArray = Array.from(pageList.children);
                    pagesArray.forEach((page) => {
                        let isMatch = false;
                        const pageUrl = page.getElementsByTagName("url")[0].textContent;
                        const pageTitle = page.getElementsByTagName("title")[0].textContent;
                        const pageDescription = page.getElementsByTagName("description")[0].textContent;
                        const word = params.get("word");
                        isMatch = pageUrl.includes(word) || pageTitle.includes(word) || pageDescription.includes(word);
                        if (isMatch) {
                            const pageBox = document.createElement("a");
                            pageBox.classList.add("page-box");
                            pageBox.href = pageUrl;
                            const pageTitleElement = document.createElement("h3");
                            pageTitleElement.classList.add("page-title");
                            const replacedTitle = pageTitle.replaceAll(word, `<span class="search-highlight-text-title">${word}</span>`);
                            pageTitleElement.innerHTML = replacedTitle;
                            pageBox.appendChild(pageTitleElement);
                            const pageDescriptionElement = document.createElement("p");
                            pageDescriptionElement.classList.add("page-description");
                            const replacedDescription = pageDescription.replaceAll(word, `<span class="search-highlight-text-description">${word}</span>`);
                            pageDescriptionElement.innerHTML = replacedDescription;
                            pageBox.appendChild(pageDescriptionElement);
                            pagesView.appendChild(pageBox);
                        }
                    });
                });
            const detailSearchBtn = document.getElementById("detail-search-btn");
            const detailSearchBox = document.getElementById("detail-search-box");
            detailSearchBox.value = params.get("word");
            detailSearchBtn.addEventListener("click", () => {
                if (detailSearchBox.value == "") {
                    location.href = `${topUrl}search`;
                } else {
                    location.href = `${topUrl}search/?word=${detailSearchBox.value}`;
                }
            });
        }
    }
});
