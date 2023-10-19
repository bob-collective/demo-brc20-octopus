const { getList } = require("../controllers/brc-20.controller");

const router = require("express").Router();

router.get("/list", getList);

module.exports = router;
