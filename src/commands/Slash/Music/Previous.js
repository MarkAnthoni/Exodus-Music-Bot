const { EmbedBuilder } = require("discord.js");
const Guild = require("../../../settings/models/Guild.js");

module.exports = {
    name: "previous",
    description: "Return to the previous song.",
    category: "Music",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: true,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        const data = await Guild.findOne({ Id: interaction.guild.id });
        const control = data.playerControl;

        // When button control "enable", this will make command unable to use. You can delete this
        if (control === "enable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | No se puede utilizar este comando ya que el control del usuario estaba habilitado!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        if (!player.previousTrack) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | La canción anterior era: \`No encontrado\``).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }

        await player.queue.unshift(player.previousTrack);
        await player.skip();

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`⏮️\` | Song has been: \`Previoused\``);

        return interaction.editReply({ embeds: [embed] });
    },
};
