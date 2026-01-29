import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const FOOTER_SECTIONS = [
  {
    title: "Buy",
    links: ["Registration", "Bidding & Buying Help", "Stores", "Creator Collections", "Charity"],
  },
  {
    title: "Sell",
    links: ["Start selling", "How to sell", "Business sellers"],
  },
  {
    title: "About Us",
    links: ["About TCU Market Place", "About TCU University", "Impact", "Advertise with us", "Policies"],
  },
  {
    title: "Help & Contact",
    links: ["Seller Center", "Contact Us", "TCU Market Place Returns"],
  },
];

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 6,
        mt: 10,
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, md: 30 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
          }}
        >
          {FOOTER_SECTIONS.map((section) => (
            <Box key={section.title}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
                {section.title}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {section.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="hover"
                    sx={{
                      fontSize: 14,
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
