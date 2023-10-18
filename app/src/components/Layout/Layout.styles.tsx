import { theme } from "@interlay/theme";
import { Flex } from "@interlay/ui";
import styled from "styled-components";
import Drawer from "react-modern-drawer";

const StyledHeader = styled(Flex)`
  padding: 0 ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up("md")} {
    padding: 0 ${theme.spacing.spacing12};
  }
`;

const StyledMain = styled(Flex)`
  margin: ${theme.spacing.spacing6} auto;
  width: 100%;
  padding: 0 ${theme.spacing.spacing4};
  max-width: ${theme.breakpoints.values.lg}px;

  @media ${theme.breakpoints.up("md")} {
    padding: 0 ${theme.spacing.spacing12};
  }
`;

const CTAWrapper = styled(Flex)`
  gap: ${theme.spacing.spacing2};
`;

const StyledDrawer = styled(Drawer)`
  background-color: ${theme.colors.bgPrimary} !important;
`;

const StyledRelative = styled.div`
  position: relative;
`;

const StyledClose = styled.div`
  position: absolute;
  left: -12px;
  top: 0;
  bottom: 0;
  height: 100%;
  background-color: rgba(152, 161, 192, 0.08);
  transition: background-color 250ms ease 0s, margin 250ms ease 0s;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

export {
  StyledHeader,
  StyledRelative,
  StyledMain,
  CTAWrapper,
  StyledDrawer,
  StyledClose,
};
