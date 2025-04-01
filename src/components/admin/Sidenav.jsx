import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import CategoryIcon from '@mui/icons-material/Category';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import {useAppStore} from './appStore';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  //const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  
    const open = useAppStore((state) => state.dopen);
  

  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={90}/>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <Divider />
        <List>
          
           
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/admin")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                   <AssessmentOutlinedIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/products")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                   <AppsIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Product" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/category")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                   <CategoryIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Category" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/scategory")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                   <AccountTreeIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Sous Category" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/marque")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                <SellOutlinedIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Marque" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/orders")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                <ShoppingCartOutlinedIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Order" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/users")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                <AccountCircleIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="Users" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/products")}}>
              <ListItemButton sx={[{minHeight: 48,px: 2.5,},
                  open
                    ? {justifyContent: 'initial',}
                    : {justifyContent: 'center',},
                ]}
              >
                <ListItemIcon sx={[{ minWidth: 0,justifyContent: 'center',},
                    open
                      ? {mr: 3,}
                      : {mr: 'auto',},
                  ]}
                >
                  
                   <HomeIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary="client vue" sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            
          
        </List>
      </Drawer>
      
    </Box>
  );
}
