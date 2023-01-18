import { Dropzone } from 'dropzone';

const token = document
	.querySelector('meta[name="csrf-token"]')
	.getAttribute('content');

Dropzone.options.image = {
	dictDefaultMessage: 'Sube tus imágenes aquí',
	acceptedFiles: '.png/.jpg/.jpeg/.webp',
	maxFilesize: 10,
	maxFiles: 1,
	parallelUploads: 1,
	autoProcessQueue: false,
	dictRemoveFile: 'Borrar Archivo',
	dictMaxFilesExceeded: 'El límite es un archivo',
    headers: {
        'CSRF-TOKEN': token
    },
	paramName: 'image', 
	init: function() {
		const dropzone = this;
		const btn = document.querySelector('#post');
		btn.addEventListener('click', function() {
			dropzone.processQueue()
		});
		dropzone.on('queuecomplete', function() {
			if (dropzone.getActiveFiles().length === 0) {
				window.location.href = '/my-real-estates'
			}
		});
	}
};
