import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  styled,
  tableCellClasses
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from '../header'
import { SlPaypal } from 'react-icons/sl'
import { BsDashCircleFill } from 'react-icons/bs'
import { MdCheckBox } from 'react-icons/md'
import { TfiDownload } from 'react-icons/tfi'
import bank from '../../assest/carspice/bank.png'
import bank1 from '../../assest/carspice/bank1.png'
import paypal from '../../assest/carspice/paypal.png'
import paypal1 from '../../assest/carspice/paypal1.png'
import card from '../../assest/carspice/card.png'
import card1 from '../../assest/carspice/card1.png'
import Image from 'next/image'
import AdminHeader from '../adminheader'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import jwt_decode from 'jwt-decode'
import Paypal from '../paypal'
import { useRouter } from 'next/router'
import { SiRazorpay } from 'react-icons/si'
import * as autoTable from 'jspdf-autotable'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useAuth } from 'src/hooks/useAuth'
import PaymentContainer from './stripe/paymentContainer'
import axios from 'axios'
import Payment from './stripe/payment'

var jwt = require('jsonwebtoken')

const subjects = [
  { subjectName: 'Subscription plan' },
  { subjectName: 'Billing Address' },
  { subjectName: 'Invoices' },
  { subjectName: 'Payment Method' }
]

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#D3D3D3',
    color: 'black',
    fontWeight: 700,
    borderRadius: '0px',
    fontSize: '13px',
    borderTop: '1px solid black',
    padding: '0.5rem ',
    borderBottom: '1px solid black'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    color: 'black',
    fontWeight: 400
  }
}))

const data = [
  {
    id: 'item1',
    invoice_number: 'ABC1234',
    price: '450$',
    date: '01.04.2023'
  },
  {
    id: 'item2',
    invoice_number: 'DEF5678',
    price: '125$',
    date: '01.05.2023'
  },
  {
    id: 'item3',
    invoice_number: 'XYZ1234',
    price: '500$',
    date: '01.06.2023'
  }
]

const Subscription = () => {
  const [value, setValue] = useState(0)
  const [opens, setOpens] = useState(false)
  const [companyAddress1, setCompanyAddress1] = useState({})
  const [billingAddress1, setBillingAddress1] = useState({})
  const [cardDetails, setCardDeatils] = useState({})
  const [payValue, setPayValue] = useState(0)
  const [subScriptionData, setSubscriptionData] = useState([])
  const [subScriptionOrder, setSubscriptionOrder] = useState([])
  const [org, setOrg] = useState([])
  const [orgId, setOrgId] = useState('')
  const [check, setCheck] = useState('')
  const [features, setFearures] = useState('')
  const [price1, setPrice1] = useState('')
  const [price2, setPrice2] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [datas, setDatas] = useState(data)
  const [priceIndex, setPriceIndex] = useState()
  const [open, setOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [checkValue, setCheckValue] = useState('')
  const [selectedID, setID] = React.useState('')

  const [billinAddress, setBillingAddress] = useState([
    {
      name: '',
      address: '',
      city: '',
      Country: '',
      ZIP_PIN_Code: '',
      vat_texId: ''
    }
  ])

  const [companyAddress, setCompanyAddress] = useState([
    {
      name: '',
      address: '',
      city: '',
      Country: '',
      ZIP_PIN_Code: '',
      vat_texId: ''
    }
  ])

  const router = useRouter()

  const token = window.localStorage.getItem('token')
  const decodedToken = jwt.decode(token)
  const currentDate = new Date()
  const auth = useAuth()

  // JWT exp is in seconds
  if (decodedToken?.exp * 1000 < currentDate.getTime()) {
    toast.error('Token expired.')
    localStorage.clear()
    auth.logout()
    router.replace('/login')
  }

  const requestApiData = new Request()

  const HandelChange = e => {
    e.persist()
    setBillingAddress(billinAddress => ({ ...billinAddress, [e.target.name]: e.target.value }))
  }

  const HandelChange1 = e => {
    e.persist()
    setCompanyAddress(companyAddress => ({ ...companyAddress, [e.target.name]: e.target.value }))
  }

  const getSubscriptionPlan = () => {
    requestApiData
      .getSubscriptionPlan()
      .then(res => setSubscriptionData(res.data))
      .catch(err => console.log(err))
  }

  const organizationData = () => {
    requestApiData
      .getOrganization()
      .then(res => setOrg(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData.getUser().then(res => {
      if (res?.status === 200) {
        res.data &&
          res.data
            ?.filter(item => item._id === createdBy.id)
            .map(filteredItem => {
              setOrgId(filteredItem)
            })
      }
    })
  }, [])

  const getOrg = org.filter(item => item._id === orgId.organizationId)

  const getSubscriptionOrder = () => {
    const payload = {
      organizationId: getOrg[0]?._id
    }
    requestApiData
      .getSubscriptionOrder(payload)
      .then(res => {
        setSubscriptionOrder(res.data[0])
        setCompanyAddress1(res?.data[0]?.companyAddress ? res?.data[0]?.companyAddress : {})
        setBillingAddress1(res?.data[0]?.billingAddress ? res?.data[0]?.billingAddress : {})
        setCardDeatils(res?.data[0]?.cardDetails ? res?.data[0]?.cardDetails : {})
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getSubscriptionPlan()
    organizationData()
    if ((companyAddress1 === '' && billingAddress1 === '') || getOrg[0]?._id) {
      getSubscriptionOrder()
    }
  }, [getOrg[0]?._id])

  const updateOrgStatus = () => {
    const payload = {
      _id: getOrg[0]?._id,
      subStatus: 'Deactive'
    }
    requestApiData
      .updateOrganigationItem(payload)
      .then(res => {
        toast.success('Subscription Cancel successfully')
        organizationData()
        setOpen(false)
        router.push('/basic')
      })
      .catch(err => console.log(err))
  }

  const updateOrgSubType = () => {
    const changeSubType = check?.split('/')

    const data = {
      subType: changeSubType[1] ? changeSubType[1] : getOrg[0].subType.subType,
      price: (changeSubType[0] && checkValue === 0 ? price1 : price2) || (getOrg[0].subTypeId ? price1 : price2),
      companySize: companySize
    }

    const payload = {
      _id: getOrg[0]._id,
      subType: data,
      subTypeId: changeSubType[0] ? changeSubType[0] : getOrg[0].subTypeId
    }

    requestApiData
      .updateOrganigationItem(payload)
      .then(res => {
        companySize && (price1 || price2)
          ? toast.success('Subscription Update successfully')
          : toast.error('Please enter Your Subscription Plan')

        getOrg[0]?.subType?.price === '' && getOrg[0]?.subType?.companySize === '' ? '' : setOpen1(false)
        getOrg[0]?.subType?.price === '' && getOrg[0]?.subType?.companySize === '' ? '' : setValue(1)
        organizationData()
      })
      .catch(err => console.log(err))
  }

  const handleClick = () => {
    delete billinAddress['0']
    setBillingAddress(billinAddress)

    const payload = {
      oId: getOrg[0]?._id,
      billingAddress: billinAddress
    }

    requestApiData
      .updateSubscriptionOrder(payload)
      .then(res => {
        getSubscriptionOrder()
        Object.keys(billinAddress).length === 6 ? setValue(2) : setValue(1)

        // setBillingAddress([{}])
      })
      .catch(err => console.log(err))
  }

  const handleClick1 = () => {
    delete companyAddress['0']
    setCompanyAddress(companyAddress)

    const payload = {
      oId: getOrg[0]?._id,
      companyAddress: companyAddress
    }
    requestApiData
      .updateSubscriptionOrder(payload)
      .then(res => {
        getSubscriptionOrder()
        Object.keys(companyAddress).length === 6 ? router.push('/admin/main') : setValue(3)
      })
      .catch(err => console.log(err))
  }


  const pdfGenreter = async () => {
    let doc = new jsPDF('p', 'mm', [297, 210])

    doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
    doc.addFont('Inter-Bold.ttf', 'Inter', 'bold')

    doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(15)
    doc.text('CARNIQ Technologies GmbH', 20, 23)

    doc.setFont('Inter', 'bold')
    doc.setTextColor(130, 130, 130)
    doc.setFontSize(11)
    doc.text('Orionstraße 4', 20, 28)
    doc.text('85716 Unterschleißheim', 20, 32)

    doc.setFont('Inter')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(20)
    doc.text('CARSPICE', 150, 23)

    // invoice

    doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(17)
    doc.text('INVOICE', 90, 60)

    doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(15)
    doc.text('To : ', 20, 90)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(13)
    doc.text('Invoice No:', 120, 90)
    doc.text('Invoice Date:', 120, 98)

    //tebal

    doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(12)
    doc.text('DESCRIPTION', 20, 152)

    // doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(12)
    doc.text('Quantity', 100, 152)

    // doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(12)
    doc.text('RATE', 135, 152)

    // doc.setFont('Inter', 'bold')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(12)
    doc.text('AMOUNT', 165, 152)

    //tebal data
    doc.setFont('Helvertica', 'bold')
    doc.setDrawColor(27, 30, 35)
    doc.setLineWidth(1)
    doc.line(20, 176, 20, 155)

    doc.setLineWidth(0.5)
    doc.setDrawColor(3, 152, 158)

    doc.setTextColor(27, 30, 35)
    doc.setFontSize(11)
    doc.line(20, 155, 20 + 165, 155)
    doc.text('1125.00 €', 135, 155 + 5)
    doc.text('1125.00 €', 165, 155 + 5)

    doc.line(20, 162, 20 + 165, 162)
    doc.text('TOTAL NET', 125, 162 + 5)
    doc.text('1125.00 €', 165, 162 + 5)

    doc.line(20, 169, 20 + 165, 169)
    doc.text('VAT 19% (only for Germany else 0%)', 85, 169 + 5)
    doc.text('1125.00 €', 165, 169 + 5)

    doc.setTextColor(3, 152, 158)
    doc.line(20, 176, 20 + 165, 176)
    doc.text('Total Gross', 130, 176 + 5)
    doc.text('1125.00 €', 165, 176 + 5)

    doc.line(95, 162, 95, 155)

    doc.line(125, 162, 125, 155)
    doc.line(155, 181, 155, 155)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(11)
    doc.text('Terms of payment: Payment is due immediately after the invoice.', 20, 210)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(3, 152, 158)
    doc.setFontSize(11)
    doc.text('Thank you for your business!', 20, 220)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(10)
    doc.text('CARNIQ Technologies GmbH', 20, 270)
    doc.text('Orionstraße 4, 85716 ', 20, 275.5)
    doc.text('Unterschleißheim', 20, 280.5)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(10)
    doc.text('Tel.: +49 123456789', 70, 270)
    doc.text('Email: info@carniq.ai ', 70, 275.5)
    doc.text('Web: www.carniq.ai', 70, 280.5)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(10)
    doc.text('Munich', 115, 270)
    doc.text('HR-Nr.: HRB xxxxxx ', 115, 275.5)
    doc.text('VAT.-ID: xxxxxxxxxxx', 115, 280.5)
    doc.text('Owner: Praveen Suvarna', 115, 285.5)

    doc.setFont('Inter', 'normal')
    doc.setTextColor(27, 30, 35)
    doc.setFontSize(10)
    doc.text('Stadtsprkasse Bank', 165, 270)
    doc.text('IBAN:', 165, 275.5)
    doc.text('BIC :', 165, 280.5)

    // doc.addImage(imageUrl, 'PNG', 500, 15, 80, 80);

    // doc.text(400, 80, 'Name :')
    // doc.text(400, 100, 'Address :')
    // doc.text(400, 120, 'City : ')
    // doc.text(400, 140, 'Country :')
    // doc.text(400, 160, 'ZIP / PIN Code :')
    // doc.text(400, 180, 'VAT / TAX ID :')
    // doc.setFont('Helvertica', 'Light')
    // doc.text(500, 80, `${subScriptionOrder.billingAddress.name}`)
    // doc.text(500, 100, `${subScriptionOrder.billingAddress.address}`)
    // doc.text(500, 120, `${subScriptionOrder.billingAddress.city}`)
    // doc.text(500, 140, `${subScriptionOrder.billingAddress.Country}`)
    // doc.text(500, 160, `${subScriptionOrder.billingAddress.ZIP_PIN_Code}`)
    // doc.text(500, 180, `${subScriptionOrder.billingAddress.vat_texId}`)
    // doc.setFont('Helvertica', 'bold')
    // doc.text(60, 200, 'Comapany Address')
    // doc.setFont('Helvertica', 'Regular')
    // doc.text(60, 220, 'Name :')
    // doc.text(60, 240, 'Address :')
    // doc.text(60, 260, 'City : ')
    // doc.text(60, 280, 'Country :')
    // doc.text(60, 300, 'ZIP / PIN Code :')
    // doc.text(60, 320, 'VAT / TAX ID :')
    // doc.setFont('Helvertica', 'Light')
    // doc.text(160, 220, `${subScriptionOrder.companyAddress.name}`)
    // doc.text(160, 240, `${subScriptionOrder.companyAddress.address}`)
    // doc.text(160, 260, `${subScriptionOrder.companyAddress.city}`)
    // doc.text(160, 280, `${subScriptionOrder.companyAddress.Country}`)
    // doc.text(160, 300, `${subScriptionOrder.companyAddress.ZIP_PIN_Code}`)
    // doc.text(160, 320, `${subScriptionOrder.companyAddress.vat_texId}`)
    // doc.setFont('Helvertica', 'Regular')
    // doc.setLineWidth(3)

    // let body = [
    //   ['Name', 'licence', 'Price'],
    //   [getOrg[0]?.subType, 1, '$120']
    // ]
    // doc.autoTable({
    //   body: body,
    //   startY: 160,
    //   theme: 'grid'
    // })
    doc.save('data.pdf')
  }

  const handleModal = index => {
    setOpens(index.features)
    setFearures(index.features)
  }

  const handleService = data => {
    setServiceOpen(data.modal)
  }

  const handlePrice = (data, index) => {
    if (index === 0) {
      setPrice1(data.price ? data.price : '25,990 / 2166')
    } else {
      setPrice2(data.price ? data.price : '34,990 / 2916')
    }
    setPriceIndex(index)
  }

  // const initializeRazorpay = value => {
  //   return new Promise(resolve => {
  //     const script = document.createElement('script')
  //     script.src = 'https://checkout.razorpay.com/v1/checkout.js'

  //     script.onload = () => {
  //       resolve(true)
  //     }
  //     script.onerror = () => {
  //       resolve(false)
  //     }

  //     document.body.appendChild(script)
  //   })
  // }

  // const makePayment = async value => {
  //   const res = await initializeRazorpay()

  //   if (!res) {
  //     alert('Razorpay SDK Failed to load')
  //   }

  //   // Make API call to the serverless API
  //   const data = await fetch('http://localhost:3000/api/razorpay/checkout', {
  //     method: 'POST',
  //     body: JSON.stringify({ amount: value.amount })
  //   }).then(t => t.json())

  //   var options = {
  //     key: 'rzp_test_5RC0rhfrdB9ldT', // Enter the Key ID generated from the Dashboard
  //     name: 'carSPICE',
  //     currency: data.currency,
  //     amount: data.amount,
  //     order_id: data.id,
  //     description: 'Thankyou for your test donation',
  //     image: 'https://manuarora.in/logo.png',
  //     handler: function (response) {
  //       // Validate payment at server - using webhooks is a better idea.
  //       alert(response.razorpay_payment_id)
  //       alert(response.razorpay_order_id)
  //       alert(response.razorpay_signature)
  //     },
  //     prefill: {
  //       name: 'carSpice',
  //       email: 'carSpice@gmail.com',
  //       contact: '9898989898'
  //     }
  //   }

  //   const paymentObject = new window.Razorpay(options)
  //   paymentObject.open()
  // }

  const initPayment = data => {
    const options = {
      key: 'rzp_test_5RC0rhfrdB9ldT',
      amount: data.amount,
      currency: data.currency,
      name: book.name,
      description: 'Test Transaction',
      image: book.img,
      order_id: data.id,
      handler: async response => {
        try {
          // const verifyUrl = ;
          const { data } = await axios.post(
            'http://localhost:3000/api/razorpay/paymentverification',
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
            response
          )
        } catch (error) {
          console.log(error)
        }
      },
      theme: {
        color: '#3399cc'
      }
    }
    const rzp1 = new window.Razorpay(options)
    rzp1.open()
  }

  const handlePayment = async () => {
    try {
      // const orderUrl = ;
      const { data } = await axios.post(
        'http://localhost:3000/api/razorpay/checkout',
        { amount: 500 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      initPayment(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const price_3 = getOrg[0] ? getOrg[0]?.subType?.price?.split('/') : ''
  const price_1 = price1?.length > 0 ? price1?.split('/') : ''
  const price_2 = price2?.length > 0 ? price2?.split('/') : ''

  return (
    <Box>
      <Box>
        {companyAddress1 === '' && billingAddress1 === '' ? (
          ''
        ) : Object.keys(companyAddress1)?.length === 0 && Object.keys(billingAddress1)?.length === 0 ? (
          ''
        ) : (
          <AdminHeader />
        )}
        <Box sx={{ padding: { lg: '34px 64px', md: '34px 20px', xs: '30px 10px' }, marginTop: '34px' }}>
          <Box sx={{ padding: { md: '34px 64px', md: '34px 0', xs: '30px 10px' } }}>
            <Box className='inline_css'>
              <Tabs
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue)
                }}
                variant='scrollable'
                scrollButtons='auto'
              >
                {subjects.map(subject => (
                  <Tab key={subject.subjectName} className='tabs' label={subject.subjectName} />
                ))}
              </Tabs>
              {value === 0 ? (
                <Box className='button_sub'>
                  <Button className='styledButton' onClick={() => setOpen(true)}>
                    Cancel Subscription
                  </Button>
                  <Button className='styledButton' onClick={() => setOpen1(true)}>
                    Update Subscription
                  </Button>
                </Box>
              ) : (
                ''
              )}
              {value === 1 ? (
                <Box>
                  <Button
                    className='styledButton'
                    onClick={() => {
                      handleClick()
                    }}
                  >
                    Update Address
                  </Button>
                </Box>
              ) : (
                ''
              )}

              {value === 3 ? (
                <Box>
                  <Button className='styledButton' onClick={() => handleClick1()}>
                    Update Payment Method
                  </Button>
                </Box>
              ) : (
                ''
              )}
            </Box>
            <Divider className='divider_line' />
            {value === 0 ? (
              <Grid
                container
                sx={{ padding: { lg: '3rem 13rem', md: '3rem 2rem', xs: '3rem 0' }, display: 'flex', maxHeight: '30%' }}
              >
                <Grid item xs={4}>
                  <Typography className='t_head' sx={{ padding: '1.27rem !important' }}>
                    Services
                  </Typography>
                  {subScriptionData[0]?.description?.map((data, i) => (
                    <Typography className='f_row inline_css' component={'div'} key={i}>
                      {data.name}
                      <Button onClick={() => handleService(data)}>
                        {' '}
                        <RiErrorWarningLine color='#4169E1' className='info' />
                      </Button>
                    </Typography>
                  ))}
                  <Dialog
                    open={Boolean(serviceOpen)}
                    onClose={() => setServiceOpen(false)}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                  >
                    <Box sx={{ backgroundColor: '#FFFAE6' }}>
                      <DialogTitle id='alert-dialog-title' color='black'>
                        {'Services'}
                      </DialogTitle>
                      <Divider className='divider_line' />
                      <DialogContent>
                        <DialogContentText id='alert-dialog-description' color='black'>
                          <div style={{ lineHeight: '2' }} dangerouslySetInnerHTML={{ __html: serviceOpen }} />
                        </DialogContentText>
                      </DialogContent>
                    </Box>
                  </Dialog>
                </Grid>

                {subScriptionData.map((item, index) => (
                  <Grid xs={4} item className={`color_${index}`} key={index}>
                    <Typography
                      className={
                        (selectedID ? item._id === selectedID : getOrg[0]?.subTypeId === item._id)
                          ? `t_head${index}`
                          : `t_head_${index}`
                      }
                      component={'div'}
                    >
                      {item.name}

                      <Radio
                        id={item._id}
                        name={item.name}
                        checked={selectedID ? item._id === selectedID : getOrg[0]?.subTypeId === item._id}
                        onClick={() => {
                          setCheck(item?._id + '/' + item?.name)
                        }}
                        onChange={() => {
                          setID(item._id)
                        }}
                      />

                      <Button onClick={() => handleModal(item)} className='war_button'>
                        <RiErrorWarningLine color='#4169E1' className='war_icon' />
                      </Button>
                    </Typography>
                    <Dialog
                      open={Boolean(opens)}
                      onClose={() => setOpens(false)}
                      aria-labelledby='alert-dialog-title'
                      aria-describedby='alert-dialog-description'
                    >
                      <Box sx={{ backgroundColor: '#FFFAE6' }}>
                        <DialogTitle id='alert-dialog-title' color='black'>
                          {'Features'}
                        </DialogTitle>
                        <Divider className='divider_line' />
                        <DialogContent>
                          <DialogContentText id='alert-dialog-description' color='black'>
                            <div dangerouslySetInnerHTML={{ __html: features }} />
                          </DialogContentText>
                        </DialogContent>
                      </Box>
                    </Dialog>

                    {item.description.map((data, subindex) => (
                      <Typography
                        className={
                          (selectedID ? item._id === selectedID : getOrg[0]?.subTypeId === item._id)
                            ? `color${index}`
                            : `bg_${index}`
                        }
                        key={subindex}
                        component={'div'}
                      >
                        <Box display='flex' alignItems='center'>
                          {data.includ ? (
                            data.includ === 'true' ? (
                              <MdCheckBox className='check_icon' />
                            ) : (
                              <BsDashCircleFill className='dash_icon' />
                            )
                          ) : (
                            ''
                          )}
                          {data.data && <div className='data_text' dangerouslySetInnerHTML={{ __html: data.data }} />}
                        </Box>
                        {data.name === 'Company Size' && getOrg[0]?.subType?.companySize === '' ? (
                          <Select
                            name='organizationName'
                            className='select_input'
                            displayEmpty
                            // renderValue={(selected) => {
                            //   if (selected.length === 0) {
                            //     return <em>Placeholder</em>;
                            //   }
                            // }}
                            inputProps={{ 'aria-label': 'Without label' }}
                            required
                          >
                            <MenuItem value=''>Select</MenuItem>
                            {item.price.map((company, i) => (
                              <MenuItem
                                key={i}
                                value={company.company_size}
                                onClick={() => {
                                  handlePrice(company, index)
                                  setCompanySize(company.company_size)
                                }}
                              >
                                {company.company_size}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : data.name === 'Company Size' && getOrg[0]?.subTypeId === item._id ? (
                          <Select
                            name='organizationName'
                            className='select_input'
                            displayEmpty
                            defaultValue={getOrg[0]?.subType.companySize}
                            // renderValue={(selected) => {
                            //   if (selected.length === 0) {
                            //     return <em>Placeholder</em>;
                            //   }
                            // }}
                            inputProps={{ 'aria-label': 'Without label' }}
                            required
                          >
                            <MenuItem value=''>Select</MenuItem>
                            {item.price.map((company, i) => (
                              <MenuItem
                                key={i}
                                value={company.company_size}
                                onClick={() => {
                                  handlePrice(company, index)
                                  setCompanySize(company.company_size)
                                }}
                              >
                                {company.company_size}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          data.name === 'Company Size' && (
                            <Select
                              name='organizationName'
                              className='select_input'
                              displayEmpty
                              // renderValue={(selected) => {
                              //   if (selected.length === 0) {
                              //     return <em>Placeholder</em>;
                              //   }

                              // }}
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value=''>Select</MenuItem>
                              {item.price.map((company, i) => (
                                <MenuItem
                                  key={i}
                                  value={company.company_size}
                                  onClick={() => {
                                    handlePrice(company, index)
                                    setCompanySize(company.company_size)
                                    setCheckValue(index)
                                  }}
                                >
                                  {company.company_size}
                                </MenuItem>
                              ))}
                            </Select>
                          )
                        )}
                        {data.name === 'price' && (price1 || price2) ? (
                          <Typography component={'div'}>
                            {index === 0 ? (
                              <>
                                <Typography>USD {price_1[0]} / One time</Typography>or
                                <Typography>USD {price_1[1]} / month</Typography>
                              </>
                            ) : (
                              <>
                                <Typography>USD {price_2[0]} / One time</Typography>or
                                <Typography>USD {price_2[1]} / month</Typography>
                              </>
                            )}
                          </Typography>
                        ) : data.name === 'price' && getOrg[0]?.subTypeId === item._id ? (
                          <>
                            <Typography>USD {price_3[0]} / One time</Typography>or
                            <Typography>USD {price_3[1]} / month</Typography>
                          </>
                        ) : (
                          ''
                        )}
                      </Typography>
                    ))}
                  </Grid>
                ))}
              </Grid>
            ) : (
              ''
            )}
            {value === 1 ? (
              <Grid container spacing={10} sx={{ padding: '3rem 4rem' }}>
                <>
                  {Object.keys(billingAddress1)?.length === 0 ? (
                    <>
                      <Grid item xs={5}>
                        <Box>
                          <InputLabel className='input_lable spec'>Name</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='name'
                            value={billinAddress.name}
                            onChange={HandelChange}
                            placeholder='Name'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>Address</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='address'
                            value={billinAddress.address}
                            onChange={HandelChange}
                            placeholder='Address'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>ZIP / PIN Code</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='ZIP_PIN_Code'
                            value={billinAddress.ZIP_PIN_Code}
                            onChange={HandelChange}
                            placeholder='ZIP / PIN Code'
                            required
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box>
                          <InputLabel className='input_lable spec'>VAT / TAX ID</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='vat_texId'
                            value={billinAddress.vat_texId}
                            onChange={HandelChange}
                            placeholder='VAT / TAX ID'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>City</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='city'
                            value={billinAddress.city}
                            onChange={HandelChange}
                            placeholder='City'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>Country</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='Country'
                            value={billinAddress.Country}
                            onChange={HandelChange}
                            placeholder='Country'
                            required
                          />
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={5}>
                        <Box>
                          <InputLabel className='input_lable spec'>Name</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='name'
                            value={subScriptionOrder?.billingAddress?.name}
                            onChange={HandelChange}
                            placeholder='Name'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>Address</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='address'
                            value={subScriptionOrder?.billingAddress?.address}
                            onChange={HandelChange}
                            placeholder='Address'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>ZIP / PIN Code</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='ZIP_PIN_Code'
                            value={subScriptionOrder?.billingAddress?.ZIP_PIN_Code}
                            onChange={HandelChange}
                            placeholder='ZIP / PIN Code'
                            required
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={5}>
                        <Box>
                          <InputLabel className='input_lable spec'>VAT / TAX ID</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='vat_texId'
                            value={subScriptionOrder?.billingAddress.vat_texId}
                            onChange={HandelChange}
                            placeholder='VAT / TAX ID'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>City</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='city'
                            value={subScriptionOrder?.billingAddress?.city}
                            onChange={HandelChange}
                            placeholder='City'
                            required
                          />
                        </Box>
                        <Box>
                          <InputLabel className='input_lable spec'>Country</InputLabel>
                          <Input
                            className='inputFild spec'
                            name='Country'
                            value={subScriptionOrder?.billingAddress?.Country}
                            onChange={HandelChange}
                            placeholder='Country'
                            required
                          />
                        </Box>
                      </Grid>
                    </>
                  )}
                </>
              </Grid>
            ) : (
              ''
            )}
            {value === 2 ? (
              <Grid container>
                <Grid xs={12} sx={{ padding: '3rem 4rem' }} item>
                  <Box sx={{ height: '35vh', overflowY: 'auto' }}>
                    <Table sx={{ width: 1 }} aria-label='customized table'>
                      <TableHead sx={{ borderRadius: '0px !impotant' }}>
                        <TableRow>
                          <StyledTableCell>Invoice Number</StyledTableCell>
                          <StyledTableCell>Price</StyledTableCell>
                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item, i) => (
                          <TableRow key={i}>
                            <StyledTableCell>{item.invoice_number}</StyledTableCell>
                            <StyledTableCell>{item.price}</StyledTableCell>
                            <StyledTableCell>{item.date}</StyledTableCell>
                            <StyledTableCell>
                              <Button onClick={pdfGenreter}>
                                <TfiDownload color='gray' size={20} />
                              </Button>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            {value === 3 ? (
              <Grid spacing={10} container sx={{ padding: '3rem 4rem' }}>
                <Grid item xs={2}>
                  <Tabs
                    orientation='vertical'
                    value={payValue}
                    onChange={(event, newValue) => {
                      setPayValue(newValue)
                    }}
                    variant='scrollable'
                    scrollButtons='auto'
                  >
                    {payValue === 0 ? (
                      <Tab label={<Image src={bank} alt='' />} className='tabs' />
                    ) : (
                      <Tab label={<Image src={bank1} alt='' />} className='tabs' />
                    )}
                    {payValue === 1 ? (
                      <Tab label={<Image src={paypal1} alt='' />} className='tabs' />
                    ) : (
                      <Tab label={<Image src={paypal} alt='' />} className='tabs' />
                    )}
                    {payValue === 2 ? (
                      <Tab label={<Image src={card1} alt='' />} className='tabs' />
                    ) : (
                      <Tab label={<Image src={card} alt='' />} className='tabs' />
                    )}
                    {/* {payValue === 3 ? (
                      <Tab label={<SiRazorpay size={40} color='#7F7F7F' />} className='tabs' />
                    ) : (
                      <Tab label={<SiRazorpay size={40} color='#BAB9BB' />} className='tabs' />
                    )} */}
                  </Tabs>
                </Grid>
                {payValue === 0 ? (
                  <Grid item xs={4}>
                    <PaymentContainer />
                    {/* <Payment /> */}
                  </Grid>
                ) : (
                  ''
                )}
                {payValue === 1 ? (
                  <Grid item xs={4}>
                    {/* <Box>
                                   <InputLabel className='input_lable spec'>Username</InputLabel>
                                   <Input className='inputFild spec' placeholder='Username' />
                               </Box>
                               <Box>
                                   <InputLabel className='input_lable spec'>Password</InputLabel>
                                   <Input className='inputFild spec' placeholder='Password' />
                               </Box> */}
                    <Paypal />
                  </Grid>
                ) : (
                  ''
                )}
                {payValue === 2 ? (
                  <>
                    {Object.keys(companyAddress1)?.length === 0 ? (
                      <>
                        <Grid item xs={4}>
                          <Box>
                            <InputLabel className='input_lable spec'>Name</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='name'
                              onChange={HandelChange1}
                              value={companyAddress.name}
                              placeholder='Name'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>Address</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='address'
                              onChange={HandelChange1}
                              value={companyAddress.address}
                              placeholder='Address'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>ZIP / PIN Code</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='ZIP_PIN_Code'
                              onChange={HandelChange1}
                              value={companyAddress.ZIP_PIN_Code}
                              placeholder='ZIP / PIN Code'
                              required
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box>
                            <InputLabel className='input_lable spec'>VAT / TAX ID</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='vat_texId'
                              onChange={HandelChange1}
                              value={companyAddress.vat_texId}
                              placeholder='VAT / TAX ID'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>City</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='city'
                              onChange={HandelChange1}
                              value={companyAddress.city}
                              placeholder='City'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>Country</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='Country'
                              onChange={HandelChange1}
                              value={companyAddress.Country}
                              placeholder='Country'
                              required
                            />
                          </Box>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={4}>
                          <Box>
                            <InputLabel className='input_lable spec'>Name</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='name'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.name}
                              placeholder='Name'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>Address</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='address'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.address}
                              placeholder='Address'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>ZIP / PIN Code</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='ZIP_PIN_Code'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.ZIP_PIN_Code}
                              placeholder='ZIP / PIN Code'
                              required
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box>
                            <InputLabel className='input_lable spec'>VAT / TAX ID</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='vat_texId'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.vat_texId}
                              placeholder='VAT / TAX ID'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>City</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='city'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.city}
                              placeholder='City'
                              required
                            />
                          </Box>
                          <Box>
                            <InputLabel className='input_lable spec'>Country</InputLabel>
                            <Input
                              className='inputFild spec'
                              name='Country'
                              onChange={HandelChange1}
                              value={subScriptionOrder?.companyAddress?.Country}
                              placeholder='Country'
                              required
                            />
                          </Box>
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  ''
                )}
                {/* {payValue === 3 ? (
                  <>
                    <Grid item xs={4}>
                      <Button variant='contained' onClick={() => handlePayment()}>
                        razor pay
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ''
                )} */}
              </Grid>
            ) : (
              ''
            )}
          </Box>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' color='black'>
            {'Cancel Subscription'}
          </DialogTitle>
          <Divider className='divider_line' />
          <DialogContent>
            <DialogContentText id='alert-dialog-description' color='black'>
              Are you sure Subscription plan is cancel?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              className='styledButton'
              onClick={() => {
                updateOrgStatus()
              }}
            >
              Yes
            </Button>
            <CancelButton variant='contained' className='cancel_btn' onClick={() => setOpen(false)}>
              No
            </CancelButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open1}
          onClose={() => setOpen1(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' color='black'>
            {'Update Subscription'}
          </DialogTitle>
          <Divider className='divider_line' />
          <DialogContent>
            <DialogContentText id='alert-dialog-description' color='black'>
              Are you sure update your Subscription plan?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              className='styledButton'
              onClick={() => {
                updateOrgSubType()
              }}
            >
              Yes
            </Button>
            <CancelButton variant='contained' className='cancel_btn' onClick={() => setOpen1(false)}>
              No
            </CancelButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
Subscription.getLayout = page => <BlankLayout>{page}</BlankLayout>
Subscription.acl = {
  subject: 'both'
}

export default Subscription
