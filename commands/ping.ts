import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Time to Responde!'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply( {content: `ping: ${interaction.client.ws.ping}ms`, ephemeral: true});
    }
}