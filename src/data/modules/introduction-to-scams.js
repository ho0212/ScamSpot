import scammerImg from '@/assets/picture/scammer.jpg'

export default {
  title: 'Introduction To Scams',
  totalPages: 4,
  pages: [
    {
      id: 1,
      title: 'What Exactly IS a Scam?',
      content: `
        <div class="text-block">

          <div class="info-box-blue">
            <h3 style="margin-top: 0; color: #721c24;">A scam is designed to trick you into giving away:</h3>
            <ul style="font-size: 20px; margin-bottom: 0;">
              <li>💰 Your money</li>
              <li>🆔 Personal details</li>
              <li>📊 Your data</li>
            </ul>
          </div>

          <p><strong style="font-size: 20px;">How do they do it?</strong> By offering you something that sounds amazing or by scaring you with false information.</p>

          <div class="flex-left-right">
            <img src="${scammerImg}" alt="Person with mask" class="small-img">
            <div class="bait-box">
              <p style="margin: 0; font-weight: bold;">"Win $10,000!" "Your account is frozen!" "Limited time offer!"</p>
              <p style="margin: 10px 0 0 0; font-style: italic;">Sound familiar? These are the baits scammers use.</p>
            </div>
          </div>

          <p class="bold-green">
            But you're about to learn their secrets! 🕵️
          </p>

        </div>
      `,
    },
    {
      id: 2,
      title: 'Anyone Can Be a Target',
      content: `
        <div class="text-block">

          <div class="target-box">
            <h3>Scams Target EVERYONE</h3>
            <p>Different age groups • All backgrounds • Every income level</p>
          </div>

          <p><strong>The scary truth:</strong> Scammers don't discriminate. They target:</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">👩‍🎓 College Students</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">Job scams, loan forgiveness</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">👔 Working Adults</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">Investment schemes, fake shops</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">👴 Retirees</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">Health scams, grandparent tricks</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">👨‍💼 Professionals</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">Business email compromise</p>
            </div>
          </div>

          <p style="text-align: center; font-weight: bold; font-size: 20px; color: #dc3545;">
            If you have something of value, you're a target! 🎯
          </p>

        </div>
      `,
    },
    {
      id: 3,
      title: 'The Scammer Playbook Revealed',
      content: `
        <div class="text-block">

          <h3 style="color: #bf7f85; font-size: 22px;">🎭 How They Fool Smart People Like You:</h3>

          <div class="info-box-red">
            <h4>Step 1: They Study You</h4>
            <p>They know your bank, your doctor, your family - information stolen or bought online</p>
          </div>

          <div class="info-box-red">
            <h4>Step 2: They Panic You</h4>
            <p>"Emergency!" "Crisis!" "Act now!" - Your brain stops thinking clearly when scared</p>
          </div>

          <div class="info-box-red">
            <h4>Step 3: They Rush You</h4>
            <p>"Don't hang up!" "Don't tell anyone!" - No time to check if it's real</p>
          </div>

          <p style="text-align: center; font-weight: bold; font-size: 20px; color: #28a745;">Now you know their tricks!</p>
        </div>
      `,
    },
    {
      id: 4,
      title: 'They Reach You EVERYWHERE',
      content: `
        <div class="text-block">

          <div class="target-box">
            <h3 style="color: #856404; margin: 0; font-size: 22px;"> Scammers Contact You Through:</h3>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div class="grid-card">
              <p style="margin: 0; font-size: 20px;">📞</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">Phone Calls</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-size: 20px;">💬</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">WhatsApp Messages</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-size: 20px;">📱</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">Text Messages</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-size: 20px;">📧</p>
              <p style="margin: 5px 0 0 0; font-weight: bold;">Social Media</p>
            </div>
          </div>

          <div class="flex-left-right">
            <div class="bait-box">
              <h4 style="margin-top: 0; color: #856404;">Their Goal:</h4>
              <p style="margin-bottom: 0; font-size: 18px;">Get you to <strong>respond to their outreach</strong>, then <strong>deceive you</strong> into <strong>losing something valuable</strong> - usually money, personal information, or login credentials.</p>
            </div>
          </div>

          <p class="bold-green">
            But now you know what to watch for! 👀
          </p>
        </div>
      `,
    },
  ],
}
