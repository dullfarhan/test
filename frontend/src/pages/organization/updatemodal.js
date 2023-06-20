import Link from 'next/link'


// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Input, MenuItem, Select } from '@mui/material'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import { DateTimePicker } from '@mui/lab'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useEffect, useState } from 'react'

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

const UpdateModal = ({ editModal, setEditModal, getOrganization, updateData }) => {
  const [subType, setSubType] = useState([])

  const requestApiData = new Request()


  const getSubscriptionPlan = () => {
    requestApiData.getSubscriptionPlan().then(res => setSubType(res.data)).catch(err => console.log(err))
  }
  useEffect(() => {
    getSubscriptionPlan()
  }, [])

  const schema = yup.object({
    name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
    regEndDate: yup.string().required('Please enter register end date'),
    regStartDate: yup.string().required('Please enter register start date'),
    subStatus: yup.string().required('Please enter status'),
    subType: yup.string().required('Please enter type'),
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: updateData.name ? updateData.name : '',
      numberProject: updateData.numberProject ? updateData.numberProject : '',
      numberUsers: updateData.numberUsers ? updateData.numberUsers : '',
      paymentMethod: updateData.paymentMethod ? updateData.paymentMethod : '',
      regEndDate: moment(updateData.regEndDate).format('YYYY-MM-DD') ? moment(updateData.regEndDate).format('YYYY-MM-DD') : '',
      regStartDate: moment(updateData.regStartDate).format('YYYY-MM-DD') ? moment(updateData.regStartDate).format('YYYY-MM-DD') : '',
      subStatus: updateData.subStatus ? updateData.subStatus : '',
      subType: updateData.subTypeId + '/' + updateData?.subType?.subType ? updateData.subTypeId + '/' + updateData?.subType?.subType : ''
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const subTypes = values.subType.split('/')
      
      const data = {
        subType  :subTypes[1],
        price : '',
        companySize : ''
      }

      const payload = {
        _id: updateData._id,
        name: values.name,
        numberProject: values.numberProject,
        numberUsers: values.numberUsers,
        paymentMethod: values.paymentMethod,
        regEndDate: values.regEndDate,
        regStartDate: values.regStartDate,
        subStatus: values.subStatus,
        subTypeId: subTypes[0],
        subType: data
      }
      resetForm({ values: '' })
      requestApiData.updateOrganigationItem(payload).then(res => {
        if (res?.status === 200) {
          toast.success('Organization Update Successfully')
          getOrganization()
          setEditModal(false)
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

  return (
    <StyledDialog open={editModal}
      sx={{ height: 'auto' }}
      onClose={() => setEditModal(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <form autoComplete='off' onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title" className='text_black inline_css'>
          {"Update Organization"}
          <Box>
            <Button type='submit' variant='contained' className='styledButton'>
              Save
            </Button>

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
            <Input id='regEndDate' name='regEndDate' type='date' placeholder='regEndDate' className='inputFild'
              value={values.regEndDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.regEndDate)}
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
                <MenuItem key={i} value={item._id + '/' + item.name}>{item.name}</MenuItem>
              ))}

            </Select>

            {errors.subType && touched.subType ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.subType}</FormHelperText > : ''}
          </div>

          <div>
            <InputLabel htmlFor='subStatus' className='input_lable'>
              Subscription Status  <span>*</span>
            </InputLabel>
            <Select
              value={values.subStatus}
              onChange={handleChange}
              name='subStatus'
              id='subStatus'
              onBlur={handleBlur}
              style={{
                width: '100%',
                backgroundColor: '#F5F5F5',
                border: '1px solid #C0C0C0',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              error={Boolean(errors.subStatus)}

            >
              <MenuItem value=''>Select</MenuItem>
              {['Active', 'Deactive'].map((item, i) => (
                <MenuItem key={i} value={item}>{item}</MenuItem>
              ))}

            </Select>

            {errors.subStatus && touched.subStatus ? <FormHelperText sx={{ color: 'error.main' }} color='red'>{errors.subStatus}</FormHelperText > : ''}
          </div>

        </DialogContent>
      </form>
    </StyledDialog>
  )
}
UpdateModal.getLayout = page => <BlankLayout>{page}</BlankLayout>

UpdateModal.acl = {
  subject: 'carniqUser'
}

export default UpdateModal