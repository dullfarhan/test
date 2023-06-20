
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
import { toast } from 'react-hot-toast'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`


const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const auth = useAuth()

  const Validation = yup.object({
    email: yup.string().trim().email('Email is required').required('Please enter your email'),
    password1: yup.string().required('Password is required'),
  })

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
    initialValues: {
      email: '',
      password1: ''
    },
    validationSchema: Validation,
    onSubmit: (values) => {
      const payload = {
        email: values.email.trim().toLowerCase(),
        password: values.password1,
      }
      auth.login(payload)
    }
  })

  return (
    <Box className='content-center auth'>
      <Image src={loginbg} alt='bg' />

      <Card className='loginBox'>
        <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
          <Box sx={{ mb: 8 }} className='adminHeader'>
            <Image
              src={logo}
              alt="Picture of the author"
              width={250}
            />
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h4' className='loginTitle'>
              Login
            </Typography>

          </Box>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div>
              <InputLabel htmlFor='email' className='input_lable' >
                User Name  <span>*</span>
              </InputLabel>
              <Input id='email' name='email' placeholder='Email' className='inputFild'
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.username)}
                value={values.email}
              />
              {errors.email && touched.email ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.email}</FormHelperText > : ''}
            </div>
            <div>
              <InputLabel htmlFor='password1' className='input_lable'>
                Password <span>*</span>
              </InputLabel>
              <Input id='password1' name='password1' placeholder='Password' className='inputFild'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password1}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password1 && touched.password1 ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.password1}</FormHelperText > : ''}
            </div>
            <Box
              sx={{
                mb: 1.75,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'end'
              }}
            >
              <Link href='/forgot-password' style={{
                textDecoration: 'none',
                color: '#23A6F0',
                fontSize: '14px',
                marginBottom: '1rem'
              }}>Forgot password?</Link>
            </Box>
            <Box display='flex' justifyContent='center'>

              <StyledButton type='submit' variant='contained' className='styledButton'>
                Login
              </StyledButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
              <Typography sx={{ color: '#23A6F0', mr: 10, fontSize: '14px' }}>Privacy Policy</Typography>
              <Typography>
                <LinkStyled href='/legal-notice' sx={{ fontSize: '14px', ml: 10, color: '#23A6F0' }}>
                  Legal Notice
                </LinkStyled>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ color: '#23A6F0', fontSize: '14px' }}>© 2022 - 2023 CARNIQ Technologies Pvt. Ltd. All Rights Reserved.</Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
Login.getLayout = page => <BlankLayout>{page}</BlankLayout>
Login.guestGuard = true

export default Login