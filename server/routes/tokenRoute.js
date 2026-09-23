const express = require("express");
const { createTokenTransfer } = require("../controllers/tokenController");

const router = express.Router();

router.route("/transfer").post(createTokenTransfer);

module.exports = router;
