import { Card, Flex, H2, P } from "@interlay/ui";
import { Layout } from "./components";
import { useErc20Balances } from "./hooks/useErc20Balances";

function App() {
  const balances = useErc20Balances();

  return (
    <Layout>
      {balances.data ? (
        <Flex gap="spacing4" direction="column">
          <H2 size="xl2">Balances</H2>
          <Card>
            <Flex direction="column">
              {Object.entries(balances.data || {}).map(([ticker, amount]) => (
                <Flex key={ticker}>
                  {ticker} {amount}
                </Flex>
              ))}
            </Flex>
          </Card>
        </Flex>
      ) : (
        <P>No Balance</P>
      )}
    </Layout>
  );
}

export default App;
