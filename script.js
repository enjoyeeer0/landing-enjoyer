const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');

        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
});

const emailButton = document.querySelector('[data-copy-email]');
const copyStatus = document.getElementById('copyStatus');

if (emailButton && copyStatus) {
    const defaultText = emailButton.textContent;

    emailButton.addEventListener('click', async () => {
        const email = emailButton.getAttribute('data-copy-email');

        if (!email) {
            return;
        }

        try {
            await navigator.clipboard.writeText(email);
            emailButton.textContent = 'Скопировано!';
            copyStatus.textContent = 'Email адрес скопирован в буфер обмена.';
        } catch {
            window.location.href = `mailto:${email}`;
            copyStatus.textContent = 'Открыт почтовый клиент для отправки письма.';
        }

        window.setTimeout(() => {
            emailButton.textContent = defaultText;
        }, 1500);
    });
}

const runawayIcon = document.getElementById('runawayIcon');
const pointerFine = window.matchMedia('(pointer: fine)').matches;

if (runawayIcon && !prefersReducedMotion && pointerFine) {
    let distance = 0;
    let angle = 0;

    document.addEventListener('pointermove', (event) => {
        const rect = runawayIcon.getBoundingClientRect();
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        const distanceToPointer = Math.hypot(deltaX, deltaY);

        if (distanceToPointer < 4.5 * 16) {
            angle = Math.atan2(deltaY, deltaX) + Math.PI;
            distance = 1.8;
        } else {
            distance *= 0.88;
        }

        runawayIcon.style.transform = `translate(${Math.cos(angle) * distance}rem, ${Math.sin(angle) * distance}rem) scale(${1 + distance / 8})`;
    });

    document.addEventListener('pointerleave', () => {
        distance = 0;
        runawayIcon.style.transform = 'translate(0, 0) scale(1)';
    });
}

const stackScroll = document.querySelector('.stack-scroll');

if (stackScroll) {
    const originalCards = Array.from(stackScroll.children);

    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        stackScroll.append(clone);
    });

    let isPointerDown = false;
    let startX = 0;
    let startLeft = 0;
    let isPaused = false;

    const resetLoop = () => {
        const halfWidth = stackScroll.scrollWidth / 2;

        if (stackScroll.scrollLeft >= halfWidth) {
            stackScroll.scrollLeft -= halfWidth;
        }

        if (stackScroll.scrollLeft < 0) {
            stackScroll.scrollLeft += halfWidth;
        }
    };

    const autoScroll = () => {
        if (!prefersReducedMotion && !isPaused && !isPointerDown) {
            stackScroll.scrollLeft += 0.5;
            resetLoop();
        }

        window.requestAnimationFrame(autoScroll);
    };

    stackScroll.addEventListener('pointerdown', (event) => {
        isPointerDown = true;
        isPaused = true;
        startX = event.clientX;
        startLeft = stackScroll.scrollLeft;
        stackScroll.setPointerCapture(event.pointerId);
    });

    stackScroll.addEventListener('pointermove', (event) => {
        if (!isPointerDown) {
            return;
        }

        stackScroll.scrollLeft = startLeft - (event.clientX - startX);
        resetLoop();
    });

    stackScroll.addEventListener('pointerup', (event) => {
        isPointerDown = false;
        isPaused = false;
        stackScroll.releasePointerCapture(event.pointerId);
    });

    stackScroll.addEventListener('pointercancel', () => {
        isPointerDown = false;
        isPaused = false;
    });

    stackScroll.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    stackScroll.addEventListener('mouseleave', () => {
        if (!isPointerDown) {
            isPaused = false;
        }
    });

    stackScroll.addEventListener('focusin', () => {
        isPaused = true;
    });

    stackScroll.addEventListener('focusout', () => {
        if (!isPointerDown) {
            isPaused = false;
        }
    });

    autoScroll();
}

