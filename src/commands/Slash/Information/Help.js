const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { readdirSync } = require("fs");
const { supportUrl, inviteUrl, imageUrl } = require("../../../settings/config.js");

module.exports = {
    name: "help",
    description: "Mostrar todos los comandos del bot.",
    category: "Information",
    permissions: {
        bot: [],
        channel: [],
        user: [],
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
        await interaction.deferReply({ ephemeral: false });

        const row2 = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link))
            .addComponents(new ButtonBuilder().setLabel("Invite").setURL(inviteUrl).setStyle(ButtonStyle.Link));

        const categories = readdirSync("./src/commands/Slash/");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.guild.members.me.displayName} Help Command!`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setColor(client.color)
            .setImage(imageUrl)
            .setDescription(
                `Hola **${interaction.member}**, yo soy **${client.user}**. Un Bot de Música de Discord de Alta Calidad. Soporta Spotify, SoundCloud, Apple Music y otros. Averigüe lo que puedo hacer usando la selección de menú a continuación.`,
            )
            .setFooter({
                text: `© ${client.user.username} | Total Commands: ${client.slashCommands.size}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("help-category")
                .setPlaceholder(`Seleccione comandos de categoría de menú`)
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    categories.map((category) => {
                        return new StringSelectMenuOptionBuilder().setLabel(category).setValue(category);
                    }),
                ),
        ]);

        interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (msg) => {
            let filter = (i) => i.isStringSelectMenu() && i.user && i.message.author.id == client.user.id;

            let collector = await msg.createMessageComponentCollector({
                filter,
                time: 90000,
            });

            collector.on("collect", async (m) => {
                if (m.isStringSelectMenu()) {
                    if (m.customId === "help-category") {
                        await m.deferUpdate();

                        let [directory] = m.values;

                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `${interaction.guild.members.me.displayName} Help Command!`,
                                iconURL: interaction.guild.iconURL({ dynamic: true }),
                            })
                            .setDescription(
                                `Estos son todos los comandos disponibles para esta categoría a utilizar. Pruebe a añadir [\`/\`] antes de los comandos o puede simplemente hacer clic en estos comandos a continuación.\n\n**❯ ${
                                    directory.slice(0, 1).toUpperCase() + directory.slice(1)
                                }:**\n${client.slashCommands
                                    .filter((c) => c.category === directory)
                                    .map((c) => `\`/${c.name}\` : *${c.description}*`)
                                    .join("\n")}`,
                            )
                            .setColor(client.color)
                            .setImage(imageUrl)
                            .setFooter({
                                text: `© ${client.user.username} | Total Commands: ${
                                    client.slashCommands.filter((c) => c.category === directory).size
                                }`,
                                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setTimestamp();

                        msg.edit({ embeds: [embed] });
                    }
                }
            });

            collector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    const timed = new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.guild.members.me.displayName} Help Command!`,
                            iconURL: interaction.guild.iconURL({ dynamic: true }),
                        })
                        .setDescription(
                            `Se ha agotado el tiempo de espera del menú de comandos de ayuda, intente utilizar \`/help\` para volver a mostrar el menú de comandos de ayuda.\n\nMuchas gracias.`,
                        )
                        .setImage(imageUrl)
                        .setColor(client.color)
                        .setFooter({
                            text: `© ${client.user.username} | Total Commands: ${client.slashCommands.size}`,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setTimestamp();

                    msg.edit({ embeds: [timed], components: [row2] });
                }
            });
        });
    },
};
