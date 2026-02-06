import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

import logo from "../../assets/tcu_logo.png";
import { Link } from "react-router-dom";

const Header = styled("header")(({ theme }) => ({
  width: "100%",
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  background: `linear-gradient(90deg, ${theme.custom.hero.from}, ${theme.custom.hero.to})`,
}));

const NavContainer = styled(Container)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const Row = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
}));

const Logo = styled("img")(() => ({
  height: 40,
  width: "auto",
  cursor: "pointer",
  display: "block",
  flexShrink: 0,
}));

export function AuthNavbar() {
  return (
    <Header>
      <NavContainer maxWidth={false} disableGutters>
        <Row>
          <Link to="/">
            <Logo src={logo} alt="TCU Marketplace" />
          </Link>
        </Row>
      </NavContainer>
    </Header>
  );
}