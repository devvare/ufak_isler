// Dinamik Konum Sayfası Yönetimi
class LocationHandler {
    constructor() {
        this.currentLocation = null;
        this.currentServiceType = null;
        this.broşürUrl = "https://example.com/ufak-isler-brosur.pdf"; // Broşür URL'i
        this.init();
    }

    init() {
        // URL'den parametreleri al
        this.parseUrlParams();
        // Sayfa içeriğini yükle
        this.loadPageContent();
    }

    parseUrlParams() {
        // PageRouter sınıfını kullanarak URL'den konum bilgilerini al
        if (typeof PageRouter !== 'undefined') {
            const locationData = PageRouter.parseLocationFromUrl();
            
            this.currentLocation = {
                il: locationData.il || 'bilinmiyor',
                ilce: locationData.ilce || 'bilinmiyor',
                mahalle: locationData.mahalle || 'bilinmiyor',
                mahalleId: locationData.mahalleId || null
            };
            
            this.currentServiceType = locationData.serviceType || 'gunluk';
            this.personelDurumu = locationData.personelDurumu || null;
        } else {
            // PageRouter yoksa eski yöntemi kullan
            const urlParams = new URLSearchParams(window.location.search);
            
            this.currentLocation = {
                il: urlParams.get('il') || 'bilinmiyor',
                ilce: urlParams.get('ilce') || 'bilinmiyor', 
                mahalle: urlParams.get('mahalle') || 'bilinmiyor',
                mahalleId: urlParams.get('mahalleId') || null
            };
            
            this.currentServiceType = urlParams.get('tip') || 'gunluk';
            this.personelDurumu = urlParams.get('durum') || null;
        }
    }

    loadPageContent() {
        this.updatePageTitle();
        this.updateBreadcrumb();
        this.updateLocationInfo();
        this.checkPersonelAvailability();
    }

    updatePageTitle() {
        const { il, ilce, mahalle } = this.currentLocation;
        const serviceTypeText = this.currentServiceType === 'gunluk' ? 'Günlük Yardım' : 'Onarım ve Tadilat';
        
        const title = `${mahalle.charAt(0).toUpperCase() + mahalle.slice(1)} ${serviceTypeText} Hizmeti - ${ilce.charAt(0).toUpperCase() + ilce.slice(1)}, ${il.charAt(0).toUpperCase() + il.slice(1)} | Ufak İşler`;
        const description = `${mahalle} mahallesinde ${serviceTypeText.toLowerCase()} hizmeti. Ufak İşler ile güvenilir ve uygun fiyatlı çözümler.`;
        
        document.getElementById('page-title').textContent = title;
        document.getElementById('page-description').setAttribute('content', description);
        document.title = title;
    }

    updateBreadcrumb() {
        const { il, ilce, mahalle } = this.currentLocation;
        
        document.getElementById('breadcrumb-il').textContent = il.charAt(0).toUpperCase() + il.slice(1);
        document.getElementById('breadcrumb-ilce').textContent = ilce.charAt(0).toUpperCase() + ilce.slice(1);
        document.getElementById('breadcrumb-mahalle').textContent = mahalle.charAt(0).toUpperCase() + mahalle.slice(1);
    }

    updateLocationInfo() {
        const { il, ilce, mahalle } = this.currentLocation;
        const serviceTypeText = this.currentServiceType === 'gunluk' ? 'Günlük Yardım' : 'Onarım ve Tadilat';
        
        const title = `${mahalle.charAt(0).toUpperCase() + mahalle.slice(1)} - ${serviceTypeText}`;
        const subtitle = `${ilce.charAt(0).toUpperCase() + ilce.slice(1)}, ${il.charAt(0).toUpperCase() + il.slice(1)} bölgesinde ${serviceTypeText.toLowerCase()} hizmetleri`;
        
        document.getElementById('location-title').textContent = title;
        document.getElementById('location-subtitle').textContent = subtitle;
    }

    checkPersonelAvailability() {
        if (this.personelDurumu === 'personel-yok') {
            this.showNoPersonelSection();
            return;
        }

        // PersonelService'i kullanarak personel ara
        if (typeof PersonelService !== 'undefined' && this.currentLocation.mahalleId) {
            const availablePersonel = PersonelService.findPersonelByLocation(
                this.currentLocation.mahalleId, 
                this.currentServiceType
            );

            if (availablePersonel.length > 0) {
                this.showPersonelSection(availablePersonel); // Tüm personelleri göster
            } else {
                this.showNoPersonelSection();
            }
        } else {
            // Varsayılan olarak personel yok durumunu göster
            this.showNoPersonelSection();
        }
    }

    showPersonelSection(personelList) {
        document.getElementById('personel-var-section').style.display = 'block';
        document.getElementById('personel-yok-section').style.display = 'none';

        // Personel listesini güncelle
        const personelListesi = document.getElementById('personel-listesi');
        personelListesi.innerHTML = '';
        
        // Her personel için kart oluştur
        personelList.forEach(personel => {
            const personelCard = document.createElement('div');
            personelCard.className = 'personel-card';
            
            // Hizmet tiplerini metin olarak dönüştür
            const hizmetTipleri = personel.hizmetTipi.map(tip => 
                tip === 'gunluk' ? 'Günlük Yardım' : 'Onarım ve Tadilat'
            ).join(', ');
            
            // Beceri alanlarını metin olarak dönüştür
            const beceriAlanlari = personel.beceriler ? personel.beceriler.map(alan => {
                switch(alan) {
                    case 'elektrik': return 'Elektrik';
                    case 'tesisat': return 'Su Tesisatı';
                    case 'boyama': return 'Boya/Badana';
                    case 'marangozluk': return 'Marangozluk';
                    case 'temizlik': return 'Temizlik';
                    case 'yemek': return 'Yemek';
                    case 'bakım': return 'Bakım';
                    case 'elektronik': return 'Elektronik';
                    case 'klima': return 'Klima';
                    case 'organizasyon': return 'Organizasyon';
                    case 'çocuk bakımı': return 'Çocuk Bakımı';
                    default: return alan.charAt(0).toUpperCase() + alan.slice(1);
                }
            }).join(', ') : '';
            
            // WhatsApp mesajı oluştur
            const whatsappMessage = this.generateWhatsAppMessage(personel);
            
            // Personel kartı içeriğini oluştur
            personelCard.innerHTML = `
                <div class="personel-info">
                    <div class="personel-detay">
                        <div class="personel-card-content">
                            <h4>${personel.ad} ${personel.soyad.charAt(0)}.</h4>
                            <p class="personel-services">
                                <strong>Hizmet Alanları:</strong> ${hizmetTipleri}
                            </p>
                            <p class="personel-experience">
                                <strong>Yaş:</strong> ${personel.yas || 'Belirtilmemiş'}
                            </p>
                            ${beceriAlanlari ? `<p class="personel-expertise">
                                <strong>Beceriler:</strong> ${beceriAlanlari}
                            </p>` : ''}
                        </div>
                    </div>
                    <div class="whatsapp-action">
                        <a href="https://wa.me/90${personel.telefon}?text=${encodeURIComponent(whatsappMessage)}" class="whatsapp-btn">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp ile İletişime Geç
                        </a>
                    </div>
                </div>
            `;
            
            personelListesi.appendChild(personelCard);
        });
    }

    showNoPersonelSection() {
        document.getElementById('personel-var-section').style.display = 'none';
        document.getElementById('personel-yok-section').style.display = 'block';

        // WhatsApp paylaşım linkini ayarla
        const shareMessage = this.generateShareMessage();
        const whatsappShare = document.getElementById('whatsapp-share');
        whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    }

    generateWhatsAppMessage(personel) {
        const { il, ilce, mahalle } = this.currentLocation;
        const serviceTypeText = this.currentServiceType === 'gunluk' ? 'günlük yardım' : 'onarım ve tadilat';
        
        return `Merhaba ${personel.ad} Bey/Hanım,

${mahalle.charAt(0).toUpperCase() + mahalle.slice(1)} mahallesinde ${serviceTypeText} hizmeti almak istiyorum.

Konum: ${mahalle}, ${ilce}, ${il}
Hizmet Türü: ${serviceTypeText.charAt(0).toUpperCase() + serviceTypeText.slice(1)}

Detayları görüşebilir miyiz?

Ufak İşler web sitesi üzerinden ulaştım.`;
    }

    generateShareMessage() {
        const { il, ilce, mahalle } = this.currentLocation;
        
        return `🔧 İş Fırsatı! 

${mahalle.charAt(0).toUpperCase() + mahalle.slice(1)}, ${ilce} bölgesinde Ufak İşler ekibine katılmak ister misiniz?

✅ Küçük onarım işleri
✅ Günlük yardım hizmetleri  
✅ Esnek çalışma saatleri


Detaylar için: ${window.location.origin}/bizimle-calisin.html

#Ufakİşler #İşFırsatı #${ilce}`;
    }


}

// Sayfa yüklendiğinde LocationHandler'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    new LocationHandler();
});
