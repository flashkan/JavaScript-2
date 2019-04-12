"use strict";

class Hamburger {
    constructor() {
        this.allProduct = [];
        this.sizeHamburg = {};
        this.fillingHamburg = {};
        this.toppingsHamburg = [];
        this.calories = 0;
        this.price = 0;
        this.addEvent();
        this.init();
    }

    init() {
        this.allProduct = [];
        this.sizeHamburg = {price: 0, calories: 0};
        this.fillingHamburg = {price: 0, calories: 0};
        this.toppingsHamburg = [{price: 0, calories: 0}];
        this.fetchProducts();
        document.querySelectorAll('.btn').forEach(elem => elem.classList.remove('red'));


    }

    addEvent() {
        document.querySelector('.container').addEventListener('click', event => {
            this.eventHandler(event);
        });
    }

    eventHandler(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        this.whatButtonClick(event, event.target.textContent);

    }

    fetchProducts() {
        this.allProduct = [
            {name: 'Маенький гамбургер', price: 50, calories: 20},
            {name: 'Большой гамбургер', price: 100, calories: 40},
            {name: 'С сыром', price: 10, calories: 20},
            {name: 'С салатом', price: 20, calories: 5},
            {name: 'С картошкой', price: 15, calories: 10},
            {name: 'Приправа', price: 15, calories: 0},
            {name: 'Майонез', price: 20, calories: 5},
        ]
    }

    whatButtonClick(event, nameBtn) {
        if (nameBtn === this.allProduct[0].name || nameBtn === this.allProduct[1].name) {
            this.addSizeHamburg(event, nameBtn);
        } else if (nameBtn === this.allProduct[2].name || nameBtn === this.allProduct[3].name
            || nameBtn === this.allProduct[4].name) {
            this.addFillingHamburg(event, nameBtn);
        } else if (nameBtn === this.allProduct[5].name || nameBtn === this.allProduct[6].name) {
            this.addToppingsHamburg(event, nameBtn);
        } else if (nameBtn === 'Заказать бургер!!!') {
            this.order();
        }
        this.countCalorie();
        this.countPrice();
        this.render();
    }


    addSizeHamburg(event, size) {
        this.allProduct.forEach(elem => {
            if (size === elem.name) {
                this.sizeHamburg = elem;
            }
        });
        document.querySelectorAll('.btn_size').forEach(elem => elem.classList.remove('red'));
        event.target.classList.add('red');
    }

    addFillingHamburg(event, filling) {
        if (this.isCanBeClick(this.sizeHamburg, 'размер')) {
            return;
        }
        this.allProduct.forEach(elem => {
            if (filling === elem.name) {
                this.fillingHamburg = elem;
            }
        });
        document.querySelectorAll('.btn_filling').forEach(elem => elem.classList.remove('red'));
        event.target.classList.add('red');
    }

    addToppingsHamburg(event, toppings) {
        if (this.isCanBeClick(this.fillingHamburg, 'начинку')) {
            return;
        }
        this.allProduct.forEach(elem => {
            if (toppings === elem.name) {
                if (this.isHaveToppings(toppings)) {
                    this.removeToppingsHamburg(toppings);
                    event.target.classList.remove('red');
                    return;
                }
                this.toppingsHamburg.push(elem);
                event.target.classList.add('red');

            }
        });
    }

    order() {
        if (this.isCanBeClick(this.fillingHamburg, 'начинку')) {
            return;
        }
        let orderText = `Ваш ${this.sizeHamburg.name.toLowerCase()} ${this.fillingHamburg.name.toLowerCase()} 
уже едет к вам. Цена ${this.price}. Колорийность ${this.calories}.`;
        this.init();
        alert(orderText);

    }

    isHaveToppings(toppings) {
        for (const elem of this.toppingsHamburg) {
            if (elem.name === toppings) {
                return true
            }
        }
    }

    removeToppingsHamburg(toppings) {
        for (const key in this.toppingsHamburg) {
            if (this.toppingsHamburg[key].name === toppings) {
                this.toppingsHamburg.splice(key, 1);
            }
        }
    }

    isCanBeClick(obj, string) {
        if (Object.values(obj).length === 2) {
            alert(`Сначала выберете ${string} гамбургера`);
            return true;
        }
    }

    countCalorie() {
        this.calories = this.sizeHamburg.calories + this.fillingHamburg.calories;
        this.toppingsHamburg.forEach(elem => this.calories += elem.calories);
    }

    countPrice() {
        this.price = this.sizeHamburg.price + this.fillingHamburg.price;
        this.toppingsHamburg.forEach(elem => this.price += elem.price);
    }

    render() {
        let block = document.querySelector('.order__count');
        block.innerHTML = `<p>Цена ${this.price} Колории ${this.calories}</p>`;
    }
}

new Hamburger();