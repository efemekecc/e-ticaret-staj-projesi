const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
app.use(cors());
app.use(express.json());

app.get('/api/urunler', async (req, res) => {
    try {
        const [urunler] = await db.query('SELECT * FROM products');
        res.json(urunler);
    }catch(hata) {
        console.error("Ürünleri çekerken hata:", hata);
        res.status(500).json({ mesaj: "Sunucu hatası oluştu"});
    }
});

app.get('/api/urunler/category', async (req, res) => {
    try {
    const [kategoriler] = await db.query('SELECT name FROM categories');
    const kategoriIsimleri = kategoriler.map(kategori => kategori.name);
    res.json(kategoriIsimleri);
    } catch (hata){
        console.error("Kategorileri çekerken hata:", hata);
        res.status(500).json({ mesaj: "Sunucu hatası oluştu"});
    }
});

app.get('/api/urunler/category/:kategoriAdi', async (req, res) => {
    try{
    const secilenKategori = req.params.kategoriAdi;
    const sqlSorgusu = `
            SELECT products.* 
            FROM products 
            JOIN categories ON products.category_id = categories.id 
            WHERE categories.name = ?
        `;
    
    const [filtrelenmisUrunler] = await db.query(sqlSorgusu, [secilenKategori]);
    res.json(filtrelenmisUrunler);
    } catch (hata) {
        console.error("Filtreleme sırasında hata:", hata);
        res.status(500).json({ mesaj: "Sunucu hatsı oluştu"});
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Yerel API başarıyla çalışıyor: http://localhost:${PORT}/api/urunler`);
});