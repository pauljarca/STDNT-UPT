$('#upload-aphoto').on('click', document.getElementById('upload-aphoto'), function () {
    document.getElementById('selectedFile').click();
});

$('#selectedFile').change(function () {
    if (this.files[0] === undefined)
        return;
    $('#imageModalContainer').modal('show');
    let reader = new FileReader();
    reader.addEventListener("load", function () {
        window.src = reader.result;
        $('#selectedFile').val('');
    }, false);
    if (this.files[0]) {
        reader.readAsDataURL(this.files[0]);
    }
});

let croppi;
$('#imageModalContainer').on('shown.bs.modal', function () {
    let width = document.getElementById('crop-image-container').offsetWidth - 20;
    $('#crop-image-container').height((width) + 'px');
    croppi = $('#crop-image-container').croppie({
        viewport: {
            width: width,
            height: width,
            type: 'circle'
        },
    });
    $('.modal-body1').height(document.getElementById('crop-image-container').offsetHeight + 50 + 'px');
    console.log(document.getElementById('crop-image-container').offsetHeight);
    croppi.croppie('bind', {
        url: window.src,
    }).then(function () {
        croppi.croppie('setZoom', 0);
    });
});
$('#imageModalContainer').on('hidden.bs.modal', function () {
    croppi.croppie('destroy');
});

$(document).on('click', '.save-modal', function (ev) {
    croppi.croppie('result', {
        type: 'base64',
        format: 'png',
        size: 'original'
    }).then(function (resp) {
        $('.modal').modal('hide');
        $('#upload-aphoto').css('background-image', 'url(' + resp + ')');
    });
});