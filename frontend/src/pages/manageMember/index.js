import { useTheme } from '@mui/material/styles'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
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
  OutlinedInput,
  styled,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  TableCell,
  tableCellClasses,
  InputAdornment,
  Typography,
  TablePagination,
  Autocomplete,
  TextField,
  FormHelperText
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import AdminHeader from '../adminheader'
import EditIcon from '@mui/icons-material/Edit'
import { useField, useFormik } from 'formik'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import { MdSettings } from 'react-icons/md'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AddGroup from './addGroup'
import EditGroup from './editgroup'
import editIcon from '../../../public/images/edite_icone.png'
import settingIcon from '../../../public/images/setting_icone.png'
import Image from 'next/image'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#D3D3D3',
    color: 'black',
    fontWeight: 700,
    borderRadius: '0px',
    fontSize: '13px',
    borderTop: '1px solid black',
    padding: '0.5rem ',
    borderBottom: '1px solid black'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    color: 'black',
    fontWeight: 500
  }
}))

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

const StyledButton = styled(Button)`
  &:hover {
    background: #4169e1;
  }
`

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

const Managemember = () => {
  const [tab, setTab] = useState('1')
  const requestApiData = new Request()
  const [userData, setUserData] = useState([])
  const [updateGroupOpen, setUpdateGroupOpen] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [addGroupModal, setAddGroupModal] = useState(false)
  const [organization, setOrganization] = useState([])
  const [group, setGroup] = useState([])
  const [updateGroup, setUpdateGroup] = useState('')
  const [orgId, setOrgId] = useState('')
  const [personName, setPersonName] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [dense, setDense] = useState(false)
  const [page1, setPage1] = useState(0)
  const [rowsPerPage1, setRowsPerPage1] = useState(25)
  const [dense1, setDense1] = useState(false)

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const router = useRouter()

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage)
  }

  const handleChangeRowsPerPage1 = event => {
    setRowsPerPage1(parseInt(event.target.value, 10))
    setPage1(0)
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - group.length) : 0
  const emptyRows1 = page1 > 0 ? Math.max(0, (1 + page1) * rowsPerPage1 - userData.length) : 0

  const theme = useTheme()

  const getEditGroup = id => {
    requestApiData
      .getOneGroup(id)
      .then(res => setUpdateGroup(res.data))
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const handleChangeTab = value => {
    setTab(value)
  }

  useEffect(() => {
    requestApiData
      .getOrganization()
      .then(res => {
        setOrganization(res.data)
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }, [])

  const getUsers = () => {
    const name = ''
    requestApiData.getUser(name).then(res => {
      if (res?.status === 200) {
        const userDa = res.data && res.data?.filter(item => item.role === 'admin' || item.role === 'basic')
        setUserData(userDa)
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

  useEffect(() => {
    getUsers()
  }, [])

  //group

  const getGroups = () => {
    const name = ''
    requestApiData
      .searchGroup(name)
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
    getGroups()
  }, [])

  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))

    requestApiData.getUser().then(res => {
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

  const organizationUser = userData.filter(item => item.organizationId === orgId.organizationId)

  const loginOrganization = organization.filter(data => data._id === orgId.organizationId)


  const schema1 = yup.object({
    name: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter your name'),
    email: yup.string().email('Email is required').required('Please enter your email'),
    role: yup.string().required('Please enter your role'),
    designation: yup.string().min(5, 'Too Short!').max(100, 'Too Long!').required('Please enter message')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      organizationName: '',
      organization: '',
      role: '',
      designation: ''
    },
    validationSchema: schema1,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        fullName: values.name,
        organizationName: orgId.organizationName,
        organizationId: orgId.organizationId,
        email: values.email,
        role: values.role,
        designation: values.designation
      }
      resetForm({ values: '' })

      const companySize = loginOrganization[0]?.subType?.companySize?.split('-')[1]
    
     organizationUser.length < companySize ?   requestApiData
        .inviteUser(payload)
        .then(res => {
          if (res?.status === 200) {
            toast.success('User Invite Successfully')
            getUsers()
            setAddModal(false)
          }
        })
        .catch(err => {
          toast.error('Somthing went wrong')
          console.log(err)
          if (err.response?.data?.status === 401) {
            toast.error(err.response?.data?.statusText)
            console.log(err)
          } else {
            console.log(err)
          }
        }) : toast.error('Please upgrad your plan')
    }
  })

  const userSearch = e => {
    const name = e.target.value

    requestApiData.searchUser(name).then(res => {
      if (res?.status === 200) {
        setUserData(res.data)
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

  const groupSearch = e => {
    const name = e.target.value

    requestApiData.searchGroup(name).then(res => {
      if (res?.status === 200) {
        setGroup(res.data)
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

  return (
    <Box>
      <AdminHeader />
      <Box>
        <Box className='main_box'>
          {/* user */}
          <Box className='main_box'>
            {/* invite user */}
            <StyledDialog
              open={addModal}
              sx={{ height: 'auto' }}
              onClose={() => setAddModal(false)}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <form autoComplete='off' onSubmit={formik.handleSubmit}>
                <DialogTitle id='alert-dialog-title' className='text_black inline_css'>
                  {'Invite user'}
                  <Box>
                    <StyledButton type='submit' variant='contained' className='styledButton'>
                      Send Invitation
                    </StyledButton>
                  </Box>
                </DialogTitle>
                <Divider
                  sx={{
                    borderColor: 'black',
                    margin: '10px 1rem'
                  }}
                />
                <DialogContent className='dialog_text'>
                  <div>
                    <InputLabel htmlFor='name' className='input_lable'>
                      FullName <span>*</span>
                    </InputLabel>
                    <Input
                      id='name'
                      name='name'
                      placeholder='Name'
                      className='inputFild'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.name)}
                    />
                    {formik.errors.name && formik.touched.name ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {formik.errors.name}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor='email' className='input_lable'>
                      Email <span>*</span>
                    </InputLabel>
                    <Input
                      id='email'
                      name='email'
                      placeholder='Email'
                      className='inputFild'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.email)}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {formik.errors.email}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>

                  <div>
                    <InputLabel htmlFor='role' className='input_lable'>
                      User Role <span>*</span>
                    </InputLabel>
                    <Select
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      name='role'
                      className='select_input'
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value=''>Select Member</MenuItem>
                      <MenuItem value='admin'>admin</MenuItem>
                      <MenuItem value='basic'>basic</MenuItem>
                    </Select>
                    {formik.errors.role && formik.touched.role ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {formik.errors.role}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <InputLabel htmlFor='designation' className='input_lable'>
                      Designation <span>*</span>
                    </InputLabel>
                    <Input
                      id='designation'
                      name='designation'
                      placeholder='designation'
                      className='inputFild'
                      value={formik.values.designation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.designation)}
                    />

                    {formik.errors.designation && formik.touched.designation ? (
                      <FormHelperText sx={{ color: 'error.main' }} className='err_red'>
                        {formik.errors.designation}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </div>
                </DialogContent>
              </form>
            </StyledDialog>

            <Grid container>
              <Grid item xs={12}>
                <Box className='inline_css'>
                  <Grid item xs={8}>
                    <Box>
                      <Typography
                        onClick={() => handleChangeTab(1)}
                        sx={{ color: 'black', fontWeight: '800' }}
                        variant='text'
                      >
                        Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Box className='inline_css'>
                        <Input
                          type='search'
                          disableUnderline
                          inputstyle={{ color: 'white', padding: '0 25px' }}
                          name='project'
                          startAdornment={
                            <InputAdornment position='start'>
                              <SearchIcon />
                            </InputAdornment>
                          }
                          onChange={userSearch}
                          sx={{
                            bgcolor: '#fff',
                            border: '1px solid gray',
                            borderRadius: '1rem ',
                            padding: { lg: '0px 10px', xs: '0 10px' },
                            ml: { lg: '-2rem', xs: '0' },
                            color: '#b8b8ba'
                          }}
                          placeholder='Search'
                        />

                        <Button
                          className='styledButton'
                          sx={{ float: 'right' }}
                          variant='contained'
                          onClick={() => setAddModal(true)}
                        >
                          Invite User
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Divider className='divider_line' />
            <Grid container>
              <Grid
                xs={12}
                className='basic_btn'
                sx={{
                  boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)',
                  borderRadius: '5px',
                  height: 'auto',
                  padding: '2rem',
                  marginTop: '2rem'
                }}
                item
              >
                <Box sx={{ height: '35vh', overflowY: 'auto' }}>
                  <Table sx={{ width: 1 }} aria-label='customized table'>
                    <TableHead sx={{  borderRadius: '0px !impotant' }}>
                      <TableRow>
                        <StyledTableCell className='border_bottam  '>User Name</StyledTableCell>
                        <StyledTableCell className='border_bottam '>Email Id</StyledTableCell>
                        <StyledTableCell className='border_bottam '>Role</StyledTableCell>
                        <StyledTableCell className='border_bottam '>Status</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>

                    {organizationUser
                      ?.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                      .map((itm, index) => {
                        return (
                          <TableBody key={index}>
                            <TableRow>
                              <StyledTableCell className='border_bottam talel_color'>{itm?.fullName}</StyledTableCell>
                              <StyledTableCell className='border_bottam talel_color'>{itm?.email}</StyledTableCell>
                              <StyledTableCell className='border_bottam talel_color' >{itm?.role}</StyledTableCell>
                              <StyledTableCell className='border_bottam talel_color'>{itm?.status}</StyledTableCell>
                              <StyledTableCell className='border_bottam talel_color' align="right">
                                <Link href={`admin/userDetails/${itm._id}`} className='text_black'>
                                  <Image src={editIcon} width={30} height={30} alt="edite icone" />
                                </Link>
                              </StyledTableCell>
                            </TableRow>
                            {emptyRows1 > 0 && (
                              <TableRow
                                style={{
                                  height: (dense1 ? 33 : 53) * emptyRows1
                                }}
                              >
                                <TableCell colSpan={6} />
                              </TableRow>
                            )}
                          </TableBody>
                        )
                      })}
                  </Table>
                </Box>

                {/* <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={organizationUser.length}
                  rowsPerPage={rowsPerPage1}
                  page={page1}
                  onPageChange={handleChangePage1}
                  onRowsPerPageChange={handleChangeRowsPerPage1}
                /> */}

                <EditGroup
                  updateGroup={updateGroup}
                  updateGroupOpen={updateGroupOpen}
                  setUpdateGroupOpen={setUpdateGroupOpen}
                  getGroups={getGroups}
                  
                // group={group}
                />
              </Grid>
            </Grid>
          </Box>

          {/* group */}

          <Box sx={{ padding: { lg: '34px 64px', xs: '15px' } }}>
            <AddGroup
              addGroupModal={addGroupModal}
              setAddGroupModal={setAddGroupModal}
              getGroups={getGroups}
              setTab={setTab}
            />

            <Grid container>
              <Grid item xs={12}>
                <Box className='inline_css'>
                  <Grid item xs={8}>
                    <Box>
                      <Typography
                        onClick={() => handleChangeTab(1)}
                        sx={{ color: 'black', fontWeight: '800' }}
                        variant='text'
                      >
                        Group
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Box className='inline_css'>
                        <Input
                          type='search'
                          disableUnderline
                          inputstyle={{ color: 'white', padding: '0 25px' }}
                          name='project'
                          startAdornment={
                            <InputAdornment position='start'>
                              <SearchIcon />
                            </InputAdornment>
                          }
                          onChange={groupSearch}
                          sx={{
                            bgcolor: '#fff',
                            border: '1px solid gray',
                            borderRadius: '1rem ',
                            padding: { lg: '0px 10px', xs: '0 10px' },
                            ml: { lg: '-2rem', xs: '0' },
                            color: '#b8b8ba'
                          }}
                          placeholder='Search'
                        />

                        <Button
                          className='styledButton'
                          sx={{ float: 'right' }}
                          variant='contained'
                          onClick={() => setAddGroupModal(true)}
                        >
                          Create group
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Divider className='divider_line' />
            <Grid container>
              <Grid
                xs={12}
                className='basic_btn'
                sx={{
                  boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)',
                  borderRadius: '5px',
                  height: 'auto',
                  padding: '2rem',
                  marginTop: '2rem'
                }}
                item
              >
                <Box sx={{ height: '35vh', overflowY: 'auto' }}>
                  <Table sx={{ width: 1 }} aria-label='customized table'>
                    <TableHead sx={{ borderRadius: '0px !impotant' }}>
                      <TableRow>
                        <StyledTableCell>Group Name</StyledTableCell>
                        <StyledTableCell>Number of member</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>

                    {group.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((itm, index) => {
                      return (
                        <TableBody key={index}>
                          <TableRow>
                            <StyledTableCell className='border_bottam talel_color'>{itm?.name}</StyledTableCell>
                            <StyledTableCell className='border_bottam talel_color'>{itm?.member?.length}</StyledTableCell>
                            <StyledTableCell className='border_bottam talel_color'></StyledTableCell>
                            <StyledTableCell className='border_bottam talel_color'></StyledTableCell>
                            <StyledTableCell align='right' className='border_bottam talel_color'>
                              {/* <Link href={`manageMember/editGroup/${itm._id}`}> */}
                              <Button
                                className='curd_btn'
                                onClick={() => {
                                  getEditGroup(itm._id)
                                  setUpdateGroupOpen(true)
                                }}
                              >
                                <Image src={settingIcon} width={30} height={30} alt="edite icone" />
                              </Button>
                              {/* </Link> */}
                            </StyledTableCell>
                          </TableRow>
                          {emptyRows > 0 && (
                            <TableRow
                              style={{
                                height: (dense ? 33 : 53) * emptyRows
                              }}
                            >
                              <TableCell colSpan={6} />
                            </TableRow>
                          )}
                        </TableBody>
                      )
                    })}
                    <EditGroup
                      updateGroup={updateGroup}
                      updateGroupOpen={updateGroupOpen}
                      setUpdateGroupOpen={setUpdateGroupOpen}
                      getGroups={getGroups}
                    />
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </Table>
                </Box>

                {/* <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={group.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
              </Grid>
            </Grid>
            <AddGroup
              addGroupModal={addGroupModal}
              setAddGroupModal={setAddGroupModal}
              getGroups={getGroups}
              setTab={setTab}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
Managemember.getLayout = page => <BlankLayout>{page}</BlankLayout>

Managemember.acl = {
  subject: 'admin'
}

export default Managemember
