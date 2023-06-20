import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  styled,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiDeleteBinLine, RiUpload2Fill } from 'react-icons/ri'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import AdminHeader from '../../adminheader'
import * as yup from 'yup'
import { useDropzone } from 'react-dropzone'
import { grey } from '@mui/material/colors'
import { identifier } from 'stylis'

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

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

const role = [{ label: 'Basic' }, { label: 'Site Administer' }]

const UserDetails = () => {
  const requestApiData = new Request()
  const [openModal, setOpenModal] = useState(false)
  const [user, setUser] = useState([])
  const [group, setGroup] = useState([])
  const [userGroup, setUserGroup] = useState([])
  const [uploadImg, setUploadImg] = useState(false)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [removeModal1, setRemoveModal1] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [personName, setPersonName] = useState([])

  const { query } = useRouter()
  const router = useRouter()
  const id = query?.id

  //profile---image

  const uploadFile = async file => {
    const payload = {
      email: user?.email,
      profileImg: files[0]
    }
    requestApiData
      .updateProfile(payload)
      .then(res => {
        if (res?.status === 200) {
          getUsers()
          setUploadImg(false)
          toast.success('Profile picture update successfuly')
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const img = files.map(file => <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} width='50%' />)

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

  // print user group

  const getUsers = () => {
    requestApiData
      .getUserItem(id)
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const getAllGroups = () => {
    requestApiData
      .getGroup()
      .then(res => {
        setGroup(res.data)
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const getGroups = () => {
    const payload = {
      member: id
    }
    requestApiData
      .getGroup(payload)
      .then(res => {
        setUserGroup(res.data)
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  useEffect(() => {
    if (id) {
      getUsers()
      getGroups()
      getAllGroups()
    }
  }, [id])

  // add group

  const handleChangeSlect = e => {
    const groupId = e.target.value._id
    requestApiData
      .getOneGroup(groupId)
      .then(res => {
        const payload = {
          _id: groupId,
          member: [...res.data.member, id]
        }
        requestApiData
          .updateGroups(payload)
          .then(res => {
            getGroups()
          })
          .catch(err => {
            if (err.response?.data?.status === 401) {
              toast.error(err.response?.data?.statusText)
              console.log(err)
            }
          })
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  // profile update

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      fullName: user?.fullName ? user?.fullName : '',
      email: user?.email ? user?.email : '',
      status: user?.status ? user?.status : '',
      role: user.role ? user.role : '',
      designation: user.designation ? user.designation : '',
      profileImg: user.profileImg ? user.profileImg : ''
    },
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        _id: user._id,
        fullName: values.fullName,
        role: values.role,
        status: values.status,
        email: values.email,
        designation: values.designation,
        profileImg: values.profileImg
      }
      requestApiData
        .updateUser(payload)
        .then(res => {
          if (res && res.status === 200) {
            toast.success('User Update Successfully')
            getUsers()
          }
        })
        .catch(err => {
          if (err.response?.data?.status === 401) {
            toast.error(err.response?.data?.statusText)
            console.log(err)
          }
        })
    }
  })

  const sentResetMessage = () => {
    const payload = {
      _id: user._id,
      resetPassStatus: 'panding'
    }
    requestApiData
      .updateUser(payload)
      .then(res => {
        toast.success('Reset password message sent')

        return <Alert severity='error'>Please reset your password</Alert>
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  // remove group

  const removeGroup = id1 => {
    setRemoveModal1(false)
    requestApiData
      .getOneGroup(id1)
      .then(res => {
        const userGroups = res?.data?.member
        const index = userGroups?.indexOf(id)
        if (index > -1) {
          userGroups?.splice(index, 1)
        }

        const payload = {
          _id: id1,
          member: userGroups
        }

        requestApiData
          .updateGroups(payload)
          .then(res => {
            getGroups()
          })
          .catch(err => {
            if (err.response?.data?.status === 401) {
              toast.error(err.response?.data?.statusText)
              console.log(err)
            }
          })
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  // delet user
  const deleteCourse = id => {
    requestApiData
      .deleteUser(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('User delete successfully')
          setOpenModal(false)
          router.push('/manageMember')
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
        toast.error('Somthing went wrong')
      })
  }

  return (
    <Box>
      <AdminHeader />
      <Box sx={{ padding: { lg: '14px 35px', marginTop: '6rem', xs: '5px 10px' } }}>
        <Box className='inline_css' sx={{ padding: { lg: '14px 9rem', xs: '5px 10px' } }}>
          <Typography
            sx={{
              fontSize: { lg: '1.5rem', xs: '1rem' },
            }}
            className='typo_text'
          >
            profile - {user.fullName}
          </Typography>
          <Box>
            <Button
              variant='contained'
              className='styledButton'
              onClick={() => {
                sentResetMessage()
              }}
            >
              Prompt reset password
            </Button>
            <Button variant='contained' className='styledButton' onClick={() => setOpenModal(true)}>
              Remove User
            </Button>
            <StyledDialog
              open={openModal}
              onClose={() => setOpenModal(false)}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title' className='text_black'>
                {'Remove User from site?'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description' className='text_black'>
                  Thay will no longer have access; and won't be able to collaborate with your team.Your products will
                  still keep all of this user's contributions.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant='contained' className='styledButton' onClick={() => deleteCourse(user._id)}>
                  Remove user
                </Button>
                <CancelButton
                  variant='contained'
                  className='cancel_btn'
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </CancelButton>
              </DialogActions>
            </StyledDialog>
          </Box>
        </Box>
        <Divider sx={{ margin: { lg: '-10px 8rem', xs: '5px 10px' }, border: '1px solid gray' }} />
        <Box sx={{ padding: { lg: '20px 10rem', xs: '5px 10px' } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={10} item display='flex'>
              <Grid item md={3} xs={12} mt='2rem'>
                <Box paddingX='5rem'>
                  <Box
                    className='position-absolute top-50 start-50 translate-middle mt-2'
                    onClick={() => setUploadImg(true)}
                  >
                    {user?.profileImg ? (
                      <img
                        style={{ borderRadius: '50%' }}
                        src={values?.profileImg}
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
                          {user?.fullName?.length > 0 ? user?.fullName[0] : ''}
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
                        style={{ border: '1px solid #414141', borderRadius: '5px', padding: '30px' }}
                      >
                        <input {...getInputProps()} name='profileImg' type='file' />
                        {files.length ? (
                          img
                        ) : (
                          <Box
                            sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}
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
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Fullname
                  </InputLabel>
                  <Input
                    id='fullName'
                    name='fullName'
                    placeholder='Name'
                    className='inputFild'
                    value={values?.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Email
                  </InputLabel>
                  <Input
                    id='email'
                    name='email'
                    placeholder='Email'
                    className='inputFild'
                    value={values?.email}
                    disabled
                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Job Title
                  </InputLabel>
                  <Input
                    id='designation'
                    name='designation'
                    placeholder='Job Title'
                    className='inputFild'
                    value={values?.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <InputLabel
                    className='input_lable'
                  >
                    Department
                  </InputLabel>
                  <Input
                    id='department'
                    name='department'
                    placeholder='Department'
                    className='inputFild'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Grid>
              <Grid item md={4} xs={12} mt='1.9rem'>
                <div>
                  <InputLabel
                    htmlFor='role'
                    className='input_lable'
                  >
                    Role
                  </InputLabel>
                  <Select
                    name='role'
                    className='select_input'
                    displayEmpty
                    value={values?.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>admin</MenuItem>
                    <MenuItem value='basic'>basic</MenuItem>
                  </Select>
                </div>
                <div>
                  <Box>
                    <InputLabel
                      htmlFor='group'
                      className='input_lable'
                    >
                      User Group
                    </InputLabel>
                    <Select
                      value={personName}
                      onChange={handleChangeSlect}
                      name='member'
                      className='select_input'
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value=''>Select</MenuItem>
                      {group.map((item, i) => (
                        <MenuItem key={i} value={item}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box height='150px' sx={{ overflow: 'auto', backgroundColor: grey, padding: '20px' }}>
                    {userGroup?.length > 0 ? (
                      userGroup?.map((item, id) => (
                        <Box key={id}>
                          <Box
                            display='flex'
                            margin='5px 0px'
                            className='group_data'
                          >
                            <Typography className='group_name'>{item.name}</Typography>
                            <Button
                              sx={{ color: 'black ' }}
                              onClick={() => {
                                setGroupId(item._id)
                                setRemoveModal1(true)
                              }}
                            >
                              <RiDeleteBinLine size={20} />
                            </Button>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography padding='1rem'>Not added any user</Typography>
                    )}
                  </Box>
                </div>
              </Grid>
            </Grid>
            <Box display='flex' justifyContent='end' alignItems='center'>
              <Button type='submit' className='styledButton' variant='contained'>
                Update
              </Button>
            </Box>
          </form>
        </Box>

        <StyledDialog
          open={removeModal1}
          onClose={() => setRemoveModal1(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' className='text_black'>
            {'Remove group from site?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description' className='text_black'>
              Thay will no longer have access; and won't be able to collaborate with your team.Your products will still
              keep all of this user's contributions.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' className='styledButton' onClick={() => removeGroup(groupId)}>
              Remove group
            </Button>
            <CancelButton
              variant='contained'
              className='cancel_btn'
              onClick={() => setRemoveModal1(false)}
            >
              Cancel
            </CancelButton>
          </DialogActions>
        </StyledDialog>
      </Box>
    </Box>
  )
}

UserDetails.getLayout = page => <BlankLayout>{page}</BlankLayout>

UserDetails.acl = {
  subject: 'admin'
}

export default UserDetails
