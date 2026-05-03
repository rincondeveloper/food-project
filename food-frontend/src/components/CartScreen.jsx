import { useState } from "react";

const IconX = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMinus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconBag = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

function CartScreen({
  carrito,
  onCerrar,
  onActualizarCantidad,
  onEliminar,
  onActualizarNotas,
  onContinuar,
}) {
  const [notasAbiertas, setNotasAbiertas] = useState({});

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0,
  );

  const toggleNotas = (id) => {
    setNotasAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-100">
      <header className="bg-red-600 text-white flex items-center gap-3 p-4 shadow-md">
        <button onClick={onCerrar} className="text-white">
          <IconX />
        </button>
        <h2 className="text-xl font-bold italic">Tu pedido</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full">
        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 pt-20">
            <IconBag />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm">Agrega algo rico 🍔</p>
            <button
              onClick={onCerrar}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
            >
              Ver menú
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {carrito.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex gap-3">
                  {item.imagen && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/images/${item.imagen}`}
                      alt={item.nombre}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-zinc-800 leading-tight">
                        {item.nombre}
                      </p>
                      <button
                        onClick={() => onEliminar(item.id)}
                        className="text-zinc-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <IconTrash />
                      </button>
                    </div>

                    <p className="text-sm text-zinc-400 mt-0.5">
                      ${Number(item.precio).toFixed(2)} c/u
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-2 py-1">
                        <button
                          onClick={() =>
                            onActualizarCantidad(item.id, item.cantidad - 1)
                          }
                          className="text-red-600 font-bold w-6 h-6 flex items-center justify-center"
                        >
                          <IconMinus />
                        </button>
                        <span className="w-5 text-center font-semibold text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            onActualizarCantidad(item.id, item.cantidad + 1)
                          }
                          className="text-red-600 font-bold w-6 h-6 flex items-center justify-center"
                        >
                          <IconPlus />
                        </button>
                      </div>

                      <p className="font-bold text-zinc-800">
                        ${(Number(item.precio) * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => toggleNotas(item.id)}
                    className="text-xs text-red-500 font-medium flex items-center gap-1"
                  >
                    +{" "}
                    {item.notas
                      ? "Editar instrucciones"
                      : "Agregar instrucciones"}
                  </button>
                  {notasAbiertas[item.id] && (
                    <textarea
                      className="mt-2 w-full text-base bg-zinc-100 rounded-xl p-2 resize-none outline-none text-zinc-700 placeholder:text-zinc-400"
                      rows={2}
                      placeholder="Ej: sin cebolla, poca mostaza..."
                      value={item.notas || ""}
                      onChange={(e) =>
                        onActualizarNotas(item.id, e.target.value)
                      }
                    />
                  )}
                  {item.notas && !notasAbiertas[item.id] && (
                    <p className="text-xs text-zinc-400 mt-1 italic">
                      📝 {item.notas}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {carrito.length > 0 && (
        <footer className="p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onContinuar}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
            >
              Continuar pedido
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default CartScreen;
