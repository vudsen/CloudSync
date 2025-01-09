import { createRoot } from 'react-dom/client'
import PopupPage from './PopupPage'

document.body.innerHTML = '<div id="app"></div>'


const root = createRoot(document.getElementById('app')!)

root.render(<PopupPage/>)
