"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { inputStyle } from "@/app/styles/inputStyles";
import { primaryActionButtonStyle } from "@/app/styles/buttonStyles";

const EMPTY_FORM = { name: "", email: "", message: "", website: "" };

export default function ContactDialog({ open, onClose }) {
  const theme = useTheme();
  const [form, setForm] = useState(EMPTY_FORM);
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const background =
    theme.palette.mode === "dark" ? "#17171B" : theme.palette.common.white;
  const textColor =
    theme.palette.mode === "dark" ? "white" : theme.palette.common.black;

  const handleChange = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleClose = () => {
    onClose();
    // Clear a sent form only once it is closed, so the thank-you note does not
    // flash back to an empty form during the close transition.
    if (status === "sent") {
      setForm(EMPTY_FORM);
      setStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Your message couldn't be sent.");
      }
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  // Multiline TextFields render a textarea, which inputStyle's "& input" rule misses.
  const fieldSx = {
    ...inputStyle(theme),
    mb: 2,
    "& textarea": { fontFamily: "'Nunito Sans', sans-serif", fontSize: "1rem" },
    "& .MuiInputLabel-root.Mui-focused": { color: textColor },
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: background }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Typography variant="h3" component="span">
            Get in touch!
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon sx={{ color: textColor }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: background }}>
        {status === "sent" ? (
          <Typography variant="body1" sx={{ pb: 2 }}>
            Thanks, {form.name.split(" ")[0]}! Your message is on its way. We&apos;ll
            get back to you at {form.email}.
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Want to collaborate on a project? Have a suggestion, correction, or
              objection? Reaching out across the empty void of cyberspace for
              human connection? Send us a message using the form below.
            </Typography>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange("name")}
              required
              fullWidth
              autoComplete="name"
              slotProps={{ htmlInput: { maxLength: 200 } }}
              sx={fieldSx}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              fullWidth
              autoComplete="email"
              slotProps={{ htmlInput: { maxLength: 320 } }}
              sx={fieldSx}
            />
            <TextField
              label="Message"
              value={form.message}
              onChange={handleChange("message")}
              required
              fullWidth
              multiline
              minRows={5}
              slotProps={{ htmlInput: { maxLength: 5000 } }}
              sx={fieldSx}
            />
            {/* Honeypot: hidden from people and screen readers, filled by bots. */}
            <Box
              component="input"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={handleChange("website")}
              sx={{ position: "absolute", left: "-9999px" }}
            />
            {status === "error" && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" pb={1}>
              <Button
                type="submit"
                disabled={status === "sending"}
                sx={primaryActionButtonStyle(theme)}
              >
                {status === "sending" ? "Sending…" : "Send"}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
