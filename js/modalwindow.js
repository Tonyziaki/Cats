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
//    const localCat = getCatFromStorage(catClickedId);
    createCatDetail(catData);
    openModal(modal);
}

function getCatFromStorage(catId) {
    const catData = JSON.parse(localStorage.getItem('catsData'));
    let newCatData = Object.fromEntries(Object.entries(catData).filter(cat => cat[1].id == catId));
    for (let key of Object.keys(newCatData)) {
        return newCatData[key];
    }
}

function saveCatToStorage(catEdit) {
    const catData = JSON.parse(localStorage.getItem('catsData'));
    for (let cat of Object.values(catData)) {
        if ((cat?.id)) {
            if (cat.id == catEdit.id) {
                console.log(cat);
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
    localStorage.setItem('catsData', JSON.stringify(catData));
}

function deleteCatFromStorage (catId) {
    const catData = JSON.parse(localStorage.getItem('catsData'));
    console.log(catId);
    const newCatData = Object.fromEntries(Object.entries(catData).filter(cat => cat[1].id !== catId));
    console.log(newCatData);
    localStorage.setItem('catsData', JSON.stringify(newCatData));
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
    const modalH2 = modal.querySelector("h2");
    const modalP = modal.querySelector("p");
    const modalImg = modal.querySelector(".modal__window_img");
    modalH1.textContent = catData.name;
    modalH2.textContent = ageToStrinf(catData.age);
    modalP.textContent = catData.description;
    modalImg.style.backgroundImage = `url("${catData.img_link}"), url('img/noimage.png')`;

    deleteImage.addEventListener("click", deleteHandler);
    editImage.addEventListener("click", editHandler);

    function editHandler() {
        const buttonDecline = document.querySelector(".changes_decline");
        const buttonSave = document.querySelector(".changes_save");
        const catEdit = getCatFromStorage(catData.id);

        const formEdit = document.querySelector(".form__container");
        const inputs = formEdit.querySelectorAll(".input-form");
        const editFavourite = formEdit.querySelector("#favourite");
        const editDescription = formEdit.querySelector("#description")

        closeModal();
        fillEditModal();
        openModal(editModal);

        buttonDecline.addEventListener("click", cancelChanges);
        buttonSave.addEventListener("click", saveChanges);

        function cancelChanges() {
            closeModal();
        }

        async function saveChanges(e) {
            e.preventDefault();
            inputs.forEach(input => {
                catEdit[input.name] = input.value;
            })
            catEdit.favourite = editFavourite.checked;
            saveCatToStorage(catEdit);

            let response = await fetch(`https://sb-cats.herokuapp.com/api/update/${catData.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(catEdit)
            });
            let result = await response.json();

            closeModal();
        }

        function fillEditModal() {
            inputs.forEach(input => {
                input.value = catEdit[input.name];
            })
            editFavourite.checked = catEdit.favourite;
        }
    }

    async function deleteHandler() {
        const approve = confirm("Вы действительно хотите удалить карточку?");
        if (approve) {
            deleteCatFromStorage(catData.id);

            let response = await fetch(`https://sb-cats.herokuapp.com/api/delete/${catData.id}`,{
                method: 'DELETE'
            });
            let result = await response.json();
            console.log(result);
            closeModal();
            window.location.reload();
        }
    }
}

window.onclick = function (event) {
    if (event.target === modalWrap || event.target === closeimg) {
        closeModal();
    }
}
