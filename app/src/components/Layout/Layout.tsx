import { Flex } from "@interlay/ui";
import { HTMLAttributes, useState } from "react";
import { Header } from "./Header";
import {
  StyledClose,
  StyledDrawer,
  StyledMain,
  StyledRelative,
} from "./Layout.styles";
import "react-modern-drawer/dist/index.css";

const Layout = (props: HTMLAttributes<unknown>) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Flex direction="column">
        <Header onClickAccount={() => setOpen(true)} />
        <StyledMain direction="column" {...props} />
      </Flex>
      <StyledDrawer
        enableOverlay={false}
        open={isOpen}
        onClose={() => setOpen(false)}
        direction="right"
      >
        <StyledRelative>
          <StyledClose onClick={() => setOpen(false)}>-</StyledClose>
        </StyledRelative>
        <div>Hello World</div>
      </StyledDrawer>{" "}
    </>
  );
};

export { Layout };
