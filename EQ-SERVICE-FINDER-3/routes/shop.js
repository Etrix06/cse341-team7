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

router.post('/PostSignupCancel', isAuth, shopController.postSignupCancel);








module.exports = router;