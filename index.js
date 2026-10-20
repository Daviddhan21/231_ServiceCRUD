import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = 3000;

// Middleware wajib agar Express bisa membaca format JSON dari req.body
app.use(express.json());

// Konfigurasi Database PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Mahasiswa',
  password: 'admin123',
  port: 5432,
});

// 1. GET: Ambil Semua Data Biodata
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM biodata');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2. POST: Tambah Data Biodata Baru
app.post('/biodata', async (req, res) => {
  const { nama, nim, kelas } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
      [nama, nim, kelas]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 3. PUT: Update Data Biodata Berdasarkan ID
app.put('/biodata/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas } = req.body;
  try {
    const result = await pool.query(
      'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
      [nama, nim, kelas, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 4. DELETE: Hapus Data Biodata Berdasarkan ID
app.delete('/biodata/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM biodata WHERE id = $1', [id]);
    res.send('Data berhasil dihapus');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});