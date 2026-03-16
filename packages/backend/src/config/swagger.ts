import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.PORT || 4000;
const servers = [
  {
    url: `http://localhost:${port}`,
    description: "Локальный сервер",
  },
];

// В production добавляем публичный URL
if (process.env.PUBLIC_API_URL) {
  servers.unshift({
    url: process.env.PUBLIC_API_URL,
    description: "Production сервер",
  });
}

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Techno-Dom API",
      version: "1.0.0",
      description: "API интернет-магазина Techno-Dom",
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
