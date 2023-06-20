import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Input, MenuItem, Select, Typography } from '@mui/material'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { Fragment } from 'react'


const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const OrganizationModal = ({ createModal, setCreateModal, getOrganization }) => {
  const requestApiData = new Request()
  const [subType, setSubType] = useState([])
  const [subTypeId, setSubTypeId] = useState('')
  const [price, setPrice] = useState('')
  const [subOrder, setSubOrder] = useState([])
  const [createOrg, setCreateOrg] = useState({})
  const [createSubOrd, setCreateSubOrd] = useState({})
  const router = useRouter()

  const Validation = yup.object({
    name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
    regEndDate: yup.string().required('Please enter register end date'),
    paymentMethod: yup.string().required('Please enter payment method'),
    subType: yup.string().required('please enter subscription type ')
  })

  const getSubscriptionPlan = () => {
    requestApiData.getSubscriptionPlan().then(res => setSubType(res.data)).catch(err => console.log(err))
  }


  const getSubscriptionOrder = () => {
    requestApiData.getSubscriptionOrder().then(res => setSubOrder(res.data)).catch(err => console.log(err))
  }
  useEffect(() => {
    getSubscriptionPlan()
  }, [])

  const date = new Date()
  const regEndDate = date.setFullYear(date.getFullYear(), date.getMonth() + 12)

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: '',
      numberProject: '',
      numberUsers: '',
      paymentMethod: '',
      regEndDate: regEndDate,
      regStartDate: '',
      subStatus: '',
      subType: '',
      companySize: '',
    },

    validationSchema: Validation,
    onSubmit: (values, { resetForm }) => {
      const subTypeName = values.subType.split('/')
      const company_size = values.companySize.split('/')

      const data = {
        subType: subTypeName[1],
        price: price,
        companySize: company_size[1]
      }


      const payload = {
        name: values.name.trim(),
        numberProject: values.numberProject,
        numberUsers: values.numberUsers,
        paymentMethod: values.paymentMethod,
        regEndDate: values.regEndDate,
        regStartDate: new Date(),
        subStatus: 'Active',
        subType: data,
        subTypeId: subTypeName[0]
      }
      resetForm({ values: '' })
      requestApiData.createOrganization(payload).then(res => {
        if (res?.status === 200) {
          toast.success('Create Organization Successfully')
          getOrganization()

          // setCreateOrg(res.data)
          setCreateModal(false)

          const payload1 = {
            organizationId: res.data._id,
            subscriptionId: res.data.subTypeId,
            billingAddress: {},
            companyAddress: {},
            cardDetails: {}
          }
          requestApiData.createSubscriptionOrder(payload1).then(res => getSubscriptionOrder()).catch(err => console.log(err))
        }
      })
        .catch(err => {
          if (err.response?.data?.status === 401) {
            toast.error(err.response?.data?.statusText)
            console.log(err)
          }
          else {

            toast.error('Somthing went wrong')
            console.log(err)
          }
        })
    }
  })

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear() + 1;

    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <StyledDialog open={createModal}
      sx={{ height: 'auto' }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <form autoComplete='off' onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title" className='text_black inline_css' >
          {"Create Organization"}
          <Box>
            <Button type='submit' variant='contained' className='styledButton'>
              Save
            </Button>
            <CancelButton onClick={() => setCreateModal(false)} variant='contained' className='cancel_btn'>
              Cancel
            </CancelButton>
          </Box>
        </DialogTitle>
        <Divider className='divider_line' />
        <DialogContent className='dialog_text'>
          <div>
            <InputLabel htmlFor='name' className='input_lable'>
              Name  <span>*</span>
            </InputLabel>
            <Input id='name' name='name' placeholder='Name' className='inputFild'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.name)}
            />
            {errors.name && touched.name ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.name}</FormHelperText > : ''}
          </div>
          <div>
            <InputLabel htmlFor='paymentMethod' className='input_lable'>
              Payment Method  <span>*</span>
            </InputLabel>
            <Select
              value={values.paymentMethod}
              onChange={handleChange}
              name='paymentMethod'
              id='paymentMethod'
              onBlur={handleBlur}
              className='select_input'
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              error={Boolean(errors.paymentMethod)}

            >
              <MenuItem value=''>Select</MenuItem>
              {['PayPal', 'Bank Transfer', 'Credit Card', 'Debit Card'].map((item, i) => (
                <MenuItem key={i} value={item}>{item}</MenuItem>
              ))}

            </Select>

            {errors.paymentMethod && touched.paymentMethod ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.paymentMethod}</FormHelperText > : ''}
          </div>

          <div>
            <InputLabel htmlFor='regEndDate' className='input_lable'>
              Register End Date  <span>*</span>
            </InputLabel>
            <input id='regEndDate' name='regEndDate' type='date' placeholder='regEndDate' className='inputFild'
              value={values.regEndDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.regEndDate)}
              min={disablePastDate()}
              style={{ padding: '1rem' }}
            />

            {errors.regEndDate && touched.regEndDate ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.regEndDate}</FormHelperText > : ''}
          </div>

          <div>
            <InputLabel htmlFor='subType' className='input_lable'>
              Subscription Type <span>*</span>
            </InputLabel>

            <Select
              value={values.subType}
              onChange={handleChange}
              name='subType'
              id='subType'
              onBlur={handleBlur}
              className='select_input'
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              error={Boolean(errors.subType)}
            >
              <MenuItem value=''>Select</MenuItem>
              {subType.map((item, i) => (

                <MenuItem key={i} value={item._id + '/' + item.name} onClick={() => setSubTypeId(item._id)}>{item.name}</MenuItem>

              ))}
            </Select>
            {errors.subType && touched.subType ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.subType}</FormHelperText > : ''}

          </div>
          <div>
            <InputLabel htmlFor='companySize' className='input_lable'>
              Subscription CompanySize <span>*</span>
            </InputLabel>
            <Select
              value={values.companySize}
              onChange={handleChange}
              name='companySize'
              id='companySize'
              onBlur={handleBlur}
              className='select_input'
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value=''>Select</MenuItem>
              {subType.map((item, i) =>
                  item.price.map(prc =>
                  (
                    subTypeId === item._id ? <MenuItem key={prc.id} value={prc.id + '/' + prc.company_size} onClick={() => setPrice(prc.price)}>{prc.company_size}</MenuItem> : ''
                  )
                  )
              )}
            </Select>

          </div>
        </DialogContent>
      </form>
    </StyledDialog>
  )
}
OrganizationModal.getLayout = page => <BlankLayout>{page}</BlankLayout>

OrganizationModal.acl = {
  subject: 'carniqUser'
}

export default OrganizationModal