import { Router } from 'express';
import passport from 'passport';
import { } from "../controllers/standardProcesController";
import { checkout, paymentVerification } from '../controllers/razorpayController';
import Razorpay from 'razorpay';

const router = Router();


router.post("/checkout",   async (req, res) => {

  // console.log("process.env.RAZORPAY_API_KEY",process.env.RAZORPAY_API_KEY);
  const { amount } = req.body

  console.log("amount",req.body);
  // try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_APT_SECRET,
    });

    var options = {
      amount: amount * 100,
      currency: "INR",
    };
    instance.orders.create(options, (err, order)=> {
      console.log("err",err);
      if (err) {
        return res.status(500).json({ message: "Internal Server Error!" });
      }
      console.log("order",order);
      return res.status(200).send(order);
    });








    // const courseCat = await checkout(req.body);
    // res.send(courseCat);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ error: error.toString()});
  // }
});

router.post("/paymentverification",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await paymentVerification(req.body);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});



export default router;
