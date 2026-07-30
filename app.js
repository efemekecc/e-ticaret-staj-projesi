const urunGrid = document.querySelector("#urun-grid");
const kategoriMenu = document.querySelector("#kategori-menu");
const siralamaMenu = document.querySelector("#siralama-menu");
const istatistikEkrani = document.querySelector("#istatistik-ekrani");

let urunler = [];

let sepet = JSON.parse(localStorage.getItem("sepet")) || [];

async function urunleriGetir() {
    try {
        const cevap = await fetch('http://localhost:3000/api/urunler');
        const veri = await cevap.json();

        urunler = veri;

        ekranaBas(urunler);
        istatistikleriGuncelle();
    }catch (hata){
        urunGrid.innerHTML = `<h3 style = "color: red; text-align:center;">Hata: Ürünler yüklenemedi!</h3>`;
        console.log("Sunucu hatası", hata);
    }
}
async function kategorileriGetir() {
    try {
        const cevap = await fetch('http://localhost:3000/api/urunler/category')
        const kategoriler = await cevap.json();

        let butonHTML = `
            <button class = "kategori-btn" data-kategori = "hepsi" style = "padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                Tüm Ürünler
            </button>`;

        butonHTML += kategoriler.map(kategori => {
            const kategoriAdi = typeof kategori === 'object' ? kategori.name : kategori;
            return `
                <button class="kategori-btn" data-kategori="${kategoriAdi}" style = "padding: 8px 15px; background: #34495e; color: white; border: none; border-radius: 5px; cursor: pointer; text-transform: capitalize;">
                    ${kategoriAdi}
                </button>
            `;
        }).join("");

        kategoriMenu.innerHTML = butonHTML;

        const kategoriButonlari = document.querySelectorAll(".kategori-btn");
        kategoriButonlari.forEach(buton => {
            buton.addEventListener("click", (event) => {
                const secilenKategori = event.target.dataset.kategori;

                if (secilenKategori === "hepsi") {
                    urunleriGetir();
                } else {
                    kategoriyeGoreGetir(secilenKategori);
                }
            });
        });
    } catch (hata) {
        console.log("Kategoriler çekilemedi:", hata);
    }
}
async function kategoriyeGoreGetir(kategoriAdi) {
    try {
        const cevap = await fetch(`http://localhost:3000/api/urunler/category/${kategoriAdi}`);
        const veri = await cevap.json();

        urunler = veri;
        ekranaBas(urunler);
        istatistikleriGuncelle();
    }catch (hata) {
        console.log("Kategori ürünleri çekilemedi:", hata);
        urunGrid.innerHTML = `<h3 style="color: red; text-align:center;">Hata: Bu kategori yüklenemedi!</h3>`;
    }
}

kategorileriGetir();

function ekranaBas(liste) {
    urunGrid.innerHTML = liste.map(urun => {
        return `
            <div style = "background: white; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction:column; justify-content: space-between;">
                
                <a href="detay.html?id=${urun.id}" style="text-decoration: none; color: inherit; cursor: pointer;">
                    <img src= "${urun.image}" style = "max-width: 100%; height: 175px; object-fit: contain; margin-bottom: 15px;">
                    <h4 style = "margin: 10px 0; font-size: medium; color: #333;">${urun.title.substring(0, 20)}...</h4>
                </a>
                <p style="font-size: large; color: #27ae60; font-weight: bold; margin: 10px 0;">₺${urun.price}</p>
                <button onclick ="sepeteEkle(${urun.id})" style="background: #2c3e50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; transition: 0.3s;">Sepete Ekle</button>
            </div>
        `;
    }).join("");
}
urunleriGetir();

function istatistikleriGuncelle() {
    const toplamFiyat = urunler.reduce((toplam, urun) => toplam + parseFloat(urun.price),0);
    const ortalamaFiyat = (toplamFiyat / urunler.length).toFixed(2);
    istatistikEkrani.innerHTML = `Vitrinimizde <b>${urunler.length}</b> adet ürün, ortalama <b>₺${ortalamaFiyat}</b> fiyatla sergileniyor.`;
}
siralamaMenu.addEventListener("change", (olay) => {
    const secilen = olay.target.value;
    if (secilen ==="ucuz") {
        urunler.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
    }
    else if (secilen === "pahalli") {
        urunler.sort((a,b) => parseFloat(b.price) - parseFloat(a.price));
    }
    ekranaBas(urunler);
});

function sepeteEkle(id) {
    const eklenenUrun = urunler.find(urun => urun.id === id);

    if(eklenenUrun) {
        sepet.push(eklenenUrun);
        localStorage.setItem("sepet", JSON.stringify(sepet));
        sepetiGuncelle();
        sepetiEkranaBas();
        alert(`${ekleneUrun.title.substring(0, 15)} sepete eklendi`);
    }
}
function sepetiGuncelle() {
    const sepetSayaci = document.getElementById("sepet-sayma");
    if (sepetSayaci) {
        sepetSayaci.innerText = `Sepet: ${sepet.length} Ürün`;
    }
}
sepetiGuncelle();

function sepetiAc() {
    document.getElementById("sepet-modal").style.display = "block";
    sepetiEkranaBas();
}

function sepetiKapat() {
    document.getElementById("sepet-modal").style.display = "none";
}

function sepetiEkranaBas () {
    const sepetIcerik = document.querySelector("#sepet-icerik");
    const sepetToplam = document.querySelector("#sepet-toplam");

    if (sepet.length === 0) {
        sepetIcerik.innerHTML = "<p style='text-align: center; color:#7f8c8d;'>Sepetinizde ürün bulunmuyor.</p>";
        sepetToplam.innerHTML = "₺0.00";
        return;
    }
    let toplamFiyat = 0;

    sepetIcerik.innerHTML = sepet.map((urun, index) => {
        toplamFiyat += Number(urun.price);
        return `
            <div style = "display: flex; justify-content: space-between; align-items: center; amrgin-bottom: 12px; border-bottom: 1px solid #f1f2f6; padding-bottom: 8px;">
                <div style = "display: flex; align-items: center; gap: 10px">
                    <img src = "${urun.image}" style = "width: 40px; height: 40px; object-fit: contain; border-radius: 5px;">
                    <span style = "font-size: medium; color: #333;"> ${urun.title.substring(0, 15)}...</span>
                </div>
                <div style = "display: flex; align-items: center; gap: 12px;">
                    <strong style = "color: #27ae60;">₺${urun.price}</strong>
                    <button onclick = "sepettenSil(${index})" style = "background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 4px 8px; font-weight: bold; transition: 0.2s;">X</button>
                </div>
            </div>
            `;
    }).join("");

    sepetToplam.innerText = `₺${toplamFiyat.toFixed(2)}`;
}
function sepettenSil(index) {
    sepet.splice(index, 1);
    localStorage.setItem("sepet", JSON.stringify(sepet));

    sepetiGuncelle();
    sepetiEkranaBas();
}