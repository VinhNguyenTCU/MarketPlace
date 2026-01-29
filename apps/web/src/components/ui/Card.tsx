import CardMUI, { type CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const BrandCard = styled(CardMUI)(({ theme }) => ({
  borderRadius: 16,
  border: "1px solid",
  borderColor: theme.palette.grey[200],
}));

export function Card(props: CardProps) {
  return <BrandCard {...props} />;
}
