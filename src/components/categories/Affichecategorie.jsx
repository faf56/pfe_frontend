import React, { useState } from 'react'
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box  } from '@mui/material';
import { Button } from 'react-bootstrap';
import Editcategorie from './Editcategorie';

const Affichecategorie = ({categories,handleDeleteCategorie,handleUpdateCategorie}) => {
const[show,setShowe]=useState(false)
  const[categorie,setCategorie]=useState({})
  const handleShow=()=>{ setShowe(true)}
  const handleClose=()=>{setShowe(false)}
  const handleEdit=(cat)=>{
  setCategorie(cat)
  console.log(cat)
  handleShow()

  }
    
  //should be memoized or stable
  const columns = useMemo(()=> [
    
      {
        accessorKey: 'nomcategorie', //access nested data with dot notation
        header: 'Categorie',
        size: 150,
      },
      
        {
          accessorKey: '_id', header: 'actions', size: 100,
          Cell: ({ cell }) => (
          <div >
          <Button onClick={() => {handleEdit(cell.row.original)}}
          variant="warning" size="md"
          >
          <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          &nbsp;
          <Button onClick={() => {
          handleDeleteCategorie(cell.row.original._id);
          }}
          variant="danger" size="md"
          >
          <i className="fa fa-trash " />
          </Button>
          
          </div>
          ),
          },
      
    ],
    [categories],
  );

  const table = useMaterialReactTable({
    columns,
    data:categories, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div>
    {show && <Editcategorie
    show={show}
    handleClose={handleClose}
    cat={categorie}
    handleUpdateCategorie={handleUpdateCategorie}
    /> }
  <MaterialReactTable table={table} />
  </div>
  )

}

export default Affichecategorie
