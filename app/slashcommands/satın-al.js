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
        .setName('satın-al')
        .setDescription("Rol satın alabilirsiniz.")
        .addRoleOption(option => option.setName('rol').setDescription('rolü giriniz.').setRequired(true)),  
  async execute(interaction) {
    
  if(!interaction.guild) return;
  if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(interaction.channel.name !== "yönetim-komut" && interaction.channel.name !== "bot-komut") return;
  }
    
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
    
  const embed = new EmbedBuilder().setTitle('Market | Satın Alma').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
   
    let rol = interaction.options.getRole('rol')
    const market = db.get("market")
    
    const papel = db.fetch(`papel.${interaction.member.id}`) || 0
    
    if(!market) return;
    
    market.map((data, index) => {
      
      if(data.rol !== rol.id) { return } else{
      
      if(data.fiyat > papel) return interaction.reply({embeds: [embed.setDescription("Paran yetmiyor.")], ephemeral: true})
      
      if(interaction.member.roles.cache.has(data.rol)) return interaction.reply({embeds: [embed.setDescription("Zaten role sahipsin.")], ephemeral: true})
        
        interaction.member.roles.add(data.rol)
        
        db.substr(`papel.${interaction.member.id}`, data.fiyat)
        
        interaction.reply({embeds: [embed.setDescription(`<@&${data.rol}> rolü başarıyla satın alındı.`)]})
        
        
      }
    })
}
}