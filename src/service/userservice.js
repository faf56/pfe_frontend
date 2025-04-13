import axios from "../api/axios"

const USER_API = "users"

export const fetchUsers = async () => {
  return await axios.get(USER_API)
}

export const fetchUserById = async (userId) => {
  return await axios.get(USER_API + "/" + userId)
}

export const deleteUser = async (userId) => {
  return await axios.delete(USER_API + "/" + userId)
}

export const toggleUserStatus = async (email) => {
  return await axios.get(USER_API + "/status/edit/?email=" + email)
}

export const updateUserRole = async (userId, role) => {
  return await axios.put(USER_API + "/role/" + userId, { role })
}

export const addUser = async (userData) => {
  return await axios.post(USER_API + "/register", userData)
}

export const updateUser = async (userData) => {
  return await axios.put(USER_API + "/" + userData._id, userData)
}

