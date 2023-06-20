
import React, { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormHelperText, Grid, Select, Input, MenuItem, Dialog, DialogTitle, DialogContent, Divider } from '@mui/material'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from 'src/pages/header'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const Card = styled(MuiCard)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`

const CancelButton = styled(Button)`
  &:hover {
    background: red;
  }
`

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const UpdateModal = ({ editModal, setEditModal, getProject, updateUser, organization }) => {

    const requestApiData = new Request()

    const [user, setUser] = useState([])

    const getUser = () => {
        const payload = {
            role: ['admin', 'basic']
        }
        requestApiData.getUser(payload)
            .then(res => {
                setUser(res.data)
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
        getUser()
    }, [])

    const schema = yup.object({
        name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
        organizationName: yup.string().required('Please enter organizationName'),
        fullName: yup.string().required('Please enter project admin')
    })

    const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
        initialValues: {
            name: updateUser.name ? updateUser.name : '',
            organizationName: updateUser.organizationId + '/' + updateUser.organizationName ? updateUser.organizationId + '/' + updateUser.organizationName : '',
            fullName: updateUser.adminId + '/' + updateUser.fullName ? updateUser.adminId + '/' + updateUser.fullName : '',
        },
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            const organizations = values.organizationName.split('/')
            const admins = values.fullName.split('/')

            const payload = {
                _id: updateUser._id,
                fullName: admins[1],
                adminId: admins[0],
                name: values.name,
                organizationId: organizations[0],
                organizationName: organizations[1],
                updatedAt: new Date()
            }

            requestApiData.updateProject(payload).then(res => {
                if (res && res.status === 200) {
                    toast.success('Project Update Successfully')
                    getProject()
                    setEditModal(false)
                }
            }).catch(err => {
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
        <StyledDialog open={editModal}
            sx={{ height: 'auto' }}
            onClose={() => setEditModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <form autoComplete='off' onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title" className='text_black inline_css'>
                    {"Edit user"}
                    <Box>
                        <Button type='submit' variant='contained' className='styledButton'>
                            Save
                        </Button>
                    </Box>
                </DialogTitle>
                <Divider className='divider_line' />
                <DialogContent className='dialog_text'>
                    <div>
                        <InputLabel htmlFor='name' className='input_lable'>
                            Project name  <span>*</span>
                        </InputLabel>
                        <Input id='name' name='name' placeholder='Name' className='inputFild'
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(errors.name)}
                        />
                        {errors.name && touched.name ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.name}</FormHelperText > : ''}
                    </div>
                    <div>
                        <InputLabel htmlFor='organizationName' className='input_lable'>
                            Organization  <span>*</span>
                        </InputLabel>
                        <Select
                            value={values.organizationName}
                            onChange={handleChange}
                            name='organizationName'
                            className='select_input'
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            error={Boolean(errors.organizationName)}
                        >
                            <MenuItem value=''>Select</MenuItem>
                            {organization.map((item, i) =>
                                (<MenuItem key={i} value={item._id + '/' + item.name}>{item.name}</MenuItem>)
                            )}
                        </Select>
                        {errors.organizationName && touched.organizationName ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.organizationName}</FormHelperText > : ''}


                    </div>
                    <div>
                        <InputLabel htmlFor='admin' className='input_lable'>
                            Project Admin  <span>*</span>
                        </InputLabel>
                        <Select
                            value={values.fullName}
                            onChange={handleChange}
                            name='fullName'
                            className='select_input'
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            error={Boolean(errors.fullName)}
                        >
                            <MenuItem value=''>Select</MenuItem>
                            {user.map((item, id) => (
                                <MenuItem value={item._id + '/' + item.fullName} key={id}>{item.fullName}</MenuItem>
                            ))}
                        </Select>
                        {errors.fullName && touched.fullName ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.fullName}</FormHelperText > : ''}

                    </div>
                </DialogContent>
            </form>
        </StyledDialog>

    )
}

UpdateModal.getLayout = page => <BlankLayout>{page}</BlankLayout>

UpdateModal.acl = {
    subject: 'carniqUser'
}

export default UpdateModal