import { P } from "@interlay/ui";
import { theme } from "@interlay/theme";
import styled from "styled-components";

// TODO: Move badge component to UI library
const StyledBadge = styled(P)`
  color: ${theme.tabs.color};
  border-radius: ${theme.rounded.md};
  padding: ${theme.spacing.spacing1};
`;

export { StyledBadge };
