const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  // endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

// check is user is authenticated
// exports.isAuthenticated = async (req, res, next) => {
//     const { token } = req.cookies;
//     // Make sure token exists
//     if (!token) {
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();

//     } catch (error) {
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }
// }

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token", token);
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    // Initialize DynamoDB Document Client

    // Check if user with decoded ID exists in DynamoDB
    const params = {
      TableName: "users",
      Key: {
        id: decoded.id,
      },
    };

    const user = await dynamodb.get(params).promise();

    console.log("user", user);

    if (!user.Item) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    console.log("user", user);

    req.user = user.Item; // Assuming the user details are stored in the 'Item' attribute
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

//middleware for admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next(new ErrorResponse("Access denied, you must an admin", 401));
  }
  next();
};
