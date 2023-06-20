import { Router } from 'express';
import passport from 'passport';
import {
  getAllStandardProces,
  getStandardProcesHistory,
  getStandardProcesTailerHistory,
  getOneStandardProces,
  addStandardProces,
  updateStandardProces,
  deleteStandardProces,
} from "../controllers/standardProcesController";

const router = Router();


router.get("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllStandardProces(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/history",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getStandardProcesHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/tailerhistory",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getStandardProcesTailerHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }) ,async (req, res) => {
  try {
    const courseCat = await getOneStandardProces(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.post("/",passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addStandardProces(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateStandardProces(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

router.delete("/:id",passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteStandardProces(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString()});
  }
});

export default router;
