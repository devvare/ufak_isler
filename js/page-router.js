// SEO Dostu URL Yönlendirme Sistemi
class PageRouter {
    // SEO dostu URL formatı: /hizmet/il/ilce/mahalle/hizmet-tipi/personel-durumu/
    static generateSeoUrl(il, ilce, mahalle, mahalleId, serviceType, personelDurumu = null) {
        // URL'lerde Türkçe karakterleri ve boşlukları düzelt
        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
                .replace(/[ğ]/g, 'g')           // Türkçe karakterleri değiştir
                .replace(/[ü]/g, 'u')
                .replace(/[ş]/g, 's')
                .replace(/[ı]/g, 'i')
                .replace(/[ö]/g, 'o')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9-]/g, '')     // Alfanümerik ve tire dışındaki karakterleri kaldır
                .replace(/-+/g, '-')            // Birden fazla tireyi tek tireye dönüştür
                .replace(/^-+/, '')             // Baştaki tireleri kaldır
                .replace(/-+$/, '');            // Sondaki tireleri kaldır
        };

        // URL parçalarını oluştur
        const ilSlug = slugify(il);
        const ilceSlug = slugify(ilce);
        const mahalleSlug = slugify(mahalle);
        const serviceSlug = serviceType === 'gunluk' ? 'gunluk' : 'onarim';
        
        // Personel durumu varsa ekle
        const personelPath = personelDurumu ? `/${personelDurumu}` : '';
        
        // SEO dostu URL oluştur
        return `/hizmet/${ilSlug}/${ilceSlug}/${mahalleSlug}/${serviceSlug}${personelPath}/`;
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
        
        // SEO dostu URL formatı: /hizmet/il/ilce/mahalle/hizmet-tipi/personel-durumu/
        const pathParts = path.split('/').filter(part => part);
        
        // Eğer URL SEO dostu formatta ise
        if (pathParts[0] === 'hizmet' && pathParts.length >= 5) {
            return {
                il: urlParams.get('il') || pathParts[1],
                ilce: urlParams.get('ilce') || pathParts[2],
                mahalle: urlParams.get('mahalle') || pathParts[3],
                mahalleId: urlParams.get('mahalleId') || null,
                serviceType: urlParams.get('tip') || (pathParts[4] === 'gunluk' ? 'gunluk' : 'onarim'),
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
    
    // SEO dostu URL formatını kontrol et (/hizmet/il/ilce/mahalle/...)
    if (path.startsWith('/hizmet/')) {
        // URL'den parametreleri çıkar ve hizmet-bolgesi.html'e yönlendir
        const pathParts = path.split('/').filter(part => part);
        
        if (pathParts.length >= 5) {
            // Sayfayı yükle
            window.location.href = `hizmet-bolgesi.html?il=${pathParts[1]}&ilce=${pathParts[2]}&mahalle=${pathParts[3]}&tip=${pathParts[4]}${pathParts[5] ? `&durum=${pathParts[5]}` : ''}${urlParams.has('mahalleId') ? `&mahalleId=${urlParams.get('mahalleId')}` : ''}`;
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
