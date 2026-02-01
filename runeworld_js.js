// ======================= //
//    PRELOADER            //
// ======================= //

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    preloader.style.opacity = "1";
    setTimeout(() => {
        preloader.style.transition = "opacity 0.5s ease";
        preloader.style.opacity = "0";
        setTimeout(() => preloader.style.display = "none", 500);
    }, 300);
});

// ======================= //
//    MOBILE MENU (GSAP)   //
// ======================= //

// Загрузка GSAP
(function() {
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://unpkg.com/gsap@3/dist/gsap.min.js';
    gsapScript.onload = function() {
        const customEaseScript = document.createElement('script');
        customEaseScript.src = 'https://unpkg.com/gsap@3/dist/CustomEase.min.js';
        customEaseScript.onload = initGsapMenu;
        document.head.appendChild(customEaseScript);
    };
    document.head.appendChild(gsapScript);
})();

function initGsapMenu() {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("menuEase", "0.65, 0.01, 0.05, 0.99");

    document.addEventListener('DOMContentLoaded', () => {
        const menuButton = document.getElementById('menu-button');
        const closeMenuButton = document.getElementById('close-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

        if (!menuButton || !closeMenuButton || !mobileMenu || !mobileMenuOverlay) return;

        const menuLinks = mobileMenu.querySelectorAll("a");

        gsap.set(mobileMenu, { xPercent: 100 });
        gsap.set(menuLinks, { y: 50, autoAlpha: 0 });
        gsap.set(mobileMenuOverlay, { autoAlpha: 0, display: 'none' });

        let tl = gsap.timeline({
            paused: true,
            defaults: { ease: "menuEase", duration: 0.5 },
            onReverseComplete: resetMenuState
        });

        function resetMenuState() {
            gsap.set(mobileMenuOverlay, { autoAlpha: 0, display: 'none' });
            gsap.set(mobileMenu, { xPercent: 100 });
            gsap.set(menuLinks, { y: 50, autoAlpha: 0 });
        }

        tl.set(mobileMenuOverlay, { display: 'block', autoAlpha: 0 })
          .to(mobileMenuOverlay, { autoAlpha: 1 }, 0)
          .to(mobileMenu, { xPercent: 0 }, 0)
          .to(menuLinks, {
              y: 0,
              autoAlpha: 1,
              stagger: 0.1,
              duration: 0.25
          }, "<+=0.2");

        menuButton.addEventListener('click', () => {
            if (tl.reversed()) {
                tl.progress(0);
            }
            tl.timeScale(1);
            tl.play();
        });

        const closeMenu = () => {
            if (tl.isActive()) {
                tl.progress(1);
            }
            tl.timeScale(4);
            tl.reverse();
        };

        closeMenuButton.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    setTimeout(() => {
                        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                }
            });
        });
    });
}

// ======================= //
//    DROPDOWN MENU        //
// ======================= //

function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const trigger = event.currentTarget;
    const dropdown = document.getElementById('clansDropdown');
    const overlay = document.getElementById('menu-overlay');
    
    const isOpen = dropdown.classList.contains('show');
    
    if (isOpen) {
        closeDropdown();
    } else {
        openDropdown();
    }
    
    function openDropdown() {
        dropdown.classList.add('show');
        trigger.classList.add('active');
        overlay.classList.add('active');
    }
    
    function closeDropdown() {
        dropdown.classList.remove('show');
        trigger.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    overlay.onclick = closeDropdown;
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('clansDropdown');
    const trigger = document.querySelector('.dropdown-trigger');
    const overlay = document.getElementById('menu-overlay');
    
    if (dropdown && trigger && !trigger.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
        trigger.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// ======================= //
//    CONTACT POPUP        //
// ======================= //

let isPopupOpen = false;

function toggleContactPopup() {
    const popup = document.getElementById('contactPopup');
    isPopupOpen = !isPopupOpen;
    
    if (isPopupOpen) {
        popup.classList.add('show');
    } else {
        popup.classList.remove('show');
    }
}

function closeContactPopup() {
    const popup = document.getElementById('contactPopup');
    popup.classList.remove('show');
    isPopupOpen = false;
}

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification(message);
    }).catch(function() {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification(message);
    });
}

document.addEventListener('click', function(event) {
    const popup = document.getElementById('contactPopup');
    const button = document.querySelector('.contact-button');
    
    if (isPopupOpen && popup && button && !popup.contains(event.target) && !button.contains(event.target)) {
        closeContactPopup();
    }
});

// ======================= //
//    FORM SUBMISSION      //
// ======================= //

const _KEY = 's3cr3tK!';
const encryptedChunks = [
    '1b471702', '404e640e', '155c111f', '40043944',
    '161d0a1d', '1c12644c', '055c0618', '52052e'
];
const PLACEHOLDER_ACTION = '#';

function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

function xorDecryptFromHex(hexString, key) {
    const bytes = hexToBytes(hexString);
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
        const k = key.charCodeAt(i % key.length);
        out += String.fromCharCode(bytes[i] ^ k);
    }
    return out;
}

function decryptToken() {
    const hex = encryptedChunks.join('');
    return xorDecryptFromHex(hex, _KEY);
}

function wipeDecrypted(referenceObj) {
    if (referenceObj && typeof referenceObj === 'object') {
        for (const k in referenceObj) {
            try { referenceObj[k] = null; } catch(e) {}
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("#appl-form");
    if (form) {
        form.action = PLACEHOLDER_ACTION;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector("[name='name']").value.trim();
            const email = this.querySelector("[name='email']").value.trim();
            const discord = this.querySelector("[name='discord']").value.trim();
            const telegram = this.querySelector("[name='telegram']").value.trim();

            const badPatterns = /(https?:\/\/|www\.|http|bit\.ly|t\.me|tinyurl|viagra|casino|xxx|porn|adult|free-money|clickbait)/i;
            const cyrillic = /[а-яА-ЯёЁ]/;
            const namePattern = /^[a-zA-Z0-9-_]{3,}$/;
            const emailPattern = /^[a-zA-Z0-9._\-@]{3,}$/;
            const discordPattern = /^[a-zA-Z0-9-_#]{3,}$/;
            const telegramPattern = /^[a-zA-Z0-9-_@]{3,}$/;

            if (!namePattern.test(name) || badPatterns.test(name) || cyrillic.test(name)) {
                showNotification("Введіть коректний нік! Використовуйте тільки латинські літери, цифри, дефіси та підкреслення.");
                return;
            }
            if (!emailPattern.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || cyrillic.test(email)) {
                showNotification("Введіть коректний email! Перевірте формат адреси електронної пошти.");
                return;
            }
            if (!discordPattern.test(discord) || badPatterns.test(discord) || cyrillic.test(discord)) {
                showNotification("Введіть коректний Discord! Використовуйте формат username#1234.");
                return;
            }
            if (!telegramPattern.test(telegram) || badPatterns.test(telegram) || cyrillic.test(telegram)) {
                showNotification("Введіть коректний Telegram! Використовуйте формат @username.");
                return;
            }

            const realAction = decryptToken();
            form.action = realAction;

            showNotification("✅ Форма успішно відправлена! Дякуємо за заявку.");

            setTimeout(() => {
                try { form.submit(); } catch(err) { console.error('Не вдалося відправити форму програмно:', err); }
            }, 0);

            setTimeout(() => {
                try { form.action = PLACEHOLDER_ACTION; } catch(_) {}
                try { wipeDecrypted({ realAction }); } catch(_) {}
            }, 1000);
        });
    }
});

// ======================= //
//    NOTIFICATIONS        //
// ======================= //

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="notification-icon">⚠️</span> ${message} <button class="close-btn" onclick="this.parentElement.remove()">×</button>`;
    document.body.appendChild(notification);

    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => { if (notification.parentElement) notification.remove(); }, 400);
        }
    }, 5000);
}

// ======================= //
//    SMOOTH SCROLLING     //
// ======================= //

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ======================= //
//  SCROLL ANIMATIONS      //
// ======================= //

// Класс для управления анимациями при прокрутке
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Добавляем базовые стили для анимаций
        this.injectStyles();
        
        // Находим все элементы для анимации
        this.findElements();
        
        // Запускаем наблюдение
        this.observeElements();
        
        // Проверяем элементы при загрузке
        this.checkElements();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Базовые стили для анимаций */
            .scroll-animate {
                opacity: 0;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .scroll-animate.animated {
                opacity: 1;
            }

            /* Анимация появления снизу */
            .animate-fade-up {
                transform: translateY(60px);
            }

            .animate-fade-up.animated {
                transform: translateY(0);
            }

            /* Анимация появления слева */
            .animate-fade-left {
                transform: translateX(-60px);
            }

            .animate-fade-left.animated {
                transform: translateX(0);
            }

            /* Анимация появления справа */
            .animate-fade-right {
                transform: translateX(60px);
            }

            .animate-fade-right.animated {
                transform: translateX(0);
            }

            /* Анимация масштабирования */
            .animate-scale {
                transform: scale(0.8);
            }

            .animate-scale.animated {
                transform: scale(1);
            }

            /* Анимация поворота */
            .animate-rotate {
                transform: rotate(-5deg) scale(0.9);
            }

            .animate-rotate.animated {
                transform: rotate(0deg) scale(1);
            }

            /* Анимация появления с задержкой для карточек */
            .stagger-1 {
                transition-delay: 0.1s;
            }

            .stagger-2 {
                transition-delay: 0.2s;
            }

            .stagger-3 {
                transition-delay: 0.3s;
            }

            .stagger-4 {
                transition-delay: 0.4s;
            }

            /* Анимация для заголовков */
            .animate-title {
                opacity: 0;
                transform: translateY(40px);
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .animate-title.animated {
                opacity: 1;
                transform: translateY(0);
            }

            /* Анимация для изображений */
            .animate-image {
                opacity: 0;
                transform: scale(0.85) rotate(-3deg);
                transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .animate-image.animated {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }

            /* Анимация волны для текста */
            .animate-wave {
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
            }

            .animate-wave.animated {
                animation: wave 0.6s ease forwards;
            }

            @keyframes wave {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Анимация пульсации */
            .animate-pulse {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            /* Анимация появления с эффектом blur */
            .animate-blur {
                opacity: 0;
                filter: blur(10px);
                transform: translateY(30px);
                transition: all 0.8s ease;
            }

            .animate-blur.animated {
                opacity: 1;
                filter: blur(0);
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    findElements() {
        // Hero section элементы
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroText) {
            heroText.classList.add('scroll-animate', 'animate-fade-left');
            this.elements.push(heroText);
        }
        
        if (heroImage) {
            heroImage.classList.add('scroll-animate', 'animate-fade-right', 'animate-image');
            this.elements.push(heroImage);
        }

        // Все заголовки секций
        document.querySelectorAll('.minecraft-title').forEach(title => {
            title.classList.add('scroll-animate', 'animate-title');
            this.elements.push(title);
        });

        // About section
        const aboutSection = document.querySelector('.about-section p');
        if (aboutSection) {
            aboutSection.classList.add('scroll-animate', 'animate-fade-up');
            this.elements.push(aboutSection);
        }

        // YouTube section
        const youtubeContent = document.querySelector('.youtube-content');
        if (youtubeContent) {
            youtubeContent.classList.add('scroll-animate', 'animate-scale');
            this.elements.push(youtubeContent);
        }

        // Review cards с задержкой
        document.querySelectorAll('.review-card').forEach((card, index) => {
            card.classList.add('scroll-animate', 'animate-fade-up', `stagger-${index + 1}`);
            this.elements.push(card);
        });

        // Characters image
        const charactersImage = document.querySelector('.characters-image');
        if (charactersImage) {
            charactersImage.classList.add('scroll-animate', 'animate-fade-right', 'animate-image');
            this.elements.push(charactersImage);
        }

        // Form
        const form = document.querySelector('#appl-form');
        if (form) {
            form.classList.add('scroll-animate', 'animate-fade-up');
            this.elements.push(form);
        }

        // Discord widget
        const discordWidget = document.querySelector('.discord-widget');
        if (discordWidget) {
            discordWidget.classList.add('scroll-animate', 'animate-scale');
            this.elements.push(discordWidget);
        }

        // RuneWorld logo
        const rwLogo = document.querySelector('.runeworld-logo');
        if (rwLogo) {
            rwLogo.classList.add('scroll-animate', 'animate-fade-up', 'animate-image');
            this.elements.push(rwLogo);
        }

        // Contacts
        const contactsInfo = document.querySelector('.contacts-info');
        if (contactsInfo) {
            contactsInfo.classList.add('scroll-animate', 'animate-blur');
            this.elements.push(contactsInfo);
        }

        // Input fields с задержкой
        document.querySelectorAll('form input').forEach((input, index) => {
            input.classList.add('scroll-animate', 'animate-fade-left', `stagger-${(index % 4) + 1}`);
            this.elements.push(input);
        });

        // Submit button
        const submitBtn = document.querySelector('.submit-button');
        if (submitBtn) {
            submitBtn.classList.add('scroll-animate', 'animate-scale');
            this.elements.push(submitBtn);
        }
    }

    observeElements() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Элемент должен быть виден на 15%
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Добавляем класс animated когда элемент в зоне видимости
                    entry.target.classList.add('animated');
                    
                    // Опционально: можно отключить наблюдение после анимации
                    // observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => {
            observer.observe(el);
        });
    }

    checkElements() {
        // Проверяем элементы при загрузке страницы
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                el.classList.add('animated');
            }
        });
    }
}

// Инициализация анимаций при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для корректной работы
    setTimeout(() => {
        new ScrollAnimations();
    }, 100);
});

// Дополнительные эффекты при наведении
document.addEventListener('DOMContentLoaded', () => {
    // Анимация для review cards при наведении
    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Плавная анимация для кнопок
    document.querySelectorAll('.youtube-button, .submit-button').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax эффект для изображений при скролле
    function updateParallax() {
        // Parallax для hero image
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            const heroImageParent = document.querySelector('.hero-image');
            const rect = heroImageParent.getBoundingClientRect();
            
            // Применяем parallax только когда элемент в зоне видимости
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Вычисляем центральную точку элемента относительно экрана
                const elementCenter = rect.top + rect.height / 2;
                const screenCenter = window.innerHeight / 2;
                
                // Смещение от центра (может быть положительным и отрицательным)
                const distanceFromCenter = screenCenter - elementCenter;
                const relativeScroll = distanceFromCenter * 0.15;
                
                heroImage.style.transform = `translateY(${relativeScroll}px)`;
            }
        }
        
        // Parallax для characters image
        const charactersImg = document.querySelector('.characters-image img');
        if (charactersImg) {
            const charactersParent = document.querySelector('.characters-image');
            const rect = charactersParent.getBoundingClientRect();
            
            // Применяем parallax только когда элемент в зоне видимости
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Вычисляем центральную точку элемента относительно экрана
                const elementCenter = rect.top + rect.height / 2;
                const screenCenter = window.innerHeight / 2;
                
                // Смещение от центра (может быть положительным и отрицательным)
                const distanceFromCenter = screenCenter - elementCenter;
                const relativeScroll = distanceFromCenter * 0.1;
                
                charactersImg.style.transform = `translateY(${relativeScroll}px)`;
            }
        }
    }
    
    // Добавляем плавный transition для parallax изображений
    const heroImage = document.querySelector('.hero-image img');
    const charactersImg = document.querySelector('.characters-image img');
    
    if (heroImage) {
        heroImage.style.transition = 'transform 0.1s ease-out';
    }
    if (charactersImg) {
        charactersImg.style.transition = 'transform 0.1s ease-out';
    }
    
    // Инициализируем parallax при загрузке
    updateParallax();
    
    // Обновляем при скролле
    window.addEventListener('scroll', updateParallax);
});
