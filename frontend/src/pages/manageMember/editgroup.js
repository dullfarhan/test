import {
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  Button,
  Divider,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import AdminHeader from '../adminheader'
import * as yup from 'yup'
import { Formik, useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useTheme } from '@emotion/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { grey } from '@material-ui/core/colors'

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const EditGroup = ({ updateGroup, updateGroupOpen, setUpdateGroupOpen, getGroups }) => {
  const requestApiData = new Request()

  const [user, setUser] = useState([])
  const [personName, setPersonName] = useState([])
  const [open, setOpen] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [person, setPerson] = useState(null)


  // setPerson(updateGroup?.member)
  const handleClose = () => {
    setOpen(false)
  }

  var id_filter = updateGroup?.member
  useEffect(() => {
    setPerson(id_filter)
  }, [])

  const getUser = () => {
    requestApiData
      .getUser()
      .then(res => {
        const userData = res.data && res.data?.filter(item => item.role === 'admin' || item.role === 'basic')
        setUser(userData)
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
    getUser()
  }, [])

  const schema = yup.object({
    name: yup.string().trim().required('Please enter group name'),
    description: yup.string().required('Please enter description')
  })

  const { values, handleChange, handleBlur, handleSubmit, errors } = useFormik({
    initialValues: {
      name: updateGroup.name ? updateGroup.name : '',
      description: updateGroup.description ? updateGroup.description : '',
      member: updateGroup.member ? updateGroup.member : ''
    },
    validationSchema: schema,
    enableReinitialize: true,

    onSubmit: (values, { resetForm }) => {
      const userId = JSON.parse(localStorage.getItem('userData'))
      const organizationId = user.find(item => userId.id === item._id)

      const payload = {
        _id: updateGroup._id,
        name: values.name.trim().toLowerCase(),
        description: values.description,
        member: person,
        organizationId: organizationId.organizationId
      }

      requestApiData
        .updateGroups(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('Group update Successfully')
            setUpdateGroupOpen(false)
            getGroups()
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
      resetForm({ values: '' })
    }
  })

  // delet group
  const deleteCourse = id => {
    requestApiData
      .deleteGroup(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('Group delete successfully')
          setUpdateGroupOpen(false)
          handleClose()
          getGroups()
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

  const handleChangeSlect = e => {
    const userName = e.target.value
    const userNameId = e.target.value._id

    if (id_filter?.indexOf(userNameId) === -1) {
      setPerson([...id_filter, userNameId])
      id_filter?.push(userNameId)
    }

    if (personName.indexOf(userName) === -1) {
      personName.push(userName)
    }
  }



  const filteredPeople = []

  for (var i = user.length - 1; i >= 0; --i) {
    if (id_filter?.indexOf(user[i]._id) != -1) {
      filteredPeople.push(user[i])
    }
  }

  const removeMember = id => {
    id_filter?.indexOf(id)


    const user = id_filter?.indexOf(id)
    if (user !== -1) id_filter?.splice(user, 1)
    setPerson(id_filter)
  }

  return (
    <StyledDialog
      open={updateGroupOpen}
      sx={{ height: 'auto' }}
      onClose={() => setUpdateGroupOpen(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='lg'
    >
      <DialogContent>
        <Box sx={{ padding: { lg: '34px 1rem', xs: '0' } }}>
          <Box >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <form onSubmit={handleSubmit}>
                  <Box className='inline_css'>
                    <Typography
                      color='#252B42'
                      sx={{
                        fontSize: { md: '24px', sx: '15px' },
                        fontWeight: '700'
                      }}
                    >
                      Update group
                    </Typography>
                    <Box>
                      <Button variant='contained' className='styledButton' type='submit'>
                        Update group
                      </Button>
                      <Button
                        variant='contained'
                        className='styledButton'
                        onClick={() => {
                          setOpen(true)
                          setGroupId(updateGroup._id)
                        }}
                      >
                        Delete group
                      </Button>
                    </Box>
                  </Box>
                  <Divider className='divider_line' />

                  <Grid container spacing={4} mt='2rem'>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Box id='alert-dialog-description' className='text_black'>
                          <Box>
                            <InputLabel htmlFor='name' className='input_lable'>
                              Group's Name
                            </InputLabel>
                            <Input
                              className='inputFild'
                              name='name'
                              value={values.name}
                              onChange={handleChange}
                              error={Boolean(errors.name)}
                            />

                            <Typography style={{ color: '#737373' }}>
                              You won't be able to change the group's name the futuer
                            </Typography>
                          </Box>
                          <Box>
                            <InputLabel htmlFor='description' className='input_lable'>
                              Group's Description
                            </InputLabel>
                            <Input
                              className='inputFild'
                              name='description'
                              value={values.description}
                              onChange={handleChange}
                              error={Boolean(errors.description)}
                            />
                            <Typography style={{ color: '#737373' }}>
                              A description will help you organize and manage your group
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <InputLabel htmlFor='name' className='input_lable'>
                          Users
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
                          {user.map((item, i) => (
                            <MenuItem key={i} value={item}>
                              {item.fullName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      <Box mt='1rem'>
                        <Box height='150px' sx={{ overflowY: 'auto', backgroundColor: grey, padding: '20px' }}>
                          {filteredPeople?.length > 0 ? (
                            filteredPeople?.map((item, id) => (
                              <Box value={item?.fullName} key={id}>
                                <Box
                                  display='flex'
                                  margin='5px 0px'
                                  className='group_data'
                                >
                                  <Typography className='group_name'>{item.fullName}</Typography>
                                  <Button
                                    sx={{ color: 'black ' }}
                                    onClick={() => {
                                      removeMember(item._id)
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
                      </Box>
                    </Grid>
                  </Grid>
                  <StyledDialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                  >
                    <DialogTitle id='alert-dialog-title' className='text_black'>
                      {'Remove Group from site?'}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id='alert-dialog-description' className='text_black'>
                        Thay will no longer have access; and won't be able to collaborate with your team.Your products
                        will still keep all of this user's contributions.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button variant='contained' className='styledButton' onClick={() => deleteCourse(groupId)}>
                        Remove
                      </Button>
                      <Button variant='contained' className='cancel_btn' onClick={handleClose}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </StyledDialog>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  )
}
EditGroup.getLayout = page => <BlankLayout>{page}</BlankLayout>

EditGroup.acl = {
  subject: 'admin'
}

export default EditGroup
