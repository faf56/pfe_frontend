"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Delete as DeleteIcon, Visibility as ViewIcon, Edit as EditIcon, Email as EmailIcon } from "@mui/icons-material"
import { fetchContacts, updateContactStatus, deleteContact } from "../../service/contactservice"

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetchContacts()
      if (response.data.success) {
        setContacts(response.data.contacts)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error)
      showNotification("Erreur lors du chargement des contacts", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleViewContact = (contact) => {
    setSelectedContact(contact)
    setOpenViewDialog(true)
  }

  const handleEditStatus = (contact) => {
    setSelectedContact(contact)
    setNewStatus(contact.status)
    setOpenEditDialog(true)
  }

  const handleDeleteContact = (contact) => {
    setSelectedContact(contact)
    setOpenDeleteDialog(true)
  }

  const confirmStatusUpdate = async () => {
    try {
      const response = await updateContactStatus(selectedContact._id, newStatus)
      if (response.data.success) {
        // Mettre à jour l'état local
        setContacts(contacts.map((c) => (c._id === selectedContact._id ? { ...c, status: newStatus } : c)))
        showNotification("Statut mis à jour avec succès", "success")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      showNotification("Erreur lors de la mise à jour du statut", "error")
    } finally {
      setOpenEditDialog(false)
    }
  }

  const confirmDeleteContact = async () => {
    try {
      const response = await deleteContact(selectedContact._id)
      if (response.data.success) {
        // Mettre à jour l'état local
        setContacts(contacts.filter((c) => c._id !== selectedContact._id))
        showNotification("Message supprimé avec succès", "success")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error)
      showNotification("Erreur lors de la suppression du message", "error")
    } finally {
      setOpenDeleteDialog(false)
    }
  }

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "new":
        return <Chip label="Nouveau" color="primary" size="small" />
      case "in_progress":
        return <Chip label="En traitement" color="warning" size="small" />
      case "resolved":
        return <Chip label="Résolu" color="success" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  const handleCloseViewDialog = () => {
    // Définir un délai court pour permettre au focus de se réinitialiser correctement
    setTimeout(() => {
      setOpenViewDialog(false)
    }, 0)
  }

  const handleCloseEditDialog = () => {
    setTimeout(() => {
      setOpenEditDialog(false)
    }, 0)
  }

  const handleCloseDeleteDialog = () => {
    setTimeout(() => {
      setOpenDeleteDialog(false)
    }, 0)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des messages de contact
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Sujet</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun message de contact trouvé
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact._id} hover>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{getStatusChip(contact.status)}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleViewContact(contact)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton color="warning" onClick={() => handleEditStatus(contact)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteContact(contact)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogue de visualisation */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>Détails du message</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>De:</strong> {selectedContact.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Sujet:</strong> {selectedContact.subject}
              </Typography>
              {selectedContact.orderRef && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Référence de commande:</strong> {selectedContact.orderRef}
                </Typography>
              )}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date:</strong>{" "}
                {new Date(selectedContact.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Statut:</strong> {getStatusChip(selectedContact.status)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Message:</strong>
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: "#f9f9f9" }}>
                <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                  {selectedContact.message}
                </Typography>
              </Paper>
              {selectedContact.attachment && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Pièce jointe:</strong>
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    href={`/uploads/contacts/${selectedContact.attachment.filename}`}
                    target="_blank"
                    download // Ajoutez cet attribut
                  >
                    {selectedContact.attachment.filename}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Fermer</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              handleCloseViewDialog()
              // Ajouter un délai avant d'ouvrir le dialogue d'édition
              setTimeout(() => {
                handleEditStatus(selectedContact)
              }, 100)
            }}
          >
            Modifier le statut
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de modification du statut */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} disableRestoreFocus>
        <DialogTitle>Modifier le statut</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Statut"
            >
              <MenuItem value="new">Nouveau</MenuItem>
              <MenuItem value="in_progress">En traitement</MenuItem>
              <MenuItem value="resolved">Résolu</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button variant="contained" color="primary" onClick={confirmStatusUpdate}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} disableRestoreFocus>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteContact}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
