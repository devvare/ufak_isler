// SEO Dostu URL Yönlendirme Sistemi
class PageRouter {
    // SEO dostu URL formatı: /hizmet/[hizmet-tipi]/[il]/[ilce]/[mahalle]/
    // URL-encoded Türkçe karakterleri düzeltme fonksiyonu
    static fixUrlEncodedTurkishChars(text) {
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
    
    static generateSeoUrl(il, ilce, mahalle, mahalleId, serviceType, personelDurumu = null) {
        // URL'lerde Türkçe karakterleri ve boşlukları düzelt - Geliştirilmiş slugify fonksiyonu
        const slugify = (text) => {
            if (!text) return '';
            
            // Önce URL-encoded karakterleri düzelt
            text = PageRouter.fixUrlEncodedTurkishChars(text);
            
            return text
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
                // Türkçe karakterleri koruyoruz, değiştirmiyoruz
                .replace(/[^a-z0-9ğüşıöç-]/g, '')  // Alfanümerik, Türkçe karakterler ve tire dışındakileri kaldır
                .replace(/-+/g, '-')            // Birden fazla tireyi tek tireye dönüştür
                .replace(/^-+/, '')             // Baştaki tireleri kaldır
                .replace(/-+$/, '');            // Sondaki tireleri kaldır
        };

        // URL parçalarını oluştur
        const ilSlug = slugify(il);
        const ilceSlug = slugify(ilce);
        const mahalleSlug = slugify(mahalle);
        
        // Hizmet tipini daha açıklayıcı hale getir (SEO için daha iyi)
        const serviceSlug = serviceType === 'gunluk' ? 'gunluk-yardim' : 'onarim-tadilat';
        
        // Personel durumu varsa ekle
        const personelPath = personelDurumu ? `/${personelDurumu}` : '';
        
        // SEO dostu URL oluştur - Hizmet tipini başa alarak daha iyi bir hiyerarşi oluştur
        return `/hizmet/${serviceSlug}/${ilSlug}/${ilceSlug}/${mahalleSlug}${personelPath}/`;
    }

    // Eski URL formatından yeni URL formatına yönlendirme
    static redirectToLocationPage(il, ilce, mahalle, mahalleId, serviceType, personelDurumu = null) {
        // SEO dostu URL oluştur
        const seoUrl = this.generateSeoUrl(il, ilce, mahalle, mahalleId, serviceType, personelDurumu);
        
        // Eski URL parametrelerini query string olarak ekle (geçiş süreci için)
        const queryParams = new URLSearchParams();
        queryParams.append('il', il);
        queryParams.append('ilce', ilce);
        queryParams.append('mahalle', mahalle);
        queryParams.append('mahalleId', mahalleId);
        queryParams.append('tip', serviceType);
        
        if (personelDurumu) {
            queryParams.append('durum', personelDurumu);
        }
        
        // Tam URL'yi oluştur
        const fullUrl = `${seoUrl}?${queryParams.toString()}`;
        
        // Yeni URL'ye yönlendir
        window.location.href = fullUrl;
    }

    // URL'den konum ve hizmet bilgilerini çıkarma
    static parseLocationFromUrl() {
        const path = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        
        // SEO dostu URL formatı: /hizmet/[hizmet-tipi]/[il]/[ilce]/[mahalle]/[personel-durumu]/
        const pathParts = path.split('/').filter(part => part);
        
        // Eğer URL SEO dostu formatta ise
        if (pathParts[0] === 'hizmet' && pathParts.length >= 5) {
            // Hizmet tipini belirle
            let serviceType = 'gunluk';
            if (pathParts[1] === 'onarim-tadilat') {
                serviceType = 'onarim';
            } else if (pathParts[1] === 'gunluk-yardim') {
                serviceType = 'gunluk';
            } else if (urlParams.get('tip')) {
                serviceType = urlParams.get('tip');
            }
            
            return {
                il: urlParams.get('il') || pathParts[2],
                ilce: urlParams.get('ilce') || pathParts[3],
                mahalle: urlParams.get('mahalle') || pathParts[4],
                mahalleId: urlParams.get('mahalleId') || null,
                serviceType: serviceType,
                personelDurumu: urlParams.get('durum') || (pathParts.length > 5 ? pathParts[5] : null)
            };
        }
        
        // Eski URL formatı için
        return {
            il: urlParams.get('il') || 'bilinmiyor',
            ilce: urlParams.get('ilce') || 'bilinmiyor',
            mahalle: urlParams.get('mahalle') || 'bilinmiyor',
            mahalleId: urlParams.get('mahalleId') || null,
            serviceType: urlParams.get('tip') || 'gunluk',
            personelDurumu: urlParams.get('durum') || null
        };
    }
}

// Sayfa yüklendiginde URL'yi kontrol et ve gerekirse yönlendir
document.addEventListener('DOMContentLoaded', function() {
    // URL'yi kontrol et
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // SEO dostu URL formatını kontrol et (/hizmet/[hizmet-tipi]/[il]/[ilce]/[mahalle]/...)
    if (path.startsWith('/hizmet/')) {
        // URL'den parametreleri çıkar ve hizmet-bolgesi.html'e yönlendir
        const pathParts = path.split('/').filter(part => part);
        
        if (pathParts.length >= 5) {
            // Hizmet tipini belirle
            let serviceType = 'gunluk';
            if (pathParts[1] === 'onarim-tadilat') {
                serviceType = 'onarim';
            } else if (pathParts[1] === 'gunluk-yardim') {
                serviceType = 'gunluk';
            }
            
            // Türkçe karakter düzeltmesi yap
            const il = PageRouter.fixUrlEncodedTurkishChars(pathParts[2]);
            const ilce = PageRouter.fixUrlEncodedTurkishChars(pathParts[3]);
            const mahalle = PageRouter.fixUrlEncodedTurkishChars(pathParts[4]);
            const personelDurumu = pathParts.length > 5 ? pathParts[5] : null;
            
            // Sayfayı yükle
            window.location.href = `hizmet-bolgesi.html?il=${il}&ilce=${ilce}&mahalle=${mahalle}&tip=${serviceType}${personelDurumu ? `&durum=${personelDurumu}` : ''}${urlParams.has('mahalleId') ? `&mahalleId=${urlParams.get('mahalleId')}` : ''}`;
        }
    }
    // Sadece hizmet-bolgesi.html sayfasında çalış
    else if (window.location.pathname.includes('hizmet-bolgesi.html')) {
        // Eger gerekli parametreler varsa ve URL SEO dostu formatta degilse
        if (urlParams.has('il') && urlParams.has('ilce') && urlParams.has('mahalle')) {
            // Sayfayı yükle, yönlendirme yapma
            // Burada bir şey yapmaya gerek yok, sayfa zaten doğru parametrelerle yüklenecek
        }
    }
});
