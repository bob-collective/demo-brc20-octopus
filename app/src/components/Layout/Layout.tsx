import { Flex } from "@interlay/ui";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StyledMain } from "./Layout.styles";

const Layout = ({ ...props }) => {
  return (
    <>
      <Flex direction="column">
        <Header />
        <StyledMain direction="column" {...props} />
        <Footer />
      </Flex>
    </>
  );
};

export { Layout };
