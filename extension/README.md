# Undertone browser companion

1. Download and unzip the extension archive from the studio, or use this folder directly.
2. In Chrome open `chrome://extensions` (Edge: `edge://extensions`), enable Developer mode, and click **Load unpacked**.
3. Select the directory containing `manifest.json`.
4. Open the extension, enter your Fish Audio API key, and save settings.
5. Select text on a normal webpage. Use **Capture text**, or right-click to listen or open the selection in your voice studio.

The studio URL is configurable. For local development use `http://localhost:3000/studio` or your local studio URL. The packaged ZIP defaults to the deployment’s /studio URL. On a private studio, sign in first before sending selections.

API keys use `chrome.storage.session` while connected. Remember key on this device also saves an unencrypted copy in `chrome.storage.local`, restricted to trusted extension contexts, so it survives browser restarts. Turn it off on shared devices. Disconnect removes both copies. Requests send the key directly to `https://api.fish.audio`. The key is never included in studio URLs. Only explicit selections are read. Source URLs have query strings and fragments removed. There is no history permission, persistent page injection, or access to all websites.

Chrome/Edge 124+ is required. Browser internal pages, protected pages, and some PDF viewers do not allow selection capture; paste text into the popup instead. Session-only keys must be entered again when the browser session ends. The popup theme follows your system initially and remembers your light/dark choice.

The ZIP is a developer installation package, not a Chrome Web Store publication. Store distribution requires the owner's submission and review.

## Translation · 0.2.0-beta.1

Right-click selected text and choose **Translate selection with Undertone**, or click **Translate** in the popup. Review and edit in the persistent side panel, then listen or open the translation in the studio. No Fish key is required until listening. Translation requires a supported desktop browser/device and language pair; the existing Chrome/Edge 124+ minimum alone does not guarantee it. Language resources download on first use; click **Prepare & translate** when requested. Choose a source language for short/ambiguous passages. No cloud translation fallback is used.

The panel saves drafts in session storage, retains the last target locally, and preserves a draft when another selection is captured. Translation is local; speech uses Fish Audio credit. Source and translated text are limited to 20,000 characters each. Studio handoff is Unicode-safe, bounded, excludes keys, and strips source URL query strings/fragments.

Reload the updated unpacked extension after replacing its files. Version 0.2.0 adds only the **sidePanel** permission; existing Fish Audio host access remains unchanged.
