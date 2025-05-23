import { Collection, Events, MessageFlags, Sticker } from "discord.js";

import fs from "node:fs";
import path from "node:path";
import { Client } from "discord.js";
import { token } from "./config.json";

const client = new Client({ intents: [] });

client.login(token);

console.log("Discord Bot is running...");

const commands = new Collection<string, {execute: (...args: any) => void}>();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const file of commandFolders) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});
