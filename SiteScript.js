const topUrl = document.getElementById("top-url").content;
let isMobile = document.documentElement.clientWidth < 480;

setInterval(() => {
    isMobile = document.documentElement.clientWidth < 480;
}, 200);

let isJapanese = navigator.language == "ja";

window.addEventListener("load", () => {
    const englishElements = Array.from(document.getElementsByClassName("english-element"));
    const japaneseElements = Array.from(document.getElementsByClassName("japanese-element"));
    if (isJapanese) {
        englishElements.forEach((element) => {
            element.style.display = "none";
        });
    } else {
        japaneseElements.forEach((element) => {
            element.style.display = "none";
        });
    }
    const header = document.querySelector("header.site-header");
    const siteNameLink = document.createElement("a");
    siteNameLink.href = topUrl;
    siteNameLink.style.textDecoration = "none";
    header.appendChild(siteNameLink);
    const siteName = document.createElement("span");
    siteName.textContent = isJapanese ? "BusTimeTable ドキュメント" : "BusTimeTable Document";
    siteName.id = "site-name";
    siteNameLink.appendChild(siteName);
    const searchBox = document.createElement("input");
    searchBox.id = "search-box";
    searchBox.type = "search";
    searchBox.placeholder = isJapanese ? "検索 (例: 基本的な使い方)" : "Search (Example: Basic Usage)";
    searchBox.classList.add("search-box");
    searchBox.onkeydown = (event) => {
        if (event.key == "Enter") {
            const searchBox = document.getElementById("search-box");
            if (searchBox.value == "") {
                location.href = `${topUrl}search`;
            } else {
                location.href = `${topUrl}search/?word=${searchBox.value}`;
            }
        }
    };
    searchBox.style.outline = "0";
    searchBox.style.marginLeft = document.documentElement.clientWidth - (isMobile ? 400 : 550) + "px";
    setInterval(() => {
        searchBox.style.marginLeft = document.documentElement.clientWidth - (isMobile ? 400 : 550) + "px";
    }, 200);
    header.appendChild(searchBox);
    const pagesXmlUrl = isJapanese ? topUrl + "Pages.xml" : topUrl + "Pages-en.xml";
    const pageInfoView = document.getElementById("page-info-view");
    if (pageInfoView != null) {
        fetch(pagesXmlUrl)
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
                const pageDescriptionElement = document.createElement("span");
                pageDescriptionElement.classList.add("page-description");
                pageDescriptionElement.style.marginBottom = "16px";
                pageDescriptionElement.style.display = "inline-block";
                pageDescriptionElement.textContent = matchPage.getElementsByTagName("description")[0].textContent;
                pageInfoView.appendChild(pageDescriptionElement);
                const tagList = Array.from(matchPage.getElementsByTagName("tags")[0].children);
                if (tagList.length > 0) {
                    const pageTagsBox = document.createElement("div");
                    pageTagsBox.appendChild(document.createTextNode(isJapanese ? "タグ: " : "Tag: "));
                    tagList.forEach((tag) => {
                        const tagName = tag.textContent;
                        const tagLink = document.createElement("a");
                        tagLink.href = topUrl + `search/?tags=${tagName}`;
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
    const pageName = document.getElementById("page-name") != null ? document.getElementById("page-name").content : "";
    if (pageName == "top-page") {
        const pagesView = document.getElementById("pages-view");
        fetch(pagesXmlUrl)
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
                    const tagList = Array.from(page.getElementsByTagName("tags")[0].children);
                    if (tagList.length > 0) {
                        const pageTagsBox = document.createElement("div");
                        pageTagsBox.appendChild(document.createTextNode(isJapanese ? "タグ: " : "Tag: "));
                        tagList.forEach((tag) => {
                            const tagName = tag.textContent;
                            const tagLink = document.createElement("a");
                            tagLink.href = topUrl + `search/?tags=${tagName}`;
                            const tagSpan = document.createElement("span");
                            tagSpan.classList.add("tag-span");
                            tagSpan.textContent = tagName;
                            tagLink.appendChild(tagSpan);
                            pageTagsBox.appendChild(tagLink);
                        });
                        pageBox.appendChild(pageTagsBox);
                    }
                    pagesView.appendChild(pageBox);
                });
            });
    }
    if (pageName == "search-page") {
        const params = new URLSearchParams(location.search);
        const isSearchEmpty = params.get("word") == null && params.get("tags") == null;
        if (!isSearchEmpty) {
            const searchResultHeader = document.getElementsByClassName("search-result-element");
            Array.from(searchResultHeader).forEach((element) => {
                if (isJapanese) {
                    if (element.classList.contains("japanese-element")) element.style.display = "block";
                } else {
                    if (element.classList.contains("english-element")) element.style.display = "block";
                }
            });
            const pagesView = document.getElementById("pages-view");
            fetch(pagesXmlUrl)
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
                        const pageTags = Array.from(page.getElementsByTagName("tags")[0].children);
                        const word = params.get("word");
                        const tags = params.get("tags").split(",");
                        let isMatchTag = false;
                        console.log(pageTags);
                        for (const tag of pageTags) {
                            if (tags.includes(tag.textContent)) isMatchTag = true;
                        }
                        isMatch = pageUrl.includes(word) || pageTitle.includes(word) || pageDescription.includes(word) || isMatchTag;
                        if (isMatch) {
                            const pageBox = document.createElement("a");
                            pageBox.classList.add("page-box");
                            pageBox.href = topUrl + pageUrl;
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
                            const tagList = Array.from(page.getElementsByTagName("tags")[0].children);
                            if (tagList.length > 0) {
                                const pageTagsBox = document.createElement("div");
                                pageTagsBox.appendChild(document.createTextNode(isJapanese ? "タグ: " : "Tag: "));
                                tagList.forEach((tag) => {
                                    const tagName = tag.textContent;
                                    const tagLink = document.createElement("a");
                                    tagLink.href = topUrl + `search/?tags=${tagName}`;
                                    const tagSpan = document.createElement("span");
                                    tagSpan.classList.add("tag-span");
                                    tagSpan.textContent = tagName;
                                    tagLink.appendChild(tagSpan);
                                    pageTagsBox.appendChild(tagLink);
                                });
                                pageBox.appendChild(pageTagsBox);
                            }
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
            const detailSearchBoxTags = document.getElementById("detail-search-box-tags");
            for (const tag of params.get("tags").split(",")) {
                const detailSearchBoxTag = document.createElement("span");
                detailSearchBoxTag.textContent = tag;
                detailSearchBoxTag.classList.add("detail-search-box-tag");
                detailSearchBoxTags.appendChild(detailSearchBoxTag);
            }
        }
        if (isSearchEmpty) {
            const detailSearchPanel = document.getElementById("detail-search-panel");
            detailSearchPanel.style.display = "none";
            fetch(pagesXmlUrl)
                .then((response) => response.text())
                .then((XmlText) => {
                    const domParser = new DOMParser();
                    const pagesXml = domParser.parseFromString(XmlText, "text/xml");
                    const pageList = pagesXml.documentElement;
                    const pagesArray = Array.from(pageList.children);
                    pagesArray.forEach((page) => {
                        const pagesView = document.getElementById("pages-view");
                        const pageUrl = page.getElementsByTagName("url")[0].textContent;
                        const pageTitle = page.getElementsByTagName("title")[0].textContent;
                        const pageDescription = page.getElementsByTagName("description")[0].textContent;
                        const pageTags = Array.from(page.getElementsByTagName("tags")[0].children);
                        const word = params.get("word");
                        const tagsString = params.get("tags");
                        const tags = (tagsString ?? "").split(",");
                        const pageBox = document.createElement("a");
                        pageBox.classList.add("page-box");
                        pageBox.href = topUrl + pageUrl;
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
                    });
                });
        }
    }
});
