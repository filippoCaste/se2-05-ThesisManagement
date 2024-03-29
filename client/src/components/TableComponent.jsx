import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "../App.css";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTheme } from "@mui/material/styles"; // Import the useTheme hook
import Badge from "@mui/material/Badge";
import PropTypes from "prop-types";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orderBy, setOrderBy] = React.useState("expiration_date");
  const [order, setOrder] = React.useState("asc");
  const { proposals, isAppliedProposals } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  const columns = [
    { id: "title", label: "Title", minWidth: 450, maxWidth: 450 },
    { id: "supervisor_id", label: "Supervisor", minWidth: 200, maxWidth: 200 },
    {
      id: "expiration_date",
      label: "Expiration Date",
      minWidth: 150,
      maxWidth: 150,
      format: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    { id: "keyword_names", label: "Keywords", minWidth: 150, maxWidth: 150 },
    {
      id: "button",
      label: "Details",
      minWidth: 200,
      maxWidth: 200,
      format: (value, row) => (
        <Button
          variant="outlined"
          startIcon={<DescriptionOutlinedIcon />}
          style={{
            textTransform: "none",
            color: "#2196f3",
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor: "#2196f3",
              color: "white",
            },
          }}
          onClick={() => props.onClick(row)}
        ></Button>
      ),
    },
  ];

  // push status col if isAppliedProposals is true
  if (isAppliedProposals) {
    columns.push({
      id: "status",
      label: "Status",
      minWidth: 150,
      maxWidth: 150,
      format: (value, row) => (
        <Badge color={getColorByStatus(value)} badgeContent={value}></Badge>
      ),
    });
    // add column for creating a student request starting from an approved application
    columns.push({
      id: "request",
      label: "Modify request",
      format: (value, row) => (
        <Button
          variant="outlined"
          startIcon={<CreateIcon />}
          disabled={row.status !== "accepted"}
          onClick={() => createNewStudentRequest(row)}
        ></Button>
      ),
    });
  }

  const createNewStudentRequest = (row) => {
    // go to the page of creation of a student request
    // with all the informations needed (title, description, ...)
    const teacherEmail = row.supervisorsInfo.find(
      (supervisor) => supervisor.id === row.supervisor_id
    )?.email;

    const coSupervisors = row.supervisorsInfo
      .filter((s) => s.id !== row.supervisor_id)
      .map((s) => s.email);

    navigate("/student/proposal", {
      state: {
        title: row.title,
        description: row.description,
        notes: row.notes,
        teacherEmail,
        coSupervisors,
        type: row.type,
      },
    });
  };

  const getColorByStatus = (status) => {
    switch (status) {
      case "rejected":
        return "secondary";
      case "submitted":
        return "primary";
      case "accepted":
        return "success";
      default:
        return "action";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProposals = React.useMemo(() => {
    if (orderBy && order) {
      return proposals?.slice().sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
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
    return proposals;
  }, [proposals, orderBy, order]);

  const renderNoProposalsMessage = () => {
    if (sortedProposals.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            style={{ width: "100%" }}
          >
            <b>No available theses</b>
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };


  return (
    <Paper className="paperContainer">
      <TableContainer className="tableContainer">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className="headerRow">
              {columns?.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.maxWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.label !== "Details" &&
                  column.label !== "Modify request" &&
                  column.label !== "Status" ? (
                    <TableSortLabel
                      active={true}
                      direction={orderBy === column.id ? order : "desc"}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{
                        "&.Mui-active .MuiTableSortLabel-icon": {
                          color:
                            orderBy === column.id
                              ? theme.palette.secondary.main
                              : "none",
                        },
                      }}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderNoProposalsMessage()}
            {sortedProposals.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                tabIndex={-1}
                className={`proposalRow ${
                  index % 2 === 0 ? "proposalRowOdd" : ""
                }`}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      width: column.maxWidth,
                      whiteSpace: "normal",
                      maxHeight: "100px",
                      padding: "8px",
                    }}
                  >
                    {column.id === "supervisor_id" &&
                      `${
                        row.supervisorsInfo.find(
                          (supervisor) => supervisor.id === row.supervisor_id
                        )?.name
                      } ${
                        row.supervisorsInfo.find(
                          (supervisor) => supervisor.id === row.supervisor_id
                        )?.surname
                      }`}
                    {column.id !== "supervisor_id" &&
                      column.format &&
                      column.format(row[column.id], row)}
                    {column.id !== "supervisor_id" &&
                      !column.format &&
                      row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={proposals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
      />
    </Paper>
  );
}

StickyHeadTable.propTypes = {
  proposals: PropTypes.array,
  isAppliedProposals: PropTypes.bool,
  onClick: PropTypes.func,
};
