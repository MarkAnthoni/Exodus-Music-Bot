const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "profile",
    description: "Mostrar información sobre tu perfil.",
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
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ Id: interaction.user.id });
        const timeLeft = moment(user.premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.tag} Detalles Premium`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor(client.color)
            .setDescription(`Estos son los detalles sobre el estado de su cuenta premium.`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: "Muchas Gracias" })
            .setTimestamp();

        if (user.premium.plan === "lifetime") {
            embed.addFields([
                { name: `\`💠\` • Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan)}\`\`\``, inline: true },
                { name: `\`💎\` • Funciones:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                { name: `\`🕓\` • Caduca:`, value: `\`\`\`Never\`\`\``, inline: false },
            ]);
        } else {
            embed.addFields([
                { name: `\`💠\` • Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan || "Free")}\`\`\``, inline: true },
            ]);

            if (user.premium.expiresAt < Date.now()) {
                embed.addFields([
                    { name: `\`💎\` • Funciones:`, value: `\`\`\`Locked\`\`\``, inline: true },
                    { name: `\`🕓\` • Caduca:`, value: `\`\`\`Never\`\`\``, inline: false },
                ]);
            } else {
                embed.addFields([
                    { name: `\`💎\` • Funciones:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                    { name: `\`🕓\` • Caduca:`, value: `\`\`\`${timeLeft}\`\`\``, inline: false },
                ]);
            }
        }

        return interaction.editReply({ embeds: [embed] });
    },
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}
