import { Layout } from "./components";
import Inscriptions from "./components/Inscriptions/Inscriptions";
import "./utils/yup.custom";

const App = () => {
  return (
    <Layout>
      <Inscriptions />
    </Layout>
  );
};

export default App;
