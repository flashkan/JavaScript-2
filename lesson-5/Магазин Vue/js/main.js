"use strict";

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let app = new Vue({
    el: '#app',
    data: {
        goods: [],
        showProducts: [],
        goodsCart: [],
        productsInCart: [],
        imgCatalog: 'https://placehold.it/200x150',
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        addToBasketUrl: '/addToBasket.json',
        deleteFromBasketUrl: '/deleteFromBasket.json',
        nameProducts: '',
        showTitleSearch: false,
        showCart: false,
        animationAdd: false,
    },

    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error))
        },

        filterCatalog() {
            setTimeout(() => {
                this.showProducts = this.goods.filter(prod => {
                    return prod.product_name.toLowerCase().indexOf(this.nameProducts.toLowerCase()) > -1;
                });
                this.titleSearch();
            }, 10);
        },

        titleSearch() {
            this.showTitleSearch = this.nameProducts.length !== 0 && this.showProducts.length === 0;
        },

        addProduct(product) {
            this.getJson(`${API + this.addToBasketUrl}`)
                .then(el => {
                    if (el.result) {
                        this.addProductImplement(product);
                        this.animationAddProd();
                    }
                })
        },

        addProductImplement(product) {
            const addElem = this.goodsCart.find(el => el.id_product === product.id_product);
            const isProdInCart = this.productsInCart.find(el => el.id_product === addElem.id_product);
            if (isProdInCart) {
                isProdInCart.quantity++
            } else {
                this.productsInCart.push(addElem);
            }
        },

        remProduct(product) {
            this.getJson(`${API + this.deleteFromBasketUrl}`)
                .then(el => {
                    if (el.result) {
                        this.remProductImplement(product);
                    }
                })
        },

        remProductImplement(product) {
            if (product.quantity > 1) {
                product.quantity--
            } else {
                this.productsInCart.forEach((el, idx, arr) => {
                    if (el.id_product === product.id_product) {
                        arr.splice(idx, 1);
                    }
                });
            }
        },

        animationAddProd() {
            this.animationAdd = true;
            setTimeout(() => this.animationAdd = false, 500);
        }
    },

    mounted() {
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.goods.push(el);
                }
            });
        this.getJson('getProducts.json')
            .then(data => {
                for (let el of data) {
                    this.goods.push(el);
                }
            });
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let el of data.contents) {
                    this.goodsCart.push(el)
                }
            });
        this.getJson('getProducts.json')
            .then(data => {
                for (let el of data) {
                    el.quantity = 1;
                    this.goodsCart.push(el);
                }
            });
    },
});