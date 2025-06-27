// File: config/swagger.js

import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial Applications API",
      version: "1.0.0",
      description: "API documentation for Financial Applications backend",
    },
    servers: [
      {
        url: "https://financial-applications.onrender.com", // for production
      },
      {
        url: "http://localhost:5001", // for local testing
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
