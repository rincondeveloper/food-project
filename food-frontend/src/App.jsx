import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import Logo from "./assets/logo.svg";
import Cart from "./assets/cart.svg";
import CartScreen from "./components/CartScreen";
import CheckoutScreen from "./components/CheckoutScreen";
import LoginAdmin from "./pages/LoginAdmin";
import PanelAdmin from "./pages/PanelAdmin";
import RutaProtegida from "./components/RutaProtegida";

function Inicio() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
        const data = await respuesta.json();
        setProductos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1, notas: "" }]);
    }
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter((item) => item.id !== id));
    } else {
      setCarrito(carrito.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      ));
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const actualizarNotas = (id, notas) => {
    setCarrito(carrito.map((item) =>
      item.id === id ? { ...item, notas } : item
    ));
  };

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <>
      <div className="min-h-screen bg-zinc-100 pb-10">
        <header className="bg-red-600 text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-50">
          <div className="flex items-center">
            <img src={Logo} width="35" height="35" alt="Logo" />
            <h1 className="text-xl font-bold pl-2 italic">Burger Boys</h1>
          </div>
          <div className="relative cursor-pointer" onClick={() => setMostrarCarrito(true)}>
            <img src={Cart} width="30" height="30" alt="Cart" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </header>

        <main className="p-4 max-w-md mx-auto">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-4">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={agregarAlCarrito}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {mostrarCarrito && (
        <CartScreen
          carrito={carrito}
          onCerrar={() => setMostrarCarrito(false)}
          onActualizarCantidad={actualizarCantidad}
          onEliminar={eliminarDelCarrito}
          onActualizarNotas={actualizarNotas}
          onContinuar={() => {
            setMostrarCarrito(false);
            setMostrarCheckout(true);
          }}
        />
      )}

      {mostrarCheckout && (
        <CheckoutScreen
          carrito={carrito}
          onCerrar={() => {
            setMostrarCheckout(false);
            setMostrarCarrito(true);
          }}
          onConfirmar={() => {
            setCarrito([]);
          }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/admin/panel" element={
        <RutaProtegida>
          <PanelAdmin />
        </RutaProtegida>
      } />
    </Routes>
  );
}

export default App;