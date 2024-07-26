const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const voucher_codes = require("voucher-code-generator");
const Code = require("../../../settings/models/Code.js");

module.exports = {
    name: "premiumcode",
    description: "Generar código de usuario premium.",
    category: "Premium",
    aliases: ["pcode", "generate"],
    owner: true,
    run: async (client, message, args) => {
        if (client.config.disabelPremium === true) return message.reply({ content: `\`❌\` | El sistema Premium está desactivado.` });

        let codes = [];

        const plan = args[0];
        const plans = ["minutely", "daily", "weekly", "monthly", "yearly", "lifetime"];

        if (!plan) return message.reply({ content: `\`❌\` | Usted no proporcionó ningún tipo de planes: \`${plans.join(", ")}\`` });

        if (!plans.includes(plan))
            return message.reply({ content: `\`❌\` | Usted no proporcionó ningún tipo válido de planes: \`${plans.join(", ")}\`` });

        let amount = args[1];

        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
            const codePremium = voucher_codes.generate({ pattern: "####-####-####" });

            const code = codePremium.toString().toUpperCase();
            const findCode = await Code.findOne({ code: code });

            if (!findCode) {
                Code.create({ code: code, plan: plan });

                codes.push(`${i + 1} - ${code}`);
            }
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} Código de usuario Premium`, iconURL: client.user.avatarURL() })
            .setDescription(`\`\`\`Código de usuario Premium generado:\n\n--------\n${codes.join("\n")}\n--------\`\`\``)
            .addFields([
                { name: `\`💎\` • Total de códigos:`, value: `\`\`\`+${codes.length}\`\`\``, inline: true },
                { name: `\`💠\` • Tipo de plan:`, value: `\`\`\`${plan}\`\`\``, inline: true },
            ])
            .setColor(client.color)
            .setFooter({ text: `Generado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },
};
