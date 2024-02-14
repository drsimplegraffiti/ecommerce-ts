"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express")); // this will enable autocompletion for express and types for req and res
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
//initialize prisma client
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", routes_1.default);
//initialize prisma client
exports.prismaClient = new client_1.PrismaClient({
    log: ["query", "info", "warn"],
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`;
                }
            }
        }
    }
});
exports.prismaClient.$connect().then(() => {
    console.log("Database connected!");
});
app.use(errors_1.errorMiddleware);
const port = Number(secrets_1.PORT) || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
