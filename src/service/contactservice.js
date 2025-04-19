import axios from "../api/axios"

const CONTACT_API = "contact"

export const sendContactMessage = async (formData) => {
  return await axios.post(`${CONTACT_API}/send`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const fetchContacts = async () => {
  return await axios.get(CONTACT_API)
}

export const fetchContactById = async (contactId) => {
  return await axios.get(`${CONTACT_API}/${contactId}`)
}

export const updateContactStatus = async (contactId, status) => {
  return await axios.put(`${CONTACT_API}/status/${contactId}`, { status })
}

export const deleteContact = async (contactId) => {
  return await axios.delete(`${CONTACT_API}/${contactId}`)
}
