import { theme } from "@interlay/theme";
import { Flex } from "@interlay/ui";
import { Button } from "react-aria-components";
import styled from "styled-components";

const StyledWrapper = styled(Flex)`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

const StyledSelectFile = styled(Button)`
  color: ${theme.tabs.color};
  padding: ${theme.spacing.spacing2};
`;

export { StyledWrapper, StyledSelectFile };
