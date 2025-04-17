import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Interaction,
  ChatInputCommandInteraction,
} from "discord.js";
import { status } from "minecraft-server-util";

const SERVER_IP = "195.201.243.96";
const SERVER_PORT = 25565;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("minecraftserverstatus")
    .setDescription("Check the Minecraftserver status!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const response = await status(SERVER_IP, SERVER_PORT);
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "minecraftserverstatus") {
      await interaction.deferReply();
      try {
        const response = await status(SERVER_IP, SERVER_PORT);
        await interaction.editReply(
          `✅ Server is online with ${response.players.online}/${response.players.max} players.`
        );
      } catch (error) {
        await interaction.editReply("❌ Server is offline or unreachable.");
      }
    }
  },
};
