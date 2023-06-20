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
  const drawerWidth = 300
  const [open1, setOpen1] = useState(true)
  const [subMenu, setSubMenu] = useState(query.id)
  const [activityMenu, setActivityMenu] = useState(query.id)
  const [templet, setTemplet] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [processes, setProcsses] = useState({})
  const [process, setProcess] = useState({})
  const [projectItem, setProjectItem] = useState({})

  const requestApiData = new Request()
  const findProjectId = JSON.parse(localStorage.getItem('userData'))
  
  const getProjectData = () => {
    requestApiData
      .getProcessPage()
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

  const standardProcessItem = () => {
    requestApiData
      .getProcessOneItem(query.sid)
      .then(res => setProjectItem(res.data))
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
        } else {
          console.log(err)
        }
      })
  }

  const standardProcess = () => {
    const payload = {
      _id: query.spId
    }
    requestApiData
      .getStandardProcess(payload)
      .then(res => {
        // const last_element = res.data.findLast((item) => true);
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
  React.useEffect(() => {
    getProjectData()
    standardProcess()
    if (query.sid) {
      standardProcessItem()
    }
  }, [query.sid])

  const router = useRouter()

  const drawer = (
    <Box mt='5rem' sx={{ padding: '25px 0' }}>
      <Box position='fixed'>
        <Typography className='closeIcon' onClick={() => setDrawerOpen(false)}>
          <HiOutlineArrowSmLeft
            style={{
              bottom: '97%',
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

      <List
        id='navbar-example3'
        sx={{ width: '100%', maxWidth: 360 }}
        component='nav'
        className='nav-pills'
        aria-labelledby='nested-list-subheader'
      >
        {/* {process.map(item => ( */}
        <Link
          href={`/standardProcess/${projectItem._id}/${projectItem._id}`}
          style={{ textDecoration: 'none', padding: 0 }}
        >
          <ListItemButton
            onClick={() => {
              setOpen1(!open1)
            }}
          >
            {open1 ? (
              <MdOutlineArrowDropDown size={30} color='#808080' />
            ) : (
              <MdOutlineArrowRight size={30} color='#808080' />
            )}
            <ListItemText primary={projectItem.name} />
          </ListItemButton>
        </Link>
        {/* ))} */}
        <Collapse in={Boolean(open1)} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {projectData.map((page, pageindex) => (
              <Box key={pageindex}>
                {projectItem._id === page.standardProcess ? (
                  <Link
                    href={`/standardProcess/${projectItem._id}/projectManagement/${page._id}`}
                    style={{ textDecoration: 'none', padding: 0 }}
                  >
                    <ListItemButton
                      sx={{ pl: 10 }}
                      onClick={() => {
                        setSubMenu(page._id)
                      }}
                    >
                      {subMenu == page._id ? (
                        <MdOutlineArrowDropDown size={30} color='#808080' />
                      ) : (
                        <MdOutlineArrowRight size={30} color='#808080' />
                      )}
                      <ListItemText primary={page.name} />
                    </ListItemButton>
                  </Link>
                ) : (
                  ''
                )}
                {subMenu == page._id && (
                  <Collapse in={Boolean(subMenu)} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {page.main_description.map((item, itemIndex) => (
                        <Box key={itemIndex}>
                          <ListItemButton
                            sx={{ pl: 20 }}
                            className='nav-link'
                            onClick={() => {
                              window.location.replace(`#${itemIndex}`)
                              setActivityMenu(itemIndex)
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
            ))}
          </List>
        </Collapse>

        {findProjectId?.role === 'carniqUser' ? (
          <>
            <Link
              href={`/standardProcess/${projectItem._id}/processReales`}
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
            <Link href={`/standardProcess/${projectItem._id}/tamplates`} style={{ textDecoration: 'none', padding: 0 }}>
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
          </>
        ) : (
          ''
        )}
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
