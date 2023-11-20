import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import Inscriptions from "./pages/Inscriptions/Inscriptions";
import "./utils/yup.custom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Inscriptions />} path="/" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
