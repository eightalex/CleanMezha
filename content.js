function updateThemeStorage(e) {
    const theme = e.matches ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.querySelector('html').dataset.theme = theme;
}

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

updateThemeStorage(darkMediaQuery);

darkMediaQuery.addEventListener('change', updateThemeStorage);

function toggleAds(hide) {
    const adSelectors = [
        '.nts-ad',
        '.advtext',
    ];
    adSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.setProperty('display', hide ? 'none' : '', 'important');
        });
    });
}

chrome.storage.sync.get(['hideAds'], (result) => {
    toggleAds(!!result.hideAds);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.hideAds) {
        toggleAds(changes.hideAds.newValue);
    }
});
