const corsSettings = {
  origin: ['http://127.0.0.1:3000', 'https:защищенныйадресфронта', 'http:обычныйадресфронта'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = {
  corsSettings,
};
