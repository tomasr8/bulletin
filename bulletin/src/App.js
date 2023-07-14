import "bulma/css/bulma.css";
import "simple-line-icons/scss/simple-line-icons.scss";
import { Routes, Route, Link } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Look from "./Look";
import Article from "./Articles";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Main />} />
        <Route path="covers" element={<Look />} />
        <Route path="articles" element={<Article />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
