import { RegisterSchema } from "../schema/register.schema"
import { LoginSchema } from "../schema/login.schema"
import { api } from "../axios" // attention au bon chemin

export const registerUser = async (data: RegisterSchema) => {
  const res = await api.post("/auth/register", data)
  return res.data
}

export const loginUser = async (data: LoginSchema): Promise<{ accessToken: string, user: { id: string } }> => {
  const res = await api.post("/auth/login", data)
  return {
    accessToken: res.data.token.token,
    user: res.data.token.user,
  }
}
