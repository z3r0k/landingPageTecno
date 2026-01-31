// Lógica para el menú móvil
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
}

// Base de datos de productos (Simulada)
const productsData = {
    'laptop-pro': {
        name: "Laptop Workstation Pro - 32GB RAM",
        price: "$ 1.250",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800",
        description: "Diseñada para profesionales exigentes. Esta Workstation combina la potencia de un procesador de última generación con una capacidad de memoria inigualable.",
        specs: ["Intel Core i9 13va Gen", "32GB DDR5 RAM", "1TB SSD NVMe", "NVIDIA RTX 4070 8GB"]
    },
    'server-x1': {
        name: "Servidor Enterprise X1 - Intel Xeon",
        price: "$ 3.400",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800",
        description: "La columna vertebral de tu empresa. Seguridad de nivel bancario y redundancia total para aplicaciones críticas.",
        specs: ["Dual Intel Xeon Silver", "64GB ECC RAM", "4TB RAID 10 Storage", "Dual Power Supply"]
    },
    'monitor-4k': {
        name: "Monitor UltraWide 4K - 34\" Curvo",
        price: "$ 450",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800",
        description: "Productividad sin límites. El espacio de trabajo que necesitas para multitarea real con colores calibrados de fábrica.",
        specs: ["Resolución 3440 x 1440", "Panel IPS 144Hz", "HDR10 Support", "USB-C Power Delivery"]
    }
};

// Función para cargar detalles dinámicamente
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId && productsData[productId]) {
        const product = productsData[productId];
        
        // Actualizar textos e imágenes
        const titleElem = document.querySelector('.product-specs h1');
        const priceElem = document.querySelector('.ml-price');
        const descElem = document.querySelector('.description-box p');
        const imgElem = document.getElementById('main-product-img');
        const buyBtn = document.querySelector('.purchase-actions .buy-btn');

        if (titleElem) titleElem.textContent = product.name;
        if (priceElem) priceElem.textContent = product.price;
        if (descElem) descElem.textContent = product.description;
        if (imgElem) imgElem.src = product.image;
        if (buyBtn) buyBtn.setAttribute('data-product', product.name);

        // Actualizar lista de especificaciones
        const specsList = document.querySelector('.specs-list');
        if (specsList) {
            specsList.innerHTML = product.specs.map(spec => 
                `<li><i class="fas fa-check"></i> ${spec}</li>`
            ).join('');
        }
        
        // Actualizar título de la pestaña
        document.title = `${product.name} - Tecno Services`;
    }
}

// Servicio de WhatsApp
const WhatsAppService = {
    config: {
        phone: "584120000000", // Reemplaza con el número del asesor
        advisorName: "Asesor TecnoServices",
        // URL de tu backend que procesa la WhatsApp Business API
        apiEndpoint: "https://tu-api-backend.com/v1/whatsapp/send" 
    },

    // Método 1: Redirección directa (Click to Chat API)
    launchChat: function(customMessage = "") {
        const baseMsg = `Hola ${this.config.advisorName}, vengo de la landing page. `;
        const url = `https://wa.me/${this.config.phone}?text=${encodeURIComponent(baseMsg + customMessage)}`;
        window.open(url, '_blank');
    },

    // Método 2: Consumo de API (Simulación de llamada a Backend Proxy)
    notifyAdvisorViaAPI: async function(formData) {
        try {
            // Nota: No llamamos a graph.facebook.com directamente por seguridad del Token
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: this.config.phone,
                    template: "nuevo_contacto_asesoria",
                    vars: [formData.name, formData.email, formData.message]
                })
            });
            return response.ok;
        } catch (error) {
            console.error("Error llamando al servicio de WhatsApp API:", error);
            return false;
        }
    }
};

// Event Listeners para WhatsApp
document.getElementById('whatsapp-floating-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    WhatsAppService.launchChat("Deseo información general.");
});

document.getElementById('hero-whatsapp')?.addEventListener('click', (e) => {
    e.preventDefault();
    WhatsAppService.launchChat("Me gustaría solicitar una asesoría técnica.");
});

document.getElementById('banner-whatsapp')?.addEventListener('click', (e) => {
    e.preventDefault();
    WhatsAppService.launchChat("Hola, vi el banner en el marketplace y necesito soporte técnico para un equipo.");
});

// Event Listeners para botones de compra en Marketplace
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = e.target.getAttribute('data-product');
        WhatsAppService.launchChat(`Me interesa comprar el producto: ${productName}. ¿Está disponible?`);
    });
});

// Lógica de búsqueda en el Marketplace
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsText = document.getElementById('results-text');
const productCards = document.querySelectorAll('.ml-card');
const mlBanner = document.querySelector('.ml-banner');

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Ocultar el banner publicitario si hay una búsqueda activa para no ensuciar los resultados
    if (mlBanner) {
        mlBanner.style.display = query === '' ? 'flex' : 'none';
    }

    if (resultsText) {
        resultsText.innerHTML = `${visibleCount} resultados para <strong>"${query || 'Tecnología Pro'}"</strong>`;
    }
}

if (searchInput) searchInput.addEventListener('input', performSearch);
if (searchBtn) searchBtn.addEventListener('click', performSearch);

// Lógica del Efecto Lupa (Zoom)
const zoomBox = document.getElementById('zoom-box');
const mainImg = document.getElementById('main-product-img');

if (zoomBox && mainImg) {
    zoomBox.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = zoomBox.getBoundingClientRect();
        // Calcular posición del mouse en porcentaje dentro del contenedor
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        
        mainImg.style.transformOrigin = `${x}% ${y}%`;
        mainImg.style.transform = "scale(2)";
    });

    zoomBox.addEventListener('mouseleave', () => {
        mainImg.style.transform = "scale(1)";
    });
}

// Ejecutar carga dinámica si estamos en la página de detalles
if (window.location.pathname.includes('product-detail.html')) {
    loadProductDetails();
}

// Validación del formulario de contacto
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Limpiar errores previos
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        // Validar Nombre
        if (name.value.trim().length < 3) {
            document.getElementById('name-error').textContent = 'El nombre debe tener al menos 3 caracteres.';
            isValid = false;
        }

        // Validar Email (Regex simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            document.getElementById('email-error').textContent = 'Por favor, ingresa un correo válido.';
            isValid = false;
        }

        // Validar Mensaje
        if (message.value.trim().length < 10) {
            document.getElementById('message-error').textContent = 'El mensaje debe ser más detallado.';
            isValid = false;
        }

        if (isValid) {
            const submitBtn = contactForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Opcional: Notificar al asesor vía API mientras se procesa el formulario
            WhatsAppService.notifyAdvisorViaAPI({ name: name.value, email: email.value, message: message.value });

            // Simulación de envío (aquí podrías usar fetch para enviar a un backend)
            setTimeout(() => {
                contactForm.innerHTML = '<p class="form-success">¡Mensaje enviado! Nos pondremos en contacto contigo pronto.</p>';
                // También podemos abrir el chat automáticamente tras el éxito
                WhatsAppService.launchChat(`Mi nombre es ${name.value}. Dejé mis datos en el formulario.`);
            }, 1500);
        }
    });
}