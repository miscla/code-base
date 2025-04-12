const { z } = require('zod');


const userInfoSchema = z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string()
})

const loginSchema = z.object({
    email: z.string(),
    password: z.string()
});

const createTask = z.object({
    userAssign: z.array(userInfoSchema),
    taskName: z.string()
});

module.exports = {
    loginSchema,
    createTask
};
