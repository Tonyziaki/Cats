const catImage = document.querySelector(".cat__img");
const logo = document.querySelector(".header__logo");
const login = document.querySelector(".header__cover");
const addNewCat = document.querySelector(".add_newCard");

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

async function addNewCatCard() {
    const newId = await nextId();
    console.log(newId);
    openModal(editModal);

    const formAdd = document.querySelector(".form__container");
    const buttonDecline = document.querySelector(".changes_decline");
    const buttonSave = document.querySelector(".changes_save");
    const editFavourite = formAdd.querySelector("#favourite");
    const editDescription = formAdd.querySelector("#description");
    const inputs = formAdd.querySelectorAll(".input-form");
    const editId = formAdd.querySelector("#id");
    const newCat = {};

    buttonDecline.addEventListener("click", cancelChanges);
    buttonSave.addEventListener("click", saveChanges);

    function cancelChanges() {
        closeModal();
    }
    async function saveChanges(e) {
        e.preventDefault();
        inputs.forEach(input => {
            newCat[input.name] = input.value;
        })
        newCat.favourite = editFavourite.checked;
        newCat.id = newId;
        console.log(newCat);
        const catData = JSON.parse(localStorage.getItem('catsData'));
        console.log(catData);
//        let local1 = Object.assign(catData, {[newCat.id]:newCat})
        localStorage.setItem('catsData', JSON.stringify(Object.assign(catData, {[newCat.id]:newCat})));

        let response = await fetch('https://sb-cats.herokuapp.com/api/add ',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCat)
        });
        let result = await response.json();
        console.log(result);
        closeModal();
    }
}

async function nextId () {
    const url = 'https://sb-cats.herokuapp.com/api/show';
    let response = await fetch(url);
    if (response.ok) {
        let data = await response.json();
        if (data.message === 'ok') {
            return getMaxId(data.data)+5;
        } else {
            console.log(data.error);
        }
    } else {
        console.log(response.error());
    }
}

function getMaxId (data) {
    const arr = [];
    for (let val of Object.values(data)) {
        if (val?.id){
            arr.push(val.id);
        }
    }
    return Math.max(...arr);
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
addNewCat.addEventListener("click", addNewCatCard)