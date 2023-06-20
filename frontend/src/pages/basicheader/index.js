import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../assest/carspice/Vector.png'
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from 'src/hooks/useAuth';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import Request from 'src/configs/axiosRequest';
import { toast } from 'react-hot-toast';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Drawer } from '@mui/material';
import { MdClose, MdPlayArrow } from 'react-icons/md';
import { useState } from 'react';

var jwt = require('jsonwebtoken');



function BasicHeader({ userProfile }) {
    const [image, setImage] = React.useState({})
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [projectId, setProjectId] = useState([])
    const [projectData, setProjectData] = useState([])
    const [process, setProcess] = useState([])

    const router = useRouter()
    const findProjectId = JSON.parse(localStorage.getItem('userData'))
    const id = findProjectId?.id

    const projects = () => {
        requestApiData.getProject().then(res => setProjectId(res.data)).catch(err => {
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
        })
    }

    React.useEffect(() => {
        projects()
    }, [])

    const projectpageId = projectId.find(item => item.adminId === findProjectId.id)

    const getProjectData = () => {
      
        requestApiData.getProcessPage().then(res => setProjectData(res.data)).catch(err => {
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
            console.log(err)
        })
    }

    React.useEffect(() => {
        getProjectData()
    }, [])

    const getList = () => (
        <div style={{ width: 250 }} onClick={() => setOpen(false)}>
            <Button onClick={() => setOpen(false)} >
                <MdClose size={30} className='text_black' />
            </Button>
            <Typography paddingLeft='1.5rem' color='green'>Process Landscape</Typography>
            {projectData.map((item, index) => (
                <ListItem button key={index} className='text_black'>
                    <Link href={`processes/${item._id}`} style={{ textDecoration: 'none' }}>
                        <ListItemText primary={item.name} />
                    </Link>
                </ListItem>
            ))}
        </div>
    );

    const auth = useAuth()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const token = window.localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    const currentDate = new Date();
    
    // JWT exp is in seconds
    if (decodedToken?.exp * 1000 < currentDate.getTime()) {
        toast.error("Token expired.");
        localStorage.clear()
        auth.logout()
        router.push('/login')

    }

    const logoutHandler = () => {
        auth.logout()
    }

    const requestApiData = new Request()

    const getUserItem = () => {
        requestApiData.getUserItem(id).then(res => setImage(res.data)).catch(err => {
            console.log(err)
            if (err.response?.data?.status === 401) {
                toast.error(err.response?.data?.statusText)
                console.log(err)
            } else {
                console.log(err)
            }
        })
    }

    React.useEffect(() => {
        getUserItem()
    }, [userProfile])

    return (
        <AppBar position="fixed" className='header' sx={{ zIndex: 1 }}>
            <Toolbar sx={{
                padding: { lg: '0 60px', xs: '0 20px' }
            }} disableGutters>
                <Box>
                    <Link href='/basic'>
                        <Image src={logo} alt='logo' width={150} height={20} />
                    </Link>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        className='text_black'                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            textAlign: 'center'
                        }}
                    >
                        <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/admin" ? "active" : ""}>
                            <Link href='/basic' className='header_title'>
                                <Typography className='text_black'>Dashboard</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "" ? "active" : ""}>
                            <Link href='' className='header_title' >
                                <Typography className='text_black'>Manage Members</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/help" ? "active" : ""}>
                            <Link href='/help' className='header_title' >
                                <Typography className='text_black'>Help</Typography>
                            </Link>
                        </MenuItem>
                    </Menu>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', textTransform: 'capitalize', paddingLeft: '2rem' } }} className='navbar_container1'>
                    <Button className={router.pathname == "/basic" ? "active1 header_menu1" : "header_menu1"}
                        onClick={handleCloseNavMenu}

                    >
                        <Link href='/basic' className='header_title1' >
                            Dashboard
                        </Link>
                    </Button>
                    {/* {
                        projectpageId?.adminId || findProjectId?.role === 'basic' ?
                            '' : <Button className={router.pathname == "/basic/manageMember" ? "active1 header_menu1" : "header_menu1"}
                                onClick={handleCloseNavMenu}

                            >
                                <Link href='/basic/manageMember' className='header_title1' >
                                    Manage Members
                                </Link>
                            </Button>
                    } */}
                    <Button className={router.pathname == "/help" ? "active1 header_menu1" : "header_menu1"}
                        onClick={handleCloseNavMenu}

                    >
                        <Link href='/help' className='header_title1' >
                            Help
                        </Link>
                    </Button>

                </Box>

                <Box sx={{ flexGrow: 0 }} >
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            {image.profileImg ?
                                (<Avatar alt="Remy Sharp" src={image.profileImg} />) :
                                <Avatar className='profile' >
                                    <Box fontSize='25px'>
                                        {findProjectId?.name.length > 0 ? findProjectId.name[0] : ''}
                                    </Box>
                                </Avatar>
                            }
                            {Boolean(anchorElUser) ? <Typography sx={{ marginLeft: { md: '.5rem' } }}>
                                <MdPlayArrow style={{
                                    color: 'black',
                                    fontSize: '30px',
                                    transform: 'rotate(90deg)'
                                }} />
                            </Typography> :
                                <Typography sx={{ marginLeft: { md: '.5rem' } }}>
                                    <MdPlayArrow style={{
                                        color: 'black',
                                        fontSize: '30px',
                                    }} />
                                </Typography>
                            }
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px', display: 'flex', justifyContent: 'center' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <Link href='/profile' className='header_title'>
                            <MenuItem className='adminHeader'>
                                <Typography sx={{ color: 'black', fontFamily: 'Sansation' }} >My Account</Typography>
                            </MenuItem>
                        </Link>
                        <MenuItem onClick={() => { handleCloseUserMenu(); logoutHandler() }} className='adminHeader'>
                            <Typography sx={{ color: 'black', fontFamily: 'Sansation' }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>

            </Toolbar>
            <Drawer open={open} anchor={"right"} onClose={() => setOpen(false)} >
                {getList()}
            </Drawer>
        </AppBar >
    );
}

export default BasicHeader;