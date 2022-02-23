const modal = document.querySelector(".modal");
const modalWrap = document.querySelector(".modal__wrap");

function openModal(modal) {
    modal.classList.add('modal_opened');
    document.body.classList.add('scroll_disabled')
}

function closeModal() {
    const modalActive = document.querySelector('.modal_opened');
    modalActive && modalActive.classList.remove('modal_opened');
    document.body.classList.remove('scroll_disabled')
}

async function showCatCard(event) {
    const catClickedId = event.target.closest(".cat__card").dataset.id;
    console.log(catClickedId);
    const response = await getCatById(catClickedId);
    const catData = response.data;
    createCatDetail(catData);
    openModal(modal);
}

function ageToStrinf(age) {
    let txt;
    let count = age % 100;
    if (count >= 5 && count <= 20) {
        txt = 'лет';
    } else {
        count = count % 10;
        if (count === 1) {
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
    return await response.json();
}

function createCatDetail(catData) {
    const deleteImage = modal.querySelector("#deleteimg");
    const editImage = modal.querySelector("#editimg");
    const modalH1 = modal.querySelector("h1");
    modalH1.textContent = catData.name;
    const modalH2 = modal.querySelector("h2");
    modalH2.textContent = ageToStrinf(catData.age);
    const modalP = modal.querySelector("p");
    modalP.textContent = catData.description;
    const modalImg = modal.querySelector(".modal__window_img");
    modalImg.style.backgroundImage = `url("${catData.img_link}"), url('img/noimage.png')`;

    deleteImage.addEventListener("click", deleteHandler);
    editImage.addEventListener("click", editHandler);
    
    function editHandler() {
        console.log(`edit cat ${catData.id}`)
    }
    function deleteHandler() {
        console.log(`delete cat ${catData.id}`)
    }
}

window.onclick = function (event) {
    if (event.target === modalWrap || event.target === closeimg) {
        closeModal();
    }
}
