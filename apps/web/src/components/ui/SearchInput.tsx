import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  categories: { value: string; label: string }[];
  placeholder?: string;
};

const SearchField = styled(OutlinedInput)(({ theme }) => ({
  height: 40,
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.light,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.light,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.light,
    borderWidth: 2,
  },
  "& input::placeholder": { color: theme.palette.text.secondary, opacity: 1 },
}));

const SearchIconBtn = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const EndAdornment = styled(InputAdornment)(() => ({ padding: 0 }));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const CategoryPill = styled(Select)(({ theme }) => ({
  backgroundColor:
    (theme as any).palette.custom?.categoryPill?.bg ?? "transparent",
  color:
    (theme as any).palette.custom?.categoryPill?.text ??
    theme.palette.text.primary,
  "&:hover": {
    backgroundColor:
      (theme as any).palette.custom?.categoryPill?.bgHover ??
      (theme as any).palette.custom?.categoryPill?.bg ??
      "transparent",
  },
  "& .MuiSvgIcon-root": {
    color:
      (theme as any).palette.custom?.categoryPill?.icon ??
      theme.palette.text.secondary,
  },
}));
export function SearchInput({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  placeholder = "Search",
}: Props) {
  return (
    <SearchField
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder={placeholder}
      fullWidth
      startAdornment={
        <InputAdornment position="start">
          {" "}
          <SearchIconBtn edge="start" aria-label="search">
            {" "}
            <SearchIcon />{" "}
          </SearchIconBtn>{" "}
        </InputAdornment>
      }
      endAdornment={
        <EndAdornment position="end">
          {" "}
          <VerticalDivider orientation="vertical" flexItem />{" "}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {" "}
            <CategoryPill
              value={category}
              onChange={(e) => onCategoryChange(String(e.target.value))}
              size="small"
              variant="standard"
              disableUnderline
            >
              {" "}
              {categories.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {" "}
                  {c.label}{" "}
                </MenuItem>
              ))}{" "}
            </CategoryPill>{" "}
          </Box>{" "}
        </EndAdornment>
      }
    />
  );
}
