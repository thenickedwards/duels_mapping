import { useState } from "react";
import { Box, ButtonBase, ClickAwayListener, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  SITE_BONUS_FEATURES,
  SITE_DESCRIPTION_PREVIEW,
  SITE_DESCRIPTION_SUMMARY,
} from "../../lib/siteDescription";

export default function ToplineExplainer() {
  const [open, setOpen] = useState(true);

  // Once open, only the chevron or a click elsewhere on the page collapses the
  // description, so the text itself can be selected and copied. Click-away runs
  // on mousedown so a selection dragged past the edge doesn't collapse it.
  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={() => setOpen(false)}>
      <Box
        onClick={open ? undefined : () => setOpen(true)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 1,
          mx: { xs: 1, md: 4 },
          mb: 3,
          textAlign: "left",
          color: "text.primary",
          cursor: open ? "auto" : "pointer",
          opacity: open ? 1 : 0.5,
          transition: "opacity 0.2s ease",
          "&:hover": { opacity: open ? 1 : 0.75 },
        }}
      >
        <ButtonBase
          onClick={(event) => {
            event.stopPropagation();
            setOpen((prev) => !prev);
          }}
          aria-expanded={open}
          aria-label={open ? "Collapse description" : "Expand description"}
          disableRipple
          sx={{
            mt: "2px",
            flexShrink: 0,
            borderRadius: "50%",
            "&.Mui-focusVisible": { outline: "2px solid", outlineOffset: 2 },
          }}
        >
          <ChevronRightIcon
            fontSize="small"
            sx={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </ButtonBase>
        <Typography
          variant="body2"
          component="div"
          sx={{ color: "inherit", fontStyle: open ? "normal" : "italic" }}
        >
          {open ? (
            <>
              <Box component="p" sx={{ m: 0, mb: 1.5 }}>
                {SITE_DESCRIPTION_PREVIEW}.
              </Box>
              <Box component="p" sx={{ m: 0, mb: 1.5 }}>
                {SITE_DESCRIPTION_SUMMARY}
              </Box>
              Bonus Features:
              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                {SITE_BONUS_FEATURES.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </Box>
            </>
          ) : (
            `${SITE_DESCRIPTION_PREVIEW}...`
          )}
        </Typography>
      </Box>
    </ClickAwayListener>
  );
}
