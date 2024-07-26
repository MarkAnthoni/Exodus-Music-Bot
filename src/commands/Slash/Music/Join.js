const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "join",
    description: "Invita a un bot a tu canal de voz.",
    category: "Music",
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
        await interaction.deferReply({ ephemeral: false });

        if (player) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Ya me he unido a un canal de voz.`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (!player) {
            player = await client.ruvyrias.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                region: interaction.member.voice.channel.rtcRegion || undefined,
                deaf: true,
            });

            await player.connect();

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`☑️\` | Joined to ${interaction.member.voice.channel.toString()}`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
