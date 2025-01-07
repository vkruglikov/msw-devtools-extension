![Private](https://img.shields.io/badge/status-private-red?)

## Start dev server

```bash
npm run dev
```

Open: http://localhost:8082/popup.html

## Upload unpacked extension

1. **Open the Extensions Settings in Chrome**:

   - Click on the menu (three dots in the top-right corner of the browser).
   - Select **"More tools" → "Extensions"**.
   - Or type the following into the address bar:
     ```text
     chrome://extensions/
     ```

2. **Enable Developer Mode**:

   - Toggle the **"Developer mode"** switch in the top-right corner of the page.

3. **Load the Unpacked Extension**:

   - [Download](https://github.com/vkruglikov/msw-devtools-extension/releases/tag/%40msw-devtools%2Fextension%40latest) the latest version of the extension or build it locally.
   - Click the **"Load unpacked"** button.
   - In the dialog that opens, select the folder `dist` containing your extension.

4. **Verify the Extension is Loaded**:
   - The extension will appear in the list of active extensions.
