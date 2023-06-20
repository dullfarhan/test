import { Box } from '@mui/system'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import BasicHeader from 'src/pages/basicheader'
import Sidebar from '../sidebar'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormHelperText,
  Input,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import BackupIcon from '@mui/icons-material/Backup'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Request from 'src/configs/axiosRequest'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { toast } from 'react-hot-toast'
import { RequestQuote } from '@mui/icons-material'
import { useEffect } from 'react'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import FileSaver, { saveAs } from 'file-saver'
import moment from 'moment'
import AdminHeader from 'src/pages/adminheader'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const Templates = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedfile, SetSelectedFile] = useState([])
  const [tailerTemplate, SetTailerTemplate] = useState([])
  const [tailerTemplateProject, SetTailerTemplateProject] = useState([])
  const [standardTemplates, SetStandardTemplates] = useState([])
  const [project, setProject] = useState([])
  const requestApiData = new Request()
  const createdBy = JSON.parse(localStorage.getItem('userData'))
  const [templateId, setTemplateId] = useState('')
  const [fName, setFName] = useState('')
  const [open2, setOpen2] = useState(false)
  const [label, setLabel] = useState('')
  const { query } = useRouter()

  const [file, setFile] = useState('')

  const getProject = () => {
    requestApiData
      .getProject()
      .then(res => {
        setProject(res.data)
      })
      .catch(err => {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const AllTailerTemplate = () => {
    requestApiData
      .getAllTailerTemplate()
      .then(res => {
        const data = res.data.filter(item => item.project === query.pid)
        SetTailerTemplate(data)
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
    AllTailerTemplate()
  }, [query.pid])

  const StandardTemplates = () => {
    const payload = {
      standardProcess: query.sid
    }
    requestApiData
      .getStandardTemplates(payload)
      .then(res => {

        SetStandardTemplates(res.data)
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
    StandardTemplates()
  }, [query.sid])

  const DeleteSelectFile = id => {
    const result = selectedfile.filter(data => data.id !== id)
    SetSelectedFile(result)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  //delete tailerTemplate
  const deleteTailerTemplate = id => {
    requestApiData
      .deleteTailerTemplate(id)
      .then(res => {
        if (res?.status === 200) {
          AllTailerTemplate()
          setOpen2(false)
          toast.success('delet Successfully')
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
  }

  // download one file
  const oneFileDownload = (id, label) => {

    const urls = []
    tailerTemplate?.filter(itm => itm._id === id).map(data => {
      data?.version?.map(url => urls.push(url.fileURL))
    })
    const zip = new JSZip()
    let count = 0

    const zipName = label.split('.')

    const zipFilename = `${zipName[0]}.zip`

    urls.forEach(async function (url,i) {
      const urlArr = url.split('/public\\')
      const filename = `version${i}_${urlArr[1].slice(37)}`
      try {
        const file = await JSZipUtils.getBinaryContent(url)
        zip.file(filename, file, { binary: true })
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  // download one history file
  const oneFileHistoryDownload = (url, label, versionNo) => {
    // const url = id?.split('\\')
    // console.log( url   , 'ddddddddddd');
    FileSaver.saveAs(url, `${label}${`version_${versionNo}`}`)
  }

  const fileDownloadST1 = () => {
    const urls = []
    standardTemplates.map(item => {
      item.version.map(url => urls.push(url.fileURL))
    })

    const zip = new JSZip()
    let count = 0
    const zipFilename = 'StandardTemplates.Zip'
    urls.forEach(async function (url,i) {
      const urlArr = url.split('/public\\')
      const filename = `version${i}_${urlArr[1].slice(37)}`
      try {
        const file = await JSZipUtils.getBinaryContent(url)
        zip.file(filename, file, { binary: true })
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  // download one file st
  const oneFileDownloadST = id => {

    // const data = standardTemplates.map(item => item.version[item.version.length - 1])
    // console.log(data)
    const url = id.split('\\')

    FileSaver.saveAs(id, `${url[1]}`)

  }

  // download All tailerTemplate
  const fileDownload = () => {
    const urls = []

    const data = tailerTemplate.map(item => item?.version.map(url =>urls.push(url.fileURL) ))

   

    // tailerTemplate.map(item => {
 
    //   urls.push(item.fileURL)
    // })

    const zip = new JSZip()
    let count = 0
    const zipFilename = 'tailerTemplate.zip'
    urls.forEach(async function (url,i) {
      const urlArr = url.split('/public\\')
      const filename = `version${i}_${urlArr[1].slice(37)}`
      try {
        const file = await JSZipUtils.getBinaryContent(url)
        zip.file(filename, file, { binary: true })
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  // download All tailerTemplate
  const fileDownloadST = (id, label) => {
    const urls = []
    standardTemplates?.filter(itm => itm._id === label).map(data => {
      data?.version?.map(url => urls.push(url.fileURL))
    })

    const zip = new JSZip()
    const zipName = id.split('.')

    let count = 0
    const zipFilename = `${zipName[0]}.zip`

    urls.forEach(async function (url,i) {
      const urlArr = url.split('/public\\')
      const filename = `version${i}_${urlArr[1].slice(37)}`
      try {
        const file = await JSZipUtils.getBinaryContent(url)
        zip.file(filename, file, { binary: true })
        count++
        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  //standardTemplatesSearch
  const standardTemplatesSearch = e => {
    const label = e.target.value
    requestApiData
      .searchStandardTemplates(label)
      .then(res => {
        if (res?.status === 200) {
          const data = res.data.filter(item => item.standardProcess === query.sid)
          SetStandardTemplates(data)
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
  }

  //search tailerTemplate
  const searchTailerTemplate = e => {
    const label = e.target.value
    requestApiData
      .searchTailerTemplate(label)
      .then(res => {
        if (res?.status === 200) {
          const data = res.data.filter(item => item.project === query.pid)
          SetTailerTemplate(data)
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
  }


  const setimgfile = e => {
    SetSelectedFile([e.target.files[0]])
    setFile(e.target.files[0])
  }

  const TH = tailerTemplate?.filter(item => item.label === file?.name)
  const lable = TH[0]?.label
  const teplateId = TH[0]?._id

  const addUserData = async e => {
    e.preventDefault()

    var formData = new FormData()
    formData.append('fileURL', file)
    formData.append('label', file?.name)
    formData.append('createdBy', createdBy.name)
    formData.append('teplateId', teplateId)
    formData.append('project', query.pid)


    if (lable === file?.name) {
      requestApiData
        .updateTailerTemplate(formData)
        .then(res => {
          if (res?.status === 200) {
            AllTailerTemplate()
            toast.success(' update template  Successfully')
            handleClose()
            SetSelectedFile([])
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
          SetSelectedFile([])
          setFName('')
        })
    } else {

      requestApiData
        .createTailerTemplate(formData)
        .then(res => {
          if (res?.status === 200) {
            AllTailerTemplate()
            toast.success('template create Successfully')
            handleClose()
            SetSelectedFile([])
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
          SetSelectedFile([])
          setFName('')
        })
    }
  }

  const findProjectId = JSON.parse(localStorage.getItem('userData'))
  const findProjectAdmin = project.filter(item => item.adminId === findProjectId.id)

  return (
    <>
      {findProjectId?.role === 'admin' ? <AdminHeader /> : <BasicHeader />}

      <Sidebar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
      <Box marginLeft={drawerOpen ? '300px' : '60px'} paddingTop='100px'>
        <Box paddingX='2rem' marginTop='1rem' className='inline_css'>
          <Box>
            <Typography variant='h4'>Standard Templates</Typography>
          </Box>
          <Box>
            <Input
              type='search'
              sx={{
                bgcolor: '#F5F5F5',
                border: '1px solid #DADADA',
                padding: { lg: '5px 30px', xs: '0 10px' },
                mr: { lg: '1rem', xs: '0' },
                color: '#696969'
              }}
              style={{ borderradius: '5px' }}
              placeholder='Search'
              onChange={standardTemplatesSearch}
            />
            <Button className='styledButton' onClick={() => fileDownloadST1()}>
              Download All
            </Button>
          </Box>
        </Box>
        <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
       <Box paddingX='2rem' paddingY='4rem'>
          {standardTemplates.map((item, index) => {
            return (
              <Box className='adminHeader' key={index}>
                <Accordion sx={{ width: '100%' }}>
                  <Box aria-controls='panel1a-content' id='panel1a-header' className='inline_css'>
                    <AccordionSummary>
                      <Typography sx={{ width: '100%', flexShrink: 0, padding: '7px 20px' }}>{item.label}</Typography>
                    </AccordionSummary>
                    <Box>
                  
                      <Button variant='text' sx={{ color: '#0052CC' }} onClick={() => fileDownloadST(item.label, item._id)}>
                        Download
                      </Button>
                    </Box>
                  </Box>
                  <AccordionDetails>
                    <Box>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: '100%', paddingX: '2rem' }} aria-label='simple table'>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#D3D3D3' }}>
                              <TableCell className='talel_color'>Version</TableCell>
                              <TableCell className='talel_color' align='left'>
                                {' '}
                                Uploaded On
                              </TableCell>
                              <TableCell className='talel_color' align='left'>
                                Uploaded By
                              </TableCell>
                              <TableCell className='talel_color' align='left'></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {item.version.map((name, index) => {
                              return (
                                <Fragment key={index}>
                                  <TableRow>

                                    <TableCell align='left' className='talel_color'>{`version ${name?.versionNo}`}</TableCell>
                                    <TableCell align='left' className='talel_color'>{moment(name?.createdAt).format('DD-MM-YYYY')} </TableCell>
                                    <TableCell align='left' className='talel_color'>{name?.createdBy}</TableCell>
                                    <TableCell align='left' className='talel_color'>

                                      <Button
                                        variant='text'
                                        sx={{ color: '#0052CC' }}
                                        onClick={() => {
                                          oneFileHistoryDownload(name.fileURL, name.versionNo, item.label)
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </Fragment>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box marginLeft={drawerOpen ? '300px' : '60px'} paddingTop='100px'>
        <Box paddingX='2rem' marginTop='1rem' className='inline_css'>
          <Box>
            <Typography variant='h4'>Tailored Templates</Typography>
          </Box>
          <Box>
            <Input
              type='search'
              sx={{
                bgcolor: '#F5F5F5',
                border: '1px solid #DADADA',
                padding: { lg: '5px 30px', xs: '0 10px' },
                mr: { lg: '1rem', xs: '0' },
                color: '#696969'
              }}
              onChange={searchTailerTemplate}
              style={{ borderradius: '5px' }}
              placeholder='Search'
            />
            {findProjectAdmin?.adminId || findProjectId?.role === 'admin' ? (
              <Button className='styledButton' onClick={handleClickOpen}>
                Upload
              </Button>
            ) : (
              ''
            )}
            <Button className='styledButton' onClick={fileDownload}>
              Download All
            </Button>
          </Box>
        </Box>
        <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
        <Box paddingX='2rem' paddingY='4rem'>
          {tailerTemplate.map((item, index) => {
            return (
              <Box className='adminHeader' key={index}>
                <Accordion sx={{ width: '100%' }}>
                  <Box aria-controls='panel1a-content' id='panel1a-header' className='inline_css'>
                    <AccordionSummary>
                      <Typography sx={{ width: '100%', flexShrink: 0, padding: '7px 20px' }}>{item.label}</Typography>
                    </AccordionSummary>
                    <Box>
                      {findProjectAdmin?.adminId || findProjectId?.role === 'admin' ? (
                        <Button
                          variant='text'
                          sx={{ color: '#0052CC' }}
                          onClick={() => {
                            setOpen2(true), setTemplateId(item._id)
                          }}
                        >
                          Delete
                        </Button>
                      ) : (
                        ''
                      )}
                      <Button
                        variant='text'
                        sx={{ color: '#0052CC' }}
                        onClick={() => {
                          oneFileDownload(item._id, item.label)
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                  <AccordionDetails>
                    <Box>
                      <TableContainer component={Paper} key={index}>
                        <Table sx={{ minWidth: '100%', paddingX: '2rem' }} aria-label='simple table'>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#D3D3D3' }}>
                              <TableCell className='talel_color'>Version</TableCell>
                              <TableCell className='talel_color' align='left'>
                                Uploaded On
                              </TableCell>
                              <TableCell className='talel_color' align='left'>
                                Uploaded By{' '}
                              </TableCell>
                              <TableCell className='talel_color' align='left'></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {item?.version?.map((name, index) => {
                              return (
                                <Fragment key={index}>
                                  <TableRow>
                                    <TableCell align='left' className='talel_color'>{`version ${name?.versionNo}`}</TableCell>
                                    <TableCell align='left' className='talel_color'>{moment(name?.createdAt).format('DD-MM-YYYY')} </TableCell>
                                    <TableCell align='left' className='talel_color'>{name?.createdBy}</TableCell>
                                    <TableCell align='left' className='talel_color'>
                                      <Button
                                        variant='text'
                                        sx={{ color: '#0052CC' }}
                                        onClick={() => {
                                          oneFileHistoryDownload(name.fileURL,name?.versionNo, item.label )
                                        }}
                                      >
                                        Download
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </Fragment>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Tailored Templates'}</DialogTitle>

        <div className='container mt-3'>
          <form className='mt-3'>
            <DialogContent className='dialog_text'>
              {/* <InputLabel>Title</InputLabel>
              <input type='text' name='label' className='inputFild' required onChange={setdata} placeholder='' /> */}

              <div className='kb-data-box'>
                <div className='kb-file-upload'>
                  <div className='file-upload-box'>
                    <input
                      type='file'
                      onChange={setimgfile}
                      className='file-upload-input'
                      name='fileURL'
                      placeholder=''
                    />
                    <BackupIcon sx={{ fontSize: '40px' }} />
                  </div>
                </div>
                <Box>
                  {selectedfile.map((data, index) => {
                    const { id, name, type, fileimage, lastModifiedDate, size } = data

                    return (
                      <Box display='flex' key={index}>
                        {name.match(/.(jpg|jpeg|png|gif|svg|pdf)$/i) ? (
                          <div className='file-image'>
                            <InsertDriveFileIcon />
                          </div>
                        ) : (
                          <div className='file-image'>
                            <InsertDriveFileIcon sx={{ fontSize: '40px' }} />
                          </div>
                        )}
                        <Box>
                          <Typography variant='h6'>{name}</Typography>
                          <p>
                            <span>Size : {size}</span>
                          </p>
                          <div className='file-actions'>
                            <button type='button' className='file-action-btn' onClick={() => DeleteSelectFile(id)}>
                              Delete
                            </button>
                          </div>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </div>

              <Button type='submit' variant='contained' onClick={addUserData} className='styledButton'>
                Upload
              </Button>
              <Button
                variant='contained'
                sx={{
                  mb: 4,
                  backgroundColor: 'red',
                  margin: '.5rem .5rem',
                  boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25), inset 2px 2px 2px rgba(0, 0, 0, 0.25)'
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DialogContent>
          </form>
        </div>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' className='text_black'>
          {' Remove TailerTemplate from site?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='text_black'>
            Thay will no longer have access; and won't be able to collaborate with your team.Your products will still
            keep all of this user's contributions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' className='styledButton' onClick={() => deleteTailerTemplate(templateId)}>
            Remove Template
          </Button>
          <CancelButton
            variant='contained'
            className='cancel_btn'
            onClick={() => {
              setOpen2(false)
            }}
          >
            Cancel
          </CancelButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
Templates.getLayout = page => <BlankLayout>{page}</BlankLayout>

Templates.acl = {
  subject: 'both'
}

export default Templates
