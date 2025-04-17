import { REST, Routes } from "discord.js";
import { clientId, token } from "./config.json";
import fs from "node:fs";
import path from "node:path";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const file of commandFolders) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data: any = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
