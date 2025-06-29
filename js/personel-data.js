// Personel Bilgi Dosyası
const personelData = [
    // MUĞLA - MARMARİS
    {
        id: 1,
        ad: "Ahmet",
        soyad: "Ünal",
        telefon: "5458646613",
        hizmetTipi: ["gunluk", "onarim"],
        bolgeler: ["1", "2", "3"], // Armutalan, Beldibi, Siteler
        aktif: false,
        yas: 32,
        beceriler: ["elektrik", "tesisat", "boyama"]
    },
    {
        id: 11,
        ad: "Mehmet",
        soyad: "Yıldız",
        telefon: "5458888888",
        hizmetTipi: ["onarim"],
        bolgeler: ["1"], // Armutalan
        aktif: false,
        yas: 28,
        beceriler: ["marangozluk", "boyama"]
    },
    {
        id: 12,
        ad: "Ayşe",
        soyad: "Kaya",
        telefon: "5458646613",
        hizmetTipi: ["gunluk"],
        bolgeler: ["1"], // Armutalan
        aktif: false,
        deneyim: "3 yıl",
        beceriler: ["temizlik", "yemek", "bakım"]
    },
    {
        id: 2,
        ad: "Mehmet",
        soyad: "Yılmaz",
        telefon: "5458646613",
        hizmetTipi: ["onarim", "gunluk"],
        bolgeler: ["1", "2"], // İçmeler, Turunç
        aktif: false,
        deneyim: "5 yıl",
        beceriler: ["elektrik", "tesisat", "boyama"]
    },
    {
        id: 3,
        ad: "Ayşe",
        soyad: "Demir",
        telefon: "5053893604",
        hizmetTipi: ["gunluk"],
        bolgeler: ["48006", "48007"], // Merkez, Hisarönü
        aktif: false,
        deneyim: "3 yıl",
        beceriler: ["temizlik", "yemek", "bakım"]
    },
    {
        id: 4,
        ad: "Ali",
        soyad: "Kaya",
        telefon: "5458646613",
        hizmetTipi: ["onarim"],
        bolgeler: ["48008"], // Orhaniye
        aktif: false,
        deneyim: "6 yıl",
        beceriler: ["marangozluk", "boyama"]
    },

    // İSTANBUL - KADIKÖY
    {
        id: 5,
        ad: "Emre",
        soyad: "Özkan",
        telefon: "5321234567",
        hizmetTipi: ["onarim", "gunluk"],
        bolgeler: ["34710", "34711", "34712"], // Kadıköy merkez mahalleleri
        aktif: false,
        deneyim: "7 yıl",
        beceriler: ["elektrik", "tesisat", "klima"]
    },
    {
        id: 6,
        ad: "Zeynep",
        soyad: "Aydın",
        telefon: "5439876543",
        hizmetTipi: ["gunluk"],
        bolgeler: ["34713", "34714"], // Kadıköy
        aktif: false,
        deneyim: "4 yıl",
        beceriler: ["temizlik", "organizasyon"]
    },

    // ANKARA - ÇANKAYA
    {
        id: 7,
        ad: "Murat",
        soyad: "Şahin",
        telefon: "5551234567",
        hizmetTipi: ["onarim"],
        bolgeler: ["06550", "06551"], // Çankaya
        aktif: false,
        deneyim: "10 yıl",
        beceriler: ["elektrik", "elektronik", "tesisat"]
    },

    // İZMİR - KONAK
    {
        id: 8,
        ad: "Fatma",
        soyad: "Yıldız",
        telefon: "5327654321",
        hizmetTipi: ["gunluk", "onarim"],
        bolgeler: ["35220", "35221"], // Konak
        aktif: false,
        deneyim: "6 yıl",
        beceriler: ["temizlik", "elektrik"]
    },

    // ANTALYA - MURATPAŞA
    {
        id: 9,
        ad: "Okan",
        soyad: "Çelik",
        telefon: "5421234567",
        hizmetTipi: ["onarim"],
        bolgeler: ["07070", "07071"], // Muratpaşa
        aktif: false,
        deneyim: "8 yıl",
        beceriler: ["boyama", "marangozluk", "tesisat"]
    },

    // BURSA - NİLÜFER
    {
        id: 10,
        ad: "Selin",
        soyad: "Koç",
        telefon: "5341234567",
        hizmetTipi: ["gunluk"],
        bolgeler: ["16110", "16111"], // Nilüfer
        aktif: false,
        deneyim: "3 yıl",
        beceriler: ["temizlik", "çocuk bakımı"]
    }
];

// Personel arama fonksiyonları
const PersonelService = {
    // Belirli bir mahalle ve hizmet tipine göre personel bul
    findPersonelByLocation: function(mahalleId, hizmetTipi) {
        return personelData.filter(personel => 
            personel.aktif && 
            personel.bolgeler.includes(mahalleId.toString()) && 
            personel.hizmetTipi.includes(hizmetTipi)
        );
    },

    // Tüm aktif personeli getir
    getAllActivePersonel: function() {
        return personelData.filter(personel => personel.aktif);
    },

    // ID'ye göre personel bul
    getPersonelById: function(id) {
        return personelData.find(personel => personel.id === id);
    },

    // Personelin sorumlu olduğu mahalle sayısını getir
    getPersonelLocationCount: function(personelId) {
        const personel = this.getPersonelById(personelId);
        return personel ? personel.bolgeler.length : 0;
    }
};
