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
  
let reason = args.slice(0).join(' ')
if (!reason) return await message.reply({ content: `Bir sebep girmelisin.`, ephemeral: true}).then(msg => { setTimeout(() => msg.delete(), 5000)})
const kisi = await db.fetch(`afk.${message.author.id}`)
if (kisi) return await message.reply({ content: `Zaten AFK'sın`, ephemeral: true}).then(msg => { setTimeout(() => msg.delete(), 5000)})

  
const geçersiz = new EmbedBuilder()
  .setAuthor({ name: `${message.member.user.username}#${message.member.user.discriminator}`, iconURL: message.member.user.avatarURL(), url: message.member.user.avatarURL()})
  .setDescription(`Afk komutuna bunu yazamazsın.`)

const link = ["<@&", "<@", "<#" , "@everyone","@here",".com","discord.",". gg","dc.gg","dc gg","dcgg","discordgg","discord gg","discord g","discord /","discord .","discordap","dc.gg",".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", "com.tr", ".biz", ".net", ".rf.gd", ".az", ".party", "discord.gg", "d i s c o r d", ".g g", "dscrd."];

if (link.some(word => reason.includes(word))) return await message.reply({embeds: [geçersiz], ephemeral: true }).then(msg => { setTimeout(() => msg.delete(), 5000)})

db.set(`afk.${message.author.id}`, reason)
  
db.set(`afk-zaman.${message.author.id}`, Date.now())

db.fetch(`afkid.${message.author.id}`, message.author.id)

db.set(`afkAd.${message.member.id}`, message.member.displayName ? message.member.displayName : message.member.user.username);

await message.reply({ content: `Başarıyla şu sebeple AFK oldun: ${reason}`, ephemeral: true}).then(msg => { setTimeout(() => msg.delete(), 5000)})
  

setTimeout(function(){
if(!message.member.nickname) return message.member.setNickname("[AFK] " + message.member.user.username).catch(err => console.error("nick ayarlanamadı."))
if(message.member.nickname) return message.member.setNickname("[AFK] " + message.member.nickname).catch(err => console.error("nick ayarlanamadı."))
}, 1500);


}

exports.config = { 
name: "afk" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
