const modal = document.querySelector(".modal");
const modalWrap = document.querySelector(".modal__wrap");

async function showCatCard(event) {
    const catClickedId = event.target.closest(".cat__card").dataset.id;
    const response = await getCatById(catClickedId);
    const catData = response.data;
    createCatDetail(catData);
}

function ageToStrinf(age) {
    let txt = '';
    let count = age % 100;
    if (count >= 5 && count <= 20) {
        txt = 'лет';
    } else {
        count = count % 10;
        if (count == 1) {
            txt = 'год';
        } else if (count >= 2 && count <= 4) {
            txt = 'года';
        } else {
            txt = 'лет';
        }
    }
    return `${age} ${txt}`;
}

async function getCatById(catId) {
    const url = `https://sb-cats.herokuapp.com/api/show/${catId}`;
    let response = await fetch(url);
    let result = await response.json();
    return result;
}

function createCatDetail(catData) {
    const modalH1 = modal.querySelector("h1");
    modalH1.textContent = catData.name;
    const modalH2 = modal.querySelector("h2");
    modalH2.textContent = ageToStrinf(catData.age);
    const modalP = modal.querySelector("p");
    modalP.textContent = catData.description;
    const modalImg = modal.querySelector(".modal__window_img");
    modalImg.style.backgroundImage = `url("${catData.img_link}")`;
    htmlbody.style.overflow = 'hidden';
    modal.style.display = "block";
}

window.onclick = function (event) {
    if (event.target == modalWrap || event.target == closeimg) {
        modal.style.display = "none";
        htmlbody.style.overflow = 'scroll';
    }
}
