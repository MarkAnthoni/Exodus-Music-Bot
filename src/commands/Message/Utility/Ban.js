const { EmbedBuilder } = require("discord.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "ban",
    description: "Prohibir a un usuario el uso del bot.",
    category: "Utility",
    aliases: ["banuser"],
    owner: true,
    run: async (client, message, args) => {
        let id = args[0];
        let type = args[1];

        if (!id) return message.reply({ content: "`❌` | Por favor, proporcione un ID de usuario." });

        let REGEX = new RegExp(/^[0-9]+$/);

        if (!REGEX.test(id)) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | El ID debe ser un número.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        if (!type) return message.reply({ content: "`❌` | Por favor, indique un tipo. `enable` o `disable`." });

        let typeMode = ["enable", "disable"];

        if (!typeMode.includes(type)) return message.reply({ content: "`❌` | Por favor, indique un tipo válido. `enable` o `disable`." });

        const user = await User.findOne({ Id: id });

        if (!user) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | \`${id}\` no está en mi base de datos.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        const status = user.status;

        if (type === "enable") {
            if (status.isBanned === true) {
                const embed = new EmbedBuilder().setDescription(`\`❌\` | \`${id}\` ya está baneado.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            } else {
                status.isBanned = true;
                status.bannedBy = message.author.id;
                status.bannedAt = Date.now();

                await user.save();

                const embed = new EmbedBuilder().setDescription(`\`☑️\` | Usted ha baneado con éxito \`${id}\`.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            }
        } else if (type === "disable") {
            if (status.isBanned === false) {
                const embed = new EmbedBuilder().setDescription(`\`❌\` | \`${id}\` No está baneado.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            } else {
                status.isBanned = false;
                status.bannedBy = null;
                status.bannedAt = null;

                await user.save();

                const embed = new EmbedBuilder().setDescription(`\`☑️\` | Has desbaneado con éxito a \`${id}\`.`).setColor(client.color);

                return message.reply({ embeds: [embed] });
            }
        }
    },
};
