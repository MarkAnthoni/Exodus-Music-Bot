const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
    name: "vaporwave",
    description: "Establece el filtro del reproductor actual en Vaporwave.",
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

        await player.filters.setVaporwave(true);

        const embed = new EmbedBuilder().setDescription(`\`🔩\` | Filter has been set to: \`Vaporwave\``).setColor(client.color);

        await delay(2000);
        return interaction.editReply({ embeds: [embed] });
    },
};
