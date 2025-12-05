import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  CONNECTION_DB: process.env.CONNECTION_DB,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
