import "bulma/css/bulma.css"
import "simple-line-icons/scss/simple-line-icons.scss"
import { Routes, Route } from "react-router-dom"

import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import Disclaimer from "./Disclaimer"
import Cover from "./Cover"
import Article from "./Articles"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Main />} />
        <Route path="covers" element={<Cover />} />
        <Route path="articles" element={<Article />} />
        <Route path="disclaimer" element={<Disclaimer />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
