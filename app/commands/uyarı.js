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
  
  if(message.author.bot === true) return;
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has("1089537013889372200") && !message.member.roles.cache.has("1089536569746141334") && !message.member.roles.cache.has("1114846200932352000")) return;
  
  const user = message.mentions.users.first()
  if(!user) return;
  const member = message.guild.members.cache.get(user.id)
  if(!member) return;
  if(member.bot === true) return;
  
  const embed = new EmbedBuilder().setTitle('Uyarı Sistemi').setTimestamp().setFooter({ text: `zeya#0001`, iconURL: client.user.avatarURL() })
  const uyarı = db.fetch(`uyarı.${member.id}`) || 0
  
  if(uyarı+1 == 1){
    
    await db.add(`uyarı.${member.id}`, 1)
    
    await member.timeout(900000)
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, ilk uyarısını aldığı için Timeout uygulandı. Devam edersen sunucudan yasaklanabilirsin.`)]})
    return message.channel.send({embeds: [embed]}) 
  }
  
  if(uyarı+1 == 2){
    
    await db.add(`uyarı.${member.id}`, 1)
    
    await member.timeout(7200000)
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, ikinci uyarısını aldığı için Timeout uygulandı. Devam edersen sunucudan yasaklanabilirsin.`)]})
    return message.channel.send({embeds: [embed]})
  }
  
  if(uyarı+1 == 3){
    
    await db.add(`uyarı.${member.id}`, 1)
    
    //await member.roles.add("ROLID")
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, üçüncü uyarısını aldığı için Jail'e gönderildi. Devam edersen sunucudan yasaklanabilirsin.`)]})
    return message.channel.send({embeds: [embed]})
  }
  
  if(uyarı+1 == 4){
    
    await db.delete(`uyarı.${member.id}`)
    
    message.guild.channels.cache.get("1115608778117750965").send({embeds: [embed.setDescription(`${user}, son uyarıya geldiği için sunucudan yasaklandı.`)]})
    message.channel.send({embeds: [embed]})
    
    //await message.guild.members.ban(member.id, { reason: "Son Uyarı." });
  }
  
}

exports.config = { 
name: "uyarı" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
