import { Card, H2 } from "@interlay/ui";
import { StyledWrapper } from "./Transfer.style";

function Transfer() {
  return (
    <StyledWrapper direction="column" gap="spacing4">
      <Card>
        <H2 size="lg">Transfer</H2>
      </Card>
    </StyledWrapper>
  );
}

export default Transfer;
