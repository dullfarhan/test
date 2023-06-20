import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Grid,
  Input,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AdminHeader from '../adminheader'
import { HiOutlineSearch } from 'react-icons/hi'
import { HiSquares2X2 } from 'react-icons/hi2'
import { MdEmail, MdSettings } from 'react-icons/md'
import { styled } from '@mui/material/styles'
import { TfiMenuAlt } from 'react-icons/tfi'
import moment from 'moment'
import Request from 'src/configs/axiosRequest'
import BasicHeader from '../basicheader'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

const datas = [
  {
    id: 1,
    name: 'Project 1',
    regStartDate: '01-03-2023',
    regEndDate: '02-28-2023'
  },
  {
    id: 2,
    name: 'Project 2',
    regStartDate: '08-03-2023',
    regEndDate: '02-22-2023'
  }
]

const Basic = () => {
  const userName = JSON.parse(localStorage.getItem('userData'))
  const [orgId, setOrgId] = useState('')
  const [teb, setTeb] = useState('1')
  const requestApiData = new Request()
  const [project, setProject] = useState([])
  const [user, setUser] = useState([])
  const [standardProcess, setStandardProcess] = useState({})

  let string = userName?.name
    ?.split(' ')
    .map(val => val[0] + val.slice(1))
    .join(' ')

  const handleDevices = (event, newDevices) => {
    setTeb(newDevices)
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

  // adminId

  useEffect(() => {
    requestApiData
      .getUser()
      .then(res => {
        if (res?.status === 200) {
          res.data &&
            res.data
              ?.filter(item => item._id === userName?.id)
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
  }, [])

  useEffect(() => {
    requestApiData
      .getProject()
      .then(res => {
        if (res?.status === 200) {
          setProject(res?.data)
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
  }, [])
  const projectData = project.filter(e => e.organizationId === orgId.organizationId)

  const searchProjectData = e => {
    const name = e.target.value
    requestApiData
      .searchProject(name)
      .then(res => setProject(res.data))
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }
  const adminId = project.find(item => userName?.id === item.adminId)

  const getStandardProcess = () => {
    requestApiData
      .getStandardProcess()
      .then(res => {
        setStandardProcess(res.data[0])
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
    getStandardProcess()
  }, [])

  return (
    <Box>
      <BasicHeader />
      <Box>
        <Box className='main_box'>
          <Box className='main_box'>
            {orgId.resetPassStatus === 'panding' ? <Alert severity='error'>Please Reset your password</Alert> : ''}
            <Box>
              <Typography color='#252B42' sx={{ fontSize: '24px', fontWeight: '700' }}>
                {greeting()}, {string}
              </Typography>
            </Box>
            <Grid className='inline_css' container item>
              <Box>
                <Typography
                  sx={{
                    color: 'black',
                    fontWeight: '700',
                    fontSize: { lg: '20px', xs: '15px' },
                    mt: { lg: '34px', xs: '1rem' }
                  }}
                >
                  Projects
                </Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <Input
                  type='search'
                  sx={{
                    bgcolor: '#F5F5F5',
                    border: '1px solid #DADADA',
                    padding: { lg: '5px 30px', xs: '0 10px' },
                    mr: { lg: '1rem', xs: '0' },
                    color: '#696969'
                  }}
                  onChange={searchProjectData}
                  placeholder='Search'
                />
                <Paper elevation={0} className='admin_basic'>
                  <StyledToggleButtonGroup value={teb} exclusive onChange={handleDevices} aria-label='device'>
                    <ToggleButton value='1' aria-label='MenuAlt'>
                      <TfiMenuAlt size={20} />
                    </ToggleButton>
                    <ToggleButton value='2' aria-label='quare'>
                      <HiSquares2X2 size={20} />
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Paper>
              </Box>
            </Grid>
            <Divider className='divider_line' />
            <Box
              className='basic_btn'
              sx={{ boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)', borderRadius: '5px', height: 'auto ', mt: '2rem' }}
            >
              {teb == '2' ? (
                <>
                  <Grid
                    sx={{
                      paddingX: { lg: '1rem', xs: '.5rem' }
                    }}
                    className='adminHeader'
                    container
                    item
                  >
                    <Grid
                      sx={{
                        paddingX: { lg: '1rem', xs: '.5rem' }
                      }}
                      className='adminHeader'
                      item
                    >
                      <Box
                        sx={{
                          width: { lg: '350px', xs: '250px' },
                          paddingX: { lg: '1rem', xs: '.5rem' }
                        }}
                        className='admin_box'
                      >
                        <Box>
                          <Typography variant='h4' className='adminHeader admin_email text_black'>
                            <MdEmail size={40} />
                          </Typography>
                        </Box>
                        <Link
                          href={`/standardProcess/${standardProcess?._id}/${standardProcess?._id}`}
                          className='header_title'
                        >
                          <Typography className='adminHeader admin_name' color='#000000'>
                          {orgId?.organizationName} Process Page
                          </Typography>
                        </Link>

                        <Box className='specing'>
                          <Box className='inline_css'>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              Admin{' '}
                            </Typography>
                            <Typography>-</Typography>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              {orgId?.fullName}
                            </Typography>
                          </Box>
                          <Box className='inline_css'>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              Created Date{' '}
                            </Typography>
                            <Typography>-</Typography>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              {moment(orgId?.createdAt).format('DD-MM-YYYY')}
                            </Typography>
                          </Box>
                          <Box className='inline_css'>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              Updated Date
                            </Typography>
                            <Typography>-</Typography>
                            <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                              {moment(orgId?.updatedAt).format('DD-MM-YYYY')}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {projectData?.map(row => (
                      <Box key={row._id}>
                        {
                          <Box
                            sx={{
                              width: { lg: '350px', xs: '250px' },
                              paddingX: { lg: '1rem', xs: '.5rem' }
                            }}
                            className='admin_box'
                            key={row._id}
                          >
                            <Box>
                              <Typography variant='h4' className='adminHeader admin_email text_black'>
                                <MdEmail size={40} />
                              </Typography>
                              {row.adminId === adminId?.adminId ? (
                                <Link href={`/admin/projectSetting/${row._id}`}>
                                  <Typography
                                    variant='h4'
                                    display='flex'
                                    justifyContent='end'
                                    color='#000000'
                                    alignItems='center'
                                    className='admin_stting'
                                  >
                                    <MdSettings size={36} />
                                  </Typography>{' '}
                                </Link>
                              ) : (
                                ''
                              )}
                            </Box>
                            <Link
                              href={`/processes/${row._id}/${row.standardProcess}/${row.standardProcess}`}
                              className='header_title'
                            >
                              <Typography className='adminHeader admin_name' color='#000000'>
                                {row.name}
                              </Typography>
                            </Link>
                            <Box className='specing'>
                              <Box className='inline_css'>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  Admin{' '}
                                </Typography>
                                <Typography>-</Typography>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  {row.fullName}
                                </Typography>
                              </Box>
                              <Box className='inline_css'>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  Created Date{' '}
                                </Typography>
                                <Typography>-</Typography>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  {moment(row?.createdAt).format('DD-MM-YYYY')}
                                </Typography>
                              </Box>
                              <Box className='inline_css'>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  Updated Date
                                </Typography>
                                <Typography>-</Typography>
                                <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} className='text_black'>
                                  {moment(row?.updatedAt).format('DD-MM-YYYY')}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        }
                      </Box>
                    ))}
                  </Grid>
                </>
              ) : (
                <>
                  <Box paddingX='2rem' paddingY='2rem' className='adminHeader'>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
                        <TableHead>
                          <TableRow>
                            <TableCell className='talel_color'>Project Name</TableCell>
                            <TableCell align='center' className='talel_color'>
                              Admin
                            </TableCell>
                            <TableCell align='center' className='talel_color'>
                              Date Created
                            </TableCell>
                            <TableCell align='center' className='talel_color'>
                              Date Updated
                            </TableCell>
                            <TableCell align='center' className='talel_color'></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ '&:last-child th, &:last-child th': { border: 0 } }}>
                            <TableCell
                              component='th'
                              scope='row'
                              style={{ textDecoration: 'none', color: 'black', padding: '20px 44px' }}
                            >
                              <Link
                                href={`/standardProcess/${standardProcess?._id}/${standardProcess?._id}`}
                                className='header_title'
                              >
                                {`${orgId.organizationName} - Process Page`}
                              </Link>
                            </TableCell>
                            <TableCell align='center' className='talel_color'>
                              {orgId.fullName}
                            </TableCell>
                            <TableCell align='center' className='talel_color'>
                              {moment(orgId.createdAt).format('DD-MM-YYYY')
                                ? moment(orgId.createdAt).format('DD-MM-YYYY')
                                : '-'}
                            </TableCell>
                            <TableCell align='center' className='talel_color'>
                              {moment(orgId.updatedAt).format('DD-MM-YYYY')
                                ? moment(orgId.updatedAt).format('DD-MM-YYYY')
                                : '-'}
                            </TableCell>
                            <TableCell align='center' className='talel_color'></TableCell>
                          </TableRow>
                          {projectData?.map(row => (
                            <React.Fragment key={row._id}>
                              {row.adminId === userName.id ? (
                                <TableRow key={row.name} sx={{ '&:last-child th, &:last-child th': { border: 0 } }}>
                                  <TableCell component='th' scope='row' className='talel_color'>
                                    <Link
                                      href={`/processes/${row._id}/${row.standardProcess}/${row.standardProcess}`}
                                      className='header_title'
                                      style={{ padding: '20px' }}
                                    >
                                      {row.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {row.fullName}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {moment(row.createdAt).format('DD-MM-YYYY')
                                      ? moment(row.createdAt).format('DD-MM-YYYY')
                                      : '-'}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {moment(row.updatedAt).format('DD-MM-YYYY')
                                      ? moment(row.updatedAt).format('DD-MM-YYYY')
                                      : '-'}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {row.adminId === adminId?.adminId ? (
                                      <Link href={`/admin/projectSetting/${row._id}`}>
                                        <Typography
                                          variant='h4'
                                          display='flex'
                                          justifyContent='end'
                                          color='#000000'
                                          alignItems='center'
                                          className='admin_email'
                                        >
                                          <MdSettings size={36} />
                                        </Typography>{' '}
                                      </Link>
                                    ) : (
                                      ''
                                    )}
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <TableRow key={row.name} sx={{ '&:last-child th, &:last-child th': { border: 0 } }}>
                                  <TableCell
                                    component='th'
                                    scope='row'
                                    className='talel_color'
                                    style={{ padding: '20px 20px' }}
                                  >
                                    <Link
                                      href={`/processes/${row._id}/${row.standardProcess}/${row.standardProcess}`}
                                      className='header_title'
                                      style={{ padding: '20px' }}
                                    >
                                      {row.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {row.fullName}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {moment(row.createdAt).format('DD-MM-YYYY')
                                      ? moment(row.createdAt).format('DD-MM-YYYY')
                                      : '-'}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {moment(row.updatedAt).format('DD-MM-YYYY')
                                      ? moment(row.updatedAt).format('DD-MM-YYYY')
                                      : '-'}
                                  </TableCell>
                                  <TableCell align='center' className='talel_color'>
                                    {row.adminId === adminId?.adminId ? (
                                      <Link href={`/admin/projectSetting/${row._id}`}>
                                        <Typography
                                          variant='h4'
                                          display='flex'
                                          justifyContent='end'
                                          color='#000000'
                                          alignItems='center'
                                          className='admin_email'
                                        >
                                          <MdSettings size={36} />
                                        </Typography>{' '}
                                      </Link>
                                    ) : (
                                      ''
                                    )}
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
Basic.getLayout = page => <BlankLayout>{page}</BlankLayout>

Basic.acl = {
  subject: 'both'
}

export default Basic
