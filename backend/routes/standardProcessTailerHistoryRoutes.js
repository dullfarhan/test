import { Router } from 'express';
import passport from 'passport';
import {
  getStandardProcessTailerHistory,
  getOneStandardProcessTailerHistory,
  addStandardProcessTailerHistory,
  updateStandardProcessTailerHistory,
  updateStandardProcessTailerHistoryByWhere,
  deletStandardProcessTailerHistory,
} from "../controllers/standardProcessTailerHistoryController";

const router = Router();


router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getStandardProcessTailerHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getOneStandardProcessTailerHistory(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addStandardProcessTailerHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardProcessTailerHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/byWhere", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardProcessTailerHistoryByWhere(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deletStandardProcessTailerHistory(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
