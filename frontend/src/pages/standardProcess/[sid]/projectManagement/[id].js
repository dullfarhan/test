import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Editor from 'src/pages/processes/[pid]/[sid]/Editor';
import { useCallback } from 'react';
import 'react-medium-image-zoom/dist/styles.css'

// import activeDiagram from '../../../assest/carspice/activeDiagram.png'
import Image from 'next/image';
import {
    Button, Dialog, DialogContent,
    DialogContentText, DialogTitle, Grid,
    Input,
    InputLabel, MenuItem, Select, Table,
    TableBody, TableCell, TextField, TextareaAutosize, styled
} from '@mui/material';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import Request from 'src/configs/axiosRequest';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { RiErrorWarningLine } from 'react-icons/ri';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import Sidebar from '../sidebar';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import Header from 'src/pages/header';
import BasicHeader from 'src/pages/basicheader';
import AdminHeader from 'src/pages/adminheader';

const drawerWidth = 300;

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ProjectManagement = () => {
    const router = useRouter()
    const requestApiData = new Request()
    const [isZoomed, setIsZoomed] = useState(false)
    const [open, setOpen] = useState(true)
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [editor, setEditor] = useState(false)
    const [publish, setPublish] = useState(false)
    const [projectId, setProjectId] = useState([])
    const [pageHistory, setPageHistory] = useState([])
    const [fullWidth, setFullWidth] = React.useState(true);
    const [tailoringExample, setTailoringExample] = useState(false)
    const [tailoringExampleData, setTailoringExampleData] = useState('')
    const [bestPractices, setBestPractices] = useState(false)
    const [bestPracticesData, setBestPracticesData] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [projects, setProjects] = useState({})
    const [projectPage, setProjectPage] = useState({})
    const [pageTailorData, setPageTailorData] = useState({})
    const [updateDescription, setUpdateDescription] = useState([])
    const [standardProcessRelease, setStandardProcessRelease] = useState({})
    const [standardProcessReleaseVersion, setStandardProcessReleaseVersion] = useState({})

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    const { query } = useRouter()
    const id = query.id

    const getOneProcessItem = () => {
        requestApiData.getOneProcessPage(id).then(res => setProjectPage(res.data)).catch(err => {
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
            getOneProcessItem()
        }
        setEditor(false)
    }, [id])



    const project = () => {
        requestApiData.searchProject().then(res => setProjectId(res.data)).catch(err => {
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
        })
    }

    const getAllHistory = () => {
        const payload = {
            processPage: query.id
        }

        requestApiData.getProcessPageHistory(payload)
            .then(res => {
                const last_element = res.data.findLast((item) => true);
                setPageHistory(last_element)
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

    console.log(pageHistory, 'pagw');

    const getStandardProcessRelease = () => {
        requestApiData.getStandardProcessRelease().then(res => {
            const last_element = res.data.findLast((item) => true);
            const data = last_element.processPage.filter(page => page.id === query.id)
            setStandardProcessRelease(data)
            setStandardProcessReleaseVersion(last_element)
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
        project()
        getAllHistory()
        getStandardProcessRelease()
        setPageTailorData([])
    }, [query.id])

    const updateEditorState = (val) => {
        pageTailorData[val?.id] = val?.data
        setPageTailorData(pageTailorData)
    };

    const findProjectId = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {
        if (pageHistory?.update_description?.length > 0) {
            setUpdateDescription(pageHistory?.update_description)
        } else {
            setUpdateDescription(projectPage?.main_description)
        }
    }, [projectPage, pageHistory])

    const { values, handleSubmit, handleBlur, handleChange, touched, errors } = useFormik({
        initialValues: {
            comment: '',
            status: '',
            version: 'minor',
        },
        onSubmit: (values, { resetForm }) => {
            let newVersion = pageHistory?.version < standardProcessRelease[0]?.version ? standardProcessRelease[0]?.version : pageHistory ? pageHistory?.version : '1.0'
            const versionArr = newVersion?.split('.')
            if (versionArr?.length > 0 && values.version === 'minor') {
                if (parseInt(versionArr[1]) === 99) {
                    newVersion = `${parseInt(versionArr[0]) + 1}.00`
                } else {
                    newVersion = `${versionArr[0]}.${parseInt(versionArr[1]) + 1}`
                }
            } else if (versionArr?.length > 0 && values.version === 'major') {
                newVersion = `${parseInt(versionArr[0]) + 1}.0`
            }


        
            const updatedDesc = projectPage?.main_description ? projectPage.main_description.map((item) => {
                if (item?.subitem?.length > 0) {

                    const updatedSubDesc = item?.subitem?.map((subItem) => {
                        if (pageTailorData[item.id + '_' + subItem.id]) {
                            return { ...subItem, data: pageTailorData[item.id + '_' + subItem.id] }
                        }
                      
                    })

                    return { ...item, subitem: updatedSubDesc }
                }
                if (pageTailorData[item.id]) {
                    return { ...item, data: pageTailorData[item.id] }
                }


            }) : pageHistory.update_description.map((item) => {
                if (item?.subitem?.length > 0) {

                    const updatedSubDesc = item?.subitem?.map((subItem) => {
                        if (pageTailorData[item.id + '_' + subItem.id]) {
                            return { ...subItem, data: pageTailorData[item.id + '_' + subItem.id] }
                        }
                      
                    })

                    return { ...item, subitem: updatedSubDesc }
                }
                if (pageTailorData[item.id]) {
                    return { ...item, data: pageTailorData[item.id] }
                }


            }) 


            const payload = {
                version: newVersion,
                update_description: updatedDesc,
                comment: values.comment,
                status: values.status,
                changeBy: findProjectId?.id,
                processPage: projectPage._id
            }
            resetForm({ values: '' })
            requestApiData.createProcessPageHistory(payload).then(res => {
                toast.success("Publish Successfully")
                setOpen(false)
                setPublish(false)
                setEditor(false)
                getAllHistory()
            }
            ).catch(err => {
                if (err.response?.data?.status === 401) {
                    toast.error(err.response?.data?.statusText)
                    console.log(err)
                } else {
                    console.log(err)
                }
            })
        }
    })

    const handleTailoringExample = (data) => {
        setTailoringExampleData(data)
        setTailoringExample(data)
    }

    const handleBestPractices = (data) => {
        setBestPracticesData(data)
        setBestPractices(data)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {
                findProjectId?.role === "carniqUser" ? <Header /> : findProjectId?.role === "admin" ? <AdminHeader /> : <BasicHeader />
            }
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <StyledDialog
                    open={publish}
                    fullWidth={fullWidth}
                    maxWidth='lg'
                    onClose={() => setPublish(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <form onSubmit={handleSubmit}>
                        <DialogTitle id="alert-dialog-title" className='text_black inline_css' >
                            <Typography className='publish'>Publish with version comment</Typography>
                            <Button className='styledButton' type='submit'>Publish</Button>
                        </DialogTitle>
                        <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid black' }} />
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" className='text_black' component={'div'}>
                                <Grid container spacing={10}>
                                    <Grid item xs={6}>
                                        <div>
                                            <InputLabel className='input_lable'>Description</InputLabel>
                                            <TextField
                                                placeholder="What is changed?"
                                                multiline
                                                value={values.comment}
                                                onChange={handleChange}
                                                name='comment'
                                                rows={7}
                                                className='inputFild'
                                                style={{ width: '100%', border: 0 }}
                                            />
                                            {/* <TextareaAutosize
                                                aria-label="empty textarea"
                                                placeholder="What is changed?"
                                                name='comment'
                                                className='inputFild'
                                                style={{ width: '100%', padding: '1rem .5rem', height: '165px' }}
                                                value={values.comment}
                                                onChange={handleChange}
                                            /> */}
                                            <Typography fontSize='12px'>Please write short paragraph about the changes in this plublish.</Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div>
                                            <InputLabel htmlFor='version' className='input_lable'>
                                                Version  <span>*</span>
                                            </InputLabel>
                                            {/* <Select
                                                value={values.version}
                                                onChange={handleChange}
                                                name='version'
                                                className='select_input'
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value=''>Select</MenuItem>
                                                <MenuItem value='minor'>Minor</MenuItem>
                                                <MenuItem value='major'>Major</MenuItem>
                                            </Select> */}
                                            <Input placeholder='Minor' className='inputFild' style={{ color: 'black' }} disabled />
                                            <Typography fontSize='12px'>Select the major or minor from the drop down.</Typography>
                                            {/* {errors.role && touched.role ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.role}</FormHelperText > : ''} */}
                                        </div>
                                        <div>
                                            <InputLabel htmlFor='status' className='input_lable'>
                                                Status  <span>*</span>
                                            </InputLabel>
                                            <Select
                                                value={values.status}
                                                onChange={handleChange}
                                                name='status'
                                                className='select_input'
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value=''>Select</MenuItem>
                                                <MenuItem value='Draft'>Draft</MenuItem>
                                                <MenuItem value='In Review'>In Review</MenuItem>
                                                {/* <MenuItem value='release'>Release</MenuItem> */}

                                            </Select>
                                            <Typography fontSize='12px'>Select the status from drop down</Typography>
                                            {/* {errors.role && touched.role ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.role}</FormHelperText > : ''} */}
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
                <Box className='inline_css'>
                    <Box >
                        <Typography fontSize='24px' id="first" className='input_lable'>{projectPage.name}</Typography>
                    </Box>
                    <Box>
                        {
                            findProjectId.role === "carniqUser" ? (
                                <>
                                    <Button className='styledButton' onClick={() => setPublish(true)} >Publish</Button>
                                    <Button className='styledButton' onClick={() => router.push(`/standardProcess/${query.sid}/pagehistory/${id}`)}>History</Button>
                                    <Button className='styledButton' onClick={() => { setEditor(!editor); }}>{editor ? "Back" : "Edit"}</Button>
                                </>
                            ) : ("")
                        }

                    </Box>
                </Box>
                <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
                <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-offset="0" tabIndex="0" style={{ padding: '0 20px' }}>
                    <div>
                        <Table className='main_table'>
                            <TableBody>
                                <tr>
                                    <th className='table_head'>Date</th>
                                    <td className='table_data'>{moment(pageHistory?.publishAt).format('DD.MM.YYYY')}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'>Status</th>
                                    <td className='table_data'>{standardProcessRelease[0]?.version > pageHistory?.version ? standardProcessReleaseVersion.releaseStatus : pageHistory ? pageHistory?.status : 'Release'}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'>Version</th>
                                    <td className='table_data'>v{standardProcessRelease[0]?.version > pageHistory?.version ? standardProcessRelease[0]?.version : pageHistory ? pageHistory?.version : '1.0'}</td>
                                </tr>
                                {/* <tr>
                                    <th className='table_head'>Last Released Version</th>
                                    <td className='table_data'>v{standardProcessRelease[0]?.version ? standardProcessRelease[0].version : '1.0'}</td>
                                </tr> */}
                            </TableBody>
                        </Table>
                    </div>
                    {updateDescription && updateDescription.map((item, itemIndex) => (
                        <div id={itemIndex} style={{ marginTop: '2rem' }} className='process_table' key={itemIndex}>
                            <Box>
                                {editor ? (
                                    <>
                                        <Typography variant='h6' className='input_lable'>{item?.name}</Typography>
                                        <Grid container>
                                            <Grid item xs={10}>
                                                <Box mt='1rem' key={itemIndex}>
                                                    <Editor Id={item.id} handleChangeMessage={updateEditorState}
                                                        message={(pageTailorData && pageTailorData[item.id]) || (item.data)}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                {
                                                    item.tailoringExample ?
                                                        <Button onClick={() => handleTailoringExample(item.tailoringExample)}>
                                                            <RiErrorWarningLine size={40} color='#4169E1' />
                                                        </Button> : ''
                                                }
                                                <br />
                                                {
                                                    item.bestPractices ?
                                                        <Button onClick={() => handleBestPractices(item.bestPractices)}>
                                                            <HiOutlineCheckCircle size={40} color='green' />
                                                        </Button> : ''
                                                }
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : <Box sx={{ maxHeight: '50rem', overflow: 'auto' }}>
                                    <Typography variant='h6' className='input_lable'>{item?.name}</Typography>
                                    {item?.data && <div dangerouslySetInnerHTML={{ __html: item?.data }} />}
                                </Box>}


                                {item.subitem?.length > 0 ?
                                    item.subitem?.map((subItem, subItemIndex) => (
                                        <div id={itemIndex + '' + subItemIndex} key={subItemIndex}>
                                            <Box>
                                                {editor ?
                                                    <>
                                                        <Typography variant='h6' className='input_lable'>{subItem.name}</Typography>
                                                        <Grid container>
                                                            <Grid item xs={10}>
                                                                <Box mt='1rem' key={itemIndex}>
                                                                    <Editor Id={item.id + '_' + subItem.id} handleChangeMessage={updateEditorState}
                                                                        message={(pageTailorData && pageTailorData[item.id + '_' + subItem.id]) || (subItem.data)}
                                                                    />
                                                                </Box>

                                                            </Grid>
                                                            <Grid item>
                                                                {
                                                                    subItem.tailoringExample ?
                                                                        <Button onClick={() => handleTailoringExample(subItem.tailoringExample)}>
                                                                            <RiErrorWarningLine size={40} color='#4169E1' />
                                                                        </Button> : ''
                                                                }
                                                                <br />
                                                                {
                                                                    subItem.bestPractices ?
                                                                        <Button onClick={() => handleBestPractices(subItem.bestPractices)}>
                                                                            <HiOutlineCheckCircle size={40} color='green' />
                                                                        </Button> : ''
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                    :
                                                    <Box sx={{ maxHeight: '50rem', overflow: 'auto' }}>
                                                        <Typography variant='h6' className='input_lable'>{subItem.name}</Typography>
                                                        {subItem?.data && <div dangerouslySetInnerHTML={{ __html: subItem?.data }} />}
                                                    </Box>
                                                }

                                            </Box>
                                        </div>
                                    ))
                                    : ''
                                }
                            </Box>
                        </div>
                    ))}
                </div>
            </Box>

            {/* Tailoring Example Modal */}
            <StyledDialog
                open={tailoringExample}
                onClose={() => setTailoringExample(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ backgroundColor: '#DEEBFF' }}>
                    <DialogTitle id="alert-dialog-title" color='#172B4D' fontWeight='700' fontSize='14px'>
                        {"Tailoring Example"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" color='#172B4D' fontSize='14px'>
                            {tailoringExampleData && <div dangerouslySetInnerHTML={{ __html: tailoringExampleData }} />}
                        </DialogContentText>
                    </DialogContent>
                </Box>
            </StyledDialog>

            {/* Best Practices Modal */}
            <StyledDialog
                open={bestPractices}
                onClose={() => setBestPractices(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ backgroundColor: '#E3FCEF' }}>
                    <DialogTitle id="alert-dialog-title" color='#172B4D' fontWeight='700' fontSize='14px'>
                        {"Best Practices"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" color='#172B4D' fontSize='14px'>
                            {bestPracticesData && <div dangerouslySetInnerHTML={{ __html: bestPracticesData }} />}
                        </DialogContentText>
                    </DialogContent>
                </Box>
            </StyledDialog>
        </Box >
    )
}

ProjectManagement.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
ProjectManagement.acl = {
    subject: 'both'
}

export default ProjectManagement