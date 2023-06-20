import { Box, Divider, Grid, Typography } from '@mui/material'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import Header from '../header'

const Member = () => {
  const userName = JSON.parse(localStorage.getItem('userData'))
  const requestApiData = new Request()
  const [user, setUser] = useState([])
  const [ganization, setGanization] = useState([])
  const [project, setProject] = useState([])
  
  let string = userName?.name
    ?.split(' ')
    .map(val => val[0].toUpperCase() + val.slice(1))
    .join(' ')

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
    requestApiData.getUser().then(res => {
      if (res?.status === 200) {
        const userData = res.data && res.data?.filter(item => item.role === 'admin' || item.role === 'basic')
        setUser(userData)
      }
    })
  }, [])
  useEffect(() => {
    requestApiData
      .getOrganization()
      .then(res => {
        if (res?.status === 200) {
          setGanization(res.data)
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {

          toast.error('Somthing went wrong')
          console.log(err)
        }
      })
  }, [])

  useEffect(() => {
    requestApiData
      .getProject()
      .then(res => {
        if (res?.status === 200) {
          setProject(res.data)
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
  }, [])

  return (
    <Box>
      <Header />
      <Box className='main_box'>
        <Box className='main_box'>
          <Typography
            color='#252B42'
            sx={{
              fontSize: { md: '24px', sx: '15px' },
              fontWeight: '700'
            }}
          >
            {greeting()}, {string}
          </Typography>

          <Box className='inline_css'
            paddingTop='2rem' sx={{ paddingX: { md: '1.5rem', xs: '5.rem' } }}>
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Statistics</Typography>
          </Box>
          <Divider className='divider_line' />
          <Box>
            <Grid className='adminHeader' container item spacing={{ xs: 10, md: 4 }}>
              <Grid
                sx={{
                  width: { lg: '400px', md: '300px', xs: '300px' },
                  backgroundColor: '#D3D3D3',
                  height: { md: '250px', xs: '150px' },
                  borderRadius: '10px',
                  marginTop: '4rem',
                  marginLeft: { xs: '2rem', md: '1rem', lg: '3rem' }
                }}
                paddingY='5rem'
                paddingX='40px'
                item
              >
                <Link href='/organization' className='header_title'>
                  <Box>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{
                        fontWeight: 700,
                        fontSize: { md: '2rem', xs: '1.2rem' },
                        marginTop: { md: '2rem' }
                      }}
                    >
                      Organizations
                    </Typography>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{
                        fontWeight: 700,
                        marginTop: { md: '3rem', xs: '1.2rem' },
                        fontSize: { md: '2rem', xs: '1rem' }
                      }}
                    >
                      {ganization.length}
                    </Typography>
                  </Box>
                </Link>
              </Grid>

              <Grid
                sx={{
                  width: { lg: '400px', md: '300px', xs: '300px' },
                  backgroundColor: '#D3D3D3',
                  height: { md: '250px', xs: '150px' },
                  borderRadius: '10px',
                  marginTop: '4rem',
                  marginLeft: { xs: '2rem', md: '1rem', lg: '3rem' }
                }}
                paddingY='5rem'
                paddingX='40px'
                item
              >
                <Link href='/user' className='header_title'>
                  <Box>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{
                        fontWeight: 700,
                        fontSize: { md: '2rem', xs: '1.2rem' },
                        marginTop: { md: '2rem' }
                      }}
                    >
                      Users
                    </Typography>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{
                        fontWeight: 700,
                        marginTop: { md: '3rem', xs: '1.2rem' },
                        fontSize: { md: '2rem', xs: '1rem' }
                      }}
                    >
                      {user.length}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
              <Grid
                sx={{
                  width: { lg: '400px', md: '300px', xs: '300px' },
                  backgroundColor: '#D3D3D3',
                  height: { md: '250px', xs: '150px' },
                  borderRadius: '10px',
                  marginTop: '4rem',
                  marginLeft: { xs: '2rem', md: '1rem', lg: '3rem' }
                }}
                paddingY='5rem'
                paddingX='40px'
                item
              >
                <Link href='/project' className='header_title'>
                  <Box>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{ fontWeight: 700, fontSize: { md: '2rem', xs: '1.2rem' }, marginTop: { md: '2rem' } }}
                    >
                      Projects
                    </Typography>
                    <Typography
                      className='adminHeader'
                      color='#252B42'
                      sx={{
                        fontWeight: 700,
                        marginTop: { md: '3rem', xs: '1.2rem' },
                        fontSize: { md: '2rem', xs: '1rem' }
                      }}
                    >
                      {project.length}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
Member.getLayout = page => <BlankLayout>{page}</BlankLayout>

Member.acl = {
  subject: 'carniqUser'
}

export default Member
