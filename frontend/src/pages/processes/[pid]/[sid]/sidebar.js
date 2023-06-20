import {
  Box,
  Button,
  Collapse,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { MdMenu, MdOutlineArrowDropDown, MdOutlineArrowRight } from 'react-icons/md'
import MuiAppBar from '@mui/material/AppBar'
import { HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from 'react-icons/hi'
import Request from 'src/configs/axiosRequest'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core'

const Sidebar = ({ drawerOpen, setDrawerOpen }) => {
  const { query } = useRouter()
  const router = useRouter()
  const drawerWidth = 300
  const [open1, setOpen1] = useState(true)
  const [subMenu, setSubMenu] = useState(true)
  const [activityMenu, setActivityMenu] = useState()
  const [templet, setTemplet] = useState(false)
  const [processes, setProcsses] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [project, setProject] = useState([])
  const [process, setProcess] = useState([])
  const [projectItem, setProjectItem] = useState({})
  const [adminId, setAdminId] = useState('')

  const findProjectId = JSON.parse(localStorage.getItem('userData'))

  const getOneProjectData = () => {
    requestApiData
      .getProjectItem(query.pid)
      .then(res => {
        setProjectItem(res.data)
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

  const requestApiData = new Request()

  const getProject = () => {
    requestApiData
      .getProject()
      .then(res => {
        setProject(res.data)
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

  const standardProcess = () => {
    const payload = {
      _id: query.sid
    }
    requestApiData
      .getStandardProcess(payload)
      .then(res => {
        setProcess(res.data[0])
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

  const getProjectData = () => {
    const payload = {
      standardProcess: process._id
    }
    requestApiData
      .getProcessPage(payload)
      .then(res => {
        setProjectData(res.data)
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
    getProject()
  }, [])

  useEffect(() => {
    if (query.pid || query.sid) {
      getProjectData()
      standardProcess()
      getOneProjectData()
    }
  }, [query.pid, query.processId, query.projectPageId, query.sid])


  const filteredPeople = []
  const abc=[]
  for (var i = projectData.length - 1; i >= 0; --i) {

    if (projectItem?.processPage?.indexOf(projectData[i]._id) != -1) {
        abc.push(i)
    }
  }

if(abc){
    abc.sort().map((el)=>{
        filteredPeople.push(projectData[el])
    })
}





  const drawer = (
    <Box mt='5rem' sx={{ padding: '20px 0' }}>
      <Box position='fixed'>
        <Typography className='closeIcon' onClick={() => setDrawerOpen(false)}>
          <HiOutlineArrowSmLeft
            style={{
              bottom: '95%',
              left: '92%',
              borderRadius: '10rem',
              border: '2px solid gray',
              position: 'absolute',
              padding: '.5rem',
              fontSize: '2.5rem'
            }}
          />
        </Typography>
      </Box>
      <Typography style={{ fontSize: '30px', fontWeight: 'bold' }} color='#000000' className='adminHeader'>
        {projectItem.name}
      </Typography>

      <List sx={{ width: '100%', maxWidth: 360 }} component='nav' aria-labelledby='nested-list-subheader'>
        <ListItemButton
          onClick={() => {
            router.push(`/processes/${projectItem._id}/${process._id}/${process._id}`)
            setOpen1(!open1)
          }}
        >
          {open1 ? (
            <MdOutlineArrowDropDown size={30} color='#808080' />
          ) : (
            <MdOutlineArrowRight size={30} color='#808080' />
          )}
          <ListItemText primary={process.name} />
        </ListItemButton>
        {open1
          ? filteredPeople?.map((page, pageindex) => (
              <Box key={pageindex}>
                {query.sid === page.standardProcess ? (
                  <Link
                    href={`/processes/${projectItem._id}/${process._id}/projectPage/${page._id}`}
                    style={{ textDecoration: 'none', padding: 0 }}
                  >
                    <ListItemButton sx={{ pl: 10 }} onClick={() => setSubMenu(projectItem._id)}>
                      {subMenu == page._id ? (
                        <MdOutlineArrowDropDown size={30} color='#808080' />
                      ) : (
                        <MdOutlineArrowRight size={30} color='#808080' />
                      )}
                      {open1 ? <ListItemText primary={page.name} /> : ''}
                    </ListItemButton>
                  </Link>
                ) : (
                  ''
                )}
                {subMenu == page._id && (
                  <Collapse in={subMenu} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {page.main_description.map((item, itemIndex) => (
                        <Box key={itemIndex}>
                          <ListItemButton
                            sx={{ pl: 20 }}
                            className='nav-link'
                            onClick={() => {
                              window.location.replace(`#${itemIndex}`)
                            }}
                          >
                            <ListItemText className='list_text'>{item.name}</ListItemText>
                          </ListItemButton>
                          {item?.subitem?.length > 0
                            ? item?.subitem?.map((subItem, subItemIndex) => (
                                <Box key={subItemIndex}>
                                  <List component='div' disablePadding>
                                    <ListItemButton
                                      sx={{ pl: 25 }}
                                      className='nav-link'
                                      onClick={() => {
                                        window.location.replace(`#${itemIndex + '' + subItemIndex}`)
                                      }}
                                    >
                                      <ListItemText className='list_text'>{subItem.name}</ListItemText>
                                    </ListItemButton>
                                  </List>
                                </Box>
                              ))
                            : ''}
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))
          : ''}
        {findProjectId?.role === 'admin' || projectItem?.adminId === findProjectId?.id ? (
          <Link
            href={`/processes/${projectItem._id}/${process._id}/processReales`}
            style={{ textDecoration: 'none', padding: 0 }}
          >
            <ListItemButton
              onClick={() => {
                setTemplet(!templet)
              }}
            >
              {templet ? (
                <MdOutlineArrowDropDown size={30} color='#808080' />
              ) : (
                <MdOutlineArrowRight size={30} color='#808080' />
              )}
              <ListItemText primary='Process Release' />
            </ListItemButton>
          </Link>
        ) : (
          ''
        )}
        <Link
          href={`/processes/${projectItem._id}/${process._id}/tamplates`}
          style={{ textDecoration: 'none', padding: 0 }}
        >
          <ListItemButton
            onClick={() => {
              setProcsses(!processes)
            }}
          >
            {processes ? (
              <MdOutlineArrowDropDown size={30} color='#808080' />
            ) : (
              <MdOutlineArrowRight size={30} color='#808080' />
            )}
            <ListItemText primary='Templates' />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  )

  return (
    <div>
      <CssBaseline />
      <Box position='fixed'>
        <Typography className='openIcon' onClick={() => setDrawerOpen(true)}>
          <HiOutlineArrowSmRight
            style={{
              bottom: '85%',
              marginLeft: '2rem',
              borderRadius: '10rem',
              border: '2px solid gray',
              position: 'absolute',
              padding: '.5rem',
              fontSize: '2.5rem'
            }}
          />
        </Typography>
      </Box>
      <Drawer
        variant='persistent'
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, zIndex: 0, backgroundColor: '#F5F5F5' }
        }}
        anchor='left'
        open={drawerOpen}
        style={{ width: '40px' }}
      >
        {drawer}
      </Drawer>
    </div>
  )
}

export default Sidebar
