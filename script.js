console.log('Script loaded successfully!');

/* ── 1. CUSTOM CURSOR — hollow ring style (restored from v1) ──
   #cursor      = 14px hollow bordered ring, snaps to mouse
   #cursor-trail = 36px faint ring that lerps behind
   Subtract half element size to center: 14/2=7, 36/2=18
*/
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 7}px,${my - 7}px)`;
});

/* Trail lerps toward mouse position each frame */
function animateTrail() {
    tx += (mx - tx - 18) * 0.12;
    ty += (my - ty - 18) * 0.12;
    trail.style.transform = `translate(${tx}px,${ty}px)`;
    requestAnimationFrame(animateTrail);
}
animateTrail();


/* ── 2. TYPING EFFECT ── */
const phrases = ['Frontend Developer', 'UI/UX Enthusiast', 'Clean Code Advocate', 'Problem Solver', 'BBIT Student'];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function type() {
    const cur = phrases[pi];
    if (!del) {
        typedEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
    } else {
        typedEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, del ? 45 : 85);
}
type();


/* ── 3. SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal,.timeline-item');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .12 });
revealEls.forEach(el => revealObs.observe(el));


/* ── 4. SKILL BARS ── */
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting)
            e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.w + '%');
    });
}, { threshold: .25 });
document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));


/* ── 5. NAV SHRINK ON SCROLL + ACTIVE LINK HIGHLIGHT ── */
const mainNav = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const deskLinks = document.querySelectorAll('.nav-links a');
const drawLinks = document.querySelectorAll('.drawer-link');

window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 180) current = s.id; });
    [...deskLinks, ...drawLinks].forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});


/* ── 6. HAMBURGER MENU ── */
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navDrawer.classList.toggle('open');
});
drawLinks.forEach(l => l.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navDrawer.classList.remove('open');
}));
document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navDrawer.contains(e.target)) {
        navToggle.classList.remove('open');
        navDrawer.classList.remove('open');
    }
});


/* ── 7. CONTACT FORM FEEDBACK & SUBMISSION ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent page reload on submit

        const btn = contactForm.querySelector('.btn-primary');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.textContent = '✓ Message Sent!';
                btn.style.background = '#22c55e';
                btn.style.borderColor = '#22c55e';
                contactForm.reset(); // Clear the inputs
            } else {
                throw new Error('Form response was not ok');
            }
        } catch (error) {
            btn.textContent = '❌ Error Sending';
            btn.style.background = '#ef4444';
            btn.style.borderColor = '#ef4444';
        }

        // Reset the button after 3 seconds
        setTimeout(() => {
            btn.textContent = 'Send Message →';
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
        }, 3000);
    });
}
