const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const enviarCorreoConfirmacion = async ({ correo_cliente, pedido, items }) => {
  const itemsHTML = items.map((item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${item.nombre}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.cantidad}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">$${Number(item.precio_unitario).toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; color: #888; font-style: italic;">${item.personalizacion || '—'}</td>
    </tr>
  `).join('');

  const htmlCliente = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
      <div style="background: #dc2626; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-style: italic;">Burger Boys</h1>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0;">
        <h2 style="color: #18181b;">¡Tu pedido fue confirmado! 🎉</h2>
        <p style="color: #52525b;">Número de orden: <strong>#${pedido.id}</strong></p>
        <p style="color: #52525b;">Dirección de entrega: <strong>${pedido.direccion_entrega}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f4f4f5;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
              <th style="padding: 8px; text-align: left;">Notas</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>
        <div style="margin-top: 16px; text-align: right; font-size: 18px; font-weight: bold; color: #dc2626;">
          Total: $${Number(pedido.total).toFixed(2)}
        </div>
        <p style="color: #52525b; margin-top: 24px;">¡Gracias por tu pedido! Estamos preparándolo 🚀</p>
      </div>
    </div>
  `;

  const htmlAdmin = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
      <div style="background: #18181b; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">Nuevo pedido #${pedido.id}</h1>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0;">
        <p><strong>Cliente:</strong> ${pedido.correo_cliente}</p>
        <p><strong>Dirección:</strong> ${pedido.direccion_entrega}</p>
        <p><strong>Estado:</strong> ${pedido.estado}</p>
        <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString('es-MX')}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f4f4f5;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
              <th style="padding: 8px; text-align: left;">Notas</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>
        <div style="margin-top: 16px; text-align: right; font-size: 18px; font-weight: bold;">
          Total: $${Number(pedido.total).toFixed(2)}
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Burger Boys" <${process.env.MAIL_USER}>`,
    to: correo_cliente,
    subject: `¡Tu pedido #${pedido.id} fue confirmado! 🍔`,
    html: htmlCliente,
  });

  await transporter.sendMail({
    from: `"Burger Boys" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `Nuevo pedido #${pedido.id} recibido`,
    html: htmlAdmin,
  });
};

module.exports = { enviarCorreoConfirmacion };