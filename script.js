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
    const links = document.querySelectorAll('.detail-button');
    let blockedCount = 0;
    links.forEach(link => {
        const opened = window.open(link.href, '_blank', 'noopener,noreferrer');
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
    if (thumbLabel) thumbLabel.textContent = isDark ? 'D' : 'L';
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
        if (thumbLabel) thumbLabel.textContent = isDark ? 'D' : 'L';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    initListItems();
});
