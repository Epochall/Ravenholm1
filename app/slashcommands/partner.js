const { ModalBuilder, TextInputBuilder, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const client = global.client
const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({databasePath: "database.json"})
const moment = require('moment')
require('moment-duration-format')
const fetch = require("node-fetch");
const fs = require('fs')

module.exports = {
      data: new SlashCommandBuilder()
        .setName('partner')
        .setDescription("partner mesajını paylaşmanızı sağlar."),
  async execute(interaction) {
    
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.has("1089537013889372200") && 
      !interaction.member.roles.cache.has("1089536569746141334") && 
      !interaction.member.roles.cache.has("1114846200932352000")) return;

    const modal = new ModalBuilder().setCustomId('partnerlik2').setTitle('Partner Sistemi')
    const partner = new TextInputBuilder().setCustomId('partnertext2').setLabel("Sunucunun Textini Gir").setMaxLength(2048).setStyle(2).setRequired(true)
    await interaction.showModal(modal.addComponents(new ActionRowBuilder().addComponents(partner)))
    
    
}
}