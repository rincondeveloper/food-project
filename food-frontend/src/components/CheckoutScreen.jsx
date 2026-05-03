import { useState } from "react";

const IconX = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

function MapaActualizable({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 17);
  return null;
}

function CheckoutScreen({ carrito, onCerrar, onConfirmar }) {
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [linkMaps, setLinkMaps] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    nombre: "",
    expiracion: "",
    cvv: "",
  });
  const [confirmado, setConfirmado] = useState(false);

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0
  );

  const formatearNumero = (val) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };

  const formatearExpiracion = (val) => {
    const limpio = val.replace(/\D/g, "").slice(0, 4);
    if (limpio.length >= 3) return limpio.slice(0, 2) + "/" + limpio.slice(2);
    return limpio;
  };

  const extraerCoordenadas = (url) => {
    // Formato /@lat,lng
    const match1 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match1) return { lat: match1[1], lng: match1[2] };

    // Formato ?q=lat,lng
    const match2 = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match2) return { lat: match2[1], lng: match2[2] };

    return null;
  };

  const handleLinkMaps = (valor) => {
    setLinkMaps(valor);
    const coords = extraerCoordenadas(valor);
    if (coords) {
      setCoordenadas(coords);
      setDireccion(valor);
    } else {
      setCoordenadas(null);
      setDireccion(valor);
    }
  };

  const handleConfirmar = async () => {
    if (!email || !direccion || !tarjeta.numero || !tarjeta.nombre || !tarjeta.expiracion || !tarjeta.cvv) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const payload = {
      correo_cliente: email,
      direccion_entrega: direccion,
      total: total,
      items: carrito.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio),
        personalizacion: item.notas || null,
      })),
    };

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) throw new Error("Error al crear el pedido");

      if (onConfirmar) onConfirmar();
      setConfirmado(true);
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al procesar tu pedido. Intenta de nuevo.");
    }
  };

  // PANTALLA DE ÉXITO
  if (confirmado) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-100 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white mb-6">
          <IconCheck />
        </div>
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">¡Pedido confirmado!</h2>
        <p className="text-zinc-500 mb-1">Te enviamos un resumen a</p>
        <p className="text-red-600 font-semibold mb-6">{email}</p>
        <p className="text-zinc-400 text-sm">Tu orden está en camino 🚀</p>
        <button
          onClick={() => {
            setConfirmado(false);
            onCerrar();
          }}
          className="mt-10 bg-red-600 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-100">
      {/* HEADER */}
      <header className="bg-red-600 text-white flex items-center gap-3 p-4 shadow-md shrink-0">
        <button onClick={onCerrar} className="text-white">
          <IconX />
        </button>
        <h2 className="text-xl font-bold italic">Checkout</h2>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-md mx-auto w-full space-y-4 pb-32">

          {/* RESUMEN DEL PEDIDO */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-zinc-800 mb-3">Resumen del pedido</h3>
            <div className="space-y-3">
              {carrito.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-zinc-800 text-sm">
                        {item.nombre}
                        <span className="ml-2 text-zinc-400 font-normal">x{item.cantidad}</span>
                      </p>
                      {item.notas && (
                        <p className="text-xs text-zinc-400 italic mt-0.5">📝 {item.notas}</p>
                      )}
                    </div>
                    <p className="font-semibold text-zinc-800 text-sm ml-4">
                      ${(Number(item.precio) * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-100 mt-3 pt-3 flex justify-between font-bold text-zinc-800">
              <span>Total</span>
              <span className="text-red-600">${total.toFixed(2)}</span>
            </div>
          </section>

          {/* EMAIL */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <IconMail />
              <h3 className="font-bold text-zinc-800">Correo electrónico</h3>
            </div>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
            />
          </section>

          {/* UBICACIÓN */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <IconMap />
              <h3 className="font-bold text-zinc-800">Dirección de entrega</h3>
            </div>
            <input
              type="text"
              placeholder="Pega aquí el link de Google Maps..."
              value={linkMaps}
              onChange={(e) => handleLinkMaps(e.target.value)}
              className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400 mb-3"
            />

            {/* MAPA PREVIEW */}
            {coordenadas ? (
              <div className="rounded-xl overflow-hidden border border-zinc-100 h-44">
                <iframe
                  title="Mapa"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(coordenadas.lng) - 0.005},${Number(coordenadas.lat) - 0.005},${Number(coordenadas.lng) + 0.005},${Number(coordenadas.lat) + 0.005}&layer=mapnik&marker=${coordenadas.lat},${coordenadas.lng}`}
                />
              </div>
            ) : linkMaps.includes("goo.gl") || linkMaps.includes("maps.app") ? (
              <div className="rounded-xl bg-zinc-100 h-44 flex flex-col items-center justify-center text-zinc-400 text-sm gap-2">
                <IconMap />
                <p>Link recibido ✓</p>
                <p className="text-xs text-center px-4">Se guardará tal cual para el repartidor.</p>
              </div>
            ) : (
              <div className="rounded-xl bg-zinc-100 h-44 flex items-center justify-center text-zinc-400 text-sm">
                <p>El mapa aparecerá aquí</p>
              </div>
            )}

            <p className="text-xs text-zinc-400 mt-2">
              Abre Google Maps → mantén presionado tu ubicación → Compartir → copia el link y pégalo aquí.
            </p>
          </section>

          {/* TARJETA */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <IconCard />
              <h3 className="font-bold text-zinc-800">Datos de pago</h3>
            </div>

            {/* VISTA PREVIA DE TARJETA */}
            <div className="bg-linear-to-br from-zinc-800 to-zinc-600 rounded-2xl p-4 text-white mb-4 h-36 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-400 uppercase tracking-widest">Débito / Crédito</p>
                <div className="flex">
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                  <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-80 -ml-2" />
                </div>
              </div>
              <p className="text-lg font-mono tracking-widest">
                {tarjeta.numero || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between text-xs text-zinc-300">
                <span>{tarjeta.nombre || "NOMBRE DEL TITULAR"}</span>
                <span>{tarjeta.expiracion || "MM/AA"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={tarjeta.numero}
                onChange={(e) => setTarjeta({ ...tarjeta, numero: formatearNumero(e.target.value) })}
                className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400 font-mono"
              />
              <input
                type="text"
                placeholder="Nombre del titular"
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={tarjeta.expiracion}
                  onChange={(e) => setTarjeta({ ...tarjeta, expiracion: formatearExpiracion(e.target.value) })}
                  className="w-1/2 bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={4}
                  value={tarjeta.cvv}
                  onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className="w-1/2 bg-zinc-100 rounded-xl px-3 py-2.5 text-base outline-none text-zinc-700 placeholder:text-zinc-400"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Pago simulado — no se realizará ningún cargo real.
            </p>
          </section>

        </div>
      </main>

      {/* FOOTER FIJO */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirmar}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-base"
          >
            Confirmar pedido · ${total.toFixed(2)}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default CheckoutScreen;