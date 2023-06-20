import { Router } from 'express';
import passport from 'passport';
import {
  getAllSubscriptionPlan,
  getOneSubscriptionPlan,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../controllers/subscriptionPlanController";

const router = Router();


router.get("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllSubscriptionPlan(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }) ,async (req, res) => {
  try {
    const courseCat = await getOneSubscriptionPlan(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.post("/",passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addSubscriptionPlan(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateSubscriptionPlan(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.delete("/:id",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteSubscriptionPlan(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

export default router;
