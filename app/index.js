
const Discord = require('discord.js')
const client = (global.client = new Discord.Client({intents: [3276799]}))
client.setMaxListeners(30)

client.login("MTA4MTExOTk0MjA3MTU1ODI0NQ.GIhkW5.hBZIf0V6EHgZvvf9bZdRpTQ3Dklxom9YZkqyMo"); // Bot tokeni.

const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder, PermissionFlagsBits , ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, SlashCommandBuilder, TextInputBuilder, EmbedBuilder, ModalBuilder } = require('discord.js');
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath:"./database.json" })
const db2 = new JsonDatabase({ databasePath:"./kelimeler.json" })

const request = require('node-superfetch');
const fs = require('fs');
const moment = require('moment');
require("moment-duration-format")
moment.locale("tr")
const ffmpeg = require('ffmpeg');
const ms = require("parse-ms");
const fetch = require("node-fetch")

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://cristalbot14:dmYcJXiE89DBL72R@cluster0.aj3qv58.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});// Mongo connect linki

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.cooldowns = new Discord.Collection()

require('./handlers/InteractionHandler')
require('./handlers/InteractionHandler2')



//COMMANDS

fs.readdirSync("./commands").forEach(async file => { 
  const props = await require(`./commands/${file}`)

    console.log(`The command ${props.config.name.charAt(0).toUpperCase() + props.config.name.slice(1)} is successfully loaded.`)
    client.commands.set(props.config.name, props)

      props.config.aliases.forEach(alias => {
       client.aliases.set(alias, props.config.name)

    })
  })


//EVENTS

fs.readdir("./events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
      const props = require(`./events/${file}`);
      client.on(props.config.name, props);
      console.log(`The event ${props.config.name.charAt(0).toUpperCase() + props.config.name.slice(1)} is successfully loaded.`);
    });
});


//KOMUTLAR BAŞLANGIÇ
client.rest.on("rateLimited", function (RateLimitData) {
    console.log("Rate limit geldi!", RateLimitData)
})





//OY VERME ZORUNLULUĞU
client.on('guildMemberUpdate', async (oldUser, newUser) => {
  
  //if(newUser.guild.id !== "1077697900567605259" || oldUser.guild.id !== "1077697900567605259") return;
			if (oldUser.roles.cache.size < newUser.roles.cache.size) {
				newUser.roles.cache.forEach(async r => {
          const rol = newUser.guild.roles.cache.find(x => x.name === "Kadim")
          if(!rol) return;
          if(r.name === "Kadim" && !newUser.roles.cache.has(rol) && newUser.roles.cache.has("1114630041612071003")){
                
            await newUser.roles.add("1077709258629599232")
            await newUser.roles.remove("1114630041612071003")
 }
        })
      }
})





//KELİME TÜRETMECE
const UserModel = require("./models/dataManagerUSER.js");
const GuildModel = require("./models/dataManagerGUILD.js");
const axios = require("axios");

client.on("messageCreate", async message => {
  
  let kanal = db.get(`ktkanal.${message.guild.id}`)
  let durum = db.get(`durumkt.${message.guild.id}`)
  if(!durum) return;
  if(!kanal) return;
  if(message.channel.id !== kanal) return;
  
  if (message.author.bot) return;
  
     if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionFlagsBits.AddReactions)) return message.reply({ content: "Sunucuda `Tepki Ekle` yetkisine sahip olmadığım için işlemi gerçekleştiremiyorum.", ephemeral: true})   

     if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply({ content: "Sunucuda `Mesajları Yönet` yetkisine sahip olmadığım için işlemi gerçekleştiremiyorum.", ephemeral: true})   

  
     if(!message.deletable) message.channel.send({content: "Mesaj silme iznim yok. Bulunduğun sunucunun yetkilisine ileterek bunu düzeltmesini iste."}).then(msg => { setTimeout(() => msg.delete(), 5000)})
  
  if (message.content.startsWith('.')) return setTimeout(() => message.delete().catch(err => console.error("kelime türetmece uyarı mesajı.")) , 4000)

  
  let kelimeler = db2.fetch(`kelimeler.${message.guild.id}`) 
  let sayılar = [30,35,40,45,50,55,60,65,70,75,80]
  var sayı = sayılar[Math.floor(Math.random() * sayılar.length)];
  const mesaj = db.get(`kelimesayısı.${message.guild.id}`)
  
  
  GuildModel.findOne({ guildID: message.guild.id }, function (err, result) {
    if (err) throw err;
    if (!result) return;
    
    
    if (message.author.id == result.lastUser)
      return message.channel.send(`${message.author}, Arka arkaya yazamazsın.`).then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    
    
    if (!message.content.startsWith(result.lastMessage.slice(-1)))
      return message.channel.send("Kelime **" + result.lastMessage.slice(-1) + "** ile başlamalı. Son kelime: " + result.lastMessage + "").then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
 

    if (message.content.split(" ").length > 1) return message.channel.send(`${message.author}, Tek kelime kullanmalısın.`).then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
  
    
    if (message.content.length < 2) return message.channel.send("Tek harfli kelime olduğunu sanmıyorum.").then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    
   const büyükharf = ["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P",
                     "R","S","Ş","T","U","Ü","V","Y","Z"]
    if (büyükharf.some(word => message.content.includes(word))) return message.channel.send("Bütün harfler küçük bir şekilde yazmalısın.").then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
        
    
    if (kelimeler && kelimeler.some(word => message.content == word)) return message.channel.send('Bu kelime zaten yazılmış.').then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    
    
    if (message.content.charAt(message.content.length - 1) === 'ğ'.toLowerCase() && mesaj < sayı) return message.channel.send('Henüz **ğ** ile biten kelime yazamazsın.').then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    
    
    
    
    const kufur = ["û", "ibne", "amcık", "siktir", "göt", "sikik", "orospu", "yavşak","î", "porno"];
    const kufur2 = ["am", "sik"]
    if (kufur.some(word => message.content.includes(word))) return message.channel.send('Bu kelimeyi yazamazsın.').then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    if (kufur2.some(word => message.content === word)) return message.channel.send('Bu kelimeyi yazamazsın.').then(msg => { setTimeout(() => msg.delete(), 5000), message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))})
    

    let link = encodeURI("https://sozluk.gov.tr/gts?ara=" + message.content);
    axios.get(link).then((response) => {

      if (JSON.stringify(response.data).includes("error")) {
        return message.channel.send("Kelime TDK sözlüğüne bulunmuyor.").then(msg => {
        setTimeout(() => msg.delete(), 5000)
          message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))
    })
      }

          
let cooldown = 1500, 
amount = Math.floor(Math.random() * 5) + 100;      
let slowmode = db.fetch(`slowmodekt.${message.guild.id}`);

  
if (slowmode !== null && cooldown - (Date.now() - slowmode) > 0) {
let süre = ms(cooldown - (Date.now() - slowmode));
  
return message.channel.send(`${message.author}, **${süre.seconds}** saniye beklemen gerekiyor.`).then(msg => {
        setTimeout(() => msg.delete(), 5000)
          message.delete().catch(err => console.error("kelime türetmece uyarı mesajı."))
    })
  return
  
}

      
        result.lastUser = message.author.id;
        result.lastMessage = message.content;
        result.save(async function (err) {
          if (err) throw err;

          
    db.set(`slowmodekt.${message.guild.id}`, Date.now());
    db2.push(`kelimeler.${message.guild.id}`, message.content)
          
    if (message.content.charAt(message.content.length - 1) === 'ğ'.toLowerCase() && mesaj >= sayı){
      
      result.lastMessage = "merhaba";
      message.reply({content: `Tebrikler, **+20** puan aldın.\n kelime : merhaba`}).catch(err => console.error("komut çalışmıyor."))
      
      db.delete(`kelimesayısı.${message.guild.id}`)
      db.add(`ktpuan.${message.guild.id}.${message.author.id}`, 20)
      db.add(`ktpuang.${message.author.id}`, 20)
      
    }
    
    db.add(`ktpuan.${message.author.id}`, message.content.length)
          
    db.add(`kelimesayısı.${message.guild.id}`, 1)
          
    db.set(`ktkanal.${message.guild.id}`, message.channel.id)
          
    message.react("✅").catch(err => message.channel.send({content: "Tepki ekleme iznim yok. Bulunduğun sunucunun yetkilisine ileterek bunu düzeltmesini iste.", ephemeral: true}))
          
            
        });
      
    });
  });
  
})





//AFK 
client.on("messageCreate", async message => {
const ms = require("parse-ms");
if (message.author.bot || message.channel.type === "dm") return;
 
var afklar = await db.fetch(`afk.${message.author.id}`)
    
if(afklar){
message.member.setNickname(message.guild.members.cache.get(message.author.id).displayName.replace("[AFK]", "")).catch(err => console.error("nick ayarlanamadı."))

    
db.delete(`afk.${message.author.id}`)
db.delete(`afk-zaman.${message.author.id}`)
db.delete(`afkAd.${message.author.id}`)
  
message.reply({ content: `artık AFK değilsin.`}).then(message => { setTimeout(() => message.delete(), 5000)})
}

var kullanıcı = message.mentions.users.first()
if(!kullanıcı) return

  let zaman =  await db.fetch(`afk-zaman.${kullanıcı.id}`)
  
  let atılmaay = moment(zaman+10800000).format("MM")
  let atılmagün = moment(zaman+10800000).format("DD")
  let atılmasaat = moment(zaman+10800000).format("HH:mm")
  let atılma = `**${atılmagün} ${atılmaay.replace(/01/, 'Ocak').replace(/02/, 'Şubat').replace(/03/, 'Mart').replace(/04/, 'Nisan').replace(/05/, 'Mayıs').replace(/06/, 'Haziran').replace(/07/, 'Temmuz').replace(/08/, 'Ağustos').replace(/09/, 'Eylül').replace(/10/, 'Ekim').replace(/11/, 'Kasım').replace(/12/, 'Aralık')} ${atılmasaat}**`

  
  var süre = ms(Date.now() - zaman)
    
  var sebep = await db.fetch(`afk.${kullanıcı.id}`)

  if(await db.fetch(`afk.${message.mentions.users.first().id}`)){
  if(süre.days !== 0){
     message.channel.send(`Etiketlediğin kişi şu anda AFK.
AFK olduğu zaman: <t:${Math.round(zaman / 1000)}>
Şu kadar süredir: **${süre.days}** Gün **${süre.hours}** saat **${süre.minutes}** dakika
Sebep: **${sebep}**`).then(message => { setTimeout(() => message.delete(), 9000)})
   return
   }
    
if(süre.hours !== 0){
  message.channel.send(`Etiketlediğin kişi şu anda AFK.
AFK olduğu zaman: <t:${Math.round(zaman / 1000)}>
Şu kadar süredir: **${süre.hours}** Saat **${süre.minutes}** dakika
Sebep: **${sebep}**`).then(message => { setTimeout(() => message.delete(), 9000)})
  return
}
if(süre.minutes !== 0){
  message.channel.send(`Etiketlediğin kişi şu anda AFK.
AFK olduğu zaman: <t:${Math.round(zaman / 1000)}>
Şu kadar süredir: **${süre.minutes}** Dakika
Sebep: **${sebep}**`).then(message => { setTimeout(() => message.delete(), 9000)})
  return
}
if(süre.seconds !== 0){
  message.channel.send(`Etiketlediğin kişi şu anda AFK.
Şu kadar süredir: **Birkaç saniye**
Sebep: **${sebep}**`).then(message => { setTimeout(() => message.delete(), 9000)})
  return
}
}
  
})





//İTİRAF SİSTEMİ
client.on("messageCreate", async message => {
  
  if(message.author.bot === true) return;
  if(message.channel.id !== "1115346115403980891") return;
  
  const embed = new EmbedBuilder()
  .setAuthor({ name: "Anonim İtiraf", iconURL: "https://cdn.glitch.global/0aa47ebf-ee08-4417-85c5-19556d60732d/anonim.jpg?v=1685898076429", url: "https://cdn.glitch.global/0aa47ebf-ee08-4417-85c5-19556d60732d/anonim.jpg?v=1685898076429"})
  .setDescription(`${message.content}`)
  .setFooter({ text: "mefisto#1414"})
  .setTimestamp()
  
  message.channel.send({embeds: [embed]})
  
  await message.delete()
})





//PARTNER SİSTEMİ

client.on("messageCreate", async message => {
  if(message.author.bot === true) return;
  
  const partner = message.content.split(" ")
  
  const buton = new ActionRowBuilder().addComponents(        
    
  new ButtonBuilder()        
    .setEmoji("🔸")
    .setLabel("Partnerlik Yap")
    .setCustomId("partner")
    .setStyle("1"))
  
  if(partner[0] === "partner"){
    
    const embed = new EmbedBuilder()
    .setDescription("🔸 **Partnerlik yapmak için butona tıklayınız.**")
    
    message.channel.send({embeds: [embed], components: [buton]})
    
  }
})
client.on("interactionCreate", async interaction => {
  if(interaction.customId == "partner"){
    const modal = new ModalBuilder().setCustomId('partnerlik').setTitle('Partner Sistemi')
    const partner = new TextInputBuilder().setCustomId('partnertext').setLabel("Sunucunun Textini Gir").setMaxLength(2048).setStyle(2).setRequired(true)
    await interaction.showModal(modal.addComponents(new ActionRowBuilder().addComponents(partner)))
  }
  if(interaction.customId == "partnerlik"){
    let text = interaction.fields.getTextInputValue("partnertext")
    
    interaction.reply({content: "Partner textin gönderildi.", ephemeral: true})
    
    interaction.guild.channels.cache.get("1079797471066202213").send({content: `${interaction.member} tarafından gönderilen partner texti:
    

${text} 
`})
  }
  if(interaction.customId == "partnerlik2"){
    let text = interaction.fields.getTextInputValue("partnertext2")
    
    interaction.reply({content: "Partner textin gönderildi.", ephemeral: true})
    
    db.add(`partnersayısı.${interaction.member.id}`, 1)
    
    interaction.guild.channels.cache.get("1079797471066202213").send({content: `${text}`})
  }
})





//OTOMATİK CEVAP
client.on("messageCreate", async message => {
  
  if(message.author.bot === true) return;
  
  setTimeout(async() => {
    
    if(message.deletable){
    
  
  const cevap = db.fetch(`cevap.${message.content}`)
  if(!cevap) return;

    message.reply({content: `${cevap}`})
      
    }
    
  }, 1000)
  
})







client.on("messageUpdate", async (oldMessage, newMessage) => {
    const embed = new EmbedBuilder().setTitle('Koruma Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  
  if(newMessage.member.permissions.has(PermissionFlagsBits.Administrator) ||
     newMessage.member.roles.cache.has("1089536569746141334") ||
     newMessage.member.roles.cache.has("1089537013889372200") ||
     newMessage.author.bot === true) 
     return;
    


})





//LOG SİSTEMİ
client.on("messageUpdate", (oldMessage, newMessage) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  
  log.send({embeds: [embed.setTitle('Log Sistemi').setURL(`https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`).addFields(
		{ name: 'Kanal', value: `${newMessage.channel}`, inline: true },
		{ name: 'Mesajı düzenleyen', value: `${newMessage.author}`, inline: true },
		{ name: 'Eski Mesaj', value: `\`${oldMessage.content}\``, inline: false},
		{ name: 'Yeni Mesaj', value: `\`${newMessage.content}\``, inline: true},
	).setTimestamp()]})
})
client.on('messageDelete', (message) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  const mesaj = message.content || "Resim"

  if(message.attachments.size > 0) return;
  
  log.send({embeds: [embed.addFields(
		{ name: 'Kanal', value: `${message.channel}` , inline: true },
		{ name: 'Mesajı silen', value: `${message.author}` , inline: true },
		{ name: 'Mesaj', value: `${mesaj}` , inline: true },
	  { name: 'ID', value: `${message.channel.id}` , inline: true },
    { name: 'ID', value: `${message.author.id}` , inline: true },
    { name: 'ID', value: `${message.id}` , inline: true },
	).setTimestamp()]})
})
//
client.on("voiceStateUpdate", async (oldState, newState) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  
    if (!oldState.channel && newState.channel){
    
      embed.setColor("#57F287")
      embed.setDescription(`${newState.member}, **${newState.channel.name}** (\`${newState.channel.parent.name}\`) adlı sesli kanala girdi!`);
      return log.send({embeds: [embed]});
    }
    if (oldState.channel && !newState.channel){
      
      embed.setColor("#ED4245")
      embed.setDescription(`${newState.member}, **${oldState.channel.name}** (\`${oldState.channel.parent.name}\`) adlı sesli kanaldan ayrıldı!`);
      return log.send({embeds: [embed]});
    }
    if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id){
      
      embed.setColor("#3498DB")
      embed.setDescription(`${newState.member}, ses kanalını değiştirdi.`)
      embed.addFields(
		{ name: 'Eski Kanal', value: `**${oldState.channel.name}** (\`${oldState.channel.parent.name}\`)`, inline: true },
		{ name: 'Yeni Kanal', value: `**${newState.channel.name}** (\`${newState.channel.parent.name}\`)`, inline: true })
      return log.send({embeds: [embed]});
    }
    if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming){
      
      embed.setColor("#9B59B6")
      embed.setDescription(`${newState.member}, **${newState.channel.name}** (\`${newState.channel.parent.name}\`) adlı sesli kanalda yayın açtı!`)
      return log.send({embeds: [embed]});
    }
    if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming){
      embed.setColor("#9B59B6")
      embed.setDescription(`${newState.member}, **${newState.channel.name}** (\`${newState.channel.parent.name}\`) adlı sesli kanalda yayını kapattı!`)
      return log.send({embeds: [embed]});
    }
    if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo){
      embed.setColor("#71368A")
      embed.setDescription(`${newState.member}, **${newState.channel.name}** (\`${newState.channel.parent.name}\`) adlı sesli kanalda kamerasını açtı!`)
      return log.send({embeds: [embed]});
    }
    if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo){
      embed.setColor("#71368A")
      embed.setDescription(`${newState.member}, **${newState.channel.name}** (\`${newState.channel.parent.name}\`) adlı sesli kanalda kamerasını kapattı!`)
      return log.send({embeds: [embed]});
    }
  
})
//
client.on('channelCreate', (channel) => {    
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${channel.name}\` isimli kanal oluşturuldu.`)]})
});
client.on('channelDelete', (channel) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${channel.name}\` isimli kanal silindi.`)]})
});
//
client.on('roleCreate', (role) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${role.name}\` isimli rol oluşturuldu.`)]})
});
client.on('roleDelete', (role) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${role.name}\` isimli rol silindi.`)]})
});
//
client.on('guildBanAdd', (ban) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${ban.user.username}\` isimli üye yasaklandı.`)]})
});
client.on('guildBanRemove', (ban) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${ban.user.username}\` isimli üyenin yasağı kaldırıldı.`)]})
});
//
client.on('emojiCreate', (emoji) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${emoji.name}\` isimli emoji oluşturuldu.`)]})
});
client.on('emojiDelete', (emoji) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${emoji.name}\` isimli emoji silindi.`)]})
});
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  log.send({embeds: [embed.setDescription(`\`${oldEmoji.name}\` isimli emoji güncellendi. Yeni ismi: \`${newEmoji.name}\``)]})
});
//
client.on('guildMemberAdd', (member) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
    if(member.user.bot === false){
  log.send({embeds: [embed.setDescription(`${member.user} adlı üye sunucuya katıldı.`)]})
    }else{
  log.send({embeds: [embed.setDescription(`${member.user} adlı bot sunucuya katıldı.`)]})
    }
});
client.on('guildMemberRemove', (member) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
    if(member.user.bot === false){
  log.send({embeds: [embed.setDescription(`${member.user} adlı üye sunucudan ayrıldı.`)]})
    }else{
  log.send({embeds: [embed.setDescription(`${member.user} adlı bot sunucudan ayrıldı.`)]})
    }
});
//
client.on('guildUpdate', (oldGuild, newGuild) => {
  const embed = new EmbedBuilder().setTitle('Log Sistemi').setTimestamp().setFooter({ text: `mefisto#1414`, iconURL: client.user.avatarURL() })
  const log = client.channels.cache.get("1115346836161581157")
  
  if(oldGuild.name !== newGuild.name) {
    log.send({embeds: [embed.setDescription(`**Sunucunun ayarları güncellendi.**`).addFields(
    { name: `Eski İsim`, value: `\`${oldGuild.name}\``, inline: true },
    { name: `Yeni İsim`, value: `\`${newGuild.name}\``, inline: true })]})
  }
//
  if(oldGuild.description !== newGuild.description) {
    log.send({embeds: [embed.setDescription(`**Sunucunun ayarları güncellendi.**`).addFields(
    { name: `Eski Açıklama`, value: `\`${oldGuild.description}\``, inline: true },
    { name: `Yeni Açıklama`, value: `\`${newGuild.description}\``, inline: true })]})
  }
//
  if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
    log.send({embeds: [embed.setDescription(`**Sunucunun ayarları güncellendi.**`).addFields(
    { name: `Eski URL`, value: `\`${oldGuild.vanityURLCode}\``, inline: true },
    { name: `Yeni URL`, value: `\`${newGuild.vanityURLCode}\``, inline: true })]})
  }
//
  if(oldGuild.icon !== newGuild.icon) {
    log.send({embeds: [embed.setDescription(`Sunucunun Profili güncellendi.`)]})
  }
});




//KISITLAMA
client.on("messageCreate", async message => {
  if(message.author.bot === true) return;
  if(message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

  
  const lock = db.fetch(`lock.${message.channel.id}`)
  if(!lock) return;
  
  await message.delete()
  
})





// MESAJ İSTATİSTİK //
client.on("messageCreate", async message => {
  if (message.author.bot === false) {
    if (message.content.startsWith("r!")) return; 

    await db.add(`puan.${message.author.id}`, 1)
    
    await db.add(`papel.${message.author.id}`, 3)
    
    await db.add(`günlükpuan.${message.author.id}`, 1)
    
    await db.add(`haftalıkpuan.${message.author.id}`, 1)
    
    await db.add(`puanc.${message.channel.id}`, 1); //MESAJ BAŞINA VERİLECEK PUAN KANAL  

    await db.add(`puanuc.${message.author.id}.${message.channel.id}`, 1); //EN COK MESAJ ATILAN KANAL UYE 
  }
});





setInterval(async() => {
let zaman = moment.utc(new Date()).add(3, 'hour').format("HH:mm");
let gün = moment.utc(new Date()).add(3, 'hour').format("dddd");
moment.locale("tr")

let cooldown = 60000, 
amount = Math.floor(Math.random() * 10) + 200;      
let günlük = db.fetch(`günlükmesaj`);
if (günlük !== null && cooldown - (Date.now() - günlük) > 0) {
let timeObj = ms(cooldown - (Date.now() - günlük));

return

} else {

  if(gün == "Pazartesi" && zaman == "00:00"){
    db.set(`günlükmesaj`, Date.now());
        
    await db.delete(`haftalıkpuan`)
    await db.delete(`partnersayısı`)
  
    console.log(true)
};
  
  if(zaman == "00:02"){
    db.set(`günlükmesaj`, Date.now());
        
    await db.delete(`günlükpuan`)

    console.log(true)
};
  

}}, 5000);





///////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const http = require('http');
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log()
);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);