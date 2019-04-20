let add = (cart, req) => {
    cart.contents.push(req.body);
    return JSON.stringify(cart, null, 4);
};

let change = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
    find.quantity += req.body.quantity;
    return JSON.stringify(cart, null, 4);
};

let del = (cart, req) => {
    // for (const key in cart.contents) {
    //     if (cart.contents[key].id_product === +req.params.id) {
    //         cart.contents.splice(key, 1);
    //         return JSON.stringify(cart, null, 4);
    //     }
    // }
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
