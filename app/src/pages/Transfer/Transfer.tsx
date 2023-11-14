import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Transfer.style";
import { TransferBtcForm } from "./components";
import { TransferOrdForm } from "./components/TransferOrdForm";

function Transfer() {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="BTC" key="btc">
            <TransferBtcForm />
          </TabsItem>
          <TabsItem title="Ordinal" key="ord">
            <TransferOrdForm />
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
}

export default Transfer;
