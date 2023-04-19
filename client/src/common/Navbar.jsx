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
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// import { IconButton } from '@mui/material';
import InsertLinkSharpIcon from '@mui/icons-material/InsertLinkSharp';

// const location = useLocation();
// console.log(location.pathname);
// const pages = ['About', 'Mysubgreddiits', 'Blog'];
const settings = ['Logout'];

function ResponsiveAppBar({ user, setUser }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const location = useLocation();
  console.log(location.pathname);
  // var pages = ['About', 'Mysubgreddiits', 'Allsubgreddiits','SavedPosts','Dashboard'];
  // if(location.pathname === '/mysubgreddiits/*'){
  //   pages = ['Users', 'Joining Requests Page', 'Stats','Reported'];
  // }
  const pathParts = location.pathname.split('/');
  const subPath = pathParts[1]; // Get the part of the path after the first "/"
  console.log(subPath);
  var subgreddiitId;
  var pages = ['About', 'Mysubgreddiits', 'Allsubgreddiits', 'SavedPosts', 'Dashboard'];
  if (subPath === 'mysubgreddiits' && pathParts.length > 2) {
    subgreddiitId = pathParts[2]; // Get the subgreddiit ID
    pages = ['Users', 'JoiningRequestsPage', 'Stats', 'Reported', 'Dashboard'];
  }
  
  //variable navigate
  const navigate = useNavigate();

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

  const openProfile = () => {
    setAnchorElUser(null);
    navigate('/profile');
  };

  const logout = () => {
    setAnchorElUser(null);
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const settingFunctions = {
    'Profile': openProfile,
    'Dashboard': handleCloseUserMenu,
    'Logout': logout,
  }
  // const settingLinks = {
  //   'About': ,
  //   'Mysubgreddiits': ,
  //   'Blog': ,
  // }
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  {/* <IconButton><InsertLinkSharpIcon/></IconButton> */}
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  subPath === 'mysubgreddiits' && pathParts.length > 2 && page.toLowerCase() !== 'dashboard'
                    ? navigate(`/mysubgreddiits/${subgreddiitId}/${page.toLowerCase()}`)
                    : navigate(`/${page.toLowerCase()}`)
                }
                }
                sx={{ my: 2, color: 'white', display: 'block' }}
                startIcon={<InsertLinkSharpIcon />}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => settingFunctions[setting]()}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;