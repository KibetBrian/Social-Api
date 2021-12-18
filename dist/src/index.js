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
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = __importDefault(require("./Routes/auth"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const routes = (0, express_1.Router)();
//CORS
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('tiny'));
//Passport module
require('./passport');
//Cookie session
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [process.env.COOKIE_PRIVATE_KEY],
    maxAge: 24 * 60 * 60 * 3
}));
//Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Connect db
try {
    mongoose_1.default.connect(process.env.MONGO_URI);
}
catch (e) {
    console.log(e);
}
;
//Routes
app.use(routes);
routes.use("/user/", user_1.default);
routes.use("/post/", post_1.default);
app.use('/auth/', auth_1.default);
app.get("/", (req, res) => {
    res.status(200).json("Test Successful!");
});
app.listen(8080, () => console.log("Server Running..."));
