"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./Routes/user"));
const post_1 = __importDefault(require("./Routes/post"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const routes = (0, express_1.Router)();
app.use(routes);
//Connect db
try {
    mongoose_1.default.connect(process.env.MONGO_URI);
}
catch (e) {
    console.log(e);
}
;
//Routes
routes.use("/user/", user_1.default);
routes.use("/post/", post_1.default);
app.get("/", (req, res) => {
    res.status(200).json("Test Successful!");
});
app.listen(8080, () => console.log("Server Running..."));
