import { theme } from "@interlay/theme";
import { Flex } from "@interlay/ui";
import Drawer from "react-modern-drawer";
import styled from "styled-components";

const StyledHeader = styled(Flex)`
  padding: 0 ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up("md")} {
    padding: 0 ${theme.spacing.spacing12};
  }

  min-height: 55px;
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
  margin: ${theme.spacing.spacing1} !important;
  border-radius: ${theme.rounded.lg} !important;
  border: ${theme.border.default};
  height: calc(100vh - ${theme.spacing.spacing2}) !important;
  width: 350px !important;
`;

const StyledRelative = styled.div`
  position: relative;
  height: 100%;
  padding: ${theme.spacing.spacing4};
  /* overflow: hidden; */
`;

const StyledClose = styled.div`
  position: absolute;
  left: -46px;
  width: 38px;
  top: 0;
  bottom: 0;
  height: 100%;
  transition: background-color 250ms ease 0s, margin 250ms ease 0s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border-radius: ${theme.rounded.lg} !important;

  &:hover {
    background-color: rgba(152, 161, 192, 0.08);
    opacity: 0.6;
  }

  svg {
    margin-top: ${theme.spacing.spacing2};
  }
`;

const StyledBRC20List = styled(Flex)`
  padding-top: ${theme.spacing.spacing4};
`;

const StyledLogo = styled.a`
  display: inline-flex;
  align-items: center;
`;

const StyledNFT = styled.img`
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -moz-crisp-edges;
  image-rendering: pixelated;
`;

const StyledIFrameWrapper = styled(Flex)`
  position: relative;
`;

export {
  CTAWrapper,
  StyledBRC20List,
  StyledClose,
  StyledDrawer,
  StyledHeader,
  StyledLogo,
  StyledMain,
  StyledNFT,
  StyledRelative,
  StyledIFrameWrapper,
};
