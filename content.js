function updateThemeStorage(e) {
    const theme = e.matches ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.querySelector('html').dataset.theme = theme;
}

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

updateThemeStorage(darkMediaQuery);

darkMediaQuery.addEventListener('change', updateThemeStorage);
