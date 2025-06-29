#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from datetime import datetime
import xml.dom.minidom as md

# Sitemap oluşturma ayarları
BASE_URL = "https://ufakisler.com"  # Sitenizin gerçek URL'sini buraya yazın
SITEMAP_DIR = "sitemaps"
HIZMET_TIPLERI = ["onarim", "gunluk"]
PERSONEL_DURUMLARI = ["", "personel-var"]  # Boş string ve "personel-var" durumları

# En büyük 5 il (mahalle sayısına göre)
BUYUK_ILLER = ["i̇stanbul", "ankara", "i̇zmi̇r", "antalya", "bursa"]

# Dizin oluştur
if not os.path.exists(SITEMAP_DIR):
    os.makedirs(SITEMAP_DIR)

def turkce_karakter_duzelt(text):
    """URL'lerde Türkçe karakterleri düzeltir"""
    replacements = {
        'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
        'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

def create_url_element(doc, url, lastmod=None, changefreq=None, priority=None):
    """XML URL elementi oluşturur"""
    url_element = doc.createElement('url')
    
    # Loc elementi
    loc = doc.createElement('loc')
    loc_text = doc.createTextNode(url)
    loc.appendChild(loc_text)
    url_element.appendChild(loc)
    
    # Lastmod elementi (isteğe bağlı)
    if lastmod:
        lastmod_element = doc.createElement('lastmod')
        lastmod_text = doc.createTextNode(lastmod)
        lastmod_element.appendChild(lastmod_text)
        url_element.appendChild(lastmod_element)
    
    # Changefreq elementi (isteğe bağlı)
    if changefreq:
        changefreq_element = doc.createElement('changefreq')
        changefreq_text = doc.createTextNode(changefreq)
        changefreq_element.appendChild(changefreq_text)
        url_element.appendChild(changefreq_element)
    
    # Priority elementi (isteğe bağlı)
    if priority:
        priority_element = doc.createElement('priority')
        priority_text = doc.createTextNode(str(priority))
        priority_element.appendChild(priority_text)
        url_element.appendChild(priority_element)
    
    return url_element

def generate_sitemap_for_il(il_slug):
    """Belirli bir il için sitemap oluşturur"""
    print(f"{il_slug} için sitemap oluşturuluyor...")
    
    # İl verisini oku
    try:
        with open(f"data/iller/{il_slug}.json", 'r', encoding='utf-8') as f:
            il_data = json.load(f)
    except Exception as e:
        print(f"Hata: {il_slug} verisi okunamadı: {e}")
        return None
    
    # XML dokümanı oluştur
    doc = md.getDOMImplementation().createDocument(None, "urlset", None)
    root = doc.documentElement
    root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Bugünün tarihi
    today = datetime.now().strftime("%Y-%m-%d")
    
    # İlçeleri ve mahalleleri grupla
    ilceler = {}
    for mahalle in il_data:
        ilce = mahalle["İLÇE"].lower()
        if ilce not in ilceler:
            ilceler[ilce] = []
        ilceler[ilce].append(mahalle)
    
    # Her ilçe ve mahalle için URL oluştur
    url_count = 0
    for ilce, mahalleler in ilceler.items():
        # İlçe adını URL için hazırla
        ilce_slug = turkce_karakter_duzelt(ilce.lower().replace(" ", "-"))
        
        for mahalle in mahalleler:
            # Mahalle adını URL için hazırla
            mahalle_slug = turkce_karakter_duzelt(mahalle["MAHALLE"].lower().strip().replace(" ", "-"))
            mahalle_id = mahalle["id"]
            
            # Her hizmet tipi için URL oluştur
            for hizmet_tipi in HIZMET_TIPLERI:
                for personel_durumu in PERSONEL_DURUMLARI:
                    # SEO dostu URL oluştur
                    if personel_durumu:
                        url = f"{BASE_URL}/hizmet/{hizmet_tipi}/{il_slug}/{ilce_slug}/{mahalle_slug}/{personel_durumu}/"
                        priority = 0.7  # Personel durumu olan sayfalar biraz daha düşük öncelikli
                    else:
                        url = f"{BASE_URL}/hizmet/{hizmet_tipi}/{il_slug}/{ilce_slug}/{mahalle_slug}/"
                        priority = 0.8  # Personel durumu olmayan sayfalar daha yüksek öncelikli
                    
                    # URL elementini oluştur ve ekle
                    url_element = create_url_element(
                        doc, 
                        url, 
                        lastmod=today, 
                        changefreq="weekly", 
                        priority=priority
                    )
                    root.appendChild(url_element)
                    url_count += 1
    
    # Sitemap dosyasını kaydet
    sitemap_path = os.path.join(SITEMAP_DIR, f"sitemap-{il_slug}.xml")
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(doc.toprettyxml(indent="  "))
    
    print(f"{il_slug} için sitemap oluşturuldu: {url_count} URL")
    return sitemap_path

def generate_static_sitemap():
    """Statik sayfalar için sitemap oluşturur"""
    print("Statik sayfalar için sitemap oluşturuluyor...")
    
    # XML dokümanı oluştur
    doc = md.getDOMImplementation().createDocument(None, "urlset", None)
    root = doc.documentElement
    root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Bugünün tarihi
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Statik sayfalar
    static_pages = [
        {"url": "", "priority": 1.0, "changefreq": "daily"},  # Ana sayfa
        {"url": "onarim-tadilat.html", "priority": 0.9, "changefreq": "weekly"},
        {"url": "gunluk-yardim.html", "priority": 0.9, "changefreq": "weekly"},
        {"url": "nasil-calisir.html", "priority": 0.8, "changefreq": "monthly"},
        {"url": "hakkimizda.html", "priority": 0.7, "changefreq": "monthly"},
        {"url": "iletisim.html", "priority": 0.8, "changefreq": "monthly"},
        {"url": "diy.html", "priority": 0.7, "changefreq": "weekly"},
        {"url": "bizimle-calisin.html", "priority": 0.8, "changefreq": "weekly"},
    ]
    
    # Her statik sayfa için URL oluştur
    for page in static_pages:
        url = f"{BASE_URL}/{page['url']}"
        url_element = create_url_element(
            doc, 
            url, 
            lastmod=today, 
            changefreq=page["changefreq"], 
            priority=page["priority"]
        )
        root.appendChild(url_element)
    
    # Sitemap dosyasını kaydet
    sitemap_path = os.path.join(SITEMAP_DIR, "sitemap-static.xml")
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(doc.toprettyxml(indent="  "))
    
    print(f"Statik sayfalar için sitemap oluşturuldu: {len(static_pages)} URL")
    return sitemap_path

def generate_sitemap_index(sitemap_files):
    """Sitemap indeksi oluşturur"""
    print("Sitemap indeksi oluşturuluyor...")
    
    # XML dokümanı oluştur
    doc = md.getDOMImplementation().createDocument(None, "sitemapindex", None)
    root = doc.documentElement
    root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Bugünün tarihi
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Her sitemap dosyası için bir sitemap elementi ekle
    for sitemap_file in sitemap_files:
        sitemap = doc.createElement('sitemap')
        
        # Loc elementi
        loc = doc.createElement('loc')
        sitemap_url = f"{BASE_URL}/{os.path.basename(sitemap_file)}"
        loc_text = doc.createTextNode(sitemap_url)
        loc.appendChild(loc_text)
        sitemap.appendChild(loc)
        
        # Lastmod elementi
        lastmod = doc.createElement('lastmod')
        lastmod_text = doc.createTextNode(today)
        lastmod.appendChild(lastmod_text)
        sitemap.appendChild(lastmod)
        
        root.appendChild(sitemap)
    
    # Sitemap indeksini kaydet
    sitemap_index_path = "sitemap.xml"
    with open(sitemap_index_path, 'w', encoding='utf-8') as f:
        f.write(doc.toprettyxml(indent="  "))
    
    print(f"Sitemap indeksi oluşturuldu: {len(sitemap_files)} sitemap")
    return sitemap_index_path

def main():
    """Ana fonksiyon"""
    sitemap_files = []
    
    # Statik sayfalar için sitemap oluştur
    static_sitemap = generate_static_sitemap()
    sitemap_files.append(static_sitemap)
    
    # Her büyük il için sitemap oluştur
    for il in BUYUK_ILLER:
        il_sitemap = generate_sitemap_for_il(il)
        if il_sitemap:
            sitemap_files.append(il_sitemap)
    
    # Sitemap indeksi oluştur
    generate_sitemap_index(sitemap_files)
    
    print("Sitemap oluşturma işlemi tamamlandı!")

if __name__ == "__main__":
    main()
