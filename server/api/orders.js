const router = require("express").Router();
const { Order } = require("../db/index");

router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
