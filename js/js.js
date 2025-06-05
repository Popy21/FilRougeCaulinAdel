   // Animation 3D optimisée avec Three.js
        const init3DAnimation = () => {
            const container = document.getElementById('canvas-container');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            
            // Création de particules optimisées
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 800; // Réduit pour améliorer les performances
            
            const posArray = new Float32Array(particlesCount * 3);
            
            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.05,
                color: 0x93c5fd,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true
            });
            
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);
            
            // Création de formes géométriques simplifiées
            const torusGeometry = new THREE.TorusGeometry(1.8, 0.5, 16, 100);
            const torusMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x2563eb, 
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            scene.add(torus);
            
            const icosahedronGeometry = new THREE.IcosahedronGeometry(1.2, 0);
            const icosahedronMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x8b5cf6, 
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
            scene.add(icosahedron);
            
            // Lumière
            const pointLight = new THREE.PointLight(0x2563eb, 0.8, 100);
            scene.add(pointLight);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);
            
            camera.position.z = 5;
            
            // Animation optimisée
            const animate = () => {
                requestAnimationFrame(animate);
                
                const time = Date.now() * 0.001;
                
                // Animation des particules
                particlesMesh.rotation.y = time * 0.05;
                
                // Animation des formes
                torus.rotation.x = time * 0.1;
                torus.rotation.y = time * 0.05;
                
                icosahedron.rotation.x = time * 0.08;
                icosahedron.rotation.y = time * 0.06;
                
                renderer.render(scene, camera);
            };
            
            animate();
            
            // Redimensionnement
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        };
        
        // Visualisation réseau animée premium
        const initNetworkCanvas = () => {
            const canvas = document.getElementById('network-canvas');
            const ctx = canvas.getContext('2d');
            const container = canvas.parentElement;
            let width = container.clientWidth;
            let height = container.clientHeight;
            
            // Redimensionnement du canvas
            canvas.width = width;
            canvas.height = height;
            
            // Variables
            let nodes = [];
            let links = [];
            const mouse = { x: null, y: null, radius: 100, isActive: false };
            const MAX_NODES = 2000;
            const NODE_RADIUS = 3;
            const LINK_DISTANCE = 150;
            
            // Classe Node
            class Node {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.radius = NODE_RADIUS;
                    this.baseRadius = NODE_RADIUS;
                    this.color = '#2563eb';
                    this.links = [];
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.closePath();
                    
                    // Effet de lueur
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, this.radius,
                        this.x, this.y, this.radius * 2
                    );
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)');
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.closePath();
                }
                
                update() {
                    // Déplacement
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    // Rebond sur les bords
                    if (this.x <= this.radius || this.x >= width - this.radius) this.vx *= -1;
                    if (this.y <= this.radius || this.y >= height - this.radius) this.vy *= -1;
                    
                    // Interaction avec la souris
                    if (mouse.isActive) {
                        const dx = mouse.x - this.x;
                        const dy = mouse.y - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            const angle = Math.atan2(dy, dx);
                            this.x -= Math.cos(angle) * force * 5;
                            this.y -= Math.sin(angle) * force * 5;
                            
                            // Effet de grossissement
                            this.radius = this.baseRadius + (1 - distance / mouse.radius) * 5;
                        } else {
                            this.radius = this.baseRadius;
                        }
                    } else {
                        this.radius = this.baseRadius;
                    }
                }
            }
            
            // Classe Link
            class Link {
                constructor(source, target) {
                    this.source = source;
                    this.target = target;
                    this.distance = Math.sqrt(
                        Math.pow(source.x - target.x, 2) + 
                        Math.pow(source.y - target.y, 2)
                    );
                }
                
                draw() {
                    const dx = this.source.x - this.target.x;
                    const dy = this.source.y - this.target.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const opacity = 1 - Math.min(1, distance / LINK_DISTANCE);
                    
                    ctx.beginPath();
                    ctx.moveTo(this.source.x, this.source.y);
                    ctx.lineTo(this.target.x, this.target.y);
                    ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
            
            // Création des nodes
            function createNodes(count = 300) {
                for (let i = 0; i < count; i++) {
                    const x = Math.random() * (width - 40) + 20;
                    const y = Math.random() * (height - 40) + 20;
                    nodes.push(new Node(x, y));
                }
                updateLinks();
            }
            
            // Mise à jour des liens
            function updateLinks() {
                links = [];
                for (let i = 0; i < nodes.length; i++) {
                    const nodeA = nodes[i];
                    nodeA.links = [];
                    
                    // Trouver les 3 nodes les plus proches
                    let closest = [];
                    for (let j = 0; j < nodes.length; j++) {
                        if (i !== j) {
                            const nodeB = nodes[j];
                            const distance = Math.sqrt(
                                Math.pow(nodeA.x - nodeB.x, 2) + 
                                Math.pow(nodeA.y - nodeB.y, 2)
                            );
                            
                            if (distance < LINK_DISTANCE) {
                                closest.push({ node: nodeB, distance });
                            }
                        }
                    }
                    
                    // Trier par distance
                    closest.sort((a, b) => a.distance - b.distance);
                    
                    // Prendre les 3 plus proches
                    const closestNodes = closest.slice(0, 3).map(item => item.node);
                    
                    // Créer les liens
                    closestNodes.forEach(target => {
                        const link = new Link(nodeA, target);
                        links.push(link);
                        nodeA.links.push(link);
                    });
                }
            }
            
            // Dessin des liens avec la souris
            function drawMouseLinks() {
                if (!mouse.isActive) return;
                
                // Trouver les nodes proches de la souris
                let mouseDistances = [];
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const dx = mouse.x - node.x;
                    const dy = mouse.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < LINK_DISTANCE * 1.5) {
                        mouseDistances.push({ node, distance });
                    }
                }
                
                // Trier et prendre les 3 plus proches
                mouseDistances.sort((a, b) => a.distance - b.distance);
                const closest = mouseDistances.slice(0, 3);
                
                // Dessiner les lignes
                for (let i = 0; i < closest.length; i++) {
                    const node = closest[i].node;
                    const distance = closest[i].distance;
                    const opacity = 1 - Math.min(1, distance / (LINK_DISTANCE * 1.5));
                    
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.6})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.closePath();
                }
                
                // Dessiner un cercle pour la souris
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 12
                );
                gradient.addColorStop(0, 'rgba(139, 92, 246, 1)');
                gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
            }
            
            // Fonction d'animation
            function animate() {
                requestAnimationFrame(animate);
                ctx.clearRect(0, 0, width, height);
                
                // Dessiner les liens
                links.forEach(link => link.draw());
                
                // Mise à jour et dessin des nodes
                nodes.forEach(node => {
                    node.update();
                    node.draw();
                });
                
                // Dessiner les liens de la souris
                drawMouseLinks();
            }
            
            // Initialisation
            createNodes();
            animate();
            
            // Gestion des événements
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
                mouse.isActive = true;
            });
            
            canvas.addEventListener('mouseleave', () => {
                mouse.isActive = false;
            });
            
            // Redimensionnement
            window.addEventListener('resize', () => {
                width = container.clientWidth;
                height = container.clientHeight;
                canvas.width = width;
                canvas.height = height;
                // Recréer les nodes pour la nouvelle taille
                nodes = [];
                createNodes();
            });
            
            // Contrôles
            document.getElementById('add-nodes').addEventListener('click', () => {
                if (nodes.length < MAX_NODES) {
                    createNodes(5);
                }
            });
            
            document.getElementById('reset-network').addEventListener('click', () => {
                nodes = [];
                                createNodes(30);
            });
        };
        
        // Documentation Interactive - Fixed function scope
        const initDocumentation = () => {
            console.log('Initialisation de la documentation...');
            
            const docTabs = document.querySelectorAll('.doc-tab');
            const docPanels = document.querySelectorAll('.doc-panel');
            const progressFill = document.querySelector('.doc-progress-fill');
            const progressText = document.querySelector('.doc-progress-text');
            const prevBtn = document.getElementById('doc-prev');
            const nextBtn = document.getElementById('doc-next');
            
            console.log('Elements trouvés:', { 
                tabs: docTabs.length, 
                panels: docPanels.length, 
                progressFill: !!progressFill,
                progressText: !!progressText,
                prevBtn: !!prevBtn,
                nextBtn: !!nextBtn
            });
            
            let currentTabIndex = 0;
            const tabNames = ['Architecture', 'Sécurité', 'Implémentation', 'Conformité', 'Monitoring'];
            
            // Fonction pour mettre à jour la progression
            function updateProgress() {
                if (progressFill && progressText) {
                    const progress = ((currentTabIndex + 1) / docTabs.length) * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `${tabNames[currentTabIndex]} - Section ${currentTabIndex + 1}/${docTabs.length}`;
                }
                
                // Mettre à jour les boutons de navigation
                if (prevBtn) prevBtn.disabled = currentTabIndex === 0;
                if (nextBtn) nextBtn.disabled = currentTabIndex === docTabs.length - 1;
            }
            
            // Fonction pour changer d'onglet
            function switchTab(index) {
                console.log('Changement vers onglet:', index);
                
                if (index < 0 || index >= docTabs.length) return;
                
                // Retirer la classe active
                docTabs.forEach(t => t.classList.remove('active'));
                docPanels.forEach(p => p.classList.remove('active'));
                
                // Ajouter la classe active
                docTabs[index].classList.add('active');
                docPanels[index].classList.add('active');
                
                currentTabIndex = index;
                updateProgress();
                
                // Animation d'entrée (avec fallback si GSAP n'est pas disponible)
                if (typeof gsap !== 'undefined' && docPanels[index]) {
                    gsap.fromTo(docPanels[index], 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else if (docPanels[index]) {
                    // Fallback sans GSAP
                    docPanels[index].style.opacity = '0';
                    docPanels[index].style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        docPanels[index].style.transition = 'all 0.5s ease';
                        docPanels[index].style.opacity = '1';
                        docPanels[index].style.transform = 'translateY(0)';
                    }, 10);
                }
            }
            
            // Gestion des onglets de documentation
            docTabs.forEach((tab, index) => {
                console.log('Ajout listener sur onglet:', index, tab.textContent);
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Clic sur onglet:', index);
                    switchTab(index);
                });
            });
            
            // Navigation avec les boutons
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Clic précédent');
                    if (currentTabIndex > 0) {
                        switchTab(currentTabIndex - 1);
                    }
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Clic suivant');
                    if (currentTabIndex < docTabs.length - 1) {
                        switchTab(currentTabIndex + 1);
                    }
                });
            }
            
            // Navigation au clavier
            document.addEventListener('keydown', (e) => {
                if (e.target.closest('#documentation')) {
                    if (e.key === 'ArrowLeft' && currentTabIndex > 0) {
                        e.preventDefault();
                        switchTab(currentTabIndex - 1);
                    } else if (e.key === 'ArrowRight' && currentTabIndex < docTabs.length - 1) {
                        e.preventDefault();
                        switchTab(currentTabIndex + 1);
                    }
                }
            });
            
            // Initialiser la progression
            updateProgress();
            
            console.log('Documentation initialisée avec succès');
            
            // Animation des cartes de documentation au scroll (avec fallback)
            const docCards = document.querySelectorAll('.doc-card');
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                docCards.forEach((card, index) => {
                    gsap.fromTo(card,
                        {
                            opacity: 0,
                            y: 50,
                            scale: 0.9
                        },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 80%",
                                end: "bottom 20%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });
            }
            
            // Gestion des tooltips techniques (simple)
            const tooltips = document.querySelectorAll('.tech-tooltip');
            tooltips.forEach(tooltip => {
                tooltip.addEventListener('mouseenter', () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(tooltip, {
                            scale: 1.2,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    }
                });
                
                tooltip.addEventListener('mouseleave', () => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(tooltip, {
                            scale: 1,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    }
                });
            });
        };
        
        // Nouvelle fonction pour la timeline 3D corrigée
        const initTimeline3D = () => {
            // Données pour la timeline avec détails techniques
            const timelineData = [
                {
                    week: "Semaine 1",
                    title: "Architecture & Analyse",
                    desc: "Cartographie complète des actifs, analyse approfondie des risques et conception d'une architecture de sécurité sur mesure.",
                    details: [
                        "Audit de l'infrastructure existante",
                        "Cartographie des flux de données",
                        "Analyse des vulnérabilités critiques",
                        "Évaluation des risques métier",
                        "Architecture Zero Trust personnalisée"
                    ]
                },
                {
                    week: "Semaine 2",
                    title: "PSSI & Conformité",
                    desc: "Rédaction d'une politique de sécurité adaptée et mise en conformité RGPD/ISO 27001 avec documentation certifiée.",
                    details: [
                        "Politique de Sécurité SI (PSSI) complète",
                        "Conformité RGPD avancée",
                        "Certification ISO 27001",
                        "Procédures de gouvernance",
                        "Documentation technique certifiée"
                    ]
                },
                {
                    week: "Semaines 3-4",
                    title: "Implémentation technique",
                    desc: "Déploiement de VPN haute sécurité, IAM centralisé, durcissement des systèmes et configuration SIEM avec intégration IA.",
                    details: [
                        "VPN WireGuard chiffré AES-256",
                        "Identity & Access Management (IAM)",
                        "Durcissement systèmes Windows/Linux",
                        "SIEM avec Intelligence Artificielle",
                        "Configuration firewall nouvelle génération"
                    ]
                },
                {
                    week: "Semaine 5",
                    title: "Tests de sécurité",
                    desc: "Pentests complets, scans de vulnérabilités avancés et tests d'intrusion avec simulations d'attaques réalistes.",
                    details: [
                        "Pentests internes et externes",
                        "Tests d'intrusion avancés",
                        "Simulation d'attaques APT",
                        "Scans de vulnérabilités automatisés",
                        "Tests de phishing ciblé"
                    ]
                },
                {
                    week: "Semaine 6",
                    title: "Protection des données",
                    desc: "Mise en place du chiffrement de bout en bout, solutions DLP avancées et stratégie de sauvegarde 3-2-1 avec chiffrement AES-256.",
                    details: [
                        "Chiffrement bout en bout E2EE",
                        "Data Loss Prevention (DLP) avancé",
                        "Stratégie de sauvegarde 3-2-1",
                        "Chiffrement AES-256 des données",
                        "Gestion des clés cryptographiques"
                    ]
                },
                {
                    week: "Semaine 7",
                    title: "PCA/PRA",
                    desc: "Élaboration de plans de continuité et de reprise d'activité avec scénarios de crise et procédures de basculement automatisées.",
                    details: [
                        "Plan de Continuité d'Activité (PCA)",
                        "Plan de Reprise d'Activité (PRA)",
                        "Scénarios de crise multiples",
                        "Basculement automatisé",
                        "Tests de récupération"
                    ]
                },
                {
                    week: "Semaine 8",
                    title: "Formation & Livrables",
                    desc: "Programme de sensibilisation sur mesure et remise de la documentation complète avec certification de sécurité.",
                    details: [
                        "Formation équipes techniques",
                        "Sensibilisation utilisateurs",
                        "Documentation technique complète",
                        "Certification de sécurité",
                        "Support et maintenance inclus"
                    ]
                }
            ];
            
            const timelineWheel = document.getElementById('timeline-wheel');
            const radius = 400;
            const angleStep = (Math.PI * 2) / timelineData.length;
            let currentWeekIndex = 0; // Suivi de la semaine courante
            let targetAngle = 0;
            let isDragging = false;
            let startX = 0;
            let startAngle = 0;
            let rotationSpeed = 0;
            const timelineItems = [];
            
            // Création des éléments de timeline
            timelineData.forEach((item, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.dataset.index = index;
                
                // Positionnement circulaire initial
                const angle = index * angleStep;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                timelineItem.style.left = `calc(50% + ${x}px)`;
                timelineItem.style.top = `calc(50% + ${y}px)`;
                timelineItem.style.transform = `translate(-50%, -50%)`;
                
                // Contenu
                timelineItem.innerHTML = `
                    <div class="timeline-week">${item.week}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.desc}</p>
                `;
                
                // Ajout de l'événement de clic
                timelineItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showTimelineModal(index);
                });
                
                timelineWheel.appendChild(timelineItem);
                timelineItems.push(timelineItem);
            });
            
            // Fonction pour positionner les éléments avec texte droit
            function updateTimelinePositions() {
                timelineItems.forEach((item, index) => {
                    const totalAngle = (index * angleStep) + targetAngle;
                    const x = Math.cos(totalAngle) * radius;
                    const y = Math.sin(totalAngle) * radius;
                    
                    // Position de l'élément
                    item.style.left = `calc(50% + ${x}px)`;
                    item.style.top = `calc(50% + ${y}px)`;
                    
                    // Calculer la rotation nécessaire pour maintenir le texte horizontal avec rotation 180°
                    // L'angle de l'élément sur le cercle détermine la rotation inverse nécessaire
                    const textRotation = -totalAngle + (Math.PI / 2) + Math.PI; // Compensation + rotation 180°
                    
                    // Le texte est retourné à 180°
                    item.style.transform = `translate(-50%, -50%) rotate(${textRotation}rad)`;
                    
                    // Mettre en évidence l'élément le plus proche du haut (position 12h)
                    const normalizedAngle = ((totalAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                    const distanceFromTop = Math.abs(normalizedAngle - (Math.PI * 1.5)); // 1.5π = position 12h
                    
                    if (distanceFromTop < angleStep / 2) {
                        item.style.transform = `translate(-50%, -50%) rotate(${textRotation}rad) scale(1.1)`;
                        item.style.zIndex = '20';
                        item.style.opacity = '1';
                        currentWeekIndex = index;
                    } else {
                        item.style.zIndex = '10';
                        item.style.opacity = '0.7';
                    }
                });
            }
            
            // Navigation avec alignement précis
            document.getElementById('prev-week').addEventListener('click', () => {
                currentWeekIndex = (currentWeekIndex - 1 + timelineData.length) % timelineData.length;
                targetAngle = -currentWeekIndex * angleStep + (Math.PI * 1.5); // Aligner au top
                animateToTarget();
            });
            
            document.getElementById('next-week').addEventListener('click', () => {
                currentWeekIndex = (currentWeekIndex + 1) % timelineData.length;
                targetAngle = -currentWeekIndex * angleStep + (Math.PI * 1.5); // Aligner au top
                animateToTarget();
            });
            
            // Animation fluide vers la cible
            function animateToTarget() {
                const startAngle = getCurrentAngle();
                const targetAngleNormalized = normalizeAngle(targetAngle);
                const startAngleNormalized = normalizeAngle(startAngle);
                
                let angleDiff = targetAngleNormalized - startAngleNormalized;
                
                // Prendre le chemin le plus court
                if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                const finalTarget = startAngle + angleDiff;
                
                gsap.to({ angle: startAngle }, {
                    angle: finalTarget,
                    duration: 1.2,
                    ease: "power2.out",
                    onUpdate: function() {
                        targetAngle = this.targets()[0].angle;
                        updateTimelinePositions();
                    }
                });
            }
            
            // Fonction utilitaire pour normaliser les angles
            function normalizeAngle(angle) {
                return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            }
            
            // Fonction pour obtenir l'angle actuel
            function getCurrentAngle() {
                return targetAngle;
            }
            
            // Interaction de glissement améliorée
            timelineWheel.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startAngle = targetAngle;
                gsap.killTweensOf({});
            });
            
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                rotationSpeed = deltaX * 0.01;
                targetAngle = startAngle + rotationSpeed;
                updateTimelinePositions();
            });
            
            window.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                
                // Aligner sur la semaine la plus proche
                const normalizedAngle = normalizeAngle(targetAngle);
                const targetPosition = Math.PI * 1.5; // Position 12h
                
                let closestWeek = 0;
                let minDistance = Infinity;
                
                for (let i = 0; i < timelineData.length; i++) {
                    const weekAngle = normalizeAngle(-i * angleStep + targetPosition);
                    const distance = Math.abs(normalizeAngle(normalizedAngle - weekAngle));
                    const shortDistance = Math.min(distance, Math.PI * 2 - distance);
                    
                    if (shortDistance < minDistance) {
                        minDistance = shortDistance;
                        closestWeek = i;
                    }
                }
                
                currentWeekIndex = closestWeek;
                targetAngle = -currentWeekIndex * angleStep + targetPosition;
                animateToTarget();
            });
            
            // Initialisation avec la première semaine en haut
            currentWeekIndex = 0; // Commencer avec la semaine 1
            targetAngle = Math.PI * 1.5; // Position 12h (top center)
            updateTimelinePositions();
            
            // Fonctions pour la modal
            function showTimelineModal(index) {
                const item = timelineData[index];
                const modal = document.getElementById('timeline-modal');
                const modalWeek = document.getElementById('modal-week');
                const modalTitle = document.getElementById('modal-title');
                const modalDesc = document.getElementById('modal-desc');
                const modalDetailsList = document.getElementById('modal-details-list');
                
                // Remplir le contenu de la modal
                modalWeek.textContent = item.week;
                modalTitle.textContent = item.title;
                modalDesc.textContent = item.desc;
                
                // Vider et remplir la liste des détails
                modalDetailsList.innerHTML = '';
                item.details.forEach(detail => {
                    const li = document.createElement('li');
                    li.textContent = detail;
                    modalDetailsList.appendChild(li);
                });
                
                // Afficher la modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            function hideTimelineModal() {
                const modal = document.getElementById('timeline-modal');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Gestion des événements de la modal
            document.getElementById('timeline-modal-close').addEventListener('click', hideTimelineModal);
            
            document.getElementById('timeline-modal').addEventListener('click', (e) => {
                if (e.target.id === 'timeline-modal') {
                    hideTimelineModal();
                }
            });
            
            // Fermer la modal avec la touche Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    hideTimelineModal();
                }
            });
        };
        
        // Initialisation
        document.addEventListener('DOMContentLoaded', () => {
            // Initialiser l'animation 3D
            init3DAnimation();
            
            // Créer la visualisation réseau
            initNetworkCanvas();
            
            // Initialiser la timeline 3D
            initTimeline3D();
            
            // Initialiser la documentation interactive
            initDocumentation();
            
            // Animation au défilement
            gsap.registerPlugin(ScrollTrigger);
            
            // Animation du header au défilement
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if(window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
            
            // Animation fluide des ancres
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
              // Script pour l'interactivite du schema reseau
        document.addEventListener('DOMContentLoaded', function() {
            const nodes = document.querySelectorAll('.network-node');
            const nodeInfo = document.getElementById('node-info');
            const nodeTitle = document.getElementById('node-title');
            const nodeDetails = document.getElementById('node-details');
            
            // Données pour chaque nœud
            const nodeData = {
                'internet': {
                    title: 'Internet + Protection DDoS',
                    details: [
                        'CloudFlare Enterprise',
                        'Protection DDoS L3/L4/L7',
                        'CDN Global (200+ PoP)',
                        'WAF Cloud intégré',
                        'Filtrage géographique IP'
                    ]
                },
                'router': {
                    title: 'Routeur Edge BGP',
                    details: [
                        'Cisco ISR 4000 Series',
                        'Dual WAN Failover',
                        'BGP Multi-homing',
                        'QoS & Traffic Shaping',
                        'IPSec VPN Backup'
                    ]
                },
                'firewall-ha': {
                    title: 'Pare-feu HA Cluster',
                    details: [
                        'Palo Alto PA-5200 Series',
                        'Cluster Actif/Passif',
                        'IPS/IDS intégré',
                        'SSL Decryption',
                        'Threat Intelligence Feed',
                        'Zero-Day Protection'
                    ]
                },
                'switch-dmz': {
                    title: 'Switch DMZ L2/L3',
                    details: [
                        'Cisco Nexus 9000',
                        'VLAN 10 isolation',
                        'Port Security activé',
                        'DHCP Snooping',
                        'Dynamic ARP Inspection'
                    ]
                },
                'waf': {
                    title: 'Web Application Firewall',
                    details: [
                        'F5 Advanced WAF',
                        'Protection OWASP Top 10',
                        'Bot Detection ML',
                        'API Security Gateway',
                        'Real-time Attack Analytics'
                    ]
                },
                'load-balancer': {
                    title: 'Load Balancer HA',
                    details: [
                        'HAProxy Enterprise',
                        'Active/Active HA',
                        'SSL Offloading',
                        'Health Checks avancés',
                        'Session Persistence'
                    ]
                },
                'web-servers': {
                    title: 'Web Farm Cluster',
                    details: [
                        'Nginx + PHP-FPM',
                        'Auto-scaling horizontal',
                        'Redis Cache Layer',
                        'SSL/TLS 1.3 only',
                        'HTTP/2 & HTTP/3'
                    ]
                },
                'bastion': {
                    title: 'Bastion Host Sécurisé',
                    details: [
                        'Hardened Linux Server',
                        'SSH Key Management',
                        'Session Recording',
                        'MFA obligatoire',
                        'Audit Trail complet'
                    ]
                },
                'vpn': {
                    title: 'VPN Concentrator',
                    details: [
                        'OpenVPN AS + WireGuard',
                        'Multi-Factor Auth (MFA)',
                        'Certificate-based auth',
                        'Split Tunneling',
                        'Always-On VPN'
                    ]
                },
                'switch-core': {
                    title: 'Switch Core L3 VSS',
                    details: [
                        'Cisco Catalyst 9500',
                        'VSS Redundancy',
                        'HSRP/VRRP failover',
                        '10Gbps Uplinks',
                        'QoS & CoS policies'
                    ]
                },
                'vlan20': {
                    title: 'VLAN 20 - Applications',
                    details: [
                        'Kubernetes Cluster',
                        'Docker Containers',
                        'API Gateway Kong',
                        'Service Mesh Istio',
                        'Isolated subnet 172.16.20.0/24'
                    ]
                },
                'vlan30': {
                    title: 'VLAN 30 - Base de données',
                    details: [
                        'PostgreSQL 14 Cluster',
                        'Master-Slave Replication',
                        'Encrypted at rest (AES-256)',
                        'Point-in-time Recovery',
                        'Isolated subnet 172.16.30.0/24'
                    ]
                },
                'vlan40': {
                    title: 'VLAN 40 - Administration',
                    details: [
                        'Active Directory DC',
                        'LDAP Authentication',
                        'PKI Infrastructure',
                        'RADIUS/TACACS+',
                        'Isolated subnet 172.16.40.0/24'
                    ]
                },
                'vlan50': {
                    title: 'VLAN 50 - Sécurité',
                    details: [
                        'Splunk Enterprise SIEM',
                        'Phantom SOAR Platform',
                        'CrowdStrike Falcon XDR',
                        'Vulnerability Scanner',
                        'Threat Intelligence Platform'
                    ]
                },
                'vlan60': {
                    title: 'VLAN 60 - Sauvegarde',
                    details: [
                        'Veeam Backup Suite',
                        'Synology NAS Array',
                        'Air-gapped Backups',
                        'Immutable Storage',
                        'Replication Off-site S3'
                    ]
                }
            };
            
            // Ajouter les événements aux nœuds
            document.querySelectorAll('.network-node').forEach(node => {
                node.addEventListener('mouseenter', function(e) {
                    const nodeId = this.getAttribute('data-node');
                    const data = nodeData[nodeId];
                    if (data) {
                        nodeTitle.textContent = data.title;
                        nodeDetails.innerHTML = data.details.map(detail => `<li>${detail}</li>`).join('');
                        
                        const rect = this.getBoundingClientRect();
                        const schemaRect = this.closest('.network-schema-wrapper').getBoundingClientRect();
                        
                        nodeInfo.style.left = `${rect.left - schemaRect.left + rect.width / 2 - 150}px`;
                        nodeInfo.style.top = `${rect.bottom - schemaRect.top + 10}px`;
                        nodeInfo.classList.add('active');
                    }
                });
                
                node.addEventListener('mouseleave', function() {
                    nodeInfo.classList.remove('active');
                });
                
                // Effet de survol amélioré
                node.addEventListener('mouseenter', function() {
                    this.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(37, 99, 235, 0.8))';
                    this.style.transform = 'scale(1.05)';
                });
                
                node.addEventListener('mouseleave', function() {
                    this.style.filter = '';
                    this.style.transform = '';
                });
            });
            
            // Animation des connexions réseau
            const connections = document.querySelectorAll('.network-connection');
            connections.forEach((connection, index) => {
                connection.style.strokeDasharray = '10, 5';
                connection.style.animation = `dash 20s linear infinite`;
                connection.style.animationDelay = `${index * 0.5}s`;
            });
        });
            });