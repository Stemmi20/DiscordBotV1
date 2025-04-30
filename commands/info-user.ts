import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info-user")
    .setDescription("Info About User!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.user;
    const embed = new EmbedBuilder();
    embed
      .setTitle("StemmiBot User-Info")
      .setColor(user.accentColor || 0x0099ff)
      .setThumbnail(user.avatarURL() || "")
      .setDescription(
        `**User:** ${user}
**Tag:** \`${user.tag}\`
**Discriminator:** \`${user.discriminator}\`
**ID:** \`${user.id}\`
**Username:** \`${user.username}\`
**Accent Color:** ${user.accentColor}

**Badges:**
${user.flags?.toArray().join(", ") || "None"}

**Created At:**
<t:${Math.round(user.createdTimestamp / 1000)}:F>
`
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
