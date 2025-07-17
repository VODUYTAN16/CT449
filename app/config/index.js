const config = {
  app: {
    port: process.env.PORT || 3000,
    db: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/htqlsach',
    jwt_secret:
      process.env.JWT_SECRET ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  },
  STATUS: {
    OVERDUE: 0,
    BORROWING: 1,
    RETURNED: 2,
    REQUESTED: 3,
    LOST: 4,
  },
};

module.exports = config;
