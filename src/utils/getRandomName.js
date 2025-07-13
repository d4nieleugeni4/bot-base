module.exports.getRandomName = function () {
  return Math.random().toString(36).substring(2, 15);
};
