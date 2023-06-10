const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
let ms = require("parse-ms");
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"database.json" })
const db2 = new JsonDatabase({ databasePath:"kelimeler.json" })
const UserModel = require("../models/dataManagerUSER.js");
const GuildModel = require("../models/dataManagerGUILD.js");

exports.run = async (client, message, args) => {
  
  if(!message.guild) return;
  if(!message.member.permissions.has(PermissionFlagsBits.Administrator)){
  if(message.channel.id !== "1115709729151385610" && message.channel.id !== "1077871605327339552") return;
  }
  
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({content: "Bu komutu kullanabilmek için **Yönetici** yetkisine sahip olmalısın.", ephemeral: true})
      

      
      var type = args[1]
      var channel = message.mentions.channels.first()
      
      if(!type) return;
      if(!channel) return;
      
      
      if (type == "aç") {
        
     if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionFlagsBits.AddReactions)) return message.reply({ content: "Sunucuda `Tepki Ekle` yetkisine sahip olmadığım için işlemi gerçekleştiremiyorum.", ephemeral: true})   

     if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply({ content: "Sunucuda `Mesajları Yönet` yetkisine sahip olmadığım için işlemi gerçekleştiremiyorum.", ephemeral: true})   

        
        
        
  GuildModel.findOne({ guildID: message.guild.id }, function (err, result) {
    if (result) {
      
      if(db.get(`durumkt.${message.guild.id}`) === "açık") return message.reply({content: `Kelime Türetmece zaten açık.\nAçık olduğu kanal: <#${result.gameChannel}>`, ephemeral: true}).then(msg => { setTimeout(() => msg.delete(), 5000)})
      
      result.gameChannel = channel.id,
      result.lastMessage = "araba",
      result.lastUser = client.user.id;
    
      
      result.save(function (err) {
        if (err) throw err;
        
        message.reply({content:"Kelime Türetmece açıldı.", ephemeral: true});
        
        channel.send("**OYUN BAŞLADI!**\nİlk kelime : araba");
          
        db.set(`durumkt.${message.guild.id}`, "açık")
        
        db.set(`ktkanal.${message.guild.id}`, channel.id)
      });
    } else {
      const Model = new GuildModel({
        guildID: message.guild.id,
        gameChannel: channel.id,
        lastUser: client.user.id,
        lastMessage: "araba",
      });
      Model.save(function (err) {
        if (err) throw err;
        message.reply({content:"Kelime Türetmece açıldı. Kelimeleri sıfırlamak istersen kapatıp açmalısın.", ephemeral: true});
        
        channel.send("**OYUN BAŞLADI!**\nİlk kelime : araba");
          
        db.set(`durumkt.${message.guild.id}`, "açık")
        
        db.set(`ktkanal.${message.guild.id}`, channel.id)
      });
    }
  });
        
        
      }
      
      
      if (type == "kapat") {
        
        let kontrol = db.get(`durumkt.${message.guild.id}`)
        if(!kontrol) return message.reply({content: "Kelime Türetmece zaten kapalı.", ephemeral: true}).then(msg => { setTimeout(() => msg.delete(), 5000)})
        
        db.delete(`durumkt.${message.guild.id}`)
        
        db2.delete(`kelimeler.${message.guild.id}`)
        
        db.delete(`slowmodekt.${message.guild.id}`)
        
        db.delete(`ktkanal.${message.guild.id}`)
        
        db.delete(`kelimesayısı.${message.guild.id}`)
        
        return message.reply({content: "Kelime Türetmece kapatıldı.", ephemeral: true})
        
        
      }
          
      


  
}

exports.config = { 
name: "kelime-türetmece" ,
aliases: [] ,
description:  "",
usage: "",
cooldown: 0 
}
