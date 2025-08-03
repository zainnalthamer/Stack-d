const avatarInput = document.querySelector('#avatarUpload');
const avatarPreview = document.querySelector('#avatarPreview');

if(avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];

        if(selectedFile) {
            const imageURL = URL.createObjectURL(selectedFile);
            avatarPreview.src = imageURL;
        }
    });
}