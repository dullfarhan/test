import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RiDeleteBinLine } from 'react-icons/ri'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import AdminHeader from 'src/pages/adminheader'
import projectImg from '../../../assest/carspice/emails.png'
import BasicHeader from 'src/pages/basicheader'

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

const ProjectSetting = () => {
  const userName = JSON.parse(localStorage.getItem('userData'))
  const [user, setUser] = useState([])
  const [groupId, setGroupId] = useState('')
  const [removeModal1, setRemoveModal1] = useState(false)
  const [group, setGroup] = useState([])
  const [project, setProject] = useState({})
  const [orgId, setOrgId] = useState('')
  const [personName, setPersonName] = useState([])
  const [person, setPerson] = useState([])
  const [standardProcessRelease, setStandardProcessRelease] = useState({})
  const [standardProcessPage, setStandardProcessPage] = useState([])
  const [checkedProcess, setCheckedProcess] = useState([])

  var id_filter = project?.group,
    filteredPeople = []

  for (var i = group.length - 1; i >= 0; --i) {
    if (id_filter?.indexOf(group[i]._id) != -1) {
      filteredPeople.push(group[i])
    }
  }

  const handleChangeSlect = e => {
    const userNames = e.target.value
    const userNameId = e.target.value._id
    if (id_filter?.indexOf(userNameId) === -1) {
      setPerson([...id_filter, userNameId])
      id_filter?.push(userNameId)
    }

    if (personName.indexOf(userNames) === -1) {
      setPersonName([...personName, userNames])
    }
  }

  useEffect(() => {
    setPerson(id_filter)
  }, [])

  const removeMember = id => {
    id_filter.indexOf(id)
    setPersonName(personName.filter(({ id }) => id != id))
    const user = id_filter.indexOf(id)
    setRemoveModal1(false)
    if (user !== -1) id_filter.splice(user, 1)
    setPerson(id_filter)
  }

  const { query } = useRouter()

  const router = useRouter()

  const id = query.id

  const requestApiData = new Request()

  const getProject = () => {
    requestApiData
      .getProjectItem(id)
      .then(res => {
        setProject(res.data)
        setCheckedProcess(res?.data?.processPage)
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
      group: person
    }
    requestApiData
      .getGroup(payload)
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
  useEffect(() => {
    if (id) {
      getProject()
    }
    getGroups()
  }, [id])

  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData
      .getUser()
      .then(res => {
        if (res?.status === 200) {
          res.data &&
            res.data
              ?.filter(item => item._id === createdBy.id)
              .map(filteredItem => {
                setOrgId(filteredItem)
              })
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
    getStandardProcessRelease()
  }, [])

  const getStandardProcessRelease = () => {
    const payload = {
      standardProcess: project.standardProcess
    }
    requestApiData
      .getStandardProcessRelease(payload)
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

  const getUser = () => {
    requestApiData
      .getUser()
      .then(res => {
        const userdata = res.data.filter(item => item.role === 'admin' || item.role === 'basic')

        setUser(userdata)
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

    // getStandardProcessTailerHistory()
  }, [id])

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: project.name ? project.name : '',
      fullName: project.adminId + '/' + project.fullName ? project.adminId + '/' + project.fullName : '',
      description: project.description ? project.description : '',
      group: person
    },

    enableReinitialize: true,
    onSubmit: values => {
      const admins = values.fullName.split('/')

      const payload = {
        _id: project._id,
        name: values.name,
        adminId: admins[0],
        fullName: admins[1],
        description: values.description,
        group: person,
        processPage: checkedProcess,
        processVersion: project.processVersion,
        standardProcess: project.standardProcess
      }
      requestApiData
        .updateProject(payload)
        .then(res => {
          if (res && res.status === 200) {
            toast.success('project Update Successfully')
            getProject()
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

  const updateProcessVersion = () => {
    const fullName = project.adminId + '/' + project.fullName ? project.adminId + '/' + project.fullName : ''

    const admins = fullName.split('/')

    const payload = {
      _id: project._id,
      name: project.name,
      adminId: admins[0],
      fullName: admins[1],
      description: project.description,
      group: person,
      processVersion: standardProcessRelease.releasedVersion,
      standardProcess: project.standardProcess
    }
    requestApiData
      .updateProject(payload)
      .then(res => {
        if (res && res.status === 200) {
          toast.success('Update process version Successfully')
          getProject()
          userName?.role === 'admin' ? router.push('/admin') : router.push('/basic')
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

  const handleCheckboxChange = value => {
    if (checkedProcess.includes(value)) {
      setCheckedProcess(checkedProcess.filter(v => v !== value))
    } else if (checkedProcess) {
      setCheckedProcess([...checkedProcess, value])
    }
  }

  return (
    <Box>
      {userName?.role === 'admin' ? <AdminHeader /> : <BasicHeader />}
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography
              color='#252B42'
              sx={{
                fontSize: { md: '24px', sx: '15px' },
                fontWeight: '700'
              }}
            >
              {greeting()}, {userName.name.charAt(0).toUpperCase() + userName.name.slice(1)}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box className='inline_css' mt='3rem' sx={{ paddingX: { md: '1.5rem', xs: '5.rem' } }}>
              <Typography variant='h6' className='main_title'>
                Project Setting
              </Typography>
              <Box>
                {!standardProcessRelease?.releasedVersion ||
                standardProcessRelease?.releasedVersion === project.processVersion ? (
                  ''
                ) : (
                  <Button className='styledButton' variant='contained' onClick={() => updateProcessVersion()}>
                    Update Process Version
                  </Button>
                )}
                <Button className='styledButton' variant='contained' type='submit'>
                  Update Project Details
                </Button>
              </Box>
            </Box>
            {/* sqqqqqqqqx={{ marginTop: '5px', borderColor: 'black', height: '3px' }}  */}
            <Divider className='divider_line' />
            <Grid container item spacing={10} mt='.5rem'>
              <Grid item xs={4}>
                <Image src={projectImg} className='pro_img' alt='' />
                <div>
                  <InputLabel
                    sx={{
                      color: '#252B42',
                      fontSize: '1rem',
                      fontWeight: '700',
                      margin: '.5rem 4rem'
                    }}
                  >
                    Standard Process Version <span>*</span>
                  </InputLabel>
                  <Input
                    sx={{
                      width: '70%',
                      border: '2px solid #C0C0C0',
                      bgcolor: '#F5F5F5',
                      borderRadius: '5px',
                      margin: '.5rem 4rem',
                      padding: '.3rem'
                    }}
                    name='processVersion'
                    value={`v${project.processVersion}`}
                    onChange={handleChange}
                    disabled
                  />
                  {project.processVersion !== standardProcessRelease?.releasedVersion ? (
                    <Typography
                      sx={{
                        margin: '.5rem 4rem',
                        padding: '.3rem',
                        fontWeight: '700',
                        color: '#00875A',
                        width: '260px'
                      }}
                    >
                      {standardProcessRelease?.releasedVersion ? (
                        <>Standard Process Version {standardProcessRelease?.releasedVersion} available!</>
                      ) : (
                        ''
                      )}
                    </Typography>
                  ) : (
                    ''
                  )}
                </div>
              </Grid>
              <Grid item xs={4}>
                <div>
                  <InputLabel className='input_lable'>
                    Project Name <span>*</span>
                  </InputLabel>
                  <Input
                    className='inputFild'
                    name='name'
                    value={values.name}
                    onChange={handleChange}
                    placeholder='Project Name'
                  />
                </div>
                <div>
                  <InputLabel className='input_lable' sx={{ marginTop: '2rem' }}>
                    Project Description <span>*</span>
                  </InputLabel>
                  <Input
                    className='inputFild'
                    name='description'
                    value={values.description}
                    onChange={handleChange}
                    placeholder='Project Name'
                  />
                  <Typography sx={{ fontSize: '14px', margin: '.3rem 0', color: '#696969' }}>
                    {' '}
                    Please write short paragraph about the project.
                  </Typography>
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
                                  handleCheckboxChange(item._id)
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
                </div>
              </Grid>
              <Grid item xs={4}>
                <div>
                  <InputLabel className='input_lable'>
                    Project Admin <span>*</span>
                  </InputLabel>
                  <Select
                    name='fullName'
                    value={values.fullName}
                    onChange={handleChange}
                    className='select_input'
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value=''>Select</MenuItem>
                    {user.map((item, id) => (
                      <MenuItem value={item._id + '/' + item.fullName} key={id}>
                        {item.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <Box>
                  <InputLabel htmlFor='name' sx={{ color: 'black', marginTop: '3.3rem' }}>
                    Users Group
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
                    {group.map((item, i) => (
                      <MenuItem key={i} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box mt='2rem' height='200px' sx={{ overflowY: 'auto', padding: '0px 10px' }}>
                  {filteredPeople?.length > 0 ? (
                    filteredPeople?.map((item, id) => (
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
                              setRemoveModal1(true)
                              setGroupId(item._id)
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
          </form>
        </Box>
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
          <Button variant='contained' className='styledButton' onClick={() => removeMember(groupId)}>
            Remove project
          </Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={() => setRemoveModal1(false)}>
            Cancel
          </CancelButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  )
}

ProjectSetting.getLayout = page => <BlankLayout>{page}</BlankLayout>
ProjectSetting.acl = {
  subject: 'both'
}

export default ProjectSetting
