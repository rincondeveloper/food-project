function ProductCard({ producto, onAgregar }) {
  return (
    <div className="bg-white rounded-2xl p-4">
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/images/${producto.imagen}`}
        alt={producto.nombre}
        className="w-full h-40 object-cover rounded-xl"
      />

      <div className="flex justify-between items-baseline mt-2">
        <h3 className="text-lg font-bold">{producto.nombre}</h3>
        <span className="text-xs bg-gray-100 text-black px-2 py-1 rounded-md">
          {producto.tipo}
        </span>
      </div>

      <p className="text-sm text-zinc-600 mt-1">{producto.descripcion}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-black font-bold text-lg">
          ${producto.precio} MXM
        </span>

        <button
          onClick={() => onAgregar(producto)}
          className="bg-red-600 text-white px-12 py-2 rounded-xl text-sm font-semibold"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
