const express = require('express');
const fs = require('fs');
const cart = require('./cartRouter');
const app = express();

app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/cart', cart);

app.post('/api/products',(req, res) => {
    if (req.body.location === '/index.html') {
        fs.readFile('server/db/showProdIndex.json', 'utf-8', (err, data) => {
            if (err) {
                res.sendStatus(404, JSON.stringify({result: 0, text: err}));
            } else {
                res.send(data)
            }
        })
    } else if (req.body.location === '/product.html') {
        fs.readFile('server/db/showProdProduct.json', 'utf-8', (err, data) => {
            if (err) {
                res.sendStatus(404, JSON.stringify({result: 0, text: err}));
            } else {
                res.send(data)
            }
        })
    } else if (req.body.location === '/single-page.html') {
        fs.readFile('server/db/showProdSinglePage.json', 'utf-8', (err, data) => {
            if (err) {
                res.sendStatus(404, JSON.stringify({result: 0, text: err}));
            } else {
                res.send(data)
            }
        })
    }
    // fs.readFile('server/db/catalogData.json', 'utf-8', (err, data) => {
    //     if (err) {
    //         res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    //     } else {
    //         res.send(data)
    //     }
    // })
});

app.listen(3000, () => console.log('Server started'));