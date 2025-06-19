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

async function fetchReactions(articleUrl, identifier) {
    const params = new URLSearchParams({
        base: 'default',
        f: 'mezha-media',
        't_i': identifier,
        't_u': articleUrl,
        's_o': 'popular'
    });
    const embedUrl = `https://disqus.com/embed/comments/?${params.toString()}`;
    try {
        const res = await fetch(embedUrl);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.querySelector('#reactions');
    } catch (e) {
        console.error('Failed to fetch reactions', e);
        return null;
    }
}

function insertReactions(article, reactions) {
    if (!reactions) return;
    const clone = reactions.cloneNode(true);
    clone.style.marginTop = '10px';
    const target = article.querySelector('.article_date') || article;
    target.parentNode.insertBefore(clone, target.nextSibling);
}

function loadReactionsForArticles() {
    document.querySelectorAll('.article').forEach(article => {
        const link = article.querySelector('.article_title a');
        const count = article.querySelector('.disqus-comment-count');
        if (link && count && count.dataset.disqusIdentifier) {
            fetchReactions(link.href, count.dataset.disqusIdentifier)
                .then(reactions => insertReactions(article, reactions));
        }
    });
}

loadReactionsForArticles();
