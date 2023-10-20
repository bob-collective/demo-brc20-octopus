import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Transfer.style";
import { TransferBtcForm } from "./components";
import { TransferBrc20Form } from "./components/TransferBrc20Form";

function Transfer() {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="BTC" key="btc">
            <TransferBtcForm />
          </TabsItem>
          <TabsItem title="BRC-20" key="brc20">
            <TransferBrc20Form />
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
}

export default Transfer;
