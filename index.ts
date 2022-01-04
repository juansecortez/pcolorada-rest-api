import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import morgan from "morgan";
import routes from "./routes";
import jsonSwagger from './assets/swagger.json'

//Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `${process.env.URL_CLIENT}`,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

//Routes
app.get("/api/v1", (req, res) => {
  res.json({ msg: "Bienvenido a la REST API de Peña Colorada" });
});
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(jsonSwagger));
app.use("/api/v1/grata", routes.grataRouter);
app.use("/api/v1/workers", routes.workersGrataRouter);
app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/solicitudes", routes.solicitudesRouter);
app.use("/api/v1/red-ascenso", routes.redAscensoRouter);

//Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
