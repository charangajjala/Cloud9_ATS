import React, { useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid, gridClasses, GridToolbar } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { allUserAction } from "../../redux/actions/userAction";
import { jobLoadTopApplicants } from "../../redux/actions/jobAction";

const TopApplicants = () => {
  const dispatch = useDispatch();

  const { jobId, jobDesc, jobTitle } = useParams();

  useEffect(() => {
    console.log("jobId", jobId);
    dispatch(jobLoadTopApplicants(jobId, jobDesc));
  }, [dispatch, jobDesc, jobId]);

  const { topApplicants, loading } = useSelector(
    (state) => state.loadTopApplicants
  );

  console.log("applicants", topApplicants);
  //   const applicants = [
  //     {
  //       id: "1",
  //       email: "charan@gmail.com",
  //       firstName: "Charan",
  //       lastName: "Gajjala Chenchu",
  //     },
  //   ];
  let data = [];
  data =
    topApplicants !== undefined && topApplicants.length > 0
      ? topApplicants
      : [];

  //   const deleteUserById = (e, id) => {
  //     console.log(id);
  //   };

  const columns = [
    {
      field: "userId",
      headerName: "User ID",
      width: 150,
      editable: true,
    },

    {
      field: "personalEmail",
      headerName: "E_mail",
      width: 150,
    },

    {
      field: "firstName",
      headerName: "First name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
    },
    {
      field: "similarityScore",
      headerName: "Smiliarity Score",
      width: 150,
    },
  ];

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ color: "white", pb: 3 }}>
          Top Applicants for {jobTitle}
        </Typography>
        <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
          <Button variant="contained" color="success" startIcon={<AddIcon />}>
            {" "}
            Create user
          </Button>
        </Box>
        <Paper sx={{ bgcolor: "secondary.midNightBlue" }}>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
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
              getRowId={(row) => row.userId}
              rows={data}
              columns={columns}
              pageSize={3}
              rowsPerPageOptions={[3]}
              checkboxSelection
              slots={{ toolbar: GridToolbar }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default TopApplicants;
