
import Sidenav from './Sidenav';
import NavbarAdmin from './NavbarAdmin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListOrder from "../order/ListOrder"


const ProductAdmin = () => {
  return (
    <>
    <div className='bgcolor'>

    <NavbarAdmin/>
    <Box height={70}/>
    <Box sx={{display:"flex"}}>
    <Sidenav/>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <ListOrder />
          </Box>
    </Box>
    </div>

    </>
  )
}

export default ProductAdmin
