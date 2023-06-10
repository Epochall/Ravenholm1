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
        .setName('rol-kaldır')
        .setDescription("Marketten rolü kaldırır.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('rol').setDescription('rolü giriniz.').setRequired(true)),
  async execute(interaction) {
    
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
   
    let rol = interaction.options.getRole('rol')
    const veri = db.get("market")
    if(!veri) return interaction.reply({content: "Veri bulunamadı.", ephemeral: true})
    if(veri){
    const roles = db.get("market").filter(x => x.rol === rol.id)
    
    if(!roles) return interaction.reply({content: "Rol bulunamadı.", ephemeral: true})
    }
    
    if(veri.length == 1) return db.delete("market") && interaction.reply({content: "Rol marketten kaldırıldı.", ephemeral: true})
      
    const filtre = db.get("market").filter(x => x.rol !== rol.id)
    
    db.set("market", filtre)
      
   interaction.reply({content: "Rol marketten kaldırıldı.", ephemeral: true})
   

}
}