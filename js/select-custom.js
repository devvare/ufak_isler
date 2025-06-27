// Özel select elementi oluşturmak için JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tüm select elementlerini bul
    const selects = document.querySelectorAll('select');
    
    // Her bir select elementi için özel select oluştur
    selects.forEach(function(select) {
        if (select.classList.contains('no-custom')) return; // Özelleştirme istenmeyen selectleri atla
        
        // Orijinal select elementinin ID'sini al
        const selectId = select.id;
        
        // Orijinal select elementinin ebeveyn elementini al
        const parentElement = select.parentElement;
        
        // Özel select wrapper oluştur
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.dataset.for = selectId;
        
        // Özel select oluştur
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        
        // Seçilen değeri göstermek için span oluştur
        const selectedValue = document.createElement('span');
        selectedValue.className = 'custom-select-value';
        selectedValue.textContent = select.options[select.selectedIndex]?.textContent || 'Seçiniz';
        
        // Ok ikonu oluştur
        const arrow = document.createElement('span');
        arrow.className = 'custom-select-arrow';
        
        // Seçenekler için container oluştur
        const options = document.createElement('div');
        options.className = 'custom-select-options';
        
        // Orijinal select elementinin seçeneklerini özel select'e ekle
        Array.from(select.options).forEach(function(option, index) {
            const customOption = document.createElement('div');
            customOption.className = 'custom-select-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;
            customOption.dataset.index = index;
            
            // Seçenek tıklandığında
            customOption.addEventListener('click', function() {
                // Orijinal select elementinin değerini güncelle
                select.selectedIndex = this.dataset.index;
                
                // Seçilen değeri güncelle
                selectedValue.textContent = this.textContent;
                
                // Değişiklik olayını tetikle
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                // Seçenekler menüsünü kapat
                customSelect.classList.remove('open');
            });
            
            options.appendChild(customOption);
        });
        
        // Özel select elementine bileşenleri ekle
        customSelect.appendChild(selectedValue);
        customSelect.appendChild(arrow);
        wrapper.appendChild(customSelect);
        wrapper.appendChild(options);
        
        // Özel select tıklandığında
        customSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('open');
            
            // Diğer açık olan select'leri kapat
            document.querySelectorAll('.custom-select.open').forEach(function(openSelect) {
                if (openSelect !== customSelect) {
                    openSelect.classList.remove('open');
                }
            });
        });
        
        // Orijinal select değiştiğinde
        select.addEventListener('change', function() {
            selectedValue.textContent = this.options[this.selectedIndex]?.textContent || 'Seçiniz';
        });
        
        // Orijinal select elementini gizle
        select.style.display = 'none';
        
        // Özel select elementini orijinal select elementinin hemen sonrasına ekle
        parentElement.insertBefore(wrapper, select.nextSibling);
    });
    
    // Sayfa herhangi bir yerine tıklandığında açık olan select'leri kapat
    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select.open').forEach(function(select) {
            select.classList.remove('open');
        });
    });
});
