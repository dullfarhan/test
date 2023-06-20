import { Router } from 'express';
import passport from 'passport';
import {
  getStandardProcessHistory,
  getOneStandardProcessHistory,
  addStandardProcessHistory,
  updateStandardProcessHistory,
  updateStandardProcessHistoryByWhere,
  deletStandardProcessHistory,
} from "../controllers/standardProcessHistoryController";

const router = Router();


router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getStandardProcessHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getOneStandardProcessHistory(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addStandardProcessHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardProcessHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/byWhere", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardProcessHistoryByWhere(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deletStandardProcessHistory(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
