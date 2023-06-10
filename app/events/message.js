module.exports = async message => {

  let client = message.client;
  if (message.author.bot) return;
    let prefikslerim = ["r!"];
    let zeya = false;
    for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) zeya = içindeki;
    }
  if(!zeya) return; 
  
  
  let command = message.content.split(' ')[0].slice(zeya.length);
  let params = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {

//todo Cooldown
if (client.cooldowns.has(`${command}_${message.author.id}`)) {
        const finish = client.cooldowns.get(`${command}_${message.author.id}`)
        const date = new Date();
        const kalan = (new Date(finish - date).getTime() / 1000).toFixed(2);
        return message.channel.send(`Bu komutu kullanabilmen için **${kalan}** saniye beklemelisin.`).then(message => { setTimeout(() => message.delete(), cmd.config.cooldown) })//.then(message => message.delete({timeout:cmd.config.cooldown}))
    };
    
    const finish = new Date();
    //finish.setSeconds(finish.getSeconds() + cmd.config.cooldown);
    cmd.run(client, message, params);
//    client.channels.cache.get("824664113132863557").send("k"
    if (cmd.config.cooldown > 0) {
        client.cooldowns.set(`${command}_${message.author.id}`, finish);
        setTimeout(() => {
          client.cooldowns.delete(`${command}_${message.author.id}`);
        }, cmd.config.cooldown * 1000);
      } 
  }
  
};

module.exports.config = {
name: "messageCreate"
}