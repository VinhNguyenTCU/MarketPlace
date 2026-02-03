import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

import { Button } from "../ui/Button";
import { SearchInput } from "../ui/SearchInput";
import logo from "../../assets/tcu_logo.png";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
];

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

const SearchSlot = styled(Box)(() => ({
  flex: "1 1 auto",
  minWidth: 0,
  borderRadius: 999,
}));

const Right = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
}));

const Group = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const Spacer = styled(Box)(({ theme }) => ({
  width: 12,
  [theme.breakpoints.up("md")]: {
    width: 20,
  },
}));

const SearchButton = styled(Button)(() => ({
  height: 40,
}));

const SignInButton = styled(Button)(({ theme }) => ({
  height: 40,
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.light,

  "&:hover": {
    backgroundColor: theme.palette.grey[200],
    borderColor: theme.palette.primary.main,
  },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  height: 40,
  backgroundColor: theme.palette.primary.light,

  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export function Navbar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <Header>
      <NavContainer maxWidth={false} disableGutters>
        <Row>
          <Logo src={logo} alt="TCU Marketplace" />

          <SearchSlot>
            <SearchInput
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              categories={CATEGORIES}
            />
          </SearchSlot>

          <Right>
            <Group>
              <SearchButton color="primary">Search</SearchButton>
            </Group>

            <Spacer />

            <Group>
              <Link to="/sign-in">
                <SignInButton variant="outlined">Sign In</SignInButton>
              </Link>
              <Link to="/sign-up">
                <SignUpButton>Sign Up</SignUpButton>
              </Link>
            </Group>
          </Right>
        </Row>
      </NavContainer>
    </Header>
  );
}
