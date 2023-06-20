import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ScrollSpy from "react-ui-scrollspy";
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Editor from '../Editor';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import { useCallback } from 'react';
import 'react-medium-image-zoom/dist/styles.css'

// import activeDiagram from '../../../assest/carspice/activeDiagram.png'
import Image from 'next/image';
import {
    Button, Dialog, DialogContent,
    DialogContentText, DialogTitle, Grid,
    Input,
    InputLabel, List, ListItemText, MenuItem, Select, Table,
    TableBody, TableCell, TableHead, TableRow, TextareaAutosize, styled, tableCellClasses
} from '@mui/material';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import Request from 'src/configs/axiosRequest';
import Link from 'next/link';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { RiErrorWarningLine } from 'react-icons/ri';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import BasicHeader from 'src/pages/basicheader';
import select from 'src/@core/theme/overrides/select';
import Sidebar from '../sidebar';
import { useRouter } from 'next/router';
import { useTheme } from 'styled-components';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import AdminHeader from 'src/pages/adminheader';

// import Sidebar from './sidebar';

const drawerWidth = 300;

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#696969',
        color: theme.palette.common.white,
        borderRadius: 0,
        border: '1px solid #A9A9A9',
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize'

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        border: '1px solid #A9A9A9',
        textAlign: 'center',
        color: '#252B42',
        fontWeight: '700'
    },
}));

const ProjectManagement = () => {
    const router = useRouter()
    const requestApiData = new Request()
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [projectData, setProjectData] = useState([])
    const [isZoomed, setIsZoomed] = useState(false)
    const [open, setOpen] = useState(true)
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [publish, setPublish] = useState(false)
    const [findProjectAdmin, setProjectId] = useState('')
    const [pageHistory, setPageHistory] = useState([])
    const [fullWidth, setFullWidth] = React.useState(true);
    const [version, setVersion] = useState('')
    const [status, setStatus] = useState('')
    const [tailoringExample, setTailoringExample] = useState(false)
    const [tailoringExampleData, setTailoringExampleData] = useState('')
    const [bestPractices, setBestPractices] = useState(false)
    const [bestPracticesData, setBestPracticesData] = useState('')
    const [editor, setEditor] = useState(false)
    const [processPageData, setProcessPageData] = useState([])
    const [processPageName, setProcessPageName] = useState({})
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [processPage, setProcessPage] = useState({})
    const [pageTailorData, setPageTailorData] = useState({})
    const [processRelease, setPocessRelease] = useState({})
    const [processReleaseVersion, setProcessReleaseVersion] = useState({})
    const [processPageTailerHistory, setProcessPageTailerHistory] = useState({})
    const [standardTailerHistory, setStandardProcessTailorHistory] = useState({})

    const { query } = useRouter()
    const id = query.projectPageId
    const pid = query.pid

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    let processPageVer = []



    const project = (pid) => {
        requestApiData.getProjectItem(pid)
            .then(res => {
                const projectData = res.data;

                //check user is admin or not -> get project admin id
                setProjectId(projectData.adminId === findProjectId.id && projectData.adminId)



                //get standard process last release version
                requestApiData.getStandardProcessRelease({ releasedVersion: projectData.processVersion, standardProcess: query.sid }).then(res => {
                    const result = res.data[0]
                    setVersion(res.data[0]?.releasedVersion)
                    setStatus(res.data[0]?.releaseStatus)

                    if (result) {
                        processPageVer = result.processPage.filter(page => page.id === id)

                        // processPageVer = processPageVer[processPageVer.length - 1]

                    }
                }).catch(err => {
                    if (err.response?.data?.status === 401) {
                        toast.error(err.response?.data?.statusText)
                        console.log(err)
                    } else {
                        console.log(err)
                    }
                })

                //get standard process data with latest history
                requestApiData.getOneProcessPage(id)
                    .then(res => {
                        let processPageData = res.data
                        setProcessPageName(res.data)
                        if (processPageVer?.length > 0) {
                            requestApiData.getProcessPageHistory({ version: processPageVer[0].version, processPage: query.projectPageId })
                                .then(res => {
                                    const last_element = res.data.findLast((item) => true);
                                    if (last_element?.update_description?.length > 0) {
                                        setProcessPage(last_element?.update_description);
                                    } else {
                                        setProcessPage(processPageData.main_description);

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

                        } else {
                            setProcessPage(processPageData.main_description)
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
            }
            )
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
        if (id && pid) {
            project(pid)
            getAllHistory()
            setPageTailorData({})
        }
    }, [pid, id])

    useEffect(() => {
        if (processPage?.main_description?.length > 0 && (!pageTailorData || Object.keys(pageTailorData).length === 0)) {
            let itemObj = {}
            processPage.main_description && processPage.main_description.map((item) => {
                if (item.name !== 'Tailoring Guidelines') {
                    if (item.subitem?.length > 0) {
                        item.subitem.map((subItem) => {
                            itemObj[item.id + '_' + subItem.id] = ''
                        })
                    } else {
                        itemObj[item.id] = ''
                    }
                }
            })
            setPageTailorData(itemObj)
        }
    }, [processPage])

    useEffect(() => {
        const payload1 = {
            version: processRelease ? processRelease[0]?.version : '1.0',
            processPage: query.projectPageId,
            project: query.pid
        }
        requestApiData.getProcessPageTailerHistoryByProject(payload1)
            .then(res => {
                const last_element = res?.data?.findLast((item) => true);
                setStandardProcessTailorHistory(last_element);

            })
            .catch(err => {
                if (err.response?.data?.status === 401) {
                    toast.error(err.response?.data?.statusText)
                    console.log(err)
                } else {
                    console.log(err)
                }
            })
    }, [processRelease])

    const getAllHistory = () => {
        const payload = {
            project: query.pid,
            processPage: query.projectPageId
        }

        requestApiData.getProcessPageTailerHistoryByProject(payload)
            .then(res => {
                const last_element = res.data.findLast((item) => true);
                setProcessPageTailerHistory(last_element)

                // setPageTailorData(last_element?.tailored_description)
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

    const getProcessPageRelease = () => {
        const payload = {
            project: query.pid,

        }
        requestApiData.getProcessRelease(payload).then((res) => {
            const last_element = res.data.findLast((item) => true);
            const data = last_element ?  last_element?.processPage?.filter(page => page.id === query.projectPageId)  :''
            setPocessRelease(data)
            setProcessReleaseVersion(last_element)
        }).catch(err => {
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
        })

    }




    const getProcessPageData = () => {
        requestApiData.getProcessPageByTailerVersion().then(res => {
            const data = res.data.filter(item => item._id === query.projectPageId)
            setProcessPageData(data)
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
        getProcessPageData()
        getProcessPageRelease()
    }, [query.pid, query.projectPageId])

    // const projectPageData = processPage.main_description
    const updateEditorState = (val) => {
        pageTailorData[val?.id] = val?.data
        setPageTailorData(pageTailorData)
    };

    const findProjectId = JSON.parse(localStorage.getItem('userData'))

    // const findProjectAdmin = projectId.find(item => item.adminId === findProjectId.id)

    const { values, handleSubmit, handleBlur, handleChange, touched, errors } = useFormik({
        initialValues: {
            comment: '',
            status: '',
            version: 'minor'
        },
        onSubmit: (values, { resetForm }) => {
            let newVersion = processPageTailerHistory ? processPageTailerHistory?.version : '1.0'

            const versionArr = newVersion?.split('.')
            if (versionArr?.length > 0 && values.version === 'minor') {
                if (parseInt(versionArr[1]) === 99) {
                    newVersion = `${parseInt(versionArr[0]) + 1}.0`
                } else {
                    newVersion = `${versionArr[0]}.${parseInt(versionArr[1]) + 1}`
                }
            } else if (versionArr?.length > 0 && values.version === 'major') {
                newVersion = `${parseInt(versionArr[0]) + 1}.0`
            }




            const payload = {
                comment: values.comment,
                status: values.status,
                version: newVersion,
                tailored_description: pageTailorData,
                changeBy: findProjectId.id,
                processPage: query.projectPageId,
                project: query.pid
            }
            resetForm({ values: '' })
            requestApiData.createProcessPageTailerHistory(payload).then(res => {
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

useEffect(()=>{
    setEditor(false)
},[processPageName])

    return (
        <Box sx={{ display: 'flex' }}>
            {findProjectId?.role === 'admin' ? <AdminHeader /> : <BasicHeader />}
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
                        <DialogTitle id="alert-dialog-title" className='text_black inline_css'>
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
                                            <TextareaAutosize
                                                aria-label="empty textarea"
                                                placeholder="What is changed?"
                                                name='comment'
                                                className='inputFild'
                                                style={{ width: '100%', padding: '1rem .5rem', height: '165px' }}
                                                value={values.comment}
                                                onChange={handleChange}
                                            />
                                            <Typography fontSize='12px'>Please write short paragraph about the changes in this plublish.</Typography>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div>
                                            <InputLabel htmlFor='version' className='input_lable'>
                                                Version  <span>*</span>
                                            </InputLabel>
                                            <Input className='inputFild' style={{ color: 'black' }} placeholder='Minor' disabled />
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
                                                {/* <MenuItem value='Release'>Release</MenuItem> */}
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
                        <Typography fontSize='24px' id="first" className='input_lable'>{processPageName?.name}</Typography>
                    </Box>
                    {findProjectAdmin || findProjectId?.role === 'admin' ?
                        <Box>
                            <Button className='styledButton' onClick={() => setPublish(true)} disabled={!pageTailorData}>Publish</Button>
                            <Button className='styledButton' onClick={() => router.push(`/processes/${query.pid}/${query.sid}/pagehistory/${query.projectPageId}`)}>History</Button>
                            <Button className='styledButton' onClick={() => setEditor(!editor)}>{editor ?"Back":"Edit"}</Button>
                        </Box>
                        : ''}
                </Box>
                <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
                <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-offset="0" tabIndex="0" style={{ padding: '0 20px' }}>
                    <div>
                        <Table className='main_table'>
                            <TableBody>
                                <tr>
                                    <th className='table_head'>Date</th>
                                    <td className='table_data'>{moment(processPageTailerHistory?.publishAt).format('DD.MM.YYYY')}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'>Status</th>
                                    {findProjectAdmin || findProjectId?.role === 'admin' ?
                                        <td className='table_data'>{processPageTailerHistory ? processPageTailerHistory?.status : 'Release'}</td>
                                        : <td className='table_data'>{standardTailerHistory?.status ? standardTailerHistory?.status : 'Release'}</td>}
                                </tr>

                                <tr>
                                    <th className='table_head'>Version</th>

                                    {findProjectAdmin || findProjectId?.role === 'admin' ?
                                        <td className='table_data'>v{processPageTailerHistory ? processPageTailerHistory?.version : '1.0'}</td>
                                        : <td className='table_data'>v{processRelease ? processRelease[0]?.version : '1.0'}</td>}
                                </tr>
                                {/* <tr>
                                    <th className='table_head'>Last Released Version</th>
                                    <td className='table_data'>v{processRelease[0]?.version ? processRelease[0]?.version : '1.0'}</td>
                                </tr> */}
                            </TableBody>
                        </Table>
                    </div>
                    {processPage.length && processPage?.map((item, itemIndex) => (
                        <div id={itemIndex} style={{ marginTop: '2rem' }} key={itemIndex} className='process_table'>
                            <Box>
                                <Box className='process_data' >
                                    <Typography variant='h6' className='input_lable'>{item.name}</Typography>
                                    {item.data && <div dangerouslySetInnerHTML={{ __html: item.data }} />}
                                </Box>

                                {item.subitem?.length > 0 ?
                                    item.subitem?.map((subItem, subItemIndex) => (
                                        <div id={itemIndex + '' + subItemIndex} key={subItemIndex}>
                                            <Box>
                                                <Box className='process_data'>
                                                    <ListItemText className='list_text'>{subItem.name}</ListItemText>
                                                    {subItem.data && <div dangerouslySetInnerHTML={{ __html: subItem.data }} />}
                                                </Box>
                                                {!editor && (findProjectAdmin || findProjectId?.role === 'admin') ?
                                                <Box className='process_text'>{ processPageTailerHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: processPageTailerHistory?.tailored_description[item.id + '_' + subItem.id] }} />}</Box>
                                                    : findProjectAdmin || findProjectId?.role === 'admin' ? <Grid container>
                                                        <Grid item xs={10}>
                                                            <Box mt='1rem' key={itemIndex}>
                                                                <Editor Id={item?.id + '_' + subItem.id} handleChangeMessage={updateEditorState}
                                                                    message={pageTailorData && pageTailorData[item?.id + '_' + subItem.id] ||
                                                                        processPageTailerHistory?.tailored_description[item.id + '_' + subItem.id]}
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
                                                    </Grid> :
                                                        standardTailerHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: standardTailerHistory?.tailored_description[item.id + '_' + subItem.id] }} />}

                                            </Box>
                                        </div>
                                    ))
                                    :
                                    !editor && (findProjectAdmin || findProjectId?.role === 'admin') ?
                                    <Box className='process_text'> {processPageTailerHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: processPageTailerHistory?.tailored_description[item.id] }} />}</Box>
                                        : findProjectAdmin || findProjectId?.role === 'admin' ? item.name !== 'Tailoring Guidelines' ?
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Box mt='1rem' key={itemIndex}>
                                                        <Editor Id={item.id} handleChangeMessage={updateEditorState}
                                                            message={pageTailorData && pageTailorData[item?.id] || processPageTailerHistory?.tailored_description[item?.id]}
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
                                            : '' :
                                            standardTailerHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: standardTailerHistory?.tailored_description[item.id] }} />
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
                    <DialogTitle id="alert-dialog-title" className='tailord_Modal'>
                        {"Tailoring Example"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className='tailord_Modal1'>
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
                    <DialogTitle id="alert-dialog-title" className='tailord_Modal'>
                        {"Best Practices"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className='tailord_Modal1'>
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