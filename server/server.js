const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('server/tareas.db', (err) => {
if (err) {
console.error('Error al abrir la base de datos:', err.message);
} else {
console.log('Conexión exitosa a la base de datos SQLite.');
}
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Configuración
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Ruta
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
  });

//Métodos

//GET: Obtener la lista de tareas
app.get('/tareas', (req, res) => {
    const query = `SELECT * FROM tareas`;
    db.all(query, [], (err, rows) => {
    if (err) {
    res.status(400).json({ error: err.message });
    return;
    }
    res.json({ tareas: rows });
    });
});


// POST: Agregar una nueva tarea
app.post('/tareas', (req, res) => {
  const { descripcion } = req.body;
  const query = `INSERT INTO tareas (descripcion, completada) VALUES (?, 0)`;  // Completada por defecto es 0 (no completada)
  db.run(query, [descripcion], function (err) {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID, descripcion, completada: 0 });
  });
});

// PUT: Actualizar una tarea (completar o descompletar)
app.put('/tareas', (req, res) => {
  const { descripcion, completada } = req.body;
  const query = `UPDATE tareas SET completada = ? WHERE descripcion = ?`;
  db.run(query, [completada, descripcion], function (err) {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({ message: 'Tarea actualizada correctamente' });
  });
});

// DELETE: Eliminar una tarea
app.delete('/tareas', (req, res) => {
  const { descripcion } = req.body;
  const query = `DELETE FROM tareas WHERE descripcion = ?`;
  db.run(query, [descripcion], function (err) {
      if (err) {
          res.status(400).json({ error: err.message });
          return;
      }
      res.json({ message: 'Tarea eliminada correctamente' });
  });
});