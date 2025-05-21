// Mobil Menü İşlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    // Mobil menü oluşturma
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-menu';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    const menuList = document.createElement('ul');
    
    // Ana menüdeki bağlantıları kopyala
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    mobileMenu.appendChild(closeBtn);
    mobileMenu.appendChild(menuList);
    body.appendChild(mobileMenu);
    
    // Menü açma/kapama işlevselliği
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });
    
    closeBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });
    
    // Mobil menüdeki bağlantılara tıklandığında menüyü kapat
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
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
