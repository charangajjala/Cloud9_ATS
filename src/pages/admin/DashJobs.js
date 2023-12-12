import React, { useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { jobLoadAction } from "../../redux/actions/jobAction";
import axios from "axios";
import { toast } from "react-toastify";

const DashJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(jobLoadAction());
  }, []);

  const { jobs, loading } = useSelector((state) => state.loadJobs);
  let data = [];
  data = jobs !== undefined && jobs.length > 0 ? jobs : [];

  //delete job by Id
  const deleteJobById = (e, id) => {
    console.log(id);
    axios.delete(`/api/job/delete/${id}`);
    window.location.reload();
    toast.success("Job deleted successfully!");
  };

  const columns = [
    {
      field: "id",
      headerName: "Job ID",
      width: 150,
      editable: true,
    },
    {
      field: "title",
      headerName: "Job name",
      width: 150,
    },
    {
      field: "jobType",
      headerName: "Category",
      width: 150,
      valueGetter: (data) => data.row.jobType.jobTypeName,
    },
    {
      field: "user",
      headerName: "User",
      width: 150,
      valueGetter: (data) => data.row.user.firstName,
    },
    {
      field: "available",
      headerName: "available",
      width: 150,
      renderCell: (values) => (values.row.available ? "Yes" : "No"),
    },

    {
      field: "salary",
      headerName: "Salary",
      type: Number,
      width: 150,
      renderCell: (values) => "$" + values.row.salary,
    },

    {
      field: "Actions",
      width: 200,
      renderCell: (values) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "170px",
          }}
        >
          <Button variant="contained">
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to={`/admin/topapplicants/job/${values.row.id}/${values.row.description}/${values.row.title}`}
            >
              Filter
            </Link>
          </Button>
          <Button variant="contained">
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to={`/admin/edit/job/${values.row.id}`}
            >
              Edit
            </Link>
          </Button>
          <Button
            onClick={(e) => deleteJobById(e, values.row.id)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "white", pb: 3 }}>
        Jobs list
      </Typography>
      <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
        <Button variant="contained" color="success" startIcon={<AddIcon />}>
          {" "}
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to="/admin/job/create"
          >
            Create Job
          </Link>
        </Button>
      </Box>
      <Paper sx={{ bgcolor: "secondary.midNightBlue" }}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row.id}
            sx={{
              "& .MuiTablePagination-displayedRows": {
                color: "white",
              },
              color: "white",
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  // theme.palette.mode === 'light' ? grey[200] : grey[900],
                  theme.palette.secondary.main,
              },
              button: {
                color: "#ffffff",
              },
            }}
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DashJobs;
