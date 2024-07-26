const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "switch",
    description: "Desplazar la posición de dos canciones.",
    category: "Music",
    options: [
        {
            name: "song",
            description: "La canción que quieres mover.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        },
        {
            name: "position",
            description: "Nueva posición de la canción.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 2,
        },
    ],
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: true,
        sameVc: true,
        player: true,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction, player) => {
        await interaction.deferReply({ ephemeral: true });

        function moveArrayElement(arr, fromIndex, toIndex) {
            arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
            return arr;
        }

        const from = interaction.options.getNumber("song");
        const to = interaction.options.getNumber("position");

        if (from === to || isNaN(from) || from < 1 || from > player.queue.length || isNaN(to) || to < 1 || to > player.queue.length)
            return interaction.editReply(`\`❌\` | That song does not exist in the queue.`);

        const moved = player.queue[from - 1];
        await moveArrayElement(player.queue, from - 1, to - 1);

        const embed = new EmbedBuilder().setColor(client.color).setDescription(`\`☑️\` | Moved \`${moved.info.title}\` to \`${to}\`.`);

        return interaction.editReply({ embeds: [embed] });
    },
};
