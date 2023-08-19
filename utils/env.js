const {
  PORT = 3001,
  DB = "mongodb://127.0.0.1:27017/bitfilmsdb",
  JWT = process.env.JWT_SECRET || "devSecretKey",
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT,
};
