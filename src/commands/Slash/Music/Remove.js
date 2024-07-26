const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Eliminar una canción de la cola.",
    category: "Music",
    options: [
        {
            name: "position",
            description: "Posición de la canción.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        const track = interaction.options.getNumber("position");

        if (track > player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | No se ha encontrado la canción`);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.remove(track - 1);

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`☑️\` | La canción ha sido: \`Removido\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
