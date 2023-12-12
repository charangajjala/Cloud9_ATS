const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  // endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

// exports.signup = async (req, res, next) => {
//     const { email } = req.body;
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//         return next(new ErrorResponse("E-mail already registred", 400));
//     }
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json({
//             success: true,
//             user
//         })
//     } catch (error) {
//         next(error);
//     }
// }

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const params = {
    TableName: "users",
    FilterExpression: "#attribute = :value",
    ExpressionAttributeNames: {
      "#attribute": "email",
    },
    ExpressionAttributeValues: {
      ":value": email,
    },
  };

  try {
    // const dynamodb = new AWS.DynamoDB.DocumentClient();
    const userExist = await dynamodb.scan(params).promise();
    console.log("here");
    console.log(userExist);

    if (userExist.Count > 0) {
      return next(new ErrorResponse("E-mail already registered", 400));
    }

    const encrypted_password = await bcrypt.hash(password, 10);
    console.log(encrypted_password);
    // Create a new user
    const new_user = {
      ...req.body,
      password: encrypted_password,
      role: 0,
      id: uuidv4(),
    };
    const newUserParams = {
      TableName: "users",
      Item: new_user,
      // Assuming the structure of req.body matches the DynamoDB schema
    };

    await dynamodb.put(newUserParams).promise();

    res.status(201).json({
      success: true,
      user: new_user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// exports.signin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     //validation
//     if (!email) {
//       return next(new ErrorResponse("please add an email", 403));
//     }
//     if (!password) {
//       return next(new ErrorResponse("please add a password", 403));
//     }

//     //check user email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return next(new ErrorResponse("invalid credentials", 400));
//     }
//     //check password
//     const isMatched = await user.comparePassword(password);
//     if (!isMatched) {
//       return next(new ErrorResponse("invalid credentials", 400));
//     }

//     sendTokenResponse(user, 200, res);
//   } catch (error) {
//     next(error);
//   }
// };

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return next(new ErrorResponse("Please add an email", 403));
    }
    if (!password) {
      return next(new ErrorResponse("Please add a password", 403));
    }

    // Initialize DynamoDB Document Client

    // Check user email in DynamoDB
    const params = {
      TableName: "users",
      FilterExpression: "#attribute = :value",
      ExpressionAttributeNames: {
        "#attribute": "email",
      },
      ExpressionAttributeValues: {
        ":value": email,
      },
    };
    // const dynamodb = new AWS.DynamoDB.DocumentClient();
    const queryResult = await dynamodb.scan(params).promise();

    if (queryResult.Items.length === 0) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    const user = queryResult.Items[0];

    // Check password using bcrypt
    const isMatched = await bcrypt.compare(password, user.password); // Assuming the password is stored securely with bcrypt

    if (!isMatched) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    sendTokenResponse(user, 200, res); // Function to send token response
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
  res
    .status(codeStatus)
    .cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({
      success: true,
      role: user.role,
      id: user.id,
    });
};

// log out
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "logged out",
  });
};

// // user profile
// exports.userProfile = async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("-password");

//   res.status(200).json({
//     success: true,
//     user,
//   });
// };

exports.userProfile = async (req, res, next) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "users", // Replace with your DynamoDB table name for users
      Key: {
        id: req.user.id, // Assuming userId is the key for users
      },
    };

    const result = await docClient.get(params).promise();

    if (!result.Item) {
      return next(new ErrorResponse("User not found", 404));
    }

    const user = result.Item;
    delete user.password; // Assuming 'password' is stored and needs to be excluded
    console.log("user profile", user);

    const appliedJobsParams = {
      TableName: "applyjobs",
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": req.user.id,
      },
    };
    const appliedJobsResult = await docClient.scan(appliedJobsParams).promise();

    console.log("appliedJobsResult", appliedJobsResult);

    if (!appliedJobsResult.Items || appliedJobsResult.Items.length === 0) {
      return res.status(200).json({
        success: true,
        user: {
          ...user,
          jobsHistory: [], // No jobs applied yet
        },
      });
    }

    const jobIds = appliedJobsResult.Items.map((item) => item.jobId);

    const jobsPromises = jobIds.map(async (jobId) => {
      const jobParams = {
        TableName: "jobs",
        Key: {
          id: jobId,
        },
      };

      const jobResult = await docClient.get(jobParams).promise();
      return jobResult.Item;
    });

    const jobDetails = await Promise.all(jobsPromises);

    const userWithJobHistory = {
      ...user,
      jobsHistory: jobDetails.filter((job) => job), // Filtering out null items
    };

    res.status(200).json({
      success: true,
      user: userWithJobHistory,
    });
  } catch (error) {
    next(error);
  }
};
