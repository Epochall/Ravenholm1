const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
let ms = require("parse-ms");
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"database.json" })
const wait = require('node:timers/promises').setTimeout;

exports.run = async (client, message, args) => {    
  if(!message.guild) return;
  if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(message.channel.id !== "1115709729151385610" && message.channel.id !== "1077871605327339552") return;
  }
  
      
      const embed = new EmbedBuilder().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setTitle(`${message.guild.name} | Kelime Türetmece Sıralaması`)
      .setTimestamp()
   
let ktveri1 = 1
const ktsıralama = message.guild.members.cache.filter(mem => db.fetch(`ktpuan.${mem.user.id}`)).sort((a, b) => { return ( db.fetch(`ktpuan.${b.user.id}`) || 0) - (db.fetch(`ktpuan.${a.user.id}`) || 0)}).map(member => { return `${ktveri1++}. ${member.user.username}: ${String(db.fetch(`ktpuan.${member.user.id}`) || 0).replace(/(.)(?=(\d{3})+$)/g,'$1.')} puan`}).slice(0, 10).join("\n")   

await wait(10);
return await message.reply({embeds: [embed.setDescription(`
\`\`\`arm
${ktsıralama || "\nBulunamadi."}
\`\`\`
`)]}).catch(error => console.log(error))  

}

exports.config = { 
name: "sıralama" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
