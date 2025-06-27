// Form işlemleri için JavaScript kodları

document.addEventListener('DOMContentLoaded', function() {
    // Hizmet türü seçimine göre ilgili alanları gösterme/gizleme
    const serviceTypeSelect = document.getElementById('serviceType');
    const repairServicesSection = document.getElementById('repairServicesSection');
    const helperServicesSection = document.getElementById('helperServicesSection');
    
    // Sayfa yüklendiğinde alanları gizle
    if (repairServicesSection && helperServicesSection) {
        repairServicesSection.style.display = 'none';
        helperServicesSection.style.display = 'none';
    }
    
    // Hizmet türü değiştiğinde ilgili alanları göster/gizle
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            if (this.value === 'repair') {
                repairServicesSection.style.display = 'block';
                repairServicesSection.classList.add('active');
                helperServicesSection.style.display = 'none';
                helperServicesSection.classList.remove('active');
                
                // Helper hizmetleri için olan checkbox'ları temizle
                const helperCheckboxes = helperServicesSection.querySelectorAll('input[type="checkbox"]');
                helperCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            } 
            else if (this.value === 'helper') {
                repairServicesSection.style.display = 'none';
                repairServicesSection.classList.remove('active');
                helperServicesSection.style.display = 'block';
                helperServicesSection.classList.add('active');
                
                // Repair hizmetleri için olan checkbox'ları temizle
                const repairCheckboxes = repairServicesSection.querySelectorAll('input[type="checkbox"]');
                repairCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
            } 
            else {
                repairServicesSection.style.display = 'none';
                repairServicesSection.classList.remove('active');
                helperServicesSection.style.display = 'none';
                helperServicesSection.classList.remove('active');
            }
        });
    }
    
    // Form gönderim işlemi
    const partnerForm = document.getElementById('partnerApplicationForm');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form doğrulama
            const serviceType = document.getElementById('serviceType').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const experience = document.getElementById('experience').value;
            const terms = document.getElementById('terms').checked;
            
            let isValid = true;
            let errorMessage = '';
            
            // Temel alanları kontrol et
            if (!fullName) {
                isValid = false;
                errorMessage += 'Ad Soyad alanı zorunludur.\n';
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'E-posta alanı zorunludur.\n';
            }
            
            if (!phone) {
                isValid = false;
                errorMessage += 'Telefon alanı zorunludur.\n';
            }
            
            // Hizmet türü seçili mi kontrol et
            if (!serviceType) {
                isValid = false;
                errorMessage += 'Lütfen hizmet türünü seçiniz.\n';
            }
            
            // Deneyim kontrolü
            if (!experience) {
                isValid = false;
                errorMessage += 'Deneyim seçimi zorunludur.\n';
            }
            
            // Koşulları kabul etme kontrolü
            if (!terms) {
                isValid = false;
                errorMessage += 'Katılım koşullarını kabul etmelisiniz.\n';
            }
            
            // Seçilen hizmet türüne göre en az bir hizmet alanı seçili mi kontrol et
            if (serviceType === 'repair') {
                const selectedRepairServices = document.querySelectorAll('input[name="repair_services[]"]:checked');
                if (selectedRepairServices.length === 0) {
                    isValid = false;
                    errorMessage += 'Lütfen en az bir onarım/tadilat hizmet alanı seçiniz.\n';
                }
            } 
            else if (serviceType === 'helper') {
                const selectedHelperServices = document.querySelectorAll('input[name="helper_services[]"]:checked');
                if (selectedHelperServices.length === 0) {
                    isValid = false;
                    errorMessage += 'Lütfen en az bir günlük yardım hizmet alanı seçiniz.\n';
                }
            }
            
            // Form geçerli değilse hata mesajı göster
            if (!isValid) {
                alert('Lütfen tüm zorunlu alanları doldurun:\n' + errorMessage);
                return;
            }
            
            // Form geçerliyse başarı mesajı göster ve formu temizle
            alert('Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.');
            this.reset();
            
            // Hizmet alanlarını gizle
            repairServicesSection.style.display = 'none';
            repairServicesSection.classList.remove('active');
            helperServicesSection.style.display = 'none';
            helperServicesSection.classList.remove('active');
            
            // Sayfayı başa kaydır
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
