"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const swagger_json_1 = __importDefault(require("./assets/swagger.json"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//Middleware
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: ["http://vwebgama:8093", "http://vwebgama:5002", "http://localhost:5001", "http://localhost:5002"],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({}));
//Routes
app.get("/api/v1", (req, res) => {
    res.json({ message: "Bienvenido a la REST API de Peña Colorada" });
});
app.use("/api/v1/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use("/api/v1/grata", routes_1.default.grataRouter);
app.use("/api/v1/workers", routes_1.default.workersGrataRouter);
app.use("/api/v1/auth", routes_1.default.authRouter);
app.use("/api/v1/period", routes_1.default.periodRouter);
//Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
