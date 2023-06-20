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
import Link from 'next/link';
import moment from 'moment';
import Request from 'src/configs/axiosRequest';
import CreateModal from './createModal';
import UpdateModal from './updateModal';
import { MdOutlineEditCalendar } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
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

const StyledButton = styled(Button)`
  &:hover {
    background: #4169E1;
  }
`

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

const Projects = () => {
  const requestApiData = new Request()
  const [project, setProject] = useState([])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [dense, setDense] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [name, setName] = useState(false)
  const [org, setOrg] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [processVersion, setProcessVersion] = useState(false)
  const [organization, setOrganization] = useState([])
  const [editModal, setEditModal] = useState(false)
  const [updateUser, setUpdateUser] = useState([])
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = useState('')
  const [searchText, setSearchText] = useState('')
  const [order, setOrder] = useState("ASC")
  const [data, setData] = useState('')

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - project.length) : 0;

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

  const filteredBooks = project.filter(
    ({ fullName,name,processVersion,createdAt,updatedAt, organizationName }) =>
      fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      name.toLowerCase().includes(searchText.toLowerCase()) ||
      processVersion.toLowerCase().includes(searchText.toLowerCase()) ||
      moment(createdAt).format('DD-MM-YYYY h:mm A').toLowerCase().includes(searchText.toLowerCase()) ||
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getProject = () => {
    requestApiData.getProject().then(res => {
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

  const getProjectItem = (id) => {
    requestApiData.getProjectItem(id).then(res => { setUpdateUser(res.data) }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }

  const deleteProject = id => {
    requestApiData
      .deleteProject(id)
      .then(res => {
        if (res?.status === 200) {
          toast.success('Project delete successfully')
          getProject()
          handleClose()
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

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...project].sort((a, b) =>
        a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
      );
      setProject(sorted)
      setOrder("DSC")
    }


    if (order === "DSC") {
      const sorted = [...project].sort((a, b) =>
        a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
      );
      setProject(sorted)
      setOrder("ASC")
    }
  }

  return (
    <Box>
      <Header />
      <Box className='main_box'>
        <Box className='main_box'>
          <Box>
            <Typography color='#252B42' sx={{ fontSize: { md: '24px', xs: '15px' }, fontWeight: '700' }}>{greeting()}, {string}</Typography>
          </Box>
          <Box className='inline_css'
            sx={{ paddingLeft: { md: '1.5rem', xs: '5.rem' } }} paddingTop='2rem'>
            <Typography sx={{ color: 'black', fontWeight: '700', fontSize: { md: '20px', xs: '15px' } }}>Projects</Typography>
 <Box>
 {name || org || admin || created  || updated  || processVersion ?
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
              <StyledButton className='styledButton' onClick={() => setAddModal(true)}>Create Project</StyledButton>
 </Box>
           
          </Box>
          <Divider className='divider_line' />
          <TableContainer component={Paper} className='table_margin' >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead sx={{ borderRadius: '0px !impotant' }}>
                <TableRow>
                  <StyledTableCell>Nr.</StyledTableCell>
                  <StyledTableCell onClick={() => {setName(!name); setData('Name')}} className='pointer'>Name <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setOrg(!org); setData('Organization')}} className='pointer'>Organization <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setAdmin(!admin); setData('Project Admin')}} className='pointer'>Project Admin <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setProcessVersion(!processVersion); setData('Standard Process')}}>Standard Process <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setCreated(!created); setData('Created')}} className='pointer'>Created <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell onClick={() => {setUpdated(!updated); setData('Updated')}} className='pointer'>Updated <FilterAltIcon /></StyledTableCell>
                  <StyledTableCell ></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell component="th" scope="row">
                      {id + 1}
                    </StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{row.name}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{row.organizationName}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{row.fullName}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>V1.0.0</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{moment(row.createdAt).format('DD-MM-YYYY, h:mm A')}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>{moment(row.updatedAt).format('DD-MM-YYYY, h:mm A')}</StyledTableCell>
                    <StyledTableCell className='text carniq_table'>
                      <Button className='curd_btn' onClick={() => { setEditModal(true); getProjectItem(row._id) }}>
                        <MdOutlineEditCalendar size={28} />
                      </Button>
                      <Button className='curd_btn' onClick={() => { handleOpen(); setProjectId(row._id) }}>
                        <RiDeleteBin6Line size={28} />
                      </Button>

                      <UpdateModal editModal={editModal} setEditModal={setEditModal} getProject={getProject} updateUser={updateUser} organization={organization} />
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={project.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <CreateModal addModal={addModal} setAddModal={setAddModal} getProject={getProject} organization={organization} />
        </Box>
      </Box>
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
          <Button variant='contained' className='styledButton' onClick={() => deleteProject(projectId)}>Remove project</Button>
          <CancelButton variant='contained' className='cancel_btn' onClick={handleClose}>Cancel</CancelButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  )
}
Projects.getLayout = page => <BlankLayout>{page}</BlankLayout>

Projects.acl = {
  subject: 'carniqUser'
}

export default Projects