(() => {
  const pageDepth = window.location.pathname.includes('/pages/') ? '../../' : '';
  const DATA_URL = `${pageDepth}assets/data/mods.json`;
  const STORAGE_KEY = 'runeworld_java_modpack_v1';
  const language = document.documentElement.lang === 'uk'
    ? 'uk'
    : document.documentElement.lang === 'en'
      ? 'en'
      : 'ru';

  const translations = {
    ru: {
      all: 'Все', search: 'Ничего не найдено по вашему запросу.',
      required: 'Обязательный', inBase: 'Включён в базу',
      remove: 'Убрать из сборки', conflict: 'Есть конфликт', add: 'Добавить',
      requires: 'Требует', conflictsWith: 'Конфликтует с',
      cannotRemove: 'Нельзя убрать', neededFor: 'так как он нужен для',
      conflictAlert: 'конфликтует с', disableConflicts: 'Сначала отключите конфликтующие моды.',
      items: 'элементов', removeButton: 'Убрать',
      addAll: 'Добавить все', removeAll: 'Убрать все',
      zip: 'Скачать ZIP', mrpack: 'Скачать MRPACK',
      share: 'Скопировать ссылку', reset: 'Сбросить',
      notFound: 'Файл не найден', loading: 'Начинаем сборку...',
      loadingMod: 'Загрузка', packing: 'Упаковка архива...',
      doneZip: 'Готово! Файл .zip скачан.', doneMrpack: 'Готово! Файл .mrpack скачан.',
      buildError: 'Ошибка сборки', copied: 'Ссылка на сборку скопирована!',
      copyFallback: 'Скопируйте ссылку из адресной строки браузера.',
      jsZipMissing: 'Не найден assets/js/jszip.min.js.',
      catalogError: 'Не удалось загрузить каталог модов',
      catalogHint: 'Проверьте, что assets/data/mods.json опубликован на GitHub Pages.'
    },
    uk: {
      all: 'Усі', search: 'Нічого не знайдено за вашим запитом.',
      required: 'Обов’язковий', inBase: 'Увімкнений у базі',
      remove: 'Прибрати зі збірки', conflict: 'Є конфлікт', add: 'Додати',
      requires: 'Потребує', conflictsWith: 'Конфліктує з',
      cannotRemove: 'Не можна прибрати', neededFor: 'оскільки він потрібен для',
      conflictAlert: 'конфліктує з', disableConflicts: 'Спочатку вимкніть конфліктуючі моди.',
      items: 'елементів', removeButton: 'Прибрати',
      addAll: 'Додати всі', removeAll: 'Прибрати всі',
      zip: 'Завантажити ZIP', mrpack: 'Завантажити MRPACK',
      share: 'Скопіювати посилання', reset: 'Скинути',
      notFound: 'Файл не знайдено', loading: 'Починаємо збірку...',
      loadingMod: 'Завантаження', packing: 'Пакування архіву...',
      doneZip: 'Готово! Файл .zip завантажено.', doneMrpack: 'Готово! Файл .mrpack завантажено.',
      buildError: 'Помилка збірки', copied: 'Посилання на збірку скопійовано!',
      copyFallback: 'Скопіюйте посилання з адресного рядка браузера.',
      jsZipMissing: 'Не знайдено assets/js/jszip.min.js.',
      catalogError: 'Не вдалося завантажити каталог модів',
      catalogHint: 'Перевірте, що assets/data/mods.json опубліковано на GitHub Pages.'
    },
    en: {
      all: 'All', search: 'Nothing found for your search.',
      required: 'Required', inBase: 'Included in the base',
      remove: 'Remove from pack', conflict: 'Conflict', add: 'Add',
      requires: 'Requires', conflictsWith: 'Conflicts with',
      cannotRemove: 'Cannot remove', neededFor: 'because it is required for',
      conflictAlert: 'conflicts with', disableConflicts: 'Disable conflicting mods first.',
      items: 'items', removeButton: 'Remove',
      addAll: 'Add all', removeAll: 'Remove all',
      zip: 'Download ZIP', mrpack: 'Download MRPACK',
      share: 'Copy link', reset: 'Reset',
      notFound: 'File not found', loading: 'Preparing the pack...',
      loadingMod: 'Downloading', packing: 'Packaging the archive...',
      doneZip: 'Done! The .zip file was downloaded.', doneMrpack: 'Done! The .mrpack file was downloaded.',
      buildError: 'Pack error', copied: 'Pack link copied!',
      copyFallback: 'Copy the link from the browser address bar.',
      jsZipMissing: 'assets/js/jszip.min.js was not found.',
      catalogError: 'Could not load the mod catalog',
      catalogHint: 'Check that assets/data/mods.json is published on GitHub Pages.'
    }
  };
  const t = translations[language];
  const categoryLabels = {
    ru: {},
    uk: {
      'Интерфейс': 'Інтерфейс', 'Утилиты': 'Утиліти', 'Графика': 'Графіка',
      'Косметика': 'Косметика', 'Удобство': 'Зручність', 'Библиотеки': 'Бібліотеки',
      'Оптимизация': 'Оптимізація', 'Строительство': 'Будівництво',
      'Навигация': 'Навігація', 'Коммуникации': 'Комунікації', 'Аудио': 'Аудіо'
    },
    en: {
      'Интерфейс': 'Interface', 'Утилиты': 'Utilities', 'Графика': 'Graphics',
      'Косметика': 'Cosmetics', 'Удобство': 'Convenience', 'Библиотеки': 'Libraries',
      'Оптимизация': 'Optimization', 'Строительство': 'Building',
      'Навигация': 'Navigation', 'Коммуникации': 'Communication', 'Аудио': 'Audio'
    }
  };

  const modrinthSlugs = {
    'better-f3': 'betterf3',
    'forge-config-api': 'forge-config-api-port',
    'ias': 'in-game-account-switcher',
    'inventory-particles': 'inventory-particles',
    'minecraft-capes': 'minecraft-capes',
    'mouse-tweaks': 'mouse-tweaks',
    'no-chat-reports': 'no-chat-reports',
    'resourcify': 'resourcify',
    'subtle-effects': 'subtle-effects',
    'apple-skin': 'appleskin',
    'better-stats': 'better-stats',
    'bobby': 'bobby',
    'c2me': 'c2me-fabric',
    'chat-heads': 'chat-heads',
    'cherished-worlds': 'cherished-worlds',
    'cloth-config': 'cloth-config',
    'dynamic-fps': 'dynamic-fps',
    'entity-model-features': 'entity-model-features',
    'entity-texture-features': 'entitytexturefeatures',
    'entity-culling': 'entityculling',
    'fabric-api': 'fabric-api',
    'fabric-kotlin': 'fabric-language-kotlin',
    'falling-leaves': 'fallingleaves',
    'iris': 'iris',
    'lambdynamiclights': 'lambdynamiclights',
    'language-reload': 'language-reload',
    'litematica': 'litematica',
    'lithium': 'lithium',
    'malilib': 'malilib',
    'mod-menu': 'modmenu',
    'more-chat-history': 'morechathistory',
    'notenoughanimations': 'notenoughanimations',
    'ok-zoomer': 'ok-zoomer',
    'particle-rain': 'particle-rain',
    'random-block-placement': 'random-block-placement',
    'rrls': 'rrls',
    'shulker-tooltip': 'shulkerboxtooltip',
    'skinlayers3d': 'skinlayers3d',
    'smooth-scroll': 'smoothscroll',
    'sodium-extra': 'sodium-extra',
    'sodium': 'sodium',
    'sodium-beta': 'sodium',
    'sounds': 'sounds',
    'visuality': 'visuality',
    'voicechat-fabric': 'simple-voice-chat',
    'voicechat-fabric-new': 'simple-voice-chat',
    'xaero-world-map': 'xaeros-world-map',
    'yet-another-config-lib': 'yet-another-config-lib'
  };

  let catalog = {
    packName: 'RuneWorld',
    mcVersion: '1.21.1',
    loaderName: 'Fabric',
    loaderKey: 'fabric-loader',
    loaderVersion: '0.16.9',
    serverIp: '',
    presets: [],
    mods: []
  };

  let modsById = new Map();
  let selectedIds = new Set();
  let activeCategory = t.all;
  let searchQuery = '';

  const els = {
    envInfo: document.getElementById('pack-env-info'),
    search: document.getElementById('search-input'),
    categories: document.getElementById('category-filters'),
    presets: document.getElementById('preset-buttons'),
    grid: document.getElementById('mods-grid'),
    count: document.getElementById('selected-count'),
    size: document.getElementById('selected-size'),
    selectedList: document.getElementById('selected-list'),
    alert: document.getElementById('builder-alert'),
    downloadZipBtn: document.getElementById('download-zip-btn'),
    downloadMrpackBtn: document.getElementById('download-mrpack-btn'),
    shareBtn: document.getElementById('share-link-btn'),
    resetBtn: document.getElementById('reset-pack-btn'),
    addAllBtn: document.getElementById('add-all-btn'),
    removeAllBtn: document.getElementById('remove-all-btn'),
    progress: document.getElementById('download-progress'),
    status: document.getElementById('download-status'),
  };

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      catalog = await res.json();
      modsById = new Map(catalog.mods.map(m => [m.id, m]));

      els.envInfo.textContent = catalog.loaderVersion
        ? `Minecraft ${catalog.mcVersion} • ${catalog.loaderName} ${catalog.loaderVersion}`
        : `Minecraft ${catalog.mcVersion} • ${catalog.loaderName}`;

      restoreSelection();
      ensureRequiredAndDependencies();
      renderCategories();
      renderPresets();
      renderAll();
      bindEvents();
    } catch (err) {
      if (window.location.protocol === 'file:') {
        showAlert(language === 'uk'
          ? 'Сторінку відкрито як file://. Запустіть локальний сервер: py -m http.server 8000.'
          : language === 'en'
            ? 'The page is opened as file://. Start a local server: py -m http.server 8000.'
            : 'Страница открыта как file://. Запустите локальный сервер: py -m http.server 8000.');
      } else {
        showAlert(`${t.catalogError} (${err.message}). ${t.catalogHint}`);
      }
    }
  }

  function restoreSelection() {
    const params = new URLSearchParams(window.location.search);
    const urlMods = params.get('mods');

    if (urlMods) {
      urlMods.split(',').forEach(id => {
        if (modsById.has(id)) selectedIds.add(id);
      });
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      saved.forEach(id => {
        if (modsById.has(id)) selectedIds.add(id);
      });
    } catch (_) {}
  }

  function saveSelection() {
    const arr = Array.from(selectedIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

    const url = new URL(window.location.href);
    if (arr.length) {
      url.searchParams.set('mods', arr.join(','));
    } else {
      url.searchParams.delete('mods');
    }
    window.history.replaceState({}, '', url);
  }

  function ensureRequiredAndDependencies() {
    catalog.mods.forEach(m => {
      if (m.required) addModWithDeps(m.id);
    });
    Array.from(selectedIds).forEach(id => addModWithDeps(id));
    saveSelection();
  }

  function getConflictsFor(modId) {
    const mod = modsById.get(modId);
    if (!mod) return [];
    const conflicts = new Set();

    (mod.conflicts || []).forEach(cId => {
      if (selectedIds.has(cId)) conflicts.add(cId);
    });
    selectedIds.forEach(sId => {
      if (modsById.get(sId)?.conflicts?.includes(modId)) conflicts.add(sId);
    });

    return Array.from(conflicts);
  }

  function addModWithDeps(modId, visited = new Set()) {
    if (visited.has(modId)) return true;
    visited.add(modId);

    const mod = modsById.get(modId);
    if (!mod) return false;

    const conflicts = getConflictsFor(modId);
    if (conflicts.length > 0) {
      const names = conflicts.map(id => modsById.get(id)?.name || id).join(', ');
      showAlert(`«${mod.name}» ${t.conflictAlert}: ${names}. ${t.disableConflicts}`);
      return false;
    }

    for (const depId of mod.requires || []) {
      if (!addModWithDeps(depId, visited)) return false;
    }

    selectedIds.add(modId);
    return true;
  }

  function removeMod(modId) {
    const mod = modsById.get(modId);
    if (!mod || mod.required) return;

    const dependents = Array.from(selectedIds).filter(id =>
      modsById.get(id)?.requires?.includes(modId)
    );

    if (dependents.length > 0) {
      const names = dependents.map(id => modsById.get(id)?.name || id).join(', ');
      showAlert(`${t.cannotRemove} «${mod.name}», ${t.neededFor}: ${names}.`);
      return;
    }

    selectedIds.delete(modId);
    hideAlert();
  }

  function toggleMod(modId) {
    hideAlert();
    if (selectedIds.has(modId)) {
      removeMod(modId);
    } else {
      addModWithDeps(modId);
    }
    saveSelection();
    renderAll();
  }

  function applyPreset(preset) {
    hideAlert();
    selectedIds.clear();
    catalog.mods.filter(m => m.required).forEach(m => selectedIds.add(m.id));
    preset.mods.forEach(id => addModWithDeps(id));
    saveSelection();
    renderAll();
  }

  function resetToRequired() {
    hideAlert();
    selectedIds.clear();
    catalog.mods.filter(m => m.required).forEach(m => addModWithDeps(m.id));
    saveSelection();
    renderAll();
  }

  function addAllMods() {
    hideAlert();
    catalog.mods.forEach(m => {
      if (!selectedIds.has(m.id)) addModWithDeps(m.id);
    });
    saveSelection();
    renderAll();
  }

  function removeAllMods() {
    hideAlert();
    selectedIds.clear();
    catalog.mods.filter(m => m.required).forEach(m => addModWithDeps(m.id));
    saveSelection();
    renderAll();
  }

  function renderCategories() {
    const cats = [t.all, ...new Set(catalog.mods.map(m => m.category))];
    els.categories.replaceChildren();

    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `chip ${cat === activeCategory ? 'active' : ''}`;
      btn.textContent = cat === t.all ? t.all : (categoryLabels[language][cat] || cat);
      btn.addEventListener('click', () => {
        activeCategory = cat;
        renderCategories();
        renderGrid();
      });
      els.categories.appendChild(btn);
    });
  }

  function renderPresets() {
    els.presets.replaceChildren();
    catalog.presets.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.textContent = preset[`name_${language}`] || preset.name;
      btn.addEventListener('click', () => applyPreset(preset));
      els.presets.appendChild(btn);
    });
  }

  const modrinthInfoCache = new Map();

  async function loadModrinthInfo(mod, imageElement) {
    if (modrinthInfoCache.has(mod.id)) {
      const info = modrinthInfoCache.get(mod.id);
      if (info.iconUrl) imageElement.src = info.iconUrl;
      return;
    }

    const slug = modrinthSlugs[mod.id] || mod.id;
    try {
      let project = await fetch(`https://api.modrinth.com/v2/project/${encodeURIComponent(slug)}`).then(r => {
        if (!r.ok) throw new Error('project not found');
        return r.json();
      });
      const info = {
        iconUrl: project.icon_url || '',
        url: `https://modrinth.com/mod/${project.slug || slug}`
      };
      modrinthInfoCache.set(mod.id, info);
      if (info.iconUrl) imageElement.src = info.iconUrl;
      const link = imageElement.closest('.mod-media')?.querySelector('.modrinth-link');
      if (link) link.href = info.url;
    } catch (_) {
      const searchUrl = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(mod.name)}&limit=1&facets=${encodeURIComponent(JSON.stringify([['project_type:mod']]))}`;
      try {
        const result = await fetch(searchUrl).then(r => r.ok ? r.json() : null);
        const project = result?.hits?.[0];
        if (project) {
          const info = {
            iconUrl: project.icon_url || '',
            url: `https://modrinth.com/mod/${project.slug}`
          };
          modrinthInfoCache.set(mod.id, info);
          if (info.iconUrl) imageElement.src = info.iconUrl;
          const link = imageElement.closest('.mod-media')?.querySelector('.modrinth-link');
          if (link) link.href = info.url;
        }
      } catch (_) {}
    }
  }

  function renderGrid() {
    els.grid.replaceChildren();
    const q = searchQuery.trim().toLowerCase();

    const filtered = catalog.mods.filter(mod => {
      const matchCat = activeCategory === t.all || mod.category === activeCategory;
      const matchSearch =
        !q ||
        mod.name.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-msg';
      empty.textContent = t.search;
      els.grid.appendChild(empty);
      return;
    }

    filtered.forEach(mod => {
      const isSelected = selectedIds.has(mod.id);
      const conflicts = !isSelected ? getConflictsFor(mod.id) : [];

      const card = document.createElement('article');
      card.className = `mod-card ${isSelected ? 'selected' : ''} ${conflicts.length ? 'has-conflict' : ''}`;

      const header = document.createElement('div');
      header.className = 'mod-card-header';

      const title = document.createElement('h3');
      title.textContent = mod.name;

      const badge = document.createElement('span');
      badge.className = `mod-badge ${mod.required ? 'badge-required' : ''}`;
      badge.textContent = mod.required ? t.required : `${mod.sizeMB} MB`;

      header.append(title, badge);

      const media = document.createElement('div');
      media.className = 'mod-media';

      const image = document.createElement('img');
      image.className = 'mod-icon';
      image.src = `${pageDepth}assets/images/iconrw.png`;
      image.alt = mod.name;
      image.loading = 'lazy';

      const slug = modrinthSlugs[mod.id] || mod.id;
      const modrinthLink = document.createElement('a');
      modrinthLink.className = 'modrinth-link';
      modrinthLink.href = `https://modrinth.com/mod/${slug}`;
      modrinthLink.target = '_blank';
      modrinthLink.rel = 'noopener noreferrer';
      modrinthLink.textContent = 'Modrinth';

      media.append(image, modrinthLink);

      const catTag = document.createElement('span');
      catTag.className = 'mod-category';
      catTag.textContent = `${categoryLabels[language][mod.category] || mod.category} → /${mod.targetDir || 'mods'}`;

      const desc = document.createElement('p');
      desc.className = 'mod-desc';
      desc.textContent = mod.description;

      const meta = document.createElement('div');
      meta.className = 'mod-meta';
      if (mod.requires?.length) {
        const reqNames = mod.requires.map(id => modsById.get(id)?.name || id).join(', ');
        const reqEl = document.createElement('small');
        reqEl.textContent = `${t.requires}: ${reqNames}`;
        meta.appendChild(reqEl);
      }
      if (conflicts.length) {
        const confNames = conflicts.map(id => modsById.get(id)?.name || id).join(', ');
        const confEl = document.createElement('small');
        confEl.className = 'conflict-text';
        confEl.textContent = `${t.conflictsWith}: ${confNames}`;
        meta.appendChild(confEl);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mod-toggle-btn';
      btn.disabled = Boolean(mod.required);
      if (mod.required) {
        btn.textContent = t.inBase;
      } else if (isSelected) {
        btn.textContent = t.remove;
      } else if (conflicts.length) {
        btn.textContent = t.conflict;
      } else {
        btn.textContent = t.add;
      }
      btn.addEventListener('click', () => toggleMod(mod.id));

      card.append(header, media, catTag, desc, meta, btn);
      els.grid.appendChild(card);
      loadModrinthInfo(mod, image);
    });
  }

  function renderSummary() {
    els.selectedList.replaceChildren();
    let totalSize = 0;

    Array.from(selectedIds).forEach(id => {
      const mod = modsById.get(id);
      if (!mod) return;
      totalSize += Number(mod.sizeMB || 0);

      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${mod.name} (${mod.sizeMB} MB)`;
      li.appendChild(nameSpan);

      if (!mod.required) {
        const rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'remove-item-btn';
        rmBtn.textContent = '×';
        rmBtn.title = t.removeButton;
        rmBtn.addEventListener('click', () => toggleMod(mod.id));
        li.appendChild(rmBtn);
      }
      els.selectedList.appendChild(li);
    });

    els.count.textContent = String(selectedIds.size);
    els.size.textContent = `${totalSize.toFixed(1)} MB`;

    const empty = selectedIds.size === 0;
    els.downloadZipBtn.disabled = empty;
    els.downloadMrpackBtn.disabled = empty;
  }

  function renderAll() {
    renderGrid();
    renderSummary();
  }

  async function downloadPack(format) {
    if (typeof JSZip === 'undefined') {
      showAlert(t.jsZipMissing);
      return;
    }

    const modsToPack = Array.from(selectedIds)
      .map(id => modsById.get(id))
      .filter(Boolean);

    els.downloadZipBtn.disabled = true;
    els.downloadMrpackBtn.disabled = true;
    els.progress.hidden = false;
    els.progress.value = 0;
    els.status.textContent = t.loading;

    try {
      const zip = new JSZip();
      const prefix = format === 'mrpack' ? 'overrides/' : '';

      for (let i = 0; i < modsToPack.length; i++) {
        const mod = modsToPack[i];
        els.status.textContent = `${t.loadingMod} ${mod.name} (${i + 1}/${modsToPack.length})...`;

        const fileUrl = mod.file.startsWith('http')
          ? mod.file
          : `${pageDepth}${mod.file.replace(/^\/+/, '')}`;
        const resp = await fetch(fileUrl);
        if (!resp.ok) throw new Error(`Файл не найден: ${mod.file}`);
        const blob = await resp.blob();

        const dir = (mod.targetDir || 'mods').replace(/^\/+|\/+$/g, '');
        const filename = mod.filename || mod.file.split('/').pop();
        zip.file(`${prefix}${dir}/${filename}`, blob);

        els.progress.value = Math.round(((i + 1) / modsToPack.length) * 80);
      }

      if (format === 'mrpack') {
        const indexJson = {
          formatVersion: 1,
          game: 'minecraft',
          versionId: `${catalog.mcVersion}-${Date.now()}`,
          name: `${catalog.packName} Custom`,
          summary: `Сборка для ${catalog.packName} (${window.location.href})`,
          files: [],
          dependencies: catalog.loaderVersion
            ? {
                minecraft: catalog.mcVersion,
                [catalog.loaderKey]: catalog.loaderVersion
              }
            : {
                minecraft: catalog.mcVersion
              }
        };
        zip.file('modrinth.index.json', JSON.stringify(indexJson, null, 2));
      } else {
        const readme = [
          `=== ${catalog.packName} — Пользовательская сборка ===`,
          `Версия игры: Minecraft Java ${catalog.mcVersion}`,
          `Загрузчик: ${catalog.loaderName} ${catalog.loaderVersion}`,
          catalog.serverIp ? `IP сервера: ${catalog.serverIp}` : '',
          `Ссылка на редактирование сборки: ${window.location.href}`,
          '',
          'Как установить:',
          `1. Установите профиль Minecraft ${catalog.mcVersion} с загрузчиком ${catalog.loaderName} ${catalog.loaderVersion}.`,
          '2. Распакуйте содержимое этого архива (папки mods, shaderpacks и т.д.) в папку вашей сборки (.minecraft).',
          '',
          'Список включённых файлов:',
          ...modsToPack.map(m => `- [${m.targetDir || 'mods'}] ${m.name} (${m.file.split('/').pop()})`)
        ].filter(Boolean).join('\n');

        zip.file('Инструкция-RuneWorld.txt', readme);
      }

      els.status.textContent = t.packing;
      const archiveBlob = await zip.generateAsync(
        { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 5 } },
        meta => {
          els.progress.value = 80 + Math.round(meta.percent * 0.2);
        }
      );

      const ext = format === 'mrpack' ? 'mrpack' : 'zip';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(archiveBlob);
      a.download = `${catalog.packName}-${catalog.mcVersion}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);

      els.status.textContent = format === 'mrpack' ? t.doneMrpack : t.doneZip;
    } catch (err) {
      showAlert(`${t.buildError}: ${err.message}`);
      els.status.textContent = '';
    } finally {
      els.downloadZipBtn.disabled = false;
      els.downloadMrpackBtn.disabled = false;
      setTimeout(() => {
        els.progress.hidden = true;
      }, 2500);
    }
  }

  function showAlert(msg) {
    els.alert.textContent = msg;
    els.alert.hidden = false;
  }

  function hideAlert() {
    els.alert.hidden = true;
  }

  function bindEvents() {
    els.search.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderGrid();
    });

    els.downloadZipBtn.addEventListener('click', () => downloadPack('zip'));
    els.downloadMrpackBtn.addEventListener('click', () => downloadPack('mrpack'));
    els.resetBtn.addEventListener('click', resetToRequired);
    els.addAllBtn?.addEventListener('click', addAllMods);
    els.removeAllBtn?.addEventListener('click', removeAllMods);

    els.shareBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        els.status.textContent = t.copied;
      } catch {
        showAlert(t.copyFallback);
      }
    });
  }

  init();
})();