// pages/Login.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password
      })
      
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      console.error("Error de login:", err)
      setError(err.response?.data?.message || "Credenciales inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <h2>C4 Inventario</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}