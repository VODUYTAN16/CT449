class ApiError extends Error {
  constructor(statusCode, message) {
    super(); // Truyền message vào lớp cha
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ApiError;
