const { EmbedBuilder } = require("discord.js");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "premiumdelete",
    description: "Eliminar un usuario premium.",
    category: "Premium",
    aliases: ["pdel"],
    owner: true,
    run: async (client, message, args) => {
        if (client.config.disabelPremium === true) return message.reply({ content: `\`❌\` | El sistema Premium está desactivado.` });
        
        let id = args[0];

        if (!id) return message.reply({ content: "`❌` | Indique un identificador de usuario." });

        let REGEX = new RegExp(/^[0-9]+$/);

        if (!REGEX.test(id)) {
            const embed = new EmbedBuilder().setDescription(`\`❌\` | El ID debe ser un número.`).setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        const user = client.premium.get(id);

        if (!user) {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` | \`${id}\` no es un usuario premium o no está en mi base de datos.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }

        const userData = await User.findOne({ Id: id });

        if (userData.isPremium === true) {
            userData.isPremium = false;
            userData.premium.redeemedBy = [];
            userData.premium.redeemedAt = null;
            userData.premium.expiresAt = null;
            userData.premium.plan = null;

            const newUser = await userData.save();
            client.premium.set(userData.Id, newUser);

            const embed = new EmbedBuilder()
                .setDescription(`\`☑️\` | Ha eliminado con éxito \`${id}\` estatus premium.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\` | \`${id}\` estado premium ya eliminado o no es un usuario premium.`)
                .setColor(client.color);

            return message.reply({ embeds: [embed] });
        }
    },
};
