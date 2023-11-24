import { Layout } from "./components";
import Inscriptions from "./components/Inscriptions/Inscriptions";
import { useBtcSnap } from "./hooks/useBtcSnap";
import { useGetInscriptionIds } from "./hooks/useGetInscriptionIds";
import "./utils/yup.custom";

const App = () => {
  const { bitcoinAddress } = useBtcSnap();
  const { data: inscriptionIds } = useGetInscriptionIds(bitcoinAddress);

  return (
    <Layout>
      {inscriptionIds?.length && (
        <Inscriptions inscriptionIds={inscriptionIds} />
      )}
    </Layout>
  );
};

export default App;
