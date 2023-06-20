import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Input, TablePagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Header from '../header'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from 'next/link'
import Request from 'src/configs/axiosRequest';
import CreateModal from './createModal';
import UpdateUser from './updateModal';
import { MdOutlineEditCalendar } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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

function createData(nr, name, email, created, updated, status) {
  return { nr, name, email, created, updated, status };
}

const rows = [
  createData(1, 'Phalgun U', 'phalgun@abc.com', '31.12.2022', '05.10.2023', 'Active'),
  createData(2, 'Ronak G', 'ronakg@def.ai', '31.12.2022', '05.10.2023', 'Inactive'),
];

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

const CarniqUsers = () => {

  const requestApiData = new Request()
  const [carinqUser, setCarniqUser] = useState([])
  const [createModal, setCreateModal] = useState(false)
  const [updateUser, setUpdateUser] = useState({})
  const [editModal, setEditModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = useState(false)
  const [carniqId, setCarniqId] = useState('')
  const [order, setOrder] = useState("ASC")
  const [name, setName] = useState(false)
  const [email, setEmail] = useState(false)
  const [status, setStatus] = useState(false)
  const [designation, setDesignation] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState('')

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - carinqUser.length) : 0;

  //modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //getCarniqUser
  const getCarniqUser = () => {
    const payload = {
      role: 'carniqUser'
    }
    requestApiData.getUser(payload).then(res => {
      const userData = res.data && res.data.filter(item => item.role === 'carniqUser')
      setCarniqUser(userData)
    }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }

  const filteredBooks = carinqUser.filter(
    ({ fullName, email, designation, status }) =>
      fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      email.toLowerCase().includes(searchText.toLowerCase()) ||
      designation.toLowerCase().includes(searchText.toLowerCase()) ||
      status.toLowerCase().includes(searchText.toLowerCase())

    // console.log( numberProject?.length.toLowerCase().includes(searchText.toLowerCase()))
  );

  useEffect(() => {
    getCarniqUser()
  }, [])

  //getCarniqUserItem
  const getCarniUqserItem = (id) => {
    requestApiData.getUserItem(id).then(res => {
      setUpdateUser(res.data)
    }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }

  //deleteCarniqUser
  const deleteCarniqUser = (id) => {
    requestApiData.deleteUser(id).then(res => {
      if (res?.status === 200) {
        toast.success('User delete successfully')
        getCarniqUser()
        handleClose()
      }
    })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {

          toast.error('Somthing went wrong')
          console.log('Delet user', err)
        }
      })
  }

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

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...carinqUser].sort((a, b) =>
        a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
      );
      setCarniqUser(sorted)
      setOrder("DSC")
    }


    if (order === "DSC") {
      const sorted = [...carinqUser].sort((a, b) =>
        a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
      );
      setCarniqUser(sorted)
      setOrder("ASC")
    }
  }

  return (
    <Box>
      <Header />
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography color='#252B42' sx={{ fontSize: { md: '24px', sx: '15px' }, fontWeight: '700' }}>{greeting()}, {string}</Typography>
          </Box>
          <Box className='inline_css' paddingTop='2rem' sx={{ paddingLeft: { md: '1.5rem', xs: '5.rem' } }}>
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Users</Typography>
            <Box>
              {name || email || designation || status ?
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
              <StyledButton className='styledButton' onClick={() => setCreateModal(true)}>Create User</StyledButton>
            </Box>

          </Box>
          <Divider className='divider_line' />
          <TableContainer component={Paper} className='table_margin' >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{ borderRadius: '0px !impotant' }}>
                <TableRow>
                  <StyledTableCell>Nr.</StyledTableCell>
                  <StyledTableCell onClick={() => {setName(!name); setData('Name')}} className='pointer'>Name <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setEmail(!email); setData('Email')}} className='pointer'>Email <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setStatus(!status); setData('Status')}} className='pointer'>Status <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setDesignation(!designation); setData('Designation')}} className='pointer'>Designation <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, id) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell component="th" scope="row">{id + 1}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.fullName}</StyledTableCell>
                    <StyledTableCell className=' carniq_table'>{item.email}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.status}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{item.designation}</StyledTableCell>
                    <StyledTableCell>
                      <Button className='curd_btn' onClick={() => { setEditModal(true); getCarniUqserItem(item._id) }}>
                        <MdOutlineEditCalendar size={28} />
                      </Button>
                      <Button className='curd_btn' onClick={() => { handleOpen(); setCarniqId(item._id) }}>
                        <RiDeleteBin6Line size={28} />
                      </Button>
                    </StyledTableCell>
                    <UpdateUser updateUser={updateUser} getCarniqUser={getCarniqUser} editModal={editModal} setEditModal={setEditModal} />

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
            count={carinqUser.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <CreateModal createModal={createModal} setCreateModal={setCreateModal} getCarniqUser={getCarniqUser} />
        </Box>
      </Box>
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='text_black'>
          {"  Remove CarniqUser from site?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className='text_black'>
            Thay will no longer have access; and won't be able to collaborate with your team.Your products will still keep all of this user's contributions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' className='styledButton' onClick={() => deleteCarniqUser(carniqId)}>Remove user</Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={handleClose}>Cancel</CancelButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  )
}
CarniqUsers.getLayout = page => <BlankLayout>{page}</BlankLayout>

CarniqUsers.acl = {
  subject: 'carniqUser'
}

export default CarniqUsers