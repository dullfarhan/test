
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from '../header'
import { styled } from '@mui/material/styles';

// import Table from '@mui/material/Table';

// import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
  TableContainer, TableHead,
  TableRow, Box,
  Button, Divider,
  Typography, Table,
  TableBody, Paper,
  Dialog, DialogTitle,
  DialogContent, DialogContentText,
  DialogActions,
  TablePagination,
  Input
} from '@mui/material'

// import Paper from '@mui/material/Paper';
import Link from 'next/link'
import Request from 'src/configs/axiosRequest';
import { toast } from 'react-hot-toast';
import { MdOutlineEditCalendar } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import EditUser from './edituser';
import { useRouter } from 'next/router';
import AddUser from './adduser';
import moment from 'moment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useAuth } from 'src/hooks/useAuth';

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

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F5F5F5',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#D3D3D3',
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: '1px solid #A9A9A9'
  },
}));

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

const User = () => {
  const requestApiData = new Request()
  const [userData, setUserData] = useState([])
  const [updateUser, setUpdateUser] = useState({})
  const [open, setOpen] = React.useState(false);
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [organization, setOrganization] = useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = useState(false)
  const [userId, setUserId] = useState('')
  const [name, setName] = useState(false)
  const [email, setEmail] = useState(false)
  const [status, setStatus] = useState(false)
  const [designation, setDesignation] = useState(false)
  const [org, setOrg] = useState(false)
  const [role, setRole] = useState(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState('')
  
  //pagination
  const auth = useAuth()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData.length) : 0;

  useEffect(() => {
    requestApiData.getOrganization()
      .then(res => {
        setOrganization(res.data);
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
  }, [])

  const router = useRouter()

  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUsers = () => {

    requestApiData
      .getUser()
      .then(res => {
        if (res?.status === 200) {
          const userData = res.data && res.data?.filter(item => item.role === 'admin' || item.role === 'basic')
          setUserData(userData)
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
  useEffect(() => {
    getUsers()
  }, [])

  const deleteCourse = id => {
    requestApiData
      .deleteUser(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('User delete successfully')
          getUsers()
          handleClose()
        }
      })
      .catch(err => {
        toast.error('Somthing went wrong')
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const getUserItem = (id) => {
    requestApiData.getUserItem(id).then(res => { setUpdateUser(res.data); }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }

  const filteredBooks = userData.filter(
    ({ fullName,email,designation,createdAt,role,status,updatedAt, organizationName }) =>
      fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      email.toLowerCase().includes(searchText.toLowerCase()) ||
      designation.toLowerCase().includes(searchText.toLowerCase()) ||
      moment(createdAt).format('DD-MM-YYYY h:mm A').toLowerCase().includes(searchText.toLowerCase()) ||
      role.toLowerCase().includes(searchText.toLowerCase()) ||
      status.toLowerCase().includes(searchText.toLowerCase()) ||
      moment(updatedAt).format('DD-MM-YYYY h:mm A').toLowerCase().includes(searchText.toLowerCase()) ||
      organizationName.toLowerCase().includes(searchText.toLowerCase()) 

      // console.log( numberProject?.length.toLowerCase().includes(searchText.toLowerCase()))
  );


  const userName = JSON.parse(localStorage.getItem('userData'))
  let string = userName?.name?.split(' ').map(val => val[0].toUpperCase() + val.slice(1)).join(' ')

  function greeting() {
    const hour = moment().hour()
    if (hour > 16) {
      return 'Good Evening'
    }
    if (hour > 11) {
      return 'Good Afternoon'
    }

    return 'Good Morning'
  }


  // const sorting = (col) => {
  //   if (order === "ASC") {
  //     const sorted = [...userData].sort((a, b) =>
  //       a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
  //     );
  //     setUserData(sorted)
  //     setOrder("DSC")
  //   }

  //   if (order === "DSC") {
  //     const sorted = [...userData].sort((a, b) =>
  //       a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
  //     );
  //     setUserData(sorted)
  //     setOrder("ASC")
  //   }
  // }


  return (
    <Box >
      <Header />
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography color='#252B42' sx={{ fontSize: { md: '24px', sx: '15px' }, fontWeight: '700' }}>{greeting()}, {string}</Typography>
          </Box>
          <Box className='inline_css'
            paddingTop='2rem' sx={{ paddingLeft: { md: '1.5rem', xs: '5.rem' } }}>
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Users</Typography>
            {/* <Link href='/user/adduser' style={{ textDecoration: 'none' }}> */}
            <Box>
            {name || email || role || designation  || created || updated || org || status ?
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
                  placeholder={data}
                  value={searchText} onChange={(e) => setSearchText(e.target.value)}
                /> : ''}
            <StyledButton className='styledButton' onClick={() => setAddModal(true)}>Invite User</StyledButton>
            </Box>
            {/* </Link> */}
          </Box>
          <Divider className='divider_line' />
          <TableContainer component={Paper} className='table_margin' >
            <Table sx={{ minWidth: 800 }} aria-label="customized table">
              <TableHead sx={{ borderRadius: '0px !impotant' }}>
                <TableRow>
                  <StyledTableCell className='carniq_table '>Nr.</StyledTableCell>
                  <StyledTableCell className='carniq_table '  onClick={() => {setName(!name); setData('Name')}} sx={{ cursor: "pointer", minWidth: '150px' }}>Name <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table '  onClick={() => {setOrg(!org);setData('Organization')}} sx={{ cursor: "pointer", minWidth: '170px' }}>Organization <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setEmail(!email);setData('Email')}} sx={{ cursor: "pointer", minWidth: '170px' }}>Email <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setRole(!role); setData('Role')}} sx={{ cursor: "pointer", minWidth: '110px' }}>Role <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setDesignation(!designation); setData('Designation')}} sx={{ cursor: "pointer", minWidth: '160px' }} >Designation <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setCreated(!created); setData('Created')}} sx={{ cursor: "pointer", minWidth: '150px' }}>Created <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setUpdated(!updated); setData('Updated')}} sx={{ cursor: "pointer", minWidth: '150px' }}>Updated <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table ' onClick={() => {setStatus(!status); setData('Status')}} sx={{ cursor: "pointer", minWidth: '120px' }}>Status <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell className='carniq_table '></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, id) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell className='carniq_table ' component="th" scope="row">{id + 1}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.fullName ? item.fullName : '-'}</StyledTableCell>
                    <StyledTableCell className='carniq_table 's>{item.organizationName ? item.organizationName : ''} </StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.email ? item.email : '-'}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.role ? item.role : '-'}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.designation ? item.designation : '-'}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{moment(item.createdAt).format('DD-MM-YYYY, h:mm A')}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{moment(item.updatedAt).format('DD-MM-YYYY, h:mm A')}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.status}</StyledTableCell>
                    <StyledTableCell className='text carniq_table' sx={{ display: 'flex', justifyContent: 'space-between', height: '75px' }}>
                      <Button className='curd_btn' onClick={() => { setEditModal(true); getUserItem(item._id) }}>
                        <MdOutlineEditCalendar size={28} />
                      </Button>
                      <Button className='curd_btn' onClick={() => { handleOpen(); setUserId(item._id) }}>
                        <RiDeleteBin6Line size={28} />
                      </Button>
                    </StyledTableCell>
                    <EditUser editModal={editModal} setEditModal={setEditModal} getUsers={getUsers} updateUser={updateUser} organization={organization} />
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        <AddUser addModal={addModal} setAddModal={setAddModal} getUsers={getUsers} organization={organization} />
      </Box >

      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='text_black'>
          {"  Remove User from site?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className='text_black'>
            Thay will no longer have access; and won't be able to collaborate with your team.Your products will still keep all of this user's contributions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' className='styledButton' onClick={() => deleteCourse(userId)}>Remove user</Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={handleClose}>Cancel</CancelButton>
        </DialogActions>
      </StyledDialog>
    </Box >
  )
}

User.getLayout = page => <BlankLayout>{page}</BlankLayout>

User.acl = {
  subject: 'carniqUser'
}

export default User