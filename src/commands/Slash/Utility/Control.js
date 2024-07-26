const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Guild = require("../../../settings/models/Guild.js");

module.exports = {
    name: "control",
    description: "Mostrar u ocultar el botón de control del reproductor. [Premium]",
    category: "Utility",
    options: [
        {
            name: "mode",
            description: "Elija mostrar u ocultar",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Display",
                    value: "display",
                },
                {
                    name: "Hide",
                    value: "hide",
                },
            ],
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: ["ManageGuild"],
    },
    settings: {
        inVc: false,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const choice = interaction.options.getString("mode");

        let data = await Guild.findOne({ Id: interaction.guild.id });
        const control = data.playerControl;

        if (choice === "display") {
            if (control === "enable") {
                const embed = new EmbedBuilder().setDescription(`\`🔴\` | Control ya ajustado a: \`Habilitado\``).setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }

            data.playerControl = "enable";

            await data.save();

            const embed = new EmbedBuilder().setDescription(`\`🔵\` | El control se ha establecido en: \`Habilitado\``).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }

        if (choice === "hide") {
            if (control === "disable") {
                const embed = new EmbedBuilder().setDescription(`\`🔴\` | Control ya ajustado a: \`Desactivado\``).setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }

            data.playerControl = "disable";

            await data.save();

            const embed = new EmbedBuilder().setDescription(`\`🔵\` | El control se ha establecido en: \`Desactivado\``).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
