// ============================================
// Dark Mode Toggle
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    document.body.classList.remove('dark-mode');
    themeToggle.textContent = '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// ============================================
// Search Functionality
// ============================================

const searchInput = document.getElementById('search-input');
const endpointCards = document.querySelectorAll('.endpoint-card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    endpointCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        card.style.display = isVisible ? 'block' : 'none';
    });

    // If search is empty, show all
    if (searchTerm === '') {
        endpointCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// ============================================
// Copy Code to Clipboard
// ============================================

function copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copiado!';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        button.textContent = 'Erro ao copiar';
    });
}

// ============================================
// Syntax Highlighting
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Highlight all code blocks
    document.querySelectorAll('code').forEach((block) => {
        if (block.classList.contains('language-bash') || 
            block.classList.contains('language-json') ||
            block.classList.contains('language-javascript')) {
            hljs.highlightElement(block);
        }
    });
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.api-section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--primary)';
            link.style.borderLeftColor = 'var(--secondary)';
        } else {
            link.style.color = 'var(--text-muted)';
            link.style.borderLeftColor = 'transparent';
        }
    });
});

// ============================================
// Mobile Menu Toggle (if needed)
// ============================================

// Add mobile menu functionality if sidebar needs to be collapsible
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
});

// ============================================
// Intersection Observer for Fade-in Animation
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.5s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.endpoint-card').forEach(card => {
    observer.observe(card);
});

// ============================================
// CSS Animations (injected dynamically)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-link.active {
        color: var(--primary) !important;
        border-left-color: var(--secondary) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// Utility: Get Query Parameters
// ============================================

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================
// Initialize
// ============================================

console.log('Hive Engine API Portal loaded successfully!');
