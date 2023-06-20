import axios from 'axios'
import api from './apiConfig'
import { method } from 'lodash'


export default class Request {

  //user
  getUser(payload) {
    return axios({
      method: 'GET',
      url: `${api.user}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  inviteUser(payload) {
    return axios({
      method: 'POST',
      url: `${api.user}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  registerUser(payload) {
    return axios({
      method: 'PUT',
      url: `${api.user}/register`,
      data: payload,
    })
  }
  updateUser(payload) {
    return axios({
      method: 'PUT',
      url: `${api.user}`,
      data: payload,
    })
  }
  getUserItem(id) {
    return axios({
      method: 'GET',
      url: `${api.user}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

    })
  }
  deleteUser(id) {
    return axios({
      method: 'DELETE',
      url: `${api.user}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updatePw(payload) {
    return axios({
      method: 'PUT',
      url: `${api.user}/password`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  searchUser(name) {
    return axios({
      method: 'GET',
      url: `${api.user}/search/?name=${name ? name : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  orgGroup(id) {
    return axios({
      method: 'GET',
      url: `${api.user}/?organizationId=${id ? id : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  //organization

  getOrganization() {
    return axios({
      method: 'GET',
      url: `${api.organization}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createOrganization(payload) {
    return axios({
      method: 'POST',
      url: `${api.organization}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteOrganization(id) {
    return axios({
      method: 'DELETE',
      url: `${api.organization}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  getOrganizationItem(id) {
    return axios({
      method: 'GET',
      url: `${api.organization}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateOrganigationItem(payload) {
    return axios({
      method: 'PUT',
      url: `${api.organization}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  //carniqUser

  createCarniqUser(payload) {
    return axios({
      method: 'POST',
      url: `${api.user}/carniqUser`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  //token
  tokenValid(payload) {
    return axios({
      method: 'GET',
      url: `${api.resetpasswordEndpoint}/token?token=${payload}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }

  // PROJECT

  deleteProject(id) {
    return axios({
      method: 'DELETE',
      url: `${api.project}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createProject(payload) {
    return axios({
      method: 'POST',
      url: `${api.project}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  getProject() {
    return axios({
      method: 'GET',
      url: `${api.project}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  getProjectItem(id) {
    return axios({
      method: 'GET',
      url: `${api.project}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  updateProject(payload) {
    return axios({
      method: 'PUT',
      url: `${api.project}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  updateProfile(payload) {
    let formData = new FormData()
    formData.append('profileImg', payload.profileImg)
    formData.append('email', payload.email)

    return axios({
      method: 'POST',
      url: `${api.user}/upload-image`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'content-type': 'multipart/form-data' },
      data: payload
    })
  }

  searchProject(name) {
    return axios({
      method: 'GET',
      url: `${api.project}/search/?name=${name ? name : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  updateProfile(payload) {
    let formData = new FormData()
    formData.append('profileImg', payload.profileImg)
    formData.append('email', payload.email)
    
    return axios({
      method: 'POST',
      url: `${api.user}/upload-image`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'content-type': 'multipart/form-data' },
      data: formData
    })
  }

  // group
  getGroup(payload) {
    return axios({
      method: 'GET',
      url: `${api.group}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  createGroups(payload) {
    return axios({
      method: 'POST',
      url: `${api.group}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  getOneGroup(item) {
    return axios({
      method: 'GET',
      url: `${api.group}/${item}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateGroups(payload) {
    return axios({
      method: 'PUT',
      url: `${api.group}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteGroup(id) {
    return axios({
      method: 'DELETE',
      url: `${api.group}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  searchGroup(name) {
    return axios({
      method: 'GET',
      url: `${api.group}/search/?name=${name ? name : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  //standard process Version
  getStandardProcess(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcess}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getStandardProcessVersion(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcess}/history`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getStandardProcessTailerVersion(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcess}/tailerhistory`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getProcessOneItem(id) {
    return axios({
      method: 'GET',
      url: `${api.standardProcess}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  createStandardProcess(payload) {
    return axios({
      method: 'POST',
      url: `${api.standardProcess}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateprocessVersion(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardProcess}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteProcessVersion(id) {
    return axios({
      method: 'DELETE',
      url: `${api.standardProcess}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  /// processPage API
  getProcessPage(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPage}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getProcessPageByVersion(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPage}/history`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getProcessPageByTailerVersion(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPage}/tailerhistory`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getOneProcessPage(item) {
    return axios({
      method: 'GET',
      url: `${api.processPage}/${item}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateProcessPage(payload) {
    return axios({
      method: 'PUT',
      url: `${api.processPage}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload,
    })
  }

  //processPageTailerHistory API
  getProcessPageTailerHistory(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPageTailerHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getProcessPageTailerHistoryByProject(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPageTailerHistory}/byProject`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  createProcessPageTailerHistory(payload) {
    return axios({
      method: 'POST',
      url: `${api.processPageTailerHistory}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteProcessPageTailerHistory(id) {
    return axios({
      method: 'DELETE',
      url: `${api.processPageTailerHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  getOneProcessPageTailerHistory(id) {
    return axios({
      method: 'GET',
      url: `${api.processPageTailerHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  updateProcessPageTailerHistoryByWhere(payload) {
    return axios({
      method: 'PUT',
      url: `${api.processPageTailerHistory}/byWhere`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }

  updateProcessPageTailerHistory(payload) {
    return axios({
      method: 'PUT',
      url: `${api.processPageTailerHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload,
    })
  }

  //Standard Templates

  getStandardTemplates(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardTemplate}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  searchStandardTemplates(label) {
    return axios({
      method: 'GET',
      url: `${api.standardTemplate}/search/?label=${label ? label : ''}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  getOneStandardTemplate(item) {
    return axios({
      method: 'GET',
      url: `${api.standardTemplate}/${item}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateStandardTemplate(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardTemplate}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createStandardTemplate(payload) {
    return axios({
      method: 'POST',
      url: `${api.standardTemplate}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteStandardTemplate(id) {
    return axios({
      method: 'DELETE',
      url: `${api.standardTemplate}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // tailerTemplate
  getAllTailerTemplate() {
    return axios({
      method: 'GET',
      url: `${api.tailerTemplate}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },

    })
  }
  getAllTailerTemplateProjectBy(payload) {
    return axios({
      method: 'GET',
      url: `${api.tailerTemplate}/tailer`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  searchTailerTemplate(label) {
    return axios({
      method: 'GET',
      url: `${api.tailerTemplate}/search/?label=${label}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  getOneTailerTemplate(item) {
    return axios({
      method: 'GET',
      url: `${api.tailerTemplate}/${item}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  updateTailerTemplate(payload) {
    return axios({
      method: 'PUT',
      url: `${api.tailerTemplate}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createTailerTemplate(payload) {
    return axios({
      method: 'POST',
      url: `${api.tailerTemplate}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteTailerTemplate(id) {
    return axios({
      method: 'DELETE',
      url: `${api.tailerTemplate}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // tailerTemplateHistory
  getAllTailoredTemplateHistory() {
    return axios({
      method: 'GET',
      url: `${api.tailerTemplateHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  tailerTemplateHistory(payload) {
    return axios({
      method: 'POST',
      url: `${api.tailerTemplateHistory}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // Standard Process Release API
  getStandardProcessRelease(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessRelease}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }

  getOneStandardProcessRelease(id) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessRelease}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }
  updateStandardProcessRelease(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardProcessRelease}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createStandardProcessRelease(payload) {
    return axios({
      method: 'POST',
      url: `${api.standardProcessRelease}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteStandardProcessRelease(id) {
    return axios({
      method: 'DELETE',
      url: `${api.standardProcessRelease}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // processRelease
  getProcessRelease(payload) {
    return axios({
      method: 'GET',
      url: `${api.processRelease}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }

  getOneProcessRelease(id) {
    return axios({
      method: 'GET',
      url: `${api.processRelease}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }
  updateProcessRelease(payload) {
    return axios({
      method: 'PUT',
      url: `${api.processRelease}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  createProcessRelease(payload) {
    return axios({
      method: 'POST',
      url: `${api.processRelease}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }
  deleteProcessRelease(id) {
    return axios({
      method: 'DELETE',
      url: `${api.processRelease}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // ******  processPageRelease *******
  // getProcessPageRelease(payload) {
  //   return axios({
  //     method: 'GET',
  //     url: `${api.processPageRelease}`,
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //     params: payload
  //   })
  // }

  // getOneProcessPageRelease(id) {
  //   return axios({
  //     method: 'GET',
  //     url: `${api.processPageRelease}/${id}`,
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //   })
  // }
  // updateProcessPageRelease(payload) {
  //   return axios({
  //     method: 'PUT',
  //     url: `${api.processPageRelease}`,
  //     data: payload,
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //   })
  // }
  // createProcessPageRelease(payload) {
  //   return axios({
  //     method: 'POST',
  //     url: `${api.processPageRelease}`,
  //     data: payload,
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //   })
  // }
  // deleteProcessPageRelease(id) {
  //   return axios({
  //     method: 'DELETE',
  //     url: `${api.processPageRelease}/${id}`,
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //   })
  // }

  // Standar Process History API
  getStandardProcessHistory(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }

  getOneStandardProcessHistory(id) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }

  updateStandardProcessHistory(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardProcessHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }

  deleteStandardProcessHistory(id) {
    return axios({
      method: 'DELETE',
      url: `${api.standardProcessHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  createStandardProcessHistory(payload) {
    return axios({
      method: 'POST',
      url: `${api.standardProcessHistory}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // standardProcessTailerHistory API
  getStandardProcessTailerHistory(payload) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessTailerHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  updateStandardProcessTailerHistoryByWhere(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardProcessTailerHistory}/byWhere`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }

  getOneStandardProcessTailerHistory(id) {
    return axios({
      method: 'GET',
      url: `${api.standardProcessTailerHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }

  updateStandardProcessTailerHistory(payload) {
    return axios({
      method: 'PUT',
      url: `${api.standardProcessTailerHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }

  deleteStandardProcessTailerHistory(id) {
    return axios({
      method: 'DELETE',
      url: `${api.standardProcessTailerHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  createStandardProcessTailerHistory(payload) {
    return axios({
      method: 'POST',
      url: `${api.standardProcessTailerHistory}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // processPageHistory
  getProcessPageHistory(payload) {
    return axios({
      method: 'GET',
      url: `${api.processPageHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  getOneProcessPageHistory(id) {
    return axios({
      method: 'GET',
      url: `${api.processPageHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  }
  updateProcessPageHistory(payload) {
    return axios({
      method: 'PUT',
      url: `${api.processPageHistory}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }

  deleteProcessPageHistory(id) {
    return axios({
      method: 'DELETE',
      url: `${api.processPageHistory}/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  createProcessPageHistory(payload) {
    return axios({
      method: 'POST',
      url: `${api.processPageHistory}`,
      data: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

  // subscription plan

  getSubscriptionPlan(payload) {
    return axios({
      method: 'GET',
      url: `${api.subScriptionPlan}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }

  // subscription order 

  getSubscriptionOrder(payload) {
    return axios({
      method: 'GET',
      url: `${api.subScriptionOrder}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  createSubscriptionOrder(payload) {
    return axios({
      method: 'POST',
      url: `${api.subScriptionOrder}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  }
  updateSubscriptionOrder(payload) {
    return axios({
      method: 'PUT',
      url: `${api.subScriptionOrder}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: payload
    })
  } getSubscriptionOrder(payload) {
    return axios({
      method: 'GET',
      url: `${api.subScriptionOrder}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: payload
    })
  }
  
  //Expire Token API
  expiredToken() {
    return axios({
      method: 'GET',
      url: `${api.token}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
  }

 //razorpay 
razorpayCheckout(payload){
  return axios({
    method: 'POST',
    url: `${api.razorpay}/checkout`,
    data: payload,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
}

razorpayPaymentverification(payload){
  return axios({
    method: 'POST',
    url: `${api.razorpay}`,
    data: payload,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
}

}
