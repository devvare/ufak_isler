# Ufak İşler - Dinamik Konum Bazlı Hizmet Sayfaları

## 🎯 Proje Özeti

Bu geliştirme, Ufak İşler web sitesine dinamik konum bazlı hizmet sayfaları sistemi ekler. Kullanıcılar hizmet tipi seçip konum belirleyerek, o bölgedeki personel durumuna göre özelleştirilmiş sayfalar görürler.

## 🚀 Yeni Özellikler

### 1. Dinamik Sayfa Sistemi
- **URL Yapısı:** `/hizmet-bolgesi.html?il=mugla&ilce=marmaris&mahalle=armutalan&mahalleId=48001&tip=gunluk`
- **SEO Optimizasyonu:** Her sayfa için özel başlık, açıklama ve breadcrumb
- **Responsive Tasarım:** Mobil ve masaüstü uyumlu

### 2. Hizmet Tipi Seçimi
- **Modal Arayüz:** Kullanıcı dostu seçim ekranı
- **İki Kategori:** 
  - Onarım ve Tadilat
  - Günlük Yardım ($10 kayıt ücreti)
- **Görsel İkonlar:** Her hizmet için özel simgeler

### 3. Konum Seçici Sistemi
- **3 Aşamalı Seçim:** İl → İlçe → Mahalle
- **Dinamik Yükleme:** Seçime göre alt kategoriler güncellenir
- **Veri Entegrasyonu:** `mahalle.json` ve `il-listesi.json` kullanımı

### 4. Personel Yönetimi
- **Akıllı Eşleştirme:** Mahalle ID ve hizmet tipine göre personel bulma
- **Personel Bilgileri:** Ad, soyad, telefon, uzmanlık alanları
- **Aktif/Pasif Durum:** Personel durumu kontrolü

### 5. WhatsApp Entegrasyonu
- **Otomatik Mesaj:** Konum ve hizmet tipine göre özelleştirilmiş mesajlar
- **Direkt İletişim:** Personel var ise direkt WhatsApp bağlantısı
- **Broşür Paylaşımı:** Personel yok durumunda broşür paylaşımı

## 📁 Dosya Yapısı

### Yeni Dosyalar
```
├── hizmet-bolgesi.html              # Dinamik sayfa template'i
├── js/
│   ├── location-handler.js          # Dinamik sayfa yönetimi
│   └── location-selector.js         # Konum seçici sistemi
├── css/
│   ├── location-page.css           # Dinamik sayfa stilleri
│   └── modal-styles.css            # Modal arayüz stilleri
└── test-dynamic.html               # Test sayfası
```

### Güncellenen Dosyalar
```
├── index.html                      # Hizmet seçimi butonları eklendi
├── js/
│   ├── main.js                     # ServiceTypeSelector ve PageRouter eklendi
│   └── personel-data.js            # Marmaris personel verileri eklendi
```

## 🎮 Kullanım Senaryoları

### Senaryo 1: Personel Mevcut
1. Kullanıcı hizmet tipi seçer (Onarım/Günlük Yardım)
2. Konum seçer (İl/İlçe/Mahalle)
3. Sistem personel bulur
4. Personel bilgileri ve WhatsApp linki gösterilir
5. Kullanıcı direkt iletişime geçer

### Senaryo 2: Personel Yok
1. Kullanıcı hizmet tipi ve konum seçer
2. Sistem personel bulamaz
3. İş fırsatı sayfası gösterilir
4. Başvuru formu ve broşür paylaşım seçenekleri sunulur

## 🔧 Teknik Detaylar

### JavaScript Sınıfları
- **LocationHandler:** Dinamik sayfa içeriği yönetimi
- **ServiceTypeSelector:** Hizmet tipi seçim modal'ı
- **LocationSelector:** Konum seçim sistemi
- **PageRouter:** URL yönlendirme ve parametre yönetimi
- **PersonelService:** Personel veri işlemleri

### CSS Modülleri
- **location-page.css:** Dinamik sayfa stilleri
- **modal-styles.css:** Modal arayüz stilleri
- Responsive tasarım ve animasyonlar

### Veri Yapısı
```javascript
// Personel Verisi
{
    id: 1,
    ad: "Mehmet",
    soyad: "Yılmaz", 
    telefon: "5458646613",
    hizmetTipi: ["onarim", "gunluk"],
    bolgeler: ["48001", "48002"],
    aktif: true,
    deneyim: "5 yıl",
    uzmanlik: ["elektrik", "tesisat"]
}
```

## 🧪 Test Etme

### Test Sayfası
`test-dynamic.html` sayfasını kullanarak farklı senaryoları test edebilirsiniz:

1. **Personel Var Durumu:** Marmaris bölgesi test linkleri
2. **Personel Yok Durumu:** İş fırsatı sayfası test linkleri
3. **Ana Sayfa Entegrasyonu:** Hizmet seçimi butonları

### Test URL'leri
```
# Personel Var
/hizmet-bolgesi.html?il=mugla&ilce=marmaris&mahalle=armutalan&mahalleId=48001&tip=onarim

# Personel Yok  
/hizmet-bolgesi.html?il=mugla&ilce=marmaris&mahalle=merkez&mahalleId=48999&tip=gunluk&durum=personel-yok
```

## 🎨 SEO ve Kullanıcı Deneyimi

### SEO Optimizasyonu
- Dinamik sayfa başlıkları
- Meta açıklamaları
- Breadcrumb navigasyonu
- Yapılandırılmış veri hazırlığı

### UX İyileştirmeleri
- Sezgisel modal arayüzler
- Görsel geri bildirimler
- Mobil uyumlu tasarım
- Hızlı yükleme süreleri

## 🚀 Gelecek Geliştirmeler

1. **Admin Paneli:** Personel yönetimi arayüzü
2. **Gelişmiş Filtreleme:** Hizmet alt kategorileri
3. **Harita Entegrasyonu:** Konum görselleştirme
4. **Bildirim Sistemi:** Yeni personel ekleme bildirimleri
5. **Analytics:** Sayfa performans takibi

## 📞 İletişim

- **WhatsApp:** +90 545 864 6613
- **E-posta:** info@ufakisler.com
- **Web:** ufakisler.com

---

**Not:** Bu sistem Marmaris bölgesi için optimize edilmiştir ve gelecekte diğer bölgelere genişletilebilir.
