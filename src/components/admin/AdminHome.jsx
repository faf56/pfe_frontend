
import Sidenav from './Sidenav';
import NavbarAdmin from './NavbarAdmin';
import Box from '@mui/material/Box';

import './Adminstyle.css';
import Dashboard from '../dashboard/Dashboard';



const AdminHome = () => {
  return (
    <>
    <div className='bgcolor'>
    
        <NavbarAdmin/>
        <Box height={70}/>
        <Box sx={{display:"flex"}}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Dashboard />
              </Box>
        </Box>
        </div>
    </>
  )
}

export default AdminHome
