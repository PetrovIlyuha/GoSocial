import React from "react"
import ReactDOM from "react-dom"
import "semantic-ui-css/semantic.min.css"
import "react-toastify/dist/ReactToastify.min.css"
import "react-calendar/dist/Calendar.css"
import App from "./app/layout/App.jsx"
import * as serviceWorker from "./serviceWorker"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { configureStore } from "./app/store/configureStore"
import ScrollToTop from "./app/layout/ScrollToTop"

import "./app/layout/styles.css"

const rootEl = document.getElementById("root")

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </Provider>,
  rootEl
)

serviceWorker.unregister()
