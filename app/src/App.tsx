import { Layout } from "./components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Transfer from "./pages/Transfer/Transfer";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Transfer />} path="/transfer" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
