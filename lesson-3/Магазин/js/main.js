"use strict";

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList {
    constructor() {
        this.goods = []; // массив товаров каталога.
        this.init();
    }

    init() {
        this._getProducts();
        this.cart = new CartList(); // инициализация корзины.
    }

    _getProducts() {  // получаем товары с сервера.
        fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                this.goods = [...data];
                this.goods.forEach(elem => elem.quantity = 1);
                this.render();
                this.addEvent();
            })
    }

    addEvent() { // вешаем событие.
        document.querySelectorAll('.btn').forEach(elem => {
            elem.addEventListener('click', event => this.eventHandler(event))
        })
    }

    eventHandler(event) { // обработчик событий.
        if (event.target.dataset.id === 'cart') {
            this.eventHandlerCart(); // открытие корзины.
            return;
        }
        this.cart.eventHandlerAddToCart(this.goods, event); // добавление товара
    }

    eventHandlerCart() { // обработчик события корзины.
        this.cart.logicCart();
    }

    render() { // рендер каталога.
        const block = document.querySelector('.products');
        this.goods.forEach(product => {
            const prod = new Product(product);
            block.insertAdjacentHTML('beforeend', prod.render())
        })
    }
}

class Product { // класс для рендера продукта каталога.
    constructor(product) {
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product = product.id_product;
        this.img = 'img/stub.jpg'
    }

    render() {
        return `<div class="product-item">
                    <img class="product-item__img" src="${this.img}" alt="${this.product_name}">
                    <h3 class="product-item__title">${this.product_name}</h3>
                    <p class="product-item__price">Цена ${this.price} руб.</p>
                    <button class="btn product-item__btn_add-to-cart" data-id="${this.id_product}">Добавить в корзину</button>
                </div>`
    }
}

class CartList {
    constructor() {
        this.frontElemsInCart = []; // массив для отоборажения корзины.
        this.backElemsInCart = []; // массив для хранения всех элеметнов в корзине.
        this.init()
    }

    init() {
        this._getProductInCart();
    }

    _getProductInCart() { // получаем данные с сервера.
        fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .then(data => {
                this.backElemsInCart = {...data};
                this._initElemsInCart();
            });
    }

    _initElemsInCart() { // инициализируем данные для рендера. Заполняем массив для отображеня из массива для хранения.
        this.frontElemsInCart = [];
        this.backElemsInCart.contents.forEach(elem => {
            if (this.frontElemsInCart.length === 0) {
                this.frontElemsInCart.push({...elem});
                return;
            }
            let count = 0;
            for (let i = 0; i < this.frontElemsInCart.length; i++){
                if (elem.id_product === this.frontElemsInCart[i].id_product) {
                    this.frontElemsInCart[i].quantity++;
                    count++
                }
            }

            if (count === 0) {
                this.frontElemsInCart.push({...elem});
            }
        });
        this.totalAmountEltms(); // подсчет общей суммы
        this.sumPriceEltms();    // и колличеста.
    }

    addEventForDelFromCart() {  // вешаем событие на кнопки для удаления.
        document.querySelector('.cart')
            .addEventListener('click', event => this.eventHandlerDelFromCart(event));
    }

    eventHandlerAddToCart(goods, event) { // обработчик событий для добавления в корзину.
        fetch(`${API}/addToBasket.json`)
            .then(result => result.json())
            .then(data => {
                if (data.result) {
                    this.addElemToCart(goods, event)
                }
            });
    }

    eventHandlerDelFromCart(event) { // обработчик событий для удаления из корзины.
        if (event.target.tagName !== 'BUTTON') {
            return;
        }
        fetch(`${API}/deleteFromBasket.json`)
            .then(result => result.json())
            .then(data => {
                if (data.result) {
                    this.remElemFromCart(event);
                }
            })
    }

    addElemToCart(goods, event) { // добавление элемента в корзину. Затем инициализация и если необходимо рендер.
        goods.find((elem) => {
            if (elem.id_product === +event.target.dataset.id) {
                this.backElemsInCart.contents.push({...elem});
            }
        });
        this._initElemsInCart();
        this.renderClick();
    }

    remElemFromCart(event) { // удаление элемента из корзины. Затем инициализация и если необходимо рендер.
        this.backElemsInCart.contents.find((elem, idx) => {
            if (elem.id_product === +event.target.dataset.id) {
                this.backElemsInCart.contents.splice(idx, 1);
                return true;
            }
        });
        this._initElemsInCart();
        this.renderClick();
    }

    sumPriceEltms() { // считает сумму товаров в корзине.
        this.backElemsInCart.amount = 0;
        this.backElemsInCart.contents.forEach(elem => this.backElemsInCart.amount += elem.price);
    }

    totalAmountEltms() { // считает колличество товаров в корзине.
        this.backElemsInCart.countGoods = this.backElemsInCart.contents.length;
    }

    logicCart() { // вызывается по клику на "Корзину" и определяет закрыть или открыть корзину.
        if (this.closeCart()) {
            this.openCart();
        }
    }

    closeCart() { // закрывает корзину.
        let elem = document.querySelector('.cart');
        if (elem) {
            elem.parentElement.removeChild(elem);
            return false;
        }
        return true;
    }

    openCart() { // открывает корзину.
        this.renderAll();
        this.addEventForDelFromCart();
    }

    renderClick() { // имитация анимации карзины в случае, если она открыта.
        let elem = document.querySelector('.cart');
        if (elem) {
            this.closeCart();
            this.openCart();
        }
    }

    renderAll() { // отображение всех элементов.
        document.querySelector('.cart-container')
            .insertAdjacentHTML('beforeend', this.render(this.backElemsInCart));
        this.frontElemsInCart.forEach(elem => {
            const cartElem = new CartElem(elem);
            document.querySelector('.cart').insertAdjacentHTML('beforeend', cartElem.render());
        });
    }

    render(product) { // рендер общей информации корзины.
        return `<div class="cart">
                    <p class="">Общая стоимость ${product.amount} руб.</p>
                    <p class="">Товаров в карзине ${product.countGoods}.</p>
                </div>`
    }
}

class CartElem { // класс для рендера элемента в корзине.
    constructor(element) {
        this.img = 'img/stub.jpg';
        this.product_name = element.product_name;
        this.price = element.price;
        this.id_product = element.id_product;
        this.quantity = element.quantity
    }

    render() {
        return `<div class="cart__product " data-id="${this.id_product}">
                    <img class="cart__product_img" src="${this.img}" alt="${this.product_name}">
                    <div class="cart__product_text-box">
                        <h3 class="cart__product_title">${this.product_name}</h3>
                        <p class="cart__product_price">Цена ${this.price} руб.</p>
                        <p class="cart__product_quantity">Колличество ${this.quantity}.</p>
                        <button class="btn cart__product_btn btn_del-from-cart" data-id="${this.id_product}">Удалить</button>
                    </div>
                </div>`
    }
}

new ProductsList();

