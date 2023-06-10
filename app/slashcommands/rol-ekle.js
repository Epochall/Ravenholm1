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
        .setName('rol-ekle')
        .setDescription("Markete rol ekler.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('rol').setDescription('rolü giriniz.').setRequired(true))
        .addStringOption(option => option.setName('fiyat').setDescription('fiyatı yazınız.').setRequired(true)),
  async execute(interaction) {
    
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
   
    let rol = interaction.options.getRole('rol')
    let fiyat = interaction.options.getString('fiyat')
    const veri = db.get("market")
    

    db.push("market", {rol: rol.id, fiyat: fiyat})
      
   return interaction.reply({content: "Rol markete eklendi.", ephemeral: true})
      
   
      
    
   

}
}