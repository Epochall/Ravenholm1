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
  
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
  
  const chnl = message.mentions.channels.first()
  if(!chnl) return;
  const channel = message.guild.channels.cache.get(chnl.id)
  if(!channel) return;
  
  const veri = db.fetch(`lock.${channel.id}`)
  
  if(!veri){
    
    await db.set(`lock.${channel.id}`, "kilitli")
    
    message.channel.send({content: "Etiketlediğiniz kanala atılan mesajlar artık silinecek."})
    
  }
  
  if(veri === "kilitli"){
    
    await db.delete(`lock.${channel.id}`)
    
    message.channel.send({content: "Etiketlediğiniz kanalda kısıtlama kaldırıldı."})
    
  }
  
}

exports.config = { 
name: "lock" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
