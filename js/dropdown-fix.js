// Dropdown menü pozisyonunu düzeltmek için script
document.addEventListener('DOMContentLoaded', function() {
    // Tüm dropdown menüleri seçelim
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Her bir dropdown için pozisyon ayarı yapalım
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        // Dropdown butonuna hover olduğunda
        dropdown.addEventListener('mouseenter', function() {
            if (dropbtn && dropdownContent) {
                // Dropdown butonunun konumunu alalım
                const rect = dropbtn.getBoundingClientRect();
                
                // Dropdown menüsünün pozisyonunu ayarlayalım
                dropdownContent.style.position = 'fixed';
                dropdownContent.style.top = rect.bottom + 'px';
                dropdownContent.style.left = rect.left + 'px';
                dropdownContent.style.minWidth = rect.width + 'px';
                
                // Dropdown menüsünü görünür yapalım
                dropdownContent.style.display = 'block';
            }
        });
        
        // Dropdown'dan çıkıldığında menüyü gizleyelim
        dropdown.addEventListener('mouseleave', function() {
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });
    });
});
