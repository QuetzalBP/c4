// pages/Dashboard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate() // para navegar entre las secciones
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get("/products")
      setProducts(res.data)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("Error al cargar los productos")
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`)
        // Actualizar la lista eliminando el producto
        setProducts(products.filter(product => product.id !== id))
        alert("Producto eliminado exitosamente")
      } catch (err) {
        console.error("Error al eliminar producto:", err)
        alert("Error al eliminar el producto")
      }
    }
  }

  // Función para editar un producto
   const handleEdit = (id) => {
    navigate(`/edit-product/${id}`) // ← Usa navigate en lugar de window.location
  }
  // Calcular estadísticas
  const totalValue = products.reduce((acc, prod) =>
    acc + (parseFloat(prod.price) || 0) * (parseInt(prod.quantity) || 0), 0
  );

  const lowStockProducts = products.filter(p => (p.quantity || 0) < 10).length;

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard C4 Inventario</h1>

      {/* Tarjetas de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: 'normal'
          }}>Total Productos</h3>
          <p style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1e40af'
          }}>
            {products.length}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: 'normal'
          }}>Valor Total</h3>
          <p style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#10b981'
          }}>
            ${totalValue.toFixed(2)}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: 'normal'
          }}>Bajo Stock</h3>
          <p style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
            color: lowStockProducts > 0 ? '#ef4444' : '#6b7280'
          }}>
            {lowStockProducts}
          </p>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Productos en inventario</h2>
          <a href="/add-product" style={{
            background: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>+</span> Agregar Producto
          </a>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Cargando productos...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px' // Aumenté el ancho mínimo por la nueva columna
            }}>
              <thead>
                <tr style={{
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nombre</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Marca</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Modelo</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>No. Serie</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Ubicación</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Acciones</th> {/* Nueva columna */}
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{ padding: '12px 16px' }}>{product.productId}</td>
                    <td style={{ padding: '12px 16px' }}>{product.name}</td>
                    <td style={{ padding: '12px 16px' }}>{product.brand}</td>
                    <td style={{ padding: '12px 16px' }}>{product.model}</td>
                    <td style={{ padding: '12px 16px' }}>{product.serialNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background:
                          product.status === 'Bodega' ? '#dbeafe' :
                          product.status === 'En campo' ? '#fef3c7' :
                          product.status === 'Prestado' ? '#fee2e2' :
                          '#f3f4f6',
                        color:
                          product.status === 'Bodega' ? '#1e40af' :
                          product.status === 'En campo' ? '#92400e' :
                          product.status === 'Prestado' ? '#dc2626' :
                          '#6b7280'
                      }}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{product.location || 'No asignada'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-start'
                      }}>
                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEdit(product.id)}
                          style={{
                            background: '#f3f4f6',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#e5e7eb'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#f3f4f6'}
                          title="Editar producto"
                        >
                          <span style={{ fontSize: '16px' }}>✏️</span>
                        </button>
                        
                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                          title="Eliminar producto"
                        >
                          <span style={{ fontSize: '16px' }}>🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b'
          }}>
            <p>No hay productos en el inventario</p>
            <a href="/add-product" style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Agregar primer producto
            </a>
          </div>
        )}
      </div>
    </div>
  );
}