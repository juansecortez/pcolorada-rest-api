import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import morgan from "morgan";
import routes from "./routes";
import jsonSwagger from "./assets/swagger.json";
import fileUpload from 'express-fileupload';

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload({}));

//Routes
app.get("/api/v1", (req, res) => {
  res.json({ message: "Bienvenido a la REST API de Peña Colorada" });
});
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(jsonSwagger));
app.use("/api/v1/grata", routes.grataRouter);
app.use("/api/v1/workers", routes.workersGrataRouter);
app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/period", routes.periodRouter);

//Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
