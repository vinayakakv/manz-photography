(() => {
    const dialog = document.querySelector('.gallery-lightbox');
    const galleryLinks = '.gallery__item a[href][data-size]';
    if (!dialog?.showModal || !document.querySelector(galleryLinks)) return;

    const photo = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    const status = dialog.querySelector('.gallery-lightbox__status');
    const navigation = dialog.querySelector('.gallery-lightbox__navigation');
    let photos = [];
    let currentIndex = 0;
    let opener;

    function showPhoto(index) {
        currentIndex = (index + photos.length) % photos.length;
        const link = photos[currentIndex];
        const description = link.querySelector('img').alt;
        const captionText = link.closest('.gallery__item').querySelector('figcaption')?.textContent.trim() ?? '';

        photo.alt = description;
        photo.src = link.href;
        caption.textContent = captionText;
        caption.hidden = !captionText;
        status.textContent = `${currentIndex + 1} / ${photos.length}`;
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest(galleryLinks);
        if (!link || event.defaultPrevented || event.button !== 0 ||
            event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const gallery = link.closest('.gallery');
        if (!gallery) return;

        photos = [...gallery.querySelectorAll(galleryLinks)].filter((item) => item.querySelector('img'));
        const index = photos.indexOf(link);
        if (index < 0) return;

        event.preventDefault();
        opener = link;
        navigation.hidden = photos.length < 2;
        showPhoto(index);
        dialog.showModal();
    });

    for (const button of navigation.querySelectorAll('button')) {
        button.addEventListener('click', () => showPhoto(currentIndex + Number(button.dataset.step)));
    }

    dialog.addEventListener('keydown', (event) => {
        if (photos.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        showPhoto(currentIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    });

    dialog.addEventListener('close', () => {
        photo.removeAttribute('src');
        opener?.focus({ preventScroll: true });
    });
})();
