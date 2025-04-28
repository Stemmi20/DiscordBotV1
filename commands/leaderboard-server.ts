import DataBase from "../database";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard-server")
        .setDescription("Display Leaderboard!"),
    async execute(interaction: ChatInputCommandInteraction) {
        const top25 = await DataBase.level.findMany({
            where: { guildid: interaction.guildId! },
            take: 25,
            orderBy: { xp: "desc" }
        })
        await interaction.guild?.members.fetch();
        const embed = new EmbedBuilder();
        top25.forEach((user, index) => {
            embed.addFields({
                name: `${index + 1}. ${interaction.guild?.members.cache.get(user.userid)?.user.username}`,
                value: `Level: ${user.level} | XP: ${user.xp}`,
                inline: true
            })
        })
        interaction.reply({
            embeds: [
                embed.setTitle("Leaderboard-Server")
                    .setColor("Random")
                    .setDescription("Top 25 Users")
                    .setTimestamp()
            ]
        })
    }
}