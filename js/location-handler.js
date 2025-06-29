// Dinamik Konum Sayfası Yönetimi
class LocationHandler {
    constructor() {
        this.currentLocation = null;
        this.currentServiceType = null;
        this.broşürUrl = "https://example.com/ufak-isler-brosur.pdf"; // Broşür URL'i
        this.baseUrl = window.location.origin;
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
            
            // URL parametrelerini temizle (SEO için önemli)
            this.currentLocation = {
                il: this.cleanUrlParam(urlParams.get('il')) || 'bilinmiyor',
                ilce: this.cleanUrlParam(urlParams.get('ilce')) || 'bilinmiyor', 
                mahalle: this.cleanUrlParam(urlParams.get('mahalle')) || 'bilinmiyor',
                mahalleId: urlParams.get('mahalleId') || null
            };
            
            this.currentServiceType = this.cleanUrlParam(urlParams.get('tip')) || 'gunluk';
            this.personelDurumu = urlParams.get('durum') || null;
        }
        
        // URL'yi güzelleştir (SEO için)
        if (window.history && window.history.replaceState) {
            const cleanUrl = this.generateSeoFriendlyUrl();
            window.history.replaceState({}, document.title, cleanUrl);
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
        
        // Başlık büyük harfle başlasın ve SEO dostu olsun
        const formattedMahalle = this.capitalizeFirstLetter(mahalle);
        const formattedIlce = this.capitalizeFirstLetter(ilce);
        const formattedIl = this.capitalizeFirstLetter(il);
        
        // SEO için daha spesifik ve açıklayıcı başlık
        const title = `${formattedMahalle} ${serviceTypeText} Hizmeti - ${formattedIlce}, ${formattedIl} | Ufak İşler`;
        
        // Daha detaylı meta açıklaması
        const description = `${formattedMahalle} mahallesinde profesyonel ${serviceTypeText.toLowerCase()} hizmeti. Ufak İşler ile ${formattedIlce}, ${formattedIl} bölgesinde güvenilir, hızlı ve uygun fiyatlı çözümler.`;
        
        // Canonical URL - SEO için önemli
        const canonicalUrl = this.generateCanonicalUrl();
        
        // Meta etiketlerini güncelle
        document.getElementById('page-title').textContent = title;
        document.getElementById('page-description').setAttribute('content', description);
        document.title = title;
        
        // Canonical link ekle veya güncelle
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonicalUrl;
        
        // Open Graph meta etiketleri ekle (sosyal medya paylaşımları için)
        this.updateOrCreateMetaTag('og:title', title);
        this.updateOrCreateMetaTag('og:description', description);
        this.updateOrCreateMetaTag('og:url', canonicalUrl);
        this.updateOrCreateMetaTag('og:type', 'website');
        
        // Twitter Card meta etiketleri
        this.updateOrCreateMetaTag('twitter:card', 'summary');
        this.updateOrCreateMetaTag('twitter:title', title);
        this.updateOrCreateMetaTag('twitter:description', description);
    }

    updateBreadcrumb() {
        // Önce URL-encoded Türkçe karakterleri düzelt
        const il = this.fixUrlEncodedTurkishChars(this.currentLocation.il);
        const ilce = this.fixUrlEncodedTurkishChars(this.currentLocation.ilce);
        const mahalle = this.fixUrlEncodedTurkishChars(this.currentLocation.mahalle);
        
        // capitalizeFirstLetter fonksiyonu zaten fixUrlEncodedTurkishChars'i çağırıyor
        document.getElementById('breadcrumb-il').textContent = this.capitalizeFirstLetter(il);
        document.getElementById('breadcrumb-ilce').textContent = this.capitalizeFirstLetter(ilce);
        document.getElementById('breadcrumb-mahalle').textContent = this.capitalizeFirstLetter(mahalle);
    }

    updateLocationInfo() {
        // Önce URL-encoded Türkçe karakterleri düzelt
        const il = this.fixUrlEncodedTurkishChars(this.currentLocation.il);
        const ilce = this.fixUrlEncodedTurkishChars(this.currentLocation.ilce);
        const mahalle = this.fixUrlEncodedTurkishChars(this.currentLocation.mahalle);
        const serviceTypeText = this.currentServiceType === 'gunluk' ? 'Günlük Yardım' : 'Onarım ve Tadilat';
        
        // capitalizeFirstLetter fonksiyonu zaten fixUrlEncodedTurkishChars'i çağırıyor
        const formattedMahalle = this.capitalizeFirstLetter(mahalle);
        const formattedIlce = this.capitalizeFirstLetter(ilce);
        const formattedIl = this.capitalizeFirstLetter(il);
        
        const title = `${formattedMahalle} - ${serviceTypeText}`;
        const subtitle = `${formattedIlce}, ${formattedIl} bölgesinde ${serviceTypeText.toLowerCase()} hizmetleri`;
        
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
    
    // Yardımcı metotlar - SEO optimizasyonu için
    
    // URL-encoded Türkçe karakterleri düzeltme fonksiyonu
    fixUrlEncodedTurkishChars(text) {
        if (!text) return '';
        
        // URL-encoded Türkçe karakterleri düzelt
        return text
            .replace(/%C3%BC/g, 'ü') // ü
            .replace(/%C3%9C/g, 'Ü') // Ü
            .replace(/%C4%9F/g, 'ğ') // ğ
            .replace(/%C4%9E/g, 'Ğ') // Ğ
            .replace(/%C3%B6/g, 'ö') // ö
            .replace(/%C3%96/g, 'Ö') // Ö
            .replace(/%C3%A7/g, 'ç') // ç
            .replace(/%C3%87/g, 'Ç') // Ç
            .replace(/%C4%B1/g, 'ı') // ı
            .replace(/%C4%B0/g, 'İ') // İ
            .replace(/%C5%9F/g, 'ş') // ş
            .replace(/%C5%9E/g, 'Ş') // Ş
            .replace(/%20/g, ' ');      // boşluk
    }
    
    // URL parametrelerini temizle
    cleanUrlParam(param) {
        if (!param) return '';
        
        // Önce URL-encoded karakterleri düzelt
        param = this.fixUrlEncodedTurkishChars(param);
        
        return param.toLowerCase()
            .replace(/\s+/g, '-')     // Boşlukları tire ile değiştir
            .replace(/[^a-z0-9ğüşıöç-]/g, '') // Türkçe karakterleri koruyarak sadece izin verilen karakterleri bırak
            .replace(/--+/g, '-');     // Çoklu tireleri tek tireye çevir
    }
    
    // İlk harf büyük, diğer harfler küçük olacak şekilde metni düzelt
    capitalizeFirstLetter(text) {
        if (!text) return '';
        
        // Önce URL-encoded karakterleri düzelt
        text = this.fixUrlEncodedTurkishChars(text);
        
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    
    // SEO dostu URL oluştur
    generateSeoFriendlyUrl() {
        const { il, ilce, mahalle } = this.currentLocation;
        const serviceType = this.currentServiceType;
        const mahalleId = this.currentLocation.mahalleId;
        
        // /hizmet/[hizmet-tipi]/[il]/[ilce]/[mahalle] formatında URL
        let url = `/hizmet/${serviceType === 'gunluk' ? 'gunluk-yardim' : 'onarim-tadilat'}/${this.cleanUrlParam(il)}/${this.cleanUrlParam(ilce)}/${this.cleanUrlParam(mahalle)}`;
        
        // Eğer mahalleId varsa, onu da ekle
        if (mahalleId) {
            url += `?mahalleId=${mahalleId}`;
        }
        
        return url;
    }
    
    // Canonical URL oluştur
    generateCanonicalUrl() {
        return this.baseUrl + this.generateSeoFriendlyUrl();
    }
    
    // Meta etiketini güncelle veya oluştur
    updateOrCreateMetaTag(name, content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`) || 
                     document.querySelector(`meta[property="${name}"]`);
                     
        if (!metaTag) {
            metaTag = document.createElement('meta');
            if (name.startsWith('og:')) {
                metaTag.setAttribute('property', name);
            } else {
                metaTag.setAttribute('name', name);
            }
            document.head.appendChild(metaTag);
        }
        
        metaTag.setAttribute('content', content);
    }
    generateShareMessage() {
        const { il, ilce, mahalle } = this.currentLocation;
        
        return `🔧 İş Fırsatı! 

${this.capitalizeFirstLetter(mahalle)}, ${this.capitalizeFirstLetter(ilce)} bölgesinde Ufak İşler ekibine katılmak ister misiniz?

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
