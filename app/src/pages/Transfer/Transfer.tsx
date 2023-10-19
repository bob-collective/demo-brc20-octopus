import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Transfer.style";

function Transfer() {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="BTC" key="btc">
            BTC
          </TabsItem>
          <TabsItem title="BRC-20" key="brc20">
            BRC-20
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
}

export default Transfer;
