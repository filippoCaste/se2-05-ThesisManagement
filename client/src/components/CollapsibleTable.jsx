import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  Box,
  Collapse,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useMediaQuery
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
import applicationsAPI from "../services/applications.api";
import { MessageContext } from "../Contexts";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles"; // Import the useTheme hook
import TableSortLabel from "@mui/material/TableSortLabel";
import PropTypes from "prop-types";

function Row(props) {
  const {
    row,
    isEvenRow,
    deleteProposal,
    index,
    onClick,
    onClickApplication,
    archiveProposal,
    isSM,
    fetchProposals,
  } = props;
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleMessage = useContext(MessageContext);
  const [statusChangeLoading, setStatusChangeLoading] = React.useState(false);
  //more actions mobile version
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openActions = Boolean(anchorEl);
  const handleClick = (event) => {
    if (anchorEl === event.currentTarget) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /////
  const changeStatusOfApplication = async (studentsRow, status) => {
    try {
      setStatusChangeLoading(true);
      const response = await applicationsAPI.changeStatusOfApplication(
        studentsRow.application_id,
        status
      );
      if (response) {
        studentsRow.status = status;
        await fetchProposals();
        handleMessage("Proposal " + status + " successfully.", "success");
        if (status == "accepted") {
          setOpen(false);
        }
      }
    } catch (error) {
      handleMessage("Error changing status:" + error, "warning");
    } finally {
      setStatusChangeLoading(false);
    }
  };
 
  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": {
            borderTop: "3px solid #ddd",
            backgroundColor: isEvenRow ? "#f5f5f5" : "#ffffff",
          },
        }}
      >
        <TableCell style={{ width: "5%" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          style={{ width: isSM ? "80%" : "25%" }}
          component="th"
          scope="row"
        >
          {row.p.title}
        </TableCell>
        {!isSM ? (
          <>
            <TableCell style={{ width: "10%" }}>
              {row.p.level === "MSc" && "Master of Science"}
              {row.p.level === "BSc" && "Bachelor of Science"}
              {row.p.level !== "MSc" && row.p.level !== "BSc" && ""}
            </TableCell>
            <TableCell style={{ width: "14%" }}>{row.p.title_degree}</TableCell>
            <TableCell style={{ width: "11%" }}>
              {dayjs(row.p.expiration_date).format("DD/MM/YYYY")}
            </TableCell>
            <TableCell style={{ width: "6%" }}>{row.p.status}</TableCell>
            <TableCell style={{ width: "3.6%" }}>
              <IconButton
                style={{ color: "#007FFF" }}
                aria-label="show details"
                onClick={() => onClick(row.p)}
              >
                <DescriptionOutlinedIcon />
              </IconButton>
            </TableCell>
            <TableCell style={{ width: "3.6%" }}>
              <IconButton
                color="success"
                aria-label="edit"
                onClick={() => archiveProposal(index)}
                disabled={
                  row.p.status === "archived" || row.p.status === "assigned"
                }
              >
                <ArchiveIcon />
              </IconButton>
            </TableCell>
            <TableCell style={{ width: "3%" }}>
              <IconButton
                color="info"
                aria-label="edit"
                onClick={() => navigate(`/teacher/updateProposal/${row.p.id}`)}
                disabled={row.p.status === "assigned"}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
            <TableCell style={{ width: "3.6%" }}>
              <IconButton
                color="error"
                aria-label="delete"
                onClick={() => deleteProposal(index)}
                disabled={row.p.status === "assigned"}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
            <TableCell style={{ width: "3%" }}>
              <IconButton
                aria-label="copy"
                onClick={() => navigate(`/teacher/copyProposal/${row.p.id}`)}
                disabled={row.p.status === "assigned"}
              >
                <ContentCopyIcon />
              </IconButton>
            </TableCell>
          </>
        ) : (
          <TableCell style={{ width: "15%" }}>
            <IconButton
              style={{ color: "#007FFF" }}
              aria-label="show more"
              aria-controls={openActions ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openActions ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreHorizIcon />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openActions}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  style={{ color: "#007FFF" }}
                  aria-label="show details"
                  onClick={() => {
                    onClick(row.p);
                    handleClose();
                  }}
                >
                  <DescriptionOutlinedIcon />
                </MenuItem>
                <MenuItem
                  aria-label="archive"
                  onClick={() => archiveProposal(index)}
                  disabled={
                    row.p.status === "archived" || row.p.status === "assigned"
                  }
                >
                  <ArchiveIcon color="success" />
                </MenuItem>
                <MenuItem
                  aria-label="edit"
                  onClick={() => {
                    handleClose();
                  }}
                  disabled={row.p.status === "assigned"}
                >
                  <Link to={`/teacher/updateProposal/${row.p.id}`}>
                    <EditIcon color="info" />
                  </Link>
                </MenuItem>
                <MenuItem
                  aria-label="delete"
                  onClick={() => {
                    deleteProposal(index);
                    handleClose();
                  }}
                  disabled={row.p.status === "assigned"}
                >
                  <DeleteIcon color="error" />
                </MenuItem>
                <MenuItem
                  aria-label="copy"
                  onClick={() => {
                    handleClose();
                  }}
                  disabled={row.p.status === "assigned"}
                >
                  <Link to={`/teacher/copyProposal/${row.p.id}`}>
                    <ContentCopyIcon />
                  </Link>
                </MenuItem>
              </Menu>
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: isEvenRow ? "#f5f5f5" : "#ffffff",
          }}
          colSpan={11}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, height: "auto" }}>
              <Typography variant="h6" gutterBottom component="div">
                <b>Students who applied</b>
              </Typography>
              {row.students.length > 0 ? (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {!isSM ? (
                        <>
                          <TableCell style={{ width: "5%" }}>
                            <b>Id</b>
                          </TableCell>
                          <TableCell style={{ width: "20%" }}>
                            <b>Name</b>
                          </TableCell>
                          <TableCell style={{ width: "15%" }}>
                            <b>Email</b>
                          </TableCell>
                          <TableCell style={{ width: "20%" }}>
                            <b>Title Degree</b>
                          </TableCell>
                          <TableCell style={{ width: "15%" }}>
                            <b>Enrollment Year</b>
                          </TableCell>
                          <TableCell style={{ width: "10%" }}>
                            <b>Nationality</b>
                          </TableCell>
                          <TableCell style={{ width: "15%" }}>
                            <b>Submission Date</b>
                          </TableCell>
                          <TableCell style={{ width: "5%" }} />
                          <TableCell style={{ width: "5%" }} />
                        </>
                      ) : (
                        <>
                          <TableCell style={{ width: "90%" }}>
                            <b>Name</b>
                          </TableCell>
                          <TableCell style={{ width: "10%" }}>
                            <b>Show more</b>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.students.map((studentsRow) => (
                      <TableRow key={studentsRow.student_id}>
                        {!isSM ? (
                          <TableCell
                            style={{ width: "5%" }}
                            component="th"
                            scope="row"
                          >
                            {studentsRow.student_id}
                          </TableCell>
                        ) : null}
                        <TableCell style={{ width: !isSM ? "18%" : "75%" }}>
                          {studentsRow.student_name +
                            " " +
                            studentsRow.student_surname}
                        </TableCell>
                        {!isSM ? (
                          <>
                            <TableCell style={{ width: "15%" }}>
                              {studentsRow.student_email}
                            </TableCell>
                            <TableCell style={{ width: "20%" }}>
                              {studentsRow.student_title_degree}
                            </TableCell>
                            <TableCell style={{ width: "12%" }}>
                              {studentsRow.student_enrollment_year}
                            </TableCell>
                            <TableCell style={{ width: "7%" }}>
                              {studentsRow.student_nationality}
                            </TableCell>
                            <TableCell style={{ width: "12%" }}>
                              {dayjs(studentsRow.submission_date).format(
                                "DD/MM/YYYY"
                              )}
                            </TableCell>
                            <TableCell style={{ width: "10%" }}>
                              <IconButton
                                style={{ color: "#007FFF" }}
                                aria-label="show details"
                                onClick={() => onClickApplication(studentsRow)}
                              >
                                <UnfoldMoreOutlinedIcon />
                              </IconButton>
                            </TableCell>
                          </>
                        ) : (
                          <TableCell style={{ width: "15%" }}>
                            <IconButton
                              style={{ color: "#007FFF" }}
                              aria-label="show details"
                              onClick={() => onClickApplication(studentsRow)}
                            >
                              <DescriptionOutlinedIcon />
                            </IconButton>
                          </TableCell>
                        )}
                        {studentsRow.status === "submitted" ? (
                          <>
                            <TableCell style={{ width: "5%" }}>
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  changeStatusOfApplication(
                                    studentsRow,
                                    "accepted"
                                  )
                                }
                                style={{
                                  fontSize: "12px",
                                  textTransform: "none",
                                  color: "white",
                                  borderRadius: "4px",
                                  border: "1px solid #35682D",
                                  backgroundColor: "#35682D",
                                }}
                                disabled={statusChangeLoading}
                              >
                                Accept
                              </Button>
                            </TableCell>
                            <TableCell style={{ width: "5%" }}>
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  changeStatusOfApplication(
                                    studentsRow,
                                    "rejected"
                                  )
                                }
                                style={{
                                  fontSize: "12px",
                                  textTransform: "none",
                                  color: "white",
                                  borderRadius: "4px",
                                  border: "1px solid #FF0000",
                                  backgroundColor: "#FF0000",
                                }}
                                disabled={statusChangeLoading}
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={2} style={{ width: "10%" }}>
                            <Chip
                              label={studentsRow.status}
                              color={
                                studentsRow.status === "accepted"
                                  ? "success"
                                  : "error"
                              }
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No students apply</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
function CollapsibleTable(props) {
  const {
    listProposals,
    onClick,
    deleteProposal,
    archiveProposal,
    onClickApplication,
    fetchProposals,
  } = props;
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down("md"));
  ///SORTING
  const [orderBy, setOrderBy] = React.useState("expiration_date");
  const [order, setOrder] = React.useState("desc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProposals = React.useMemo(() => {
    if (orderBy && order) {
      return listProposals.slice().sort((a, b) => {
        const aValue = a.p[orderBy];
        const bValue = b.p[orderBy];
        if (order === "asc" && orderBy === "expiration_date")
          return dayjs(aValue).isAfter(bValue) ? 1 : -1;
        else if (order === "desc" && orderBy === "expiration_date")
          return dayjs(aValue).isBefore(bValue) ? -1 : 1;
        else if (order === "asc" && orderBy !== "expiration_date")
          return aValue < bValue ? 1 : -1;
        else if (order === "desc" && orderBy !== "expiration_date")
          return aValue > bValue ? 1 : -1;
      });
    }
    return listProposals;
  }, [listProposals, orderBy, order]);
  return (
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow>
          <TableCell style={{ width: "5%" }} />
          <TableCell
            style={{ width: isSM ? "80%" : "25%" }}
            sortDirection={orderBy === "title" ? order : false}
          >
            <TableSortLabel
              active={true}
              sx={{
                "&.Mui-active .MuiTableSortLabel-icon": {
                  color:
                    orderBy === "title" ? theme.palette.secondary.main : "none",
                },
              }}
              direction={orderBy === "title" ? order : "desc"}
              onClick={() => handleRequestSort("title")} // Utilizza una funzione di callback
            >
              <b>Title</b>
            </TableSortLabel>
          </TableCell>
          {!isSM ? (
            <>
              <TableCell
                style={{ width: "10%" }}
                sortDirection={orderBy === "level" ? order : false}
              >
                <TableSortLabel
                  active={true}
                  direction={orderBy === "level" ? order : "desc"}
                  onClick={() => handleRequestSort("level")}
                  sx={{
                    "&.Mui-active .MuiTableSortLabel-icon": {
                      color:
                        orderBy === "level"
                          ? theme.palette.secondary.main
                          : "none",
                    },
                  }}
                >
                  <b>Level</b>
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{ width: "14%" }}
                sortDirection={orderBy === "title_degree" ? order : false}
              >
                <TableSortLabel
                  active={true}
                  direction={orderBy === "title_degree" ? order : "desc"}
                  onClick={() => handleRequestSort("title_degree")}
                  sx={{
                    "&.Mui-active .MuiTableSortLabel-icon": {
                      color:
                        orderBy === "title_degree"
                          ? theme.palette.secondary.main
                          : "none",
                    },
                  }}
                >
                  <b>Title Degree</b>
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{ width: "11%" }}
                sortDirection={orderBy === "expiration_date" ? order : false}
              >
                <TableSortLabel
                  active={true}
                  direction={orderBy === "expiration_date" ? order : "desc"}
                  onClick={() => handleRequestSort("expiration_date")}
                  sx={{
                    "&.Mui-active .MuiTableSortLabel-icon": {
                      color:
                        orderBy === "expiration_date"
                          ? theme.palette.secondary.main
                          : "none",
                    },
                  }}
                >
                  <b>Expiration Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{ width: "6%" }}
                sortDirection={orderBy === "status" ? order : false}
              >
                <TableSortLabel
                  active={true}
                  direction={orderBy === "status" ? order : "desc"}
                  onClick={() => handleRequestSort("status")}
                  sx={{
                    "&.Mui-active .MuiTableSortLabel-icon": {
                      color:
                        orderBy === "status"
                          ? theme.palette.secondary.main
                          : "none",
                    },
                  }}
                >
                  <b>Status</b>
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ width: "3.6%" }}>
                <b>See details</b>
              </TableCell>
              <TableCell style={{ width: "3.6%" }}>
                <b>Archive</b>
              </TableCell>
              <TableCell style={{ width: "3.6%" }}>
                <b>Edit</b>
              </TableCell>
              <TableCell style={{ width: "3.6%" }}>
                <b>Delete</b>
              </TableCell>
              <TableCell style={{ width: "3.6%" }}>
                <b>Copy</b>
              </TableCell>
            </>
          ) : (
            <TableCell style={{ width: "15%" }}>
              <b>Actions</b>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedProposals.length > 0 ? (
          sortedProposals.map((row, index) => (
            <Row
              key={row.p.id}
              row={row}
              isEvenRow={index % 2 === 0}
              isSM={isSM}
              onClick={onClick}
              onClickApplication={onClickApplication}
              index={index}
              deleteProposal={deleteProposal}
              archiveProposal={archiveProposal}
              fetchProposals={fetchProposals}
            />
          ))
        ) : (
          <TableRow>
            <TableCell />
            <TableCell colSpan={9}>No thesis available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

CollapsibleTable.propTypes = {
  listProposals: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteProposal: PropTypes.func.isRequired,
  archiveProposal: PropTypes.func.isRequired,
  onClickApplication: PropTypes.func.isRequired,
  fetchProposals: PropTypes.func.isRequired,
};

Row.propTypes = {
  row: PropTypes.object.isRequired,
  isEvenRow: PropTypes.bool.isRequired,
  deleteProposal: PropTypes.func.isRequired,
  archiveProposal: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onClickApplication: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isSM: PropTypes.bool.isRequired,
  fetchProposals: PropTypes.func.isRequired,
};

export default CollapsibleTable;
