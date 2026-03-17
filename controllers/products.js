const inventoryModel = require("../schemas/inventory");

let newProduct = await productModel.create(data);

// tạo inventory tương ứng
await inventoryModel.create({
  product: newProduct._id,
  stock: 0,
  reserved: 0,
  soldCount: 0,
});

return newProduct;
