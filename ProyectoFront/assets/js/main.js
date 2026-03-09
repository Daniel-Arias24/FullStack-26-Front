const loginBtn = document.getElementById("loginBtn");
const loginPopup = document.getElementById("loginPopup");
const closeLogin = document.getElementById("closeLogin");

loginBtn.addEventListener("click", function(e){
e.preventDefault();
loginPopup.style.display = "flex";
});

closeLogin.addEventListener("click", function(){
loginPopup.style.display = "none";
});