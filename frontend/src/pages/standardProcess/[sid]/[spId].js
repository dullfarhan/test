import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ScrollSpy from "react-ui-scrollspy";
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import { useCallback } from 'react';
import 'react-medium-image-zoom/dist/styles.css'
import modal from '../../../assest/carspice/modal1.png'
import Image from 'next/image';
import HtmlDiff from "htmldiff-js";
import {
    Button, Dialog, DialogContent,
    DialogContentText, DialogTitle, Fade, Grid,
    Input,
    InputLabel, MenuItem, Modal, Select, Table,
    TableBody, TextField, TextareaAutosize, styled
} from '@mui/material';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Backdrop, DialogActions, makeStyles } from '@material-ui/core';
import Request from 'src/configs/axiosRequest';
import Link from 'next/link';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { RiErrorWarningLine } from 'react-icons/ri';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import Sidebar from './sidebar';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import Header from 'src/pages/header';
import { LensTwoTone } from '@mui/icons-material';
import Editor from 'src/pages/processes/[pid]/[sid]/Editor';
import BasicHeader from 'src/pages/basicheader';
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

const StandardProcess = () => {
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [editor, setEditor] = useState(false)
    const requestApiData = new Request()
    const [isZoomed, setIsZoomed] = useState(false)
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("false");
    const [publish, setPublish] = useState(false)

    // const [projectId, setProjectId] = useState([])
    const [standardProcessRelease, setStandardProcessRelease] = useState([])
    const [standardProcessReleaseVersion, setStandardProcessReleaseVersion] = useState([])
    const [fullWidth, setFullWidth] = React.useState(true);
    const [check, setCheck] = useState(false)
    const [warning, setWarning] = useState(false)
    const [history, setHistory] = useState([])
    const [standardProcess, setStandardProcess] = useState({})
    const [standardProcessHistory, setStandardProcessHistory] = useState({})
    const [updateDescription, setUpdateDescription] = useState([])
    const [pageTailorData, setPageTailorData] = useState({})

    const { query } = useRouter()

    const handleChangeMessage = (event) => {
        setUpdateDescription(event)
    }

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    const handleClose = () => {
        setOpen(false);
    };

    const handleImage = (value) => {
        setImage(value);
        setOpen(true);
    };

  
    const getStandardProcessRelease = () => {
        requestApiData.getStandardProcessRelease().then(res => {
            const last_element = res.data.findLast((item) => true);
            const data =last_element?.processPage?.filter(page => page.id === query.spId)
            setStandardProcessRelease(data ? data  : [])
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
        getStandardProcessRelease()
    }, [query.spId])

    const findProjectId = JSON.parse(localStorage.getItem('userData'))
    

    const getStanderedProcess = () => {
        const payload = {
            _id: query.sid
        }
        requestApiData.getStandardProcess(payload)
            .then(res => {
                setStandardProcess(res.data[0])
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

    const getStandardProcessHistory = () => {
        const payload = {
            standardProcess: query.sid
        }
        requestApiData
            .getStandardProcessHistory(payload)
            .then(res => {
                const last_element = res.data.findLast((item) => true);
                setStandardProcessHistory(last_element)
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
        getStanderedProcess()
        getStandardProcessHistory()
    }, [query.sid])

    useEffect(() => {
        if (standardProcessHistory?.update_description?.length > 0) {
            setUpdateDescription(standardProcessHistory?.update_description)
        } else {
            setUpdateDescription(standardProcess?.description)
        }
    }, [standardProcessHistory])

    const { values, handleSubmit, handleBlur, handleChange, touched, errors } = useFormik({
        initialValues: {
            comment: '',
            status: '',
            version: 'minor'
        },
        onSubmit: (values, { resetForm }) => {
            let newVersion = standardProcessHistory?.version < standardProcessRelease[0]?.version ? standardProcessRelease[0]?.version : standardProcessHistory ? standardProcessHistory?.version : '1.0'
            const versionArr = newVersion?.split('.')
            if (versionArr?.length > 0 && values.version === 'minor' ) {
                if (parseInt(versionArr[1]) === 99) {
                    newVersion = `${parseInt(versionArr[0]) + 1}.00`
                } else {
                    newVersion = `${versionArr[0]}.${parseInt(versionArr[1]) + 1}`
                }
            } else if (versionArr?.length > 0 && values.version === 'major') {
                newVersion = `${parseInt(versionArr[0]) + 1}.00`
            }

            const updatedDesc = standardProcess.description.map((item) => {

                if (pageTailorData[item.id]) {
                    return { ...item, data: pageTailorData[item.id] }
                } else {
                    if (item?.subitem?.length > 0) {
                        const updatedSubDesc = item?.subitem?.map((subItem) => {
                            if (pageTailorData[item.id + '_' + subItem.id]) {
                                return { ...subItem, data: pageTailorData[item.id + '_' + subItem.id] }
                            } else {
                                return { ...subItem }
                            }
                        })

                        return { ...item, subitem: updatedSubDesc }
                    } else {
                        return { ...item }
                    }
                }
            })

            const payload = {
                version: newVersion,
                update_description: updatedDesc,
                comment: values.comment,
                status: values.status,
                changeBy: findProjectId?.id,
                standardProcess: standardProcess?._id
            }

            resetForm({ values: '' })

            requestApiData.createStandardProcessHistory(payload).then(res => {
                setPublish(false)
                toast.success("Publish Successfully")
                getStandardProcessHistory()
                setEditor(false)

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
    const router = useRouter()

    const updateEditorState = (val) => {
        pageTailorData[val?.id] = val?.data
        setPageTailorData(pageTailorData)
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {
                findProjectId?.role === "carniqUser" ? <Header /> : findProjectId?.role === "admin" ? <AdminHeader/> : <BasicHeader />
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

                        <DialogTitle id="alert-dialog-title" className='text_black inline_css'>
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
                                            <Input placeholder='Minor' className='inputFild colord'   disabled  />
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
            <Box className={drawerOpen ? 'show' : 'hide'}>
                <Box>
                    <Box className='inline_css'>
                        <Box>
                            <Typography fontSize='24px' id="first" className='input_lable'>{standardProcess.name}</Typography>
                        </Box>
                        <Box>
                        {
                            findProjectId.role === "carniqUser" ?(
                            <> 
                            <Button className='styledButton' onClick={() => setPublish(true)} >Publish</Button>
                            <Button className='styledButton' onClick={() => router.push(`/standardProcess/${query.sid}/history/${query.spId}`)}>History</Button>
                            <Button className='styledButton' onClick={() => { setEditor(!editor); }}>{editor ? "Back":"Edit"}</Button>
                            </>
                            ) :("")
                        }
                        </Box>
                    </Box>
                    <Divider sx={{ margin: { lg: '10px ', xs: '5px' }, border: '1px solid gray' }} />
                    <ScrollSpy>
                        <Table className='main_table'>
                            <TableBody>
                                <tr>
                                    <th className='table_head'>Date</th>
                                    <td className='table_data'>{moment(standardProcessHistory?.publishAt).format('DD.MM.YYYY')}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'>Status</th>
                                    <td className='table_data'>{standardProcessRelease[0]?.version >  standardProcessHistory?.version ? standardProcessReleaseVersion.releaseStatus : standardProcessHistory ? standardProcessHistory?.status : 'Release'}</td>
                                </tr>
                                <tr>
                                    <th className='table_head'>Version</th>
                                    <td className='table_data'>v{standardProcessRelease[0]?.version >  standardProcessHistory?.version ? standardProcessRelease[0]?.version : standardProcessHistory ? standardProcessHistory?.version : '1.0'}</td>
                                </tr>

                                
                                {/* <tr>
                                    <th className='table_head'>Last Released Version</th>
                                    <td className='table_data'>v{standardProcessRelease[0]?.version ? standardProcessRelease[0].version : '1.0.0'}</td>
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
                        <div style={{ marginTop: '1rem' }}>

                            {updateDescription?.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                    <Typography variant='h6' className='input_lable'>{item.name}</Typography>
                                    {item.subitem?.length > 0 ?
                                        item.subitem?.map((subItem, subItemIndex) => (
                                            <div key={subItemIndex}>
                                                <Typography variant='h6' className='input_lable'>{subItem.name}</Typography>

                                                {!editor ?
                                                    subItem.data && <div dangerouslySetInnerHTML={{ __html: subItem.data }} />
                                                    :
                                                    <Grid container>
                                                        <Grid item xs={10}>
                                                            <Box mt='1rem' >
                                                                <Editor Id={item.id + '_' + subItem.id} handleChangeMessage={updateEditorState}
                                                                    message={(pageTailorData && pageTailorData[item.id + '_' + subItem.id]) || (subItem.data)}
                                                                />
                                                            </Box>

                                                        </Grid>
                                                    </Grid>
                                                }

                                            </div>
                                        )) :
                                        !editor ?
                                            item.data && <div dangerouslySetInnerHTML={{ __html: item.data }} />
                                            :
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Box mt='1rem' >
                                                        <Editor Id={item.id} handleChangeMessage={updateEditorState}
                                                            message={(pageTailorData && pageTailorData[item.id]) || (item.data)}
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                    }
                                </div>
                            ))}
                        </div>
                    </ScrollSpy></Box>
            </Box>

            {/* check modal */}
            <StyledDialog
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
            </StyledDialog>
            
            {/* warning */}
            <StyledDialog
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
            </StyledDialog>
        </Box>
    )
}

StandardProcess.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
StandardProcess.acl = {
    subject: 'both'
}

export default StandardProcess