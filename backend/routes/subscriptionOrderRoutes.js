import { Router } from 'express';
import passport from 'passport';
import {
  getAllSubscriptionOrders,
  getOneSubscriptionOrders,
  addSubscriptionOrders,
  updateSubscriptionOrders,
  deleteSubscriptionOrders,
} from "../controllers/subscriptionOrderController";

const router = Router();


router.get("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllSubscriptionOrders(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }) ,async (req, res) => {
  try {
    const courseCat = await getOneSubscriptionOrders(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.post("/",passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addSubscriptionOrders(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateSubscriptionOrders(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.delete("/:id",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteSubscriptionOrders(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

export default router;
