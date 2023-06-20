import { Image, Visibility, VisibilityOff } from '@mui/icons-material'
import { Avatar, Button, Divider, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AdminHeader from '../adminheader'
import * as yup from 'yup'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { RiUpload2Fill } from 'react-icons/ri'
import Header from '../header'
import BasicHeader from '../basicheader'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

const Profile = () => {
  const validationSchema = yup.object({})
  const [userProfile, setUserProfile] = useState({})
  const requestApiData = new Request()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [files, setFiles] = useState([])
  const [uploadImg, setUploadImg] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const createdBy = JSON.parse(window.localStorage.getItem('userData'))

  //get user data
  useEffect(() => {
    profileApi()
  }, [])

  const profileApi = () => {
    requestApiData.getUser().then(res => {
      if (res?.status === 200) {
        res.data &&
          res.data
            ?.filter(item => item._id === createdBy.id)
            .map(filteredItem => {
              setUserProfile(filteredItem)
            })
      }
    }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }



  // user data form
  const {values, handleChange, handleBlur, handleSubmit, touched, errors} = useFormik({
    initialValues: {
      fullName: userProfile.fullName ? userProfile.fullName : '',
      email: userProfile.email ? userProfile.email : '',
      designation: userProfile.designation ? userProfile.designation : ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: values => {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        designation: values.designation,
        department: ''
      }
      requestApiData
        .updateUser(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('User Profile Updated successfully')
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

  //password data form

  const Validations = yup.object({
    oldPassword: yup.string().required('Please enter your oldPassword'),
    password: yup.string().required('New password Required ')
  })

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      password: ''
    },
    enableReinitialize: true,
    validationSchema: Validations,
    onSubmit: values => {
      const payload = {
        email: userProfile.email ? userProfile.email : '',
        oldPassword: values.oldPassword,
        password: values.password,
        resetPassStatus: 'active'
      }
      requestApiData
        .updatePw(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('Password Updat successfuly')
            profileApi()
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
      formik1.resetForm()
    }
  })

  //profile---image


  const uploadFile = async file => {
    const payload = {
      email: userProfile.email,
      profileImg: files[0]
    }

    requestApiData
      .updateProfile(payload)
      .then(res => {
        if (res?.status === 200) {
          profileApi()
          setUploadImg(false)
          toast.success('Profile picture update successfuly')
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

  const img = files.map(file => <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} width='200px' />)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      setSelectedFile(acceptedFiles[0])
    }
  })

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const loginUser = JSON.parse(localStorage.getItem('userData'))

  return (
    <Box>
      {
        loginUser?.role === 'carniqUser' ? <Header userProfile={userProfile} /> : (
          loginUser?.role === 'admin' ? <AdminHeader userProfile={userProfile} /> : <BasicHeader userProfile={userProfile} />
        )
      }
      <Box className='main_box'>
        <Box
          className='inline_css main_box'
        >
          <Typography
            sx={{
              fontSize: { lg: '1.5rem', xs: '1rem' },
            }}
            className='typo_text'
          >
            profile
          </Typography>
        </Box>
        <Divider sx={{ margin: { lg: '-10px 64px', xs: '5px 10px' }, border: '1px solid gray' }} />
        <Box className='main_box'>
          <Grid container spacing={10} item display='flex'>
            <Grid item md={3} xs={12} mt='2rem'>
              <Box paddingX='5rem'>
                <Box
                  className='position-absolute top-50 start-50 translate-middle'
                  mt='2rem'
                  onClick={() => setUploadImg(true)}
                >
                  {userProfile?.profileImg ? (
                    <img
                      style={{ borderRadius: '50%' }}
                      src={userProfile?.profileImg}
                      alt='profile-image'
                      height='200px'
                      width='200px'
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: '#000080',
                        color: 'white',
                        fontFamily: 'Sansation',
                        textTransform: 'uppercase',
                        width: '200px',
                        height: '200px'
                      }}
                    >
                      <Typography variant='h2' color='white'>
                        {loginUser?.name.length > 0 ? loginUser?.name[0] : ''}
                      </Typography>
                    </Avatar>
                  )}
                </Box>
                <Modal
                  open={uploadImg}
                  onClose={() => setUploadImg(false)}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <Box
                      {...getRootProps({ className: 'dropzone' })}
                      sx={files.length ? { height: 450 } : {}}
                      className='modal_style'
                    >
                      <input {...getInputProps()} name='profileImg' type='file' />
                      {files.length ? (
                        img
                      ) : (
                        <Box
                          sx={{ flexDirection: 'column' }} className='adminHeader'
                        >
                          <RiUpload2Fill />
                          <Typography variant='body' sx={{ mb: 2.5 }} className='text-secondary'>
                            Choose a file or drag and drop it here
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Typography variant='body2' sx={{ mb: 2.5 }} className='text-secondary py-2'>
                      File types supported: JPG, PNG. Max Size: 5 MB
                    </Typography>

                    <div className='d-flex justify-content-between pt-4'>
                      <Button
                        type='button'
                        className='me-2 px-4 d-flex align-items-center cancel-btn'
                        onClick={() => setUploadImg(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='button'
                        className='me-2 px-4 d-flex align-items-center save-btn'
                        onClick={() => uploadFile(selectedFile)}
                      >
                        Save
                      </Button>
                    </div>
                  </Box>
                </Modal>
              </Box>
            </Grid>
            <Grid item md={4} xs={12} sx={{ mt: { lg: '2rem', xs: '0' } }}>
              <form onSubmit={handleSubmit}>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    FullName
                  </InputLabel>
                  <Input
                    name='fullName'
                    type='text'
                    placeholder='full name'
                    value={values.fullName}
                    onChange={handleChange}
                    className='inputFild'
                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Email
                  </InputLabel>
                  <Input
                    type='email'
                    name='email'
                    className='profile-input-box w-50 inputFild'
                    value={values.email}
                    onChange={handleChange}
                    placeholder='email'
                    disabled
                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Job-Title
                  </InputLabel>
                  <Input
                    type='text'
                    name='designation'
                    className='profile-input-box w-50 inputFild'
                    value={values.designation}
                    onChange={handleChange}
                    placeholder='JobTitle'

                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Department
                  </InputLabel>
                  <Input
                    type='text'
                    name='Department'
                    className='profile-input-box w-50 inputFild'
                    value={values.department}
                    onChange={handleChange}
                    placeholder='Department'
                  />
                </div>
                <Box>
                  <Button type='submit' className='styledButton' variant='contained'>
                    Updated Profile
                  </Button>
                </Box>
              </form>
            </Grid>

            <Grid item md={4} xs={12} mt='1.9rem'>
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Currunt Password
                  </InputLabel>
                  <Input
                    placeholder='your curront password'
                    name='oldPassword'
                    type={showOldPassword ? 'text' : 'password'}
                    className='inputFild'
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.oldPassword)}

                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setShowOldPassword(show => !show)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.errors.oldPassword && formik.touched.oldPassword == true ? <FormHelperText sx={{ color: "red", fontSize: "15px" }}>{formik.errors.oldPassword}</FormHelperText> : null}
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    New Password
                  </InputLabel>
                  <Input
                    placeholder='Repeat New Password'
                    type={showNewPassword ? 'text' : 'password'}
                    className=' inputFild'
                    name='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.password)}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={() => setShowNewPassword(show => !show)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.errors.password && formik.touched.password == true ? <FormHelperText sx={{ color: "red", fontSize: "15px" }}>{formik.errors.password}</FormHelperText> : null}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <Box>
                    <Button type='submit' className='styledButton' variant='contained'>
                      Updated password
                    </Button>
                  </Box>
                </div>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

Profile.getLayout = page => <BlankLayout>{page}</BlankLayout>
Profile.acl = {
  subject: 'both'
}

export default Profile
