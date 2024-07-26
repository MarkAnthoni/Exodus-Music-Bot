const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "disconnect",
    description: "Fuerza la desconexión del bot de tu canal de voz.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: ["ManageGuild"],
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

        await player.stop()

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`👋\` | El usuario ha sido: \`Desconectato\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
