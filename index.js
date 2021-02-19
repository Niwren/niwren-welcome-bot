
 const Discord = require('discord.js'), 
      client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }}), 
      ytdlDiscord = require("discord-ytdl-core");

client.on('ready', async() => {
  client.user.setStatus("dnd");
  client.user.setActivity(" Ses botu yaptırmak için: Niwren#2017")
  play() 
  
})


const setting = {
  token: "", //token
  channelID: "",//kanal
  modID: "",//yetkili
  videoURL: "", //youtube linki
  server: "" //sunucuid
}

client.on('voiceStateUpdate', async function(oldState, newState){
  if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  if(newState.channelID == setting.channelID){
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == true) 
     client.guilds.cache.get(setting.server).me.voice.setMute(true)
  } else if(oldState.channelID == setting.channelID){
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == false)  play()
  }
})


async function play(){ 
  let url = await ytdlDiscord(setting.videoURL, {
            filter: "audioonly",
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    });
  let streamType = setting.videoURL.includes("youtube.com") ? "opus" : "ogg/opus"; 
  client.channels.cache.get(setting.channelID).join().then(async connection => { 
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == false) { 
     client.guilds.cache.get(setting.server).me.voice.setMute(false)
      connection.play(url, {type: streamType}).on("finish", () => { 
        play(url); 
      }); 
    } else play(url); 
  }); 
}  
client.login(setting.token)
