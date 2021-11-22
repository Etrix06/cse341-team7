const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/services', shopController.getServices);

//getTalents
router.get('/talents', shopController.getTalents);

router.get('/products/:productId', shopController.getProduct);

router.get('/signups', isAuth, shopController.getSignups);

router.post('/signups', isAuth, shopController.postSignups);

// router.get('/cart', isAuth, shopController.getCart);

// router.post('/cart', isAuth, shopController.postCart);

// router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.post('/create-order', isAuth, shopController.postOrder);

// router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;