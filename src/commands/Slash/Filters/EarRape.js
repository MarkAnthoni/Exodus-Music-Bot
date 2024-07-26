const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
    name: "earrape",
    description: "Establece el filtro del reproductor actual en Violación de oídos.",
    category: "Filters",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        await player.setVolume(500);

        const embed = new EmbedBuilder().setDescription(`\`🔩\` | El filtro se ha ajustado a: \`EarRape\``).setColor(client.color);

        await delay(2000);
        return interaction.editReply({ embeds: [embed] });
    },
};
