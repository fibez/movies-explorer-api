const corsSettings = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://aeliseevdiploma.nomoredomains.xyz",
    "http:aeliseevdiploma.nomoredomains.xyz",
  ],
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = {
  corsSettings,
};
