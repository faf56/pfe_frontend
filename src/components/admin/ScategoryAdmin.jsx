import React from 'react'
import Sidenav from './Sidenav';
import Box from '@mui/material/Box';
import NavbarAdmin from './NavbarAdmin';
import Typography from '@mui/material/Typography';
import Listscategorie from "../scategories/Listscategorie";


const ScategoryAdmin = () => {
  return (
    <>
    <div className='bgcolor'>
    
        <NavbarAdmin/>
        <Box height={70}/>
        <Box sx={{display:"flex"}}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Listscategorie />
              </Box>
        </Box>
        </div>
    </>
  )
}

export default ScategoryAdmin
