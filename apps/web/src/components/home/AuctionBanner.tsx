import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export function AuctionBanner() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #4B0082 0%, #7B2FBE 100%)",
        borderRadius: 3,
        p: 3,
        color: "white",
        width: "100%",
      }}
    >
      <Typography fontWeight={700} fontSize={20} mb={0.5}>
        TCU Market Place Auction Hub
      </Typography>
      <Typography fontSize={13} mb={2}>
        Join here to bid with other people!
      </Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: "white",
          color: "#4B0082",
          fontWeight: 700,
          borderRadius: 2,
          textTransform: "none",
          "&:hover": { bgcolor: "#f3e8ff" },
        }}
      >
        Bid Now
      </Button>
    </Box>
  );
}
