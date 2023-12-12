import axios from "axios";
import { toast } from "react-toastify";
import {
  JOB_LOAD_FAIL,
  JOB_LOAD_REQUEST,
  JOB_LOAD_SINGLE_FAIL,
  JOB_LOAD_SINGLE_REQUEST,
  JOB_LOAD_SINGLE_SUCCESS,
  JOB_LOAD_SUCCESS,
  JOB_TOP_APPLICANTS_FAIL,
  JOB_TOP_APPLICANTS_REQUEST,
  JOB_TOP_APPLICANTS_SUCCESS,
  REGISTER_JOB_FAIL,
  REGISTER_JOB_REQUEST,
  REGISTER_JOB_SUCCESS,
  EDIT_JOB_REQUEST,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_FAIL,
} from "../constants/jobconstant";

export const jobLoadAction =
  (pageNumber, keyword = "", cat = "", location = "") =>
  async (dispatch) => {
    dispatch({ type: JOB_LOAD_REQUEST });
    try {
      const { data } = await axios.get(
        `http://cloud9-env.eba-myarpwsz.us-east-2.elasticbeanstalk.com/api/jobs/show/?pageNumber=${pageNumber}&keyword=${keyword}&cat=${cat}&location=${location}`
      );
      dispatch({
        type: JOB_LOAD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: JOB_LOAD_FAIL,
        payload: error.response.data.error,
      });
    }
  };

// single job action
export const jobLoadSingleAction = (id) => async (dispatch) => {
  dispatch({ type: JOB_LOAD_SINGLE_REQUEST });
  try {
    const { data } = await axios.get(`/api/job/${id}`);
    dispatch({
      type: JOB_LOAD_SINGLE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: JOB_LOAD_SINGLE_FAIL,
      payload: error.response.data.error,
    });
  }
};

// register job action
export const registerAjobAction = (job) => async (dispatch) => {
  dispatch({ type: REGISTER_JOB_REQUEST });

  try {
    const { data } = await axios.post("/api/job/create", job);
    dispatch({
      type: REGISTER_JOB_SUCCESS,
      payload: data,
    });
    toast.success("Job created successfully");
  } catch (error) {
    dispatch({
      type: REGISTER_JOB_FAIL,
      payload: error.response.data.error,
    });
    toast.error(error.response.data.error);
  }
};

// register job action
export const editAjobAction = (job, id) => async (dispatch) => {
  dispatch({ type: EDIT_JOB_REQUEST });

  try {
    const { data } = await axios.put(`/api/job/update/${id}`, job);
    dispatch({
      type: EDIT_JOB_SUCCESS,
      payload: data,
    });
    toast.success("Job updated successfully");
  } catch (error) {
    dispatch({
      type: EDIT_JOB_FAIL,
      payload: error.response.data.error,
    });
    toast.error(error.response.data.error);
  }
};

// single job action
export const jobLoadTopApplicants = (jobId, jobDesc) => async (dispatch) => {
  dispatch({ type: JOB_TOP_APPLICANTS_REQUEST });
  try {
    // const { data } = await axios.get(`/api/job/${id}`);
    const { data } = await axios.post(
      `https://is22nmwcu0.execute-api.us-east-2.amazonaws.com/dev/`,
      { jobId: jobId, jobDescription: jobDesc }
    );

    console.log("Data:", data.body);
    const topApplicants = JSON.parse(data.body);
    console.log("topApplicants:", topApplicants);
    // const data = {
    //   jobTitle: "Software Engineer",
    //   applicants: [
    //     {
    //       id: "1",
    //       firstName: "John",
    //       lastName: "Doe",
    //       email: "charan@gmail.com",
    //     },
    //   ],
    //   success: true,
    // };
    dispatch({
      type: JOB_TOP_APPLICANTS_SUCCESS,
      payload: { topApplicants, success: true },
    });
  } catch (error) {
    dispatch({
      type: JOB_TOP_APPLICANTS_FAIL,
      payload: error.response.data.error,
    });
  }
};
