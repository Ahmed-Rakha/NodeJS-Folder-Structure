import { config } from "dotenv";
import { resolve } from "node:path";

export const NODE_ENV = process.env.NODE_ENV;

const NODE_ENV_PATH =
  NODE_ENV === "development"
    ? resolve("./.env.development")
    : resolve("./.env.production");

config({ path: NODE_ENV_PATH });

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
