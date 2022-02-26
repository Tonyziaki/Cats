
const authForm = document.querySelector(".auth-form");
console.dir(authForm)
const inputName = authForm.querySelector(".input__form");
console.dir(inputName)

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputName.value.trim() !== "") {
        Cookies.set('username',inputName.value, {secure: true, sameSite: "lax"});
//        document.cookie = `username=${inputName.value}; secure; samesite = lax;` //записали куку
        inputName.value = "";    // очищаем форму после ввода данных или можно e.target.reset(), который очистит поле полностью, а не отдельную строку
        window.location.replace('index.html');
    } else {
        alert('Введите данные перед сохранением')
    }

})