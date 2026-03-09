import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TodaysDeals } from "../components/home/TodaysDeals";
import { RecommendedSection } from "../components/home/RecommendedSection";
import { AuctionBanner } from "../components/home/AuctionBanner";

export default function LandingPage() {
  return (
    <Box sx={{ px: 4, py: 3 }}>

      {/* Today's Deals */}
      <TodaysDeals />

      {/* Recommended / Placeholder row */}
      <Box mt={2}>
        <RecommendedSection />
      </Box>

      {/* TCU Bid Auction */}
      <Typography fontWeight={700} fontSize={18} mt={4} mb={0.5}>
        TCU Bid Auction
      </Typography>
      <Typography fontSize={13} color="text.secondary" mb={2}>
        Live update bid auction of items that you may like
      </Typography>
      <AuctionBanner />

    </Box>
  );
}
