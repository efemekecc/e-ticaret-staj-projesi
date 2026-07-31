const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(express.json());
const db = require('./db');
app.use(cors());

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
            LEFT JOIN categories ON products.category_id = categories.id 
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
app.get('/api/urunler/:id', async (req, res) => {
    try {
        const urunId = req.params.id;
        const [urun] = await db.query('SELECT * FROM products WHERE id = ?', [urunId]);

        if (urun.length === 0) {
            return res.status(404).json({ mesaj: "Ürün bulunamadı"});
        }
        res.json(urun[0]);
    } catch (hata) {
        console.error("Ürün detayı çekerken hata:", hata);
        res.status(500).json({ mesaj: "Sunucu hatası oluştu"});
    }
});
app.post('/api/register', async (req, res) => {
    try {
        console.log("Kayıt için gelen veri:", req.body);
        const {name, surname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, surname, email, password, is_active, adddate) VALUES (?, ?, ?, ?, 1, NOW())";
        await db.query(sql, [name, surname, email, hashedPassword]);

        res.status(201).json({ mesaj: "Kayıt işlemi başarılı."});
    } catch (hata) {
        console.error("Kayıt Hatası: ", hata);
        res.status(500).json({ mesaj: "Sunucu hatası veya bu e-posta zaten kullanılıyor."});
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ mesaj: "Böyle bir kullanıcı bulunamadı." });
        }
        const user = users[0];
        if (user.is_active === 0) {
            return res.status(403).json({ mesaj: "Hesabınız askıya alınmış ya da pasif olabilir."});
        }
        const sifreDogruMu = await bcrypt.compare(password, user.password);

        if(!sifreDogruMu) {
            return res.status(401).json({ mesaj: "Şifreniz hatalı, lütfen tekrar deneyin." });
        }
        res.json({
            mesaj: "Giriş başarılı!",
            kullanici: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
        });
    } catch (hata) {
        console.error("Giriş hatası:", hata);
        res.status(500).json({ mesaj: "Gieiş yapılırken sunucu hatası oluştu." });
    }
});

app.listen(PORT, () => {
    console.log(`Yerel API başarıyla çalışıyor: http://localhost:${PORT}/api/urunler`);
});