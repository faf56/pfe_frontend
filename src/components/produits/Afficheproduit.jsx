import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  styled
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AttachMoney as PriceIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import Editproduit from './Editproduit';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
  '& td': {
    border: 'none',
    padding: '16px 24px',
  },
}));

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  '& th': {
    border: 'none',
    padding: '16px 24px',
    fontWeight: 600,
    color: '#555',
    fontSize: '0.875rem',
  },
}));

const ProductImage = styled('img')(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '8px',
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const ActionButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(211, 47, 47, 0.08)',
  marginRight: '8px',
  '&:hover': {
    backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.16)' : 'rgba(211, 47, 47, 0.16)',
  },
}));

const StockChip = styled(Chip)(({ theme, stock }) => ({
  borderRadius: '6px',
  fontWeight: 500,
  backgroundColor: stock > 10 
    ? 'rgba(76, 175, 80, 0.1)' 
    : stock > 0 
      ? 'rgba(255, 152, 0, 0.1)' 
      : 'rgba(244, 67, 54, 0.1)',
  color: stock > 10 
    ? '#2e7d32' 
    : stock > 0 
      ? '#ed6c02' 
      : '#d32f2f',
  border: `1px solid ${
    stock > 10 
      ? 'rgba(76, 175, 80, 0.5)' 
      : stock > 0 
        ? 'rgba(255, 152, 0, 0.5)' 
        : 'rgba(244, 67, 54, 0.5)'
  }`,
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  fontWeight: 600,
  backgroundColor: 'rgba(25, 118, 210, 0.08)',
  color: '#1976d2',
  border: '1px solid rgba(25, 118, 210, 0.3)',
}));

const Afficheproduit = ({ produits, handleDeleteProduct, handleUpdateProduct }) => {
  const [show, setShow] = useState(false);
  const [produit, setProduit] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleEdit = (pro) => {
    setProduit(pro);
    handleShow();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const enrichedProduits = useMemo(() =>
    produits.map(pro => ({
      ...pro,
      nommarque: pro.marqueID?.nommarque || "Non défini",
      nomscategorie: pro.scategorieID?.nomscategorie || "Non défini"
    })),
    [produits]
  );

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - enrichedProduits.length) : 0;
  const visibleProduits = enrichedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {show && (
        <Editproduit
          show={show}
          handleClose={handleClose}
          pro={produit}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}

      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>Image</TableCell>
                <TableCell>Produit</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleProduits.map((produit) => (
                <StyledTableRow key={produit._id}>
                  <TableCell>
                    <ProductImage
                      src={produit.imagepro || "/placeholder.svg?height=60&width=60"}
                      alt={produit.title}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=60&width=60";
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {produit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {produit.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={produit.nommarque} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderRadius: '6px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={produit.nomscategorie} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderRadius: '6px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <PriceChip
                      
                      label={`${produit.prix.toFixed(3)} TND`}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <StockChip
                      icon={<InventoryIcon fontSize="small" />}
                      label={produit.stock}
                      size="small"
                      stock={produit.stock}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Modifier">
                        <ActionButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(produit)}
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <ActionButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteProduct(produit._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: 73 * emptyRows }}>
                  <TableCell colSpan={7} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={enrichedProduits.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Produits par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>
    </Box>
  );
};

export default Afficheproduit;
