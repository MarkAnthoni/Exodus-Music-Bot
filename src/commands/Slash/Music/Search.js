const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const formatDuration = require("../../../structures/FormatDuration.js");

module.exports = {
    name: "search",
    id: "1222375266144223312",
    description: "Busca tu canción favorita.",
    category: "Music",
    options: [
        {
            name: "query",
            description: "Indique el nombre de la canción que desea buscar.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissions: {
        bot: ["Speak", "Connect"],
        channel: ["Speak", "Connect"],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        const query = interaction.options.getString("query");

        if (player && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            const warning = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | Debes estar en el mismo canal de voz que el mío para utilizar este comando.`)
                .setTimestamp();

            return interaction.reply({ embeds: [warning], ephemeral: true });
        }

        if (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(query)) {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` | Utilice \`/play\` comando de búsqueda de url.`)
                .setColor(client.color);

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });

        const res = await client.ruvyrias.resolve({ query: query, requester: interaction.user });
        const { tracks } = res;

        const results = tracks.slice(0, 10);

        let n = 0;

        const str = tracks
            .slice(0, 10)
            .map(
                (r) =>
                    `\`${++n}.\` **[${r.info.title.length > 20 ? r.info.title.substr(0, 25) + "..." : r.info.title}](${r.info.uri})** • ${
                        r.info.author
                    }`,
            )
            .join("\n");

        const selectMenuArray = [];

        for (let i = 0; i < results.length; i++) {
            const track = results[i];

            let label = `${i + 1}. ${track.info.title}`;

            if (label.length > 50) label = label.substring(0, 47) + "...";

            selectMenuArray.push({
                label: label,
                description: track.info.author,
                value: i.toString(),
            });
        }

        const selection = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("search")
                .setPlaceholder("Seleccione aquí su canción")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(selectMenuArray),
        ]);

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Menú de selección de búsqueda", iconURL: interaction.member.displayAvatarURL({}) })
            .setDescription(str)
            .setColor(client.color)
            .setFooter({ text: `Tiene 30 segundos para hacer su selección a través del menú desplegable.` });

        await interaction.editReply({ embeds: [embed], components: [selection] }).then((message) => {
            let count = 0;

            const selectMenuCollector = message.createMessageComponentCollector({ time: 30000 });
            const toAdd = [];

            try {
                selectMenuCollector.on("collect", async (menu) => {
                    if (menu.user.id !== interaction.member.id) {
                        const unused = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Este menú no es para ti!`);

                        return menu.reply({ embeds: [unused], ephemeral: true });
                    }

                    menu.deferUpdate();

                    if (!player) {
                        player = await client.ruvyrias.createConnection({
                            guildId: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            deaf: true,
                        });
                    }

                    if (player.state !== "CONNECTED") player.connect();

                    for (const value of menu.values) {
                        toAdd.push(tracks[value]);
                        count++;
                    }

                    for (const track of toAdd) {
                        player.queue.add(track);
                    }

                    const track = toAdd.shift();
                    const trackTitle = track.info.title.length > 15 ? track.info.title.substr(0, 15) + "..." : track.info.title;

                    const tplay = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `\`➕\` | **[${trackTitle ? trackTitle : "Unknown"}](${track.info.uri})** • \`${
                                track.info.isStream ? "LIVE" : formatDuration(track.info.length)
                            }\` • ${interaction.user}`,
                        );

                    await message.edit({ embeds: [tplay], components: [] });
                    if (!player.isPlaying && !player.isPaused) return player.play();
                });

                selectMenuCollector.on("end", async (collected) => {
                    if (!collected.size) {
                        const timed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Se a agotado el tiempo.`);

                        return message.edit({ embeds: [timed], components: [] });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    },
};
