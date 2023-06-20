import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ScrollSpy from "react-ui-scrollspy";
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Editor from './Editor';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import { useCallback } from 'react';
import 'react-medium-image-zoom/dist/styles.css'
import modal from '../../../../assest/carspice/modal1.png'
import Image from 'next/image';
import HtmlDiff from "htmldiff-js";
import {
    Button, Dialog, DialogContent,
    DialogContentText, DialogTitle, Grid,
    Input,
    InputLabel, MenuItem, Modal, Select, Table,
    TableBody, TextField, TextareaAutosize, styled
} from '@mui/material';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/core';
import Request from 'src/configs/axiosRequest';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { RiErrorWarningLine } from 'react-icons/ri';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import BasicHeader from 'src/pages/basicheader';
import Sidebar from './sidebar';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import AdminHeader from 'src/pages/adminheader';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    border: 'none',
    p: 4,
};

const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: "nowrap",
        transform: "translateZ(0)"
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
            backgroundcolor: "red"
        }
    },
    img: {
        outline: "none"
    }
}));

const Processes = () => {

    const [drawerOpen, setDrawerOpen] = useState(true)
    const requestApiData = new Request()
    const [processRelease, setProcessRelease] = useState([])
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [projectData, setProjectData] = useState([])
    const [version, setVersion] = useState('')
    const [status, setStatus] = useState('')
    const [isZoomed, setIsZoomed] = useState(false)
    const [open, setOpen] = useState(false);
    const [pageTailorData, setPageTailorData] = useState({})
    const [image, setImage] = useState("false");
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [publish, setPublish] = useState(false)
    const [findProjectAdmin, setProjectId] = useState('')
    const [processReleaseVersion, setProcessReleaseVersion] = useState([])

    // const [History, setHistory] = useState([])
    const [fullWidth, setFullWidth] = React.useState(true);
    const [check, setCheck] = useState(false)
    const [processPageName, setProcessPageName] = useState({})
    const [editor, setEditor] = useState(false)
    const [warning, setWarning] = useState(false)
    const [standardProcess, setStandardProcess] = useState({})
    const [standardProcessTailorHistory, setStandardProcessTailorHistory] = useState({})

    // const [standardProcessDisc, setStandardProcessDisc] = useState([])

    // const [tailoredDes, setTailoredDes] = useState('')
    const [processHistory, setProcessHistory] = useState({})
    const { query } = useRouter()
    const spId = query.processId

    const getProcessPageRelease = () => {
        const payload = {
            project: query.pid
        }
        requestApiData.getProcessRelease(payload).then(res => {

            const last_element = res?.data?.findLast((item) => true);
            const data = last_element ?  last_element.processPage?.filter(page => page.id === query.processId)  :''
            setProcessRelease(data)

            // setProcessReleaseVersion(last_element)
        }).catch(err => {
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
        })

    }

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])


    const findProjectId = JSON.parse(localStorage.getItem('userData'))

    let processPageVer = []

    const project = () => {
        requestApiData.getProjectItem(query.pid)
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
                        processPageVer = result.processPage.filter(page => page.id === query.sid)

                    }
                }).catch(err => {
                    if (err.response?.data?.status === 401) {
                        toast.error(err.response?.data?.statusText)
                        console.log(err)
                    } else {
                        console.log(err)
                    }
                })

                const payload = {
                    _id: query?.sid
                }

                //get standard process data with latest history
                requestApiData.getStandardProcess(payload)
                    .then(res => {
                        let standardProcessData = res.data[0]
                        setProcessPageName(res.data[0])
                        if (processPageVer.length > 0) {
                            const payload = {
                                standardProcess: query?.sid,
                                version: processPageVer[0].version
                            }
                            requestApiData.getStandardProcessHistory(payload)
                                .then(res => {
                                    // standardProcessData.description = res.data[0].update_description;
                                    if (res.data[0]?.update_description?.length > 0) {
                                        setStandardProcess(res.data[0]?.update_description);

                                    } else {
                                        setStandardProcess(standardProcessData?.description);

                                    }
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

                            
                        } else {
                            setStandardProcess(standardProcessData?.description)
                        }
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


    const getStandardProcessTailerHistory = () => {
        const payload = {
            project: query.pid,
        }

        requestApiData
            .getStandardProcessTailerHistory(payload)
            .then(res => {
                const last_element = res.data.findLast((item) => true);
                setProcessHistory(last_element)

                // setTailoredDes(last_element?.tailored_description)
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
        if (query.pid) {
            project()
            getStandardProcessTailerHistory()
            getProcessPageRelease()
        }
    }, [query.pid, query.sid])

    useEffect(() => {
        
    const payload = {
        version: processRelease[0] ? processRelease[0]?.version : '1.0',
        standardProcess: query.sid,
        project: query.pid,
    }
    requestApiData.getStandardProcessTailerHistory(payload)
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


    },[processRelease])


    const { values, handleSubmit, handleBlur, handleChange, touched, errors } = useFormik({
        initialValues: {
            comment: '',
            status: '',
            version: 'minor'
        },
        onSubmit: (values, { resetForm }) => {
            let newVersion = processHistory ? processHistory?.version : '1.0'
            const versionArr = newVersion?.split('.')

            if (versionArr?.length > 0 && values.version === 'minor') {
                if (parseInt(versionArr[1]) === 99) {
                    newVersion = `${parseInt(versionArr[0]) + 1}.00`
                } else {
                    newVersion = `${versionArr[0]}.${parseInt(versionArr[1]) + 1}`
                }
            } else if (versionArr?.length > 0 && values.version === 'major') {
                newVersion = `${parseInt(versionArr[0]) + 1}.00`
            }

            const payload = {
                comment: values.comment,
                status: values.status,
                version: newVersion,
                changeBy: findProjectId?.id,
                page: findProjectId?.id,
                tailored_description: pageTailorData,
                standardProcess: query.processId,
                project: query.pid
            }
            resetForm({ values: '' })
            requestApiData.createStandardProcessTailerHistory(payload).then(res => {
                setPublish(false)
                setEditor(false)
                toast.success("Publish Successfully")
                getStandardProcessTailerHistory()
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

    const updateEditorState = (val) => {
        pageTailorData[val?.id] = val?.data
        setPageTailorData(pageTailorData)
    };

    const router = useRouter()

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
                        <DialogTitle id="alert-dialog-title" className='text_black inline_css' >
                            <Typography className='publish'>Publish with version comment</Typography>
                            <Button className='styledButton' type='submit' >Publish</Button>
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
                                                name='comment'
                                                value={values.comment}
                                                onChange={handleChange}
                                                className='inputFild'
                                                rows={6}
                                                style={{ width: '100%', border: 0 }}
                                            />
                                            <Typography fontSize='12px'>Please write short paragraph about the changes in this publish.</Typography>
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
                                            <Input className='inputFild' style={{ color: 'black' }} placeholder='Minor' disabled />
                                            <Typography fontSize='12px'>Select the major or minor from the drop down.</Typography>
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
            <Box className={drawerOpen ? 'show' : 'hide'}>
                <Box>
                    <Box className='inline_css'>
                        <Box>
                            <Typography fontSize='24px' id="first" className='input_lable'>{processPageName?.name}</Typography>
                        </Box>
                        {findProjectAdmin || findProjectId?.role === 'admin' ? <Box>
                            <Button className='styledButton' onClick={() => setPublish(true)} disabled={!pageTailorData}>Publish</Button>
                            <Button className='styledButton' onClick={() => router.push(`/processes/${query.pid}/${query.sid}/history/${query.sid}`)}>History</Button>
                            <Button className='styledButton' onClick={() => setEditor(!editor)}>{editor ? "Back" : "Edit"}</Button>
                        </Box> : ''}
                    </Box >
                    <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
                    <ScrollSpy>
                        <Table className='main_table'>
                            <TableBody>
                                <tr>
                                    <th className='table_head'>Date</th>
                                    <td className='table_data'>{moment(processHistory?.publishAt).format('DD.MM.YYYY')}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'> Status</th>
                                    {findProjectAdmin || findProjectId?.role === 'admin' ?
                                        <td className='table_data'>{processHistory ? processHistory?.status : 'Release'}</td>
                                        : <td className='table_data'>{standardProcessTailorHistory?.status ? standardProcessTailorHistory?.status : 'Release'}</td>}

                                </tr>
                                <tr>
                                    <th className='table_head'> Version</th>
                                    {findProjectAdmin || findProjectId?.role === 'admin' ?
                                        <td className='table_data'>v{processHistory ? processHistory?.version : '1.0'}</td>
                                        : <td className='table_data'>v{processRelease[0]?.version ? processRelease[0]?.version : '1.0'}</td>}

                                </tr>
                                {/* <tr>
                                    <th className='table_head'>Last Released Version</th>
                                    <td className='table_data'>v{processRelease ? processRelease?.releasedVersion : '1.0.0'}</td>
                                </tr> */}
                            </TableBody>
                        </Table>
                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Button onClick={() => setOpen(false)} className='process_btn'>
                                    <MdClose size={30} style={{ color: 'black', zIndex: 1 }} />
                                </Button>
                                <div style={{ padding: '20px' }}>
                                    <Image
                                        src={modal}
                                        alt="asd"
                                        style={{ maxHeight: "90%", maxWidth: "90%" }}
                                    />
                                </div>
                            </Box>
                        </Modal>
                        {standardProcess.length && standardProcess.map((sub, subIndex) => (
                            <div key={subIndex}>
                                <Typography variant='h6' className='input_lable'>{sub.name}</Typography>
                                {sub.data && <div dangerouslySetInnerHTML={{ __html: sub.data }} />}

                                {sub?.subitem?.length > 0 ? sub.subitem?.map((item, index) => (
                                    <div key={index}>
                                        <Typography variant='h6' className='input_lable'>{item.name}</Typography>
                                        {item.data && <div dangerouslySetInnerHTML={{ __html: item.data }} />}
                                    </div>
                                )) : ''
                                }
                                {!editor && (findProjectAdmin || findProjectId?.role === 'admin') ?
                                <Box className='process_text'>{ processHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: processHistory.tailored_description[sub.id] }} />}</Box>
                                    :
                                    (findProjectAdmin || findProjectId?.role === 'admin') && sub.name === 'Process performance objectives' ?
                                        <Grid container>
                                            <Grid item xs={10}>
                                                <Box mt='1rem'>
                                                    <Editor Id={sub.id} handleChangeMessage={updateEditorState}
                                                        message={pageTailorData && pageTailorData[sub.id] || processHistory?.tailored_description[sub.id]}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item>

                                                <Button onClick={() => setCheck(true)}>
                                                    <RiErrorWarningLine size={40} color='#4169E1' />
                                                </Button>

                                                <br />

                                                <Button onClick={() => setWarning(true)}>
                                                    <HiOutlineCheckCircle size={40} color='green' />
                                                </Button>

                                            </Grid>
                                        </Grid>
                                        : standardProcessTailorHistory?.tailored_description && <div dangerouslySetInnerHTML={{ __html: standardProcessTailorHistory.tailored_description[sub.id] }} />
                                }
                            </div>
                        ))}



                    </ScrollSpy ></Box >

            </Box >

            {/* check modal */}
            < StyledDialog
                open={check}
                onClose={() => setCheck(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ backgroundColor: '#E3FCEF' }}>
                    <DialogTitle id="alert-dialog-title" className='tailord_Modal'>
                        {"Best Practices"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className='tailord_Modal1'>
                            1.  The performance objectives tailored for the project shall fit to the performance objectives described in the organisation process landscape.
                        </DialogContentText>
                    </DialogContent>
                </Box>
            </StyledDialog >

            {/* warning */}
            < StyledDialog
                open={warning}
                onClose={() => setWarning(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ backgroundColor: '#DEEBFF' }}>
                    <DialogTitle id="alert-dialog-title" className='tailord_Modal'>
                        {"Tailoring Example"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className='tailord_Modal1'>
                            The following performance objectives are identified in the scope of this project: <br />
                            <ol>
                                <li> The project has to be completed successfolly within the 85% of the estimated time, resources and budget.</li>
                                <li> All the project milestones shall be met on time as described in the project plan.</li>
                                <li>The process shall be compliant to at least level 2 of ASPICE 3.1.x </li>
                                <li> The process shall adher to the customer specifc quality NameOfTheStandard Version X.y.z.</li>
                            </ol>

                        </DialogContentText>
                    </DialogContent>
                </Box>
            </StyledDialog >
        </Box >
    )
}

Processes.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
Processes.acl = {
    subject: 'both'
}

export default Processes