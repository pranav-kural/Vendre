// import the express router module
let router = require('express').Router();

// sendemail module to send contact email from buyer to the seller
var sendmail = require('sendmail')();

// link to the product model for CRUD operations
let Product = require('../models/product');

// auth check
function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next(); // user is logged, so call the next function
   }

   res.redirect('/'); // not logged in so redirect to home
}

/* GET products main page */
router.get('/', function(req, res, next) {

   // use mongoose model to query mongodb for all products
   Product.find(function(err, products) {
     
      if (req.user) {
        res.render('products/index', {
            products: products.filter((product) => { return product.seller != req.user._id; }),
            title: 'Products on sale',
            user: req.user
        });
      } else {
        res.render('products/index', {
            products: products,
            title: 'Products on sale',
            user: req.user
        });
      }

   });
});

/* GET products main page */
router.get('/myproducts', function(req, res, next) {
    // use mongoose to find the selected product
    Product.find(function(err, products) {
        if (err || !req.user) {
            console.log(err);
            res.render('error');
            return;
        }

        res.render('products/myProducts', {
            products: products.filter((product) => { return product.seller == req.user._id; }),
            title: 'Product Details',
            user: req.user
        });
    });
});

// GET request for the Add Product Page
router.get('/add', isLoggedIn,  function(req, res, next) {
   // show the add form
   res.render('products/add', {
      title: 'Product Details',
       user: req.user
   });
});

// POST request from the Add Product page
router.post('/add', isLoggedIn, function(req, res, next) {
   // use Mongoose to populate a new Product
  Product.create({
      // add the new product to the database
      name: req.body.name,
      condition: req.body.condition,
      price: req.body.price,
      year: req.body.year,
      seller: req.body.seller
   }, function(err, product) {
          // if error in adding the new product
          if (err) {
             console.log(err);
             res.render('error');
             return;
          }

         // if new product added successfully, then redirect to the products page
         res.redirect('/products/myproducts');
   });
});


// GET the Product page for the id
router.get('/:_id', isLoggedIn, function(req, res, next) {
   // get id from the url
   let _id = req.params._id;

   // use mongoose to find the selected product
   Product.findById(_id, function(err, product) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('products/product', {
         product: product,
         title: 'Product Details',
          user: req.user
      });
   });
});

// GET request to delete a product
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
   // get the id parameter from the end of the url
   let _id = req.params._id;

   // use Mongoose to delete the product from the database
   Product.remove({ _id: _id }, function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/products');
   });
});

// GET the Edit Product page
router.get('/edit/:_id', isLoggedIn, function(req, res, next) {
   // get id from the url
   let _id = req.params._id;

   // use mongoose to find the selected product
   Product.findById(_id, function(err, product) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('products/edit', {
         product: product,
         title: 'Product Details',
          user: req.user
      });
   });
});

// POST request from the Edit product page
router.post('/edit/:_id', isLoggedIn, function(req, res, next) {
   // get id from url
   let _id = req.params._id;

   // Get the new product information
   let product = new Product({
      _id: _id,
      name: req.body.name,
      condition: req.body.condition,
      price: req.body.price,
      year: req.body.year,
      seller: req.body.seller
   });

   // Update the product with new information 
   Product.update({ _id: _id }, product,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/products');
   });
});

// GET request for the Buy Product Page
router.get('/buy/:_id', function(req, res, next) {
    // get id from the url
   let _id = req.params._id;

   // use mongoose to find the selected product
   Product.findById(_id, function(err, product) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('products/buy', {
         product: product,
         title: 'Buy Product',
          user: req.user
      });
   });
});


// POST request from the Edit product page
router.post('/buy/:_id', function(req, res, next) {

    // send confirmation mail to buyer
    sendmail({
        from: 'sales@classified.com',
        to: req.body.email,
        subject: 'Thanks for contacting the seller',
        html: 'Thanks for contacting the seller. You\'ll get contacted by them very soon. Hope you enjoyed your experience with the classified website.',
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });

    // send the mail to seller
    sendmail({
        from: req.body.email,
        to: 'orders@classified.com',
        subject: 'New Order',
        html: 'New order for seller: ' + req.body.seller_id + ' for product: ' + req.body.product_id + '. Buyer info: Name: ' + req.body.name + ' Phone: ' + req.body.phone + ' Message: ' + req.body.message,
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });

    res.redirect('/products');
});

// make this file public
module.exports = router;
