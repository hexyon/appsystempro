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

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---- Letter hover colors ----
// Even hue-spacing by degree isn't the same as even *perceptual*
// spacing — human eyes are much less sensitive to hue shifts in the
// blue/purple range than in red/green, so two mathematically
// "equally spaced" hues can still read as "purple" and "light purple".
// To avoid that, colors come from a curated categorical palette
// inspired by Tableau's well-known categorical color set (Tableau
// Software, Seattle, USA) and ColorBrewer (Cynthia Brewer, Penn State
// University, USA) — both standard, widely-used US-origin references
// designed specifically so no two entries are mistakable for each
// other. Each palette entry has a light-theme version (dark/vivid
// enough to read on a light background) and a dark-theme version
// (light/bright enough to read on a dark background) of the *same*
// color family, so hue identity stays consistent when the theme is
// toggled.
const LIGHT_THEME_LETTER_COLORS = [
    '#c0392b', // red
    '#4e9a51', // green
    '#b8860b', // gold
    '#3f6fae', // blue
    '#d4661f', // orange
    '#8156a1', // purple
    '#2e8b8b', // teal
    '#b8467a', // pink
    '#7a8a3d', // olive-green
    '#a05252', // brick
    '#3d7a6e', // sea green
    '#6a5a9a', // indigo
    '#946b3d', // brown
    '#993d5a', // maroon-rose
    '#357a5b', // pine
    '#8a6b1f', // ochre
    '#b5622f', // rust
    '#3d5a99'  // navy
];
const DARK_THEME_LETTER_COLORS = [
    '#ff8a80', // red
    '#8bd88f', // green
    '#f5d76e', // gold
    '#82aaff', // blue
    '#ffab66', // orange
    '#c79ade', // purple
    '#6ed4d4', // teal
    '#f28fb8', // pink
    '#c3d68a', // olive-green
    '#e6a3a3', // brick
    '#7fd6c2', // sea green
    '#b0a3e6', // indigo
    '#d9ac72', // brown
    '#e695ab', // maroon-rose
    '#8fd6ac', // pine
    '#e6c05a', // ochre
    '#f0a56e', // rust
    '#9fb8ff'  // navy
];

function isDarkThemeActive() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
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

    listItems.forEach((item, index) => {
        // Click handler
        item.addEventListener('click', (e) => {
            if (e.target.closest('.detail-button')) return;
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) return;
            if (e.target.closest('.detail-description')) return;
            toggleListItem(item);
        });

        // Mousedown handler to allow text selection
        item.addEventListener('mousedown', (e) => {
            if (e.target.closest('.detail-description')) {
                e.stopPropagation();
            }
        });

        // Keyboard handler
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleListItem(item);
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = item.nextElementSibling;
                if (next && next.classList.contains('list-item')) next.focus();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = item.previousElementSibling;
                if (prev && prev.classList.contains('list-item')) prev.focus();
            }
        });
    });
}

function toggleListItem(item) {
    const isExpanded = item.classList.contains('expanded');

    document.querySelectorAll('.list-item.expanded').forEach(expandedItem => {
        if (expandedItem !== item) {
            expandedItem.classList.remove('expanded');
            expandedItem.setAttribute('aria-expanded', 'false');
        }
    });

    if (isExpanded) {
        item.classList.remove('expanded');
        item.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('expanded');
        item.setAttribute('aria-expanded', 'true');
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
        links = document.querySelectorAll('.other-projects-item');
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

function toggleTheme(event) {
    if (event) event.stopPropagation();
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
    }

    try {
        localStorage.setItem('theme-preference', newTheme);
    } catch (error) {
        console.warn('Could not persist theme preference:', error);
    }
    const toggleButton = document.querySelector('.toggle-switch');
    const isDark = newTheme === 'dark';
    toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleButton.setAttribute('aria-pressed', isDark);
    const thumbLabel = document.getElementById('switch-thumb-label');
    if (thumbLabel) thumbLabel.innerHTML = isDark
        ? '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
        : '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    assignUniqueLetterColors(document.getElementById('app-title'));
}

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
        ? '<i class="fas fa-globe" aria-hidden="true"></i>'
        : '<i class="fas fa-house" aria-hidden="true"></i>';
    setTitleText(titleEl, showOther ? 'Other Projects' : 'AppSystem Pro');

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
        ? '<i class="fas fa-globe" aria-hidden="true"></i>'
        : '<i class="fas fa-house" aria-hidden="true"></i>';
    setTitleText(titleEl, showOther ? 'Other Projects' : 'AppSystem Pro');
}

function loadThemePreference() {
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme-preference');
    } catch (error) {
        console.warn('Could not read theme preference:', error);
    }
    const theme = savedTheme || 'light';

    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    const toggleButton = document.querySelector('.toggle-switch');
    if (toggleButton) {
        const isDark = theme === 'dark';
        toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        toggleButton.setAttribute('aria-pressed', isDark);
        const thumbLabel = document.getElementById('switch-thumb-label');
        if (thumbLabel) thumbLabel.innerHTML = isDark
            ? '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
            : '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    loadOtherProjectsPreference();
    initListItems();
    initTitleHoverColor();
});
