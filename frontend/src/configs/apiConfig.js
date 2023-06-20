const rootlink = 'http://localhost:3000'

export default {
  resetpasswordEndpoint: `${rootlink}/api/auth`,
  user: `${rootlink}/api/users`,
  organization: `${rootlink}/api/organization`,
  project: `${rootlink}/api/project`,
  group: `${rootlink}/api/group`,
  standardProcess: `${rootlink}/api/standardProcess`,
  standardProcessHistory: `${rootlink}/api/standardProcessHistory`,
  standardProcessTailerHistory: `${rootlink}/api/standardProcessTailerHistory`,
  processPage: `${rootlink}/api/processPage`,
  processPageHistory: `${rootlink}/api/processPageHistory`,
  processPageTailerHistory: `${rootlink}/api/processPageTailerHistory`,
  standardTemplate: `${rootlink}/api/standardTemplate`,
  tailerTemplate: `${rootlink}/api/tailerTemplate`,
  tailerTemplateHistory: `${rootlink}/api/tailerTemplateHistory`,
  standardProcessRelease: `${rootlink}/api/standardProcessRelease`,
  processRelease: `${rootlink}/api/processRelease`,
  subScriptionPlan: `${rootlink}/api/subscriptionPlan`,
  subScriptionOrder: `${rootlink}/api/subscriptionOrder`,
  
  // processPageRelease: `${rootlink}/api/processPageRelease`,
  token: `${rootlink}/api/auth/token`,
  razorpay: `${rootlink}/api/razorpay`
}