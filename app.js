let urls = new Array();
let resultados = document.querySelector(".shorten-results");
let btnShort = document.getElementById("btn-short");
let menu = document.getElementById("menu");

// Listeners

document.addEventListener("DOMContentLoaded", function () {
    let savedURLs = JSON.parse(localStorage.getItem("urls"));
    if (savedURLs.length > 0) {
        urls = savedURLs;
    }
    savedURLs.forEach(function (value) {
        let key = Object.keys(value)[0];
        let componente = new DOMParser().parseFromString(value[key], 'text/html');
        resultados.appendChild(componente.firstChild);
    })
});

menu.addEventListener("click", function () {
    document.querySelector(".navbar").classList.toggle('active');
});

btnShort.addEventListener("click", function () {
    let url = document.getElementById("input-url").value;
    btnShort.disabled = true;
    if (url.trim().length != 0) {
        removeShorterErrors();
        shortURL(url).then(data => {
            if (data.url[0] == "Enter a valid URL.") {
                setShorterError("Enter a valid URL.");
            } else {
                resultados.appendChild(createResult(data));
                document.getElementById("input-url").value = "";
            }
            btnShort.disabled = false;
        });
    } else {
        setShorterError("Please add a link");
        btnShort.disabled = false;
    }
});

// Event bubbling
resultados.addEventListener('click', function (event) {
    let isButtonCopy = event.target.nodeName === "BUTTON";
    if (isButtonCopy) {
        let url = "https://rel.ink/" + event.target.id;
        let tempInput = document.getElementById("tempInput");
        tempInput.type = "text"
        tempInput.value = url;
        tempInput.select();
        document.execCommand('copy');
        tempInput.type = "hidden";
        event.target.textContent = "Copied!"
        event.target.classList.add("active");
    }
})

// Functions

async function shortURL(url) {
    let response = await fetch("https://rel.ink/api/links/", {
        method: "POST",
        body: JSON.stringify({
            url: url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    return data;
}

function createResult(data) {
    let result = `
            <div class="result">
                <div class="result-header">
                    <p >${data.url}</p>
                </div>
                <div class="result-body">
                    <p>https://rel.ink/${data.hashid}</p>
                    <button id="${data.hashid}" class="btn-primary btn-copy">Copy</button>
                </div>
            </div>
            `;
    let obj = {};
    obj[data.hashid] = result;
    urls.push(obj);
    let componente = new DOMParser().parseFromString(result, 'text/html');
    console.log(urls);
    localStorage.setItem("urls", JSON.stringify(urls));
    return componente.firstChild;
}

function setShorterError(message) {
    document.querySelector("#input-url").classList.add("error");
    let error = document.querySelector(".msg-error");
    error.textContent = message;
    error.classList.add('active');
}

function removeShorterErrors() {
    document.querySelector("#input-url").classList.remove("error");
    document.querySelector(".msg-error").classList.remove("active");
}
