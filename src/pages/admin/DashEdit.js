import { Box, MenuItem, Typography, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import { editAjobAction } from "../../redux/actions/jobAction";

const validationSchema = yup.object({
  title: yup.string("Enter a job title").required("Title is required"),
  description: yup
    .string("Enter a description")
    .min(6, "Description should be of minimum 6 characters length")
    .required("Description is required"),
  salary: yup.number("Enter a salary").required("Salary is required"),
  location: yup.string("Enter a location").required("Location is required"),
  jobType: yup.string("Enter a Category").required("Category is required"),
});

const DashEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { jobType } = useSelector((state) => state.jobTypeAll);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
    Axios.get(`/api/job/${id}`)
      .then((res) => {
        setDetails(res.data.job);
      })
      .catch((err) => console.log(err));
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      salary: "",
      location: "",
      jobType: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      dispatch(editAjobAction(values, id));
      actions.resetForm();
    },
  });

  useEffect(() => {
    if (details) {
      formik.setValues(details);
    }
  }, [details]);

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 4,
        }}
      >
        <Box
          onSubmit={formik.handleSubmit}
          component="form"
          className="form_style border-style"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
              Edit a Job
            </Typography>

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="description"
              name="description"
              label="Description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="salary"
              name="salary"
              label="Salary"
              type="text"
              value={formik.values.salary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="location"
              name="location"
              label="Location"
              type="text"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              name="jobType"
              id="jobType"
              select
              label="Category"
              value={formik.values.jobType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jobType && Boolean(formik.errors.jobType)}
              helperText={formik.touched.jobType && formik.errors.jobType}
            >
              {jobType &&
                jobType.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.jobTypeName}
                  </MenuItem>
                ))}
            </TextField>

            <Button fullWidth variant="contained" type="submit">
              Edit Job
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashEdit;
