var navToogle = document.querySelector('.toggle');
var navMenu = document.querySelector('.main-nav');

navMenu.classList.remove('main-nav--no-js');
navToogle.classList.remove('toggle--no-js');

navToogle.addEventListener('click', function() {
    navToogle.classList.toggle('toggle--close');
    navMenu.classList.toggle('main-nav--open');
});
