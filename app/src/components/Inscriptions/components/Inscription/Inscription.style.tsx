import { theme } from "@interlay/theme";
import { Flex } from "@interlay/ui";
import styled from "styled-components";

const StyledWrapper = styled(Flex)`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const InscribedText = styled(Flex)`
  background-color: black;
  font-family: monospace;
  font-size: 1.5rem;
  padding: ${theme.spacing.spacing4};
`;

const InscribedImage = styled("img")`
  max-width: 100%;
`;

export { InscribedImage, InscribedText, StyledWrapper };
