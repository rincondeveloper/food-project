const express = require('express');
const router = express.Router();
const pool = require('../db');


// ==========================
// GET TODOS LOS PRODUCTOS
// ==========================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY id ASC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al obtener productos'
    });
  }
});


// ==========================
// GET PRODUCTO POR ID
// ==========================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al buscar producto'
    });
  }
});


// ==========================
// CREAR PRODUCTO
// ==========================
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, imagen, tipo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO productos
      (nombre, descripcion, precio, imagen, tipo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nombre, descripcion, precio, imagen, tipo]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al crear producto'
    });
  }
});


// ==========================
// EDITAR PRODUCTO
// ==========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, tipo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE productos
       SET nombre = $1,
           descripcion = $2,
           precio = $3,
           imagen = $4,
           tipo = $5
       WHERE id = $6
       RETURNING *`,
      [nombre, descripcion, precio, imagen, tipo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al actualizar producto'
    });
  }
});


// ==========================
// ELIMINAR PRODUCTO
// ==========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto eliminado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al eliminar producto'
    });
  }
});

module.exports = router;