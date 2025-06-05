// Preloader avec gestion avancée du chargement
class PreloaderManager {
    constructor() {
        this.loadedResources = 0;
        this.totalResources = 0;
        this.criticalResources = [];
        this.isComplete = false;
        
        this.init();
    }
    
    init() {
        // Créer le HTML du preloader
        this.createPreloader();
        
        // Compter toutes les ressources à charger
        this.countResources();
        
        // Démarrer le chargement
        this.startLoading();
        
        // Écouter les événements de chargement
        this.attachLoadListeners();
    }
    
    createPreloader() {
        const preloaderHTML = `
            <div id="preloader" class="preloader-container">
                <div class="preloader-content">
                    <div class="preloader-logo">
                        <div class="logo-text">Cov<span>Y</span></div>
                        <div class="logo-subtitle">Security Loading...</div>
                    </div>
                    
                    <div class="preloader-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <div class="progress-text">
                            <span id="progress-percent">0%</span>
                            <span id="progress-status">Initialisation...</span>
                        </div>
                    </div>
                    
                    <div class="preloader-animation">
                        <div class="cyber-grid">
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                        </div>
                        <div class="security-scanner">
                            <div class="scanner-line"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
    }
    
    countResources() {
        // Images
        const images = document.querySelectorAll('img');
        this.totalResources += images.length;
        
        // Scripts externes
        const scripts = document.querySelectorAll('script[src]');
        this.totalResources += scripts.length;
        
        // Stylesheets
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        this.totalResources += stylesheets.length;
        
        // Fonts
        this.totalResources += 2; // Google Fonts
        
        // Three.js et Canvas
        this.totalResources += 1; // Three.js scene
        
        // Ressources critiques (à charger en priorité) - Chemins corrigés
        this.criticalResources = [
            './css/styles.css',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js'
        ];
    }
    
    startLoading() {
        // Précharger les ressources critiques
        this.preloadCriticalResources();
        
        // Précharger les images importantes
        this.preloadImages();
        
        // Initialiser les animations GSAP après chargement
        this.initializeAnimations();
    }
    
    preloadCriticalResources() {
        this.criticalResources.forEach(resource => {
            if (resource.endsWith('.css')) {
                this.preloadCSS(resource);
            } else if (resource.endsWith('.js')) {
                this.preloadScript(resource);
            }
        });
    }
    
    preloadCSS(href) {
        // Vérifier si le fichier existe avant de le précharger
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = () => {
            link.onload = null;
            link.rel = 'stylesheet';
            this.updateProgress();
        };
        link.onerror = () => {
            console.warn(`Failed to load CSS: ${href}`);
            this.updateProgress(); // Continue même en cas d'erreur
        };
        document.head.appendChild(link);
    }
    
    preloadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => this.updateProgress();
        script.onerror = () => {
            console.warn(`Failed to load script: ${src}`);
            this.updateProgress(); // Continue même en cas d'erreur
        };
        document.head.appendChild(script);
    }
    
    preloadImages() {
        const imagesToPreload = [
            './img/pdg.png',
            './img/adel.png',
            './img/caulin.png'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => this.updateProgress();
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                this.updateProgress(); // Continue même si erreur
            };
            img.src = src;
        });
    }
    
    attachLoadListeners() {
        // Images
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                this.updateProgress();
            } else {
                img.addEventListener('load', () => this.updateProgress());
                img.addEventListener('error', () => this.updateProgress());
            }
        });
        
        // Window load event
        window.addEventListener('load', () => {
            setTimeout(() => this.completeLoading(), 500);
        });
    }
    
    updateProgress() {
        this.loadedResources++;
        const percent = Math.min(Math.round((this.loadedResources / this.totalResources) * 100), 100);
        
        // Mettre à jour l'UI
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        const progressStatus = document.getElementById('progress-status');
        
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressPercent) progressPercent.textContent = percent + '%';
        
        // Mettre à jour le statut
        if (progressStatus) {
            if (percent < 30) {
                progressStatus.textContent = 'Chargement des ressources...';
            } else if (percent < 60) {
                progressStatus.textContent = 'Initialisation de la sécurité...';
            } else if (percent < 90) {
                progressStatus.textContent = 'Configuration du système...';
            } else {
                progressStatus.textContent = 'Presque prêt...';
            }
        }
        
        // Vérifier si le chargement est complet
        if (percent >= 100 && !this.isComplete) {
            this.completeLoading();
        }
    }
    
    initializeAnimations() {
        // Initialiser les animations GSAP pour une navigation fluide
        if (typeof gsap !== 'undefined') {
            // Smooth scroll
            gsap.registerPlugin(ScrollTrigger);
            
            // Animation des éléments au scroll
            gsap.utils.toArray('.section').forEach(section => {
                gsap.from(section.querySelectorAll('.fade-in'), {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        }
    }
    
    completeLoading() {
        this.isComplete = true;
        const preloader = document.getElementById('preloader');
        
        // Animation de sortie
        if (preloader) {
            preloader.classList.add('preloader-complete');
            
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
                
                // Déclencher les animations d'entrée
                this.triggerEntranceAnimations();
            }, 800);
        }
    }
    
    triggerEntranceAnimations() {
        // Animation du hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate-in');
        }
        
        // Initialiser le smooth scroll
        this.initSmoothScroll();
        
        // Lazy loading des images
        this.initLazyLoading();
    }
    
    initSmoothScroll() {
        // Smooth scroll pour les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initLazyLoading() {
        // Observer pour le lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observer toutes les images avec data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Optimisations de performance
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Debounce pour les événements fréquents
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        // Throttle pour limiter la fréquence
        this.throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        
        // Optimiser les événements
        this.optimizeEvents();
        
        // Activer le cache des ressources
        this.enableResourceCache();
    }
    
    optimizeEvents() {
        // Optimiser le scroll
        let ticking = false;
        function updateScrollProgress() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Mettre à jour les éléments liés au scroll
                    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        
        // Optimiser le resize
        window.addEventListener('resize', this.debounce(() => {
            // Recalculer les dimensions si nécessaire
            if (window.networkCanvas) {
                window.networkCanvas.handleResize();
            }
        }, 250));
    }
    
    enableResourceCache() {
        // Précharger uniquement les ressources qui existent
        const resourcesToPreload = [
            { href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap', as: 'style' }
        ];
        
        // Vérifier l'existence des fichiers locaux avant de les précharger
        const localResources = [
            { href: './css/styles.css', as: 'style' },
            { href: './js/js.js', as: 'script' }
        ];
        
        localResources.forEach(resource => {
            // Créer une requête HEAD pour vérifier l'existence
            fetch(resource.href, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch'; // Utiliser prefetch au lieu de preload
                        link.href = resource.href;
                        link.as = resource.as;
                        document.head.appendChild(link);
                    }
                })
                .catch(() => {
                    console.warn(`Resource not found: ${resource.href}`);
                });
        });
        
        // Précharger les ressources externes
        resourcesToPreload.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = new URL(resource.href).origin;
            document.head.appendChild(link);
        });
    }
}

// Initialiser le preloader
document.addEventListener('DOMContentLoaded', () => {
    window.preloaderManager = new PreloaderManager();
    window.performanceOptimizer = new PerformanceOptimizer();
});

// CSS pour le preloader (à ajouter dans styles.css)
const preloaderStyles = `
<style>
.preloader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.preloader-complete {
    opacity: 0;
    transform: scale(1.1);
}

.preloader-content {
    text-align: center;
    position: relative;
}

.preloader-logo {
    margin-bottom: 40px;
}

.logo-text {
    font-size: 60px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -2px;
    margin-bottom: 10px;
}

.logo-text span {
    color: #3b82f6;
}

.logo-subtitle {
    font-size: 16px;
    color: #93c5fd;
    text-transform: uppercase;
    letter-spacing: 4px;
}

.preloader-progress {
    width: 300px;
    margin: 0 auto 40px;
}

.progress-bar {
    height: 4px;
    background: rgba(147, 197, 253, 0.2);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #93c5fd 100%);
    width: 0%;
    transition: width 0.4s ease;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.progress-text {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    color: #93c5fd;
    font-size: 14px;
}

.preloader-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    pointer-events: none;
    opacity: 0.3;
}

.cyber-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.grid-line {
    position: absolute;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    animation: gridMove 3s linear infinite;
}

.grid-line:nth-child(1) {
    width: 1px;
    height: 100%;
    left: 33%;
    animation-delay: 0s;
}

.grid-line:nth-child(2) {
    width: 1px;
    height: 100%;
    left: 66%;
    animation-delay: 1s;
}

.grid-line:nth-child(3) {
    width: 100%;
    height: 1px;
    top: 50%;
    animation: gridMoveH 3s linear infinite;
}

@keyframes gridMove {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
}

@keyframes gridMoveH {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.security-scanner {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    animation: rotate 4s linear infinite;
}

.scanner-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6);
    transform-origin: right center;
    animation: scan 2s linear infinite;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes scan {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

/* Animations d'entrée après chargement */
body.loaded {
    overflow-x: hidden;
}

.animate-in {
    animation: fadeInUp 1s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Optimisations pour les animations */
.fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Lazy loading des images */
img[data-src] {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.loaded {
    opacity: 1;
}

/* Optimisation des transitions */
* {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* GPU acceleration */
.gpu-accelerated {
    transform: translateZ(0);
    will-change: transform;
}
</style>
`;

// Injecter les styles du preloader
document.head.insertAdjacentHTML('beforeend', preloaderStyles);

// Corriger le calcul du temps de chargement
window.addEventListener('load', () => {
    // Performance monitoring amélioré
    if ('performance' in window && performance.timing) {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (pageLoadTime > 0) {
                console.log(`Page load time: ${pageLoadTime}ms`);
                
                // Avertir seulement si le temps est valide et élevé
                if (pageLoadTime > 3000) {
                    console.warn('Page load time exceeds 3 seconds');
                }
            }
        }, 0);
    }
});
