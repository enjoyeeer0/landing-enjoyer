// Плавная навигация
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Убегающая иконка в хедере
const runawayIcon = document.getElementById('runawayIcon');

if (runawayIcon) {
    let distance = 0;
    let angle = 0;
    
    document.addEventListener('mousemove', (e) => {
        const rect = runawayIcon.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < 80) {
            angle = Math.atan2(dy, dx) + Math.PI;
            distance = 30;
        } else {
            distance *= 0.9;
        }
        
        runawayIcon.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(${1 + distance / 50})`;
    });
    
    document.addEventListener('mouseleave', () => {
        distance = 0;
        runawayIcon.style.transform = 'translate(0, 0) scale(1)';
    });
}

// Бесконечный скролл карточек стека
const stackScroll = document.querySelector('.stack-scroll');

if (stackScroll) {
    const originalCards = Array.from(stackScroll.querySelectorAll('.stack-card'));
    
    // Дублируем карточки
    for (let i = 0; i < originalCards.length * 2; i++) {
        stackScroll.appendChild(originalCards[i % originalCards.length].cloneNode(true));
    }
    
    let isScrolling = false;
    let startPos = 0;
    let scrollPos = 0;
    
    const resetPosition = () => {
        const scrollWidth = stackScroll.scrollWidth;
        const singleSetWidth = scrollWidth / 3;
        const pos = stackScroll.scrollLeft;
        
        if (pos > singleSetWidth * 1.5) {
            stackScroll.scrollLeft = pos - singleSetWidth;
        } else if (pos < singleSetWidth * 0.5) {
            stackScroll.scrollLeft = pos + singleSetWidth;
        }
    };
    
    const handleStart = (e) => {
        isScrolling = true;
        startPos = e.type.includes('touch') ? e.touches[0].clientX : e.pageX;
        scrollPos = stackScroll.scrollLeft;
    };
    
    const handleMove = (e) => {
        if (!isScrolling) return;
        const currentPos = e.type.includes('touch') ? e.touches[0].clientX : e.pageX;
        stackScroll.scrollLeft = scrollPos - (currentPos - startPos);
        resetPosition();
    };
    
    const handleEnd = () => {
        isScrolling = false;
    };
    
    stackScroll.addEventListener('mousedown', handleStart);
    stackScroll.addEventListener('touchstart', handleStart);
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
}

