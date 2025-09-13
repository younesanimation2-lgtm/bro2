const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');

// إنشاء عميل Discord مع الصلاحيات المطلوبة
const kboosh = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,    // يحتاج تفعيل في Developer Portal
    GatewayIntentBits.GuildMembers       // يحتاج تفعيل في Developer Portal
  ]
});

// استخدام متغير البيئة للتوكن (أكثر أماناً)
const kbooshtoken = process.env.DISCORD_TOKEN || "YOUR_BOT_TOKEN_HERE";

// عند جاهزية البوت (استخدام clientReady لتجنب تحذير v15)
kboosh.once('clientReady', () => {
  console.log('البوت جاهز! 🤖');
  console.log(`تم تسجيل الدخول باسم: ${kboosh.user.tag}`);
  
  // تأخير صغير ثم تحديث حالة البوت
  setTimeout(() => {
    kboosh.user.setPresence({
      activities: [{
        name: 'by y0._.1',
        type: ActivityType.Playing,
      }],
      status: 'online'
    });
    console.log('✅ تم تحديث حالة البوت إلى: Playing by y0._.1');
  }, 2000);
});

// أمر البرود كاست الأول =bc
kboosh.on('messageCreate', async message => {
  // تجاهل رسائل البوتات
  if (message.author.bot) return;
  
  if (message.content.startsWith('=bc')) {
    // التحقق من صلاحية الإدارة
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ تحتاج صلاحية الإدارة لاستخدام هذا الأمر!');
    }

    const broadcastMessage = message.content.slice(3).trim();
    if (!broadcastMessage) {
      return message.reply('❌ يرجى كتابة الرسالة التي تريد إرسالها!');
    }

    try {
      const members = await message.guild.members.fetch();
      const nonBotMembers = members.filter(member => !member.user.bot);
      let sentCount = 0;
      
      // رسالة تقدم العملية
      const progressMsg = await message.channel.send(`⏳ بدء إرسال الرسالة إلى ${nonBotMembers.size} عضو... (قد يستغرق بضع دقائق)`);
      
      for (const [, member] of nonBotMembers) {
        try {
          await member.send(broadcastMessage);
          sentCount++;
          
          // تحديث رسالة التقدم كل 10 رسائل
          if (sentCount % 10 === 0) {
            await progressMsg.edit(`⏳ تم إرسال ${sentCount}/${nonBotMembers.size} رسالة...`);
          }
          
          // تأخير 1.5 ثانية بين كل رسالة لتجنب السبام
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          console.log(`لا يمكن إرسال رسالة إلى: ${member.user.tag}`);
        }
      }
      
      // حذف الرسالة الأصلية إذا كان للبوت صلاحية
      try {
        await message.delete();
      } catch (error) {
        console.log('لا يمكن حذف الرسالة - صلاحية غير متوفرة');
      }
      await progressMsg.edit(`✅ اكتملت العملية! تم إرسال الرسالة إلى ${sentCount}/${nonBotMembers.size} عضو`);
      setTimeout(() => progressMsg.delete(), 10000);
    } catch (error) {
      console.error('خطأ في أمر البرود كاست:', error);
      message.reply('❌ حدث خطأ أثناء إرسال الرسائل!');
    }
  }
});

// أمر البرود كاست الثاني %=
kboosh.on('messageCreate', async message => {
  // تجاهل رسائل البوتات
  if (message.author.bot) return;
  
  const prefix = '%';
  
  if (message.content.startsWith(prefix + '=')) {
    // التحقق من صلاحية الإدارة
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ تحتاج صلاحية الإدارة لاستخدام هذا الأمر!');
    }

    const args = message.content.substring(prefix.length + 1).split(' ');
    const broadcastMessage = args.slice(0).join(' ').trim();
    
    if (!broadcastMessage) {
      const embed3 = new EmbedBuilder()
        .setDescription(':white_check_mark: | تم ارسال رسالة فارغة')
        .setColor('#FF00FF');
      return message.channel.send({ embeds: [embed3] });
    } else {
      try {
        const members = await message.guild.members.fetch();
        const nonBotMembers = members.filter(member => !member.user.bot);
        let sentCount = 0;
        
        // رسالة تقدم العملية
        const progressEmbed = new EmbedBuilder()
          .setDescription(`⏳ بدء إرسال الرسالة إلى ${nonBotMembers.size} عضو... (قد يستغرق بضع دقائق)`)
          .setColor('#FFD700');
        
        const progressMsg = await message.channel.send({ embeds: [progressEmbed] });
        
        for (const [, member] of nonBotMembers) {
          try {
            await member.send(broadcastMessage);
            sentCount++;
            
            // تحديث رسالة التقدم كل 10 رسائل
            if (sentCount % 10 === 0) {
              const updateEmbed = new EmbedBuilder()
                .setDescription(`⏳ تم إرسال ${sentCount}/${nonBotMembers.size} رسالة...`)
                .setColor('#FFD700');
              await progressMsg.edit({ embeds: [updateEmbed] });
            }
            
            // تأخير 1.5 ثانية بين كل رسالة لتجنب السبام
            await new Promise(resolve => setTimeout(resolve, 1500));
            
          } catch (error) {
            console.log(`لا يمكن إرسال رسالة إلى: ${member.user.tag}`);
          }
        }
        
        const embed4 = new EmbedBuilder()
          .setDescription(`✅ اكتملت العملية! تم ارسال الرسالة إلى ${sentCount}/${nonBotMembers.size} عضو`)
          .setColor('#00FF00');
        
        await progressMsg.edit({ embeds: [embed4] });
        // حذف الرسالة الأصلية إذا كان للبوت صلاحية
        try {
          await message.delete();
        } catch (error) {
          console.log('لا يمكن حذف الرسالة - صلاحية غير متوفرة');
        }
        setTimeout(() => progressMsg.delete(), 10000);
      } catch (error) {
        console.error('خطأ في أمر البرود كاست:', error);
        message.reply('❌ حدث خطأ أثناء إرسال الرسائل!');
      }
    }
  }
});

// معالجة الأخطاء
kboosh.on('error', error => {
  console.error('خطأ في البوت:', error);
});

process.on('unhandledRejection', error => {
  console.error('خطأ غير معالج:', error);
});

// تسجيل الدخول
kboosh.login(kbooshtoken);
