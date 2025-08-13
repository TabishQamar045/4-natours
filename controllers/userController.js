const User=require('../models/userModel');
const AppError = require('../utils/appError');
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};
exports.getUser = async(req, res,next) => {
  const user=await User.findById(req.params.id)
  if(!user){
    next(new AppError(`No user found with this id ${req.params.id}`,404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

exports.createUser = async (req, res) => {
  const newUser=await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};
exports.updateUser = async(req, res) => {
  const user=await User.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })
  if(!user){
    return next(new AppError('No user found with this id',404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};
exports.deleteUser = async(req, res,next) => {
  const deleteUser=await User.findByIdAndDelete(req.params.id)
  if(!deleteUser){
    return next(new AppError('No user found with this id',404))
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
