import { withZodSchema } from 'formik-validator-zod';
import z from 'zod';


export const signUpInputSchema = withZodSchema(z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[0-9]/, { message: 'Password must be at least 8 characters long and contain one number and one special character' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must be at least 8 characters long and contain one number and one special character'}),
    passwordAgain: z.string().min(1, { message: 'Required' }),
}).superRefine((val, ctx) => {
    if (val.password !== val.passwordAgain) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must be the same',
            path: ['passwordAgain'],
        })
    }
}))

export const signInInputSchema = withZodSchema(z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[0-9]/, { message: 'Password must be at least 8 characters long and contain one number and one special character' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must be at least 8 characters long and contain one number and one special character'}),
}))

export const editProfileInputSchema = withZodSchema(z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    bio: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    profilePicture: z.string().url().min(1, { message: 'Required' }).optional().or(z.literal('')),
    headerPicture: z.string().url().optional().or(z.literal('')),
    profession: z.string().optional().or(z.literal('')),
    skills: z.array(z.union([z.string(), z.object({ name: z.string() })])).optional(),
    currentPassword: z.string().optional().or(z.literal('')),
    newPassword: z.string().optional().or(z.literal('')),
}).superRefine((val, ctx) => {
    const currentPasswordProvided = val.currentPassword && val.currentPassword.length > 0;
    const newPasswordProvided = val.newPassword && val.newPassword.length > 0;

    if (currentPasswordProvided || newPasswordProvided) {
        if (!currentPasswordProvided) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Current password is required when changing password', path: ['currentPassword'],
            });
        }
        if (!newPasswordProvided) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'New password is required when changing password',
                path: ['newPassword'],
            });
        } else {
            if (val.newPassword && val.newPassword.length < 8) {
                ctx.addIssue({code: z.ZodIssueCode.too_small, minimum: 8, type: 'string', inclusive: true, message: 'New password must be at least 8 characters long', path: ['newPassword'],});
            }
            if (!/[0-9]/.test(val.newPassword ?? "")) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'New password must contain at least one number', path: ['newPassword'],});
            }
            if (!/[^a-zA-Z0-9]/.test(val.newPassword ?? "")) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'New password must contain at least one special character', path: ['newPassword'],});}
        }
    }
}));


type Skill = { _id: string; name: string };
export interface userFields {
    name: string; email: string; bio: string; location: string; profilePicture: string; headerPicture: string; profession: string; skills: Skill[]; currentPassword: string; newPassword: string;
}

export const skillRequestInputSchema = withZodSchema(z.object({
    skillOffered: z.string().min(1, { message: 'What skill can you offer?' }),
    skillRequested: z.string().min(1, { message: 'What skill do you want to get?' }),
    description: z.string().min(10, { message: 'Description should be at least 10 characters' }),
}));