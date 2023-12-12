import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

const ApplyJob = () => {
  // const { userInfo } = useSelector((state) => state.signIn);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    personalEmail: "",
    dateOfBirth: "",
    skills: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, resume: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resumeData = new FormData();
    resumeData.append("resume", formData.resume);

    console.log("Resume Data:", resumeData);

    try {
      // Save resume document to S3 bucket
      const uploadResponse = await axios.post(
        `/api/upload/resume/${id}`,
        resumeData
      );

      if (!uploadResponse.data.success) {
        throw new Error("Error uploading resume");
      }

      const documentId = uploadResponse.data.documentId;

      // Save form data along with resume ID
      const formDataWithResume = {
        ...formData,
        resumeId: documentId,
      };

      const saveFormDataResponse = await axios.post(
        `/api/apply/job/${id}`,
        formDataWithResume
      );

      if (!saveFormDataResponse.data.success) {
        throw new Error("Error saving form data");
      }

      console.log("Form Data Saved Successfully!");
      toast.success("Job Applied Successfully!");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const formStyle = {
    backgroundColor: "#ffffff" /* White background */,
    padding: "20px",
    width: "300px",
    margin: "20px auto",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#333" /* Dark text color */,
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    border: "1px solid #ccc" /* Light gray border */,
    borderRadius: "4px",
  };

  const fileInputStyle = {
    marginTop: "8px",
  };

  const buttonStyle = {
    backgroundColor: "#3498db" /* Blue button color */,
    color: "#ffffff" /* White text color */,
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#2980b9" /* Darker blue on hover */,
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <label style={labelStyle}>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Personal Email:
        <input
          type="email"
          name="personalEmail"
          value={formData.personalEmail}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Date of Birth:
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Skills:
        <input
          type="text"
          name="skills"
          value={formData.skills}
          style={inputStyle}
          onChange={handleChange}
        />
      </label>

      <label style={labelStyle}>
        Resume:
        <input
          type="file"
          name="resume"
          style={{ ...inputStyle, ...fileInputStyle }}
          onChange={handleFileChange}
        />
      </label>

      <button
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style = buttonHoverStyle)}
        onMouseOut={(e) => (e.target.style = buttonStyle)}
        type="submit"
        onSubmit={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default ApplyJob;
