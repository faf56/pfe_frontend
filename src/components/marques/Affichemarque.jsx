import React, { useState } from 'react'
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box  } from '@mui/material';
import { Button } from 'react-bootstrap';
import Editmarque from './Editmarque';

const Affichemarque = ({marques,handleDeleteMarque,handleUpdateMarque}) => {
const[show,setShowe]=useState(false)
  const[marque,setMarque]=useState({})
  const handleShow=()=>{ setShowe(true)}
  const handleClose=()=>{setShowe(false)}
  const handleEdit=(mar)=>{
  setMarque(mar)
  console.log(mar)
  handleShow()

  }
    
  //should be memoized or stable
  const columns = useMemo(()=> [
    {
        accessorKey: 'imagemarque', //access nested data with dot notation
        header: 'Image',
        Cell: ({ cell}) => (
        <Box
        sx={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        }}
        >
        <img
        alt="" height={80}
        src={cell.getValue()} loading="lazy"
        style={{ borderRadius: '20%' }}
        />
        </Box>),
        },
      {
        accessorKey: 'nommarque', //access nested data with dot notation
        header: 'Marque',
        size: 150,
      },
      
        {
          accessorKey: '_id', header: 'actions', size: 100,
          Cell: ({ cell }) => (
          <div >
          <Button onClick={() => {handleEdit(cell.row.original)}}
          variant="warning" size="md"
          >
          <i className="fa-solid fa-pen-to-square" style={{color: "#ffffff",}}></i>
          </Button>
          &nbsp;
          <Button onClick={() => {
          handleDeleteMarque(cell.row.original._id);
          }}
          variant="danger" size="md"
          >
          <i className="fa fa-trash " />
          </Button>
          
          </div>
          ),
          },
      
    ],
    [marques],
  );

  const table = useMaterialReactTable({
    columns,
    data:marques, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div>
    {show && <Editmarque
    show={show}
    handleClose={handleClose}
    mar={marque}
    handleUpdateMarque={handleUpdateMarque}
    /> }
  <MaterialReactTable table={table} />
  </div>
  )

}

export default Affichemarque
