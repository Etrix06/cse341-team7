const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

const ITEMS_PER_PAGE = 6;

exports.getServices = (req, res, next) => {
 const page = +req.query.page || 1;             //for pagination
  let totalItems;  

  Product.find({eqType: 'service'}).countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/service-list', {
        prods: products,
        pageTitle: 'All Services',
        path: '/services',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getTalents = (req, res, next) => {
  const page = +req.query.page || 1;             //for pagination
  let totalItems;

  Product.find({eqType: 'talent'}).countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/talent-list', {
        prods: products,
        pageTitle: 'All Talents',
        path: '/talents',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {  //change to getPosting
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//getTalent
// exports.getTalent = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;             //for pagination
  let totalItems;

  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'EQ FINDER',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


 exports.getSignups = (req, res, next) => {
   req.user
     .populate('cart.items.productId')
     // .execPopulate()
     .then(user => {
       const products = user.cart.items;
       res.render('shop/signups', {
         path: '/signups',
         pageTitle: 'Your Signups',
         products: products
       });
     })
     .catch(err => {
       const error = new Error(err);
       error.httpStatusCode = 500;
       return next(error);
     });
 };

 exports.postSignups = (req, res, next) => {
   const prodId = req.body.productId;
   Product.findById(prodId)
     .then(product => {
       return req.user.addToCart(product);
     })
     .then(result => {
       console.log(result);
       res.redirect('/signups');
     })
     .catch(err => {
       const error = new Error(err);
       error.httpStatusCode = 500;
       return next(error);
     });
 };



 exports.postSignupCancel = (req, res, next) => {
   const prodId = req.body.productId;
   req.user
     .removeFromCart(prodId)
     .then(result => {
       res.redirect('/signups');
     })
     .catch(err => {
       const error = new Error(err);
       error.httpStatusCode = 500;
       return next(error);
     });
 };



exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: {
            ...i.productId._doc
          }
        };
      });
    });
  };