import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './msw'

const root = createRoot(document.getElementById('root')!)

root.render(createElement(App))
