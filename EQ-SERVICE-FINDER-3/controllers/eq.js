const Post = require('../models/post');
const Order = require('../models/order');
const User = require('../models/user');

const ITEMS_PER_PAGE = 6;

exports.getServices = (req, res, next) => {
 const page = +req.query.page || 1;             //for pagination
  let totalItems;  

  Post.find({eqType: 'service'}).countDocuments().then(numPosts => {
    totalItems = numPosts;
    return Post.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
      res.render('eq/service-list', {
        prods: posts,
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

  Post.find({eqType: 'talent'}).countDocuments().then(numPosts => {
    totalItems = numPosts;
    return Post.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
      res.render('eq/talent-list', {
        prods: posts,
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

exports.getPost = (req, res, next) => {  //change to getPosting
  const prodId = req.params.postId;
  Post.findById(prodId)
    .then(post => {
      res.render('eq/post-detail', {
        post: post,
        pageTitle: post.title,
        path: '/posts'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;             //for pagination
  let totalItems;

  Post.find().countDocuments().then(numPosts => {
    totalItems = numPosts;
    return Post.find()
    .skip((page - 1) * ITEMS_PER_PAGE)              //for pagination
    .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
      res.render('eq/index', {
        prods: posts,
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
     .populate('cart.items.postId')
     // .execPopulate()
     .then(user => {
       const posts = user.cart.items;
       res.render('eq/signups', {
         path: '/signups',
         pageTitle: 'Your Signups',
         posts: posts
       });
     })
     .catch(err => {
       const error = new Error(err);
       error.httpStatusCode = 500;
       return next(error);
     });
 };

 exports.postSignups = (req, res, next) => {
   const prodId = req.body.postId;
   Post.findById(prodId)
     .then(post => {
       return req.user.addToCart(post);
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
   const prodId = req.body.postId;
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
    .populate('cart.items.postId')
    //.execPopulate()
    .then(user => {
      const posts = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          post: {
            ...i.postId._doc
          }
        };
      });
    });
  };