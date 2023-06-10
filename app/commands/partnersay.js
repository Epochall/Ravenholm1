const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
let ms = require("parse-ms");
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"database.json" })
const client = global.client

exports.run = async (client, message, args) => {
  if(!message.guild) return;
  if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(message.channel.id !== "1115709729151385610" && message.channel.id !== "1077871605327339552") return;
  }
    

  const user = message.mentions.users.first() || message.author

  const partner = db.fetch(`partnersayısı.${user.id}`) || 0
  
  const embed = new EmbedBuilder()
  .setThumbnail(message.guild.iconURL())
  .setTitle('Partnerlik Sayısı')
  .setDescription(`${user}, Toplam **${partner}** partnerlik yapmış.`)
  .setTimestamp()
  .setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })

  
  message.reply({embeds: [embed]})

  
}

exports.config = { 
name: "partnersay" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
