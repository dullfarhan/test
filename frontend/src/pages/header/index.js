import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { FaUser } from 'react-icons/fa';
import logo from '../../assest/carspice/Vector.png'
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from 'src/hooks/useAuth';
import { RiArrowDownSFill, RiArrowRightSFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import Request from 'src/configs/axiosRequest';
import { toast } from 'react-hot-toast';
import { MdPlayArrow } from 'react-icons/md';
import { useEffect } from 'react';

var jwt = require('jsonwebtoken');


function Header({ userProfile }) {
  const [image, setImage] = React.useState({})
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const auth = useAuth()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const { query } = useRouter()

  const router = useRouter()

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

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    auth.logout()
  }

  const requestApiData = new Request()
  const user = JSON.parse(localStorage.getItem('userData'))
  const id = user?.id

  const getUserItem = () => {
    requestApiData.getUserItem(id).then(res => setImage(res.data)).catch(err => {
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
        padding: { md: '0 60px', xs: '0 10px' }
      }} disableGutters>
        <Box>
          <Link href='/'>
            <Image src={logo} alt='logo' width={150} height={20} />
          </Link>
        </Box>

        {/* <Navigation settings={settings} horizontalNavItems={HorizontalNavItems()} /> */}


        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="black"

          >
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
            }}
          >
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/dashboard" ? "active" : ""}>
              <Link href='/dashboard' className='header_title'>
                <Typography className='text_black' >Dashboard</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/organization" ? "active" : ""}>
              <Link href='/organization' className='header_title'>
                <Typography className='text_black'>Organizations</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/user" ? "active" : ""}>
              <Link href='/user' className='header_title'>
                <Typography className='text_black'>User</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/project" ? "active" : ""}>
              <Link href='/project' className='header_title'>
                <Typography className='text_black'>Projects</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/carniq" ? "active" : ""}>
              <Link href='/carniq' className='header_title'>
                <Typography className='text_black'>CARNIQ Users</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={
              router.pathname === "/standardProcess" && router.pathname == `/standardProcess/projectManagement/${id}` && router.pathname == '/standardProcess/processReales'
                ? "active" : ""}>
              <Link href='/standardProcess' className='header_title'>
                <Typography className='text_black'> Standard Process</Typography>
              </Link>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', textTransform: 'capitalize', paddingLeft: '2rem' } }} className='navbar_container'>
          <Button className={router.pathname == "/dashboard" ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '14px' } }}
          >
            <Link href='/dashboard' className='header_title'>
              Dashboard
            </Link>
          </Button>
          <Button className={router.pathname == "/organization" ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '14px' } }}
          >
            <Link href='/organization' className='header_title'>
              Organizations
            </Link>
          </Button>
          <Button className={router.pathname == "/user" ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '14px' } }}
          >
            <Link href='/user' className='header_title'>
              User
            </Link>
          </Button>
          <Button className={router.pathname == "/project" ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '14px' } }}
          >
            <Link href='/project' className='header_title'>
              Projects
            </Link>
          </Button>
          <Button className={router.pathname == "/carniq" ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '12px' } }}
          >
            <Link href='/carniq' className='header_title'>
              CARNIQ Users
            </Link>
          </Button>
          <Button className={
            router.pathname == "/standardProcess" ||
              router.pathname == "/standardProcess/projectManagement/[id]" ||
              router.pathname == "/standardProcess/processReales" ||
              router.pathname == "/standardProcess/processRealesHistory" ||
              router.pathname == "/standardProcess/pagehistory/[pageId]" ||
              router.pathname == "/standardProcess/history/[projectId]"

              ? "active header_menu" : "header_menu"}
            onClick={handleCloseNavMenu}
            sx={{ fontSize: { xl: '18px', lg: '12px' } }}
          >
            <Link href='/standardProcess' className='header_title'>
              Standard Process
            </Link>
          </Button>
        </Box>
        <Box>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {image.profileImg ?
                (<Avatar alt="Remy Sharp" src={image.profileImg} />) :
                <Avatar className='profile'>
                  <Box fontSize='25px'>
                    {user?.name.length > 0 ? user?.name[0] : ''}
                  </Box>
                </Avatar>
              }
              {Boolean(anchorElUser) ? <MdPlayArrow style={{
                color: 'black',
                marginLeft: '.7rem',
                fontSize: '30px',
                transform: 'rotate(90deg)'
              }} /> : <MdPlayArrow style={{
                color: 'black',
                fontSize: '30px',
                marginLeft: '.7rem',
              }} />}

            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }} className='adminHeader'
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
            <Link href='/profile' style={{ textDecoration: "none" }}>
              <MenuItem className='adminHeader'>
                <Typography sx={{ color: 'black', fontFamily: 'Sansation' }} >My Account</Typography>
              </MenuItem>
            </Link>
            {/* <Link href='/subscription' style={{ textDecoration: "none" }}>
              <MenuItem onClick={handleCloseUserMenu} className='adminHeader'>
                <Typography sx={{ color: 'black', fontFamily: 'Sansation' }}>Subscription</Typography>
              </MenuItem>
            </Link> */}
            <MenuItem onClick={() => { handleCloseUserMenu(); logoutHandler() }} className='adminHeader'>
              <Typography sx={{ color: 'black', fontFamily: 'Sansation' }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;