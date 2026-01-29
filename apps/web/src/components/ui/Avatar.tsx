import AvatarMUI, { type AvatarProps } from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

const BrandAvatar = styled(AvatarMUI)({
  width: 36,
  height: 36,
})

export function Avator(props: AvatarProps) {
  return <BrandAvatar {...props} />;
}
