import {
  Card,
  ColumnProps,
  Flex,
  H2,
  LoadingSpinner,
  Table,
  Tabs,
  TabsItem,
} from "@interlay/ui";
import { Key } from "react";
import { useGetBrc20List } from "../../hooks/useGetBrc20List";
import { StyledWrapper } from "./Home.style";

function Home() {
  const { data: list, type, setType, isLoading } = useGetBrc20List();

  const columns: ColumnProps[] = [
    { id: "index", name: "#" },
    { id: "coin", name: "Coin" },
    { id: "supply", name: "Supply" },
  ];

  const rows =
    list?.detail.map((item, idx) => ({
      id: item.ticker,
      index: idx,
      coin: item.ticker,
      supply: Intl.NumberFormat("en-US").format(Number(item.max)),
    })) || [];

  return (
    <StyledWrapper direction="column" gap="spacing4">
      <H2 align="center">Market</H2>
      <Tabs
        selectedKey={type}
        onSelectionChange={(key: Key) => setType(key as typeof type)}
      >
        <TabsItem key="all" title="All">
          {""}
        </TabsItem>
        <TabsItem key="in-progress" title="In progress">
          {""}
        </TabsItem>
        <TabsItem key="completed" title="Complete">
          {""}
        </TabsItem>
      </Tabs>
      {rows.length > 0 && !isLoading ? (
        <Card>
          <Table columns={columns} rows={rows} />
        </Card>
      ) : (
        <Flex
          style={{ minHeight: 200 }}
          alignItems="center"
          justifyContent="center"
        >
          <LoadingSpinner
            color="secondary"
            variant="indeterminate"
            diameter={36}
            thickness={4}
          />
        </Flex>
      )}
    </StyledWrapper>
  );
}

export default Home;
