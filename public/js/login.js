/*open game board*/
function openMenu() {
    const url = '/menu';
   // window.open(url);
    open(url);
}
/*--------------------------------- */
/*const showPassword = document.getElementById('show');
const passwordField = document.getElementById('password_input');

showPassword.addEventListener("click", function(){
    this.classList.toggle("fa-eye-slash");
    const type = passwordField.getAttribute() === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
})*/

const password_input = document.getElementById('password_input')

let changeIcon = function(icon) {
    icon.classList.toggle('fa-eye')

    if (password_input.type === 'password') {
        password_input.type = 'text';
    }
    else {
        password_input.type = 'password';
    }
}

