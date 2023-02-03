(() => {
	const lat = 19.4065478;
	const lng = -99.1319522;
	const map = L.map('map').setView([lat, lng], 11);

	let markers = new L.FeatureGroup().addTo(map);

	let properties = [];

	const categorySelect = document.querySelector('#categories');
	const priceSelect = document.querySelector('#prices');

	// Filtros
	const filters = {
		category: '',
		price: ''
	};

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Filtrado de categorias
	categorySelect.addEventListener('change', (e) => {
		filters.category = Number(e.target.value);
		filterProperties();
	});

	priceSelect.addEventListener('change', (e) => {
		filters.price = Number(e.target.value);
		filterProperties();
	});

	const getProperties = async () => {
		try {
			const url = '/api/properties';
			const res = await fetch(url);
			const { estates } = await res.json();
            properties = estates;
			showProperties(estates);
		} catch (error) {
			console.log(error);
		}
	};

	const showProperties = (estates) => {
        // Limpiar markers previos
        markers.clearLayers();

		estates.forEach((estate) => {
			// Agregar pines;
			const marker = new L.marker([estate?.lat, estate?.lng], {
				autoPan: true
			}).addTo(map).bindPopup(`
                    <p class="text-indigo-600 p-0">${estate?.category.name}</p>
                    <h2 class="text-lg font-extrabold uppercase">${estate?.title}</h2>
                    <img src="/uploads/${estate?.image}" alt="Imagen de la propiedad ${estate?.title}" class="object-cover" />
                    <p class="text-gray-600 py-2">${estate?.price.value}</p>
                    <a href="/estate/${estate.id}" class="bg-indigo-600 block p-2 text-center font-bold">Ver propiedad<a/>
                `);
			markers.addLayer(marker);
		});
	};

	const filterProperties = () => {
		const res = properties
			.filter(p => filters.category != '' ? p.categoryId === filters.category : p)
			.filter(p => filters.price != '' ? p.priceId === filters.price : p);
        showProperties(res);
	};

	getProperties();
})();
