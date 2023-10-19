const { getBrc20Balance } = require("../controllers/address.controller");

const router = require("express").Router();

router.get("/:address/brc-20/balance", getBrc20Balance);

module.exports = router;
