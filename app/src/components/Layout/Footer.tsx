import { Flex, Span } from "@interlay/ui";
import { StyledFooter } from "./Layout.styles";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <StyledFooter justifyContent="flex-end">
      <Flex gap="spacing4">
        <a
          href="https://docs.gobob.xyz/docs/build/examples/metamask-ordinals/"
          rel="external"
          target="_blank"
        >
          <Flex gap="spacing2">
            <Span>Docs</Span>
            <FaExternalLinkAlt color="white" size=".9em" />
          </Flex>
        </a>
        <a
          href="https://github.com/bob-collective"
          rel="external"
          target="_blank"
        >
          <Flex gap="spacing2">
            <Span>GitHub</Span>
            <FaGithub color="white" size="1.25em" />
          </Flex>
        </a>
      </Flex>
    </StyledFooter>
  );
};

export { Footer };
