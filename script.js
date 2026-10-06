document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.header__nav-link');

    function toggleMenu() {
        const isOpen = navMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isOpen.toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            menuBtn.focus();
        }
    });

    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    const header = document.getElementById('header');

    function updateHeader() {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', updateHeader);

    const scrollTopBtn = document.getElementById('scroll-top');

    function toggleScrollTopBtn() {
        scrollTopBtn.hidden = window.scrollY <= 500;
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleScrollTopBtn);

    const typingEl = document.getElementById('typing-text');
    const phrases = [
        'Desarrollador Front-End',
        'Interfaces web accesibles',
        'HTML • CSS • JavaScript',
        'Desarrollo web responsive',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 300;
        }

        setTimeout(type, typingSpeed);
    }

    type();

    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(60, Math.floor(canvas.width / 20));

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 170, ${p.opacity})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 170, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.classList.add('hidden'), 300);
                }
            });
        });
    });

    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, errorEl, message) {
        input.classList.add('error');
        errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
        input.classList.remove('error');
        errorEl.textContent = '';
    }

    function validateField(input, errorEl, validationFn, errorMessage) {
        const value = input.value.trim();

        if (!value) {
            showError(input, errorEl, 'Este campo es obligatorio.');
            return false;
        }

        if (validationFn && !validationFn(value)) {
            showError(input, errorEl, errorMessage);
            return false;
        }

        clearError(input, errorEl);
        return true;
    }

    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim()) clearError(nameInput, nameError);
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim()) {
            if (!validateEmail(emailInput.value.trim())) {
                showError(emailInput, emailError, 'Ingrese un correo electrónico válido.');
            } else {
                clearError(emailInput, emailError);
            }
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim()) clearError(messageInput, messageError);
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formSuccess.hidden = true;

        const isNameValid = validateField(nameInput, nameError);
        const isEmailValid = validateField(emailInput, emailError, validateEmail, 'Ingrese un correo electrónico válido.');
        const isMessageValid = validateField(messageInput, messageError);

        if (!isNameValid || !isEmailValid || !isMessageValid) return;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn__text');
        const btnLoading = submitBtn.querySelector('.btn__loading');

        const formData = new FormData(contactForm);
        formData.append('access_key', '86329230-debb-4f30-becb-f327d41aceb2');
        formData.append('from_name', 'Portafolio');

        btnText.hidden = true;
        btnLoading.hidden = false;
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                contactForm.reset();
                formSuccess.hidden = false;
                setTimeout(() => { formSuccess.hidden = true; }, 5000);
            } else {
                showError(messageInput, messageError, 'No se pudo enviar el mensaje. Intente nuevamente.');
            }
        } catch (error) {
            showError(messageInput, messageError, 'Error de conexión. Intente nuevamente.');
        } finally {
            btnText.hidden = false;
            btnLoading.hidden = true;
            submitBtn.disabled = false;
        }
    });

    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    function animateSkillBars() {
        document.querySelectorAll('.skills__progress').forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = `${bar.dataset.progress}%`;
            }, index * 150);
        });
    }

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                animateSkillBars();
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) skillsObserver.observe(skillsSection);

    const statNumbers = document.querySelectorAll('.stat__number[data-count]');
    let statsAnimated = false;

    function animateCountUp() {
        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1500;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCountUp();
            }
        });
    }, { threshold: 0.3 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) statsObserver.observe(aboutSection);

    const timelineItems = document.querySelectorAll('.timeline__item');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    timelineItems.forEach(item => timelineObserver.observe(item));

    function addFadeInElements() {
        document.querySelectorAll(
            '.hero__content, .hero__visual, .about__text, .about__stats, ' +
            '.project-card, .skills__category, .contact__info, .contact__form'
        ).forEach(el => el.classList.add('fade-in'));
    }

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    addFadeInElements();
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

    projectCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const link = card.querySelector('.btn');
                if (link) link.click();
            }
        });
    });

});

const skillBars = document.querySelectorAll('.skills__progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.progress + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0 });
skillBars.forEach((bar) => skillObserver.observe(bar));