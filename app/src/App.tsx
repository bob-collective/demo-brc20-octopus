import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import Inscribe from "./pages/Inscribe/Inscribe";
import Inscriptions from "./pages/Inscriptions/Inscriptions";
import Inscription from "./pages/Inscription/Inscription";
import "./utils/yup.custom";
import { useConnectMetamask } from "./hooks/useConnectMetamask";

function App() {
  const { connect, evmAccount, bitcoinAddress } = useConnectMetamask();
  return (
    <BrowserRouter>
      <Layout
        connect={connect}
        evmAccount={evmAccount}
        bitcoinAddress={bitcoinAddress}
      >
        <Routes>
          <Route element={<Inscribe />} path="/inscribe" />
          <Route
            element={<Inscriptions bitcoinAddress={bitcoinAddress} />}
            path="/"
          />
          <Route element={<Inscription />} path="/inscription/:id" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
