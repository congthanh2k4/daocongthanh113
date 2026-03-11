var express = require('express');
var router = express.Router();
const slugify = require('slugify');
let categoryModel = require('../schemas/categories')

/* GET users listing. */
router.get('/', function (req, res, next) {
  let dataCategories = categoryModel.find(
    {
      isDeleted: false
    }
  )
  res.send(dataCategories);
});
///api/v1/products/id
router.get('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = categoryModel.findById(id);
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
router.get('/:id/products', function (req, res, next) {
  let id = req.params.id;
  let result = dataCategories.filter(
    function (e) {
      return e.id == id && !e.isDeleted
    }
  )
  if (result.length) {
    result = dataProducts.filter(
      function (e) {
        return e.category.id == id && !e.isDeleted
      }
    )
    res.send(result)
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});
router.post('/', function (req, res, next) {
  let newCate = categoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name, {
      replacement: '-',
      remove: undefined,
      lower: true
    }),
    image: req.body.image
  });
  res.send(newCate)
})
router.put('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = categoryModel.findByIdAndUpdate(id, req.body);
    res.send(result)
  } catch (error) {
    res.status(404).send(error)
  }
})
router.delete('/:id', function (req, res, next) {
  try {
    let id = req.params.id;
    let result = categoryModel.findByIdAndDelete(id);
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

