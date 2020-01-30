var flash = document.querySelector(".flash-message");
var modQues = document.querySelector(".mod-forgot");
var moderator = document.querySelector(".mod-field");

setTimeout(function(){flash.style.opacity="0"},10000);

modQues.addEventListener("click",function(){
    moderator.classList.toggle("no-display");
})