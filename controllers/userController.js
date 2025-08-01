exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      user: users[req.params.id * 1],
    },
  });
};

exports.createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: req.body,
    },
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.body,
    },
  });
};
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
