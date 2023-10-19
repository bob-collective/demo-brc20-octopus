import { Layout } from "./components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Transfer from "./pages/Transfer/Transfer";
import Inscription from "./pages/Inscription/Inscription";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Transfer />} path="/transfer" />
          <Route element={<Inscription />} path="/inscription/:id" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
