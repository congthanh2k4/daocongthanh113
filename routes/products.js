var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let productModel = require('../schemas/products')

/* GET users listing. */
router.get('/', function (req, res, next) {
  let queries = req.query;
  let titleQ = queries.title ? queries.title : "";
  let minPrice = queries.min ? queries.min : 0;
  let maxPrice = queries.max ? queries.max : 10000;
  console.log(queries);
  let result = productModel.find(
    {
      isDeleted: false,
      title: titleQ,
      price: {
        $gte: minPrice,
        $lte: maxPrice
      }
    }
  );
  res.send(result);
});
///api/v1/products/id
router.get('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = productModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});
router.post('/', function (req, res, next) {
  let newProduct = productModel.create({
    title: req.body.title,
    slug: slugify(req.body.title, {
      replacement: '-',
      remove: undefined,
      lower: true
    }),
    price: req.body.price,
    description: req.body.description,
    images: req.body.images,
    category: req.body.category
  });
  res.send(newProduct)
})
router.put('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = productModel.findByIdAndUpdate(id, req.body);
    res.send(result)
  } catch (error) {
    res.status(404).send(error)
  }
})
router.delete('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = productModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
})
module.exports = router;

