const cart = require('./cart');
const fs = require('fs');
const moment = require('moment');
const actions = {
    add: cart.add,
    change: cart.change,
    del: cart.del
};

let addEventCart = (action, id) => {
    let event = {
        event: action,
        productId: id,
        dataTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
    };
    fs.readFile('server/db/eventCart.json', 'utf-8', (err, data) => {
        let events = (JSON.parse(data));
        events.push(event);
        let newEvents = JSON.stringify(events, null, 4);
        fs.writeFile('server/db/eventCart.json', newEvents, err => {
            if (err) {
                console.log(err);
            }
        })

    })
};

let handler = (req, res, action, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            let newCart = actions[action](JSON.parse(data), req);
            fs.writeFile(file, newCart, err => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({result: 0, text: err}));
                } else {
                    res.send({result: 1, text: 'Success!'});
                    addEventCart(req.body.event, req.body.id,);
                }
            })
        }
    })
};

module.exports = handler;
module.addEventCart = addEventCart;