var base_url = "https://readerapi.codepolitan.com/";

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function getArticles() {

    if ('caches' in window) {
        caches.match(base_url + "articles").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var articleHTML = "";
                    data.result.forEach(function (article) {
                        articleHTML += `
                        <div class="card">
                            <a href="./article.html?id=${article.id}">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${article.thumbnail}" />
                                </div>
                            </a>
                            <div class="card-content">
                                <span class="card-title truncate">${article.title}</span>
                                <p>${article.description}</p>
                            </div>
                        </div>`;
                    });
                    document.getElementById("articles").innerHTML = articleHTML;
                })
            }
        })
    }
    
    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function (data) {
            var articlesHTML = "";
            data.result.forEach(function (article) {
                articlesHTML += `
                    <div class="card">
                        <a href="./article.html?id=${article.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.thumbnail}" />
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">${article.title}</span>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
            });
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticleById() {
    // ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    fetch(base_url + "article/" + idParam)
        .then(status)
        .then(json)
        .then(function (data) {
            console.log(data);

            var articleHTML = `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.result.cover}" />
                    </div>
                    <div class="card-content">
                        <span class="card-title">${data.result.post_title}</span>
                        ${snarkdown(data.result.post_content)}
                    </div>
                </div>
            `;
            document.getElementById("body-content").innerHTML = articleHTML;
        });
}