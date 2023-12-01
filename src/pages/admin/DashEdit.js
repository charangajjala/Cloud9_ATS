// export const DashEdit = () => {
//     return <h1> This is edit page</h1>
// };


import { Box, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useParams } from 'react-router-dom'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import { registerAjobAction } from "../../redux/actions/jobAction";


const validationSchema = yup.object({
  title: yup.string("Enter a job title").required("title is required"),
  description: yup
    .string("Enter a description")
    .min(6, "Description should be of minimum 6 characters length")
    .required("Description is required"),
  salary: yup.number("Enter a salary").required("Salary is required"),
  location: yup.string("Enter a location").required("Location is required"),
  jobType: yup.string("Enter a Category").required("Category is required"),
});
const DashEdit = () => {
//   return <h1> This is a edit page </h1>
      const dispatch = useDispatch();
      const { id } = useParams();

  //job type
  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [dispatch]);

  // useEffect(() => {
  //       Axios.get(`/api/job/${id}`).then(res =>
  //       setformik(res.data))
  //       .catch(err => console.log(err))

  // },[])

  const { jobType } = useSelector((state) => state.jobTypeAll);
  const [details, setDetails] = useState([])

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      salary: "",
      location: "",
      jobType: "",
    },
    enableReinitialize: true,
    // initialValues: {details},
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      dispatch(registerAjobAction(values));
      // alert(JSON.stringify(values, null, 2));
      actions.resetForm();
    },
  });
 




    Axios.get(`/api/job/${id}`).then(res => {
        console.log('sachin', res.data)
        setDetails(res.data.job);
        
        console.log(details)
        // console.log('test1', res.data.job)
        console.log('dif', formik.values)
        

  });
  useEffect(() => {
      formik.setValues({
        ...details
      });
    }
  , [details]);
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
              InputLabelProps={{
                shrink: true,
              }}
              // value={details.title}
              placeholder = "title"
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
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Description"
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
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Salary"
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
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              className="px-2 my-2"
              variant="outlined"
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
              <MenuItem key={""} value={""}></MenuItem>

              {jobType &&
                jobType.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.jobTypeName}
                  </MenuItem>
                ))}
            </TextField>

            <Button fullWidth variant="contained" type="submit">
              Edit job
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashEdit;



