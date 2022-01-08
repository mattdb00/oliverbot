const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed } = require('discord.js');
const deepai = require('deepai');
const G_CONFIGS = require('../../data/globalConfigs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('textgen')
        .setDescription('A version one classic, this is a text generative program that is based on the GPT-2 model by OpenAI.')
        .addStringOption(option => option.setName('phrase').setDescription('Enter a prompt.')
            .setRequired(true)),

    async run(interaction) {
        
        let startingPhrase = interaction.options.get('phrase');

        await interaction.deferReply();

        deepai.setApiKey(G_CONFIGS.tokens['deepai-api']);

        (async function() {

            try {
                let response = await deepai.callStandardApi('text-generator', {
                    text: startingPhrase.value,
                });

                let completedPrompt = response.output.substring(startingPhrase.value.length);

                const finalEmbed = new MessageEmbed()
                    .setColor('#90ee90')
                    .setAuthor('Text Generator (COMPLETED)')
                    .setTitle('Response')
                    .setDescription('**' + startingPhrase.value + '**' + completedPrompt)
                    .setTimestamp()
                    .setFooter('NOTE: This response is fictional and purely generated by AI.');
                
                await interaction.editReply({embeds: [finalEmbed]})

            } catch (error) {

                const errorEmbed = new MessageEmbed()
                .setColor('#CF142B')
                .setAuthor('Text Generator (ERROR)')
                .setTitle('Response')
                .setDescription('Uh oh! An error has occured trying to communicate with the API. Please let the developers know to check their error logs!')
                .setTimestamp();

                console.log('[textgen.js] ' + error);
                await interaction.editReply({embeds: [errorEmbed]});
            }
        })();
        
    }
}