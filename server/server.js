const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
// Conectar a la base de datos SQLite
const db = new sqlite3.Database('tareas.db', (err) => {
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

app.post('/tareas', (req, res) => {
    const { nombre, dia, hora } = req.body;  // Se extraen los nuevos campos del cuerpo de la solicitud
    const query = `INSERT INTO tareas (nombre, dia, hora, completada) VALUES (?, ?, ?, ?)`;
  
    db.run(query, [nombre, dia, hora, 0], function (err) {  // 'completada' se inicializa a 0 por defecto
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({ 
        id: this.lastID, 
        nombre, 
        dia, 
        hora, 
        completada: 0 
      });
    });
  });

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


app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tareas WHERE id = ?`;
    db.run(query, id, function (err) {
    if (err) {
    
    res.status(400).json({ error: err.message });
    return;
    }
    res.json({ message: 'Tarea eliminada correctamente' });
    });
});