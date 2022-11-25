(function () {
    let view = document.getElementById('view') || document.body.appendChild(document.createElement('div'));
    view.id = 'view';

    window.addEventListener('message', event => {
        view.innerHTML = event.data;
    });

}());
