const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const moment = require("moment");
const Code = require("../../../settings/models/Code.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "canjear",
    description: "Canjee su código premium.",
    category: "Premium",
    options: [
        {
            name: "code",
            description: "Proporcione un código válido.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
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

        const input = interaction.options.getString("code");
        const user = await User.findOne({ Id: interaction.user.id });
        const code = await Code.findOne({ code: input.toUpperCase() });

        if (client.config.disablePremium === true) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | No necesitas canjear ningún código para disfrutar de las funciones exclusivas.`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (user && user.isPremium) {
            const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`❌\` | Ya eres usuario Premium.`);

            return interaction.editReply({ embeds: [embed] });
        }

        if (code) {
            if (code.plan === "minutely") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 300000;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            if (code.plan === "daily") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            if (code.plan === "weekly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 7;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            if (code.plan === "monthly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 30;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            if (code.plan === "yearly") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 365;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            if (code.plan === "lifetime") {
                user.isPremium = true;
                user.premium.redeemedBy.push(interaction.user);
                user.premium.redeemedAt = Date.now();
                user.premium.expiresAt = Date.now() + 86400000 * 365 * 100;
                user.premium.plan = code.plan;

                const newUser = await user.save();
                client.premium.set(interaction.user.id, newUser);
                await code.deleteOne();
            }

            const expires = moment(user.premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Premium Redeemed!`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Felicitaciones ${interaction.member}. Ha canjeado correctamente el código Premium con los siguientes datos.`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setColor(client.color)
                .setTimestamp();

            if (user.premium.plan === "lifetime") {
                embed.addFields([
                    { name: `\`👥\` • Redeemed By`, value: `\`\`\`${interaction.member.displayName}\`\`\``, inline: true },
                    { name: `\`💠\` • Plan Type`, value: `\`\`\`${user.premium.plan}\`\`\``, inline: true },
                    { name: `\`🕓\` • Expired Time`, value: `\`\`\`Never\`\`\``, inline: false },
                ]);
            } else {
                embed.addFields([
                    { name: `\`👥\` • Redeemed By`, value: `\`\`\`${interaction.member.displayName}\`\`\``, inline: true },
                    { name: `\`💠\` • Plan Type`, value: `\`\`\`${user.premium.plan}\`\`\``, inline: true },
                    { name: `\`🕓\` • Expired Time`, value: `\`\`\`${expires}\`\`\``, inline: false },
                ]);
            }

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`\`❌\` | El código proporcionado no es válido, por favor utilice uno válido.`);

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
