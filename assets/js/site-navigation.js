document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('[data-site-menu-button]');
    const menuOverlay = document.querySelector('[data-site-menu-overlay]');
    const menuDrawer = document.querySelector('[data-site-menu-drawer]');
    const closeButton = document.querySelector('[data-site-menu-close]');
    const dropdown = document.querySelector('[data-site-dropdown]');
    const dropdownButton = document.querySelector('[data-site-dropdown-button]');
    const dropdownMenu = document.querySelector('[data-site-dropdown-menu]');
    const desktopNav = document.querySelector('.site-desktop-nav');
    const mobileLinks = document.querySelector('[data-site-mobile-links]');

    let lastFocusedElement = null;

    const normalizePath = (path) => {
        const decodedPath = decodeURIComponent(path).replace(/\\/g, '/');
        return decodedPath.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    };

    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('.site-desktop-nav a, .site-mobile-nav a').forEach((link) => {
        const linkUrl = new URL(link.href, window.location.href);
        if (linkUrl.origin === window.location.origin && normalizePath(linkUrl.pathname) === currentPath && !linkUrl.hash) {
            link.setAttribute('aria-current', 'page');
            if (link.closest('.site-nav-dropdown__menu')) {
                dropdown?.classList.add('is-current');
            }
        }
    });

    if (desktopNav && mobileLinks && !mobileLinks.children.length) {
        Array.from(desktopNav.children).forEach((item) => {
            if (item.matches('a')) {
                const mobileLink = item.cloneNode(true);
                mobileLink.removeAttribute('class');
                mobileLinks.appendChild(mobileLink);
                return;
            }

            if (item.matches('.site-nav-dropdown')) {
                const label = document.createElement('div');
                label.className = 'site-mobile-nav__label';
                label.textContent = item.querySelector('[data-site-dropdown-button]')?.textContent.trim() || '';
                mobileLinks.appendChild(label);

                const group = document.createElement('div');
                group.className = 'site-mobile-nav__group';
                item.querySelectorAll('a').forEach((link) => {
                    const mobileLink = link.cloneNode(true);
                    mobileLink.removeAttribute('class');
                    group.appendChild(mobileLink);
                });
                mobileLinks.appendChild(group);
            }
        });
    }

    const openMobileMenu = () => {
        if (!menuButton || !menuOverlay || !menuDrawer) return;

        lastFocusedElement = document.activeElement;
        menuOverlay.hidden = false;
        menuButton.setAttribute('aria-expanded', 'true');
        menuDrawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('site-menu-open');
        requestAnimationFrame(() => {
            menuOverlay.classList.add('is-open');
            closeButton?.focus();
        });
    };

    const closeMobileMenu = () => {
        if (!menuButton || !menuOverlay || !menuDrawer || menuOverlay.hidden) return;

        menuOverlay.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuDrawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('site-menu-open');

        const finishClosing = () => {
            menuOverlay.hidden = true;
            menuOverlay.removeEventListener('transitionend', finishClosing);
        };

        menuOverlay.addEventListener('transitionend', finishClosing);
        window.setTimeout(finishClosing, 300);
        lastFocusedElement?.focus();
    };

    const closeDropdown = () => {
        if (!dropdownButton || !dropdownMenu) return;
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.hidden = true;
    };

    menuButton?.addEventListener('click', openMobileMenu);
    closeButton?.addEventListener('click', closeMobileMenu);

    menuOverlay?.addEventListener('click', (event) => {
        if (event.target === menuOverlay) closeMobileMenu();
    });

    menuDrawer?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    dropdownButton?.addEventListener('click', () => {
        const willOpen = dropdownButton.getAttribute('aria-expanded') !== 'true';
        dropdownButton.setAttribute('aria-expanded', String(willOpen));
        if (dropdownMenu) dropdownMenu.hidden = !willOpen;
    });

    document.addEventListener('click', (event) => {
        if (dropdown && !dropdown.contains(event.target)) closeDropdown();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeDropdown();
        closeMobileMenu();
    });
});
