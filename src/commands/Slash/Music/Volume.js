const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Guild = require("../../../settings/models/Guild.js");

module.exports = {
    name: "volume",
    description: "Ajustar el volumen del reproductor actual.",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "El número de volumen que desea establecer.",
            type: ApplicationCommandOptionType.Number,
            required: false,
            min_value: 1,
            max_value: 100,
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

        const data = await Guild.findOne({ Id: interaction.guild.id });
        const control = data.playerControl;

        // When button control "enable", this will make command unable to use. You can delete this
        if (control === "enable") {
            const ctrl = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | No se puede utilizar este comando ya que el control del usuario estaba habilitado!`);
            return interaction.editReply({ embeds: [ctrl] });
        }

        const value = interaction.options.getNumber("amount");

        if (!value) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | Current player volume: \`${player.volume}%\``);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await player.setVolume(value);

            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`🔊\` | Volume has been set to: \`${value}%\``);

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
