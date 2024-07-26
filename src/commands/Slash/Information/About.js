const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { supportUrl, inviteUrl, imageUrl } = require("../../../settings/config.js");
const ms = require("pretty-ms");

module.exports = {
    name: "about",
    description: "Mostrar información sobre el bot.",
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

        const playingPlayers = client.ruvyrias.leastUsedNodes[0].stats.players;
        let uptime = await client.uptime;

        let scount = client.guilds.cache.size;
        let mcount = 0;

        client.guilds.cache.forEach((guild) => {
            mcount += guild.memberCount;
        });

        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setLabel("Support").setURL(supportUrl).setStyle(ButtonStyle.Link))
            .addComponents(new ButtonBuilder().setLabel("Invite").setURL(inviteUrl).setStyle(ButtonStyle.Link));

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.members.me.displayName} Info!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(
                ` Hola **${interaction.member}**, yo soy **${client.user}**. Un Bot de Música de Discord de Alta Calidad. Soporta Spotify, SoundCloud, Apple Music y otros. Descubre lo que puedo hacer usando \`/help\` command.`,
            )
            .addFields([
                { name: `\`🔱\` • Servidores`, value: `\`\`\`Total: ${scount} servers\`\`\``, inline: true },
                { name: `\`👥\` • Usuarios`, value: `\`\`\`Total: ${mcount} users\`\`\``, inline: true },
                { name: `\`🎧\` • Reproductores`, value: `\`\`\`Actualmente utilizado por ${playingPlayers} servidores\n\`\`\``, inline: true },
                { name: `\`📈\` • Tiempo activo`, value: `\`\`\`${ms(uptime)}\`\`\``, inline: true },
                { name: `\`🏓\` • Ping`, value: `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``, inline: true },
                { name: `\`💠\` • Otros`, value: `\`\`\`®TheRedactedProfile®\`\`\``, inline: true },
            ])
            .setImage(imageUrl)
            .setColor(client.color)
            .setFooter({ text: `Gracias por utilizar ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return interaction.editReply({ embeds: [embed], components: [row] });
    },
};
