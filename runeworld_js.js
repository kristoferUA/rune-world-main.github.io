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
//    MOBILE MENU          //
// ======================= //

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            mobileMenuOverlay.classList.add('open');
        });
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenuOverlay.classList.remove('open');
        });
    }
});

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