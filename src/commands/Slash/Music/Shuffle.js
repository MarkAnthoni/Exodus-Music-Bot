const { EmbedBuilder } = require("discord.js");
const Guild = require("../../../settings/models/Guild.js");

module.exports = {
    name: "shuffle",
    description: "Mezclar la reproducción del usuario.",
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
        current: false,
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

        if (!player.queue.length) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Queue was: \`Empty\``);

            return interaction.editReply({ embeds: [embed] });
        } else {
            await player.queue.shuffle();

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔀\` | Queue has been: \`Shuffled\``);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
