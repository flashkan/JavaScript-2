Vue.component('cart', {
    data() {
        return {
            productsInCart: [],
            imgCart: 'https://placehold.it/200x150',
            showCart: false,
            animationAdd: false,
            flagOnClick: true,
        }
    },
    methods: {
        addProduct(product) {
            if (this.flagOnClick) {
                this.flagOnClick = false;
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
                                this.animationAddProd();
                            }
                        })
                } else {
                    let prod = Object.assign({quantity: 1}, product);
                    this.$parent.postJson('/api/cart', {main: prod, id: prod.id_product, event: 'add'})
                        .then(data => {
                            if (data.result) {
                                this.productsInCart.push(prod);
                                this.animationAddProd();
                            }
                        })
                }
                setTimeout(() => this.flagOnClick = true, 300);
            }
        },

        remProduct(product) {
            if (this.flagOnClick) {
                this.flagOnClick = false;
                if (product.quantity > 1) {
                    this.$parent.putJson(`/api/cart/${product.id_product}`, {
                        quantity: -1,
                        id: product.id_product,
                        event: 'del'
                    })
                        .then(data => {
                            if (data.result) {
                                product.quantity--;
                            }
                        })
                } else {
                    this.$parent.delJson(`/api/cart/${product.id_product}`, {
                        quantity: -1,
                        id: product.id_product,
                        event: 'del',
                    })
                        .then(data => {
                            if (data.result) {
                                this.productsInCart.forEach((el, idx) => {
                                    if (el.id_product === product.id_product) {
                                        this.productsInCart.splice(idx, 1);
                                    }
                                });
                            }
                        })
                }
                setTimeout(() => this.flagOnClick = true, 300);
            }
        },

        animationAddProd() {
            this.animationAdd = true;
            setTimeout(() => this.animationAdd = false, 500);
        }
    },
    mounted() {
        this.$parent.getJson('/api/cart')
            .then(data => {
                for (let el of data.contents) {
                    this.productsInCart.push(el)
                }
            });

    },
    template: `<div class="cart-container">
                    <button @click="showCart = !showCart" class="btn cart-container__btn_cart" data-id="cart"
                            type="button">Корзина
                    </button>
                    <p v-if="animationAdd" class="addProdText text-blur-out">+1</p>
                    <transition name="title">
                        <div v-show="showCart" class="cart">
                            <p v-if="!productsInCart.length">«Нет данных»</p>
                            <cart-item 
                            v-for="prodCart of productsInCart" 
                            :key="prodCart.id_product"
                            :img="imgCart"
                            :prod-cart="prodCart"
                            @remove="remProduct"></cart-item>
                        </div>
                    </transition>
                </div>
                        `
});

Vue.component('cart-item', {
    props: ['prodCart', 'img'],
    template: `<div class="cart__product">
                    <img class="cart__product_img" :src="img" alt="Img">
                    <div class="cart__product_text-box">
                        <h3 class="cart__product_title">{{ prodCart.product_name }}</h3>
                        <p class="cart__product_price">Цена {{ prodCart.price }} руб.</p>
                        <p class="cart__product_quantity">Колличество {{ prodCart.quantity }}.</p>
                        <button @click="$emit('remove', prodCart)"
                                class="btn cart__product_btn btn_del-from-cart">
                            Удалить
                        </button>
                    </div>
                </div>`
});