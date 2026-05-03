import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IconPlus = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const IconX = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FORM_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  tipo: "",
};

function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleGuardar = async () => {
    if (!form.nombre || !form.precio) {
      alert("Nombre y precio son obligatorios.");
      return;
    }

    setGuardando(true);

    try {
      let nombreImagen = form.imagen;

      // Si hay imagen nueva, subirla primero
      if (archivoImagen) {
        const nombreCamel = toCamelCase(form.nombre);
        const formData = new FormData();
        formData.append("nombre", nombreCamel);
        formData.append("imagen", archivoImagen);

        const resImg = await fetch(
          `${import.meta.env.VITE_API_URL}/api/uploads`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!resImg.ok) throw new Error("Error al subir imagen");
        const dataImg = await resImg.json();
        nombreImagen = dataImg.nombre;
      }

      const url = editandoId
        ? `${import.meta.env.VITE_API_URL}/api/productos/${editandoId}`
        : `${import.meta.env.VITE_API_URL}/api/productos`;

      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...form,
          precio: Number(form.precio),
          imagen: nombreImagen,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      await obtenerProductos();
      setMostrarForm(false);
      setForm(FORM_VACIO);
      setEditandoId(null);
      setArchivoImagen(null);
      setPreviewImagen(null);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      imagen: producto.imagen || "",
      tipo: producto.tipo || "",
    });
    setEditandoId(producto.id);
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
        method: "DELETE",
        headers,
      });
      await obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join("");
  };

  const handleImagenSeleccionada = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setArchivoImagen(archivo);
    setPreviewImagen(URL.createObjectURL(archivo));
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* HEADER */}
      <header className="bg-red-600 text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold italic">Panel Admin</h1>
        <button
          onClick={handleCerrarSesion}
          className="text-sm bg-white text-red-600 px-3 py-1.5 rounded-xl font-semibold"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* BOTÓN AGREGAR */}
        <button
          onClick={() => {
            setForm(FORM_VACIO);
            setEditandoId(null);
            setMostrarForm(true);
          }}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4"
        >
          <IconPlus /> Agregar producto
        </button>

        {/* LISTA DE PRODUCTOS */}
        {loading ? (
          <p className="text-center text-zinc-400">Cargando...</p>
        ) : (
          <div className="space-y-3">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-center"
              >
                {producto.imagen && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/images/${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-800">
                    {producto.nombre}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {producto.descripcion}
                  </p>
                  <p className="text-sm font-bold text-red-600 mt-1">
                    ${Number(producto.precio).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="text-zinc-400 hover:text-red-600 transition-colors pl-1"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL FORM */}
      {mostrarForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold text-zinc-800 text-lg">
                {editandoId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => {
                  setMostrarForm(false);
                  setArchivoImagen(null);
                  setPreviewImagen(null);
                }}
                className="text-zinc-400"
              >
                <IconX />
              </button>
            </div>

            <input
              type="text"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
            />
            <textarea
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              rows={2}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400 resize-none"
            />
            <input
              type="number"
              placeholder="Precio *"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
            />
            {/* PREVIEW */}
            {previewImagen && (
              <img
                src={previewImagen}
                alt="Preview"
                className="w-full h-36 object-cover rounded-xl"
              />
            )}

            {/* INPUT ARCHIVO */}
            <label className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-sm text-zinc-400 flex items-center gap-2 cursor-pointer">
              <IconPlus />
              {archivoImagen ? archivoImagen.name : "Seleccionar imagen"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenSeleccionada}
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Tipo (Por Unidad o Combo)"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
            />

            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : editandoId
                  ? "Guardar cambios"
                  : "Agregar producto"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;
