
// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

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
import Router, { useRouter } from 'next/router'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'

// ** Styled Components
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
    background: #4169e1;
  }
`

const Register = () => {

  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)

  // ** Hook

  const theme = useTheme()
  const requestApiData = new Request()
  const { query } = useRouter()
  const queryId = query !== '' && query.id

  const checkToken = async payload => {
    const checkToken = await requestApiData.tokenValid(payload)
    if (checkToken.data.error) {
      setTokenExpired(true)
    } else {
      setTokenExpired(false)
    }
  }

  useEffect(() => {
    if (queryId) {
      const payload = queryId
      checkToken(payload)
    }
  }, [queryId])

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1)
  }
  const auth = useAuth()

  const router = useRouter()

  const Validation = yup.object({
    username: yup.string().trim().email('Email is required').required('Please enter your email'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    confirm_password: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password'), null], 'Password does not match')
  })

  const { values, handleChange, handleSubmit, touched, errors, handleBlur } = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm_password: ''
    },
    validationSchema: Validation,
    onSubmit: values => {
      const payload = {
        email: values.username.trim().toLowerCase(),
        password: values.password,
        status: 'active'
        
        // confirmPassword: values.confirm_password,
        // role: "member"
      }
      requestApiData
        .registerUser(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('Uesr Register Successfully')
            auth.successMail(res?.data?.email)
            router.push('/login')
          }
        })
        .catch(err => {
          toast.error('Something went wrong')
        })
    }
  })

  const BoxWrapper = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      width: '90vw'
    }
  }))

  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
      height: 450,
      marginTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      height: 400
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(20)
    }
  }))

  return (
    <Box className='content-center auth'>
      {!tokenExpired ? (
        <>
          <Image src={loginbg} alt='bg' />

          <Card
            className='loginBox'
          >
            <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
              <Box sx={{ mb: 8 }} className='adminHeader'>
                <Image src={logo} alt='Picture of the author' width={250} />
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h4'
                  className='loginTitle'
                >
                  Register
                </Typography>
              </Box>
              <form autoComplete='off' onSubmit={handleSubmit}>
                <div>
                  <InputLabel
                    htmlFor='username'
                    className='input_lable'
                  >
                    User Name <span>*</span>
                  </InputLabel>
                  <Input
                    id='username'
                    name='username'
                    placeholder='Email'
                    className='inputFild'
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.username)}
                  />
                  {errors.username && touched.username ? (
                    <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                      {errors.username}
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <InputLabel
                    htmlFor='password'
                    className='input_lable'
                  >
                    Password <span>*</span>
                  </InputLabel>
                  <Input
                    id='password'
                    name='password'
                    placeholder='Password'
                    className='inputFild'
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
                    onChange={handleChange}
                    value={values.password}
                    onBlur={handleBlur}
                    error={Boolean(errors.password)}
                  />
                  {errors.password && touched.password ? (
                    <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                      {errors.password}
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <InputLabel
                    htmlFor='confirm_password'
                    className='input_lable'
                  >
                    Re-enter password <span>*</span>
                  </InputLabel>
                  <Input
                    id='confirm_password'
                    name='confirm_password'
                    placeholder='Password'
                    className='inputFild'
                    type={showPassword1 ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword1}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <Icon icon={showPassword1 ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={handleChange}
                    value={values.confirm_password}
                    onBlur={handleBlur}
                    error={Boolean(errors.confirm_password)}
                  />
                  {errors.confirm_password && touched.confirm_password ? (
                    <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                      {errors.confirm_password}
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </div>

                <Box className='adminHeader'>
                  <StyledButton
                    type='submit'
                    variant='contained'
                    className='styledButton'
                  >
                    Register
                  </StyledButton>
                </Box>
                <Box className='adminHeader'
                  sx={{
                    flexWrap: 'wrap',
                    marginBottom: '1rem'
                  }}
                >
                  <Typography sx={{ color: '#23A6F0', mr: 10, fontSize: '14px' }}>Privacy Policy</Typography>
                  <Typography>
                    <LinkStyled href='/legal-notice' sx={{ fontSize: '14px', ml: 10, color: '#23A6F0' }}>
                      Legal Notice
                    </LinkStyled>
                  </Typography>
                </Box>
                <Box className='adminHeader' sx={{ flexWrap: 'wrap' }}>
                  <Typography sx={{ color: '#23A6F0', fontSize: '14px' }}>
                    © 2022 - 2023 CARNIQ Technologies Pvt. Ltd. All Rights Reserved.
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <Box className='content-center'>
          <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <BoxWrapper>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                Page Not Found :(
              </Typography>
              <Typography sx={{ mb: 6, color: 'text.secondary' }}>
                Oops! 😖 The requested URL was not found on this server.
              </Typography>
              <Button href='/' component={Link} variant='contained'>
                Back to Home
              </Button>
            </BoxWrapper>
            <Img height='500' alt='error-illustration' src='/images/pages/404.png' />
          </Box>
        </Box>
      )}
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
