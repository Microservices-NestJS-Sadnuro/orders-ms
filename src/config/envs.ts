import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCTS_MS_HOST: string;
    PRODUCTS_MS_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error('Environment Config Validation Error: ' + error.message);

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    productsMsHost: envVars.PRODUCTS_MS_HOST,
    productsMsPort: envVars.PRODUCTS_MS_PORT,
}