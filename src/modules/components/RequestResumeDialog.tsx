import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { validateEmail } from "../../helpers/validateEmail";

export interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (didError: boolean) => void;
}

export default function RequestResumeDialog(props: ContactFormProps) {
  const { onClose, isOpen, onSubmit = () => {} } = props;

  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isPhoneNumberDirty, setIsPhoneNumberDirty] = useState(false);
  const [company, setCompany] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recaptchaResponse, setRecaptchaResponse] = useState<string | null>(
    null,
  );
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const resetRecaptcha = () => {
    recaptchaRef?.current?.reset();
    setRecaptchaResponse(null);
  };
  const onCloseInternal = () => {
    resetRecaptcha();
    onClose();
  };

  const onSend = async () => {
    try {
      const response = await fetch(
        [import.meta.env.VITE_API_ENDPOINT, "request-resume"].join("/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recaptchaResponse,
            fullName,
            email,
            phoneNumber,
            company,
            message,
          }),
        },
      );
      const parsedResponse = await response.json();
      if (!response.ok || !parsedResponse.success) {
        resetRecaptcha();
        onSubmit(true);
        return;
      }
      onSubmit(false);
    } catch (e) {
      onSubmit(true);
    }
  };
  const isValidForm =
    !!recaptchaResponse &&
    phoneNumber &&
    matchIsValidTel(phoneNumber) &&
    !!fullName &&
    validateEmail(email || "");
  return (
    <Dialog onClose={onCloseInternal} open={isOpen}>
      <DialogTitle>Request Resume</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the following form to have my resume automatically
          sent to you.
        </DialogContentText>
        <Box display="grid" my={2} gap={2} component="form">
          <TextField
            label="Full Name"
            placeholder="First Last"
            variant="filled"
            fullWidth
            required
            value={fullName || ""}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={(e) => setFullName(e.target.value || "")}
            error={fullName !== null && !fullName}
          />
          <TextField
            label="Email"
            placeholder="example@company.com"
            variant="filled"
            fullWidth
            required
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setEmail(e.target.value || "")}
            error={email !== null && !validateEmail(email)}
          />
          <MuiTelInput
            label="Phone Number"
            placeholder="000 000 0000"
            variant="filled"
            fullWidth
            defaultCountry="US"
            forceCallingCode
            focusOnSelectCountry
            preferredCountries={["US", "CA"]}
            continents={["NA"]}
            value={phoneNumber || ""}
            onChange={(e) => {
              setIsPhoneNumberDirty(false);
              setPhoneNumber(e);
            }}
            onBlur={() => setIsPhoneNumberDirty(true)}
            error={
              isPhoneNumberDirty &&
              !!phoneNumber &&
              phoneNumber.split(" ").length > 1 &&
              !matchIsValidTel(phoneNumber)
            }
          />
          <TextField
            label="Company"
            placeholder="Example Company Inc"
            variant="filled"
            fullWidth
            value={company || ""}
            onChange={(e) => setCompany(e.target.value)}
          />
          <TextField
            label="Additional Message"
            placeholder="Your message here..."
            variant="filled"
            fullWidth
            multiline
            rows={4}
            value={message || ""}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaResponse(token)}
            id="recaptcha"
            ref={recaptchaRef}
          ></ReCAPTCHA>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseInternal}>Cancel</Button>
        <Button onClick={onSend} variant="contained" disabled={!isValidForm}>
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
