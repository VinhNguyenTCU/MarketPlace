import Box from "@mui/material/Box";
import { Card } from "../ui/Card";

export function RecommendedSection() {
  return (
    <Box sx={{
      display: "flex", gap: 2, overflowX: "auto", px: 3,
      "&::-webkit-scrollbar": { display: "none" }
    }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} sx={{ width: 180, height: 150, flexShrink: 0, bgcolor: "grey.100" }} />
      ))}
    </Box>
  );
}
