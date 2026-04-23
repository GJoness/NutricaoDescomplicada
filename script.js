document.addEventListener('DOMContentLoaded', function () {

    const header = document.getElementById('header');

    // === Scroll handler (throttled) ===
    window.addEventListener('scroll', throttle(function () {
        const y = window.pageYOffset;
        header.classList.toggle('visible', y > 100);
        updateFloatingCTA(y);
        trackScrollDepth(y);
        updateProgressBar(y);
    }, 100), { passive: true });

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - header.offsetHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === FAQ accordion ===
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', function () {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // === CTA button press animation ===
    document.querySelectorAll('#btn-checkout, #btn-checkout-final, .btn-purchase, .btn-final-cta').forEach(btn => {
        btn.addEventListener('click', function () {
            this.style.transform = 'scale(0.97)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });

    // === Scroll-reveal animations ===
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.problem-item, .benefit-item, .testimonial-card, .objection-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        revealObserver.observe(el);
    });

    // === Mobile optimizations ===
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
        document.addEventListener('touchstart', function () {}, { passive: true });
    }

    // === Init modules ===
    initCountdown();
    initScarcityCounter();
    initNumberCounters();
});


/* --------------------------------------------------
   Barra de Progresso de Leitura
-------------------------------------------------- */
function updateProgressBar(scrollY) {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
}


/* --------------------------------------------------
   Countdown Timer
   Persiste no sessionStorage — mesmo número em toda
   a página e em todos os elementos simultaneamente.
-------------------------------------------------- */
function initCountdown() {
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const inlineEl  = document.getElementById('countdown-inline');
    const stripEl   = document.getElementById('countdown-strip');

    const KEY = 'nd_countdown_end';
    let endTime = parseInt(sessionStorage.getItem(KEY) || '0');
    if (!endTime || endTime < Date.now()) {
        endTime = Date.now() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem(KEY, String(endTime));
    }

    (function tick() {
        const diff = Math.max(0, endTime - Date.now());
        const h = Math.floor(diff / 3_600_000);
        const m = Math.floor((diff % 3_600_000) / 60_000);
        const s = Math.floor((diff % 60_000) / 1_000);
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const ss = String(s).padStart(2, '0');
        const formatted = `${hh}:${mm}:${ss}`;

        if (hoursEl)   hoursEl.textContent   = hh;
        if (minutesEl) minutesEl.textContent = mm;
        if (secondsEl) secondsEl.textContent = ss;
        if (inlineEl)  inlineEl.textContent  = formatted;
        if (stripEl)   stripEl.textContent   = formatted;

        if (diff > 0) setTimeout(tick, 1000);
    })();
}


/* --------------------------------------------------
   Scarcity Counter
   Número consistente em todos os elementos da página.
-------------------------------------------------- */
function initScarcityCounter() {
    const KEY = 'nd_vagas';
    let count = parseInt(sessionStorage.getItem(KEY) || '0');
    if (!count || count < 10) {
        count = Math.floor(Math.random() * 16) + 25;
        sessionStorage.setItem(KEY, String(count));
    }

    const elements = document.querySelectorAll(
        '#vagas-restantes, #vagas-header, #vagas-counter, #vagas-urgency, #vagas-strip'
    );
    elements.forEach(el => { if (el) el.textContent = String(count); });

    setInterval(() => {
        if (Math.random() < 0.1 && count > 10) {
            count--;
            sessionStorage.setItem(KEY, String(count));
            elements.forEach(el => {
                if (!el) return;
                el.textContent = String(count);
                el.style.transition = 'color .3s, transform .3s';
                el.style.color = '#ffdd44';
                el.style.transform = 'scale(1.25)';
                setTimeout(() => { el.style.color = ''; el.style.transform = ''; }, 500);
            });
        }
    }, 30_000);
}


/* --------------------------------------------------
   Animação de Contadores Numéricos
   Usa atributo data-count para animar ao entrar na tela.
   Suporta data-prefix, data-suffix, data-decimals.
-------------------------------------------------- */
function initNumberCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const prefix   = el.dataset.prefix   || '';
    const suffix   = el.dataset.suffix   || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1600;
    const steps    = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        const display = decimals
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString('pt-BR');
        el.textContent = prefix + display + suffix;

        if (step >= steps) {
            const final = decimals
                ? target.toFixed(decimals)
                : target.toLocaleString('pt-BR');
            el.textContent = prefix + final + suffix;
            clearInterval(timer);
        }
    }, stepTime);
}


/* --------------------------------------------------
   Floating CTA visibility
-------------------------------------------------- */
function updateFloatingCTA(scrollY) {
    const cta   = document.getElementById('floating-cta');
    const offer = document.getElementById('oferta-final');
    if (!cta || !offer) return;

    const show = scrollY > window.innerHeight && scrollY < offer.offsetTop - 100;

    if (show) {
        cta.style.display = 'block';
        requestAnimationFrame(() => { cta.style.opacity = '1'; });
    } else {
        cta.style.opacity = '0';
        setTimeout(() => {
            if (cta.style.opacity === '0') cta.style.display = 'none';
        }, 300);
    }
}


/* --------------------------------------------------
   Scroll-depth tracking hook
   Substitua o bloco vazio por gtag / fbq / etc.
-------------------------------------------------- */
const trackedDepths = new Set();
function trackScrollDepth(scrollY) {
    const pct = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    [25, 50, 75, 90].forEach(depth => {
        if (pct >= depth && !trackedDepths.has(depth)) {
            trackedDepths.add(depth);
            // gtag('event', 'scroll', { percent_scrolled: depth });
        }
    });
}


/* --------------------------------------------------
   Throttle utility
-------------------------------------------------- */
function throttle(fn, limit) {
    let active = false;
    return function (...args) {
        if (!active) {
            fn.apply(this, args);
            active = true;
            setTimeout(() => { active = false; }, limit);
        }
    };
}
