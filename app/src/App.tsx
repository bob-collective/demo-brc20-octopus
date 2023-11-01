import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import Inscribe from "./pages/Inscribe/Inscribe";
import Inscriptions from "./pages/Inscriptions/Inscriptions";
import Inscription from "./pages/Inscription/Inscription";
import "./utils/yup.custom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Inscribe />} path="/inscribe" />
          <Route element={<Inscriptions />} path="/" />
          <Route element={<Inscription />} path="/inscription/:id" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
