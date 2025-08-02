document.addEventListener('DOMContentLoaded', function() {
    const upload = document.querySelector('#avatarUpload');
    const preview = document.querySelector('#avatarPreview');

    upload.onchange = function() {
        const file = upload.files[0];
        if(file) {
            preview.src = URL.createObjectURL(file);
        }
    }
});