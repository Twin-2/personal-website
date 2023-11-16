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
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const validateEmail = (email: string) => {
  if (!email) {
    return false;
  }
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
export default function ContactForm(props: ContactFormProps) {
  const { onClose, isOpen, onSubmit = () => {} } = props;
  const onSend = () => {
    onSubmit();
    onClose();
  };

  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isPhoneNumberDirty, setIsPhoneNumberDirty] = useState(false);
  const [company, setCompany] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recaptchaResponse, setRecaptchaResponse] = useState<string | null>(
    null,
  );
  const isValidForm =
    !!recaptchaResponse && phoneNumber && matchIsValidTel(phoneNumber);
  return (
    <Dialog onClose={onClose} open={isOpen}>
      <DialogTitle>Request Resume</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the following form to have my resume automatically
          sent to you.
        </DialogContentText>
        <Box display="grid" my={2} gap={2} component="form">
          <TextField
            label="Full Name"
            placeholder="Please provide your first and last name"
            variant="filled"
            fullWidth
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={(e) => setFullName(e.target.value || "")}
            error={fullName !== null && !fullName}
          />
          <TextField
            label="Email"
            placeholder="Please provide your email"
            variant="filled"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setEmail(e.target.value || "")}
            error={email !== null && !validateEmail(email)}
          />
          <MuiTelInput
            label="Phone Number"
            placeholder="Please provide your phone number"
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
            placeholder="Please enter the company you are inquiring from"
            variant="filled"
            fullWidth
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <TextField
            label="Additional Message"
            placeholder="Add any message you would like for me to read"
            variant="filled"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ReCAPTCHA
            sitekey="6LfMBREpAAAAAJMQs1DFuFq9UomsqvzjcIUi2Emk"
            onChange={(token) => setRecaptchaResponse(token)}
            id="recaptcha"
          ></ReCAPTCHA>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSend} variant="contained" disabled={!isValidForm}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
