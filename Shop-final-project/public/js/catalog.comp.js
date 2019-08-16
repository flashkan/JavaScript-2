"use strict";

Vue.component("products", {
    props: ['location'],
    data() {
        return {
            goods: [],
        };
    },
    mounted() {
        this.$parent.postJson('/api/products', {location: window.location.pathname})
            .then(data => {
                for (const el of data) {
                    this.goods.push(el);
                }
            });
    },
    template: `<div class="featured-items">
                <product
                v-for="product of goods"
                :key="product.id_product"
                :product="product"></product>
            </div>`
});

Vue.component('product', {
    props: ['product'],
    template: `<div class="featured-items-product">
                <a class="featured-product" href="single-page.html">
                    <img :src="product.img" alt="featured">
                    <p class="featured-items-p">{{product.product_name}}</p>
                    <p class="featured-items-price">\${{product.price}} <span class="items-stars"><i class="star fas fa-star"></i><i
                            class="star fas fa-star"></i><i class="star fas fa-star"></i><i class="star fas fa-star"></i><i
                            class="star fas fa-star"></i></span></p>
                </a>
                <a @click="$root.$refs.cart.addProduct(product)" class="product-add" href="#"><img src="img/add-product.png" alt="add-product"> Add to Cart</a>
                <a class="mix-product" href="#"><img src="img/mix.png" alt="mix"></a>
                <a class="like-product" href="#"><img src="img/like.png" alt="like"></a>
            </div>`
});