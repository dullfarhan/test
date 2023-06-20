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
import * as yup from 'yup'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import Request from 'src/configs/axiosRequest'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)
  
  // ** Hook

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  
  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1)
  }

  const CancelButton = styled(Button)`
    &:hover {
      background: red;
    }
  `

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

  const { query } = useRouter()
  const requestApiData = new Request()

  const checkToken = async payload => {
    const checkToken = await requestApiData.tokenValid(payload)
    if (checkToken.data.error) {
      setTokenExpired(true)
    } else {
      setTokenExpired(false)
    }
  }
  const queryId = query !== '' && query.id
  useEffect(() => {
    if (queryId) {
      const payload = queryId
      checkToken(payload)
    }
  }, [queryId])

  const auth = useAuth()

  const Validation = yup.object({
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

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
    },
    validationSchema: Validation,
    onSubmit: values => {
      const payload = {
        token: query.id,
        password: values.password
      }
      auth.resetpassword(payload)
    }
  })

  return (
    <Box className='content-center auth' >
      {!tokenExpired ? (
        <>
          <Image src={loginbg} alt='bg' />
          <Card
            sx={{
              minWidth: 500,
              position: 'absolute',
              backgroundColor: '#F8F8FF',
              boxShadow: '5px 5px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '5px'
            }}
          >
            <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
              <Box sx={{ mb: 8 }} className='adminHeader'>
                <Image src={logo} alt='Picture of the author' width={250} />
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h5'
                  sx={{ mb: 1.5, color: 'black', fontWeight: 'bold' }} className='adminHeader'
                >
                  Reset Password
                </Typography>
              </Box>
              <form autoComplete='off' onSubmit={handleSubmit}>
                <div>
                  <InputLabel
                    htmlFor='password'
                    className='input_lable'
                  >
                    New Password <span>*</span>
                  </InputLabel>
                  <Input
                    id='password'
                    name='password'
                    placeholder='Password'
                    className='inputFild'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={Boolean(errors.password)}
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
                <Box display='flex' gap={2}>
                  <Button
                    type='submit'
                    variant='contained'
                    className='styledButton'
                  >
                    ResetPassword
                  </Button>
                  <Link href='/login' style={{ textDecoration: 'none' }}>
                    <CancelButton
                      variant='contained'
                      sx={{
                        backgroundColor: 'red',
                        boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25), inset 2px 2px 2px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      Cancel
                    </CancelButton>
                  </Link>
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
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
