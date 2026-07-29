document.addEventListener("DOMContentLoaded", function() {
    // 1. Base de datos de tus productos por categoría
    const menuData = {
        "NOVEDADES": [
            { img: "img/icedlatte.jpg", alt: "Iced Latte", tag: "NUEVO", title: "Iced Latte" },
            { img: "img/clouddancer.jpg", alt: "Cloud Dancer", tag: null, title: "Protein Shake" },
            { img: "img/torta.jpg", alt: "Postre", tag: null, title: "Holy Hummus" }
        ],
        "LO MEJOR": [
            { img: "img/obsesion_bowl.jpg", alt: "Nachos clásicos", tag: "TOP", title: "Nachos clásicos" },
            { img: "img/obsesion bowl.jpg", alt: "obsesion bowl", tag: null, title: "obsesion bowl" },
            { img: "img/torta.jpg", alt: "Postre", tag: null, title: "Holy Hummus" },
            { img: "img/clouddancer.jpg", alt: "Cloud Dancer", tag: null, title: "Protein Shake" },
            { img: "img/torta.jpg", alt: "Postre", tag: null, title: "Holy Hummus" }
        ],
        "DESAYUNOS": [
            { img: "img/torta.jpg", alt: "Pancakes", tag: "SALUDABLE", title: "Pancakes de Avena" },
            { img: "img/tropical_love.jpg", alt: "Tropical love", tag: "TOP", title: "Tropical love" }
        ],
        "BEBIDAS": [
            { img: "img/icedlatte.jpg", alt: "Iced Latte", tag: null, title: "Iced Latte" },
            { img: "img/clouddancer.jpg", alt: "Shake", tag: null, title: "Green Detox" }
        ],
        "POSTRES": [
            { img: "img/torta.jpg", alt: "Torta", tag: "SIN AZÚCAR", title: "Torta de Zanahoria" },
            { img: "img/alfajores.jpg", alt: "Alfajores", tag: "SIN AZÚCAR", title: "Alfajores" }
            

        ]
    };

    const tabs = Array.from(document.querySelectorAll('.menu-tabs .tab'));
    const carouselGrid = document.querySelector('.carousel-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let indiceTabActual = tabs.findIndex(t => t.classList.contains('active'));
    if (indiceTabActual < 0) indiceTabActual = 0;

    // 2. Función para pintar las tarjetas según la categoría
    function renderizarCartas(categoria, posicion) {
        carouselGrid.innerHTML = ''; 
        
        const productos = menuData[categoria] || [];

        // AQUÍ ESTÁ LA MAGIA VISUAL: Agregamos "index" al forEach
        productos.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            
            // Retraso en cascada para la animación CSS (0s, 0.08s, 0.16s...)
            card.style.animationDelay = `${index * 0.08}s`; 
            
            const tagHtml = item.tag ? `<span class="card-tag">${item.tag}</span>` : '';
            
            card.innerHTML = `
                <img src="${item.img}" alt="${item.alt}">
                ${tagHtml}
                <p class="card-title">${item.title}</p>
            `;
            
            carouselGrid.appendChild(card);
        });

        carouselGrid.scrollLeft = (posicion === 'final') ? carouselGrid.scrollWidth : 0;
        reiniciarAutoplayCarrusel();
    }

    function activarTab(indice, posicion) {
        const total = tabs.length;
        indiceTabActual = ((indice % total) + total) % total;

        tabs.forEach(t => t.classList.remove('active'));
        tabs[indiceTabActual].classList.add('active');

        const categoriaSeleccionada = tabs[indiceTabActual].textContent.trim();
        renderizarCartas(categoriaSeleccionada, posicion);
    }

    // 3. Lógica de las pestañas
    tabs.forEach((tab, indice) => {
        tab.addEventListener('click', () => activarTab(indice, 'inicio'));
    });

    // 4. Lógica del carrusel
    function calcularPaso() {
        const primeraTarjeta = carouselGrid.querySelector('.menu-card');
        if (!primeraTarjeta) return 300;
        const estilos = getComputedStyle(carouselGrid);
        const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;
        return primeraTarjeta.getBoundingClientRect().width + gap;
    }

    function irSiguiente() {
        const maxScroll = carouselGrid.scrollWidth - carouselGrid.clientWidth;
        if (carouselGrid.scrollLeft >= maxScroll - 5) {
            activarTab(indiceTabActual + 1, 'inicio');
        } else {
            carouselGrid.scrollBy({ left: calcularPaso(), behavior: 'smooth' });
        }
    }

    function irAnterior() {
        if (carouselGrid.scrollLeft <= 5) {
            activarTab(indiceTabActual - 1, 'final');
        } else {
            carouselGrid.scrollBy({ left: -calcularPaso(), behavior: 'smooth' });
        }
    }

    // Autoplay y controles
    let autoplayCarrusel = setInterval(irSiguiente, 5000);

    function reiniciarAutoplayCarrusel() {
        clearInterval(autoplayCarrusel);
        autoplayCarrusel = setInterval(irSiguiente, 5000);
    }

    nextBtn.addEventListener('click', () => {
        irSiguiente();
        reiniciarAutoplayCarrusel();
    });

    prevBtn.addEventListener('click', () => {
        irAnterior();
        reiniciarAutoplayCarrusel();
    });


    // 5. Slideshow de la sección "Momentos": cambia de foto cada 5 segundos
    const momentosImg = document.getElementById('momentosImg');
    if (momentosImg) {
        // Reutilizamos las fotos del restaurante que ya están en el sitio
        const momentosFotos = ['img/momentos.jpg', 'img/momentos2.jpg', 'img/momentos3.jpg'];
        let momentosIndice = 0;

        setInterval(() => {
            momentosIndice = (momentosIndice + 1) % momentosFotos.length;
            momentosImg.style.opacity = 0;
            setTimeout(() => {
                momentosImg.src = momentosFotos[momentosIndice];
                momentosImg.style.opacity = 1;
            }, 400);
        }, 5000);
    }
});

