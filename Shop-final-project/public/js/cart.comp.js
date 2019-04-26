"use strict";

Vue.component('cart', {
    data() {
        return {
            productsInCart: [],
            showCart: false,
            animationAdd: false,
            flagOnClick: true,
            totalPrice: 0,
        }
    },
    methods: {
        addProduct(product) {
            const isProdInCart = this.productsInCart.find(el => el.id_product === product.id_product);
            if (isProdInCart) {
                this.$parent.putJson(`/api/cart/${isProdInCart.id_product}`, {
                    quantity: 1,
                    id: isProdInCart.id_product,
                    event: 'add',
                })
                    .then(data => {
                        if (data.result) {
                            isProdInCart.quantity++;
                            this.totPrice();
                        }
                    })
            } else {
                let prod = Object.assign({quantity: 1}, product);
                prod.img = prod.img.replace(/product\./, 'product-min.');
                this.$parent.postJson('/api/cart', {main: prod, id: prod.id_product, event: 'add'})
                    .then(data => {
                        if (data.result) {
                            this.productsInCart.push(prod);
                            this.totPrice();
                        }
                    })
            }
        },

        remProduct(product) {
            if (product.quantity > 1) {
                this.$parent.putJson(`/api/cart/${product.id_product}`, {
                    quantity: -1,
                    id: product.id_product,
                    event: 'del'
                })
                    .then(data => {
                        if (data.result) {
                            product.quantity--;
                            this.totPrice();
                        }
                    })
            } else {
                this.$parent.delJson(`/api/cart/${product.id_product}`, {
                    id: product.id_product,
                    event: 'del',
                })
                    .then(data => {
                        if (data.result) {
                            this.productsInCart.forEach((el, idx) => {
                                if (el.id_product === product.id_product) {
                                    this.productsInCart.splice(idx, 1);
                                    this.totPrice();
                                }
                            });
                        }
                    })
            }
        },

        totPrice() {
            this.totalPrice = 0;
            this.productsInCart.forEach(el => this.totalPrice += el.price * el.quantity);
        }
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for (let el of data.contents) {
                    this.productsInCart.push(el);
                }
                this.totPrice()
            });
    },

    template: `<div class="icon-bascet-container">
                    <a class="icon-bascet-a" href="shopping-cart.html"><img class="icon-bascet" src="img/cart.svg"
                                                                            alt="cart"></a>
                    <div class="drop-cart scale-in-top_featured">
                        <cart-item 
                            v-for="prodCart of productsInCart" 
                            :key="prodCart.id_product"
                            :prod-cart="prodCart"
                            @remove="remProduct"></cart-item>
                        <div class="cart-total-price">
                            <p class="cart-total-price-p">TOTAL</p>
                            <p class="cart-total-price-p">\${{totalPrice}}.00</p>
                        </div>
                        <a class="drop-cart-checkout" href="#">Checkout</a> <a class="drop-cart-checkout" href="shopping-cart.html">Go to
                        cart</a></div>
                </div>`,


});

Vue.component('cart-item', {
    props: ['prodCart'],
    template: `<div class="cart-prod-container">
                            <a href="single-page.html">
                                <div class="cart-prod-icon"><img :src="prodCart.img" alt="cart-prod-icon">
                                    <div>
                                        <p class="cart-prod-icon-p">{{prodCart.product_name}}</p>
                                        <p><i class="star fas fa-star"></i><i class="star fas fa-star"></i><i
                                                class="star fas fa-star"></i><i class="star fas fa-star"></i><i
                                                class="star fas fa-star-half-alt"></i></p>
                                        <p class="cart-prod-icon-price">{{prodCart.quantity}} 
                                        <span class="cart-prod-price-span">x</span> {{prodCart.price}}</p>
                                    </div>
                                </div>
                            </a>
                            <a @click="$emit('remove', prodCart)" href="#" class="cross fas fa-times-circle"></a>
                        </div>`
});

Vue.component('main-cart', {
    data() {
        return {
            productsInCart: this.$root.$refs.cart.productsInCart,
            preValue: 0,
        }
    },
    methods: {
        mouseFocus(event) {
            this.preValue = +event.target.value;
        },
        changeProduct(product, event) {
            let value = +event.target.value;
            if (this.preValue > value) {
                const quantity = this.preValue - value;
                this.$parent.putJson(`/api/cart/${product.id_product}`, {
                    quantity: -quantity,
                    id: product.id_product,
                    event: 'del',
                })
                    .then(data => {
                        if (data.result) {
                            product.quantity = value;
                            this.$root.$refs.cart.totPrice();
                        }
                    })
            } else {
                const quantity = value - this.preValue;
                this.$parent.putJson(`/api/cart/${product.id_product}`, {
                    quantity: quantity,
                    id: product.id_product,
                    event: 'add',
                })
                    .then(data => {
                        if (data.result) {
                            product.quantity = value;
                            this.$root.$refs.cart.totPrice();
                        }
                    })
            }
            this.preValue = +event.target.value
        },
        deleteProd(product) {
            this.$parent.delJson(`/api/cart/${product.id_product}`, {
                id: product.id_product,
                event: 'del',
            })
                .then(data => {
                    if (data.result) {
                        this.productsInCart.forEach((el, idx) => {
                            if (el.id_product === product.id_product) {
                                this.productsInCart.splice(idx, 1);
                                this.$root.$refs.cart.totPrice();
                            }
                        });
                    }
                })
        },

    },
    template: `<div>
                    <main-cart-item 
                        v-for="prodCart of productsInCart" 
                        :key="prodCart.id_product"
                        :prod-cart="prodCart">
                    </main-cart-item>
                </div>
                `
});

Vue.component('main-cart-item', {
    props: ['prodCart'],

    template: `<div class="product-details-block" >
                <div class="product-details-block-description">
                <a href="single-page.html"><img :src="prodCart.img" alt="prod-in-cart-1"></a>
                <div class="product-details-text"><a class="product-details-text-a" href="single-page.html"><h3
                        class="product-details-text-h3">Mango People T-shirt</h3></a>
                    <a href="#"><p><i class="star fas fa-star"></i><i class="star fas fa-star"></i><i
                            class="star fas fa-star"></i><i class="star fas fa-star"></i><i
                            class="star fas fa-star-half-alt"></i></p></a>
                    <p class="product-details-text-p">Color: <span class="product-details-text-span">Red</span></p>
                    <p class="product-details-text-p">Size: <span class="product-details-text-span">Xll</span></p></div>
                </div>
                <p class="product-details-block-price text-center">\${{prodCart.price}}</p>
                <input @mouseover="$parent.mouseFocus(event)" @change="$parent.changeProduct(prodCart, event)" class="product-details-block-quantity text-center" 
                v-model="prodCart.quantity" min="1" type="number">
                <p class="product-details-block-shipping text-center">FREE</p>
                <p class="product-details-block-subtotal text-center">\${{prodCart.price * prodCart.quantity}}</p>
                <div class="product-details-block-cross text-center"><a @click="$parent.deleteProd(prodCart)" class="fas fa-times-circle"></a></div>
            </div>`
});

Vue.component('sumPrice', {
    template: ` <div>
                    <p class="form-to-cart-total-p">Sub total <span class="form-to-cart-total-p-span">$\{{$root.$refs.cart.totalPrice}}</span></p>
                    <h3 class="form-to-cart-total-h3">GRAND TOTAL <span class="form-to-cart-total-h3-span">$\{{$root.$refs.cart.totalPrice}}</span></h3>
                </div>`
});