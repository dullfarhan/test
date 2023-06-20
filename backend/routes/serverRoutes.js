import express from "express";
const router = express.Router();

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import organizationRoutes from "./organizationsRouter";
import groupRoutes from "./groupRoutes";
import standardProcessHistoryRoutes from "./standardProcessHistoryRoutes";
import standardProcessTailerHistoryRoutes from "./standardProcessTailerHistoryRoutes";
import projectRoutes from "./projectRoutes";
import standardProceRoutes from "./standardProceRoutes"
import standardProcessReleaseRoutes from "./standardProcessReleaseRoutes"
import subscriptionOrderRoutes from "./subscriptionOrderRoutes"
import subscriptionPlanRoutes from "./subscriptionPlanRoutes"
import supportHoursRoutes from "./supportHoursRoutes"
import tailerTemplateRoutes from "./tailerTemplateRoutes"
import processPageHistoryRoutes from "./processPageHistoryRoutes"
import processPageTailerHistoryRoutes from "./processPageTailerHistoryRoutes"
import processPageRoutes from "./processPageRoutes"
import standardTemplateRoutes from "./standardTemplateRoutes"
import standardTemplateHistoryRoutes from "./standardTemplateHistoryRoutes"
import processReleaseRoutes from "./processReleaseRoutes"
// import processPageReleaseRoutes from "./processPageReleaseRoutes"
import tailerTemplateHistoryRoutes from "./tailerTemplateHistoryRoutes"
import razorpayRoutes from "./razorpayRouter"

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/organization",organizationRoutes);
router.use("/api/project",projectRoutes);
router.use("/api/group",groupRoutes);
router.use("/api/standardProcess",standardProceRoutes);
router.use("/api/standardProcessHistory",standardProcessHistoryRoutes);
router.use("/api/standardProcessTailerHistory",standardProcessTailerHistoryRoutes);
router.use("/api/processPage",processPageRoutes);
router.use("/api/processPageHistory",processPageHistoryRoutes);
router.use("/api/processPageTailerHistory",processPageTailerHistoryRoutes);
router.use("/api/standardProcessRelease",standardProcessReleaseRoutes);
router.use("/api/processRelease",processReleaseRoutes);
// router.use("/api/processPageRelease",processPageReleaseRoutes);
router.use("/api/standardTemplate",standardTemplateRoutes);
router.use("/api/standardTemplateHistory",standardTemplateHistoryRoutes);
router.use("/api/tailerTemplate",tailerTemplateRoutes);
router.use("/api/tailerTemplateHistory",tailerTemplateHistoryRoutes);
router.use("/api/subscriptionPlan",subscriptionPlanRoutes);
router.use("/api/subscriptionOrder",subscriptionOrderRoutes);
router.use("/api/supportHours",supportHoursRoutes);
router.use("/api/razorpay",razorpayRoutes)

export default router;

