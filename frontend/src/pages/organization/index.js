import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Input, Pagination, TablePagination, Toolbar, Tooltip, Typography } from '@mui/material'
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
import Link from 'next/link';
import OrganizationModal from './createmodal';
import Request from 'src/configs/axiosRequest';
import { MdOutlineEditCalendar } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import UpdateModal from './updatemodal';
import moment from 'moment/moment';
import ReactPaginate from 'react-paginate';

import PropTypes from 'prop-types';
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



const Organization = () => {
  const requestApiData = new Request()
  const [createModal, setCreateModal] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(false);
  const [projectNo, setProjectNo] = React.useState(false);
  const [userNo, setUserNo] = React.useState(false);
  const [startDate, setStartDate] = React.useState(false);
  const [endDate, setEndDate] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [subTypes, setSubTypes] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState(false);
  const [data, setData] = useState('')
  const [organization, setOrganization] = useState([])
  const [organizationId, setOrganizationId] = useState('')
  const [editModal, setEditModal] = useState(false)
  let [updateData, setUpdateData] = useState({})
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = useState(false)
  const [project, setProject] = useState([])
  const [order, setOrder] = useState("ASC")
  const [searchText, setSearchText] = useState("")

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - organization.length) : 0;

  //modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //getOrganization
  const getOrganization = async () => {
    requestApiData
      .getOrganization()
      .then(res => {
        if (res?.status === 200) {
          setOrganization(res?.data.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }))
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        }
        else {
          console.log(err)
        }
      })
  }

  useEffect(() => {
    getOrganization()
  }, [])

  //getOrganizationItem

  const getOrganizationItems = (id) => {
    requestApiData.getOrganizationItem(id)
      .then(res => setUpdateData(res.data))
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  //deleteOrganization
  const deleteOrganization = (id) => {
    requestApiData
      .deleteOrganization(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('Organization delete successfully')
          getOrganization()
          handleClose()
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        }
        else {

          toast.error('Somthing went wrong')
          console.log(err)
        }
      })
  }

  const getProject = () => {
    requestApiData.searchProject().then(res => {
      setProject(res.data)
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
    getProject()
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

  const filteredBooks = organization.filter(
    ({ name,paymentMethod,regEndDate,regStartDate,subStatus,subType,numberProject,  }) =>
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      paymentMethod.toLowerCase().includes(searchText.toLowerCase()) ||
      moment(regEndDate).format('DD-MM-YYYY h:mm A').toLowerCase().includes(searchText.toLowerCase()) ||
      moment(regStartDate).format('DD-MM-YYYY h:mm A').toLowerCase().includes(searchText.toLowerCase()) ||
      subStatus.toLowerCase().includes(searchText.toLowerCase()) ||
      subType.subType.toLowerCase().includes(searchText.toLowerCase())
  );

  // const sorting = (col) => {
  //   if (order === "ASC") {
  //     const sorted = [...organization].sort((a, b) =>
  //       a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
  //     );
  //     setOrganization(sorted)
  //     setOrder("DSC")
  //   }

  //   if (order === "DSC") {
  //     const sorted = [...organization].sort((a, b) =>
  //       a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
  //     );
  //     setOrganization(sorted)
  //     setOrder("ASC")
  //   }
  // }

  return (
    <Box>
      <Header />
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography color='#252B42' sx={{ fontSize: { md: '24px', sx: '15px' }, fontWeight: '700' }}>{greeting()}, {string}</Typography>
          </Box>
          <Box className='inline_css'
            sx={{ paddingLeft: { md: '1.5rem', xs: '5.rem' } }} paddingTop='2rem'>
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Organization</Typography>
            <Box>
              {name || userNo || projectNo || subTypes  || status || paymentMethod || startDate || endDate ?
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
              <StyledButton className='styledButton'
                onClick={() => setCreateModal(true)}
              >Create Organization</StyledButton>
            </Box>
          </Box>
          <Divider className='divider_line' />
          <TableContainer component={Paper} className='table_margin' >
            <Table sx={{ minWidth: 700, bgcolor: 'transprent' }} aria-label="customized table" >
              <TableHead sx={{ borderRadius: '0px !impotant' }}>
                <TableRow>
                  <StyledTableCell >Nr.</StyledTableCell>
                  <StyledTableCell onClick={() => { setName(!name); setData('Name') }} className='pointer'>Name <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => { setProjectNo(!projectNo);  setData('Project') }}>Project</StyledTableCell>
                  <StyledTableCell onClick={() => { setUserNo(!userNo); setData('Users') }}>Users</StyledTableCell>
                  <StyledTableCell onClick={() => {setStartDate(!startDate); setData('Subscription Start')}} className='pointer'>Subscription Start <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setEndDate(!endDate);setData('Subscription End')}} className='pointer'>Subscription End <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setSubTypes(!subTypes); setData('Subscription Type ')}} className='pointer'>Subscription Type <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setStatus(!status); setData('Subscription Status ')}} className='pointer'>Subscription Status <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setPaymentMethod(!paymentMethod); setData('Payment method')}} className='pointer'>Payment method <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell ></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, id) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell className='carniq_table '>{id + 1}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.name}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.numberProject.length}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.numberUsers.length}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{moment(item.regStartDate).format('DD-MM-YYYY h:mm A')}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{moment(item.regEndDate).format('DD-MM-YYYY h:mm A')}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.subType.subType}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.subStatus}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>{item.paymentMethod}</StyledTableCell>
                    <StyledTableCell className='carniq_table '>
                      {/* <Link href={`user/edituser/${item._id}`} style={{ textDecoration: 'none' }}> */}
                      <Button className='curd_btn' onClick={() => { setEditModal(true); getOrganizationItems(item._id) }}>
                        <MdOutlineEditCalendar size={28} />
                      </Button>
                      {/* </Link> */}
                      <Button className='curd_btn' onClick={() => { handleOpen(); setOrganizationId(item._id) }}>
                        <RiDeleteBin6Line size={28} />
                      </Button>
                    </StyledTableCell>

                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                      color: 'black'
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
            count={organization.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='text_black'>
          {"  Remove Organization from site?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className='text_black'>
            Thay will no longer have access; and won't be able to collaborate with your team.Your products will still keep all of this user's contributions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' className='styledButton' onClick={() => deleteOrganization(organizationId)}>Remove organization</Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={handleClose}>Cancel</CancelButton>
        </DialogActions>
      </StyledDialog>
      <OrganizationModal createModal={createModal} setCreateModal={setCreateModal} getOrganization={getOrganization} />
      <UpdateModal editModal={editModal} setEditModal={setEditModal} updateData={updateData} getOrganization={getOrganization} />
    </Box >
  )
}
Organization.getLayout = page => <BlankLayout>{page}</BlankLayout>

Organization.acl = {
  subject: 'carniqUser'
}

export default Organization