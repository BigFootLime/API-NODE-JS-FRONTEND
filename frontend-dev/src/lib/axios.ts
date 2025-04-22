import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // met l'URL de ton backend ici
  withCredentials: true, // si tu veux gérer des cookies plus tard
})
