import { theme } from "@interlay/theme";
import { Flex } from "@interlay/ui";
import styled from "styled-components";

const StyledWrapper = styled(Flex)`
  max-width: ${theme.breakpoints.values.md}px;
  width: 100%;
  margin: 0 auto;
`;

export { StyledWrapper };
