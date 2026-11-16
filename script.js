var VIEW_STORAGE_KEY = 'other-projects-view';
var root = document.documentElement;

/* Static SVG markup (never user supplied, so innerHTML is safe here). */
var CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

var ARROW_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M6 18 18 6M6 6h12v12"></path></svg>';

/* ===========================================
   Title rendering (per-letter spans)
   =========================================== */

function setTitleText(text) {
    var titleEl = document.getElementById('app-title');
    if (!titleEl) return;
    titleEl.innerHTML = text.split('').map(function (ch) {
        if (ch === ' ') return '<span class="title-letter title-space">&nbsp;</span>';
        var cls = ch === '_' ? 'title-letter title-underscore' : 'title-letter';
        return '<span class="' + cls + '">' + ch + '</span>';
    }).join('');
}

/* ===========================================
   Toast (replaces blocking alert() calls)
   =========================================== */

var toastTimeout = null;

function showToast(message, duration) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, duration || 4000);
}

/* ===========================================
   Rendering (data -> DOM)
   =========================================== */

function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function buildAppItem(app, detailId) {
    var item = document.createElement('li');
    item.className = 'list-item';

    /* Row: icon + text + expand chevron */
    var content = document.createElement('div');
    content.className = 'list-item-content';

    var icon = document.createElement('img');
    icon.src = app.icon || 'favicon.ico';
    icon.alt = app.title + ' Icon';
    icon.className = app.iconClass ? 'list-icon ' + app.iconClass : 'list-icon';
    content.appendChild(icon);

    var text = document.createElement('div');
    text.className = 'list-text';

    var title = document.createElement('div');
    title.className = 'list-title';
    title.textContent = app.title;

    var subtitle = document.createElement('div');
    subtitle.className = 'list-subtitle';
    subtitle.textContent = app.subtitle;

    text.appendChild(title);
    text.appendChild(subtitle);
    content.appendChild(text);

    var chevron = document.createElement('button');
    chevron.type = 'button';
    chevron.className = 'list-chevron';
    chevron.setAttribute('aria-expanded', 'false');
    chevron.setAttribute('aria-controls', detailId);
    chevron.setAttribute('aria-label', 'Toggle ' + app.title + ' description');
    chevron.innerHTML = CHEVRON_SVG;
    content.appendChild(chevron);

    /* Detail: description + open button */
    var detail = document.createElement('div');
    detail.className = 'list-item-detail';
    detail.id = detailId;

    var description = document.createElement('p');
    description.className = 'detail-description';
    description.textContent = app.description;

    var link = document.createElement('a');
    link.className = 'detail-button';
    link.href = app.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Open ' + app.title + ' (opens in a new tab)');
    link.innerHTML = ARROW_SVG;

    detail.appendChild(description);
    detail.appendChild(link);

    item.appendChild(content);
    item.appendChild(detail);
    return item;
}

function renderGallery(categories, container) {
    var fragment = document.createDocumentFragment();

    categories.forEach(function (category) {
        var section = document.createElement('section');
        section.className = 'list-section';

        var header = document.createElement('h3');
        header.className = 'list-section-header';
        header.textContent = category.name;

        var list = document.createElement('ul');
        list.className = 'list-group';

        (category.apps || []).forEach(function (app, index) {
            list.appendChild(buildAppItem(app, 'detail-' + slugify(category.name + '-' + app.title) + '-' + index));
        });

        section.appendChild(header);
        section.appendChild(list);
        fragment.appendChild(section);
    });

    container.textContent = '';
    container.appendChild(fragment);
}

function renderOtherProjects(projects, list) {
    var fragment = document.createDocumentFragment();

    projects.forEach(function (project) {
        var item = document.createElement('li');
        item.className = 'other-projects-item';

        var name = document.createElement('span');
        name.textContent = project.title;

        var link = document.createElement('a');
        link.className = 'other-projects-visit';
        link.href = project.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Open ' + project.title + ' (opens in a new tab)');
        link.innerHTML = ARROW_SVG;

        item.appendChild(name);
        item.appendChild(link);
        fragment.appendChild(item);
    });

    list.textContent = '';
    list.appendChild(fragment);
}

function renderContent() {
    var data = window.APPSYSTEM_DATA;
    if (!data) {
        console.error('apps-data.js is missing or failed to load: nothing to render.');
        return false;
    }

    var gallery = document.getElementById('default-projects-view');
    var otherList = document.getElementById('other-projects-group');

    if (gallery) renderGallery(data.categories || [], gallery);
    if (otherList) renderOtherProjects(data.otherProjects || [], otherList);

    return true;
}

/* ===========================================
   Settings drawer (modal dialog)
   =========================================== */

var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

var lastFocusedElement = null;

function isSettingsOpen() {
    var panel = document.getElementById('settings-panel');
    return !!panel && panel.classList.contains('active');
}

/* Keep the page behind the dialog out of the tab order and a11y tree. */
function setPageInert(inert) {
    var regions = document.querySelectorAll('body > header, body > main, body > footer');
    Array.prototype.forEach.call(regions, function (el) {
        if (inert) el.setAttribute('inert', '');
        else el.removeAttribute('inert');
    });
}

function openSettingsPanel() {
    var panel = document.getElementById('settings-panel');
    var overlay = document.getElementById('settings-overlay');
    var button = document.querySelector('.settings-button');
    if (!panel || !overlay) return;

    lastFocusedElement = document.activeElement;

    panel.classList.add('active');
    overlay.classList.add('active');
    if (button) button.setAttribute('aria-expanded', 'true');

    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth > 0 ? scrollbarWidth + 'px' : '';

    setPageInert(true);

    var closeButton = panel.querySelector('.close-settings');
    if (closeButton) closeButton.focus();
}

function closeSettingsPanel() {
    var panel = document.getElementById('settings-panel');
    var overlay = document.getElementById('settings-overlay');
    var button = document.querySelector('.settings-button');
    if (!panel || !overlay) return;

    panel.classList.remove('active');
    overlay.classList.remove('active');
    if (button) button.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    setPageInert(false);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    } else if (button) {
        button.focus();
    }
    lastFocusedElement = null;
}

function toggleSettingsPanel() {
    if (isSettingsOpen()) closeSettingsPanel();
    else openSettingsPanel();
}

/* Escape closes; Tab is trapped inside the dialog while it is open. */
document.addEventListener('keydown', function (event) {
    if (!isSettingsOpen()) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        closeSettingsPanel();
        return;
    }

    if (event.key !== 'Tab') return;

    var panel = document.getElementById('settings-panel');
    var focusables = Array.prototype.filter.call(
        panel.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
    );
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

/* ===========================================
   List item expansion
   =========================================== */

function setDetailHeight(item) {
    var detail = item.querySelector('.list-item-detail');
    if (!detail) return;
    if (item.classList.contains('expanded')) {
        detail.style.maxHeight = detail.scrollHeight + 'px';
    } else {
        /* Clearing the inline value returns control to the CSS 0 state,
           which is what animates the collapse. */
        detail.style.maxHeight = '';
    }
}

function collapseItem(item) {
    item.classList.remove('expanded');
    var button = item.querySelector('.list-chevron');
    if (button) button.setAttribute('aria-expanded', 'false');
    setDetailHeight(item);
}

function toggleListItem(item) {
    var button = item.querySelector('.list-chevron');

    if (item.classList.contains('expanded')) {
        collapseItem(item);
        return;
    }

    Array.prototype.forEach.call(
        document.querySelectorAll('.list-item.expanded'),
        collapseItem
    );

    item.classList.add('expanded');
    if (button) button.setAttribute('aria-expanded', 'true');

    /* Measure on the next frame, once the expanded class has been applied. */
    requestAnimationFrame(function () {
        if (!item.classList.contains('expanded')) return;
        setDetailHeight(item);
        item.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'nearest'
        });
    });
}

function initListItems() {
    Array.prototype.forEach.call(document.querySelectorAll('.list-item'), function (item) {
        var button = item.querySelector('.list-chevron');
        if (button) button.addEventListener('click', function () { toggleListItem(item); });
    });
}

/* Re-measure open panels when the layout changes (resize, font swap). */
function refreshExpandedHeights() {
    Array.prototype.forEach.call(
        document.querySelectorAll('.list-item.expanded'),
        setDetailHeight
    );
}

var resizeFrame = null;
window.addEventListener('resize', function () {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(refreshExpandedHeights);
});

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshExpandedHeights).catch(function () { /* non-fatal */ });
}

/* ===========================================
   Open every app in the active view
   =========================================== */

function openAllWebsites() {
    var showingOther = root.classList.contains('show-other-projects');
    var links = document.querySelectorAll(showingOther ? '.other-projects-visit' : '.detail-button');

    var blockedCount = 0;
    Array.prototype.forEach.call(links, function (link) {
        if (!window.open(link.href, '_blank', 'noopener,noreferrer')) blockedCount++;
    });

    if (blockedCount > 0) {
        showToast('Your browser blocked some pop-ups. Allow pop-ups for this site to open every app at once.');
    }
}

/* ===========================================
   View switching (gallery <-> other projects)
   =========================================== */

function applyView(showOther, persist) {
    root.classList.toggle('show-other-projects', showOther);

    var toggle = document.getElementById('other-projects-toggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', String(showOther));
        toggle.setAttribute('aria-label', showOther ? 'Show my projects' : 'Show other projects');
    }

    setTitleText(showOther ? 'OTHER_PROJECTS' : 'APPSYSTEM_PRO');

    if (persist) {
        try {
            localStorage.setItem(VIEW_STORAGE_KEY, showOther ? 'true' : 'false');
        } catch (error) {
            console.warn('Could not persist other projects view preference:', error);
        }
    }
}

function toggleOtherProjectsView(event) {
    if (event) event.stopPropagation();
    applyView(!root.classList.contains('show-other-projects'), true);
}

/* ===========================================
   Init
   =========================================== */

function init() {
    renderContent();

    /* <head> already applied the saved class; sync ARIA + title without re-saving. */
    applyView(root.classList.contains('show-other-projects'), false);

    initListItems();
    refreshExpandedHeights();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
