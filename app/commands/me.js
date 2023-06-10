const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, BitFieldInvalid, SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"database.json" })

const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
let ms = require("parse-ms");
exports.run = async (client, message, args) => {
  
  if(!message.guild) return;
  if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(message.channel.id !== "1115709729151385610" && message.channel.id !== "1077871605327339552") return;
  }
  
let sayi = 1;
let top5c = message.guild.channels.cache
  //.array()
  .sort((a, b) => {
  return (
  (db.get(`puanuc.${message.author.id}.${b.id}`) || 0) -
  (db.get(`puanuc.${message.author.id}.${a.id}`) || 0)
  );
  })
  .map(x => {
  let date = db.get(`puanuc.${message.author.id}.${x.id}`)
  if(date){
  return `\`${sayi++}.\` <#${x.id}>:  \`${String(db.get(`puanuc.${message.author.id}.${x.id}`) || 0).replace(/(.)(?=(\d{3})+$)/g,'$1.')} mesaj\``;
  }
  })
  .slice(0, 5).join('\n')

let csize = message.guild.channels.cache.filter(x => db.fetch(`puanuc.${message.author.id}.${x.id}`)).size
let papel = String(db.fetch(`papel.${message.author.id}`) || 0).replace(/(.)(?=(\d{3})+$)/g,'$1.')
let mesaj = String(db.fetch(`puan.${message.author.id}`) || 0).replace(/(.)(?=(\d{3})+$)/g,'$1.')
let günlükmesaj = String(db.fetch(`günlükpuan.${message.author.id}`) || 0).replace(/(.)(?=(\d{3})+$)/g,'$1.')


const embed = new EmbedBuilder()
.setThumbnail(message.author.avatarURL({dynamic: true}))
.setColor(message.member.displayHexColor)
.setDescription(`${message.author} adlı üyenin aktiflik bilgileri:

**Para Bilgisi**
\`•\` Papel: \`${papel || 0}\` 🪙

**Metin Kanalları Bilgisi**
\`•\` Toplam: \`${mesaj || 0} mesaj\`
\`•\` Günlük: \`${günlükmesaj || 0} mesaj\`
\`•\` Haftalık: \`${günlükmesaj || 0} mesaj\`

**En çok mesaj attığın 5 kanal (Toplam ${csize} kanal)**
${top5c ? top5c : 'Hiç kanal yok.'}
`)
.setTimestamp()
.setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })

return message.reply({embeds: [embed]})



  
}

exports.config = { 
name: "me" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
