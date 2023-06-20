// import crypto from "crypto";
import Razorpay from "razorpay";
// import Payment from "../models/razorpay.js";

export const checkout = async (value) => {
  const { amount } = value;
  let res;
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });

  var options = {
    amount: Number(amount) * 100,
    currency: "INR",
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
    return res.send({ code: 200, message: "order create", data: order });
  });

};

export const paymentVerification = async (value) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = value;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    // Database comes here
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
