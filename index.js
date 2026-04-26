const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'okan1234',
  database: 'taskmanager'
})

db.connect((err) => {
  if (err) {
    console.error('Erreur connexion MySQL:', err)
    return
  }
  console.log('Connecté à MySQL !')
})

// GET toutes les tâches
app.get('/taches', (req, res) => {
  db.query('SELECT * FROM taches', (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// POST ajouter une tâche
app.post('/taches', (req, res) => {
  const { texte } = req.body
  db.query('INSERT INTO taches (texte) VALUES (?)', [texte], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ id: result.insertId, texte, faite: false })
  })
})

// PUT modifier une tâche (toggle)
app.put('/taches/:id', (req, res) => {
  const { faite } = req.body
  db.query('UPDATE taches SET faite = ? WHERE id = ?', [faite, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
})

// DELETE supprimer une tâche
app.delete('/taches/:id', (req, res) => {
  db.query('DELETE FROM taches WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
})

// DELETE toutes les tâches
app.delete('/taches', (req, res) => {
  db.query('DELETE FROM taches', (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
})

app.listen(3001, () => {
  console.log('Serveur lancé sur le port 3001')
})