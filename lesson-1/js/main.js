const products = [
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
];

const renderProduct = (title = 'cap', price = 0) => {
    return `<div class="product-item">
                <img class="product-item__img" src="img/${title}.jpg" alt="${title}">
                <h3 class="product-item__title">${title}</h3>
                <p class="product-item__price">Price ${price}</p>
                <button class="btn product-item__btn_add-to-cart">Add to cart</button>
            </div>`
};

const renderPage = list => {
    const productList = list.map(item => renderProduct(item.title, item.price)).join('');
    document.querySelector('.products').innerHTML = productList;
};

renderPage(products);