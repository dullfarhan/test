import React, { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

// ** Icon Imports

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Input, MenuItem, Select } from '@mui/material'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import Request from 'src/configs/axiosRequest'
import { toast } from 'react-hot-toast'

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

const CreateModal = ({ addModal, setAddModal, getProject, organization }) => {

    const requestApiData = new Request()

    const [user, setUser] = useState([])
    const [standardProcess, setStandardProcess] = useState([])

    const getUser = () => {
        const payload = {
            role: ['admin', 'basic']
        }
        requestApiData.getUser()
            .then(res => {
                const userData = res.data && res.data?.filter(item => item.role === 'admin' || item.role === 'basic')
                setUser(userData)
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

    const getstandardProcess = () => {
        requestApiData
            .getStandardProcess()
            .then(res => {
                const last_element = res.data.findLast((item) => true);
                setStandardProcess(last_element)
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
        getstandardProcess()
    }, [])
    
    const router = useRouter()

    const schema = yup.object({
        name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
        organizationName: yup.string().required('Please enter organizationName'),
        fullName: yup.string().required('Please enter project admin')
    })

    const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
        initialValues: {
            name: '',
            description: '',
            group: [],
            admin: '',
            organizationId: '',
            fullName: '',
            organizationName: '',
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm }) => {
            const admins = values.fullName.split('/')
            const organizations = values.organizationName.split('/')

            const payload = {
                name: values.name,
                description: values.description,
                group: [],
                adminId: admins[0],
                fullName: admins[1],
                organizationId: organizations[0],
                organizationName: organizations[1],
                processVersion: standardProcess.version,
                standardProcess: standardProcess._id,
            }
            resetForm({ values: '' })
            requestApiData.createProject(payload).then(res => {
                if (res?.status === 200) {
                    toast.success('Project Create Successfully')
                    getProject()
                    setAddModal(false)
                }
            })
                .catch(err => {
                    toast.error('Somthing went wrong')
                    console.log(err)
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
        <StyledDialog open={addModal}
            sx={{ height: 'auto' }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <form autoComplete='off' onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title" className='text_black inline_css' >
                    {"Create project"}
                    <Box>
                        <Button type='submit' variant='contained' className='styledButton'>
                            Save
                        </Button>
                        <CancelButton onClick={() => setAddModal(false)} variant='contained' className='cancel_btn'>
                            Cancel
                        </CancelButton>
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
                            onBlur={handleBlur('name')}
                            error={errors.name && touched.name}
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
                            onBlur={handleBlur('organizationName')}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            error={errors.organizationName && touched.organizationName}
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
                            onBlur={handleBlur("fullName")}
                            inputProps={{ 'aria-label': 'Without label' }}
                            error={errors.fullName && touched.fullName}
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
CreateModal.getLayout = page => <BlankLayout>{page}</BlankLayout>

CreateModal.acl = {
    subject: 'carniqUser'
}

export default CreateModal