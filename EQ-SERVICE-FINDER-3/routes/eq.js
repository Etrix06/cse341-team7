const path = require('path');

const express = require('express');

const eqController = require('../controllers/eq');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', eqController.getIndex);

router.get('/services', eqController.getServices);

//getTalents
router.get('/talents', eqController.getTalents);

router.get('/products/:productId', eqController.getPost);


router.get('/signups', isAuth, eqController.getSignups);

router.post('/signups', isAuth, eqController.postSignups);

router.post('/PostSignupCancel', isAuth, eqController.postSignupCancel);








module.exports = router;