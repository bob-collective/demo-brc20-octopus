import { Card, Tabs, TabsItem } from "@interlay/ui";
import { StyledWrapper } from "./Inscribe.style";
import { TextForm } from "./components";

type Props = {
  onSuccess: () => void;
};

function Inscribe({ onSuccess }: Props) {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <Tabs size="large" fullWidth>
          <TabsItem title="Text" key="text">
            <TextForm onSuccess={onSuccess} />
          </TabsItem>
        </Tabs>
      </Card>
    </StyledWrapper>
  );
}

export default Inscribe;
