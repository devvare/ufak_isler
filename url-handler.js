/**
 * SEO dostu URL'leri işlemek için yönlendirme script'i
 * Bu dosya, doğrudan yazılan SEO dostu URL'leri işleyerek doğru parametrelerle hizmet-bolgesi.html'e yönlendirir.
 */

// Türkçe karakterleri düzeltme fonksiyonu
function fixUrlEncodedTurkishChars(text) {
    if (!text) return '';
    return text
        .replace(/%C3%BC/g, 'ü')
        .replace(/%C3%9C/g, 'Ü')
        .replace(/%C4%9F/g, 'ğ')
        .replace(/%C4%9E/g, 'Ğ')
        .replace(/%C5%9F/g, 'ş')
        .replace(/%C5%9E/g, 'Ş')
        .replace(/%C4%B1/g, 'ı')
        .replace(/%C4%B0/g, 'İ')
        .replace(/%C3%B6/g, 'ö')
        .replace(/%C3%96/g, 'Ö')
        .replace(/%C3%A7/g, 'ç')
        .replace(/%C3%87/g, 'Ç')
        .replace(/%20/g, ' ');
}

// URL'yi kontrol et ve gerekirse yönlendir
function checkAndRedirectSeoUrl() {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Ana sayfa, normal sayfalar veya zaten hizmet-bolgesi.html sayfasındaysak, işlem yapma
    if (path === '/' || path === '/index.html' || path.includes('hizmet-bolgesi.html')) {
        return false;
    }
    
    // Sadece /hizmet/ ile başlayan URL'leri işle
    if (path.includes('/hizmet/')) {
        // URL'yi parçalara ayır
        const pathParts = path.split('/').filter(part => part);
        
        // Hizmet bölümünü bul
        let hizmetIndex = -1;
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'hizmet') {
                hizmetIndex = i;
                break;
            }
        }
        
        if (hizmetIndex >= 0 && pathParts.length > hizmetIndex + 1) {
            // Hizmet tipini belirle
            let serviceType = 'gunluk';
            if (pathParts[hizmetIndex + 1] === 'onarim-tadilat') {
                serviceType = 'onarim';
            } else if (pathParts[hizmetIndex + 1] === 'gunluk-yardim') {
                serviceType = 'gunluk';
            }
            
            // Parametreleri hazırla
            let params = [`tip=${serviceType}`];
            
            // İl
            if (pathParts.length > hizmetIndex + 2) {
                const il = fixUrlEncodedTurkishChars(decodeURIComponent(pathParts[hizmetIndex + 2]));
                params.push(`il=${encodeURIComponent(il)}`);
            }
            
            // İlçe
            if (pathParts.length > hizmetIndex + 3) {
                const ilce = fixUrlEncodedTurkishChars(decodeURIComponent(pathParts[hizmetIndex + 3]));
                params.push(`ilce=${encodeURIComponent(ilce)}`);
            }
            
            // Mahalle
            if (pathParts.length > hizmetIndex + 4) {
                const mahalle = fixUrlEncodedTurkishChars(decodeURIComponent(pathParts[hizmetIndex + 4]));
                params.push(`mahalle=${encodeURIComponent(mahalle)}`);
            }
            
            // Personel durumu
            if (pathParts.length > hizmetIndex + 5) {
                params.push(`durum=${encodeURIComponent(pathParts[hizmetIndex + 5])}`);
            }
            
            // URL'deki diğer parametreleri de ekle
            for (const [key, value] of urlParams.entries()) {
                if (!params.some(p => p.startsWith(`${key}=`))) {
                    params.push(`${key}=${encodeURIComponent(value)}`);
                }
            }
            
            // Yönlendirme URL'sini oluştur
            // Sunucu kök dizinine göre yolu belirle
            let baseUrl = '';
            if (path.startsWith('/')) {
                baseUrl = '/hizmet-bolgesi.html';
            } else {
                // Kaç seviye yukarı çıkacağımızı hesapla
                const levels = path.split('/').filter(p => p !== '').length - hizmetIndex - 1;
                baseUrl = '../'.repeat(levels) + 'hizmet-bolgesi.html';
            }
            
            console.log('Yönlendirme URL:', baseUrl + '?' + params.join('&'));
            
            // Yönlendir
            window.location.href = baseUrl + '?' + params.join('&');
            return true;
        }
    }
    return false;
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // Sadece /hizmet/ ile başlayan URL'leri işle
    if (window.location.pathname.includes('/hizmet/')) {
        // Önce URL'yi kontrol et
        if (!checkAndRedirectSeoUrl()) {
            // Eğer yönlendirme yapılmadıysa, normal sayfa yüklemesine devam et
            console.log('URL yönlendirmesi yapılmadı, normal sayfa yüklemesi devam ediyor.');
        }
    }
});

// Eğer sayfa zaten yüklendiyse ve URL /hizmet/ içeriyorsa hemen çalıştır
if ((document.readyState === 'complete' || document.readyState === 'interactive') && 
    window.location.pathname.includes('/hizmet/')) {
    checkAndRedirectSeoUrl();
}
