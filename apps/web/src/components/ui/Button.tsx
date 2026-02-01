import ButtonMUI, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

type ButtonProps = MuiButtonProps;

const BrandButton = styled(ButtonMUI, {
  name: "BrandButton",
  slot: "Root",
})<MuiButtonProps>(({ theme, variant = "contained" }) => ({
  // Base styles
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),

  // Variant styles
  ...(variant === "contained" && {
    backgroundColor: theme.palette.primary.main,
    "&:hover": { backgroundColor: theme.palette.primary.dark },
  }),

  ...(variant === "outlined" && {
    borderWidth: 2,
    "&:hover": { borderWidth: 2 },
  }),

  ...(variant === "text" && {
    "&:hover": { backgroundColor: theme.palette.action.hover },
  }),
}));

export function Button({ variant = "contained", ...props }: ButtonProps) {
  return <BrandButton variant={variant} {...props} />;
}
