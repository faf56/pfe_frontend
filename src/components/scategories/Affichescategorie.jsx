import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box  } from '@mui/material';
import { Button } from 'react-bootstrap';
import Editscategorie from './Editscategorie';

const Affichescategorie = ({scategories,handleDeleteScategorie,handleUpdateScategorie}) => {
  const[show,setShowe]=useState(false)
  const[scategorie,setScategorie]=useState({})
  const handleShow=()=>{ setShowe(true)}
  const handleClose=()=>{setShowe(false)}
  const handleEdit=(sca)=>{
  setScategorie(sca)
  console.log(sca)
  handleShow()

  }
   
  const enrichedScategories = useMemo(() => 
    scategories.map(scat => ({
      ...scat,
      nomcategorie: scat.categorieID?.nomcategorie  // Récupérer le nom de la catégorie
    })),
    [scategories]
  );

  
  //should be memoized or stable
  const columns = useMemo(()=> [
    
      {
        accessorKey: 'nomscategorie', //access nested data with dot notation
        header: 'Sous Categorie',
        size: 150,
      },
      {
        accessorKey: 'nomcategorie', // Ajout de la colonne
        header: 'Catégorie',
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
          handleDeleteScategorie(cell.row.original._id);
          }}
          variant="danger" size="md"
          >
          <i className="fa fa-trash " />
          </Button>
          
          </div>
          ),
          },
      
    ],
    [scategories],
  );

  const table = useMaterialReactTable({
    columns,
    data:enrichedScategories, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <div>
    {show && <Editscategorie
    show={show}
    handleClose={handleClose}
    sca={scategorie}
    handleUpdateScategorie={handleUpdateScategorie}
    /> }
  <MaterialReactTable table={table} />
  </div>
  )

}

export default Affichescategorie
