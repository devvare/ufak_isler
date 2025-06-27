// Konum Seçici Sistemi
class LocationSelector {
    constructor(serviceType) {
        this.serviceType = serviceType;
        this.locationData = {
            iller: [],
            ilceler: [],
            mahalleler: []
        };
        this.selectedLocation = {
            il: null,
            ilce: null,
            mahalle: null,
            mahalleId: null
        };
        this.init();
    }

    async init() {
        await this.loadLocationData();
        this.createLocationModal();
        this.bindEvents();
        this.showLocationModal();
    }

    async loadLocationData() {
        try {
            // İl listesini yükle
            const ilResponse = await fetch('data/il-listesi.json');
            this.locationData.iller = await ilResponse.json();

            console.log('İl verileri yüklendi:', {
                ilSayisi: this.locationData.iller.length
            });
        } catch (error) {
            console.error('İl verileri yüklenirken hata:', error);
            // Varsayılan verilerle devam et
            this.locationData.iller = [
                { ad: 'Muğla', slug: 'mugla', mahalleCount: 10 }
            ];
        }
    }

    async loadMahalleData() {
        if (this.locationData.mahalleler.length === 0) {
            try {
                console.log('Mahalle verileri yükleniyor...');
                const mahalleResponse = await fetch('data/mahalle.json');
                this.locationData.mahalleler = await mahalleResponse.json();
                console.log('Mahalle verileri yüklendi:', {
                    mahalleSayisi: this.locationData.mahalleler.length
                });
            } catch (error) {
                console.error('Mahalle verileri yüklenirken hata:', error);
                this.locationData.mahalleler = [];
            }
        }
        return this.locationData.mahalleler;
    }

    createLocationModal() {
        const modalHTML = `
            <div id="location-modal" class="service-modal" style="display: none;">
                <div class="service-modal-content">
                    <div class="service-modal-header">
                        <h3>Hizmet Bölgesi Seçin</h3>
                        <span class="service-modal-close">&times;</span>
                    </div>
                    <div class="service-modal-body">
                        <div class="location-select-container">
                            <div class="form-group">
                                <label for="il-select">İl:</label>
                                <select id="il-select" class="location-select">
                                    <option value="">İl seçiniz...</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="ilce-select">İlçe:</label>
                                <select id="ilce-select" class="location-select" disabled>
                                    <option value="">Önce il seçiniz...</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="mahalle-select">Mahalle:</label>
                                <select id="mahalle-select" class="location-select" disabled>
                                    <option value="">Önce ilçe seçiniz...</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="service-modal-footer">
                        <button id="location-continue" class="btn btn-primary" disabled>Devam Et</button>
                    </div>
                </div>
            </div>
        `;

        // Modal'ı sayfaya ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // İl seçeneklerini doldur
        const ilSelect = document.getElementById('il-select');
        this.locationData.iller.forEach(il => {
            const option = document.createElement('option');
            option.value = il.ad.toLowerCase().replace(/\s+/g, '-');
            option.textContent = il.ad;
            option.dataset.ilAd = il.ad;
            ilSelect.appendChild(option);
        });

        // Popüler şehirler butonları kaldırıldı
    }

    populateIlSelect() {
        const ilSelect = document.getElementById('il-select');
        
        this.locationData.iller.forEach(il => {
            const option = document.createElement('option');
            option.value = il.slug;
            option.textContent = il.ad;
            option.dataset.ilAd = il.ad;
            ilSelect.appendChild(option);
        });
    }

    async populateIlceSelect(selectedIl) {
        const ilceSelect = document.getElementById('ilce-select');
        ilceSelect.innerHTML = '<option value="">Yükleniyor...</option>';
        ilceSelect.disabled = true;
        
        const mahalleler = await this.loadMahalleData();
        
        ilceSelect.innerHTML = '<option value="">İlçe seçiniz...</option>';
        
        // Seçilen ile ait ilçeleri bul
        const ilceler = [...new Set(
            mahalleler
                .filter(mahalle => mahalle.İL.toLowerCase() === selectedIl.toLowerCase())
                .map(mahalle => mahalle.İLÇE)
        )].sort();

        ilceler.forEach(ilce => {
            const option = document.createElement('option');
            option.value = ilce.toLowerCase().replace(/\s+/g, '-');
            option.textContent = ilce;
            option.dataset.ilceAd = ilce;
            ilceSelect.appendChild(option);
        });
        
        ilceSelect.disabled = false;
    }

    async populateMahalleSelect(selectedIl, selectedIlce) {
        const mahalleSelect = document.getElementById('mahalle-select');
        mahalleSelect.innerHTML = '<option value="">Yükleniyor...</option>';
        mahalleSelect.disabled = true;
        
        const mahalleler = await this.loadMahalleData();
        
        mahalleSelect.innerHTML = '<option value="">Mahalle seçiniz...</option>';
        
        // Seçilen il ve ilçeye ait mahalleleri bul
        const mahallelerFiltered = mahalleler
            .filter(mahalle => 
                mahalle.İL.toLowerCase() === selectedIl.toLowerCase() &&
                mahalle.İLÇE.toLowerCase() === selectedIlce.toLowerCase()
            )
            .sort((a, b) => a.MAHALLE.localeCompare(b.MAHALLE));

        mahallelerFiltered.forEach(mahalle => {
            const option = document.createElement('option');
            option.value = mahalle.MAHALLE.toLowerCase().replace(/\s+/g, '-');
            option.textContent = mahalle.MAHALLE;
            option.dataset.mahalleAd = mahalle.MAHALLE;
            option.dataset.mahalleId = mahalle.id;
            mahalleSelect.appendChild(option);
        });
        
        mahalleSelect.disabled = false;
    }

    bindEvents() {
        // İl seçimi
        document.getElementById('il-select').addEventListener('change', async (e) => {
            const selectedValue = e.target.value;
            const selectedOption = e.target.selectedOptions[0];
            
            if (selectedValue) {
                this.selectedLocation.il = selectedOption.dataset.ilAd;
                await this.populateIlceSelect(this.selectedLocation.il);
                
                // İlçe seçimini etkinleştir
                document.getElementById('ilce-select').disabled = false;
                
                // Mahalle seçimini sıfırla
                document.getElementById('mahalle-select').innerHTML = '<option value="">Önce ilçe seçiniz...</option>';
                document.getElementById('mahalle-select').disabled = true;
                
                this.selectedLocation.ilce = null;
                this.selectedLocation.mahalle = null;
                this.selectedLocation.mahalleId = null;
                this.updateContinueButton();
            }
        });

        // İlçe seçimi
        document.getElementById('ilce-select').addEventListener('change', async (e) => {
            const selectedValue = e.target.value;
            const selectedOption = e.target.selectedOptions[0];
            
            if (selectedValue) {
                this.selectedLocation.ilce = selectedOption.dataset.ilceAd;
                await this.populateMahalleSelect(this.selectedLocation.il, this.selectedLocation.ilce);
                
                // Mahalle seçimini etkinleştir
                document.getElementById('mahalle-select').disabled = false;
                
                // Mahalle seçimini sıfırla
                this.selectedLocation.mahalle = null;
                this.selectedLocation.mahalleId = null;
                this.updateContinueButton();
            }
        });

        // Mahalle seçimi
        document.getElementById('mahalle-select').addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            const selectedOption = e.target.selectedOptions[0];
            
            if (selectedValue) {
                this.selectedLocation.mahalle = selectedOption.dataset.mahalleAd;
                this.selectedLocation.mahalleId = selectedOption.dataset.mahalleId;
                this.updateContinueButton();
            }
        });

        // Modal kapatma
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-modal-close') || 
                e.target.classList.contains('service-modal') ||
                e.target.id === 'location-cancel') {
                this.hideLocationModal();
            }

            if (e.target.id === 'location-continue') {
                this.continueToLocationPage();
            }
        });
    }

    updateContinueButton() {
        const continueBtn = document.getElementById('location-continue');
        const isComplete = this.selectedLocation.il && 
                          this.selectedLocation.ilce && 
                          this.selectedLocation.mahalle && 
                          this.selectedLocation.mahalleId;
        
        continueBtn.disabled = !isComplete;
    }

    showLocationModal() {
        document.getElementById('location-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideLocationModal() {
        const modal = document.getElementById('location-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }

    continueToLocationPage() {
        if (this.selectedLocation.il && 
            this.selectedLocation.ilce && 
            this.selectedLocation.mahalle && 
            this.selectedLocation.mahalleId) {
            
            // PageRouter kullanarak dinamik sayfaya yönlendir
            if (typeof PageRouter !== 'undefined') {
                // SEO dostu URL'ye yönlendir
                PageRouter.redirectToLocationPage(
                    this.selectedLocation.il,
                    this.selectedLocation.ilce,
                    this.selectedLocation.mahalle,
                    this.selectedLocation.mahalleId,
                    this.serviceType
                );
            } else {
                // PageRouter yoksa eski yöntemi kullan
                const url = `hizmet-bolgesi.html?il=${encodeURIComponent(this.selectedLocation.il)}&ilce=${encodeURIComponent(this.selectedLocation.ilce)}&mahalle=${encodeURIComponent(this.selectedLocation.mahalle)}&mahalleId=${this.selectedLocation.mahalleId}&tip=${this.serviceType}`;
                window.location.href = url;
            }
        }
    }

    // Popüler şehirler bölümü kaldırıldı
}

// Hızlı konum seçimi için yardımcı fonksiyonlar
class QuickLocationSelector {
    static async selectMarmaris(serviceType) {
        try {
            // Türkiye mahallelerini yükle
            const response = await fetch('data/mahalle.json');
            const mahalleler = await response.json();
            
            // Türkiye mahallelerini filtrele
            const turkeyMahalleler = mahalleler;

            if (turkeyMahalleler.length > 0) {
                // İlk mahalleyi seç (örnek için)
                const mahalle = turkeyMahalleler[0];
                PageRouter.redirectToLocationPage(
                    mahalle.İL,
                    mahalle.İLÇE,
                    mahalle.MAHALLE,
                    mahalle.id,
                    serviceType
                );
            } else {
                // Manuel seçim modalını aç
                new LocationSelector(serviceType);
            }
        } catch (error) {
            console.error('Türkiye verileri yüklenirken hata:', error);
            // Manuel seçim modalını aç
            new LocationSelector(serviceType);
        }
    }
}
