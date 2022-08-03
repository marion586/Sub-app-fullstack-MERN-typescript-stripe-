import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Nav/Nav";
import Articles from "./Pages/Arctiles/Articles";
import ArticlesPlan from "./Pages/ArticlesPlan/ArticlesPlan";
import LandingPage from "./Pages/LandingPage/LandingPage";
import { ProtectedRoute } from "./Routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/articles" element={<ProtectedRoute />}>
          <Route path="/articles" element={<Articles />} />
        </Route>
        <Route path="/articles-plans" element={<ProtectedRoute />}>
          <Route path="/articles-plans" element={<ArticlesPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
