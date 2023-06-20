import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TablePagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
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

// import CreateModal from './createModal';

// import UpdateUser from './updateModal';
import { MdOutlineEditCalendar } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Header from 'src/pages/header';

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

const CarniqStandardProcess = () => {

  const requestApiData = new Request()
  const [standardProcess, setStandardProcess] = useState([])
  const [createModal, setCreateModal] = useState(false)
  const [updateUser, setUpdateUser] = useState({})
  const [editModal, setEditModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = useState(false)
  const [carniqId, setCarniqId] = useState('')
  const [order, setOrder] = useState("ASC")

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - standardProcess.length) : 0;
    
  //modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //getCarniqUser
  const getStandardProcess = () => {
    requestApiData.getStandardProcess().then(res => {
      setStandardProcess(res.data)
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
    getStandardProcess()
  }, [])




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
      const sorted = [...standardProcess].sort((a, b) =>
        a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
      );
      setStandardProcess(sorted)
      setOrder("DSC")
    }


    if (order === "DSC") {
      const sorted = [...standardProcess].sort((a, b) =>
        a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
      );
      setStandardProcess(sorted)
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
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Standard Process</Typography>
          </Box>
          <Divider sx={{ marginTop: '5px', borderColor: 'black', height: '3px' }} />
          <TableContainer component={Paper} className='table_margin' >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{ borderRadius: '0px !impotant' }}>
                <TableRow>
                  <StyledTableCell>Nr.</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standardProcess.map((item, id) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell className='text carniq_table'  component="th" scope="row">{id + 1}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>
                      <Link href={`/standardProcess/${item._id}/${item._id}`} className='header_title'>
                        {item.name}
                      </Link>
                    </StyledTableCell>
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
        </Box>
      </Box>
    </Box>
  )
}
CarniqStandardProcess.getLayout = page => <BlankLayout>{page}</BlankLayout>

CarniqStandardProcess.acl = {
  subject: 'carniqUser'
}

export default CarniqStandardProcess