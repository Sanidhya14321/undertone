# Undertone browser companion

1. Download and unzip the extension archive from the studio, or use this folder directly.
2. In Chrome open `chrome://extensions` (Edge: `edge://extensions`), enable Developer mode, and click **Load unpacked**.
3. Select the directory containing `manifest.json`.
4. Open the extension, enter your Fish Audio API key, and save settings.
5. Select text on a normal webpage. Use **Capture text**, or right-click to listen or open the selection in your voice studio.

The studio URL is configurable. For local development use `http://localhost:3000/studio` or your local studio URL. The packaged ZIP defaults to the deployment’s /studio URL. On a private studio, sign in first before sending selections.

API keys live in `chrome.storage.session`, not permanent local storage, and are sent directly to `https://api.fish.audio`. You must reconnect after the browser session ends. The key is never included in studio URLs. Only explicit selections are read. Source URLs have query strings and fragments removed. There is no history permission, persistent page injection, or access to all websites.

Chrome/Edge 124+ is required. Browser internal pages, protected pages, and some PDF viewers do not allow selection capture; paste text into the popup instead. Reloading or disabling an unpacked extension can clear its session storage.

The ZIP is a developer installation package, not a Chrome Web Store publication. Store distribution requires the owner's submission and review.
