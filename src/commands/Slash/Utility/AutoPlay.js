const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "autoplay",
    description: "Reproducción automática aleatoria de canciones relacionadas.",
    category: "Utility",
    permissions: {
        bot: [],
        channel: [],
        user: ["ManageGuild"],
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

        const currentsong = player.currentTrack.info;

        const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(currentsong.uri);

        if (!ytUri) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | La función de reproducción automática sólo es compatible con YouTube!`).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        }

        if (player.autoplay === true) {
            player.autoplay = false;

            await player.queue.clear();

            const embed = new EmbedBuilder().setDescription(`\`🔴\` | La reproducción automática se ha: \`Desactivado\``).setColor(client.color);

            return interaction.editReply({ embeds: [embed] });
        } else {
            player.autoplay = true;

            if (ytUri) {
                const identifier = currentsong.identifier;
                const search = `https://music.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                const res = await client.ruvyrias.resolve({ query: search, source: "ytmsearch", requester: interaction.user });

                await player.queue.add(res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]);

                const embed = new EmbedBuilder().setDescription(`\`🔵\` | La reproducción automática se ha: \`Habilitado\``).setColor(client.color);

                return interaction.editReply({ embeds: [embed] });
            }
        }
    },
};
