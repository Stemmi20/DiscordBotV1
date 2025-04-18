import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("execute")
    .setDescription("Execute a Command!"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: `executed`, ephemeral: true });
    console.log("executed");
    const channel = interaction.client.channels.cache.get(
      "1176114138074845254"
    ) as TextChannel;
    console.log("channel is text based");
    channel.send({
      content: "Take Your Self Roles",
      components: [
        // @ts-expect-error
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("1084829210805289061")
            .setLabel("Apex Legends")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084829388933185576")
            .setLabel("Ark Survival Evolved")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084834945442271292")
            .setLabel("Assetto Corsa")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084835145225355354")
            .setLabel("Battlefiel")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084829814621478972")
            .setLabel("CS GO")
            .setStyle(ButtonStyle.Primary)
        ),
        // @ts-expect-error
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("1084835281632501870")
            .setLabel("Descenders")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084835275009703936")
            .setLabel("Fernbus Sim")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084834756581150720")
            .setLabel("Fortnite")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084846702923624528")
            .setLabel("Genschin Impact")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084835071124586587")
            .setLabel("GTA 5")
            .setStyle(ButtonStyle.Primary)
        ),
        // @ts-expect-error
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("1084827948999262239")
            .setLabel("Overwatch")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084827855399157760")
            .setLabel("Minecraft")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084829872062472273")
            .setLabel("Raft")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084835219649073182")
            .setLabel("Rust")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084828055547170949")
            .setLabel("Rocket League")
            .setStyle(ButtonStyle.Primary)
        ),
        // @ts-expect-error
        new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("1084830125167738940")
            .setLabel("Steep")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084827752315756705")
            .setLabel("Valorant")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1084834834318364763")
            .setLabel("BeamnG")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("1081234422801637518")
            .setLabel("WoT")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  },
};
