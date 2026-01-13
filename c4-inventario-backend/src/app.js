// backend/src/app.js
import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"

import sequelize from "./database/db.js"
import User from "./models/User.js"
import Product from "./models/Product.js"
import authRoutes from "./routes/auth.routes.js"
import productsRoutes from "./routes/products.routes.js"

const app = express()

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productsRoutes)

app.get("/", (req, res) => {
  res.json({ message: "API C4 Inventario funcionando" })
})

async function startServer() {
  try {
    // Sincronizar modelos
    await sequelize.sync({ force: true })

    // Crear admin si no existe
    const admin = await User.findOne({ where: { username: "admin" } })

    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await User.create({
        username: "admin",
        password: hashedPassword,
        role: "ADMIN"
      })

      console.log("✅ Admin creado: admin / admin123")
    }

    // Crear productos de ejemplo si no existen (con los campos nuevos)
    const productCount = await Product.count()
    if (productCount === 0) {
      // Generar IDs únicos
      const timestamp = Date.now()
      await Product.bulkCreate([
        {
          productId: `PROD-${timestamp.toString(36).toUpperCase()}`,
          name: "Laptop Dell Inspiron 15",
          description: "Laptop Dell Inspiron 15 con 16GB RAM",
          brand: "Dell",
          model: "Inspiron 15",
          serialNumber: "DEL123456789",
          status: "Bodega",
          quantity: 1,
          price: 15000.00,
          category: "Computadoras",
          location: "Almacén Principal"
        },
        {
          productId: `PROD-${(timestamp + 1).toString(36).toUpperCase()}`,
          name: "Disco Duro Externo 1TB",
          description: "Disco duro externo USB 3.0",
          brand: "Seagate",
          model: "Expansion 1TB",
          serialNumber: "SEA987654321",
          status: "En campo",
          quantity: 1,
          price: 1200.00,
          category: "Almacenamiento",
          location: "Oficina 3"
        },
        {
          productId: `PROD-${(timestamp + 2).toString(36).toUpperCase()}`,
          name: "Monitor 24\" Full HD",
          description: "Monitor LED 24 pulgadas",
          brand: "Samsung",
          model: "S24F350",
          serialNumber: "SAM456123789",
          status: "Prestado",
          quantity: 1,
          price: 3500.00,
          category: "Monitores",
          location: "Departamento IT"
        }
      ])
      console.log("✅ Productos de ejemplo creados")
    }

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000")
      console.log("📋 Rutas disponibles:")
      console.log("   POST   /api/auth/login")
      console.log("   GET    /api/products")
      console.log("   POST   /api/products (ADMIN)")
      console.log("   PUT    /api/products/:id (ADMIN)")
      console.log("   DELETE /api/products/:id (ADMIN)")
    })
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error)
  }
}

startServer()