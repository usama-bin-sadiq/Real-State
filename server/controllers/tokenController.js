const crypto = require("crypto");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
const AMOUNT_REGEX = /^\d+(\.\d+)?$/;

exports.createTokenTransfer = asyncErrorHandler(async (req, res, next) => {
  const from = String(req.body.from || "").trim();
  const to = String(req.body.to || "").trim();
  const amount = String(req.body.amount || "").trim();
  const tokenAddress = String(req.body.tokenAddress || "").trim();

  if (!ADDRESS_REGEX.test(from)) {
    return next(new ErrorHandler("Sender wallet address is invalid", 400));
  }

  if (!ADDRESS_REGEX.test(to)) {
    return next(new ErrorHandler("Recipient wallet address is invalid", 400));
  }

  if (from.toLowerCase() === to.toLowerCase()) {
    return next(new ErrorHandler("Cannot transfer to your own wallet", 400));
  }

  if (!AMOUNT_REGEX.test(amount) || Number(amount) <= 0) {
    return next(new ErrorHandler("Token amount must be greater than 0", 400));
  }

  if (tokenAddress && !ADDRESS_REGEX.test(tokenAddress)) {
    return next(new ErrorHandler("Token contract address is invalid", 400));
  }

  res.status(201).json({
    success: true,
    transfer: {
      id: crypto.randomUUID(),
      from,
      to,
      amount,
      tokenAddress: tokenAddress || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  });
});
