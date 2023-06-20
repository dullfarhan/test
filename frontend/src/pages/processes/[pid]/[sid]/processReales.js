import React, { Fragment } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Sidebar from './sidebar'
import {
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
  Input
} from '@mui/material'
import Request from 'src/configs/axiosRequest'
import { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import BasicHeader from 'src/pages/basicheader'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

// import Editor from './Editor';
import moment from 'moment'
import AdminHeader from 'src/pages/adminheader'
import { useRouter } from 'next/router'

// ** Context
import useName from 'src/hooks/useName'

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#DEEBFF',
    color: '#252B42',
    borderRadius: 0,
    border: '1px solid #A9A9A9',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    border: '1px solid #A9A9A9',
    textAlign: 'center',
    color: '#252B42',
    backgroundColor: 'transprent',
    fontWeight: '700'
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F5F5F5'
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#D3D3D3'
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: '1px solid #A9A9A9'
  }
}))

const ProcessReales = () => {
  const drawerWidth = 300
  const { query } = useRouter()
  const requestApiData = new Request()
  const [processPageData, setProcessPageData] = useState([])
  const [processPageHistory, setProcessPageHistory] = useState([])
  const [tailerProcessRelease, setTailerProcessRelease] = useState([])
  const [tailerProcessReleaseBy, setTailerProcessReleaseBy] = useState([])
  const [open, setOpen] = useState(true)
  const [publish, setPublish] = useState(false)
  const [version, setVersion] = useState('')
  const [tailerversion, setTailerVersion] = useState('')
  const [processId, setProcessId] = useState('')
  const [history, setHistory] = useState([])
  const [pageHistory, setPageHistory] = useState([])

  // const [projectPage, setProjectPage] = useState([])

  // const [history, setHistory] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [user, setUser] = useState([])

  const [fullWidth, setFullWidth] = React.useState(true)
  const [standardProcess, setStandardProcess] = useState([])
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const [processRealesVal, setProcessRealesVal] = useState([])

  const { getUserName } = useName()

  const findProjectId = JSON.parse(localStorage.getItem('userData'))
  const router = useRouter()

  //For second table
  const getProcessPageData = () => {
    const payload = {
      project: query.pid
    }
    requestApiData
      .getStandardProcessTailerVersion(payload)
      .then(res => {
        const data = res.data.filter(item => item._id === query.sid)
        setStandardProcess(data[0])

        const standardProcessRealesInit = {
          id: data[0]?._id,
          name: data[0]?.name ? data[0].name : '-',
          version: data[0]?.history[0] ? data[0].history[0] : '1.0',
          status: data[0]?.status[0] ? data[0]?.status[0] : '',
          reviewedBy: findProjectId.name,
          Correctness: false,
          Completeness: false,
          Consistency: false,
          Understandability: false,
          Maintainability: false,
          finding: 'None',
          counter_measures: 'None',
          final_verdict: 'Completely Fulfilled',
          createdAt  : moment(data[0].createdAt).format('MM-DD-YYYY')
        }

        requestApiData
          .getProcessPageByTailerVersion(payload)
          .then(res => {
            const data = res.data.filter(item => item.standardProcess === query.sid)
            setProcessPageData(data)

            //create processRealesVal varible
            const processRealesInit =
              data?.length > 0 &&
              data.map((item, id) => {
                return {
                  id: item._id,
                  name: item.name ? item.name : '-',
                  version: item.history[0] ? item.history[0] : '1.0',
                  status: item?.status[0] ? item?.status[0] : '',
                  reviewedBy: findProjectId.name,
                  Correctness: false,
                  Completeness: false,
                  Consistency: false,
                  Understandability: false,
                  Maintainability: false,
                  finding: 'None',
                  counter_measures: 'None',
                  final_verdict: 'Completely Fulfilled',
                  createdAt  : moment(data[0].createdAt).format('MM-DD-YYYY')
                }
              })
            processRealesInit?.unshift(standardProcessRealesInit)
            setProcessRealesVal(processRealesInit)
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

  //For first table
  const getTailerProcessRelease = () => {
    const payload = {
      project: query.pid
    }
    requestApiData
      .getProcessRelease(payload)
      .then(res => {
        const last_element = res.data.findLast(item => true)
        setTailerProcessRelease(last_element)

        // getUserName(last_element.releasedBy).then(function (result) {
        //   setTailerProcessReleaseBy(result)
        // })
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

  const standardProcessHistory = () => {
    const payload = {
      standardProcess: query.sid
    }
    requestApiData
      .getStandardProcessTailerHistory(payload)
      .then(res => {
        const last_element = res.data.findLast(item => true)
        setHistory(last_element)
      })
      .catch(err => console.log(err))
  }

  const getUser = () => {
    const payload = {
      role: ['admin', 'basic']
    }
    requestApiData
      .getUser(payload)
      .then(res => setUser(res.data))
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
    getProcessPageData()
    getTailerProcessRelease()
    getUser()
    standardProcessHistory()
  }, [findProjectId.id, query.pid])

  const processRealesChange = (e, i) => {
    const { value, name, checked } = e.target

    const newState = [...processRealesVal]

    newState[i] = {
      ...newState[i],
      [name]: value
    }

    setProcessRealesVal(newState)
  }

  const processRealesChecked = (e, i) => {
    const { value, name, checked } = e.target

    const newState = [...processRealesVal]

    newState[i] = {
      ...newState[i],
      [name]: checked ? true : false
    }

    setProcessRealesVal(newState)
  }

  const { values, handleSubmit, handleBlur, handleChange, touched, errors } = useFormik({
    initialValues: {
      comment: '',
      status: '',
      version: 'major'
    },
    onSubmit: (values, { resetForm }) => {
      let newVersion = tailerProcessRelease ? tailerProcessRelease?.releasedVersion : '1.0'
      const versionArr = newVersion?.split('.')

      if (versionArr?.length > 0 && values.version === 'major') {
        newVersion = `${parseInt(versionArr[0]) + 1}.0`
      }

      let newVersion1 = tailerProcessRelease ? tailerProcessRelease?.releasedVersion : '1.0'
      const versionArr1 = newVersion1?.split('.')

      if (versionArr1?.length > 0 && values.version === 'major') {
        newVersion1 = `${parseInt(versionArr[0]) + 1}.0`
      }

      processRealesVal?.forEach(item => {
        if(item.status === 'In Review') {
          let newVersion1 = item.version 
          let versionArr1 = newVersion1?.split('.')
            newVersion1 = `${parseInt(versionArr1[0]) + 1}.0`
            item.version = newVersion1
        }else if(item.status === 'Draft'){
          item.version = '1.0'
        }else{
          item.version
        }
      })

      const payload = {
        releasedVersion: newVersion,
        releaseStatus: values.status,
        releaseComment: values.comment,
        releasedBy: findProjectId?.id,
        processPage: processRealesVal,
        standardProcess: standardProcess._id,
        project: query.pid
      }

      resetForm({ values: '' })
      requestApiData
        .createProcessRelease(payload)
        .then(res => {
          setOpen(false)
          setPublish(false)
          getProcessPageData()
          getTailerProcessRelease()

          processRealesVal?.forEach(item => {
            if (item.status === 'In Review') {
              if (query.sid === item.id) {

                const payload = {
                  _id: history?._id,
                  standardProcess: query.sid,
                  project: query.pid,
                  version: item.version,
                  status: 'Release'
                }

                requestApiData
                  .updateStandardProcessTailerHistory(payload)
                  .then(res => {
                    standardProcessHistory()
                    getProcessPageData()
                  })
                  .catch(err => {
                    if (err.response?.data?.status === 401) {
                      toast.error(err.response?.data?.statusText)
                      console.log(err)
                    } else {
                      console.log(err)
                    }
                  })
              } else {
                const payload = {
                  processPage: item.id
                }

                requestApiData
                  .getProcessPageTailerHistory(payload)
                  .then(res => {
                    const last_element = res.data.findLast(item => true)

                    const payload1 = {
                      _id: last_element._id,
                      version: item.version,
                      status: 'Release'
                    }
                    requestApiData
                      .updateProcessPageTailerHistory(payload1)
                      .then(res => {
                        getProcessPageData()
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
                  .catch(err => console.log(err))
              }
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
  })

  return (
    <Box sx={{ display: 'flex' }}>
      {findProjectId?.role === 'admin' ? <AdminHeader /> : <BasicHeader />}
      <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label='mailbox folders'>
        <StyledDialog
          open={publish}
          maxWidth='lg'
          fullWidth={fullWidth}
          onClose={() => setPublish(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle id='alert-dialog-title' color='black' className='inline_css'>
              <Typography color='#000000' fontSize='20px' fontWeight='700'>
                Publish with version comment
              </Typography>
              <Button className='styledButton' type='submit'>
                Publish
              </Button>
            </DialogTitle>
            <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid black' }} />
            <DialogContent>
              <DialogContentText id='alert-dialog-description' color='black' component={'div'}>
                <Grid container spacing={10}>
                  <Grid item xs={6}>
                    <div>
                      <InputLabel className='input_lable'>Description</InputLabel>
                      <TextField
                        placeholder='What is changed?'
                        multiline
                        name='comment'
                        value={values.comment}
                        onChange={handleChange}
                        className='inputFild'
                        rows={6}
                        style={{ width: '100%', border: 0 }}
                      />
                      <Typography fontSize='12px'>
                        Please write short paragraph about the changes in this publish.
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <InputLabel htmlFor='version' className='input_lable'>
                        Version <span>*</span>
                      </InputLabel>
                      <Input className='inputFild' style={{ color: 'black' }} placeholder='Major' disabled />
                      <Typography fontSize='12px'>Select the major or minor from the drop down.</Typography>
                    </div>
                    <div>
                      <InputLabel htmlFor='status' className='input_lable'>
                        Status <span>*</span>
                      </InputLabel>
                      <Select
                        value={values.status}
                        onChange={handleChange}
                        name='status'
                        style={{
                          width: '100%',
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #C0C0C0',
                          borderRadius: '5px',
                          marginBottom: '1rem'
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value=''>Select</MenuItem>
                          <MenuItem value='Release'>Release</MenuItem>
                      </Select>
                      <Typography fontSize='12px'>Select the status from drop down</Typography>
                    </div>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
          </form>
        </StyledDialog>
        <Sidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      </Box>
      <Box className={drawerOpen ? 'show' : 'hide'} width='100%'>
        <Box display='flex' justifyContent='space-between'>
          <Box>
            <Typography fontSize='24px' id='first' className='input_lable'>
              Process Release
            </Typography>
          </Box>
          <Box>
            <Button className='styledButton' onClick={() => setPublish(true)}>
              Publish
            </Button>
            <Button
              className='styledButton'
              onClick={() => router.push(`/processes/${query.pid}/${query.sid}/processRealesHistory`)}
            >
              History
            </Button>
          </Box>
        </Box>
        <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
        <Box>
          <div>
            <Table className='main_table'>
              <TableBody>
                <tr>
                  <th className='table_head'>Date</th>
                  <td className='table_data'>{moment(tailerProcessRelease?.releaseDate).format('DD-MM-YYYY')}</td>
                </tr>
                <tr>
                  <th className='table_head'>Status</th>
                  <td className='table_data'>
                    {tailerProcessRelease ? tailerProcessRelease.releaseStatus : 'Release'}
                  </td>
                </tr>
                <tr>
                  <th className='table_head'>Version</th>
                  <td className='table_data'>{tailerProcessRelease ? tailerProcessRelease?.releasedVersion : '1.0'}</td>
                </tr>
              </TableBody>
            </Table>
          </div>
          <div>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
              <Table sx={{ mt: '3rem', maxWidth: 900 }} aria-label='customized table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Process</StyledTableCell>
                    <StyledTableCell>Version Number</StyledTableCell>
                    <StyledTableCell>Release Status</StyledTableCell>
                    <StyledTableCell>Release Date</StyledTableCell>
                    <StyledTableCell>Released By</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {tailerProcessRelease?.processPage?.length > 0 ?
                    tailerProcessRelease?.processPage.map((item, id) => (
                      <Fragment key={id}>
                        <TableRow>
                          <StyledTableCell>{item.name ? item.name : '-'}</StyledTableCell>
                          <StyledTableCell>{tailerProcessRelease ? item?.version : '1.0'}</StyledTableCell>
                          <StyledTableCell>
                            {tailerProcessRelease ? tailerProcessRelease?.releaseStatus : 'Release'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {moment(tailerProcessRelease?.releaseDate).format('DD-MM-YYYY')}
                          </StyledTableCell>
                          <StyledTableCell>{findProjectId.name}</StyledTableCell>
                        </TableRow>
                      </Fragment>
                    )) : 
                    processRealesVal.map((item,id) => (
                      <Fragment key={id}>
                      <TableRow>
                        <StyledTableCell>{item.name}</StyledTableCell>
                        <StyledTableCell> 1.0</StyledTableCell>
                        <StyledTableCell>
                          Release
                        </StyledTableCell>
                        <StyledTableCell>
                        {moment(item?.createdAt).format('DD-MM-YYYY')}
                        </StyledTableCell>
                        <StyledTableCell>{findProjectId.name}</StyledTableCell>
                      </TableRow>
                    </Fragment>
                    )) }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
              <Table sx={{ mt: '3rem', minWidth: 900 }} aria-label='customized table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Process</StyledTableCell>
                    <StyledTableCell>Version Number</StyledTableCell>
                    <StyledTableCell>Reviewed By</StyledTableCell>
                    <StyledTableCell>Correctness</StyledTableCell>
                    <StyledTableCell>Finding</StyledTableCell>
                    <StyledTableCell>Counter Measures</StyledTableCell>
                    <StyledTableCell>Final Verdict</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {processRealesVal.length > 0 &&
                    processRealesVal?.map((item, index) => (
                      <Fragment key={index}>
                        {item.status === 'In Review' ? (
                          <StyledTableRow>
                            <StyledTableCell>{item?.name}</StyledTableCell>
                            <StyledTableCell>{item.version}</StyledTableCell>
                            <StyledTableCell>
                              {/* <Select
                                value={item.reviewedBy}
                                name='reviewedBy'
                                onChange={e => processRealesChange(e, index)}
                                style={{
                                  width: '100%',
                                  backgroundColor: '#F5F5F5',
                                  border: '1px solid #C0C0C0',
                                  borderRadius: '5px',
                                  marginBottom: '1rem'
                                }}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {user.map((item1, index1) => (
                                  <MenuItem value={item1.fullName} key={index1}>
                                    {item1.fullName}
                                  </MenuItem>
                                ))}
                              </Select> */}
                              {findProjectId.name}
                            </StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'start' }}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name='Correctness'
                                      checked={item.Correctness}
                                      onChange={e => processRealesChecked(e, index)}
                                    />
                                  }
                                  label='Correctness'
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name='Completeness'
                                      checked={item.Completeness}
                                      onChange={e => processRealesChecked(e, index)}
                                    />
                                  }
                                  label='Completeness'
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name='Consistency'
                                      checked={item.Consistency}
                                      onChange={e => processRealesChecked(e, index)}
                                    />
                                  }
                                  label='Consistency'
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name='Understandability'
                                      checked={item.Understandability}
                                      onChange={e => processRealesChecked(e, index)}
                                    />
                                  }
                                  label='Understandability'
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name='Maintainability'
                                      checked={item.Maintainability}
                                      onChange={e => processRealesChecked(e, index)}
                                    />
                                  }
                                  label='Maintainability'
                                />
                              </FormGroup>
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextareaAutosize
                                minRows={10}
                                name='finding'
                                value={item.finding === 'None' ? '' : item.finding}
                                onChange={e => processRealesChange(e, index)}
                                placeholder='None'
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <TextareaAutosize
                                minRows={10}
                                name='counter_measures'
                                value={item.counter_measures === 'None' ? '' : item.counter_measures}
                                onChange={e => processRealesChange(e, index)}
                                placeholder='None'
                              />
                            </StyledTableCell>
                            <StyledTableCell>
                              <Select
                                value={item.final_verdict}
                                name='final_verdict'
                                onChange={e => processRealesChange(e, index)}
                                style={{
                                  width: '100%',
                                  backgroundColor: '#F5F5F5',
                                  border: '1px solid #C0C0C0',
                                  borderRadius: '5px',
                                  marginBottom: '1rem'
                                }}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                              >
                                {[
                                  'Completely Fulfilled',
                                  'Majorly Fulfilled',
                                  'Minorly Fulfilled',
                                  'Not Fulfilled'
                                ].map((item1, index1) => (
                                  <MenuItem value={item1} key={index1}>
                                    {item1}
                                  </MenuItem>
                                ))}
                              </Select>
                              {/* <TextareaAutosize minRows={10} name='final_verdict' value={item.final_verdict} onChange={(e) => processRealesChange(e, index)} /> */}
                            </StyledTableCell>
                          </StyledTableRow>
                        ) : (
                          ''
                        )}
                      </Fragment>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Box>
    </Box>
  )
}

ProcessReales.getLayout = page => <BlankLayout>{page}</BlankLayout>
ProcessReales.acl = {
  subject: 'both'
}

export default ProcessReales
