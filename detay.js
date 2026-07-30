const urlParametreleri = new URLSearchParams(window.location.search);
const urunId = urlParametreleri.get('id');
const detayKutusu = document.getElementById("detay-kutusu");

async function urunDetayiniGetir() {
    try {
        const cevap = await fetch(`http://localhost:3000/api/urunler/${urunId}`);
        const urun = await cevap.json();

        detayKutusu.innerHTML = `
            <img src ="${urun.image}" style = "max-width: 100%; height: 350px; object-fit: contain; margin-bottom: 20px;">
            <h1 style = "color: #2c3e50; margin-bottom: 10px;">${urun.title}</h1>
            <h2 style="color: #27ae60; margin-bottom: 20px;">₺${urun.price}</h2>
            
            <div style = "text-align: left; background: #f1f2f6; padding: 20px; border-radius: 8px; color: #555; line-height: 1.6;">
                <h4 style = "margin-top: 0;">Ürün Açıklaması:</h4>
                <p>${urun.description}</p>
            </div>
            
            <button style = "background: #e74c3c; color: white; border: none; padding: 15px 30px; font-size: medium; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 30px; width: 100%;">Sepete Ekle</button>
            `;
    } catch (hata) {
        console.error("Hata:", hata);
        detayKutusu.innerHTML = `<h2 style = "color: red;">Ürün bulunamadı veya sunucu hatası.</h2>`;
    }
}
if (urunId) {
    urunDetayiniGetir();
} else {
    detayKutusu.innerHTML = `<h2 style="color: red;">Geçersiz ürün adresi!</h2>`;
}