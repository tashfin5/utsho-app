const User = require("../models/User");

const generateUserId = async (role) => {
  const prefix = role === "teacher" ? "T" : "S";

  const users = await User.find({ role });

  const numbers = users
    .map(u => {
      if (!u.userId) return null;
      return parseInt(u.userId.replace(prefix, ""));
    })
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);

  let nextNumber = 1001;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== nextNumber) break;
    nextNumber++;
  }

  return prefix + nextNumber;
};

module.exports = generateUserId;