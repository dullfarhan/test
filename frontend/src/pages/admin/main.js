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
import { HiSquares2X2 } from 'react-icons/hi2'
import { MdEmail, MdSettings } from 'react-icons/md'
import { styled } from '@mui/material/styles'
import { TfiMenuAlt } from 'react-icons/tfi'
import moment from 'moment'
import Request from 'src/configs/axiosRequest'
import Error401 from '../401'
import { toast } from 'react-hot-toast'
import Subscription from '../subscription'
import { useRouter } from 'next/router'
import Basic from '../basic'

const StyledButton = styled(Button)`
  &:hover {
    background: #4169e1;
  }
`

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

const Admin1 = () => {
  const userName = JSON.parse(localStorage.getItem('userData'))
  const [teb, setTeb] = useState('1')
  const [project, setProject] = useState([])
  const requestApiData = new Request()
  const [orgId, setOrgId] = useState('')
  const [org, setOrg] = useState([])
  const [sub, setSub] = useState({})
  const [standardProcess, setStandardProcess] = useState({})

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
    })
  }, [])

  const getOrganization = () => {
    requestApiData
      .getOrganization()
      .then(res => setOrg(res.data))
      .catch(err => console.log(err))
  }

  const allProject = () => {
    requestApiData
      .getProject()
      .then(res => {
        if (res?.status === 200) {
          setProject(res?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  const router = useRouter()

  useEffect(() => {
    allProject()
    if (org) {
      getOrganization()
    }
  }, [])

  const projectData = project?.filter(e => e.organizationId === orgId.organizationId)

  const HandelChange = e => {
    const name = e.target.value
    requestApiData
      .searchProject(name)
      .then(res => {
        if (res?.status === 200) {
          setProject(res?.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

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
           
                <Box>
                    <AdminHeader />
                    <Box>
                        <Box sx={{ padding: { lg: '34px 64px', xs: '34px 0' }, marginTop: '34px' }}>
                            <Box sx={{ padding: { lg: '34px 64px', xs: '15px' } }}>
                                <Box>
                                    {orgId.resetPassStatus === 'panding' ? <Alert severity='error'>Please Reset your password</Alert> : ''}
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
                                <Grid className='inline_css' container item>
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: 'black',
                                                fontWeight: '700',
                                                fontSize: { lg: '20px', xs: '15px' },
                                                mt: { lg: '0', xs: '1rem' },
                                                paddingTop: '2rem'
                                            }}
                                        >
                                            Projects
                                        </Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center'>
                                        {/* <HiOutlineSearch style={{position : 'relative', marginRight:'-15rem'}} /> */}
                                        <Input
                                            type='search'
                                            sx={{
                                                bgcolor: '#F5F5F5',
                                                border: '1px solid #DADADA',
                                                padding: { lg: '5px 25px', xs: '0 10px' },
                                                mr: { lg: '1rem', xs: '0' },
                                                color: '#696969'
                                            }}
                                            onChange={HandelChange}
                                            placeholder='Search'
                                        />
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                display: 'flex',
                                                border: theme => `1px solid ${theme.palette.divider}`,
                                                flexWrap: 'wrap',
                                                margin: '0px 10px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <StyledToggleButtonGroup value={teb} exclusive onChange={handleDevices} aria-label='device'>
                                                <ToggleButton value='1' aria-label='MenuAlt'>
                                                    <TfiMenuAlt size={20} />
                                                </ToggleButton>
                                                <ToggleButton value='2' aria-label='quare'>
                                                    <HiSquares2X2 size={20} />
                                                </ToggleButton>
                                            </StyledToggleButtonGroup>
                                        </Paper>

                  <Link href='/admin/createproject' style={{ textDecoration: 'none' }}>
                    <StyledButton className='styledButton'>Create Project</StyledButton>
                  </Link>
                </Box>
              </Grid>
              <Divider className='divider_line' />
              <Box
                bgcolor='#F7F7F7'
                sx={{ boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)', borderRadius: '5px', height: 'auto', mt: '2rem' }}
              >
                {teb == '2' ? (
                  <>
                    <Grid
                      sx={{
                        paddingX: { lg: '0rem', xs: '.5rem' }
                      }}
                      className='adminHeader'
                      container
                      item
                    >
                      <Grid
                        sx={{
                          paddingX: { lg: '0rem', xs: '.5rem' }
                        }}
                        className='adminHeader'
                        item
                      >
                        <Box
                          bgcolor='#F8F8FF'
                          sx={{
                            boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)',
                            borderRadius: '5px',
                            margin: '1rem',
                            width: { lg: '350px', sm: '350px', xs: '250px' },
                            paddingX: { lg: '1rem', xs: '.5rem' }
                          }}
                          paddingY='1.2rem'
                        >
                          <Box>
                            <Typography
                              variant='h4'
                              className='adminHeader'
                              color='#696969'
                              sx={{ fontWeight: 700, width: '100%', height: '30px' }}
                            >
                              <MdEmail size={40} />
                            </Typography>
                          </Box>
                          <Link
                            href={`/standardProcess/${standardProcess?._id}/${standardProcess?._id}`}
                            className='header_title'
                          >
                            <Typography
                              className='adminHeader'
                              color='#000000'
                              sx={{ fontWeight: 700, mt: '10px', fontSize: '16px' }}
                            >
                              {orgId?.organizationName} Process Page
                            </Typography>
                          </Link>

                          <Box marginTop='15px' paddingX='2rem'>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Admin{' '}
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {orgId?.fullName}
                              </Typography>
                            </Box>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Created Date{' '}
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {moment(orgId?.createdAt).format('DD-MM-YYYY')}
                              </Typography>
                            </Box>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Updated Date
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {moment(orgId?.updatedAt).format('DD-MM-YYYY')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      {projectData.map(row => (
                        <Box
                          bgcolor='#F8F8FF'
                          sx={{
                            boxShadow: '3px 3px 17px rgba(0, 0, 0, 0.25)',
                            borderRadius: '5px',
                            margin: '1rem',
                            width: '350px',
                            paddingX: { lg: '1rem', xs: '.5rem' }
                          }}
                          paddingY='1.3rem'
                          key={row._id}
                        >
                          <Box>
                            <Typography
                              variant='h4'
                              className='adminHeader'
                              color='#696969'
                              sx={{ fontWeight: 700, width: '100%', height: '30px' }}
                            >
                              <MdEmail size={40} />
                            </Typography>
                            <Link href={`/admin/projectSetting/${row._id}`}>
                              <Typography
                                variant='h4'
                                display='flex'
                                justifyContent='end'
                                color='#000000'
                                alignItems='center'
                                sx={{ fontWeight: 700, width: '100%', height: '30px', marginTop: '-2rem' }}
                              >
                                <MdSettings size={36} />
                              </Typography>
                            </Link>
                          </Box>
                          <Link
                            href={`/processes/${row._id}/${row.standardProcess}/${row.standardProcess}`}
                            style={{ textDecoration: 'none', color: 'black' }}
                          >
                            <Typography
                              className='adminHeader'
                              color='#000000'
                              sx={{ fontWeight: 700, mt: '10px', fontSize: '16px' }}
                            >
                              {row?.name}
                            </Typography>
                          </Link>
                          <Box marginTop='15px' paddingX='2rem'>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Admin{' '}
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {row?.fullName}
                              </Typography>
                            </Box>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Created Date{' '}
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {moment(row?.createdAt).format('DD-MM-YYYY')}
                              </Typography>
                            </Box>
                            <Box className='inline_css'>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                Updated Date
                              </Typography>
                              <Typography>-</Typography>
                              <Typography sx={{ fontSize: { lg: '14px', xs: '13px' } }} color='black'>
                                {moment(row?.updatedAt).format('DD-MM-YYYY')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Box paddingX='4rem' paddingY='2rem' className='adminHeader'>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell className='talel_color border_bottam'>Project Name</TableCell>
                              <TableCell align='center' className='talel_color border_bottam'>
                                Admin
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'>
                                Creation Date
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'>
                                Updated Date
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ '&:last-child th, &:last-child th': { border: 0 } }}>
                              <TableCell component='th' scope='row' style={{ color: 'black', paddingRight: '0px' }}>
                                <MdEmail size={40} />
                              </TableCell>
                              <TableCell component='th' scope='row' style={{ color: 'black' }}>
                                <Link
                                  href={`/standardProcess/${standardProcess?._id}/${standardProcess?._id}`}
                                  className='header_title'
                                >
                                  {`${orgId.organizationName} - Process Page`}
                                </Link>
                              </TableCell> 
                              <TableCell align='center' className='talel_color border_bottam'>
                                {orgId?.fullName}
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'>
                                {moment(orgId?.createdAt).format('DD-MM-YYYY')
                                  ? moment(orgId?.createdAt).format('DD-MM-YYYY')
                                  : '-'}
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'>
                                {moment(orgId?.updatedAt).format('DD-MM-YYYY')
                                  ? moment(orgId?.updatedAt).format('DD-MM-YYYY')
                                  : '-'}
                              </TableCell>
                              <TableCell align='center' className='talel_color border_bottam'></TableCell>
                            </TableRow>
                            {projectData?.map(row => (
                              <TableRow
                                key={row?.name}
                                sx={{ '&:last-child th, &:last-child th': { border: 0 } }}
                                style={{ color: 'black' }}
                              >
                                <TableCell component='th' className='talel_color border_bottam' scope='row' style={{ color: 'black', paddingRight: '0px' }}>
                                  <MdEmail size={40} />
                                </TableCell>
                                <TableCell className='talel_color border_bottam' component='th' scope='row' style={{ color: 'black', padding: '14px 0px' }}>
                                  <Link
                                    href={`/processes/${row._id}/${row.standardProcess}/${row.standardProcess}`}
                                    style={{ textDecoration: 'none', color: 'black', padding: '20px' }}
                                  >
                                    {row?.name}
                                  </Link>
                                </TableCell>

                                <TableCell align='center' className='talel_color border_bottam' style={{ color: 'black' }}>
                                  {row?.fullName}
                                </TableCell>
                                <TableCell align='center' className='talel_color border_bottam' style={{ color: 'black' }}>
                                  {moment(row?.createdAt).format('DD-MM-YYYY')
                                    ? moment(row?.createdAt).format('DD-MM-YYYY')
                                    : '-'}
                                </TableCell>
                                <TableCell align='center' className='talel_color border_bottam' style={{ color: 'black' }}>
                                  {moment(row?.updatedAt).format('DD-MM-YYYY')
                                    ? moment(row?.updatedAt).format('DD-MM-YYYY')
                                    : '-'}
                                </TableCell>
                                <TableCell align='center' className='talel_color border_bottam'>
                                  <Link href={`/admin/projectSetting/${row?._id}`} style={{ color: 'black' }}>
                                    <MdSettings size={36} />
                                  </Link>
                                </TableCell>
                              </TableRow>
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
    </Box>
  )
}
Admin1.getLayout = page => <BlankLayout>{page}</BlankLayout>

Admin1.acl = {
  subject: 'both'
}

export default Admin1
