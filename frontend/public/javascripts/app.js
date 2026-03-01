// ── Add Image modal ──────────────────────────────────────────────────────────
function openAddImage() {
    document.getElementById('aTitle').value = '';
    document.getElementById('aDesc').value = '';
    clearDropZone('add');
    document.getElementById('addImageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddImage() {
    document.getElementById('addImageModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('addImageModal').addEventListener('click', function (e) {
    if (e.target === this) closeAddImage();
});

// ── Update modal ──────────────────────────────────────────────────────────────
function openUpdate(id, title, desc) {
    document.getElementById('uImageId').value = id;
    document.getElementById('uTitle').value = title;
    document.getElementById('uDesc').value = desc;
    clearDropZone('update');
    document.getElementById('updateModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUpdate() {
    document.getElementById('updateModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('updateModal').addEventListener('click', function (e) {
    if (e.target === this) closeUpdate();
});

// ── Drop Zone (drag & drop) ──────────────────────────────────────────────────
function getDropElements(mode) {
    var prefix = mode === 'add' ? 'a' : 'u';
    return {
        zone: document.getElementById(prefix + 'DropZone'),
        input: document.getElementById(prefix + 'File'),
        urlIn: document.getElementById(prefix + 'ImageURL'),
        prompt: document.getElementById(prefix + 'DropPrompt'),
        preview: document.getElementById(prefix + 'DropPreview'),
        img: document.getElementById(prefix + 'PreviewImg')
    };
}

function showPreview(mode, src) {
    var el = getDropElements(mode);
    el.img.src = src;
    el.prompt.style.display = 'none';
    el.preview.style.display = 'block';
    el.input.style.display = 'none';
}

function clearDropZone(mode) {
    var el = getDropElements(mode);
    el.input.value = '';
    el.urlIn.value = '';
    el.img.src = '';
    el.prompt.style.display = '';
    el.preview.style.display = 'none';
    el.input.style.display = '';
}

function initDropZone(mode) {
    var el = getDropElements(mode);

    // Dosya seçildiğinde önizleme
    el.input.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            el.urlIn.value = '';
            var reader = new FileReader();
            reader.onload = function (e) { showPreview(mode, e.target.result); };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Drag over efektleri
    el.zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        el.zone.classList.add('drag-over');
    });

    el.zone.addEventListener('dragleave', function () {
        el.zone.classList.remove('drag-over');
    });

    // Drop — dosya veya URL
    el.zone.addEventListener('drop', function (e) {
        e.preventDefault();
        el.zone.classList.remove('drag-over');

        // 1) Dosya sürüklendiyse
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            var file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                // DataTransfer ile input'a dosya ata
                var dt = new DataTransfer();
                dt.items.add(file);
                el.input.files = dt.files;
                el.urlIn.value = '';
                var reader = new FileReader();
                reader.onload = function (ev) { showPreview(mode, ev.target.result); };
                reader.readAsDataURL(file);
                return;
            }
        }

        // 2) İnternetten resim sürüklendiyse — URL al
        var url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '';
        // HTML'den src çıkarmayı dene
        var html = e.dataTransfer.getData('text/html') || '';
        if (html) {
            var match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) url = match[1];
        }

        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            el.input.value = '';
            el.urlIn.value = url;
            showPreview(mode, url);
        }
    });
}

// Her iki drop zone'u başlat
initDropZone('add');
initDropZone('update');

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');

// Tüm kart resimlerine tıklama ekle (yeniden çağrılabilir)
function bindLightbox() {
    document.querySelectorAll('.card-img-wrap img').forEach(function (img) {
        if (img.dataset.lightboxBound) return;
        img.dataset.lightboxBound = '1';
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            lightboxImg.src = this.src;
            const title = this.closest('.card').querySelector('.card-title');
            lightboxCap.textContent = title ? title.textContent : '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}
bindLightbox();

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 300);
}

lightbox.addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

// ESC her ikisini de kapatır
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAddImage(); closeUpdate(); closeLightbox(); }
});
