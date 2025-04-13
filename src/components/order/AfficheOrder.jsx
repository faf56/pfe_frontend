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
  styled,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup
} from '@mui/material';
import { 
  Print as PrintIcon,
  MoreVert as MoreIcon,
  LocalShipping as ShippedIcon,
  Payment as PaidIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Inventory as PreparingIcon
} from '@mui/icons-material';

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

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '6px',
  fontWeight: 500,
  backgroundColor: 
    status === 'livree' ? 'rgba(76, 175, 80, 0.1)' :
    status === 'expediee' ? 'rgba(25, 118, 210, 0.1)' :
    status === 'confirmee' ? 'rgba(103, 58, 183, 0.1)' :
    status === 'annulee' ? 'rgba(244, 67, 54, 0.1)' : 
    status === 'en_preparation' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 152, 0, 0.1)',
  color: 
    status === 'livree' ? '#2e7d32' :
    status === 'expediee' ? '#1976d2' :
    status === 'confirmee' ? '#673ab7' :
    status === 'annulee' ? '#d32f2f' : 
    status === 'en_preparation' ? '#ffa000' : '#ed6c02',
  border: `1px solid ${
    status === 'livree' ? 'rgba(76, 175, 80, 0.5)' :
    status === 'expediee' ? 'rgba(25, 118, 210, 0.5)' :
    status === 'confirmee' ? 'rgba(103, 58, 183, 0.5)' :
    status === 'annulee' ? 'rgba(244, 67, 54, 0.5)' : 
    status === 'en_preparation' ? 'rgba(255, 193, 7, 0.5)' : 'rgba(255, 152, 0, 0.5)'
  }`,
}));

const Afficheorder = ({ orders, onUpdateStatus, onPrintOrder }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      onUpdateStatus(selectedOrder._id, newStatus);
    }
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const enrichedOrders = useMemo(() =>
    orders.map(order => ({
      ...order,
      formattedDate: new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: order.userID ? `${order.userID.firstname} ${order.userID.lastname}` : "Anonyme",
      totalAmount: order.total
    })),
    [orders]
  );

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - enrichedOrders.length) : 0;
  const visibleOrders = enrichedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'livree': return <CompletedIcon fontSize="small" />;
      case 'expediee': return <ShippedIcon fontSize="small" />;
      case 'confirmee': return <PaidIcon fontSize="small" />;
      case 'annulee': return <CancelledIcon fontSize="small" />;
      case 'en_preparation': return <PreparingIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirmee': return 'Confirmée';
      case 'en_preparation': return 'En préparation';
      case 'expediee': return 'Expédiée';
      case 'livree': return 'Livrée';
      case 'annulee': return 'Annulée';
      default: return status;
    }
  };

  return (
    <Box>
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledTableHeadRow>
                <TableCell>ID Commande</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Articles</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableHeadRow>
            </TableHead>
            <TableBody>
              {visibleOrders.map((order) => (
                <StyledTableRow key={order._id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      #{order._id.substring(0, 8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.customerName}</Typography>
                    {order.userID?.telephone && (
                      <Typography variant="body2" color="text.secondary">
                        {order.userID.telephone}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.formattedDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      icon={getStatusIcon(order.statut)}
                      label={getStatusLabel(order.statut)}
                      size="small"
                      status={order.statut}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {order.totalAmount.toFixed(3)} DT
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <AvatarGroup max={4}>
                      {order.produits.map((item, index) => (
                        <Tooltip key={index} title={item.produitID?.title || 'Produit'} arrow>
                          <Avatar 
                            alt={item.produitID?.title} 
                            src={item.produitID?.imagepro} 
                            sx={{ width: 32, height: 32 }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {order.produits.reduce((sum, item) => sum + item.quantite, 0)} articles
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Imprimer">
                        <IconButton
                          size="small"
                          onClick={() => onPrintOrder(order._id)}
                        >
                          <PrintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier le statut">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, order)}
                        >
                          <MoreIcon fontSize="small" />
                        </IconButton>
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
          count={enrichedOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Commandes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </StyledPaper>

      {/* Menu pour changer le statut */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('en_attente')}>
          <PendingIcon color="warning" sx={{ mr: 1 }} /> En attente
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('confirmee')}>
          <PaidIcon color="secondary" sx={{ mr: 1 }} /> Confirmée
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('en_preparation')}>
          <PreparingIcon color="action" sx={{ mr: 1 }} /> En préparation
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('expediee')}>
          <ShippedIcon color="primary" sx={{ mr: 1 }} /> Expédiée
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('livree')}>
          <CompletedIcon color="success" sx={{ mr: 1 }} /> Livrée
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('annulee')}>
          <CancelledIcon color="error" sx={{ mr: 1 }} /> Annulée
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Afficheorder;