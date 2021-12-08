const mongoose = require('mongoose');

const {
  validationResult
} = require('express-validator');

const Post = require('../models/post');

exports.getAddPost = (req, res, next) => {
  const eqType = req.params.eqType;
  console.log(eqType);
  res.render('admin/edit-post', {
    pageTitle: 'Add Post',
    path: '/admin/add-post',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    eqType: eqType
  });
};

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const eqType = req.body.eqType;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-post', {
      pageTitle: 'Add Post',
      path: '/admin/add-post',
      editing: false,
      hasError: true,
      post: {
        title: title,
        imageUrl: imageUrl,
        eqType: eqType,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    eqType: eqType,
    description: description,
    userId: req.user
  });
  post
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Post');
      res.redirect('/');              // this is where add Post redirects now
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditPost = (req, res, next) => {
  console.log("EDIT")
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.postId;
  const eqType = req.params.eqType;
  Post.findById(prodId)
    .then(post => {
      if (!post) {
        return res.redirect('/');
      }
      res.render('admin/edit-post', {
        pageTitle: 'Edit Post',
        path: '/admin/edit-post',
        editing: editMode,
        post: post,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        eqType: eqType
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditPost = (req, res, next) => {
  const prodId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-post', {
      pageTitle: 'Edit Post',
      path: '/admin/edit-post',
      editing: true,
      hasError: true,
      post: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Post.findById(prodId)
    .then(post => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      post.title = updatedTitle;
      post.description = updatedDesc;
      post.imageUrl = updatedImageUrl;
      return post.save().then(result => {
        console.log('UPDATED YOUR POST!');
        res.redirect('/');   //this is where we redirect happens.  Right now it goes home.
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getPosts = (req, res, next) => {
  const eqType = req.params.eqType;
  Post.find({
      userId: req.user._id
    })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(posts => {
      console.log(posts);
      res.render('admin/posts', {
        prods: posts,
        pageTitle: 'Admin Posts',
        path: '/admin/posts',
        eqType: eqType
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeletePost = (req, res, next) => {
  const prodId = req.body.postId;
  Post.deleteOne({
      _id: prodId,
      userId: req.user._id
    })
    .then(() => {
      console.log('DESTROYED POST');
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};