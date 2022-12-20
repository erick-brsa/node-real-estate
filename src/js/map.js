(function () {
	const lat = 19.4065478;
	const lng = -99.1319522;
	const mapa = L.map('mapa').setView([lat, lng], 11);

	// Utilizar el Provider y Geocoder
	const geocodeService = L.esri.Geocoding.geocodeService();

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mapa);

	// El pin
	let marker = new L.marker([lat, lng], {
		draggable: true,
		autoPan: true
	}).addTo(mapa);

	// Detecctar el mmovimiento del pin
	marker.on('moveend', (e) => {
		marker = e.target;
		// console.log(marker.getLatLng())
		const position = marker.getLatLng();
		mapa.panTo(new L.LatLng(position.lat, position.lng));

		// Obtener la información de las calles al soltar el pin
		geocodeService.reverse().latlng(position, 13).run(function(error, result) {
            console.log(result)
            // marker.bindPopup()
            marker.bindPopup(result.address.LongLabel)
        });
	});
})();
