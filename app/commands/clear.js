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
  
  const embed = new EmbedBuilder().setTitle('Clear Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })

  if (!message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.has("1089537013889372200") && !message.member.roles.cache.has("1089536569746141334") && !message.member.roles.cache.has("1114846200932352000")) return;
      
let mesaj = parseInt(args[0]) || 1

if(mesaj > 99) return message.reply({content: "En fazla 99 mesaj silinebilir."})


  message.channel.messages.fetch({
    limit: mesaj+1
  }).then(messages => message.channel.bulkDelete(messages));
  
  
      
  setTimeout(() => {
    embed.setDescription(`**${mesaj}** mesaj temizlendi.`)
    message.channel.send({ embeds: [embed] }).then(msg => { setTimeout(() => msg.delete(), 3000)})  
  }, 2000)
  
}

exports.config = { 
name: "clear" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
