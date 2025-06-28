import app from "./app.js";
import looger from "./logs/logger.js";
import 'dotenv/config.js';
import config from "./config/env.js";
import { sequelize } from "./database/database.js";

async function main() {
    await sequelize.sync({ force: false });
    looger.info("Database connected successfully");
    app.listen(config.PORT);
    looger.info(`Server is running on port ${process.env.PORT || 3001}`); 
}

main();