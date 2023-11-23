import { Flex } from "@interlay/ui";
import "react-modern-drawer/dist/index.css";
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
