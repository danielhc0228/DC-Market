import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// async function test() { // this function creates token by searching and connecting user with id 3.
//     const token = await db.sMSToken.create({
//         data: {
//             token: "121212",
//             user: {
//                 connect: {
//                     id: 3,
//                 },
//             },
//         },
//     });
//     console.log(token);
// }

// async function test() {
//     // this function finds token based on the condition and includes user information e.g. id 1
//     const token = await db.sMSToken.findUnique({
//         where: {
//             id: 1,
//         },
//         include: {
//             user: true,
//         },
//     });
//     // console.log(token);
// }

// test();

export default db;
