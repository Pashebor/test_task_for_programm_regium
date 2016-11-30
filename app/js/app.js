'use strict';

function EntertainMeApp() {

    let checkboxes = document.querySelectorAll('.js');
    let btnSaveChanges = document.querySelector('.js-btn-save');
    let btnUnsubscribe = document.querySelector('.js-btn-unsubscribe');
    let btnOk = document.querySelector('.js-btn-ok');
    let progressBar = document.querySelector('progress');
    let popupWindow = document.querySelector('.js-popup');
    let popupResult = document.querySelector('.js-popup-result');
    let popupResultAnnotation = document.querySelector('.js-popup-annotation');

    let currentFunValue, newFunValue;

    let xhr = new XMLHttpRequest();



    const addSitesState = (response) => {
        let data = JSON.parse(response);

        checkboxes.forEach((checkbox)=> {
            checkbox.checked = data.find(site => {
                if(site.site === checkbox.name) {
                    return site.subscribed;
                }
            });
        });
    };

    const funDifference = (currentValue, newValue) => {
        if(currentValue < newValue) {
            popupResult.innerHTML = newValue - currentValue + '%';
            popupResult.classList.add('popup__result--plus');
            popupResultAnnotation.innerHTML = 'fun get :)';
        } else if(currentValue > newValue) {
            popupResult.innerHTML = currentValue - newValue + '%';
            popupResult.classList.add('popup__result--minus');
            popupResultAnnotation.innerHTML = 'fun lost :(';
        } else {
            popupResult.innerHTML = 0 + '%';
            popupResultAnnotation.innerHTML = 'nothing happened :/';
        }
    };

    const countFunMeterValue = (checkboxes) => {
        let checkedCheckboxes = 0;

        checkboxes.forEach(items => {
            if (items.checked) {
                checkedCheckboxes++;
            }
        });

        if (checkedCheckboxes === 0) {
            return 0;
        } else {
            return Math.floor(100 / checkboxes.length * checkedCheckboxes);
        }
    };

    this.getSites = () =>{
        xhr.open('GET', '/subscribes', true);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                addSitesState(xhr.response);
                progressBar.value = countFunMeterValue(checkboxes);
                currentFunValue = progressBar.value;
            }
        };
    };

    const sendSubscribes = () => {
        let json = [];
        checkboxes.forEach(checkbox => {
            json.push({site: checkbox.name, subscribed: checkbox.checked});

        });

        xhr.open('POST', '/subscribes', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(json));

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log(xhr.response);
                progressBar.value = countFunMeterValue(checkboxes);
                newFunValue = progressBar.value;
                popupWindow.style.visibility = 'visible';
                popupWindow.style.opacity = '1';
                funDifference(currentFunValue, newFunValue);
            }
        };

    };

    this.buttonsListeners = () => {
        btnSaveChanges.addEventListener('click', () => {
           sendSubscribes();
        });

        btnUnsubscribe.addEventListener('click', () => {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            sendSubscribes();
        });

        btnOk.addEventListener('click', () => {
            popupWindow.style.visibility = '';
            popupWindow.style.opacity = '';
            popupResult.innerHTML = '';
            if(popupResult.classList.contains('popup__result--minus')) {
                popupResult.classList.remove('popup__result--minus');
            } else {
                popupResult.classList.remove('popup__result--plus');
            }

        });

    };

}

let runApp = new EntertainMeApp();
runApp.getSites();
runApp.buttonsListeners();



