const catImage = document.querySelector(".cat__img");
const logo = document.querySelector(".header__logo");
const login = document.querySelector(".header__cover");

if (+localStorage.getItem('catsData') === 0) {
    getAllCatsPromise();
} else {
    createCatCards(JSON.parse(localStorage.getItem('catsData')));
}

function handler(event) {
    localStorage.clear();
    window.location.reload();
}

function loginUser() {
    if (!Cookies.get('username')) {
        window.location.replace('auth.html');
    }
}

function addRate (element) {
    const newRate = document.createElement("img");
    newRate.src = "img/kot.jpg";
    newRate.width = 20;
    newRate.height = 20;
    element.appendChild(newRate);
    return element;
}

function addEmptyRate (element) {
    const newEmptyRate = document.createElement("img");
    newEmptyRate.src = "img/white-kot.jpg";
    newEmptyRate.width = 20;
    newEmptyRate.height = 20;
    element.appendChild(newEmptyRate);
    return element;
}

function getAllCats() {
    console.log("Вызов API удовлетворен :)");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://sb-cats.herokuapp.com/api/show', true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            const catData = JSON.parse(xhr.response).data;
            localStorage.setItem('catsData', JSON.stringify(catData));
            createCatCards(catData);
        }
    }
}

function getAllCatsPromise() {
    const url = 'https://sb-cats.herokuapp.com/api/show';
    fetch(url)
        .then(response =>  response.json() )
        .then(data => {
            localStorage.setItem('catsData', JSON.stringify(data.data));
            createCatCards(data.data)
        } )
        .catch(error => console.log(error));
}

function createCatCards(catData) {
    const cardSection = document.querySelector("#allcats");

    for (let key of Object.keys(catData)) {
        if ((catData[key]?.id)) {
            let catCard =createCatCard(catData[key]);
            addCatCard(catCard, cardSection);
        }
    }
}

function createCatCard(catData) {
    const clone = document.querySelector("#card-template").content.cloneNode(true);

    const catCard = clone.querySelector(".cat__card");
    catCard.dataset.id = catData.id;
    catCard.onclick = showCatCard;
    const newImg = clone.querySelector(".cat__img");
    newImg.style.backgroundImage=`url("${catData.img_link}"),url('img/noimage.png')`;
    const newH3 = clone.querySelector("H3")
    newH3.textContent = catData.name;
    let newP = clone.querySelector("p");
    for (let i = 1; i <= 10; i++){
        if (i <= catData?.rate) {
            newP = addRate(newP);
        } else {
            newP = addEmptyRate(newP);
        }
    }

    return clone;
}

function addCatCard(childElement, parentElement) {
    parentElement.appendChild(childElement);
}

logo.addEventListener("click", handler);
login.addEventListener("click", loginUser);