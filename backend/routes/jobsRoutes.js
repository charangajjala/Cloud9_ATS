const express = require("express");
const router = express.Router();
const {
  createJob,
  singleJob,
  updateJob,
  showJobs,
  applyJob,
  uploadResume,
  checkIfApplied,
  deleteJob,
} = require("../controllers/jobsController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const multer = require("multer");

//jobs routes

// /api/job/create
router.post("/job/create", isAuthenticated, isAdmin, createJob);

router.post("/job/check/applied", isAuthenticated, checkIfApplied);

router.post(
  "/upload/resume/:job_id",
  isAuthenticated,
  multer().single("resume"),
  uploadResume
);

router.post("/apply/job/:job_id", isAuthenticated, applyJob);
// /api/job/id
router.get("/job/:id", singleJob);
// /api/job/update/job_id
router.put("/job/update/:job_id", isAuthenticated, isAdmin, updateJob);
// /api/jobs/show
router.get("/jobs/show", showJobs);

router.delete("/job/delete/:id", isAuthenticated, isAdmin, deleteJob);

module.exports = router;
