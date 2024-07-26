const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
    name: "8d",
    description: "Establece el filtro del usuario actual en 8d.",
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

        await player.filters.set8D(true);

        const embed = new EmbedBuilder().setDescription(`\`🔩\` | El filtro se ha ajustado a: \`8d\``).setColor(client.color);

        await delay(2000);
        return interaction.editReply({ embeds: [embed] });
    },
};
