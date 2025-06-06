function updateThemeStorage(e) {
    const theme = e.matches ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.querySelector('html').dataset.theme = theme;
}

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

updateThemeStorage(darkMediaQuery);

darkMediaQuery.addEventListener('change', updateThemeStorage);

chrome.storage.sync.get(['hideAds', 'hideOboronka'], (result) => {
    toggleAds(!!result.hideAds);
    toggleArticlesByLinks(!!result.hideOboronka, 'oboronka');
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.hideAds) {
        toggleAds(changes.hideAds.newValue);
    }
    if (area === 'sync' && changes.hideOboronka) {
        toggleArticlesByLinks(changes.hideOboronka.newValue, 'oboronka');
    }
});

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

function toggleArticlesByLinks(hide, wildcard) {
    document.querySelectorAll('.article').forEach(article => {
        const links = article.querySelectorAll(`a[href*="${wildcard}"]`);
        if (links.length > 0) {
            article.style.setProperty('display', hide ? 'none' : '', 'important');
        }
    });
}
