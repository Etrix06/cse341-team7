const path = require('path');

const express = require('express');
const {
    body
} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-post/:eqType', isAuth, adminController.getAddPost);

// /admin/products => GET
router.get('/posts/:eqType', isAuth, adminController.getPosts);

// /admin/add-product => POST
router.post(
    '/add-post',
    [
        body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('imageUrl').isURL(),
        // body('price').isFloat(),
        body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    isAuth,
    adminController.postAddPost
);

router.get('/edit-post/:eqType/:postId', isAuth, adminController.getEditPost);

router.post(
    '/edit-post',
    [
        body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('imageUrl').isURL(),
        // body('price').isFloat(),
        body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    isAuth,
    adminController.postEditPost
);

router.post('/delete-post', isAuth, adminController.postAddPost);

module.exports = router;