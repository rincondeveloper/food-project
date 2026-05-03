const express = require('express');
const router = express.Router();
const pool = require('../db');
const { enviarCorreoConfirmacion } = require('../utils/mailer');

// POST CREAR PEDIDO
router.post('/', async (req, res) => {
  const { nombre_cliente, correo_cliente, direccion_entrega, total, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El pedido no tiene productos' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `INSERT INTO pedido (nombre_cliente, correo_cliente, direccion_entrega, total)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre_cliente, correo_cliente, direccion_entrega, total]
    );

    const pedido = pedidoResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, personalizacion)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedido.id, item.producto_id, item.cantidad, item.precio_unitario, item.personalizacion || null]
      );
    }

    await client.query('COMMIT');

    const itemsConNombre = await client.query(
      `SELECT d.cantidad, d.precio_unitario, d.personalizacion, pr.nombre
       FROM detalle_pedido d
       JOIN productos pr ON pr.id = d.producto_id
       WHERE d.pedido_id = $1`,
      [pedido.id]
    );

    await enviarCorreoConfirmacion({
      correo_cliente: pedido.correo_cliente,
      pedido,
      items: itemsConNombre.rows,
    });

    res.status(201).json({ mensaje: 'Pedido creado correctamente', pedido });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  } finally {
    client.release();
  }
});

module.exports = router;