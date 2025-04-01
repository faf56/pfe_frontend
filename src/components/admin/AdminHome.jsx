import React from 'react'
import Sidenav from './Sidenav';
import NavbarAdmin from './NavbarAdmin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './Adminstyle.css';



const AdminHome = () => {
  return (
    <>
    <div className='bgcolor'>
    <NavbarAdmin />
    <Box height={90} />

    <Box sx={{display:"flex"}}>
    <Sidenav/>
    <h1>Dashboard</h1>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            
            <Typography sx={{ marginBottom: 2 }}>
              
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              
            </Typography>
          </Box>
    </Box>
    </div>
    </>
  )
}

export default AdminHome
