// Mobil Menü İşlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) return; // Eğer buton yoksa işlemi durdur
    
    const body = document.body;
    
    // Mobil menü oluşturma
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Overlay oluştur
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    const menuList = document.createElement('ul');
    
    // Ana Sayfa bağlantısını ekle
    const homeLink = document.createElement('li');
    const homeA = document.createElement('a');
    homeA.href = 'index.html';
    homeA.textContent = 'Ana Sayfa';
    
    // Aktif sayfa vurgulaması kaldırıldı
    
    homeLink.appendChild(homeA);
    menuList.appendChild(homeLink);
    
    // Hizmetlerimiz menü öğesini ekle (açılır menü olarak)
    const servicesItem = document.createElement('li');
    servicesItem.className = 'mobile-dropdown';
    
    const servicesLink = document.createElement('a');
    servicesLink.href = 'javascript:void(0)';
    servicesLink.className = 'mobile-dropbtn';
    servicesLink.textContent = 'Hizmetlerimiz';
    servicesItem.appendChild(servicesLink);
    
    // Alt menü için bir div oluştur
    const servicesSubMenu = document.createElement('div');
    servicesSubMenu.className = 'mobile-dropdown-content';
    
    // Alt menü öğelerini ekle
    const onarimLink = document.createElement('a');
    onarimLink.href = 'onarim-tadilat.html';
    onarimLink.textContent = 'Onarım ve Tadilat';
    // Aktif sayfa vurgulaması kaldırıldı
    servicesSubMenu.appendChild(onarimLink);
    
    const gunlukLink = document.createElement('a');
    gunlukLink.href = 'gunluk-yardim.html';
    gunlukLink.textContent = 'Günlük Yardım';
    // Aktif sayfa vurgulaması kaldırıldı
    servicesSubMenu.appendChild(gunlukLink);
    
    servicesItem.appendChild(servicesSubMenu);
    menuList.appendChild(servicesItem);
    
    // Diğer menü öğelerini ekle
    const menuItems = [
        { href: 'nasil-calisir.html', text: 'Nasıl Çalışır?' },
        { href: 'diy.html', text: 'Kendin Yap' },
        { href: 'hizmet-bolgeleri.html', text: 'Hizmet Bölgelerimiz' },
        { href: 'hakkimizda.html', text: 'Hakkımızda' },
        { href: 'iletisim.html', text: 'İletişim' },
        { href: 'bizimle-calisin.html', text: 'Bizimle Çalışın' }
    ];
    
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        
        // Aktif sayfa vurgulaması kaldırıldı
        
        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    mobileMenu.appendChild(closeBtn);
    mobileMenu.appendChild(menuList);
    body.appendChild(mobileMenu);
    
    // Menü açma/kapama işlevselliği
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
    });
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = ''; // Sayfa kaydırmayı tekrar etkinleştir
    }
    
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Hizmetlerimiz butonuna tıklandığında alt menüyü aç/kapat
    servicesLink.addEventListener('click', function(e) {
        e.stopPropagation(); // Tıklamanın yayılmasını engelle
        servicesSubMenu.classList.toggle('show');
    });
    
    // Alt menü öğelerine tıklandığında menüyü kapat
    const subMenuLinks = servicesSubMenu.querySelectorAll('a');
    subMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Diğer menü öğelerine tıklandığında menüyü kapat
    const regularLinks = menuList.querySelectorAll('li:not(.mobile-dropdown) a');
    regularLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});

// WhatsApp Numarası Güncelleme
function updateWhatsAppLinks(phoneNumber) {
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${phoneNumber}`;
    });
}

// Sayfa yüklendiğinde WhatsApp numarasını güncelle
document.addEventListener('DOMContentLoaded', function() {
    // Burada numarayı güncelleyebilirsiniz
    updateWhatsAppLinks('+905458646613');
});

// Testimonial Slider (basit versiyon)
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    // Mobil ekranlarda slider işlevselliği
    if (window.innerWidth < 768 && testimonials.length > 1) {
        // İlk testimoniala aktif sınıfı ekle
        testimonials[0].classList.add('active');
        
        // Diğer testimonialleri gizle
        for (let i = 1; i < testimonials.length; i++) {
            testimonials[i].style.display = 'none';
        }
        
        // Otomatik slider
        setInterval(() => {
            testimonials[currentIndex].style.display = 'none';
            testimonials[currentIndex].classList.remove('active');
            
            currentIndex = (currentIndex + 1) % testimonials.length;
            
            testimonials[currentIndex].style.display = 'block';
            setTimeout(() => {
                testimonials[currentIndex].classList.add('active');
            }, 100);
        }, 5000);
    }
});

// Form Doğrulama
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form alanlarını al
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Basit doğrulama
            if (!name || !email || !phone || !message) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // E-posta formatı doğrulama
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Lütfen geçerli bir e-posta adresi girin.');
                return;
            }
            
            // Form gönderimi simülasyonu
            alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.');
            contactForm.reset();
        });
    }
});

// Sayfa yükleme animasyonu
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// DIY Rehberleri Açılır/Kapanır İşlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-guide');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Butonun içindeki metni değiştir
            if (this.textContent === 'Detayları Göster') {
                this.textContent = 'Detayları Gizle';
            } else {
                this.textContent = 'Detayları Göster';
            }
            
            // Detay içeriğini bul ve görünürlüğünü değiştir
            const guideDetails = this.nextElementSibling;
            if (guideDetails && guideDetails.classList.contains('guide-details')) {
                if (guideDetails.style.display === 'none' || guideDetails.style.display === '') {
                    guideDetails.style.display = 'block';
                    // Detaylar gösterildiğinde sayfayı bu bölüme kaydır
                    setTimeout(() => {
                        guideDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    guideDetails.style.display = 'none';
                }
            }
        });
    });
});

// Smooth Scroll
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Dinamik Sayfa Yönlendirme Fonksiyonları
class PageRouter {
    static redirectToLocationPage(il, ilce, mahalle, mahalleId, serviceType) {
        // URL parametrelerini oluştur
        const params = new URLSearchParams({
            il: il.toLowerCase().replace(/\s+/g, '-'),
            ilce: ilce.toLowerCase().replace(/\s+/g, '-'),
            mahalle: mahalle.toLowerCase().replace(/\s+/g, '-'),
            mahalleId: mahalleId,
            tip: serviceType
        });

        // Personel kontrolü yap
        if (typeof PersonelService !== 'undefined') {
            const availablePersonel = PersonelService.findPersonelByLocation(mahalleId, serviceType);
            if (availablePersonel.length === 0) {
                params.append('durum', 'personel-yok');
            }
        }

        // Sayfaya yönlendir
        window.location.href = `hizmet-bolgesi.html?${params.toString()}`;
    }

    static createLocationUrl(il, ilce, mahalle, mahalleId, serviceType) {
        const params = new URLSearchParams({
            il: il.toLowerCase().replace(/\s+/g, '-'),
            ilce: ilce.toLowerCase().replace(/\s+/g, '-'),
            mahalle: mahalle.toLowerCase().replace(/\s+/g, '-'),
            mahalleId: mahalleId,
            tip: serviceType
        });

        return `hizmet-bolgesi.html?${params.toString()}`;
    }
}

// Hizmet Tipi Seçimi
class ServiceTypeSelector {
    constructor() {
        this.selectedServiceType = null;
        this.init();
    }

    init() {
        this.createServiceTypeModal();
        this.bindEvents();
    }

    createServiceTypeModal() {
        // Modal HTML'i oluştur
        const modalHtml = `
            <div id="service-type-modal" class="service-modal" style="display: none;">
                <div class="service-modal-content">
                    <div class="service-modal-header">
                        <h3>Hangi Hizmet Türünü Arıyorsunuz?</h3>
                        <span class="service-modal-close">&times;</span>
                    </div>
                    <div class="service-modal-body">
                        <div class="service-type-options">
                            <div class="service-type-option" data-type="gunluk">
                                <div class="service-icon">
                                    <i class="fas fa-home"></i>
                                </div>
                                <h4>Günlük Yardım</h4>
                                <p>Ev temizliği, bahçe bakımı, alışveriş yardımı</p>
                            </div>
                            <div class="service-type-option" data-type="onarim">
                                <div class="service-icon">
                                    <i class="fas fa-tools"></i>
                                </div>
                                <h4>Onarım ve Tadilat</h4>
                                <p>Musluk tamiri, elektrik, boyama, montaj</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modal'ı body'ye ekle
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    bindEvents() {
        // Hizmet seçimi butonlarına event listener ekle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-select-btn') || e.target.closest('[data-service-select]')) {
                e.preventDefault();
                this.showServiceTypeModal();
            }

            // Modal kapatma
            if (e.target.classList.contains('service-modal-close') || 
                e.target.classList.contains('service-modal')) {
                this.hideServiceTypeModal();
            }

            // Hizmet tipi seçimi
            if (e.target.closest('.service-type-option')) {
                const serviceType = e.target.closest('.service-type-option').dataset.type;
                this.selectServiceType(serviceType);
            }
        });
    }

    showServiceTypeModal() {
        document.getElementById('service-type-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideServiceTypeModal() {
        document.getElementById('service-type-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    selectServiceType(serviceType) {
        this.selectedServiceType = serviceType;
        this.hideServiceTypeModal();
        
        // Konum seçimi modalını aç
        if (typeof LocationSelector !== 'undefined') {
            new LocationSelector(serviceType);
        } else {
            // Basit yönlendirme
            PageRouter.redirectToLocationPage('istanbul', 'sariyer', 'bahcekoy', '12345', serviceType);
        }
    }
}

// Sayfa yüklendiğinde ServiceTypeSelector'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    new ServiceTypeSelector();
});
