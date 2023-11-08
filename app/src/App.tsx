import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components";
import Inscribe from "./pages/Inscribe/Inscribe";
import Inscriptions from "./pages/Inscriptions/Inscriptions";
import Inscription from "./pages/Inscription/Inscription";
import "./utils/yup.custom";
import { useMetamask } from "./hooks/useMetamask";
import Transfer from "./pages/Transfer/Transfer";

function App() {
  const { connect, evmAccount, bitcoinAddress } = useMetamask();

  return (
    <BrowserRouter>
      <Layout
        connect={connect}
        evmAccount={evmAccount}
        bitcoinAddress={bitcoinAddress}
      >
        <Routes>
          <Route element={<Inscribe />} path="/inscribe" />
          <Route element={<Transfer />} path="/transfer" />
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
