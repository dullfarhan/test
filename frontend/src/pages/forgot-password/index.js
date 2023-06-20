
import { useEffect, useState } from 'react'

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
import logo from '../../assest/carspice/Vector.png'
import Image from 'next/image'
import 'cleave.js/dist/addons/cleave-phone.us'
import loginbg from '../../assest/carspice/loginbag.png'
import { FormHelperText, Input } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import * as yup from 'yup'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const ForgotPassword = () => {

  const auth = useAuth()

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

  const Validation = yup.object({
    email: yup.string().email('Email is required').required('Please enter your email'),

  })

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Validation,
    onSubmit: (values) => {
      auth.mail(values.email)
      router.push('/login')
    }
  })

  return (
    <Box className='content-center auth' >
      <Image src={loginbg} alt='bg' />

      <Card className='loginBox' >
        <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
          <Box sx={{ mb: 8 }} className='adminHeader'>
            <Image
              src={logo}
              alt="Picture of the author"
              width={250}
            />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' className='adminHeader' sx={{ mb: 1.5, color: 'black', fontWeight: 'bold' }}>
              Forgot Password
            </Typography>

          </Box>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div>
              <InputLabel htmlFor='email' className='input_lable'>
                User Name  <span>*</span>
              </InputLabel>
              <Input id='email' name='email' placeholder='Email' className='inputFild'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={Boolean(errors.email)}

              />
              {errors.email && touched.email ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.email}</FormHelperText > : ''}
            </div>

            <Box display='flex' gap={2}>
              <Button type='submit' variant='contained' className='styledButton'>
                ForgotPassword
              </Button>
              <Link href='/login' style={{ textDecoration: 'none' }}>
                <CancelButton variant='contained' sx={{ backgroundColor: 'red', boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25), inset 2px 2px 2px rgba(0, 0, 0, 0.25)' }}>
                  Cancel
                </CancelButton>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>


    </Box>
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword