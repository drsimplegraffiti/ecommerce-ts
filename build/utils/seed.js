"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
//seed data
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < 10; i++) {
        yield __1.prismaClient.user.create({
            data: {
                email: `user-${i}-one@yopmail.com`,
                name: `user-${i}-one`,
                password: "password",
            },
        });
    }
});
seedData().then(() => {
    console.log("seeded data");
    process.exit(0); //exit the process after seeding data, 0 means success
}).catch((error) => {
    console.log(error);
    process.exit(1); //exit the process after seeding data, 1 means failure
});
//remove all .js file usin bash command
// convert tsx to js
// rm -rf src/**/*.js
