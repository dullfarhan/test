import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'
import HtmlDiff from 'htmldiff-js'
import moment from 'moment'
import Sidebar from '../sidebar'
import { useRouter } from 'next/router'
import Header from 'src/pages/header'

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const History = () => {
  const [projet, setProject] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [popUp, setPopUp] = useState(false)
  const [restore, setRestore] = useState('')
  const [open, setOpen] = useState(false)
  const requestApiData = new Request()
  const [open2, setOpen2] = useState(false)
  const [pageId, setPageId] = useState('')
  const [projectItem, setProjectItem] = useState([])
  const [checkedValues, setCheckedValues] = useState([])
  const [userName, setUserName] = useState([])
  const [compareVersion, setCompareVersion] = useState({})
  const [compareVersion1, setCompareVersion1] = useState({})


  const { query } = useRouter()
  const id = query?.pid

  const StandardProcess = () => {
    const payload = {
      _id: query.projectId
    }
    requestApiData
      .getStandardProcess(payload)
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

  const getUser = () => {
    requestApiData.getUser().then(res => { setUserName(res.data) }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }
  const findProjectId = JSON.parse(localStorage.getItem('userData'))

  const StandardProcessHistory = () => {
    const payload = {
      standardProcess: query.sid
    }
    requestApiData
      .getStandardProcessHistory(payload)
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

  useEffect(() => {
    StandardProcessHistory()
    StandardProcess()
    getUser()
  }, [query.sid])

  const handleCheckboxChange = value => {
    if (checkedValues.includes(value)) {
      setCheckedValues(checkedValues.filter(v => v !== value))
    } else if (checkedValues.length < 2) {
      setCheckedValues([...checkedValues, value])
    }
  }
  
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCheckedValues([])
    setCompareVersion({})
    setCompareVersion1({})
  }

  // delete History
  const deleteProcessPageHistory = id => {
    requestApiData
      .deleteStandardProcessHistory(id)
      .then(res => {
        StandardProcessHistory()
        toast.success('project history delete successfully')
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


  if (checkedValues[0]?.update_description?.length > 0   && (!compareVersion || Object.keys(compareVersion).length === 0)) {
    let itemObj = {}
    checkedValues[0]?.update_description && checkedValues[0]?.update_description.map((item) => {
      if (item.subitem?.length > 0) {
        item.subitem.map((subItem) => {
          itemObj[item.id + '_' + subItem.id] = subItem.data
        })
      } else {
        itemObj[item.id] = item.data
      }
    })
    setCompareVersion(itemObj)
  }else if(checkedValues[0]?.description?.length > 0   && (!compareVersion || Object.keys(compareVersion).length === 0)) {
    let itemObj = {}
    checkedValues[0]?.description && checkedValues[0]?.description.map((item) => {
      if (item.subitem?.length > 0) {
        item.subitem.map((subItem) => {
          itemObj[item.id + '_' + subItem.id] = subItem.data
        })
      } else {
        itemObj[item.id] = item.data
      }
    })
    setCompareVersion(itemObj)
  }

  if (checkedValues[1]?.update_description?.length > 0 && (!compareVersion1 || Object.keys(compareVersion1).length === 0)) {
    let itemObj = {}
    checkedValues[1]?.update_description && checkedValues[1]?.update_description.map((item) => {
      if (item.subitem?.length > 0) {
        item.subitem.map((subItem) => {
          itemObj[item.id + '_' + subItem.id] = subItem.data
        })
      } else {
        itemObj[item.id] = item.data
      }
    })
    setCompareVersion1(itemObj)
  }else if(checkedValues[1]?.description?.length > 0   && (!compareVersion1 || Object.keys(compareVersion1).length === 0)) {
    let itemObj = {}
    checkedValues[1]?.description && checkedValues[1]?.description.map((item) => {
      if (item.subitem?.length > 0) {
        item.subitem.map((subItem) => {
          itemObj[item.id + '_' + subItem.id] = subItem.data
        })
      } else {
        itemObj[item.id] = item.data
      }
    })
    setCompareVersion1(itemObj)
  }
  
  // Html code History
  const firstHtml = () => {
    return { __html: Object.values(compareVersion).toString().split(',').join(' ') }
  }

  const secondHtml = () => {
    return { __html: Object.values(compareVersion1).toString().split(',').join(' ') }
  }


  const diffHtml = () => {
    return {
      __html: HtmlDiff.execute(
        firstHtml() ? firstHtml().__html : '',
        secondHtml() ? secondHtml().__html : ''
      )
    }
  }

  const diffHtml1 = () => {
    return {
      __html: HtmlDiff.execute(
        secondHtml() ? secondHtml().__html : '',
        firstHtml() ? firstHtml().__html : ''
      )
    }
  }

  const restoreProcessHistory = index => {
    const prId = projet[index <= 0 ? index : index - 1]._id
    const newId = projet[index]._id
    requestApiData
      .getOneStandardProcessHistory(prId)
      .then(res => {
        const payload = {
          _id: newId,
          update_description: res.data.update_description
        }
        requestApiData
          .updateStandardProcessHistory(payload)
          .then(res => {
            StandardProcessHistory()
            toast.success('Restore Successfully')
          })
          .catch(err => {
            if (err.response?.data?.status === 401) {
              toast.error(err.response?.data?.statusText)
              console.log(err)
            } else {
              console.log(err)
            }
          })
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

  return (
    <Box>
      <Header />
      <Sidebar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
      <Box marginLeft={drawerOpen ? '300px' : '60px'} paddingTop='100px'>
        <Box paddingX='2rem' marginTop='1rem' className='inline_css'>
          <Box>
            <Typography variant='h4'>{projectItem[0]?.name}</Typography>
          </Box>
          <Box>
            <Button className='styledButton' disabled={checkedValues.length < 2} onClick={handleClickOpen}>
              Compare Selected Revisions
            </Button>
          </Box>
        </Box>
        <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
        <Box>
          <Box paddingX='2rem' paddingY='4rem' className='adminHeader'>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell className='talel_color'></TableCell>
                    <TableCell className='talel_color'>Version</TableCell>
                    <TableCell className='talel_color'>Published</TableCell>
                    <TableCell className='talel_color'>Changed by</TableCell>
                    <TableCell className='talel_color'>Status</TableCell>
                    <TableCell className='talel_color'>Comment</TableCell>
                    <TableCell align='right' className='talel_color'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    <TableRow
                    sx={{ '&:last-child th, &:last-child th': { border: 0 } }}
                    className='text_black'
                  >
                    <TableCell className='talel_color text_black' ></TableCell>
                    <TableCell className='talel_color text_black' >
                      <Checkbox
                        color='primary'
                        name='checkbox'
                        checked={checkedValues.includes(projectItem[0])}
                        onChange={() => {
                          handleCheckboxChange(projectItem[0])
                        }}
                      />
                      v{projectItem[0]?.version}
                    </TableCell>
                    <TableCell className='talel_color text_black' >
                      {moment(projectItem[0]?.publishAt).format('MMM  DD,YYYY')}
                    </TableCell>
                    <TableCell className='talel_color text_black' >
                      {userName.map((user, i) => (
                        <div key={i}>
                          {findProjectId.id === user._id ? user.fullName : ''}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className='talel_color text_black' >
                      {projectItem[0]?.status ? projectItem[0]?.status : 'Release'}
                    </TableCell>
                    <TableCell className='talel_color text_black' >
                      {projectItem[0]?.comment ? projectItem[0]?.comment : '-'}
                    </TableCell>
                    <TableCell align='right' className='talel_color text_black' >
                      <Button variant='text' onClick={() => { setRestore(index); setPopUp(true) }}>
                        Restore
                      </Button>
                      <Button
                        className='styledButton'
                        onClick={() => {
                          setOpen2(true), setPageId(projectItem[0]._id)
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  }
                  {projet.map((item, index) =>
                    <TableRow
                      sx={{ '&:last-child th, &:last-child th': { border: 0 } }}
                      className='text_black'
                      key={item._id}
                    >
                      <TableCell className='talel_color text_black' ></TableCell>
                      <TableCell className='talel_color text_black' >
                        <Checkbox
                          color='primary'
                          name='checkbox'
                          checked={checkedValues.includes(item)}
                          onChange={() => {
                            handleCheckboxChange(item)
                          }}
                        />
                        v{item?.version}
                      </TableCell>
                      <TableCell className='talel_color text_black' >
                        {moment(item?.publishAt).format('MMM  DD,YYYY')}
                      </TableCell>
                      <TableCell className='talel_color text_black' >
                        {userName.map((user, i) => (
                          <div key={i}>
                            {item?.changeBy === user._id ? user.fullName : ''}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className='talel_color text_black' >
                        {item?.status}
                      </TableCell>
                      <TableCell className='talel_color text_black' >
                        {item?.comment}
                      </TableCell>
                      <TableCell align='right' className='talel_color text_black' >
                        <Button variant='text' onClick={() => { setRestore(index); setPopUp(true) }}>
                          Restore
                        </Button>
                        <Button
                          className='styledButton'
                          onClick={() => {
                            setOpen2(true), setPageId(item._id)
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={open2}
        onClose={() => setOpen2(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='text_black'>
          {'  Remove History from site?'}
        </DialogTitle>
        <Divider className='divider_line' />
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text_black'>
            Are you sure you want to Remove this process history?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            className='styledButton'
            onClick={() => {
              deleteProcessPageHistory(pageId), setOpen2(false)
            }}
          >
            Remove
          </Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={() => setOpen2(false)}>
            Cancel
          </CancelButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullScreen
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <>
              <Grid container>
                <Grid item xs={4}>
                  <Box padding='20px' className='inner'>
                    <Box>
                      <Typography variant='h5'>v{checkedValues[0]?.version > checkedValues[1]?.version ? checkedValues[1]?.version : checkedValues[0]?.version}</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      {checkedValues[0]?.version > checkedValues[1]?.version ? <div dangerouslySetInnerHTML={secondHtml()} /> : <div dangerouslySetInnerHTML={firstHtml()} />}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box padding='20px' className='inner'>
                    <Box>
                      <Typography variant='h5'>v{checkedValues[0]?.version > checkedValues[1]?.version ? checkedValues[0]?.version : checkedValues[1]?.version}</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      {checkedValues[0]?.version > checkedValues[1]?.version ? <div dangerouslySetInnerHTML={firstHtml()} /> : <div dangerouslySetInnerHTML={secondHtml()} />}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box padding='20px' className='inner'>
                    <Box>
                      <Typography variant='h5'>Compare Revisions</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      {checkedValues[0]?.version > checkedValues[1]?.version ? <div dangerouslySetInnerHTML={diffHtml1()} /> : <div dangerouslySetInnerHTML={diffHtml()} />}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose} sx={{ bgcolor: 'red', fontSize: '12px', color: 'white' }}>
            close
          </CancelButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={popUp}
        onClose={() => setPopUp(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='text_black'>
          {'Restore data'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text_black'>
            Are you sure you want to Restore data ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            className='styledButton'
            onClick={() => {
              restoreProcessHistory(restore), setPopUp(false)
            }}
          >
            Yes
          </Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={() => setOpen2(false)}>
            No
          </CancelButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
History.getLayout = page => <BlankLayout>{page}</BlankLayout>

History.acl = {
  subject: 'both'
}

export default History
