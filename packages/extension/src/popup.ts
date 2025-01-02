import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { App } from './popup/App'

const root = createRoot(document.getElementById('root')!)

root.render(createElement(App))
