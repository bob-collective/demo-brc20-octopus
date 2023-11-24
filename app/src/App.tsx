import { H2, P } from "@interlay/ui";
import { Layout } from "./components";
import { Inscriptions } from "./components/Inscriptions/Inscriptions";
import { useBtcSnap } from "./hooks/useBtcSnap";
import { useGetInscriptionIds } from "./hooks/useGetInscriptionIds";
import { StyledOrdinalsList } from "./components/Layout/Layout.styles";
import "./utils/yup.custom";

const App = () => {
  const { bitcoinAddress } = useBtcSnap();
  const { data: inscriptionIds } = useGetInscriptionIds(bitcoinAddress);

  return (
    <Layout>
      <StyledOrdinalsList gap="spacing4" direction="column">
        <H2>Ordinals portfolio</H2>
        {inscriptionIds?.length ? (
          <Inscriptions inscriptionIds={inscriptionIds} />
        ) : (
          <P>No ordinals yet</P>
        )}
      </StyledOrdinalsList>
    </Layout>
  );
};

export default App;
