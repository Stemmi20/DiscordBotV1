import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info-server")
    .setDescription("Info About Server!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.guild!.members.fetch();
    const user = interaction.user;
    const embed = new EmbedBuilder();
    embed
      .setTitle("StemmiBot Server-Info")
      .setColor(user.accentColor || 0x0099ff)
      .setThumbnail(user.avatarURL() || "")
      .setDescription(
        `__Basic Info__
**Server Name:** \`${interaction.guild!.name}\`
**Acronym:** \`${interaction.guild!.nameAcronym}\`
**Server ID:** \`${interaction.guild!.id}\`
**Vanity URL:** ${interaction.guild!.vanityURLCode || "None"}
**Widget Channel:** ${interaction.guild!.widgetChannelId || "None"}
**AFK Channel:** <#${interaction.guild!.afkChannelId || "None"}> / \`${interaction.guild!.channels.cache.get(interaction.guild!.afkChannelId!)?.name}\` / \`${interaction.guild!.afkChannelId!}\`
**System Channel:** <#${interaction.guild!.systemChannelId || "None"}> / \`${interaction.guild!.channels.cache.get(interaction.guild!.systemChannelId!)?.name}\` / \`${interaction.guild!.systemChannelId!}\`
**Rules Channel:** <#${interaction.guild!.rulesChannelId || "None"}> / \`${interaction.guild!.channels.cache.get(interaction.guild!.rulesChannelId!)?.name}\` / \`${interaction.guild!.rulesChannelId!}\`
**Public Updates Channel:** <#${
          interaction.guild!.publicUpdatesChannelId || "None"
        }> / \`${interaction.guild!.channels.cache.get(interaction.guild!.publicUpdatesChannelId!)?.name}\` / \`${interaction.guild!.publicUpdatesChannelId!}\`
**AFK Timeout:** \`${interaction.guild!.afkTimeout} seconds\`
**Owner:** <@${interaction.guild!.ownerId}> / \`${await interaction.guild!.fetchOwner().then((o) => o.user.username)}\` / \`${interaction.user.id}\`
**Description:** ${interaction.guild!.description || "None"}

__Statistics__
**Created At:** <t:${Math.round(interaction.guild!.createdTimestamp / 1000)}:F>
**Member Count:** \`${interaction.guild!.memberCount}\`
**Bots** \`${interaction.guild!.members.cache.filter((m) => m.user.bot).size}\`
**Emojis:** \`${
          interaction
            .guild!.emojis.cache.map((e) => `- ${e.name} (${e.id})`)
            .join("\n") || "None"
        }\`
**Auto-Mod-Rules:** \`${
          interaction
            .guild!.autoModerationRules.cache.map(
              (rule) => `- ${rule.name} (${rule.id})`
            )
            .join("\n") || "None"
        }\`
**Invites:** \`${
          interaction
            .guild!.invites.cache.map(
              (invite) => `- ${invite.code} (${invite.uses})`
            )
            .join("\n") || "None"
        }\`
**Vanity Uses:** \`${interaction.guild!.vanityURLUses || "None"}\`
**Stickers:** \`${
          interaction
            .guild!.stickers.cache.map(
              (sticker) => `- ${sticker.name} (${sticker.id})`
            )
            .join("\n") || "None"
        }\`
**Boosters:** \`${interaction.guild!.premiumSubscriptionCount || "None"}\`
**Boost Level:** \`${interaction.guild!.premiumTier}\`
**Maximum Bitrate:** \`${interaction.guild!.maximumBitrate}\`

__Other Info__
**Default Message Notifications:** \`${
          interaction.guild!.defaultMessageNotifications
            ? interaction.guild!.defaultMessageNotifications.toString()
            : "None"
        }\`
**Explicit Content Filter:** \`${
          interaction.guild!.explicitContentFilter
            ? interaction.guild!.explicitContentFilter.toString()
            : "None"
        }\`
**MFA Level:** \`${
          interaction.guild!.mfaLevel
            ? interaction.guild!.mfaLevel.toString()
            : "None"
        }\`
**Region:** \`${
          interaction.guild!.preferredLocale
            ? interaction.guild!.preferredLocale.toString()
            : "None"
        }\`
**NSFW Level:** \`${
          interaction.guild!.nsfwLevel
            ? interaction.guild!.nsfwLevel.toString()
            : "None"
        }\`
**Verification Level:** \`${
          interaction.guild!.verificationLevel
            ? interaction.guild!.verificationLevel.toString()
            : "None"
        }\`
`
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
