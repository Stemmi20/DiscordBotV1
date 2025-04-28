import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

const tempData: {
  lastFetch: number;
  data: {
    approximate_member_count: number;
    approximate_presence_count: number;
  };
} = {
  lastFetch: 0,
  data: { approximate_member_count: 0, approximate_presence_count: 0 },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discordmembers")
    .setDescription(
      "Shows how many People are on the Server and how many online!"
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const current = await interaction.guild?.fetch();
    await interaction.reply({
      content: `Members online: ${current?.approximatePresenceCount} of ${current?.approximateMemberCount}.`,
    });
  },
};
