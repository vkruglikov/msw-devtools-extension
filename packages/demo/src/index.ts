import './msw'

import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { App } from './App'

const root = createRoot(document.getElementById('root')!)

root.render(createElement(App))
