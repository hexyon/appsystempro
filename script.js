// ===========================================
// Title rendering (keeps per-letter spans for hover effect)
// ===========================================

function setTitleText(el, text) {
    if (!el) return;
    el.innerHTML = text
        .split('')
        .map(ch => {
            const isSpace = ch === ' ';
            const cls = isSpace ? 'title-letter title-space' : 'title-letter';
            const content = isSpace ? '&nbsp;' : ch;
            return `<span class="${cls}">${content}</span>`;
        })
        .join('');
    assignUniqueLetterColors(el);
}

function assignUniqueLetterColors(titleEl) {
    // Per-letter color effect removed — logo text now stays a single,
    // consistent color (no per-letter hover coloring assigned).
    return;
}

function initTitleHoverColor() {
    const titleEl = document.getElementById('app-title');
    if (!titleEl) return;
    assignUniqueLetterColors(titleEl);
}

// ===========================================
// Toast (replaces blocking alert() calls)
// ===========================================

let toastTimeout = null;

function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===========================================
// List Item Expansion
// ===========================================

function initListItems() {
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        const button = item.querySelector('.list-chevron');
        // Native buttons support clicks, Enter, and Space.
        button.addEventListener('click', () => toggleListItem(item));
    });
}

function toggleListItem(item) {
    const isExpanded = item.classList.contains('expanded');

    const button = item.querySelector('.list-chevron');

    if (isExpanded) {
        item.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('expanded');
        button.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function openAllWebsites() {
    const otherView = document.getElementById('other-projects-view');
    const isOtherProjectsActive = otherView && otherView.style.display !== 'none';
    
    let links;
    if (isOtherProjectsActive) {
        links = document.querySelectorAll('.other-projects-visit');
    } else {
        links = document.querySelectorAll('.detail-button');
    }
    
    let blockedCount = 0;
    links.forEach(link => {
        const href = link.href;
        const opened = window.open(href, '_blank', 'noopener,noreferrer');
        if (!opened) blockedCount++;
    });
    if (blockedCount > 0) {
        showToast('Your browser blocked some pop-ups. Allow pop-ups for this site to open every app at once.');
    }
}


function toggleSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    const button = document.querySelector('.settings-button');
    const isActive = panel.classList.contains('active');

    if (isActive) {
        closeSettingsPanel();
    } else {
        panel.classList.add('active');
        overlay.classList.add('active');
        if (button) button.setAttribute('aria-expanded', 'true');
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollbarWidth + 'px';
    }
}

function closeSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('settings-overlay');
    const button = document.querySelector('.settings-button');

    panel.classList.remove('active');
    overlay.classList.remove('active');
    if (button) button.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const panel = document.getElementById('settings-panel');
        if (panel && panel.classList.contains('active')) closeSettingsPanel();
    }
});

function toggleOtherProjectsView(event) {
    if (event) event.stopPropagation();

    const defaultView = document.getElementById('default-projects-view');
    const otherView = document.getElementById('other-projects-view');
    const toggleButton = document.getElementById('other-projects-toggle');
    const thumbLabel = document.getElementById('other-projects-thumb-label');
    const titleEl = document.getElementById('app-title');
    if (!defaultView || !otherView || !toggleButton) return;

    const isShowingOther = otherView.style.display !== 'none';
    const showOther = !isShowingOther;

    defaultView.style.display = showOther ? 'none' : '';
    otherView.style.display = showOther ? '' : 'none';

    toggleButton.setAttribute('aria-pressed', showOther);
    toggleButton.setAttribute('aria-label', showOther ? 'Switch back to your projects' : 'Switch to other projects');
    if (thumbLabel) thumbLabel.innerHTML = showOther
        ? '<i class="fas fa-check" aria-hidden="true"></i>'
        : '<i class="fas fa-house" aria-hidden="true"></i>';
    setTitleText(titleEl, showOther ? 'OTHER_PROJECTS' : 'APPSYSTEM_PRO');

    try {
        localStorage.setItem('other-projects-view', showOther ? 'true' : 'false');
    } catch (error) {
        console.warn('Could not persist other projects view preference:', error);
    }
}

function loadOtherProjectsPreference() {
    let showOther = false;
    try {
        showOther = localStorage.getItem('other-projects-view') === 'true';
    } catch (error) {
        console.warn('Could not read other projects view preference:', error);
    }

    const defaultView = document.getElementById('default-projects-view');
    const otherView = document.getElementById('other-projects-view');
    const toggleButton = document.getElementById('other-projects-toggle');
    const thumbLabel = document.getElementById('other-projects-thumb-label');
    const titleEl = document.getElementById('app-title');
    if (!defaultView || !otherView) return;

    defaultView.style.display = showOther ? 'none' : '';
    otherView.style.display = showOther ? '' : 'none';

    if (toggleButton) {
        toggleButton.setAttribute('aria-pressed', showOther);
        toggleButton.setAttribute('aria-label', showOther ? 'Switch back to your projects' : 'Switch to other projects');
    }
    if (thumbLabel) thumbLabel.innerHTML = showOther
        ? '<i class="fas fa-check" aria-hidden="true"></i>'
        : '<i class="fas fa-house" aria-hidden="true"></i>';
    setTitleText(titleEl, showOther ? 'OTHER_PROJECTS' : 'APPSYSTEM_PRO');
}

document.addEventListener('DOMContentLoaded', () => {
    loadOtherProjectsPreference();
    initListItems();
    initTitleHoverColor();
});
