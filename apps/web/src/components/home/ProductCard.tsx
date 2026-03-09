import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Card } from "../ui/Card";

export interface ProductItem {
  id: number;
  price: string;
  title: string;
  location: string;
  image: string;
}

export function ProductCard({ item }: { item: ProductItem }) {
  const [liked, setLiked] = useState(false);
  return (
    <Card sx={{ width: 180, flexShrink: 0, position: "relative", cursor: "pointer" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="150" image={item.image} alt={item.title} />
        <IconButton
          size="small"
          onClick={() => setLiked(!liked)}
          sx={{
            position: "absolute", top: 6, right: 6,
            bgcolor: "white", p: 0.5,
            boxShadow: 1,
            "&:hover": { bgcolor: "white" }
          }}
        >
          {liked ? (
            <FavoriteIcon fontSize="small" sx={{ color: "#6B21A8" }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography fontWeight={700} fontSize={14}>{item.price}</Typography>
        <Typography fontSize={13} color="text.secondary" noWrap>{item.title}</Typography>
        <Typography fontSize={12} color="text.disabled">{item.location}</Typography>
      </CardContent>
    </Card>
  );
}
