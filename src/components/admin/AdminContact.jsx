
import Sidenav from './Sidenav';
import NavbarAdmin from './NavbarAdmin';
import Box from '@mui/material/Box';

import ContactsAdmin from "../contact/ContactsAdmin"


const AdminContact = () => {
  return (
    <>
    <div className='bgcolor'>

    <NavbarAdmin/>
    <Box height={70}/>
    <Box sx={{display:"flex"}}>
    <Sidenav/>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <ContactsAdmin />
          </Box>
    </Box>
    </div>

    </>
  )
}

export default AdminContact
