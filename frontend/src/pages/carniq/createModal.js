import React from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Icon Imports

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Input, MenuItem, Select } from '@mui/material'
import * as yup from 'yup'
import Header from '../header'
import { useRouter } from 'next/router'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;


const CreateModal = ({ createModal, setCreateModal, getCarniqUser }) => {
  const requestApiData = new Request()
  const router = useRouter()

  const schema = yup.object({
    name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
    email: yup.string().trim().email('Email is required').required('Please enter your email'),

    // role : yup.string().required('Please enter your role'),
    designation: yup.string().min(5, "Too Short!").max(100, "Too Long!").required('Please enter message'),
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: '',
      email: '',
      designation: ''
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        fullName: values.name,
        email: values.email.trim().toLowerCase(),
        role: 'carniqUser',
        designation: values.designation
      }
      resetForm({ values: '' })
      requestApiData.inviteUser(payload).then(res => {
        if (res?.status === 200) {
          toast.success('User Create Successfully')
          getCarniqUser()
          setCreateModal(false)
        }
      })
        .catch(err => {
          if (err.response?.data?.status === 401) {
            toast.error(err.response?.data?.statusText)
            console.log(err)
          } else {

            toast.error(err.response.data.message)
            setCreateModal(false)
            console.log(err)
          }
        })
    }
  })

  return (
    <StyledDialog open={createModal}
      sx={{ height: 'auto' }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <form autoComplete='off' onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title" className='text_black inline_css'>
          {"Add User"}
          <Box>
            <StyledButton type='submit' variant='contained' className='styledButton'>
              Save
            </StyledButton>
            <CancelButton variant='contained' className='cancel_btn' onClick={() => setCreateModal(false)}>
              Cancel
            </CancelButton>
          </Box>
        </DialogTitle>
        <Divider sx={{
          borderColor: 'black',
          margin: '10px 1rem',

        }} />
        <DialogContent className='dialog_text'>

          <div>
            <InputLabel htmlFor='name' className='input_lable'>
              FullName  <span>*</span>
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
            <InputLabel htmlFor='email' className='input_lable'>
              Email  <span>*</span>
            </InputLabel>
            <Input id='email' name='email' placeholder='Email' className='inputFild'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
            />
            {errors.email && touched.email ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.email}</FormHelperText > : ''}
          </div>
          <div>
            <InputLabel htmlFor='designation' className='input_lable'>
              Designation  <span>*</span>
            </InputLabel>
            <Input id='designation' name='designation' placeholder='designation' className='inputFild'
              value={values.designation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.designation)}
            />

            {errors.designation && touched.designation ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.designation}</FormHelperText > : ''}
          </div>

        </DialogContent>
      </form>
    </StyledDialog>
  )
}
CreateModal.getLayout = page => <BlankLayout>{page}</BlankLayout>

CreateModal.acl = {
  subject: 'carniqUser'
}

export default CreateModal