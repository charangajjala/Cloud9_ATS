const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  // endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient();

//load all users
// exports.allUsers = async (req, res, next) => {
//   //enable pagination
//   const pageSize = 10;
//   const page = Number(req.query.pageNumber) || 1;
//   const count = await User.find({}).estimatedDocumentCount();

//   try {
//     const users = await User.find()
//       .sort({ createdAt: -1 })
//       .select("-password")
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     res.status(200).json({
//       success: true,
//       users,
//       page,
//       pages: Math.ceil(count / pageSize),
//       count,
//     });
//     next();
//   } catch (error) {
//     return next(error);
//   }
// };

exports.allUsers = async (req, res, next) => {
  const params = {
    TableName: "users",
  };

  try {
    const usersData = await dynamodb.scan(params).promise();
    const users = usersData.Items || [];

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

// //show single user
// exports.singleUser = async (req, res, next) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.status(200).json({
//             success: true,
//             user
//         })
//         next();

//     } catch (error) {
//         return next(error);
//     }
// }

exports.singleUser = async (req, res, next) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "users", // Replace with your DynamoDB table name for users
      Key: {
        id: req.params.id, // Assuming userId is the key for users
      },
    };

    const result = await docClient.get(params).promise();

    if (!result.Item) {
      return next(new ErrorResponse("User not found", 404));
    }

    const user = result.Item;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//edit user
exports.editUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// //delete user
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndRemove(req.params.id);
//     res.status(200).json({
//       success: true,
//       message: "user deleted",
//     });
//     next();
//   } catch (error) {
//     return next(error);
//   }
// };

exports.deleteUser = async (req, res, next) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  try {
    const params = {
      TableName: "users",
      Key: {
        id: req.params.id, // Assuming 'userId' is the key attribute name in your DynamoDB table
      },
    };

    await docClient.delete(params).promise();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//jobs history
exports.createUserJobsHistory = async (req, res, next) => {
  const { title, description, salary, location } = req.body;

  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return next(new ErrorResponse("You must log In", 401));
    } else {
      const addJobHistory = {
        title,
        description,
        salary,
        location,
        user: req.user._id,
      };
      currentUser.jobsHistory.push(addJobHistory);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      currentUser,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// exports.createUserJobsHistory = async (req, res, next) => {
//     const { title, description, salary, location } = req.body;

//     try {
//         const docClient = new AWS.DynamoDB.DocumentClient();

//         const params = {
//             TableName: 'users', // Replace with your DynamoDB table name for users
//             Key: {
//                 _id: req.user._id // Assuming userId is the key for users
//             }
//         };

//         const result = await docClient.get(params).promise();

//         if (!result.Item) {
//             return next(new ErrorResponse("You must log in", 401));
//         } else {
//             const currentUser = result.Item;

//             // Create a new job history item
//             const addJobHistory = {
//                 title,
//                 description,
//                 salary,
//                 location,
//                 jobId: 'uniqueJobId', // Unique identifier for the job in history
//                 timestamp: Date.now() // Timestamp or date of the job entry
//             };

//             // Check if the user already has a 'jobsHistory' attribute, if not, initialize it as an empty list
//             if (!currentUser.jobsHistory) {
//                 currentUser.jobsHistory = [];
//             }

//             // Push the new job history item to the list
//             currentUser.jobsHistory.push(addJobHistory);

//             // Update the user's item in the table
//             const updateParams = {
//                 TableName: 'YourUserTable',
//                 Key: {
//                     userId: req.user._id
//                 },
//                 UpdateExpression: 'SET jobsHistory = :h',
//                 ExpressionAttributeValues: {
//                     ':h': currentUser.jobsHistory
//                 },
//                 ReturnValues: 'UPDATED_NEW'
//             };

//             await docClient.update(updateParams).promise();
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Job history added to the user'
//         });

//     } catch (error) {
//         next(error);
//     }
// };
