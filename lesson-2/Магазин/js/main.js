"use strict";

class ProductsList {
    constructor() {
        this.products = [];
        this.sumPrice = 0;
        this.init();

    }

    init() {
        this.fetchProducts();
        this.render();
        this.sumPriceCatalog();
    }

    fetchProducts() {
        this.products = [
            {title: 'Notebook', price: 2000},
            {title: 'Mouse', price: 20},
            {title: 'Keyboard', price: 48},
            {title: 'Gamepad', price: 63},
            {title: 'Chair', price: 200},
            {title: 'Super Notebook', price: 4000},
            {title: 'Super Mouse', price: 40},
            {title: 'Super Keyboard', price: 78},
            {title: 'Super Gamepad', price: 93},
            {title: 'Super Chair', price: 400},
        ]
    }

    sumPriceCatalog() {
        this.products.forEach(product => {
            this.sumPrice += product.price;
        });
        console.log(`Стоимость всех товаров в каталоге составляет : ${this.sumPrice} единиц`)
    }

    render() {
        const block = document.querySelector('.products');
        this.products.forEach(product => {
            const prod = new Product(product);
            block.insertAdjacentHTML('beforeend', prod.render())
        })
    }
}

class Product {
    constructor(product) {
        this.title = product.title;
        this.price = product.price;
    }

    render() {
        return `<div class="product-item">
                    <img class="product-item__img" src="img/${this.title}.jpg" alt="${this.title}">
                    <h3 class="product-item__title">${this.title}</h3>
                    <p class="product-item__price">Price ${this.price}</p>
                    <button class="btn product-item__btn_add-to-cart">Add to cart</button>
                </div>`
    }
}

let products = new ProductsList();

class CartList {
    constructor() {
        this.elemsInCart = []; // товары добавленные в корзину (пока пусто).
        this.init()
    }

    init(){
        // render.
        // вешаем события на кнопки.
    }

    eventHendlerCart() {
        // обработчик событий при нажатии на кнопку "Cart".
    }

    eventHendler() {
        // обработчик событий для добавления в корзину.
    }

    eventHendlerForDelFromCart() {
        // обработчик событий для удаления из корзины.
    }

    addElemToCart() {
        // добавляем товар в корзину. Товар заносится в массив с товарами "elemsInCart".
    }

    remElemFromCart() {
        // удаляем элемент.
    }

    sumPriceEltms() {
        // сумма товаров в корзине.
    }

    totalAmountEltms() {
        // общее колличество товара в корзине.
    }

    render() {
        // отображаем готовый список товаров в карзине.
    }
}

class CartElem {
    constructor() {
    }

    render() {
        // собираем элемент для отображения.
    }
}