const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "devmode",
    description: "Establecer el modo de desarrollo o mantenimiento.",
    category: "Owner",
    aliases: ["maintenance", "dev"],
    owner: true,
    run: async (client, message, args) => {
        const value = args[0];
        const mode = ["enable", "disable"];

        if (!value) return message.reply({ content: `\`❌\` | No has proporcionado ningún modo dev: \`${mode.join(", ")}\`` });

        if (!mode.includes(args[0]))
            return message.reply({ content: `\`❌\` | No has proporcionado ningún modo dev válido: \`${mode.join(", ")}\`` });

        const enable = true;

        const embed = new EmbedBuilder().setColor(client.color).setTimestamp();

        if (value === "enable") {
            if (client.dev.has(enable)) {
                embed.setDescription(`\`❌\` | El modo Dev ya está: \`Enabled\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.add(enable);

            embed.setDescription(`\`☑️\` | El modo de desarrollo se ha: \`Enabled\``);

            return message.reply({ embeds: [embed] });
        }

        if (value === "disable") {
            if (!client.dev.has(enable)) {
                embed.setDescription(`\`❌\` | El modo Dev ya está: \`Disabled\``);

                return message.reply({ embeds: [embed] });
            }

            await client.dev.delete(enable);

            embed.setDescription(`\`☑️\` | El modo de desarrollo se ha: \`Disabled\``);

            return message.reply({ embeds: [embed] });
        }
    },
};
