document.addEventListener('DOMContentLoaded', function() {
    const upload = document.querySelector('#gameImageUpload');
    const preview = document.querySelector('#gameImagePreview');

    upload.onchange = function() {
        const file = upload.files[0];

        if(file) {
            preview.src = URL.createObjectURL(file);
        }
    }
})