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
import { idID } from '@mui/material/locale'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Request from 'src/configs/axiosRequest'

// import AdminHeader from '../adminheader'
import HtmlDiff from 'htmldiff-js'
import moment from 'moment'
import BasicHeader from 'src/pages/basicheader'
import Sidebar from '../sidebar'
import { useRouter } from 'next/router'
import AdminHeader from 'src/pages/adminheader'

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const ProcessPageTailerHistory = () => {
  const [projetPage, setProjectPage] = useState([])
  const [open, setOpen] = useState(false)
  const requestApiData = new Request()
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [open2, setOpen2] = useState(false)
  const [pageId, setPageId] = useState('')
  const [popUp, setPopUp] = useState(false)
  const [restore, setRestore] = useState('')
  const [checkedValues, setCheckedValues] = useState([])
  const [projectPages, setProjectPages] = useState({})
  const [compareVersion, setCompareVersion] = useState({})
  const [compareVersion1, setCompareVersion1] = useState({})

  const { query } = useRouter()
  const id = query.pageId


  const findProjectId = JSON.parse(localStorage.getItem('userData'))

  const allProjectPage = () => {
    const payload = {
      project: query.pid
    }
    requestApiData
      .getProcessPageTailerHistoryByProject(payload)
      .then(res => {
        const data = res?.data.filter(item => item.processPage === query?.pageId)
        setProjectPage(data)
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

  const getOneProcessItem = () => {
    requestApiData.getOneProcessPage(query?.pageId).then(res => setProjectPages(res.data)).catch(err => {
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
      allProjectPage()
      getOneProcessItem()
    }
  }, [id])

  const handleCheckboxChange = value => {
    if (checkedValues.includes(value)) {
      setCheckedValues(checkedValues.filter(v => v !== value))
    } else if (checkedValues.length < 2) {
      setCheckedValues([...checkedValues, value])
    }
  }

  const versionVersion = checkedValues?.sort((a, b) => {
    return a.version - b.version
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCheckedValues([])

  }

  // delete History
  const deleteProcessPageTailerHistory = id => {
    requestApiData
      .deleteProcessPageTailerHistory(id)
      .then(res => {
        allProjectPage()
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


  if (checkedValues[0]?.main_description?.length > 0 && (!compareVersion || Object.keys(compareVersion).length === 0)) {
    let itemObj = {}
    checkedValues[0]?.main_description && checkedValues[0]?.main_description.map((item) => {
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

  if (checkedValues[1]?.main_description?.length > 0 && (!compareVersion1 || Object.keys(compareVersion1).length === 0)) {
    let itemObj = {}
    checkedValues[1]?.main_description && checkedValues[1]?.main_description.map((item) => {
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



  // version_1

  const item1 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item1 ? versionVersion[0]?.tailored_description.item1 : compareVersion.item1 }
  }

  const item2 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item2 ? versionVersion[0]?.tailored_description.item2 : compareVersion.item2 }
  }

  const activities1 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem1 ? versionVersion[0]?.tailored_description.item3_subitem1 : compareVersion.item3_subitem1 }
  }

  const activities2 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem2 ? versionVersion[0]?.tailored_description.item3_subitem2 : compareVersion.item3_subitem2 }
  }

  const activities3 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem3 ? versionVersion[0]?.tailored_description.item3_subitem3 : compareVersion.item3_subitem3 }
  }

  const activities4 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem4 ? versionVersion[0]?.tailored_description.item3_subitem4 : compareVersion.item3_subitem4 }
  }

  const activities5 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem5 ? versionVersion[0]?.tailored_description.item3_subitem5 : compareVersion.item3_subitem5 }
  }

  const activities6 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem6 ? versionVersion[0]?.tailored_description.item3_subitem6 : compareVersion.item3_subitem6 }
  }

  const activities7 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem7 ? versionVersion[0]?.tailored_description.item3_subitem6 : compareVersion.item3_subitem7 }
  }

  const activities8 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item3_subitem8 ? versionVersion[0]?.tailored_description.item3_subitem6 : compareVersion.item3_subitem8 }
  }

  const item4 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item4 ? versionVersion[0]?.tailored_description.item3_subitem6 : compareVersion.item4 }
  }

  const item5 = () => {
    return { __html: versionVersion[0]?.tailored_description?.item5 ? versionVersion[0]?.tailored_description.item3_subitem6 : compareVersion.item5 }
  }

  // version_2
  const item1_1 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item1 ? versionVersion[1]?.tailored_description?.item1 : compareVersion1.item1 }
  }

  const item2_2 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item2 ? versionVersion[1]?.tailored_description?.item2 : compareVersion1.item2 }
  }

  const activities1_1 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem1 ? versionVersion[1]?.tailored_description?.item3_subitem1 : compareVersion1.item3_subitem1 }
  }

  const activities2_2 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem2 ? versionVersion[1]?.tailored_description?.item3_subitem2 : compareVersion1.item3_subitem2 }
  }

  const activities3_3 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem3 ? versionVersion[1]?.tailored_description?.item3_subitem3 : compareVersion1.item3_subitem3 }
  }

  const activities4_4 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem4 ? versionVersion[1]?.tailored_description?.item3_subitem4 : compareVersion1.item3_subitem4 }
  }

  const activities5_5 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem5 ? versionVersion[1]?.tailored_description?.item3_subitem5 : compareVersion1.item3_subitem5 }
  }

  const activities6_6 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem6 ? versionVersion[1]?.tailored_description?.item3_subitem6 : compareVersion1.item3_subitem6 }
  }

  const activities7_7 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem7 ? versionVersion[1]?.tailored_description?.item3_subitem7 : compareVersion1.item3_subitem7 }
  }

  const activities8_8 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item3_subitem8 ? versionVersion[1]?.tailored_description?.item3_subitem8 : compareVersion1.item3_subitem8 }
  }

  const item4_4 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item4 ? versionVersion[1]?.tailored_description?.item4 : compareVersion1.item4 }
  }

  const item5_5 = () => {
    return { __html: versionVersion[1]?.tailored_description?.item5 ? versionVersion[1]?.tailored_description?.item5 : compareVersion1.item5 }
  }

  // different

  const diff_item1 = () => {

    return {
      __html: HtmlDiff.execute(item1().__html ? item1().__html : '', item1_1().__html ? item1_1().__html : '')
    }
  }

  const diff_item2 = () => {

    return {
      __html: HtmlDiff.execute(item2().__html ? item2().__html : '', item2_2().__html ? item2_2().__html : '')
    }
  }

  const diff_activities1 = () => {

    return {
      __html: HtmlDiff.execute(
        activities1().__html ? activities1().__html : '',
        activities1_1().__html ? activities1_1().__html : ''
      )
    }
  }

  const diff_activities2 = () => {
    return {
      __html: HtmlDiff.execute(
        activities2().__html ? activities2().__html : '',
        activities2_2().__html ? activities2_2().__html : ''
      )
    }
  }

  const diff_activities3 = () => {
    return {
      __html: HtmlDiff.execute(
        activities3().__html ? activities3().__html : '',
        activities3_3().__html ? activities3_3().__html : ''
      )
    }
  }

  const diff_activities4 = () => {
    return {
      __html: HtmlDiff.execute(
        activities4().__html ? activities4().__html : '',
        activities4_4().__html ? activities4_4().__html : ''
      )
    }
  }

  const diff_activities5 = () => {
    return {
      __html: HtmlDiff.execute(
        activities5().__html ? activities5().__html : '',
        activities5_5().__html ? activities5_5().__html : ''
      )
    }
  }

  const diff_activities6 = () => {
    return {
      __html: HtmlDiff.execute(
        activities6().__html ? activities6().__html : '',
        activities6_6().__html ? activities6_6().__html : ''
      )
    }
  }

  const diff_activities7 = () => {
    return {
      __html: HtmlDiff.execute(
        activities7().__html ? activities7().__html : '',
        activities7_7().__html ? activities7_7().__html : ''
      )
    }
  }

  const diff_activities8 = () => {
    return {
      __html: HtmlDiff.execute(
        activities8().__html ? activities8().__html : '',
        activities8_8().__html ? activities8_8().__html : ''
      )
    }
  }

  const diff_item4 = () => {
    return {
      __html: HtmlDiff.execute(item4().__html ? item4().__html : '', item4_4().__html ? item4_4().__html : '')
    }
  }

  const diff_item5 = () => {
    return {
      __html: HtmlDiff.execute(item5().__html ? item5().__html : '', item5_5().__html ? item5_5().__html : '')
    }
  }

  const restorePageHistory = index => {
    const prId = projetPage[index <= 0 ? index : index - 1]._id
    const newId = projetPage[index]._id
    requestApiData
      .getOneProcessPageTailerHistory(prId)
      .then(res => {
        const payload = {
          _id: newId,
          tailored_description: res.data.tailored_description
        }
        requestApiData
          .updateProcessPageTailerHistory(payload)
          .then(res => {
            allProjectPage()
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
      {findProjectId?.role === 'admin' ? <AdminHeader /> : <BasicHeader />}

      <Sidebar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
      <Box marginLeft={drawerOpen ? '300px' : '60px'} paddingTop='100px'>
        <Box paddingX='2rem' marginTop='1rem' className='inline_css'>
          <Box>
            <Typography variant='h4'>{projectPages.name}</Typography>
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
                    {/* <TableCell className='talel_color'></TableCell> */}
                    <TableCell className='talel_color'>Version</TableCell>
                    <TableCell className='talel_color'>Published</TableCell>
                    <TableCell className='talel_color'>Changed by</TableCell>
                    <TableCell className='talel_color'>Status</TableCell>
                    <TableCell className='talel_color'>Comment</TableCell>
                    <TableCell align='right' className='talel_color'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ '&:last-child th, &:last-child th': { border: 0 } }}
                    className='text_black'
                  >
                    <TableCell className='talel_color text_black'>
                      <Checkbox
                        color='primary'
                        name='checkbox'
                        checked={checkedValues.includes(projectPages)}
                        onChange={() => {
                          handleCheckboxChange(projectPages)
                        }}
                      />
                      v{projectPages?.version}
                    </TableCell>
                    <TableCell className='talel_color text_black'>
                      {moment(projectPages?.publishAt).format('MMM  DD,YYYY')}
                    </TableCell>
                    <TableCell className='talel_color text_black'>
                      {findProjectId.name}
                    </TableCell>
                    <TableCell className='talel_color text_black'>
                      {'Release'.toUpperCase}
                    </TableCell>
                    <TableCell className='talel_color text_black'>
                      {projectPages?.comment}
                    </TableCell>
                    <TableCell align='right' className='talel_color text_black'>
                      <Button variant='text' onClick={() => { setRestore(index); setPopUp(true) }}>
                        Restore
                      </Button>
                      <Button
                        className='styledButton'
                        onClick={() => {
                          setOpen2(true), setPageId(projectPages._id)
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  {projetPage?.map((item, index) => {
                    return (
                      <TableRow
                        sx={{ '&:last-child th, &:last-child th': { border: 0 } }}
                        className='text_black'
                        key={item._id}
                      >
                        <TableCell className='talel_color text_black'>
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
                        <TableCell className='talel_color text_black'>
                          {moment(item?.publishAt).format('MMM  DD,YYYY')}
                        </TableCell>
                        <TableCell className='talel_color text_black'>
                          {findProjectId.name}
                        </TableCell>
                        <TableCell className='talel_color text_black'>
                          {item?.status.toUpperCase()}
                        </TableCell>
                        <TableCell className='talel_color text_black'>
                          {item?.comment}
                        </TableCell>
                        <TableCell align='right' className='talel_color text_black'>
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
                    )
                  })}
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
          {'Remove history?'}
        </DialogTitle>
        <Divider className='divider_line' />

        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text_black'>
            Are you sure you want to Remove this tailored history?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            className='styledButton'
            onClick={() => {
              deleteProcessPageTailerHistory(pageId), setOpen2(false)
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
        open={popUp}
        onClose={() => setPopUp(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='text_black'>
          {'Restore data'}
        </DialogTitle>
        <Divider className='divider_line' />
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
              restorePageHistory(restore), setPopUp(false)
            }}
          >
            Yes
          </Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={() => setPopUp(false)}>
            No
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
                      <Typography variant='h5'>v{versionVersion[0]?.version}</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      <div dangerouslySetInnerHTML={item1()} />
                      <div dangerouslySetInnerHTML={item2()} />
                      <div dangerouslySetInnerHTML={activities1()} />
                      <div dangerouslySetInnerHTML={activities2()} />
                      <div dangerouslySetInnerHTML={activities3()} />
                      <div dangerouslySetInnerHTML={activities4()} />
                      <div dangerouslySetInnerHTML={activities5()} />
                      <div dangerouslySetInnerHTML={activities6()} />
                      <div dangerouslySetInnerHTML={activities7()} />
                      <div dangerouslySetInnerHTML={activities8()} />
                      <div dangerouslySetInnerHTML={item4()} />
                      <div dangerouslySetInnerHTML={item5()} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box padding='20px' className='inner'>
                    <Box>
                      <Typography variant='h5'>v{versionVersion[1]?.version}</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      <div dangerouslySetInnerHTML={item1_1()} />
                      <div dangerouslySetInnerHTML={item2_2()} />
                      <div dangerouslySetInnerHTML={activities1_1()} />
                      <div dangerouslySetInnerHTML={activities2_2()} />
                      <div dangerouslySetInnerHTML={activities3_3()} />
                      <div dangerouslySetInnerHTML={activities4_4()} />
                      <div dangerouslySetInnerHTML={activities5_5()} />
                      <div dangerouslySetInnerHTML={activities6_6()} />
                      <div dangerouslySetInnerHTML={activities7_7()} />
                      <div dangerouslySetInnerHTML={activities8_8()} />
                      <div dangerouslySetInnerHTML={item4_4()} />
                      <div dangerouslySetInnerHTML={item5_5()} />
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
                      <Box>
                        <div dangerouslySetInnerHTML={diff_item1()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_item2()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities1()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities2()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities3()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities4()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities5()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities6()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities7()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_activities8()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_item4()} />
                      </Box>
                      <Box sx={{ padding: '10px' }}>
                        <div dangerouslySetInnerHTML={diff_item5()} />
                      </Box>
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
      {/* <Dialog
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
                      <Typography variant='h5'>v{checkedValues[0]?.version > checkedValues[1]?.version   ? checkedValues[1]?.version : checkedValues[0]?.version}</Typography>
                    </Box>
                    <Divider className='divider_line' />
                    <Box>
                      <Box>
                        {checkedValues[0]?.version > checkedValues[1]?.version ? <div dangerouslySetInnerHTML={secondHtml()} /> : <div dangerouslySetInnerHTML={firstHtml()} />}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box padding='20px' className='inner'>
                    <Box>
                      <Typography variant='h5'>v{checkedValues[0]?.version > checkedValues[1]?.version  ? checkedValues[0]?.version : checkedValues[1]?.version || '1.0'}</Typography>
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
      </Dialog> */}
    </Box>
  )
}
ProcessPageTailerHistory.getLayout = page => <BlankLayout>{page}</BlankLayout>

ProcessPageTailerHistory.acl = {
  subject: 'both'
}

export default ProcessPageTailerHistory
