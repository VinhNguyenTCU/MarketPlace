import BadgeMUI, { type BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const BrandBadge = styled(BadgeMUI)(({ theme }) => ({
  // optional: keep it empty if you only care about defaults
  "& .MuiBadge-badge": {
    fontWeight: 600,
    minWidth: theme.spacing(2),
    height: theme.spacing(2),
    padding: theme.spacing(0, 0.75),
  },
}));

export function Badge({ anchorOrigin, ...props }: BadgeProps) {
  return (
    <BrandBadge
      {...props}
      anchorOrigin={
        anchorOrigin ?? { vertical: "top", horizontal: "right" }
      }
    />
  );
}
