"use strict";

class Validation {
    constructor() {
        this.rules = [];
        this.valid = true;
        this.init();
    }

    init() {
        const validationForm = document.querySelector('.search-form');
        validationForm.addEventListener('submit', event => this.validForm(event));
        this.rules = [
            {
                name: "name",
                validMethod: /^[a-zа-яё]+$/i,
                messageErr: 'Имя должно быть одним словом и состоять только из букв.'
            },
            {
                name: "tel",
                validMethod: /^\+\d\(\d{3}\)\d{3}-\d{4}$/,
                messageErr: "Телефон должен быть заполнен в формате '+7(000)000-0000'."
            },
            {
                name: "email",
                validMethod: /^\w+[-._]?\w+@[a-z]+\.[a-z]{2,4}$/i,
                messageErr: "E-mail имеет вид mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru."
            },
            {
                name: "free-text",
                validMethod: /.+/i,
                messageErr: "Введите произвольный текст."
            },
        ]
    }

    validForm(event) {
        this.valid = true;
        this.findInput();
        if (!this.valid){
            event.preventDefault();
        }
    }

    findInput() {
        this.rules.forEach(rule => {
            for (const even of event.target) {
                if (rule.name === even.name) {
                    this.isValid(rule, even);
                }
            }
        })
    }

    isValid(rule, event) {
        if (!rule.validMethod.test(event.value)) {
            this.falseValid(event, rule);
        } else {
            this.trueValid(event);
        }
    }

    falseValid(event, rule) {
        this.valid = false;
        event.classList.remove('valid');
        event.classList.add('no-valid');
        if (!document.querySelector(`.${event.name}Err`)) {
            event.insertAdjacentHTML("afterend", `<p class="massage-err ${event.name}Err">${rule.messageErr}</p>`);
        }
    }

    trueValid(event) {
        let elem = document.querySelector(`.${event.name}Err`);
        if (elem){
            elem.parentElement.removeChild(elem);
        }
        event.classList.remove('no-valid');
        event.classList.add('valid');
    }
}

new Validation();