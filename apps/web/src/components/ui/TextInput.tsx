import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const TextInputRoot = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 999,
  },
});

export function TextInput(props: TextFieldProps) {
  return <TextInputRoot {...props} fullWidth variant="outlined" />;
}
