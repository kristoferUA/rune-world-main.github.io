document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('[data-site-menu-button]');
    const menuOverlay = document.querySelector('[data-site-menu-overlay]');
    const menuDrawer = document.querySelector('[data-site-menu-drawer]');
    const closeButton = document.querySelector('[data-site-menu-close]');
    const dropdowns = Array.from(document.querySelectorAll('[data-site-dropdown]'));
    const desktopNav = document.querySelector('.site-desktop-nav');
    const mobileLinks = document.querySelector('[data-site-mobile-links]');

    let lastFocusedElement = null;

    const normalizePath = (path) => {
        const decodedPath = decodeURIComponent(path).replace(/\\/g, '/');
        return decodedPath.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    };

    const isPagesPath = window.location.pathname.includes('/pages/');
    const pageLanguage = document.documentElement.lang.split('-')[0];
    const pagesRoot = isPagesPath ? '../../' : '';
    const builderHref = !isPagesPath
        ? 'modpack.html'
        : pageLanguage === 'en'
            ? 'mods.html'
            : pageLanguage === 'uk'
                ? 'ukrmods.html'
                : `${pagesRoot}modpack.html`;
    const builderLabel = pageLanguage === 'en'
        ? 'Build modpack'
        : pageLanguage === 'uk'
            ? 'Зібрати модпак'
            : 'Собрать модпак';
    const builderPath = normalizePath(new URL(builderHref, window.location.href).pathname);

    const ensureBuilderLink = (nav) => {
        if (!nav) return null;
        const existing = Array.from(nav.querySelectorAll('a[href]')).find((link) =>
            normalizePath(new URL(link.href, window.location.href).pathname) === builderPath
        );
        if (existing) return existing;

        const link = document.createElement('a');
        link.href = builderHref;
        link.textContent = builderLabel;
        link.dataset.siteBuilderLink = '';
        const languageDropdown = Array.from(nav.querySelectorAll('[data-site-dropdown]')).find((dropdown) =>
            dropdown.querySelector('[data-site-dropdown-button]')?.textContent.trim().toLowerCase() === 'lang'
        );
        nav.insertBefore(link, languageDropdown || null);
        return link;
    };

    const builderLink = ensureBuilderLink(desktopNav);

    const deduplicateNavigationLinks = (nav) => {
        if (!nav) return;
        const seen = new Set();
        nav.querySelectorAll('a[href]').forEach((link) => {
            const url = new URL(link.href, window.location.href);
            const key = `${url.origin}${url.pathname}`;
            if (seen.has(key)) {
                link.remove();
            } else {
                seen.add(key);
            }
        });
    };

    deduplicateNavigationLinks(desktopNav);
    deduplicateNavigationLinks(menuDrawer);

    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('.site-desktop-nav a, .site-mobile-nav a').forEach((link) => {
        const linkUrl = new URL(link.href, window.location.href);
        if (linkUrl.origin === window.location.origin && normalizePath(linkUrl.pathname) === currentPath && !linkUrl.hash) {
            link.setAttribute('aria-current', 'page');
            const currentDropdown = link.closest('[data-site-dropdown]');
            if (currentDropdown) {
                currentDropdown.classList.add('is-current');
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

    if (menuDrawer && builderLink && !Array.from(menuDrawer.querySelectorAll('a[href]')).some((link) =>
        normalizePath(new URL(link.href, window.location.href).pathname) === builderPath
    )) {
        const mobileBuilderLink = builderLink.cloneNode(true);
        mobileBuilderLink.removeAttribute('aria-current');
        const languageLabel = Array.from(menuDrawer.querySelectorAll('.site-mobile-nav__label')).find((label) =>
            label.textContent.trim().toLowerCase() === 'lang'
        );
        menuDrawer.insertBefore(mobileBuilderLink, languageLabel || null);
    }

    deduplicateNavigationLinks(desktopNav);
    deduplicateNavigationLinks(menuDrawer);

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

    const closeDropdown = (dropdown) => {
        const dropdownButton = dropdown?.querySelector('[data-site-dropdown-button]');
        const dropdownMenu = dropdown?.querySelector('[data-site-dropdown-menu]');
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

    dropdowns.forEach((dropdown) => {
        const dropdownButton = dropdown.querySelector('[data-site-dropdown-button]');
        const dropdownMenu = dropdown.querySelector('[data-site-dropdown-menu]');
        dropdownButton?.addEventListener('click', () => {
            const willOpen = dropdownButton.getAttribute('aria-expanded') !== 'true';
            dropdowns.forEach((otherDropdown) => {
                if (otherDropdown !== dropdown) closeDropdown(otherDropdown);
            });
            dropdownButton.setAttribute('aria-expanded', String(willOpen));
            if (dropdownMenu) dropdownMenu.hidden = !willOpen;
        });
    });

    document.addEventListener('click', (event) => {
        dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(event.target)) closeDropdown(dropdown);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        dropdowns.forEach(closeDropdown);
        closeMobileMenu();
    });
});
