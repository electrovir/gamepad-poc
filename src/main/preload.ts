// preload.js

// originally from https://github.com/electron/electron/blob/v13.1.7/docs/fiddles/quick-start/preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const electronTable = document.querySelector('.versions.electron-only-data');
    if (!(electronTable instanceof HTMLElement)) {
        throw new Error(`Couldn't find electron data table`);
    }
    electronTable.style.display = '';

    function insertVersion(selector: string, text: string) {
        const versionElement = document.querySelector(selector);
        if (!(versionElement instanceof HTMLElement)) {
            throw new Error(`${selector} not found`);
        }
        versionElement.innerText = text;
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        insertVersion(`#${dependency}-version`, process.versions[dependency] ?? '');
    }
});
