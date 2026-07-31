function formGoster(tur) {
    const girisFormu = document.querySelector("#form-giris");
    const kayitFormu = document.querySelector("#form-kayit");
    const girisBtn = document.querySelector("#btn-giris");
    const kayitBtn = document.querySelector("#btn-kayit");

    if (tur === 'giris') {
        girisFormu.style.display = "block";
        kayitFormu.style.display = "none";
        girisBtn.style.borderBottom = "3px solid #27ae60";
        girisBtn.style.color = "#27ae60";
        kayitBtn.style.borderBottom = "none"
        kayitBtn.style.color = "#7f8c8d";
    } else {
        girisFormu.style.display = "none";
        kayitFormu.style.display = "block";
        kayitBtn.style.borderBottom = "3px solid #2980b9";
        kayitBtn.style.color = "#2980b9";
        girisBtn.style.borderBottom = "none";
        girisBtn.style.color = "#7f8c8d";
    }
}

async function kayitOl() {
    const name = document.querySelector("#kayit-ad").value;
    const surname = document.querySelector("#kayit-soyad").value;
    const email = document.querySelector("#kayit-email").value;
    const password = document.querySelector("#kayit-sifre").value;

    if (!name || !surname || !email || !password) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        const cevap = await fetch("http://localhost:3000/api/register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({name, surname, email, password })
        });
        const sonuc = await cevap.json();

        if (cevap.ok) {
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        } else {
            alert(sonuc.mesaj || "Kayıt sırasında bir hata oluştu.");
        }
    } catch (hata) {
        console.error("Hata:", hata);
        alert("Sunucuya bağlanılamadı!");
    }
}

async function girisYap() {
    const email = document.querySelector("#giris-email").value;
    const password = document.querySelector("#giris-sifre").value;

    if(!email || !password) {
        alert("Lütfen e-posta ve şifrenizi girin!");
        return;
    }

    try {
        const cevap = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const sonuc = await cevap.json();

        if (cevap.ok) {
            alert(`Hoş geldiniz, ${sonuc.kullanici.name}`);
            localStorage.setItem("aktifKullanici", JSON.stringify(sonuc.kullanici));
            window.location.href = "index.html";
        } else {
            alert(sonuc.mesaj || "Giriş Başarısız.");
        }
    } catch (hata) {
        console.error("Hata: ",hata);
        alert("Suncuya bağlanılamadı!");
    }
}