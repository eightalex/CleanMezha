const toggleAds = document.getElementById('ads-toggle');
const toggleOboronka = document.getElementById('oboronka-toggle');

chrome.storage.sync.get(['hideAds', 'hideOboronka'], (result) => {
    toggleAds.checked = !!result.hideAds;
    toggleOboronka.checked = !!result.hideOboronka;
});

toggleAds.addEventListener('change', () => {
    chrome.storage.sync.set({
        hideAds: toggleAds.checked,
    });
});

toggleOboronka.addEventListener('change', () => {
    chrome.storage.sync.set({
        hideOboronka: toggleOboronka.checked,
    });
});
