const modal = document.querySelector(".modal");
const editModal = document.querySelector(".div_addCat");
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
    const response = await getCatById(catClickedId);
    const catData = response.data;
    // Добавить проверку, если вернуло undefined то надо обновить локальное хранилище
    createCatDetail(catData);
    openModal(modal);
}

function getCatFromStorage(catID) {
    const catData = JSON.parse(localStorage.getItem('catsData'));
    for (let cat of catData) {
        if ((cat?.id)) {
            if (cat.id === catID) {
                return cat;
            }
        }
    }
}

function saveCatToStorage(catEdit) {
    const catData = JSON.parse(localStorage.getItem('catsData'));
    for (let cat of catData) {
        if ((cat?.id)) {
            if (cat.id === catEdit.id) {
                cat.name = catEdit.name;
                cat.favourite = catEdit.favourite;
                cat.rate = catEdit.rate;
                cat.age = catEdit.age;
                cat.img_link = catEdit.img_link;
                cat.description = catEdit.description;
                break;
            }
        }
    }
    localStorage.clear();
    localStorage.setItem('catsData', JSON.stringify(catData));
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
        const buttonDecline = document.querySelector(".changes_decline");
        const buttonSave = document.querySelector(".changes_save");
        const catEdit = getCatFromStorage(catData.id);

        const formEdit = document.querySelector(".form__container");
        const editId = formEdit.querySelector("#id");
        const editName = formEdit.querySelector("#name");
        const editFavourite = formEdit.querySelector("#favourite");
        const editRate = formEdit.querySelector("#rate");
        const editAge = formEdit.querySelector("#age");
        const editUrl = formEdit.querySelector("#url");
        const editDescription = formEdit.querySelector("#description");

        closeModal();
        fillEditModal();
        openModal(editModal);

        buttonDecline.addEventListener("click", cancelChanges);
        buttonSave.addEventListener("click", saveChanges);

        function cancelChanges() {
            closeModal();
            openModal(modal);
        }

        function saveChanges() {
            catEdit.name = editName.value;
            catEdit.favourite = editFavourite.checked;
            catEdit.rate = editRate.value;
            catEdit.age = editAge.value;
            catEdit.img_link = editUrl.value;
            catEdit.description = editDescription.textContent;
            saveCatToStorage(catEdit);
            closeModal();
            openModal(modal);
        }

        function fillEditModal() {
            editId.value = catEdit.id;
            editName.value = catEdit.name;
            editFavourite.checked = catEdit.favourite;
            editRate.value = catEdit.rate;
            editAge.value = catEdit.age;
            editUrl.value = catEdit.img_link;
            editDescription.textContent = catEdit.description;
        }
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
