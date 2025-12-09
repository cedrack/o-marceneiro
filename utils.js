// Sistema de Notificações
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.getElementById('notification-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        `;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            <span style="font-size: 1.25rem;">${icon}</span>
            <span>${message}</span>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    getColor(type) {
        const colors = {
            success: '#48BB78',
            error: '#F56565',
            warning: '#ED8936',
            info: '#4299E1'
        };
        return colors[type] || colors.info;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
}

// Instância global
const notifications = new NotificationSystem();

// Sistema de Loading
class LoadingSystem {
    show(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (!element) return;

        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
        element.style.position = 'relative';
        element.appendChild(loader);
    }

    hide(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        if (!element) return;

        const loader = element.querySelector('.loading-overlay');
        if (loader) {
            loader.remove();
        }
    }
}

const loading = new LoadingSystem();

// Debounce para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatação de valores
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Validação de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validação de senha
function validatePassword(password) {
    return password.length >= 6;
}

// Exportar funções globais
if (typeof window !== 'undefined') {
    window.notifications = notifications;
    window.loading = loading;
    window.debounce = debounce;
    window.formatCurrency = formatCurrency;
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
}

