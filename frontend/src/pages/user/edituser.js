
import React from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import { useFormik } from 'formik'
import 'cleave.js/dist/addons/cleave-phone.us'
import { FormHelperText, Grid, Select, Input, MenuItem, Dialog, DialogTitle, DialogContent, Divider } from '@mui/material'
import * as yup from 'yup'
import Request from 'src/configs/axiosRequest'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { toast } from 'react-hot-toast'


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

const EditUser = ({ editModal, setEditModal, getUsers, updateUser, organization }) => {

  const requestApiData = new Request()

  const schema = yup.object({
    name: yup.string().min(2, "Too Short!").max(50, "Too Long!").required('Please enter your name'),
    email: yup.string().email('Email is required').required('Please enter your email'),
    role: yup.string().required('Please enter your role'),
    designation: yup.string().min(5, "Too Short!").max(100, "Too Long!").required('Please enter message'),
  })

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: updateUser.fullName ? updateUser.fullName : '',
      email: updateUser.email ? updateUser.email : '',
      status: updateUser.status ? updateUser.status : '',
      organizationName: updateUser.organizationId + '/' + updateUser.organizationName ? updateUser.organizationId + '/' + updateUser.organizationName : '',
      designation: updateUser.designation ? updateUser.designation : '',
      role: updateUser.role ? updateUser.role : '',
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const organizations = values.organizationName.split('/')

      const payload = {
        _id: updateUser._id,
        fullName: values.name,
        email: values.email,
        designation: values.designation,
        role: values.role,
        organizationId: organizations[0],
        organizationName: organizations[1],
        status: values.status,
        updatedAt: new Date()
      }
      requestApiData.updateUser(payload).then(res => {
        if (res && res.status === 200) {
          toast.success('User Update Successfully')
          getUsers()
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
            <StyledButton type='submit' variant='contained' className='styledButton'>
              Save
            </StyledButton>

          </Box>
        </DialogTitle>
        <Divider className='divider_line' />
        <DialogContent className='dialog_text'>
          <div>
            <InputLabel htmlFor='name' className='input_lable'>
              FullName  <span>*</span>
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
            <InputLabel htmlFor='email' className='input_lable'>
              Email  <span>*</span>
            </InputLabel>
            <Input id='email' name='email' placeholder='Email' className='inputFild'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email)}
            />
            {errors.email && touched.email ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.email}</FormHelperText > : ''}
          </div>
          <div>
            <InputLabel htmlFor='organizationName' className='input_lable'>
              Organization  <span>*</span>
            </InputLabel>
            <Select

              value={values.organizationName}
              onChange={handleChange}
              onBlur={handleBlur}
              name='organizationName'
              className='select_input'
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value=''>Select</MenuItem>
              {organization.map((item, i) => (
                <MenuItem key={i} value={item._id + '/' + item.name}>{item.name}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <InputLabel htmlFor='role' className='input_lable'>
              User Role  <span>*</span>
            </InputLabel>
            <Select
              value={values.role}
              onChange={handleChange}
              name='role'
              className='select_input'
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value=''>Select Member</MenuItem>
              <MenuItem value='admin'>admin</MenuItem>
              <MenuItem value='basic'>basic</MenuItem>
            </Select>
          </div>
          <div>
            <InputLabel htmlFor='designation' className='input_lable'>
              Designation  <span>*</span>
            </InputLabel>
            <Input id='designation' name='designation' placeholder='designation' className='inputFild'
              value={values.designation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.designation)}
            />

            {errors.designation && touched.designation ? <FormHelperText sx={{ color: 'error.main' }} className='err_red'>{errors.designation}</FormHelperText > : ''}
          </div>


        </DialogContent>
      </form>
    </StyledDialog>

  )
}

EditUser.getLayout = page => <BlankLayout>{page}</BlankLayout>

EditUser.acl = {
  subject: 'carniqUser'
}

export default EditUser