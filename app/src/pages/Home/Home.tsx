import { Card, ColumnProps, H2, Table } from "@interlay/ui";
import { useGetBrc20List } from "../../hooks/useGetBrc20List";
import { StyledWrapper } from "./Home.style";

function Home() {
  const { data: list } = useGetBrc20List();

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
      <H2>BRC-20 Market</H2>
      <Card>
        <Table columns={columns} rows={rows} />
      </Card>
    </StyledWrapper>
  );
}

export default Home;
