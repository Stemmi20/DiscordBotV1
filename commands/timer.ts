import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Set a Timer!')
        .addNumberOption(option => 
            option.setName('minutes')
                .setDescription('Minutes to set the timer for')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('seconds')
                .setDescription('Seconds to set the timer for')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const minutes = interaction.options.getNumber('minutes', true);
        const seconds = interaction.options.getNumber('seconds', true);
        await interaction.reply( {content: `Timer Started: ${minutes}Minutes and ${seconds}Seconds`, ephemeral: true});
        setTimeout(() => {
            interaction.followUp({content: `Timer Ended: ${minutes}Minutes and ${seconds}Seconds`, ephemeral: true});
        }, minutes * 60 * 1000 + seconds * 1000);
    }
}