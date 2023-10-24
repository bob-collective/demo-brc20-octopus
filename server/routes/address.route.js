const {
  getBrc20Balance,
  getInscriptionUTXOData,
} = require("../controllers/address.controller");

const router = require("express").Router();

router.get("/:address/brc-20/balance", getBrc20Balance);

router.get("/:address/inscription-utxo-data", getInscriptionUTXOData);

module.exports = router;
