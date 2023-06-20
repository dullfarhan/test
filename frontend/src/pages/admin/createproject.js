import {
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  Button,
  styled,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  DialogContentText,
  FormHelperText,
  Checkbox
} from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import AdminHeader from '../adminheader'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import projectImg from '../../assest/carspice/emails.png'
import { RiDeleteBinLine } from 'react-icons/ri'
import moment from 'moment'

const StyledButton = styled(Button)`
  &:hover {
    background: #4169e1;
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
`

const CreateProject = () => {
  const requestApiData = new Request()

  const [user, setUser] = useState([])
  const [allGroup, setAllGroup] = useState([])
  const [person, setPerson] = useState([])
  const [personName, setPersonName] = useState([])
  const [standardProcess, setStandardProcess] = useState([])
  const [standardProcessHistory, setStandardProcessHistory] = useState({})
  const [removeModal1, setRemoveModal1] = useState(false)
  const [standardProcessRelease, setStandardProcessRelease] = useState({})
  const [standardProcessPage, setStandardProcessPage] = useState([])
  const [checkedProcess, setCheckedProcess] = useState([])

  useEffect(() => {
    const payload = {
      member: person
    }
    requestApiData
      .getGroup(payload)
      .then(res => {
        setAllGroup(res.data)
      })
      .catch(error => {
        if (error.response.data.status === 401) {
          toast.error(error.response.data.statusText)
          console.log(error)
        } else {
          console.log(error)
        }
      })
  }, [])

  const getUser = () => {
    requestApiData
      .searchUser()
      .then(res => {
        const userData = res.data.filter(item => item.role === 'admin' || item.role === 'basic')
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

  const getstandardProcess = () => {
    requestApiData
      .getStandardProcess()
      .then(res => {
        const last_element = res.data.findLast(item => true)
        setStandardProcess(last_element)
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        }
      })
  }

  const getStandardProcessTailerHistory = () => {
    requestApiData
      .getStandardProcessTailerHistory()
      .then(res => {
        const last_element = res.data.findLast(item => true)
        setStandardProcessHistory(last_element)
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

  const getStandardProcessRelease = () => {
    requestApiData
      .getStandardProcessRelease()
      .then(res => {
        const last_element = res.data.findLast(item => true)
        setStandardProcessRelease(last_element)
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
    const payload = {
      member: person
    }
    requestApiData
      .getGroup()
      .then(res => {
        setAllGroup(res.data)
      })
      .catch(error => {
        if (error.response.data.status === 401) {
          toast.error(error.response.data.statusText)
          console.log(error)
        } else {
          console.log(err)
        }
      })
  }, [])

  useEffect(() => {
    getUser()
    getstandardProcess()
    getStandardProcessTailerHistory()
    getStandardProcessRelease()
  }, [])

  const userName = JSON.parse(localStorage.getItem('userData'))

  const router = useRouter()

  const schema = yup.object({
    name: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your Project name'),
    description: yup
      .string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Please enter your Project description '),
    fullName: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your Project fullName')

    // group: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your Project group'),
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: '',
      description: '',
      group: '',
      admin: '',
      adminName: '',
      organizationId: '',
      fullName: ''
    },

    validationSchema: schema,
    onSubmit: values => {
      const userId = JSON.parse(localStorage.getItem('userData'))

      const organizationId = user.find(item => userId.id === item._id)

      const admins = values.fullName.split('/')

      const payload = {
        name: values.name,
        description: values.description,
        group: person,
        adminId: admins[0],
        fullName: admins[1],
        processPage: checkedProcess,
        organizationId: organizationId.organizationId,
        organizationName: organizationId.organizationName,
        processVersion: standardProcessRelease?.releasedVersion ? standardProcessRelease?.releasedVersion : '1.0',
        standardProcess: standardProcessRelease?.standardProcess
          ? standardProcessRelease?.standardProcess
          : standardProcess._id
      }
      requestApiData
        .createProject(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('Project Create Successfully')
            router.push('/admin')
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
  })

  function greeting() {
    const hour = moment().hour()

    if (hour > 16) {
      return 'Good Evening'
    }

    if (hour > 11) {
      return 'Good Afternoon'
    }

    return 'Good Morning'
  }

  useEffect(() => {
    requestApiData
      .getProcessPage()
      .then(res => {
        if (res.status === 200) {
          setStandardProcessPage(res?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleCheckboxChange = (value,id) => {
    if (checkedProcess.includes(value)) {
      setCheckedProcess(checkedProcess.filter(v => v !== value))
    } else if (checkedProcess) {
      setCheckedProcess([...checkedProcess, value])
    }
  }

  return (
    <Box>
      <AdminHeader />
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography
              color='#252B42'
              sx={{
                fontSize: { md: '24px', sx: '15px' }
              }}
              className='main_title'
            >
              {greeting()}, {userName.name.charAt(0).toUpperCase() + userName.name.slice(1)}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box className='inline_css'>
              <Typography
                color='#252B42'
                sx={{
                  fontSize: { md: '24px', sx: '15px' },
                  marginTop: { lg: '34px', xs: '100px' }
                }}
                className='main_title'
              >
                Create Project
              </Typography>

              <Button variant='contained' className='styledButton' type='submit'>
                Create Project
              </Button>
            </Box>
            <Divider className='divider_line' />
            <Box
              sx={{
                borderRadius: '5px',
                height: 'auto',
                mt: '2rem'
              }}
            >
              <Grid container spacing={{ xs: 4, md: 20 }}>
                <Grid item xs={4}>
                  <Image
                    src={projectImg}
                    style={{ width: '60%', height: 'auto', margin: '1rem 4rem' }}
                    alt='project-image'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <div>
                    <InputLabel htmlFor='name' className='input_lable'>
                      Project Name <span>*</span>
                    </InputLabel>
                    <Input
                      className='inputFild'
                      name='name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.name)}
                    />
                    <Typography>
                      Enter an uniquely identifiable project name. <br />
                      You won't be able to change the project name in the future.
                    </Typography>
                    {errors.name && touched.name ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {errors.name}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor='description' className='input_lable' sx={{ marginTop: '1rem' }}>
                      Project Description
                    </InputLabel>
                    <Input
                      className='inputFild'
                      name='description'
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.description)}
                    />
                    <Typography>Please write short paragraph about the project.</Typography>
                    {errors.description && touched.description ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {errors.description}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor='description' className='input_lable' sx={{ marginTop: '1rem' }}>
                      Applicable Processes *
                    </InputLabel>
                    <Box>
                      {standardProcessPage?.map((item, index) => {
                        return (
                          <>
                            <Typography>
                              <Checkbox
                                sx={{
                                  color: '#A9A9A9',
                                  '&.Mui-checked': {
                                    color: '#A9A9A9'
                                  }
                                }}
                                name='checkbox'
                                checked={checkedProcess.includes(item._id)}
                                onChange={() => {
                                  handleCheckboxChange(item._id,index+1)
                                }}
                                className='check_box_input'
                              />
                              {item?.name}
                            </Typography>
                          </>
                        )
                      })}
                    </Box>

                    <Typography>Please select all the processes which are applicable for your project.</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div>
                    <InputLabel htmlFor='admin' className='input_lable'>
                      Project Admin <span>*</span>
                    </InputLabel>
                    <Select
                      value={values.fullName}
                      onChange={handleChange}
                      name='fullName'
                      className='select_input'
                      error={Boolean(errors.fullName)}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value=''>Select</MenuItem>
                      {user.map((item, id) => (
                        <MenuItem value={item._id + '/' + item.fullName} key={id}>
                          {item.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.fullName && touched.fullName ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {errors.fullName}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                  <Box mt='5rem'>
                    <InputLabel htmlFor='name' className='input_lable'>
                      Group
                    </InputLabel>
                    <Select
                      value={person}
                      onChange={handleChangeSlect}
                      placeholder='Select'
                      name='group'
                      className='select_input'
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}

                      // error={Boolean(errors.group)}
                    >
                      <MenuItem value=''>Select</MenuItem>
                      {allGroup.map((item, i) => (
                        <MenuItem key={i} value={item}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* {errors.group && touched.group ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.group}</FormHelperText > : ''} */}
                  </Box>
                  <Box mt='2rem' height='200px'>
                    {personName.length > 0 ? (
                      personName.map((item, id) => (
                        <Box value={item?._id} key={id}>
                          <Box
                            // className='inline_css'
                            display='flex'
                            margin='5px 0px'
                            className='group_data'
                          >
                            <Typography className='group_name'>{item.name}</Typography>
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
            {'Remove User from site?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description' className='text_black'>
              Thay will no longer have access; and won't be able to collaborate with your team.Your products will still
              keep all of this user's contributions.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' className='styledButton' onClick={() => removeMember()}>
              Remove project
            </Button>
            <CancelButton variant='contained' className='cancel_btn' onClick={() => setRemoveModal1(false)}>
              Cancel
            </CancelButton>
          </DialogActions>
        </StyledDialog>
      </Box>
    </Box>
  )
}

CreateProject.getLayout = page => <BlankLayout>{page}</BlankLayout>

CreateProject.acl = {
  subject: 'admin'
}

export default CreateProject
