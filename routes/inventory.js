var express = require("express");
var router = express.Router();
let inventoryController = require("../controllers/inventory");

// get all
router.get("/", async (req, res) => {
  let data = await inventoryController.GetAll();
  res.send(data);
});

// get by id
router.get("/:id", async (req, res) => {
  let data = await inventoryController.GetById(req.params.id);
  res.send(data);
});

// add stock
router.post("/add-stock", async (req, res) => {
  let { product, quantity } = req.body;
  let result = await inventoryController.AddStock(product, quantity);
  res.send(result);
});

// remove stock
router.post("/remove-stock", async (req, res) => {
  let { product, quantity } = req.body;
  let result = await inventoryController.RemoveStock(product, quantity);
  res.send(result);
});

// reservation
router.post("/reservation", async (req, res) => {
  let { product, quantity } = req.body;
  let result = await inventoryController.Reservation(product, quantity);
  res.send(result);
});

// sold
router.post("/sold", async (req, res) => {
  let { product, quantity } = req.body;
  let result = await inventoryController.Sold(product, quantity);
  res.send(result);
});

module.exports = router;
