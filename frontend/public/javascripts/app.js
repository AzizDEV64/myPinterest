// ── Update modal ──────────────────────────────────────────────────────────────
function openUpdate(title, desc, date) {
    document.getElementById('uTitle').value = title;
    document.getElementById('uDesc').value = desc;
    document.getElementById('uDate').value = date;
    document.getElementById('uUrl').value = '';
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

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');

// Tüm kart resimlerine tıklama ekle
document.querySelectorAll('.card-img-wrap img').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
        lightboxImg.src = this.src;
        const title = this.closest('.card').querySelector('.card-title');
        lightboxCap.textContent = title ? title.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

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
    if (e.key === 'Escape') { closeUpdate(); closeLightbox(); }
});
