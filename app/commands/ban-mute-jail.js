const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
let ms = require("parse-ms");
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"database.json" })

exports.run = async (client, message, args) => {
  if(!message.guild) return;
  if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(message.channel.id !== "1115709729151385610" && message.channel.id !== "1077871605327339552") return;
  }
  
  const embed = new EmbedBuilder().setTitle('Ceza Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const komut = message.content.split(" ")
  
  if(komut[0] === "r!ban"){
  
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has("1089537013889372200") && !message.member.roles.cache.has("1089536569746141334")
     ) return message.reply({content: "Bu komutu kullanabilmek için yetkin yok.", ephemeral: true})
    
  
    const user = message.mentions.users.first()
    if (!user) return;
    const member = message.guild.members.cache.get(user.id)
    if (!member) return;
    if (member.bot === true) return;
    if (member.id === message.author.id) return message.reply({embeds: [embed.setDescription("Kendini yasaklayamazsın.")]})
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Bu kişinin yetkisi seninle aynı veya daha üst.")]})
    if (!member.bannable) return message.reply({embeds: [embed.setDescription("Bu kişi yasaklanamaz.")]})
    
    message.guild.members.ban(member.id, { reason: `${message.author.tag} tarafından yasaklandı.` });
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından yasaklandı.`)]})
    return message.channel.send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından yasaklandı.`)]})
    
  }
  
  if(komut[0] === "r!mute"){
    
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has("1089537013889372200") && !message.member.roles.cache.has("1089536569746141334")
     ) return message.reply({content: "Bu komutu kullanabilmek için yetkin yok.", ephemeral: true})

    const user = message.mentions.users.first()
    if (!user) return;
    const member = message.guild.members.cache.get(user.id)
    if (!member) return;
    if (member.bot === true) return;
    if (member.id === message.author.id) return message.reply({embeds: [embed.setDescription("Kendini muteleyemezsin.")]})
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Bu kişinin yetkisi seninle aynı veya daha üst.")]})
    
    member.roles.add("1115713184414838935")
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından mutelendi.`)]})
    return message.channel.send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından mutelendi.`)]})
    
  }
  
  if(komut[0] === "r!jail" || komut[0] === "r!hapis"){
    
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has("1089537013889372200") && !message.member.roles.cache.has("1089536569746141334")
     ) return message.reply({content: "Bu komutu kullanabilmek için yetkin yok.", ephemeral: true})
    
    const user = message.mentions.users.first()
    if (!user) return;
    const member = message.guild.members.cache.get(user.id)
    if (!member) return;
    if (member.bot === true) return;
    if (member.id === message.author.id) return message.reply({embeds: [embed.setDescription("Kendini jaile gönderemezsin.")]})
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Bu kişinin yetkisi seninle aynı veya daha üst.")]})
    
    member.roles.add("1079103895734861955")
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından jaile gönderildi.`)]})
    return message.channel.send({embeds: [embed.setDescription(`${user}, ${message.author} tarafından jaile gönderildi.`)]})
    
  }
  
  
}

exports.config = { 
name: "ban" ,
aliases: ["mute","jail","hapis"] ,
description:  "",
usage: "",
cooldown: 0 
}
