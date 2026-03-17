var express = require("express");
var router = express.Router();
let productModel = require("../schemas/products");
const slugify = require("slugify"); // ❌ bỏ destructuring sai

// GET ALL
router.get("/", async function (req, res, next) {
  try {
    let queries = req.query;
    let minPrice = queries.minprice ? queries.minprice : 0;
    let maxPrice = queries.maxprice ? queries.maxprice : 10000;
    let titleQ = queries.title ? queries.title : "";

    let result = await productModel
      .find({
        isDeleted: false,
        title: new RegExp(titleQ, "i"),
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      })
      .populate({
        path: "category",
        select: "name",
      });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET BY ID
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    let result = await productModel.findOne({
      isDeleted: false,
      _id: id,
    });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// CREATE PRODUCT
router.post("/", async function (req, res, next) {
  try {
    // 🚨 validate
    if (!req.body.title) {
      return res.status(400).send({ message: "title is required" });
    }

    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title.toString(), {
        lower: true,
      }),
      price: req.body.price || 0,
      description: req.body.description || "",
      category: req.body.category || null,
      images: req.body.images || [],
    });

    await newProduct.save();

    res.send(newProduct);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// UPDATE
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    // nếu có title thì update slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toString(), {
        lower: true,
      });
    }

    let updatedItem = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.send(updatedItem);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE (SOFT DELETE)
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    let updatedItem = await productModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    res.send(updatedItem);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
