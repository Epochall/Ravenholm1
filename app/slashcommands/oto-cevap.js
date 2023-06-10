const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const client = global.client
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: "database.json"})
const moment = require('moment')
require('moment-duration-format')
const fetch = require("node-fetch");
const fs = require('fs')

module.exports = {
      data: new SlashCommandBuilder()
        .setName('oto-cevap')
        .setDescription("seçtiğiniz cümleye istediğiniz cevabı verir.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('yazılan').setDescription('Yazılacak').setRequired(true))
        .addStringOption(option => option.setName('cevap').setDescription('Alınacak cevap').setRequired(true)),
 async execute(interaction) {
   
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
   
   let yazılacak = interaction.options.getString('yazılan')
   let cevap = interaction.options.getString('cevap')
   
   //db.set(`${yazılacak}`, yazılacak)
   db.set(`cevap.${yazılacak}`, cevap)
   
   interaction.reply({content: "Oto cevap ayarlandı.", ephemeral: true})
   

}
}