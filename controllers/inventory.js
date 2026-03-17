const inventoryModel = require("../schemas/inventory");

module.exports = {
  GetAll: async function () {
    return await inventoryModel.find().populate("product");
  },

  GetById: async function (id) {
    return await inventoryModel.findById(id).populate("product");
  },

  AddStock: async function (productId, quantity) {
    let inv = await inventoryModel.findOne({ product: productId });

    if (!inv) return false;

    inv.stock += quantity;
    await inv.save();

    return inv;
  },

  RemoveStock: async function (productId, quantity) {
    let inv = await inventoryModel.findOne({ product: productId });

    if (!inv || inv.stock < quantity) return false;

    inv.stock -= quantity;
    await inv.save();

    return inv;
  },

  Reservation: async function (productId, quantity) {
    let inv = await inventoryModel.findOne({ product: productId });

    if (!inv || inv.stock < quantity) return false;

    inv.stock -= quantity;
    inv.reserved += quantity;

    await inv.save();

    return inv;
  },

  Sold: async function (productId, quantity) {
    let inv = await inventoryModel.findOne({ product: productId });

    if (!inv || inv.reserved < quantity) return false;

    inv.reserved -= quantity;
    inv.soldCount += quantity;

    await inv.save();

    return inv;
  },
};
