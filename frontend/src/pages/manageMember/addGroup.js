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
  DialogContent
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

const AddGroup = ({ addGroupModal, setAddGroupModal, getGroups, setTab }) => {
  const requestApiData = new Request()

  const [user, setUser] = useState([])
  const [personName, setPersonName] = useState([])
  const [userItem, setUserItem] = useState({})
  const [person, setPerson] = useState([])
  const [orgId, setOrgId] = useState('')

  const getUser = () => {
    const name = ''
    requestApiData
      .getUser(name)
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

  const getOneUserItem = id => {
    requestApiData
      .getUserItem(id)
      .then(res => setUserItem(res.data))
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

  const router = useRouter()

  const schema = yup.object({
    name: yup.string().trim().required('Please enter group name'),
    description: yup.string().required('Please enter description')
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: '',
      description: '',
      member: ''
    },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      const userId = JSON.parse(localStorage.getItem('userData'))
      const organizationId = user.find(item => userId.id === item._id)

      const payload = {
        name: values.name.trim().toLowerCase(),
        description: values.description,
        member: person,
        organizationId: organizationId.organizationId
      }
      requestApiData
        .createGroups(payload)
        .then(res => {
          if (res?.status === 200) {
            setPerson([])
            setPersonName([])
            setAddGroupModal(false)
            getGroups()
            setTab(2)
            toast.success('Group Create Successfully')
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
  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    const name = ''
    requestApiData.getUser(name).then(res => {
      if (res?.status === 200) {
        res.data &&
          res.data
            ?.filter(item => item._id === createdBy.id)
            .map(filteredItem => {
              setOrgId(filteredItem)
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
  }, [])

  const organizationUser = user.filter(item => item.organizationId === orgId.organizationId)

  const handleChangeSlect = e => {
    const userName = e.target.value
    const userNameId = e.target.value._id
    if (person.indexOf(userNameId) === -1) {
      setPerson([...person, userNameId])
    }
    if (personName.indexOf(userName) === -1) {
      setPersonName([...personName, userName])
    }
  }

  const removeMember = id => {
    setPersonName(personName.filter(({ _id }) => _id != id))
    const user = person.indexOf(id)
    if (user !== -1) person.splice(user, 1)
    setPerson(person)
  }

  return (
    <StyledDialog
      open={addGroupModal}
      sx={{ height: 'auto' }}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='lg'
    >
      <DialogTitle id='alert-dialog-title' className='text_black inline_css' >
        <Typography
          color='#252B42'
          sx={{ fontSize: { md: '22px', sx: '15px' }, fontWeight: '700' }}
        >
          Create group
        </Typography>
        {/* {'Create Group'} */}
      </DialogTitle>
      <Divider
        sx={{
          borderColor: 'black',
          margin: '10px 1rem'
        }}
      />
      <DialogContent >
        <Box
          sx={{ padding: { lg: '20px 1rem', xs: '15px' } }}>
          <Grid container spacing={2}>

            <Divider className='divider_line' />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <form onSubmit={handleSubmit}>
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
                    <Box mt='2rem'>
                      <CancelButton
                        variant='contained'
                        sx={{ bgcolor: 'red', fontSize: '12px', marginRight: '1rem' }}
                        onClick={() => setAddGroupModal(false)}
                      >
                        Cancel
                      </CancelButton>
                      <Button variant='contained' sx={{ bgcolor: '#4169E1', fontSize: '12px' }} type='submit'>
                        Create group
                      </Button>
                    </Box>
                  </form>
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
                    placeholder='Select'
                    name='member'
                    className='select_input'
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value=''>Select</MenuItem>
                    {organizationUser.map((item, i) => (
                      <MenuItem key={i} value={item} onClick={() => getOneUserItem(item._id)}>
                        {item.fullName}
                      </MenuItem>
                    ))}
                  </Select>

                </Box>
                <Box mt='2rem' height='200px' sx={{ overflowY: "auto" }}>
                  {personName?.length > 0 ? (
                    personName?.map((item, id) => (
                      <Box value={item?._id} key={id}>
                        <Box
                        
                          // className='inline_css'
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
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </StyledDialog>
  )
}
AddGroup.getLayout = page => <BlankLayout>{page}</BlankLayout>

AddGroup.acl = {
  subject: 'admin'
}

export default AddGroup
