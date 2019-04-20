Vue.component('search', {
    data() {
        return {
            nameProducts: '',
            showTitleSearch: false,
        };
    },
    methods: {
        filterCatalog() {

            setTimeout(() => {
                const callToProducts = this.$root.$refs.products;
                callToProducts.showProducts = callToProducts.goods.filter(prod => {
                    return prod.product_name.toLowerCase().indexOf(this.nameProducts.toLowerCase()) > -1;
                });
                this.titleSearch(callToProducts);
            }, 10);
        },
        titleSearch(callToProducts) {
            this.showTitleSearch = this.nameProducts.length !== 0 && callToProducts.showProducts.length === 0;
        },
    },
    template: `<div class="search">
                <transition name="title">
                    <p v-if="showTitleSearch" class="header_right__title">Такой элемент не найден.</p>
                </transition>
                <input @keydown.enter.delete="filterCatalog" v-model="nameProducts"
                       class="search__search-products_input"
                       type="text" placeholder="Поиск товаров...">
                <button @click="filterCatalog" class="search__search-products_btn"><i class="fas fa-search"></i>
                </button>
                </div>`

});