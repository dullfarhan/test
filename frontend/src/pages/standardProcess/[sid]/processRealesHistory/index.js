import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from '@mui/material'
import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from 'src/pages/header'
import Sidebar from '../sidebar'
import { useState } from 'react'
import Request from 'src/configs/axiosRequest'
import { useEffect } from 'react'
import moment from 'moment'
import HtmlDiff from 'htmldiff-js'
import ReactDOMServer from "react-dom/server";
import { useRouter } from 'next/router'
import AdminHeader from 'src/pages/adminheader'
import BasicHeader from 'src/pages/basicheader'



const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const ProcessRealesHistory = () => {
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [standardProcessRelease, setStandardProcessRelease] = useState([])
    const [userName, setUserName] = useState([])
    const [checkedValues, setCheckedValues] = useState([])
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
        setCheckedValues([])
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const requestApiData = new Request()
    const { query } = useRouter()

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

    const handleCheckboxChange = value => {
        if (checkedValues.includes(value)) {
            setCheckedValues(checkedValues.filter(v => v !== value))
        } else if (checkedValues.length < 2) {
            setCheckedValues([...checkedValues, value])
        }
    }

    const getStandardProcessRelease = () => {
        const payload = {
            standardProcess: query.sid
        }
        requestApiData.getStandardProcessRelease(payload).then(res => setStandardProcessRelease(res.data)).catch(err => {
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
        getUser()
    }, [])


    const table11 = checkedValues[0]?.processPage && checkedValues[0]?.processPage.map((item, i) => {
        return ReactDOMServer.renderToString(
            <Table className='main_table' sx={{ marginTop: '1rem' }} key={i}>
                <TableBody >
                    <TableRow>
                        <TableCell style={{ width: '50%' }} className='table_head'>name</TableCell>
                        <TableCell style={{ width: '50%' }} className='table_data'>{item.name}</TableCell> </TableRow>
                    <TableRow className='compeare_tbody'>
                        <TableCell className='table_head'>version</TableCell>
                        <TableCell className='table_data'>{item.version}</TableCell>
                    </TableRow>
                    <TableRow className='compeare_tbody'>
                        <TableCell className='table_head'>reviewedBy</TableCell>
                        <TableCell className='table_data'>{item.reviewedBy}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Finding</TableCell>
                        <TableCell className='table_data'>{item.finding}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>final_verdict</TableCell>
                        <TableCell className='table_data'>{item.final_verdict}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>counter_measures</TableCell>
                        <TableCell className='table_data'>{item.counter_measures}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Understandability</TableCell>
                        <TableCell className='table_data'>{item.Understandability ? 'true' : 'false'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Maintainability</TableCell>
                        <TableCell className='table_data'>{item.Maintainability ? 'true' : 'false'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Correctness</TableCell>
                        <TableCell className='table_data'>{item.Correctness ? 'true' : 'false'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Consistency</TableCell>
                        <TableCell className='table_data'>{item.Consistency ? 'true' : 'false'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='table_head'>Completeness</TableCell>
                        <TableCell className='table_data'>{item.Completeness ? 'true' : 'false'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }
    )


    const table22 = checkedValues[1]?.processPage && checkedValues[1]?.processPage.map((item, i) => {
        return ReactDOMServer.renderToString(
            <table key={i}>
                <tbody>
                    <tr>
                        <TableCell style={{ width: '50%' }} className='table_head'>name</TableCell>
                        <TableCell style={{ width: '50%' }} className='table_data'>{item.name}</TableCell> </tr>
                    <tr>
                        <TableCell className='table_head'>version</TableCell>
                        <TableCell className='table_data'>{item.version}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>reviewedBy</TableCell>
                        <TableCell className='table_data'>{item.reviewedBy}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Finding</TableCell>
                        <TableCell className='table_data'>{item.finding}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>final_verdict</TableCell>
                        <TableCell className='table_data'>{item.final_verdict}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>counter_measures</TableCell>
                        <TableCell className='table_data'>{item.counter_measures}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Understandability</TableCell>
                        <TableCell className='table_data'>{item.Understandability ? 'true' : 'false'}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Maintainability</TableCell>
                        <TableCell className='table_data'>{item.Maintainability ? 'true' : 'false'}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Correctness</TableCell>
                        <TableCell className='table_data'>{item.Correctness ? 'true' : 'false'}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Consistency</TableCell>
                        <TableCell className='table_data'>{item.Consistency ? 'true' : 'false'}</TableCell>
                    </tr>
                    <tr>
                        <TableCell className='table_head'>Completeness</TableCell>
                        <TableCell className='table_data'>{item.Completeness ? 'true' : 'false'}</TableCell>
                    </tr>
                </tbody>
            </table>
        )
    })



    // Html code History
    const firstHtml = () => {
        return { __html: table11 ? table11.toString().split(',').join(' ') : '' }
    }

    const secondHtml = () => {
        return { __html: table22 ? table22.toString().split(',').join(' ') : '' }
    }

    // console.log(table11.toString());

    const diffHtml = () => {
        if (table11 && table22) {
            return {
                __html: HtmlDiff.execute(
                    firstHtml() ? firstHtml().__html : '',
                    secondHtml() ? secondHtml().__html : ''
                )
            }
        }
    }

    const diffHtml1 = () => {
        if (table11 && table22) {
            return {
                __html: HtmlDiff.execute(
                    secondHtml() ? secondHtml().__html : '',
                    firstHtml() ? firstHtml().__html : ''
                )
            }
        }
    }

    const findProjectId = JSON.parse(localStorage.getItem('userData'))

    return (
        <Box>
             {
                findProjectId?.role === "carniqUser" ? <Header /> : findProjectId?.role === "admin" ? <AdminHeader /> : <BasicHeader />
            }
            <Sidebar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
            <Box marginLeft={drawerOpen ? '300px' : '60px'} paddingTop='100px'>
                <Box paddingX='2rem' marginTop='1rem' className='inline_css'>
                    <Box>
                        <Typography variant='h4'>Process Release</Typography>
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
                                        <TableCell className='talel_color'>Released Version</TableCell>
                                        <TableCell className='talel_color'>Release Date</TableCell>
                                        <TableCell className='talel_color'>Released By</TableCell>
                                        <TableCell className='talel_color'>Release Status</TableCell>
                                        <TableCell className='talel_color'>Release Comment</TableCell>
                                        <TableCell align='right' className='talel_color'></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {standardProcessRelease.map((item, index) =>
                                        <TableRow
                                            sx={{ '&:last-child TableCell, &:last-child th': { border: 0 } }}
                                            className='text_black'
                                            key={index}
                                        >
                                            <TableCell className='talel_color text_black'></TableCell>
                                            <TableCell className='talel_color text_black'>
                                                <Checkbox
                                                    color='primary'
                                                    name='checkbox'
                                                    checked={checkedValues.includes(item)}
                                                    onChange={() => {
                                                        handleCheckboxChange(item)
                                                    }}
                                                />
                                                v{item?.releasedVersion}
                                            </TableCell>
                                            <TableCell className='talel_color text_black'>
                                                {moment(item?.releaseDate).format('MMM  DD,YYYY')}
                                            </TableCell>
                                            <TableCell className='talel_color text_black'>
                                                {userName.map((user, i) => (
                                                    <div key={i}>
                                                        {item?.releasedBy === user._id ? user.fullName : ''}
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell className='talel_color text_black'>
                                                {item?.releaseStatus}
                                            </TableCell>
                                            <TableCell className='talel_color text_black'>
                                                {item?.releaseComment}
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
                                            <Typography variant='h5'>v{checkedValues[0]?.releasedVersion > checkedValues[1]?.releasedVersion ? checkedValues[1]?.releasedVersion : checkedValues[0]?.releasedVersion}</Typography>
                                        </Box>
                                        <Divider className='divider_line' />
                                        <Box>
                                            {checkedValues[0]?.releasedVersion > checkedValues[1]?.releasedVersion ? <div dangerouslySetInnerHTML={secondHtml()} /> : <div dangerouslySetInnerHTML={firstHtml()} />}

                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box padding='20px' className='inner'>
                                        <Box>
                                            <Typography variant='h5'>v{checkedValues[0]?.releasedVersion > checkedValues[1]?.releasedVersion ? checkedValues[0]?.releasedVersion : checkedValues[1]?.releasedVersion}</Typography>
                                        </Box>
                                        <Divider className='divider_line' />
                                        <Box>
                                            {checkedValues[0]?.releasedVersion > checkedValues[1]?.releasedVersion ? <div dangerouslySetInnerHTML={firstHtml()} /> : <div dangerouslySetInnerHTML={secondHtml()} />}


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
                                            {checkedValues[0]?.releasedVersion > checkedValues[1]?.releasedVersion ? <div dangerouslySetInnerHTML={diffHtml1()} /> : <div dangerouslySetInnerHTML={diffHtml()} />}

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
        </Box>
    )
}
ProcessRealesHistory.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
ProcessRealesHistory.acl = {
    subject: 'both'
}

export default ProcessRealesHistory