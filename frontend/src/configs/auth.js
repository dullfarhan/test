const baseUrl = 'http://localhost:3000'


export default {
  meEndpoint: '/auth/me',
  loginEndpoint: `${baseUrl}/api/auth/login`,
  registerEndpoint: `${baseUrl}/api/auth/signup`,
  sendMailEndpoint: `${baseUrl}/api/auth/sendMails`,
  sendMailEndpoint2: `${baseUrl}/api/auth/successfully/sendMails`,
  resetpasswordEndpoint: `${baseUrl}/api/auth/passwordReset`,
  storageTokenKeyName: 'token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
