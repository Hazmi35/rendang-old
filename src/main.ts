import { useDotEnv } from "./config";
import { config as loadDotEnv } from "dotenv";
import Client from "./structures/Rendang";

if (useDotEnv) loadDotEnv();

new Client({ disableMentions: "everyone" })
    .build(process.env.DISCORD_TOKEN!);