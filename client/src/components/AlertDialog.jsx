import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import theme from "../theme";
import { MessageContext } from "../Contexts";
import applicationsAPI from "../services/applications.api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function RenderFieldTable({ label, value }) {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center" component="th" scope="row">
        {label}
      </TableCell>
      <TableCell align="center">{value}</TableCell>
    </TableRow>
  );
}

export default function AlertDialog({
  open,
  handleClose,
  item,
  handleApply,
  loading,
  isAppliedProposals,
  isSecretary,
}) {
  const {
    supervisorsInfo,
    supervisor_id,
    title,
    description,
    keyword_names,
    notes,
    expiration_date,
    level,
    title_degree,
    title_group,
    required_knowledge,
    teacher_id,
  } = item || {};
  const mainSupervisor = supervisorsInfo?.find(
    (supervisor) =>
      supervisor.id === supervisor_id || supervisor.id === teacher_id
  );
  const coSupervisors = supervisorsInfo?.filter(
    (supervisor) =>
      supervisor.id !== supervisor_id || supervisor.co_supervisor_id
  );
  const [isAppliedProposal, setIsAppliedProposal] = useState(false);
  const handleMessage = useContext(MessageContext);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!isSecretary) {
      applicationsAPI
        .getStudentApplications()
        .then((response) => {
          setIsAppliedProposal(
            response?.filter((o) => o.status !== "rejected").length > 0
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const handleFileChange = (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (fileExtension === "pdf") {
        setSelectedFile(selectedFile);
      } else {
        handleMessage("Please insert a pdf file!", "warning");
        files = null;
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 8,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.secondary.main}`,
          color: theme.palette.primary.main,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "20px",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <TableContainer component={Paper} sx={{ mt: "1.5rem", mb: "1rem" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <RenderFieldTable label="Description" value={description} />
              <RenderFieldTable label="Keywords" value={keyword_names} />
              <RenderFieldTable label="Notes" value={notes} />
              <RenderFieldTable
                label="Expiration Date"
                value={dayjs(expiration_date).format("DD/MM/YYYY")}
              />
              <RenderFieldTable label="Level" value={level} />
              <RenderFieldTable label="Degree" value={title_degree} />
              {mainSupervisor && (
                <RenderFieldTable
                  label="Supervisor"
                  value={`${mainSupervisor.name} ${mainSupervisor.surname} (${mainSupervisor.email})`}
                />
              )}
              {coSupervisors?.map((supervisor) => (
                <RenderFieldTable
                  key={supervisor.id}
                  label="Co-Supervisor"
                  value={`${supervisor.name} ${supervisor.surname} (${supervisor.email})`}
                />
              ))}
              <RenderFieldTable label="Group" value={title_group} />
              <RenderFieldTable
                label="Required Knowledge"
                value={required_knowledge}
              />
            </TableBody>
          </Table>
        </TableContainer>

        {handleApply && !isAppliedProposals && (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isAppliedProposal}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </Button>
        )}
        {handleApply && !isAppliedProposals && selectedFile && (
          <Typography variant="body1" gutterBottom>
            <strong>Selected file:</strong> {selectedFile.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: "20px",
          borderTop: `1px solid ${theme.palette.secondary.main}`,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleClose} color="secondary">
          <Typography
            variant="button"
            sx={{ color: theme.palette.secondary.main }}
          >
            Close
          </Typography>
        </Button>
        {loading ? (
          <CircularProgress color="primary" size={24} />
        ) : (
          handleApply &&
          !isAppliedProposals && (
            <Button
              onClick={() => handleApply(selectedFile)}
              color="primary"
              variant="contained"
              disabled={isAppliedProposals}
            >
              <Typography variant="button" sx={{ color: "white" }}>
                Apply
              </Typography>
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
}

RenderFieldTable.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  handleApply: PropTypes.func,
  loading: PropTypes.bool,
  isAppliedProposals: PropTypes.bool,
  isSecretary: PropTypes.bool, //optional
};
