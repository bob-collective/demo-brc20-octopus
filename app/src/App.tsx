import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import Inscribe from "./pages/Inscribe/Inscribe";
import Inscription from "./pages/Inscription/Inscription";
import Transfer from "./pages/Transfer/Transfer";
import "./utils/yup.custom";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Inscribe />} path="/inscribe" />
          <Route element={<Transfer />} path="/transfer" />
          <Route element={<Inscription />} path="/inscription/:id" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
