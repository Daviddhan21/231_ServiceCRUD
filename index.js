import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;
const { Pool } = pg;

// Middleware parsing JSON & URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Mahasiswa',
  password: 'admin123', // Ganti dengan password PostgreSQL kamu
  port: 5432,
});

// 1. GET ALL (Ambil semua data biodata)
app.get('/', (req, res) => {
  console.log("TEST DATA:");
  pool.query('SELECT * FROM biodata ORDER BY id ASC')
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// 2. POST (Tambah data biodata baru)
app.post('/biodata', (req, res) => {
  const { nama, nim, kelas } = req.body;
  pool.query(
    'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
    [nama, nim, kelas]
  )
    .then(result => res.status(201).json(result.rows[0]))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// 3. PUT (Update data biodata berdasarkan ID)
app.put('/biodata/:id', (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas } = req.body;
  pool.query(
    'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
    [nama, nim, kelas, id]
  )
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
        message: "Data berhasil diupdate",
        data: result.rows[0]
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// 4. DELETE (Hapus data biodata berdasarkan ID)
app.delete('/biodata/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    'DELETE FROM biodata WHERE id = $1 RETURNING *',
    [id]
  )
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
        message: "Data berhasil dihapus",
        data: result.rows[0]
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Jalankan Server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});