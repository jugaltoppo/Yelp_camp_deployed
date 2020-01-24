var flash = document.querySelector(".flash-message");
var modQues = document.querySelector(".mod");
var moderator = document.querySelector(".mod-field");

setTimeout(function(){flash.style.opacity="0"},2000);

modQues.addEventListener("click",function(){
    moderator.classList.toggle("no-display");
})