Vue.component('products', {
    data() {
        return {
            goods: [],
            showProducts: [],
            imgCatalog: 'https://placehold.it/200x150',
            catalogUrl: '/catalogData.json',
        };
    },
    mounted() {
        this.$parent.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (const el of data) {
                    this.goods.push(el);
                    this.showProducts.push(el);
                }
            });
        this.$parent.getJson('getProducts.json')
            .then(data => {
                for (const el of data) {
                    this.goods.push(el);
                    this.showProducts.push(el);
                }
            });
    },
    methods: {

    },
    template: `<div class="products">
                <product
                v-for="product of showProducts.length !== 0 ? showProducts : goods"
                :key="product.id_product"
                :img="imgCatalog"
                :product="product"></product>
            </div>`
});

Vue.component('product', {
    props: ['product', 'img'],
    template: `<div class="product-item">
                    <img :src="img" class="product-item__img"  alt="Img">
                    <h3 class="product-item__title">{{ product.product_name }}</h3>
                    <p class="product-item__price">{{ product.price }}</p>
                    <button @click="$root.$refs.cart.addProduct(product)"
                            class="btn product-item__btn_add-to-cart">Добавить в корзину
                    </button>
                </div>`
});