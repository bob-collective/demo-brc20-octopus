import { theme } from "@interlay/theme";
import { CTA, Flex, List } from "@interlay/ui";
import styled from "styled-components";

const StyledHeader = styled(Flex)`
  padding: 0 ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up("md")} {
    padding: 0 ${theme.spacing.spacing12};
  }

  min-height: 55px;
`;

const StyledFooter = styled(Flex)`
  padding: 0 ${theme.spacing.spacing4};

  @media ${theme.breakpoints.up("md")} {
    padding: 0 ${theme.spacing.spacing12};
  }

  min-height: 55px;
`;

const StyledList = styled(List)`
  display: inline;
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

const StyledOrdinalsList = styled(Flex)`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const CTAWrapper = styled(Flex)`
  gap: ${theme.spacing.spacing2};
  cursor: grab;
`;

const StyledWrapper = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  height: 100%;
  padding: ${theme.spacing.spacing4};
  background-color: ${theme.colors.bgPrimary} !important;
  margin: ${theme.spacing.spacing1} !important;
  border-radius: ${theme.rounded.lg} !important;
  border: ${theme.border.default};
  overflow: auto;
`;

const StyledContent = styled.div`
  overflow: hidden;
`;

const StyledCTA = styled(CTA)`
  &:hover {
    cursor: pointer;
  }
`;

const StyledLogo = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StyledIFrameWrapper = styled(Flex)`
  position: relative;
`;

export {
  CTAWrapper,
  StyledCTA,
  StyledHeader,
  StyledFooter,
  StyledLogo,
  StyledMain,
  StyledWrapper,
  StyledOrdinalsList,
  StyledIFrameWrapper,
  StyledContent,
  StyledList,
};
