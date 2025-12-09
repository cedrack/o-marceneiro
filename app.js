// Carregar banco de dados primeiro
let dbReady = false;
if (typeof globalThis.db !== 'undefined') {
    globalThis.db.init().then(async () => {
        dbReady = true;
        // Migrar dados do localStorage
        await globalThis.db.migrateFromLocalStorage();
        // Carregar produtos do banco
        await loadProductsFromDB();
    }).catch(err => {
        console.error('Erro ao inicializar banco:', err);
        dbReady = false;
    });
}

// Função para escapar HTML e prevenir XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Carregar produtos do banco de dados
async function loadProductsFromDB() {
    if (!dbReady || typeof globalThis.db === 'undefined') {
        return;
    }
    try {
        const dbProducts = await globalThis.db.getAllProducts();
        if (dbProducts && dbProducts.length > 0) {
            products = dbProducts;
            saveProducts(); // Sincronizar com localStorage para compatibilidade
        }
    } catch (error) {
        console.error('Erro ao carregar produtos do banco:', error);
    }
}

// Sistema de Favoritos
function getFavorites() {
    const user = getCurrentUser();
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
}

function saveFavorites(favorites) {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
}

function toggleFavorite(productId) {
    const user = getCurrentUser();
    if (!user) {
        if (typeof notifications !== 'undefined') {
            notifications.show('Faça login para adicionar aos favoritos', 'info');
        } else {
            alert('Faça login para adicionar aos favoritos');
        }
        return false;
    }

    let favorites = getFavorites();
    const index = favorites.indexOf(productId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        if (typeof notifications !== 'undefined') {
            notifications.show('Removido dos favoritos', 'info');
        }
    } else {
        favorites.push(productId);
        if (typeof notifications !== 'undefined') {
            notifications.show('Adicionado aos favoritos', 'success');
        }
    }
    
    saveFavorites(favorites);
    return true;
}

function isFavorite(productId) {
    const favorites = getFavorites();
    return favorites.includes(productId);
}

// Dados iniciais (simulando banco de dados)
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: '1',
        name: 'Armário Planejado 3 Portas',
        description: 'Armário planejado moderno com 3 portas, ideal para quartos e salas. Fabricado com MDF de alta densidade (18mm), acabamento em laca brilhante ou fosca, e ferragens de primeira linha. Inclui prateleiras internas ajustáveis e sistema de abertura suave. Dimensões padrão: 240cm (largura) x 240cm (altura) x 60cm (profundidade). Personalizável conforme seu espaço.',
        price: 2500,
        category: 'Armários',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '2',
        name: 'Cozinha Planejada Completa',
        description: 'Cozinha completa planejada com armários superiores e inferiores, bancada em granito ou quartzo, e ilha central opcional. Inclui gavetas com sistema de fechamento suave, portas com dobradiças de alta qualidade, e organizadores internos. Projeto personalizado com medidas exatas do seu espaço. Garantia de 5 anos em estrutura e 2 anos em acabamento. Entrega e instalação inclusas.',
        price: 15000,
        category: 'Cozinhas',
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '3',
        name: 'Guarda-Roupa 6 Portas',
        description: 'Guarda-roupa espaçoso com 6 portas correr ou basculantes, gavetas organizadoras, prateleiras internas ajustáveis e cabideiro integrado. Fabricado com MDF de alta densidade, acabamento em fórmica premium ou laca. Sistema de iluminação LED interno opcional. Dimensões: 360cm (largura) x 240cm (altura) x 60cm (profundidade). Perfeito para organizar roupas e acessórios de toda a família.',
        price: 3200,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '4',
        name: 'Estante para Sala',
        description: 'Estante moderna para sala de estar com nichos abertos e fechados, portas de vidro temperado, e iluminação LED integrada. Fabricada com MDF de alta qualidade e acabamento em laca ou fórmica. Ideal para livros, decoração e objetos pessoais. Dimensões personalizáveis conforme seu espaço. Design versátil que se adapta a diferentes estilos de decoração.',
        price: 1800,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '5',
        name: 'Mesa de Escritório',
        description: 'Mesa de escritório ergonômica com gavetas laterais, espaço para computador e acessórios, e acabamento em fórmica ou laca. Inclui gavetas com sistema de fechamento suave e organizadores internos. Dimensões padrão: 160cm (largura) x 70cm (profundidade) x 75cm (altura). Perfeita para home office ou escritório corporativo. Suporta até 100kg distribuídos.',
        price: 1200,
        category: 'Escritórios',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '6',
        name: 'Banheiro Planejado Completo',
        description: 'Banheiro planejado completo com armários suspensos, bancada com cuba, espelho com iluminação LED e nichos organizadores. Fabricado com MDF hidrofugado, ideal para ambientes úmidos. Acabamento em fórmica ou laca de alta resistência. Inclui porta-objetos, prateleiras e gavetas com sistema de fechamento suave. Projeto personalizado conforme seu espaço.',
        price: 8500,
        category: 'Banheiros',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '7',
        name: 'Painel para TV com Lareira',
        description: 'Painel moderno para TV com espaço para lareira elétrica integrada, nichos para decoração, portas com abertura suave e iluminação LED. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica premium. Dimensões personalizáveis. Ideal para salas de estar modernas. Inclui passagem de fios e organização de cabos.',
        price: 4200,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '8',
        name: 'Cama Box com Cabeceira e Gavetas',
        description: 'Cama box planejada com cabeceira integrada, gavetas laterais para armazenamento e estrutura reforçada. Disponível em vários tamanhos (solteiro, casal, queen, king). Cabeceira com nichos e iluminação LED opcional. Fabricada com MDF de alta qualidade e acabamento em laca ou fórmica. Perfeita para quartos modernos e funcionais.',
        price: 2800,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '9',
        name: 'Escritório Completo com Estante',
        description: 'Conjunto completo de escritório com mesa ampla, estante lateral com portas de vidro, gavetas organizadoras e prateleiras ajustáveis. Ideal para home office ou escritório corporativo. Fabricado com MDF de alta densidade, acabamento em fórmica ou laca. Inclui espaço para computador, impressora e acessórios. Design moderno e funcional.',
        price: 4500,
        category: 'Escritórios',
        images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '10',
        name: 'Lavabo Planejado',
        description: 'Lavabo planejado com bancada em granito ou quartzo, cuba embutida, armário inferior com portas e gavetas, e espelho com iluminação LED. Fabricado com MDF hidrofugado de alta qualidade. Acabamento em fórmica premium ou laca. Perfeito para banheiros sociais e principais. Design elegante e funcional.',
        price: 3200,
        category: 'Banheiros',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '11',
        name: 'Quarto Infantil Completo',
        description: 'Conjunto completo para quarto infantil com cama, guarda-roupa, escrivaninha e estante. Design lúdico e colorido, perfeito para crianças. Fabricado com MDF de alta qualidade, acabamento em fórmica colorida ou laca. Inclui gavetas, prateleiras ajustáveis e espaço para brinquedos. Personalizável com temas e cores.',
        price: 6800,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '12',
        name: 'Armário de Cozinha com Ilha',
        description: 'Armários de cozinha com ilha central integrada, bancada em granito ou quartzo, e sistema de iluminação LED. Inclui gavetas com sistema de fechamento suave, portas com dobradiças de alta qualidade, e organizadores internos. Projeto personalizado conforme seu espaço. Ideal para cozinhas amplas e modernas.',
        price: 18000,
        category: 'Cozinhas',
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '13',
        name: 'Rack para TV e Som',
        description: 'Rack moderno para TV e equipamentos de som com nichos organizados, portas com abertura suave, e sistema de ventilação. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica. Inclui espaço para caixas de som, DVD, videogame e acessórios. Design elegante e funcional para salas modernas.',
        price: 2200,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '14',
        name: 'Mesa de Jantar Extensível',
        description: 'Mesa de jantar planejada extensível com tampo em MDF de alta densidade ou fórmica premium. Suporta de 6 a 12 pessoas quando estendida. Base em estrutura reforçada. Acabamento em laca ou fórmica de alta qualidade. Perfeita para jantar em família e receber convidados. Design clássico e elegante.',
        price: 3500,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '15',
        name: 'Guarda-Roupa Casal 4 Portas',
        description: 'Guarda-roupa espaçoso para casal com 4 portas correr, gavetas organizadoras, prateleiras internas ajustáveis e cabideiro integrado. Fabricado com MDF de alta densidade, acabamento em fórmica premium ou laca. Sistema de iluminação LED interno opcional. Dimensões: 280cm (largura) x 240cm (altura) x 60cm (profundidade).',
        price: 3800,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '16',
        name: 'Home Office Compacto',
        description: 'Home office compacto ideal para espaços pequenos. Inclui mesa com gavetas, prateleiras superiores e organizadores. Fabricado com MDF de alta qualidade, acabamento em fórmica ou laca. Perfeito para apartamentos e espaços reduzidos. Design funcional que maximiza o uso do espaço disponível.',
        price: 1900,
        category: 'Escritórios',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '17',
        name: 'Armário de Apoio para Sala',
        description: 'Armário de apoio elegante para sala com portas de vidro temperado, gavetas organizadoras e prateleiras internas. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica premium. Ideal para guardar objetos de decoração, livros e acessórios. Design moderno que complementa qualquer decoração.',
        price: 2400,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '18',
        name: 'Cozinha Compacta Planejada',
        description: 'Cozinha compacta planejada ideal para apartamentos pequenos. Inclui armários superiores e inferiores, bancada em granito ou quartzo, e gavetas organizadoras. Fabricada com MDF de alta qualidade, acabamento em fórmica premium. Projeto otimizado para maximizar espaço e funcionalidade.',
        price: 12000,
        category: 'Cozinhas',
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '19',
        name: 'Biblioteca com Escritório Integrado',
        description: 'Biblioteca elegante com escritório integrado, perfeita para salas de estar ou home office. Inclui estantes para livros, mesa de trabalho, gavetas organizadoras e portas de vidro temperado. Fabricada com MDF de alta densidade, acabamento em laca ou fórmica premium. Iluminação LED integrada opcional. Design sofisticado e funcional.',
        price: 5500,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '20',
        name: 'Closet Planejado Premium',
        description: 'Closet planejado premium com sistema completo de organização. Inclui cabideiros, gavetas, prateleiras ajustáveis, nichos para sapatos e acessórios, e iluminação LED integrada. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica premium. Portas correr ou basculantes. Projeto personalizado conforme seu espaço e necessidades.',
        price: 8500,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '21',
        name: 'Cozinha Americana com Bar',
        description: 'Cozinha americana moderna com bar integrado, ideal para integração com a sala. Inclui armários superiores e inferiores, bancada em granito ou quartzo, ilha central com bancos, e sistema de iluminação LED. Fabricada com MDF de alta qualidade, acabamento em fórmica premium ou laca. Projeto personalizado para maximizar funcionalidade e estilo.',
        price: 22000,
        category: 'Cozinhas',
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '22',
        name: 'Escrivaninha Flutuante',
        description: 'Escrivaninha flutuante moderna e minimalista, perfeita para espaços pequenos. Fixada na parede, economiza espaço no chão. Inclui gavetas laterais e prateleira superior. Fabricada com MDF de alta densidade, acabamento em laca ou fórmica. Design elegante que se adapta a qualquer ambiente. Ideal para home office compacto.',
        price: 1400,
        category: 'Escritórios',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '23',
        name: 'Quarto de Casal Completo',
        description: 'Conjunto completo para quarto de casal com cama box, guarda-roupa, cabeceira planejada, penteadeira e criado-mudo. Design harmonioso e elegante. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica premium. Inclui gavetas, prateleiras e organizadores. Iluminação LED integrada opcional. Perfeito para criar um ambiente aconchegante e funcional.',
        price: 12000,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '24',
        name: 'Banheiro Social Planejado',
        description: 'Banheiro social planejado com armário suspenso, bancada em granito ou quartzo, cuba embutida, espelho com iluminação LED e nichos organizadores. Fabricado com MDF hidrofugado de alta qualidade. Acabamento em fórmica premium ou laca. Design moderno e funcional. Perfeito para receber visitas com elegância.',
        price: 4800,
        category: 'Banheiros',
        images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '25',
        name: 'Painel para TV 65" com Estante',
        description: 'Painel moderno para TV de até 65 polegadas com estante integrada, nichos para decoração, portas com abertura suave e iluminação LED. Fabricado com MDF de alta densidade, acabamento em laca ou fórmica premium. Inclui organização de cabos e espaço para equipamentos de som. Design elegante que valoriza sua sala de estar.',
        price: 5200,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '26',
        name: 'Mesa de Centro com Gavetas',
        description: 'Mesa de centro moderna com gavetas organizadoras e prateleira inferior. Fabricada com MDF de alta densidade, acabamento em laca ou fórmica premium. Design versátil que complementa diferentes estilos de decoração. Perfeita para salas de estar, oferecendo espaço para revistas, controles remotos e objetos decorativos.',
        price: 1100,
        category: 'Salas',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '27',
        name: 'Home Office Executivo',
        description: 'Home office executivo completo com mesa ampla, estante lateral com portas de vidro, gavetas organizadoras, prateleiras ajustáveis e espaço para impressora. Fabricado com MDF de alta densidade, acabamento em fórmica ou laca premium. Design profissional e funcional. Ideal para executivos e profissionais que trabalham em casa.',
        price: 6800,
        category: 'Escritórios',
        images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
        videos: [],
        inStock: true,
        featured: true,
    },
    {
        id: '28',
        name: 'Cozinha Linear Moderna',
        description: 'Cozinha linear moderna com armários superiores e inferiores, bancada em granito ou quartzo, e sistema de iluminação LED. Inclui gavetas com sistema de fechamento suave, portas com dobradiças de alta qualidade, e organizadores internos. Fabricada com MDF de alta qualidade, acabamento em fórmica premium. Ideal para espaços lineares e modernos.',
        price: 16500,
        category: 'Cozinhas',
        images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
    {
        id: '29',
        name: 'Quarto de Solteiro Completo',
        description: 'Conjunto completo para quarto de solteiro com cama box, guarda-roupa compacto, escrivaninha e estante. Design moderno e funcional, perfeito para jovens e adolescentes. Fabricado com MDF de alta qualidade, acabamento em fórmica colorida ou laca. Inclui gavetas, prateleiras ajustáveis e espaço para estudos. Personalizável com cores e temas.',
        price: 7500,
        category: 'Quartos',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        videos: [],
        inStock: true,
        featured: false,
    },
];

// Salvar produtos no localStorage
async function saveProducts() {
    // Salvar no localStorage para compatibilidade
    localStorage.setItem('products', JSON.stringify(products));
    
    // Salvar no banco de dados
    if (dbReady && typeof globalThis.db !== 'undefined') {
        try {
            for (const product of products) {
                try {
                    await globalThis.db.addProduct(product);
                } catch (e) {
                    // Produto já existe, atualizar
                    await globalThis.db.updateProduct(product.id, product);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar produtos no banco:', error);
        }
    }
}

// Usuários (simulando banco de dados)
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: '1',
        email: 'admin@omarceneiro.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'ADMIN'
    }
];

async function saveUsers() {
    // Salvar no localStorage para compatibilidade
    localStorage.setItem('users', JSON.stringify(users));
    
    // Salvar no banco de dados
    if (dbReady && typeof globalThis.db !== 'undefined') {
        try {
            for (const user of users) {
                try {
                    await globalThis.db.addUser(user);
                } catch (e) {
                    // Usuário já existe, atualizar
                    await globalThis.db.updateUser(user.id, user);
                }
            }
        } catch (error) {
            console.error('Erro ao salvar usuários no banco:', error);
        }
    }
}

// Sessão atual
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Atualizar contador do carrinho
async function updateCartCount() {
    const cart = await getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLinks = document.querySelectorAll('a[href="carrinho.html"]');
    cartLinks.forEach(link => {
        if (count > 0) {
            let badge = link.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = 'background: var(--secondary); color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; margin-left: 0.5rem;';
                link.appendChild(badge);
            }
            badge.textContent = count;
        } else {
            const badge = link.querySelector('.cart-badge');
            if (badge) badge.remove();
        }
    });
}

// Atualizar navegação baseado no usuário logado
async function updateNavigation() {
    await updateCartCount();
    
    const user = getCurrentUser();
    const userMenu = document.getElementById('userMenu');
    const guestMenu = document.getElementById('guestMenu');
    const adminMenu = document.getElementById('adminMenu');

    if (user) {
        if (userMenu) {
            userMenu.style.display = 'inline-flex';
            userMenu.style.visibility = 'visible';
        }
        if (guestMenu) {
            guestMenu.style.display = 'none';
            guestMenu.style.visibility = 'hidden';
        }
        if (adminMenu) {
            if (user.role === 'ADMIN') {
                adminMenu.style.display = 'inline-flex';
                adminMenu.style.visibility = 'visible';
            } else {
                adminMenu.style.display = 'none';
                adminMenu.style.visibility = 'hidden';
            }
        }
    } else {
        if (userMenu) {
            userMenu.style.display = 'none';
            userMenu.style.visibility = 'hidden';
        }
        if (guestMenu) {
            guestMenu.style.display = 'inline-flex';
            guestMenu.style.visibility = 'visible';
        }
        if (adminMenu) {
            adminMenu.style.display = 'none';
            adminMenu.style.visibility = 'hidden';
        }
    }
}

// Logout
async function logout() {
    setCurrentUser(null);
    await updateNavigation();
    globalThis.location.href = 'index.html';
}

// Event listener para logout e menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 968) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                if (window.innerWidth <= 968) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });

        // Fechar menu ao redimensionar para desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 968) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }, 250);
        });
    }
});

// Sistema de Busca e Filtros
let currentFilters = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: true,
    featured: false
};

function filterProducts() {
    return products.filter(product => {
        // Busca por texto
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            const matchesSearch = 
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Filtro por categoria
        if (currentFilters.category && product.category !== currentFilters.category) {
            return false;
        }

        // Filtro por preço mínimo
        if (currentFilters.minPrice && product.price < parseFloat(currentFilters.minPrice)) {
            return false;
        }

        // Filtro por preço máximo
        if (currentFilters.maxPrice && product.price > parseFloat(currentFilters.maxPrice)) {
            return false;
        }

        // Filtro por estoque
        if (currentFilters.inStock && !product.inStock) {
            return false;
        }

        // Filtro por destaque
        if (currentFilters.featured && !product.featured) {
            return false;
        }

        return true;
    });
}

// Obter categorias únicas
function getCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
}

// Carregar produtos em destaque
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.filter(p => p.featured).slice(0, 6);
    
    if (featured.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">Nenhum produto em destaque ainda.</p>';
        return;
    }

    container.innerHTML = featured.map(product => `
        <a href="produto.html?id=${encodeURIComponent(product.id)}" class="product-card">
            ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="product-image">` : ''}
            <div class="product-info">
                ${product.featured ? '<span class="product-badge">Destaque</span>' : ''}
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
            </div>
        </a>
    `).join('');
}

// Carregar produtos com filtros
function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    // Mostrar loading
    if (typeof loading !== 'undefined') {
        loading.show(container);
    }

    // Simular delay para melhor UX
    setTimeout(() => {
        const filteredProducts = filterProducts();

        if (filteredProducts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum produto encontrado com os filtros selecionados</p></div>';
            if (typeof loading !== 'undefined') {
                loading.hide(container);
            }
            return;
        }

        container.innerHTML = filteredProducts.map(product => {
            const isFav = isFavorite(product.id);
            return `
                <div class="product-card-wrapper">
                    <a href="produto.html?id=${encodeURIComponent(product.id)}" class="product-card">
                        ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="product-image">` : ''}
                        <div class="product-info">
                            ${product.featured ? '<span class="product-badge">Destaque</span>' : ''}
                            <h3 class="product-name">${escapeHtml(product.name)}</h3>
                            <p class="product-description">${escapeHtml(product.description.substring(0, 100))}${product.description.length > 100 ? '...' : ''}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                                ${product.inStock ? '' : '<span style="color: #dc2626; font-weight: 600; font-size: 0.875rem;">Esgotado</span>'}
                            </div>
                        </div>
                    </a>
                    <button onclick="toggleFavorite('${escapeHtml(product.id)}'); loadProducts();" class="favorite-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
            `;
        }).join('');

        if (typeof loading !== 'undefined') {
            loading.hide(container);
        }
    }, 300);
}

// Carregar todos os produtos
function loadAllProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum produto cadastrado ainda.</p></div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <a href="produto.html?id=${encodeURIComponent(product.id)}" class="product-card">
            ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="product-image">` : ''}
            <div class="product-info">
                ${product.featured ? '<span class="product-badge">Destaque</span>' : ''}
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    ${product.inStock ? '' : '<span style="color: #dc2626; font-weight: 600; font-size: 0.875rem;">Esgotado</span>'}
                </div>
            </div>
        </a>
    `).join('');
}

// Carregar detalhes do produto
function loadProductDetail() {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        globalThis.location.href = 'produtos.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.body.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Produto não encontrado</h1><a href="produtos.html">Voltar para produtos</a></div>';
        return;
    }

    const container = document.getElementById('productDetail');
    if (container) {
        const productIdEscaped = escapeHtml(product.id);
        container.innerHTML = `
            <div class="product-detail-grid">
                <div>
                    ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="product-detail-image">` : ''}
                </div>
                <div class="product-detail-info">
                    <h1>${escapeHtml(product.name)}</h1>
                    <p class="product-detail-price">R$ ${product.price.toFixed(2)}</p>
                    <p class="product-detail-description">${escapeHtml(product.description)}</p>
                    <span class="product-category">${escapeHtml(product.category)}</span>
                    <div class="product-stock">
                        ${product.inStock ? 
                            '<span class="stock-available">✓ Em estoque</span>' : 
                            '<span class="stock-unavailable">✗ Esgotado</span>'
                        }
                    </div>
                    <button onclick="addToCart('${productIdEscaped}')" class="btn-submit" ${product.inStock ? '' : 'disabled'}>
                        ${product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                    </button>
                </div>
            </div>
        `;
    }
}

// Carrinho
async function getCart() {
    // Tentar carregar do banco de dados primeiro
    if (dbReady && typeof globalThis.db !== 'undefined') {
        const user = getCurrentUser();
        if (user) {
            try {
                const cartItems = await globalThis.db.getCart(user.id);
                // Converter para formato antigo
                const cart = [];
                for (const item of cartItems) {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        cart.push({
                            productId: item.productId,
                            quantity: item.quantity,
                            product: product
                        });
                    }
                }
                return cart;
            } catch (error) {
                console.error('Erro ao carregar carrinho do banco:', error);
            }
        }
    }
    
    // Fallback para localStorage
    return JSON.parse(localStorage.getItem('cart')) || [];
}

async function saveCart(cart) {
    // Salvar no localStorage para compatibilidade
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Salvar no banco de dados
    if (dbReady && typeof globalThis.db !== 'undefined') {
        const user = getCurrentUser();
        if (user) {
            try {
                // Limpar carrinho antigo
                await globalThis.db.clearCart(user.id);
                // Adicionar itens novos
                for (const item of cart) {
                    await globalThis.db.addToCart(user.id, item.productId, item.quantity);
                }
            } catch (error) {
                console.error('Erro ao salvar carrinho no banco:', error);
            }
        }
    }
}

async function addToCart(productId) {
    const user = getCurrentUser();
    if (!user) {
        if (typeof notifications !== 'undefined') {
            notifications.show('Faça login para adicionar ao carrinho', 'warning');
        } else {
            alert('Você precisa estar logado para adicionar ao carrinho');
        }
        setTimeout(() => {
            globalThis.location.href = 'login.html';
        }, 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) {
        if (typeof notifications !== 'undefined') {
            notifications.show('Produto não disponível', 'error');
        } else {
            alert('Produto não disponível');
        }
        return;
    }

    let cart = await getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now().toString(),
            productId: productId,
            quantity: 1
        });
    }

    await saveCart(cart);
    await updateCartCount();
    
    if (typeof notifications !== 'undefined') {
        notifications.show('Produto adicionado ao carrinho!', 'success');
    } else {
        alert('Produto adicionado ao carrinho!');
    }
}

async function loadCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    
    if (!container) return;

    const cart = await getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Seu carrinho está vazio</p>
                <a href="produtos.html" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Ver Produtos</a>
            </div>
        `;
        if (summary) summary.innerHTML = '';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        const itemIdEscaped = escapeHtml(item.id);

        return `
            <div class="cart-item">
                ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" class="cart-item-image">` : ''}
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${escapeHtml(product.name)}</h3>
                    <p class="cart-item-price">R$ ${product.price.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${itemIdEscaped}', ${item.quantity - 1})">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${itemIdEscaped}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${itemIdEscaped}')">Remover</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (summary) {
        summary.innerHTML = `
            <h2>Resumo</h2>
            <div class="cart-summary-item">
                <span>Subtotal</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
            <div class="cart-summary-item">
                <span>Frete</span>
                <span>Calculado no checkout</span>
            </div>
            <div class="cart-summary-total">
                <span>Total</span>
                <span class="total-value">R$ ${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="btn-submit" style="display: block; text-align: center; text-decoration: none; margin-top: 1rem;">Finalizar Compra</a>
        `;
    }
}

async function updateQuantity(itemId, newQuantity) {
    let cart = await getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (!item) return;

    if (newQuantity <= 0) {
        await removeFromCart(itemId);
        return;
    }

    item.quantity = newQuantity;
    await saveCart(cart);
    await loadCart();
}

async function removeFromCart(itemId) {
    let cart = await getCart();
    cart = cart.filter(i => i.id !== itemId);
    await saveCart(cart);
    await loadCart();
}

// Pedidos
async function getOrders() {
    // Tentar carregar do banco de dados primeiro
    if (dbReady && typeof globalThis.db !== 'undefined') {
        const user = getCurrentUser();
        if (user) {
            try {
                return await globalThis.db.getOrdersByUser(user.id);
            } catch (error) {
                console.error('Erro ao carregar pedidos do banco:', error);
            }
        }
    }
    
    // Fallback para localStorage
    return JSON.parse(localStorage.getItem('orders')) || [];
}

async function saveOrders(orders) {
    // Salvar no localStorage para compatibilidade
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Salvar no banco de dados
    if (dbReady && typeof globalThis.db !== 'undefined') {
        try {
            for (const order of orders) {
                try {
                    await globalThis.db.addOrder(order);
                } catch (e) {
                    // Pedido já existe, ignorar
                }
            }
        } catch (error) {
            console.error('Erro ao salvar pedidos no banco:', error);
        }
    }
}

async function createOrder(shippingAddress, paymentMethod) {
    const user = getCurrentUser();
    if (!user) return null;

    const cart = await getCart();
    if (cart.length === 0) return null;

    let total = 0;
    const items = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            total += product.price * item.quantity;
            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            };
        }
        return null;
    }).filter(Boolean);

    // Calcular desconto baseado na forma de pagamento
    let discount = 0;
    if (paymentMethod === 'pix') {
        discount = total * 0.05;
    } else if (paymentMethod === 'debit') {
        discount = total * 0.03;
    }
    
    const finalTotal = total - discount;

    const paymentMethodNames = {
        'pix': 'PIX',
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'boleto': 'Boleto Bancário',
        'cash': 'Dinheiro na Entrega'
    };

    const order = {
        id: Date.now().toString(),
        userId: user.id,
        items: items,
        total: finalTotal,
        subtotal: total,
        discount: discount,
        paymentMethod: paymentMethod,
        paymentMethodName: paymentMethodNames[paymentMethod] || paymentMethod,
        status: 'PENDING',
        shippingAddress: shippingAddress,
        createdAt: new Date().toISOString()
    };

    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    // Limpar carrinho
    await saveCart([]);

    return order;
}

async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = '<div class="empty-state"><p>Você precisa estar logado para ver seus pedidos.</p><a href="login.html" class="btn-primary">Fazer Login</a></div>';
        return;
    }

    const orders = (await getOrders()).filter(o => o.userId === user.id).reverse();

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Você ainda não fez nenhum pedido</p><a href="produtos.html" class="btn-primary">Ver Produtos</a></div>';
        return;
    }

    container.innerHTML = orders.map(order => {
        const statusClass = order.status.toLowerCase();
        const statusText = {
            'PENDING': 'Pendente',
            'PROCESSING': 'Processando',
            'SHIPPED': 'Enviado',
            'DELIVERED': 'Entregue',
            'CANCELLED': 'Cancelado'
        }[order.status] || order.status;

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Pedido #${escapeHtml(order.id.slice(0, 8))}</div>
                        <div class="order-date">${new Date(order.createdAt).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="order-status ${statusClass}">${escapeHtml(statusText)}</span>
                        <div class="order-total" style="margin-top: 0.5rem;">R$ ${order.total.toFixed(2)}</div>
                    </div>
                </div>
                <div class="order-items">
                    <h4>Itens:</h4>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                <span>${escapeHtml(item.productName)} × ${item.quantity}</span>
                                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="order-items">
                    <h4>Resumo Financeiro:</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Subtotal:</span>
                            <span>R$ ${(order.subtotal || order.total).toFixed(2)}</span>
                        </div>
                        ${order.discount && order.discount > 0 ? `
                            <div style="display: flex; justify-content: space-between; color: var(--success);">
                                <span>Desconto:</span>
                                <span>- R$ ${order.discount.toFixed(2)}</span>
                            </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; font-weight: 600; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #E2E8F0;">
                            <span>Total:</span>
                            <span>R$ ${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                ${order.paymentMethodName ? `
                    <div class="order-items">
                        <h4>Forma de Pagamento:</h4>
                        <p style="color: #6b7280; font-weight: 600;">${escapeHtml(order.paymentMethodName)}</p>
                    </div>
                ` : ''}
                ${order.shippingAddress ? `
                    <div class="order-items">
                        <h4>Endereço de Entrega:</h4>
                        <p style="color: #6b7280;">${escapeHtml(order.shippingAddress)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Admin
function loadAdminProducts() {
    const container = document.getElementById('adminProducts');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Nenhum produto cadastrado</td></tr>';
        return;
    }

    container.innerHTML = products.map(product => {
        const productIdEscaped = escapeHtml(product.id);
        return `
        <tr>
            <td>
                ${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}">` : '<div style="width: 64px; height: 64px; background: #e5e7eb; border-radius: 0.25rem;"></div>'}
            </td>
            <td>
                <div style="font-weight: 600;">${escapeHtml(product.name)}</div>
                <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">${escapeHtml(product.description.substring(0, 50))}...</div>
            </td>
            <td>
                <span style="background: #e9eef5; color: #2a364f; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">${escapeHtml(product.category)}</span>
            </td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    ${product.inStock ? 
                        '<span style="background: #dcfce7; color: #166534; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Em Estoque</span>' : 
                        '<span style="background: #fee2e2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Esgotado</span>'
                    }
                    ${product.featured ? '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Destaque</span>' : ''}
                </div>
            </td>
            <td>
                <div class="admin-actions">
                    <a href="admin-produto.html?id=${encodeURIComponent(product.id)}">Editar</a>
                    <button class="delete" onclick="deleteProduct('${productIdEscaped}')">Excluir</button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

function loadAdminStats() {
    const totalProducts = document.getElementById('totalProducts');
    const inStockProducts = document.getElementById('inStockProducts');
    const featuredProducts = document.getElementById('featuredProductsCount');

    if (totalProducts) totalProducts.textContent = products.length;
    if (inStockProducts) inStockProducts.textContent = products.filter(p => p.inStock).length;
    if (featuredProducts) featuredProducts.textContent = products.filter(p => p.featured).length;
}

async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    products = products.filter(p => p.id !== productId);
    await saveProducts();
    
    // Excluir do banco de dados
    if (dbReady && typeof globalThis.db !== 'undefined') {
        try {
            await globalThis.db.deleteProduct(productId);
        } catch (error) {
            console.error('Erro ao excluir produto do banco:', error);
        }
    }
    
    loadAdminProducts();
    loadAdminStats();
    alert('Produto excluído com sucesso!');
}

// Inicializar dados se necessário
if (localStorage.getItem('products') === null) {
    saveProducts();
} else {
    // Atualizar produtos existentes com novas imagens
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    const updatedProducts = savedProducts.map(p => {
        if (p.id === '2' && p.name === 'Cozinha Planejada Completa') {
            return {
                ...p,
                images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&w=800']
            };
        }
        return p;
    });
    products = updatedProducts;
    saveProducts();
}
if (localStorage.getItem('users') === null) {
    saveUsers();
}

// Função para abrir WhatsApp
function openWhatsApp(message = 'Olá! Gostaria de mais informações.') {
    // Número do WhatsApp (formato: 5511999999999 - código do país + DDD + número)
    // Altere para o número real da empresa
    const phoneNumber = '5511999999999';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    globalThis.open(whatsappUrl, '_blank');
}

// Handler para toggle favorite com reload
async function handleToggleFavorite(productId) {
    await toggleFavorite(productId);
    await loadProducts();
}

// Tornar funções globais
if (typeof globalThis !== 'undefined') {
    globalThis.openWhatsApp = openWhatsApp;
    globalThis.addToCart = addToCart;
    globalThis.updateQuantity = updateQuantity;
    globalThis.removeFromCart = removeFromCart;
    globalThis.deleteProduct = deleteProduct;
    globalThis.toggleFavorite = toggleFavorite;
    globalThis.handleToggleFavorite = handleToggleFavorite;
    globalThis.logout = logout;
}
