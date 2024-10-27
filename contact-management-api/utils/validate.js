import * as yup from 'yup';

export const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

export const contactSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    address: yup.string().optional(),
    timezone: yup.string().optional(),
});
