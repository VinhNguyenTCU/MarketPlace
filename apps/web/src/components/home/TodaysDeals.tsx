import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ProductCard } from "./ProductCard";
import type { ProductItem } from "./ProductCard";

const mockDeals: ProductItem[] = [
  { id: 1, price: "1099 US $", title: "Iphone 17 promax brand new", location: "Fort Worth, TX", image: "https://placehold.co/180x150?text=iPhone" },
  { id: 2, price: "125 US $", title: "Timberlands", location: "Desoto, TX", image: "https://placehold.co/180x150?text=Boots" },
  { id: 3, price: "100 US $", title: "Ozone RS 3000 roadbike", location: "Dallas, TX", image: "https://placehold.co/180x150?text=Bike" },
  { id: 4, price: "400 US $", title: "Gaming PC with Asus Monitor", location: "Fort Worth, TX", image: "https://placehold.co/180x150?text=PC" },
  { id: 5, price: "15 US $", title: "Adjustable Table/Desk", location: "Fort Worth, TX", image: "https://placehold.co/180x150?text=Desk" },
];

export function TodaysDeals() {
  return (
    <Box>
      <Typography fontWeight={700} fontSize={18} mb={1.5}>
        Today's Deals
      </Typography>

      <Box sx={{ position: "relative", display: "flex", alignItems: "center", px: 3 }}>
        {/* Left Arrow */}
        <IconButton
          size="small"
          sx={{
            position: "absolute", left: -8, zIndex: 1,
            bgcolor: "white", boxShadow: 2,
            border: "1px solid", borderColor: "grey.200",
            width: 32, height: 32,
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
        </IconButton>

        {/* Cards Row */}
        <Box sx={{
          display: "flex", gap: 2, overflowX: "auto", pb: 1, width: "100%",
          "&::-webkit-scrollbar": { display: "none" }
        }}>
          {mockDeals.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          size="small"
          sx={{
            position: "absolute", right: -8, zIndex: 1,
            bgcolor: "white", boxShadow: 2,
            border: "1px solid", borderColor: "grey.200",
            width: 32, height: 32,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
