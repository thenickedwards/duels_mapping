import { useState } from "react";
import { ButtonBase, ClickAwayListener, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_PREVIEW,
} from "../../lib/siteDescription";

export default function ToplineExplainer() {
  const [open, setOpen] = useState(true);

  // Any click elsewhere on the page also collapses the description
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <ButtonBase
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Collapse description" : "Expand description"}
        disableRipple
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 1,
          mx: { xs: 1, md: 4 },
          mb: 3,
          textAlign: "left",
          color: "text.primary",
          opacity: open ? 1 : 0.5,
          transition: "opacity 0.2s ease",
          "&:hover": { opacity: open ? 1 : 0.75 },
          "&.Mui-focusVisible": { outline: "2px solid", outlineOffset: 2 },
        }}
      >
        <ChevronRightIcon
          fontSize="small"
          sx={{
            mt: "2px",
            flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: "inherit", fontStyle: open ? "normal" : "italic" }}
        >
          {open ? SITE_DESCRIPTION : `${SITE_DESCRIPTION_PREVIEW}...`}
        </Typography>
      </ButtonBase>
    </ClickAwayListener>
  );
}
