import React from 'react'
import Sidenav from './Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const OrderAdmin = () => {
  return (
    <>
    <Box sx={{display:"flex"}}>
    <Sidenav/>
    <h1>Order</h1>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            
            <Typography sx={{ marginBottom: 2 }}>
            
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              
            </Typography>
          </Box>
    </Box>
    </>
  )
}

export default OrderAdmin
