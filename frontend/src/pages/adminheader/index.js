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
import { useRouter } from 'next/router';
import Request from 'src/configs/axiosRequest';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MdPlayArrow } from 'react-icons/md';

var jwt = require('jsonwebtoken');

function AdminHeader({ userProfile }) {
  const [image, setImage] = React.useState({})
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter()
  const requestApiData = new Request()
  const auth = useAuth()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    auth.logout()
  }

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
  useEffect(() => {
    getUserItem()
  }, [userProfile])


  return (
    <AppBar position="fixed" className='header' sx={{ zIndex: 1 }}>
      <Toolbar sx={{
        padding: { lg: '0 60px', xs: '0 20px' }
      }} disableGutters>
        {/* <Box> */}
        <Link href='/admin'>
          <Image src={logo} alt='logo' width={150} height={20} />
        </Link>

        {/* </Box> */}

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
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/admin" ? "active" : ""}>
              <Link href='/admin' className='header_title'>
                <Typography className='text_black'>Dashboard</Typography>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu} className={router.pathname == "/managemember" ? "active" : ""}>
              <Link href='/managemember' className='header_title' >
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
          <Button className={router.pathname == "/admin" ? "active1 header_menu1" : "header_menu1"}
            onClick={handleCloseNavMenu}

          >
            <Link href='/admin' className='header_title1' >
              Dashboard
            </Link>
          </Button>
          <Button className={router.pathname == "/manageMember" ? "active1 header_menu1" : "header_menu1"}
            onClick={handleCloseNavMenu}
          >
            <Link href='/manageMember' className='header_title1' >
              Manage Members
            </Link>
          </Button>
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
                <Avatar className='profile'>
                  <Box fontSize='25px'>
                    {user?.name?.length > 0 ? user?.name[0] : ''}
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
            <Link href='/profile' style={{ textDecoration: "none" }} >
              <MenuItem className='adminHeader'>
                <Typography sx={{ color: 'black', fontFamily: 'Sansation' }} >My Account</Typography>
              </MenuItem>
            </Link>
            <Link href='/subscription' style={{ textDecoration: "none" }} >
              <MenuItem onClick={handleCloseUserMenu} className='adminHeader'>
                <Typography sx={{ color: 'black', fontFamily: 'Sansation' }} >Subscription</Typography>
              </MenuItem>
            </Link>
            <MenuItem onClick={() => { handleCloseUserMenu(); logoutHandler() }} className='adminHeader'>
              <Typography sx={{ color: 'black', fontFamily: 'Sansation' }}>Logout</Typography>
            </MenuItem>

          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;