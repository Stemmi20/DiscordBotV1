import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a Reminder!')
        .addNumberOption(option => 
            option.setName('days')
                .setDescription('Days to set the reminder for')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('hours')
                .setDescription('Hours to set the reminder for')
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName('minutes')
                .setDescription('Minutes to set the reminder for')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('seconds')
                .setDescription('Seconds to set the reminder for')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const days = interaction.options.getNumber('days', true);
        const hours = interaction.options.getNumber('hours', true);
        const minutes = interaction.options.getNumber('minutes', true);
        const seconds = interaction.options.getNumber('seconds', true);
        await interaction.reply( {content: `Reminder Started: ${days}Days, ${hours}Hours, ${minutes}Minutes and ${seconds}Seconds`, ephemeral: true});
        setTimeout(() => {
            interaction.followUp({content: `Reminder Ended: ${days}Days, ${hours}Hours, ${minutes}Minutes and ${seconds}Seconds`, ephemeral: true});
        }, days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
    }
}