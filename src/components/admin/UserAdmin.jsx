
import Sidenav from './Sidenav';
import NavbarAdmin from './NavbarAdmin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListUsers from '../user/ListUsers';


const UserAdmin = () => {
  return (
    <>
    <div className='bgcolor'>

    <NavbarAdmin/>
    <Box height={70}/>
    <Box sx={{display:"flex"}}>
    <Sidenav/>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <ListUsers />
          </Box>
    </Box>
    </div>

    </>
  )
}

export default UserAdmin
