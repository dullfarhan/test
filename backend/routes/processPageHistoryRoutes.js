import { Router } from 'express';
import passport from 'passport';
import {
  getAllProcessPageHistory,
  getOneProcessPageHistory,
  addProcessPageHistory,
  updateProcessPageHistory,
  updateProcessPageHistoryByWhere,
  deleteProcessPageHistory,
} from "../controllers/processPageHistoryController";

const router = Router();

router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getAllProcessPageHistory(req.query);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const courseCat = await getOneProcessPageHistory(req.params.id);
    res.send(courseCat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const result = await addProcessPageHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateProcessPageHistory(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/byWhere", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await updateProcessPageHistoryByWhere(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await deleteProcessPageHistory(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
