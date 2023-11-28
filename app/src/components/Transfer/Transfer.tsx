import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Transfer.style";
import { TransferBtcForm } from "./components";

type Props = {
  onSuccess: () => void;
};

const Transfer = ({ onSuccess }: Props) => {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="BTC" key="btc">
            <TransferBtcForm onSuccess={onSuccess} />
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
};

export default Transfer;
