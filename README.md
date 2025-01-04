<p align="center">
  <img src="media/chrome-devtools.svg" width="100" alt="Mock Service Worker logo" />
  <img src="media/msw-logo.svg" width="100" alt="Mock Service Worker logo" />
  <img src="media/chrome-extension.svg" width="100" alt="Mock Service Worker logo" />
</p>

<h1 align="center">Mock Service Worker DevTools Extension</h1>

> **⚠️ WARNING: Pre-release Version**  
> In this pre-release version, every update clears the configuration storage!  
> Be cautious and make sure to save your JSON configurations locally to avoid losing them. 💾

### Overview

This Chrome extension simplifies working with [Mock Service Worker (MSW)](https://mswjs.io/). Instead of manually writing handlers, you can upload JSON files with mock requests, manage multiple configurations, and switch between them seamlessly. 🛠️

### Key Features 🌟

- **📂 JSON Import**: Easily upload JSON files containing mock request configurations.
- **🔄 Multi-JSON Support**: Switch seamlessly between multiple JSON configurations within the same host environment.
- **🤝 User-Friendly Interface**: A convenient tool for developers and testers alike, saving time and effort when working with [MSW](https://mswjs.io/).
- **⚡ Enhanced Productivity**: Focus more on your development and testing tasks without the hassle of manually writing mock handlers.

### Motivation 💡

This extension is a game-changer for both developers and QA testers working with [MSW](https://mswjs.io/). 🧑‍💻👩‍💻  
Instead of manually defining handlers for every request, you can now upload pre-configured JSON files, whether it's a single file or multiple files for different scenarios. Switching between configurations is quick and easy, making this tool highly efficient for various development and testing workflows. 🚀

## Get started 🚀

### Installation

```bash
npm install @msw-devtools/connect --save
```

### Integrate to existing MSW setup

> We assume that you are already familiar with MSW (Mock Service Worker) and have
> set up your project to work with it. If not, please visit the official MSW website for guidance.


Just add the response resolver handler from `@msw-devtools/connect`

```javascript
import { setupWorker } from 'msw/browser'
import { createResponseResolver } from '@msw-devtools/connect'
import { http } from 'msw'

const handlers = [
  http.all('*', createResponseResolver())
]

setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass'
})
```

### Install Chrome Extension

Install the extension from the Chrome Web Store or load the unpacked extension from the `packages/extension/dist` directory.:

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/TODO)](https://chrome.google.com/webstore/detail/TODO)