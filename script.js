// Navigation mobile
const navToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu mobile
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fermer le menu au clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling pour les liens d'ancrage
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Vérifier si c'est un lien d'ancrage (commence par #) ou un lien externe
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        // Pour les liens externes (comme talents.html), laisser le comportement par défaut
    });
});

// Mise à jour du lien actif lors du scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Animation d'apparition au scroll (AOS simple)
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
}

// Initialiser les animations au chargement
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Effet de parallaxe léger pour le hero (désactivé sur mobile)
window.addEventListener('scroll', () => {
    // Vérifier si on est sur mobile
    if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    } else {
        // Réinitialiser la transformation sur mobile
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = 'translateY(0px)';
        }
    }
});

// Animation des boutons au hover
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gestion des clics sur les boutons hero
const btnCafe = document.querySelector('.btn-primary');
const btnTalent = document.querySelector('.btn-secondary');

btnCafe.addEventListener('click', () => {
    // Scroll vers la section clients
    document.querySelector('#clients').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

btnTalent.addEventListener('click', () => {
    // Scroll vers la section coworkers
    document.querySelector('#coworkers').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// Effet de typing pour le titre hero (optionnel)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Activer l'effet typing au chargement (optionnel)
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 50);
// });

// Gestion du header transparent/opaque au scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Classe InteractiveWall complète pour le mur digital
class InteractiveWall {
    constructor() {
        this.coworkers = new Map();
        this.clients = new Map();
        this.interactions = [];
        this.donations = [];
        this.questions = [];
        this.events = new EventTarget();
        this.isInitialized = false;
        
        // Configuration
        this.config = {
            donationPercentage: 0.05, // 5%
            maxQuestionsPerDay: 10,
            interactionTimeout: 300000, // 5 minutes
            wallRefreshRate: 30000 // 30 secondes
        };
        
        this.init();
    }
    
    // Initialisation du mur
    init() {
        this.createWallInterface();
        this.setupEventListeners();
        this.startWallUpdates();
        this.isInitialized = true;
        console.log('🖥️ Mur interactif Popey initialisé');
    }
    
    // === GESTION DES COWORKERS ===
    
    addCoworker(coworkerData) {
        const coworker = {
            id: this.generateId(),
            name: coworkerData.name,
            skills: coworkerData.skills || [],
            bio: coworkerData.bio || '',
            avatar: coworkerData.avatar || '👤',
            status: 'available', // available, busy, offline
            rating: coworkerData.rating || 5,
            totalDonations: 0,
            questionsAnswered: 0,
            joinedAt: new Date(),
            lastActive: new Date(),
            socialLinks: coworkerData.socialLinks || {},
            projects: coworkerData.projects || []
        };
        
        this.coworkers.set(coworker.id, coworker);
        this.updateWallDisplay();
        this.triggerEvent('coworkerAdded', coworker);
        
        console.log('✅ Coworker ajouté:', coworker.name);
        return coworker.id;
    }
    
    updateCoworkerStatus(coworkerId, status) {
        const coworker = this.coworkers.get(coworkerId);
        if (coworker) {
            coworker.status = status;
            coworker.lastActive = new Date();
            this.updateWallDisplay();
            this.triggerEvent('coworkerStatusChanged', { coworkerId, status });
        }
    }
    
    getAvailableCoworkers() {
        return Array.from(this.coworkers.values())
            .filter(coworker => coworker.status === 'available');
    }
    
    // === GESTION DES CLIENTS ===
    
    addClient(clientData) {
        const client = {
            id: this.generateId(),
            name: clientData.name || 'Client anonyme',
            tableNumber: clientData.tableNumber,
            orderAmount: clientData.orderAmount || 0,
            interests: clientData.interests || [],
            needsHelp: clientData.needsHelp || false,
            question: clientData.question || '',
            joinedAt: new Date(),
            sessionDuration: 0
        };
        
        this.clients.set(client.id, client);
        this.updateWallDisplay();
        this.triggerEvent('clientAdded', client);
        
        console.log('👋 Client ajouté:', client.name);
        return client.id;
    }
    
    updateClientOrder(clientId, orderAmount) {
        const client = this.clients.get(clientId);
        if (client) {
            client.orderAmount = orderAmount;
            const donation = this.calculateDonation(orderAmount);
            this.processDonation(clientId, donation);
            this.updateWallDisplay();
        }
    }
    
    // === GESTION DES INTERACTIONS ===
    
    createInteraction(clientId, coworkerId, type, data = {}) {
        const client = this.clients.get(clientId);
        const coworker = this.coworkers.get(coworkerId);
        
        if (!client || !coworker) {
            console.error('Client ou coworker introuvable');
            return null;
        }
        
        const interaction = {
            id: this.generateId(),
            clientId,
            coworkerId,
            type, // 'question', 'consultation', 'collaboration', 'feedback'
            status: 'active', // active, completed, cancelled
            startTime: new Date(),
            endTime: null,
            duration: 0,
            data: {
                question: data.question || '',
                category: data.category || 'general',
                urgency: data.urgency || 'normal',
                ...data
            },
            rating: null,
            feedback: ''
        };
        
        this.interactions.push(interaction);
        this.updateCoworkerStatus(coworkerId, 'busy');
        this.updateWallDisplay();
        this.triggerEvent('interactionCreated', interaction);
        
        // Auto-timeout après 5 minutes
        setTimeout(() => {
            this.completeInteraction(interaction.id);
        }, this.config.interactionTimeout);
        
        console.log('🤝 Interaction créée:', type);
        return interaction.id;
    }
    
    completeInteraction(interactionId, rating = null, feedback = '') {
        const interaction = this.interactions.find(i => i.id === interactionId);
        if (interaction && interaction.status === 'active') {
            interaction.status = 'completed';
            interaction.endTime = new Date();
            interaction.duration = interaction.endTime - interaction.startTime;
            interaction.rating = rating;
            interaction.feedback = feedback;
            
            // Mettre à jour les stats du coworker
            const coworker = this.coworkers.get(interaction.coworkerId);
            if (coworker) {
                coworker.questionsAnswered++;
                if (rating) {
                    coworker.rating = (coworker.rating + rating) / 2;
                }
                this.updateCoworkerStatus(interaction.coworkerId, 'available');
            }
            
            this.triggerEvent('interactionCompleted', interaction);
            console.log('✅ Interaction terminée');
        }
    }
    
    // === GESTION DES DONATIONS ===
    
    calculateDonation(amount) {
        return Math.round(amount * this.config.donationPercentage * 100) / 100;
    }
    
    processDonation(clientId, amount, selectedCoworkerId = null) {
        const donation = {
            id: this.generateId(),
            clientId,
            amount,
            selectedCoworkerId,
            distributedAt: new Date(),
            distribution: {}
        };
        
        if (selectedCoworkerId) {
            // Donation dirigée vers un coworker spécifique
            donation.distribution[selectedCoworkerId] = amount;
            const coworker = this.coworkers.get(selectedCoworkerId);
            if (coworker) {
                coworker.totalDonations += amount;
            }
        } else {
            // Distribution équitable entre tous les coworkers actifs
            const activeCoworkers = this.getAvailableCoworkers();
            if (activeCoworkers.length > 0) {
                const amountPerCoworker = amount / activeCoworkers.length;
                activeCoworkers.forEach(coworker => {
                    donation.distribution[coworker.id] = amountPerCoworker;
                    coworker.totalDonations += amountPerCoworker;
                });
            }
        }
        
        this.donations.push(donation);
        this.updateWallDisplay();
        this.triggerEvent('donationProcessed', donation);
        
        console.log('💰 Donation traitée:', amount + '€');
        return donation.id;
    }
    
    // === GESTION DES QUESTIONS ===
    
    submitQuestion(clientId, question, category = 'general') {
        const client = this.clients.get(clientId);
        if (!client) return null;
        
        const questionObj = {
            id: this.generateId(),
            clientId,
            question,
            category,
            submittedAt: new Date(),
            status: 'pending', // pending, answered, expired
            answers: [],
            selectedAnswer: null
        };
        
        this.questions.push(questionObj);
        this.updateWallDisplay();
        this.triggerEvent('questionSubmitted', questionObj);
        
        // Notifier les coworkers compétents
        this.notifyRelevantCoworkers(questionObj);
        
        console.log('❓ Question soumise:', question);
        return questionObj.id;
    }
    
    answerQuestion(questionId, coworkerId, answer) {
        const question = this.questions.find(q => q.id === questionId);
        const coworker = this.coworkers.get(coworkerId);
        
        if (question && coworker && question.status === 'pending') {
            const answerObj = {
                id: this.generateId(),
                coworkerId,
                answer,
                submittedAt: new Date(),
                votes: 0
            };
            
            question.answers.push(answerObj);
            this.updateWallDisplay();
            this.triggerEvent('questionAnswered', { question, answer: answerObj });
            
            console.log('💡 Réponse ajoutée par:', coworker.name);
            return answerObj.id;
        }
        return null;
    }
    
    // === INTERFACE DU MUR ===
    
    createWallInterface() {
        // Créer l'interface du mur digital (à intégrer dans le HTML)
        const wallContainer = document.createElement('div');
        wallContainer.id = 'interactive-wall';
        wallContainer.className = 'wall-container';
        
        wallContainer.innerHTML = `
            <div class="wall-header">
                <h2>🖥️ Mur Interactif Popey</h2>
                <div class="wall-stats">
                    <span class="stat">👥 <span id="coworkers-count">0</span> Talents</span>
                    <span class="stat">☕ <span id="clients-count">0</span> Clients</span>
                    <span class="stat">💰 <span id="donations-total">0</span>€ Reversés</span>
                </div>
            </div>
            
            <div class="wall-content">
                <div class="coworkers-section">
                    <h3>💼 Talents Disponibles</h3>
                    <div id="coworkers-grid" class="coworkers-grid"></div>
                </div>
                
                <div class="questions-section">
                    <h3>❓ Questions en Cours</h3>
                    <div id="questions-list" class="questions-list"></div>
                </div>
                
                <div class="interactions-section">
                    <h3>🤝 Interactions Actives</h3>
                    <div id="interactions-list" class="interactions-list"></div>
                </div>
            </div>
            
            <div class="wall-actions">
                <button id="ask-question-btn" class="wall-btn primary">Poser une Question</button>
                <button id="choose-coworker-btn" class="wall-btn secondary">Choisir un Talent</button>
            </div>
        `;
        
        // Ajouter le mur à la page (après la section coworkers par exemple)
        const coworkersSection = document.querySelector('#coworkers');
        if (coworkersSection) {
            coworkersSection.after(wallContainer);
        }
    }
    
    updateWallDisplay() {
        this.updateStats();
        this.updateCoworkersGrid();
        this.updateQuestionsList();
        this.updateInteractionsList();
    }
    
    updateStats() {
        const coworkersCount = document.getElementById('coworkers-count');
        const clientsCount = document.getElementById('clients-count');
        const donationsTotal = document.getElementById('donations-total');
        
        if (coworkersCount) coworkersCount.textContent = this.coworkers.size;
        if (clientsCount) clientsCount.textContent = this.clients.size;
        if (donationsTotal) {
            const total = this.donations.reduce((sum, d) => sum + d.amount, 0);
            donationsTotal.textContent = total.toFixed(2);
        }
    }
    
    updateCoworkersGrid() {
        const grid = document.getElementById('coworkers-grid');
        if (!grid) return;
        
        const availableCoworkers = this.getAvailableCoworkers();
        grid.innerHTML = availableCoworkers.map(coworker => `
            <div class="coworker-card" data-id="${coworker.id}">
                <div class="coworker-avatar">${coworker.avatar}</div>
                <div class="coworker-info">
                    <h4>${coworker.name}</h4>
                    <p class="coworker-skills">${coworker.skills.join(', ')}</p>
                    <div class="coworker-stats">
                        <span>⭐ ${coworker.rating.toFixed(1)}</span>
                        <span>💰 ${coworker.totalDonations.toFixed(2)}€</span>
                    </div>
                </div>
                <button class="contact-btn" onclick="popeyWall.contactCoworker('${coworker.id}')">Contacter</button>
            </div>
        `).join('');
    }
    
    updateQuestionsList() {
        const list = document.getElementById('questions-list');
        if (!list) return;
        
        const pendingQuestions = this.questions.filter(q => q.status === 'pending');
        list.innerHTML = pendingQuestions.map(question => `
            <div class="question-item" data-id="${question.id}">
                <div class="question-content">
                    <p><strong>❓ ${question.question}</strong></p>
                    <small>Catégorie: ${question.category} • ${this.formatTime(question.submittedAt)}</small>
                </div>
                <div class="question-answers">
                    ${question.answers.map(answer => `
                        <div class="answer">
                            <p>${answer.answer}</p>
                            <small>Par: ${this.coworkers.get(answer.coworkerId)?.name}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    updateInteractionsList() {
        const list = document.getElementById('interactions-list');
        if (!list) return;
        
        const activeInteractions = this.interactions.filter(i => i.status === 'active');
        list.innerHTML = activeInteractions.map(interaction => {
            const client = this.clients.get(interaction.clientId);
            const coworker = this.coworkers.get(interaction.coworkerId);
            return `
                <div class="interaction-item" data-id="${interaction.id}">
                    <div class="interaction-info">
                        <p><strong>${client?.name}</strong> ↔ <strong>${coworker?.name}</strong></p>
                        <small>${interaction.type} • ${this.formatTime(interaction.startTime)}</small>
                    </div>
                    <div class="interaction-status">
                        <span class="status-badge active">En cours</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // === MÉTHODES UTILITAIRES ===
    
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    
    formatTime(date) {
        return new Intl.RelativeTimeFormat('fr').format(
            Math.round((date - new Date()) / 60000), 'minute'
        );
    }
    
    triggerEvent(eventName, data) {
        this.events.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
    
    setupEventListeners() {
        // Écouter les événements du mur
        document.addEventListener('click', (e) => {
            if (e.target.id === 'ask-question-btn') {
                this.openQuestionModal();
            }
            if (e.target.id === 'choose-coworker-btn') {
                this.openCoworkerModal();
            }
        });
    }
    
    startWallUpdates() {
        // Mise à jour automatique du mur
        setInterval(() => {
            this.updateWallDisplay();
        }, this.config.wallRefreshRate);
    }
    
    notifyRelevantCoworkers(question) {
        // Logique pour notifier les coworkers pertinents
        const relevantCoworkers = Array.from(this.coworkers.values())
            .filter(coworker => 
                coworker.status === 'available' && 
                coworker.skills.some(skill => 
                    question.question.toLowerCase().includes(skill.toLowerCase())
                )
            );
        
        relevantCoworkers.forEach(coworker => {
            console.log(`🔔 Notification envoyée à ${coworker.name}`);
        });
    }
    
    contactCoworker(coworkerId) {
        // Méthode pour contacter un coworker
        const coworker = this.coworkers.get(coworkerId);
        if (coworker) {
            console.log(`📞 Contact avec ${coworker.name}`);
            // Ici, ouvrir une modal de contact ou créer une interaction
        }
    }
    
    openQuestionModal() {
        // Ouvrir une modal pour poser une question
        console.log('❓ Ouverture modal question');
    }
    
    openCoworkerModal() {
        // Ouvrir une modal pour choisir un coworker
        console.log('👥 Ouverture modal coworkers');
    }
    
    // === API POUR LA V2 ===
    
    // Méthodes pour l'intégration future avec une API
    async syncWithAPI() {
        // Synchronisation avec l'API backend
        console.log('🔄 Synchronisation avec l\'API...');
    }
    
    exportData() {
        return {
            coworkers: Array.from(this.coworkers.values()),
            clients: Array.from(this.clients.values()),
            interactions: this.interactions,
            donations: this.donations,
            questions: this.questions
        };
    }
    
    importData(data) {
        if (data.coworkers) {
            this.coworkers = new Map(data.coworkers.map(c => [c.id, c]));
        }
        if (data.clients) {
            this.clients = new Map(data.clients.map(c => [c.id, c]));
        }
        if (data.interactions) this.interactions = data.interactions;
        if (data.donations) this.donations = data.donations;
        if (data.questions) this.questions = data.questions;
        
        this.updateWallDisplay();
    }
}

// Instance globale pour la V2
window.popeyWall = new InteractiveWall();

// Exemples d'utilisation pour les tests
if (window.location.hostname === 'localhost') {
    // Ajouter des données de test
    setTimeout(() => {
        // Coworkers de test
        popeyWall.addCoworker({
            name: 'Marie Dubois',
            skills: ['Marketing Digital', 'Réseaux Sociaux'],
            bio: 'Experte en stratégie digitale',
            avatar: '👩‍💼',
            rating: 4.8
        });
        
        popeyWall.addCoworker({
            name: 'Thomas Martin',
            skills: ['Développement Web', 'JavaScript'],
            bio: 'Développeur full-stack passionné',
            avatar: '👨‍💻',
            rating: 4.9
        });
        
        // Clients de test
        const clientId = popeyWall.addClient({
            name: 'Sophie Laurent',
            tableNumber: 5,
            orderAmount: 12.50,
            needsHelp: true
        });
        
        // Question de test
        popeyWall.submitQuestion(
            clientId, 
            'Comment créer une stratégie de contenu efficace pour mon restaurant ?', 
            'marketing'
        );
        
        console.log('🧪 Données de test ajoutées');
    }, 2000);
}

// Console log pour confirmer le chargement
console.log('🎭 Popey Landing Page chargée avec succès!');
console.log('📱 Responsive design activé');
console.log('🚀 Prêt pour la V2 avec mur interactif');


// Mentions Légales Modal
document.addEventListener('DOMContentLoaded', function() {
    const mentionsLink = document.getElementById('mentions-legales-link');
    const modal = document.getElementById('mentions-legales-modal');
    const closeModal = document.querySelector('.close-modal');

    // Ouvrir la modal
    if (mentionsLink) {
        mentionsLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Empêcher le scroll
        });
    }

    // Fermer la modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Réactiver le scroll
        });
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// RGPD Modal
document.addEventListener('DOMContentLoaded', function() {
    const rgpdLink = document.getElementById('rgpd-link');
    const modal = document.getElementById('rgpd-modal');
    const closeModal = modal?.querySelector('.close-modal');

    // Ouvrir la modal
    if (rgpdLink) {
        rgpdLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Fermer la modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Politique de Confidentialité Modal
document.addEventListener('DOMContentLoaded', function() {
    const politiqueLink = document.getElementById('politique-confidentialite-link');
    const modal = document.getElementById('politique-confidentialite-modal');
    const closeModal = modal?.querySelector('.close-modal');

    // Ouvrir la modal
    if (politiqueLink) {
        politiqueLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Fermer la modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// CGU Modal
document.addEventListener('DOMContentLoaded', function() {
    const cguLink = document.getElementById('cgu-link');
    const modal = document.getElementById('cgu-modal');
    const closeModal = modal?.querySelector('.close-modal');

    // Ouvrir la modal
    if (cguLink) {
        cguLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Fermer la modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Liens internes vers autres modals depuis CGU
    const linkToPolitique = modal?.querySelector('#link-to-politique');
    const linkToRgpd = modal?.querySelector('#link-to-rgpd');
    
    if (linkToPolitique) {
        linkToPolitique.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'none';
            document.getElementById('politique-confidentialite-modal').style.display = 'block';
        });
    }
    
    if (linkToRgpd) {
        linkToRgpd.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'none';
            document.getElementById('rgpd-modal').style.display = 'block';
        });
    }
});

// Gestion de la modale des cookies
const cookiesLink = document.getElementById('cookies-link');
const cookiesModal = document.getElementById('cookies-modal');
const cookiesCloseModal = cookiesModal?.querySelector('.close-modal');

if (cookiesLink && cookiesModal) {
    // Ouvrir la modale
    cookiesLink.addEventListener('click', function(e) {
        e.preventDefault();
        cookiesModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // Fermer la modale avec le bouton X
    if (cookiesCloseModal) {
        cookiesCloseModal.addEventListener('click', function() {
            cookiesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Fermer en cliquant en dehors de la modale
    window.addEventListener('click', function(e) {
        if (e.target === cookiesModal) {
            cookiesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cookiesModal.style.display === 'block') {
            cookiesModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Gestion des liens internes dans les modales
const linkToPolitique = document.getElementById('link-to-politique');
const linkToRgpd = document.getElementById('link-to-rgpd');
const politiqueModal = document.getElementById('politique-confidentialite-modal');
const rgpdModal = document.getElementById('rgpd-modal');

if (linkToPolitique && politiqueModal) {
    linkToPolitique.addEventListener('click', function(e) {
        e.preventDefault();
        // Fermer la modale actuelle
        document.querySelector('.modal[style*="block"]').style.display = 'none';
        // Ouvrir la modale politique de confidentialité
        politiqueModal.style.display = 'block';
    });
}

if (linkToRgpd && rgpdModal) {
    linkToRgpd.addEventListener('click', function(e) {
        e.preventDefault();
        // Fermer la modale actuelle
        document.querySelector('.modal[style*="block"]').style.display = 'none';
        // Ouvrir la modale RGPD
        rgpdModal.style.display = 'block';
    });
}

// Gestion de la modale "Devenir talent"
document.addEventListener('DOMContentLoaded', function() {
    const devenirTalentLink = document.getElementById('devenir-talent-link');
    const devenirTalentModal = document.getElementById('devenir-talent-modal');
    const closeModal = devenirTalentModal?.querySelector('.close-modal');

    if (devenirTalentLink && devenirTalentModal) {
        // Ouvrir la modale
        devenirTalentLink.addEventListener('click', function(e) {
            e.preventDefault();
            devenirTalentModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Fermer la modale avec le bouton X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                devenirTalentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Fermer en cliquant en dehors de la modale
        window.addEventListener('click', function(e) {
            if (e.target === devenirTalentModal) {
                devenirTalentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && devenirTalentModal.style.display === 'block') {
                devenirTalentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Gestion de la modale "Réserver une salle de meeting"
document.addEventListener('DOMContentLoaded', function() {
    const reserverSalleLink = document.getElementById('reserver-salle-link');
    const reserverSalleModal = document.getElementById('reserver-salle-modal');
    const closeModal = reserverSalleModal?.querySelector('.close-modal');

    if (reserverSalleLink && reserverSalleModal) {
        // Ouvrir la modale
        reserverSalleLink.addEventListener('click', function(e) {
            e.preventDefault();
            reserverSalleModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Fermer la modale avec le bouton X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                reserverSalleModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Fermer en cliquant en dehors de la modale
        window.addEventListener('click', function(e) {
            if (e.target === reserverSalleModal) {
                reserverSalleModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && reserverSalleModal.style.display === 'block') {
                reserverSalleModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Gestion de la modale "Menu & Tarifs"
document.addEventListener('DOMContentLoaded', function() {
    const menuTarifsLink = document.getElementById('menu-tarifs-link');
    const menuTarifsModal = document.getElementById('menu-tarifs-modal');
    const closeModal = menuTarifsModal?.querySelector('.close-modal');

    if (menuTarifsLink && menuTarifsModal) {
        // Ouvrir la modale
        menuTarifsLink.addEventListener('click', function(e) {
            e.preventDefault();
            menuTarifsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Fermer la modale avec le bouton X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                menuTarifsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Fermer en cliquant en dehors de la modale
        window.addEventListener('click', function(e) {
            if (e.target === menuTarifsModal) {
                menuTarifsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuTarifsModal.style.display === 'block') {
                menuTarifsModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Gestion de la modale "Réserver une table"
document.addEventListener('DOMContentLoaded', function() {
    const reserverTableLink = document.getElementById('reserver-table-link');
    const reserverTableModal = document.getElementById('reserver-table-modal');
    const closeModal = reserverTableModal?.querySelector('.close-modal');

    if (reserverTableLink && reserverTableModal) {
        // Ouvrir la modale
        reserverTableLink.addEventListener('click', function(e) {
            e.preventDefault();
            reserverTableModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Fermer la modale avec le bouton X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                reserverTableModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Fermer en cliquant en dehors de la modale
        window.addEventListener('click', function(e) {
            if (e.target === reserverTableModal) {
                reserverTableModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && reserverTableModal.style.display === 'block') {
                reserverTableModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
