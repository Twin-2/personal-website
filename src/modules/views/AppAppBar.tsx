import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "../components/AppBar";
import Toolbar from "../components/Toolbar";
import "./AppAppBar.css";
import { useEffect, useRef, useState } from "react";
import RequestResumeDialog from "../components/RequestResumeDialog";
import Snackbar from "../components/Snackbar";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ListIcon from '@mui/icons-material/List';

const SNACKBAR_SUCCESS_MESSAGE =
  "My email will be automatically emailed to you very soon. Thank you!";
const SNACKBAR_ERROR_MESSAGE = "Something went wrong. Please try again.";

function AppAppBar() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    SNACKBAR_SUCCESS_MESSAGE,
  );
  const [width, setWidth] = useState(window.innerWidth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onContactFormSubmit = (didError: boolean) => {
    if (didError) {
      setSnackbarMessage(SNACKBAR_ERROR_MESSAGE);
    } else {
      setSnackbarMessage(SNACKBAR_SUCCESS_MESSAGE);
      setIsDialogOpen(false);
    }
    setIsSnackbarOpen(true);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const onRequestResumeClick: React.MouseEventHandler<HTMLAnchorElement> = (
    e,
  ) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  useEffect(()=> {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [])

  const appBarRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (appBarRef?.current) {
      document.documentElement.style.setProperty(
        "--scroll-padding",
        `${appBarRef.current.offsetHeight}px`,
      );
    }
  }, [appBarRef?.current]);

  const { pathname } = useLocation();
  return (
    <Box ref={appBarRef}>
      <AppBar position="fixed" sx={{ backgroundColor: "#FFFFFF" }}>
        <Toolbar
          sx={{ justifyContent: "space-between", gap: 2, alignItems: "top" }}
        >
          <Box flexShrink={0}>
            <Link
              variant="h6"
              underline="none"
              href={pathname === "/" ? "#" : undefined}
              sx={{ fontSize: 24, height: 32 }}
              // @ts-ignore
              component={pathname === "/" ? "a" : undefined}
            >
              {"David Whitmore"}
            </Link>
          </Box>
          {width<600 ?
          (<><IconButton onClick={handleClick}>
              <ListIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
                <MenuItem key={'projects'} onClick={handleClose}>
                  <Button component="a" href="/#featured-projects">
                    Projects
                  </Button>
                </MenuItem>
                <MenuItem key={'contact'} onClick={handleClose}>
                  <Button component="a" href="/#contact">
                    Contact
                  </Button>
                </MenuItem>
                <MenuItem key={'resume'} onClick={handleClose}>
                  <Button component="a" onClick={onRequestResumeClick}>
                    Resume
                  </Button>
                </MenuItem>
              </Menu></>)
          :
          (<Box display="flex" gap={2} alignItems="center" >
            <Button component="a" href="/#featured-projects">
              Projects
            </Button>
            <Button component="a" href="/#contact">
              Contact
            </Button>
            <Button component="a" onClick={onRequestResumeClick}>
              Resume
            </Button>
          </Box>)}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <RequestResumeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={onContactFormSubmit}
      />
      <Snackbar
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default AppAppBar;
