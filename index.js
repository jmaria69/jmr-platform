document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(event) {
        const href = event.target.getAttribute("onclick").replace(/location.href=['"]#(.*?)['";]/,'$1');

        document.querySelector(`#${href}`).scrollIntoView({
            behavior: 'smooth'
        });
    })
});