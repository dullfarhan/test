
import React, { useEffect, useState } from 'react'

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
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Divider, FormHelperText, Grid, Select, Input, MenuItem, Dialog, DialogTitle, DialogContent } from '@mui/material'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from 'src/pages/header'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const UpdateUser = ({ editModal, setEditModal, getCarniqUser, updateUser }) => {

  const requestApiData = new Request()

  const schema = yup.object({
    name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
    email: yup.string().email('Email is required').required('Please enter your email'),
    role: yup.string().required('Please enter your role'),
    designation: yup.string().min(5, "Too Short!").max(100, "Too Long!").required('Please enter message'),
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: updateUser.fullName ? updateUser.fullName : '',
      email: updateUser.email ? updateUser.email : '',
      status: updateUser.status ? updateUser.status : '',
      designation: updateUser.designation ? updateUser.designation : '',
      role: updateUser.role ? updateUser.role : '',
      password: ''
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {

      const payload = {
        _id: updateUser._id,
        fullName: values.name,
        email: values.email,
        designation: values.designation,
        role: values.role,
        status: values.status,
        password: values.password
      }

      requestApiData.updateUser(payload).then(res => {
        toast.success('User Update Successfully')
        getCarniqUser()
        setEditModal(false)
      }).catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
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
        <DialogTitle id="alert-dialog-title" className='text_black inline_css' >
          {"Edit user"}
          <Box>
            <StyledButton type='submit' variant='contained' className='styledButton'>
              Save
            </StyledButton>

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
              disabled
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
            />
            {errors.email && touched.email ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.email}</FormHelperText > : ''}
          </div>
          <div>
            <InputLabel htmlFor='role' className='input_lable'>
              User Role  <span>*</span>
            </InputLabel>
            <Input id='role' name='role' placeholder='role' className='inputFild'
              disabled
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.role)}
            />
            {errors.role && touched.role ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.role}</FormHelperText > : ''}

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

UpdateUser.getLayout = page => <BlankLayout>{page}</BlankLayout>

UpdateUser.acl = {
  subject: 'carniqUser'
}

export default UpdateUser