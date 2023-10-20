import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Inscribe.style";
import { TextForm } from "./components";

function Inscribe() {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="Text" key="text">
            <TextForm />
          </TabsItem>
          <TabsItem title="BRC-20" key="brc20">
            BRC-20
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
}

export default Inscribe;
