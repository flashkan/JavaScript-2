let add = (cart, req) => {
    cart.contents.push(req.body.main);
    return JSON.stringify(cart, null, 4);
};

let change = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
    find.quantity += req.body.quantity;
    return JSON.stringify(cart, null, 4);
};

let del = (cart, req) => {
    for (let i = 0; i < cart.contents.length; i++) {
        if (cart.contents[i].id_product === +req.params.id) {
            cart.contents.splice(i, 1);
            return JSON.stringify(cart, null, 4);
        }
    }
};

module.exports = {
    add,
    change,
    del,
};
