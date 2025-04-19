"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  styled,
  Divider,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material"
import {
  Close,
  Visibility,
  VisibilityOff,
  Edit,
  AdminPanelSettings,
  Person,
  AccountCircle,
  Lock,
  Home,
  LocationOn,
  Male,
  Female,
} from "@mui/icons-material"
import { updateUser } from "../../service/userservice"

// Liste des principales villes de Tunisie
const tunisianCities = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Bizerte",
  "Gabès",
  "Ariana",
  "Gafsa",
  "Monastir",
  "Ben Arous",
  "Kasserine",
  "Médenine",
  "Nabeul",
  "Tataouine",
  "Béja",
  "Jendouba",
  "El Kef",
  "Mahdia",
  "Sidi Bouzid",
  "Tozeur",
  "Siliana",
  "Kébili",
  "Zaghouan",
  "Manouba",
].sort() // Tri alphabétique des villes

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
  },
}))

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #e0e0e0",
}))

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}))

const RoleOption = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ theme, isSelected }) => ({
  flex: 1,
  margin: 0,
  "& .MuiRadio-root": {
    display: "none",
  },
  "& .MuiTypography-root": {
    width: "100%",
  },
}))

const RoleButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isSelected" && prop !== "$role",
})(({ theme, $isSelected, $role }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  borderRadius: "8px",
  border: `1px solid ${$isSelected ? ($role === "admin" ? "#1976d2" : "#ff9800") : "#e0e0e0"}`,
  backgroundColor: $isSelected
    ? $role === "admin"
      ? "rgba(25, 118, 210, 0.08)"
      : "rgba(255, 152, 0, 0.08)"
    : "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: $isSelected
      ? $role === "admin"
        ? "rgba(25, 118, 210, 0.12)"
        : "rgba(255, 152, 0, 0.12)"
      : "#f5f5f5",
  },
}))

const RoleIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$role",
})(({ theme, $role }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: $role === "admin" ? "rgba(25, 118, 210, 0.12)" : "rgba(255, 152, 0, 0.12)",
  color: $role === "admin" ? "#1976d2" : "#ff9800",
  marginBottom: "8px",
}))

const GenderOption = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ theme, isSelected }) => ({
  flex: 1,
  margin: 0,
  "& .MuiRadio-root": {
    display: "none",
  },
  "& .MuiTypography-root": {
    width: "100%",
  },
}))

const GenderButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isSelected" && prop !== "$gender",
})(({ theme, $isSelected, $gender }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  borderRadius: "8px",
  border: `1px solid ${$isSelected ? ($gender === "homme" ? "#1976d2" : "#e91e63") : "#e0e0e0"}`,
  backgroundColor: $isSelected
    ? $gender === "homme"
      ? "rgba(25, 118, 210, 0.08)"
      : "rgba(233, 30, 99, 0.08)"
    : "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: $isSelected
      ? $gender === "homme"
        ? "rgba(25, 118, 210, 0.12)"
        : "rgba(233, 30, 99, 0.12)"
      : "#f5f5f5",
  },
}))

const GenderIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$gender",
})(({ theme, $gender }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: $gender === "homme" ? "rgba(25, 118, 210, 0.12)" : "rgba(233, 30, 99, 0.12)",
  color: $gender === "homme" ? "#1976d2" : "#e91e63",
  marginBottom: "8px",
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  fontWeight: 500,
  marginRight: "24px",
  "&.Mui-selected": {
    color: "#1976d2",
  },
}))

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-edit-tabpanel-${index}`}
      aria-labelledby={`user-edit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

const EditUser = ({ open, handleClose, user: initialUser, handleUpdateUser }) => {
  const [user, setUser] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    userVille: "",
    sexe: "",
    role: "user",
    isActive: true,
  })

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (initialUser) {
      setUser({
        _id: initialUser._id || "",
        firstname: initialUser.firstname || "",
        lastname: initialUser.lastname || "",
        email: initialUser.email || "",
        telephone: initialUser.telephone || "",
        userVille: initialUser.userVille || "",
        sexe: initialUser.sexe || "",
        role: initialUser.role || "user",
        isActive: initialUser.isActive !== undefined ? initialUser.isActive : true,
      })
    }
  }, [initialUser])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const validateProfileForm = () => {
    const errors = {}

    if (!user.firstname.trim()) errors.firstname = "Le prénom est requis"
    if (!user.lastname.trim()) errors.lastname = "Le nom est requis"

    if (!user.email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Format d'email invalide"
    }

    if (user.telephone && !/^\d+$/.test(user.telephone)) {
      errors.telephone = "Le numéro de téléphone doit contenir uniquement des chiffres"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = () => {
    const errors = {}

    if (password.newPassword && password.newPassword.length < 6) {
      errors.newPassword = "Le mot de passe doit contenir au moins 6 caractères"
    }

    if (password.newPassword !== password.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword({ ...password, [name]: value })

    // Clear error for this field when user types
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: null })
    }
  }

  const handleRoleChange = (e) => {
    setUser({ ...user, role: e.target.value })
  }

  const handleStatusChange = (e) => {
    setUser({ ...user, isActive: e.target.checked })
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (tabValue === 0 && !validateProfileForm()) return
    if (tabValue === 1 && password.newPassword && !validatePasswordForm()) return

    setLoading(true)
    setError(null)

    try {
      // Prepare data based on active tab
      const userData = { ...user }

      // If we're on the password tab and a new password is provided
      if (tabValue === 1 && password.newPassword) {
        userData.password = password.newPassword
      }

      const response = await updateUser(userData)
      handleUpdateUser(response.data)

      // Reset password fields
      setPassword({
        newPassword: "",
        confirmPassword: "",
      })

      // Show success message or close dialog
      handleClose()
    } catch (err) {
      console.error("Erreur lors de la modification de l'utilisateur:", err)
      setError(err.response?.data?.message || "Une erreur est survenue lors de la modification de l'utilisateur")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseWithFocus = () => {
    // Créer un élément temporaire pour capturer le focus
    const tempButton = document.createElement("button")
    tempButton.style.position = "fixed"
    tempButton.style.opacity = "0"
    tempButton.style.pointerEvents = "none"
    document.body.appendChild(tempButton)

    // Focus sur cet élément temporaire
    tempButton.focus()

    // Fermer le dialogue
    handleClose()

    // Supprimer l'élément temporaire après un court délai
    setTimeout(() => {
      document.body.removeChild(tempButton)
    }, 100)
  }

  return (
    <StyledDialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Ne fermez pas si c'est un clic sur l'arrière-plan ou la touche Escape
          if (!loading) handleClose()
        }
      }}
      fullWidth
      maxWidth="sm"
      container={() => document.body}
      disablePortal={false}
      keepMounted={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={true}
      hideBackdrop={false}
    >
      <DialogHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Edit sx={{ color: "#1976d2" }} />
          <Typography variant="h6">Modifier l'utilisateur</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={handleCloseWithFocus} disabled={loading} aria-label="close">
          <Close />
        </IconButton>
      </DialogHeader>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user edit tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab icon={<AccountCircle />} iconPosition="start" label="Profil" />
          <StyledTab icon={<Lock />} iconPosition="start" label="Mot de passe" />
          <StyledTab icon={<Home />} iconPosition="start" label="Adresses" disabled />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, overflowY: "auto", maxHeight: "calc(100vh - 170px)" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormField
                fullWidth
                label="Prénom"
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                error={!!formErrors.firstname}
                helperText={formErrors.firstname}
                disabled={loading}
                required
              />

              <FormField
                fullWidth
                label="Nom"
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                error={!!formErrors.lastname}
                helperText={formErrors.lastname}
                disabled={loading}
                required
              />
            </Box>

            <FormField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
              required
            />

            <FormField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={user.telephone}
              onChange={handleChange}
              error={!!formErrors.telephone}
              helperText={formErrors.telephone}
              disabled={loading}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="ville-label">Ville</InputLabel>
              <Select
                labelId="ville-label"
                id="userVille"
                name="userVille"
                value={user.userVille || ""}
                onChange={handleChange}
                label="Ville"
                disabled={loading}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Non définie</em>
                </MenuItem>
                {tunisianCities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Sexe
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <RadioGroup
                name="sexe"
                value={user.sexe || ""}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row", gap: 2 }}
              >
                <GenderOption
                  value="homme"
                  control={<Radio />}
                  label={
                    <GenderButton $isSelected={user.sexe === "homme"} $gender="homme">
                      <GenderIcon $gender="homme">
                        <Male />
                      </GenderIcon>
                      <Typography variant="subtitle2">Homme</Typography>
                    </GenderButton>
                  }
                />

                <GenderOption
                  value="femme"
                  control={<Radio />}
                  label={
                    <GenderButton $isSelected={user.sexe === "femme"} $gender="femme">
                      <GenderIcon $gender="femme">
                        <Female />
                      </GenderIcon>
                      <Typography variant="subtitle2">Femme</Typography>
                    </GenderButton>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Rôle de l'utilisateur
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <RadioGroup
                name="role"
                value={user.role}
                onChange={handleRoleChange}
                sx={{ display: "flex", flexDirection: "row", gap: 2 }}
              >
                <RoleOption
                  value="user"
                  control={<Radio />}
                  label={
                    <RoleButton $isSelected={user.role === "user"} $role="user">
                      <RoleIcon $role="user">
                        <Person />
                      </RoleIcon>
                      <Typography variant="subtitle2">Client</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Accès limité
                      </Typography>
                    </RoleButton>
                  }
                />

                <RoleOption
                  value="admin"
                  control={<Radio />}
                  label={
                    <RoleButton $isSelected={user.role === "admin"} $role="admin">
                      <RoleIcon $role="admin">
                        <AdminPanelSettings />
                      </RoleIcon>
                      <Typography variant="subtitle2">Administrateur</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Accès complet
                      </Typography>
                    </RoleButton>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Statut du compte
              </Typography>
              <FormControlLabel
                control={<Switch checked={user.isActive} onChange={handleStatusChange} color="success" />}
                label={<Typography variant="body2">{user.isActive ? "Compte actif" : "Compte inactif"}</Typography>}
                labelPlacement="start"
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: "8px" }}>
              Laissez les champs vides si vous ne souhaitez pas modifier le mot de passe.
            </Alert>

            <FormField
              fullWidth
              label="Nouveau mot de passe"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={password.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormField
              fullWidth
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={password.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              disabled={loading}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1">Fonctionnalité à venir...</Typography>
          </TabPanel>
        </DialogContent>

        <DialogActions
          sx={{ p: 2, backgroundColor: "#f8f9fa", borderTop: "1px solid #e0e0e0", position: "sticky", bottom: 0 }}
        >
          <Button
            onClick={handleCloseWithFocus}
            disabled={loading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Annuler
          </Button>
          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </SubmitButton>
        </DialogActions>
      </form>
    </StyledDialog>
  )
}

export default EditUser
