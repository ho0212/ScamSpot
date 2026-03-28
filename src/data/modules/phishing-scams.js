export default {
  title: 'Phishing Scams',
  totalPages: 4,
  pages: [
    {
      id: 1,
      title: 'The "Bank" Email That Stole $15,000',
      content: `
        <div class="text-block">
          <div class="bait-box">
            <p style="margin: 0; font-style: italic; font-size: 16px;">"URGENT: Suspicious activity detected on your account. Click here immediately to secure your funds or your account will be frozen within 24 hours."</p>
          </div>
          
          <p><strong style="font-size: 20px; color: #bf7f85;">Robert clicked the link and lost $15,000 in 30 minutes.</strong></p>
          
          <p>The email looked exactly like his bank's messages. Same logo, same colors, same official language. The "security page" asked him to verify his account by entering his username, password, and security questions "for his protection."</p>
          
          <p>Within minutes, scammers had logged into his real account and transferred his savings to untraceable accounts.</p>
          
          <div class="info-box-blue">
            <p style="margin: 0;"><strong>The telltale sign Robert missed?</strong> The email address was from "bankofamerica-security@gmail.com" instead of the real "@bankofamerica.com"</p>
          </div>
          
          <p class="bold-green">
            You're about to learn how to spot these fakes instantly! 🔍
          </p>
        </div>
      `
    },
    {
      id: 2,
      title: 'What Exactly is Phishing?',
      content: `
        <div class="text-block">
          <div class="target-box">
            <h3>Phishing = Fake Messages That Look Real</h3>
            <p>Like a fisherman casting bait to catch fish</p>
          </div>
          
          <p><strong>Phishing scammers send fake emails, texts, or create fake websites that look like they come from:</strong></p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">🏦 Your Bank</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">"Verify your account"</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">🏛️ Government</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">"IRS refund waiting"</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">📦 Delivery Services</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">"Package delivery failed"</p>
            </div>
            <div class="grid-card">
              <p style="margin: 0; font-weight: bold;">🛒 Online Stores</p>
              <p style="margin: 5px 0 0 0; font-size: 16px;">"Your order is delayed"</p>
            </div>
          </div>
          
          <div class="info-box-red">
            <h4>Their Goal is Simple:</h4>
            <p>Trick you into giving away your passwords, bank details, Social Security number, or other personal information they can use to steal from you.</p>
          </div>
          
          <p class="bold-green">
            But once you know their tricks, they can't fool you! 🎣
          </p>
        </div>
      `
    },
    {
      id: 3,
      title: 'The Red Flags That Scream "FAKE!"',
      content: `
        <div class="text-block">
          <h3 style="color: #bf7f85; font-size: 22px;">🚩 Spot These Warning Signs Instantly:</h3>
          
          <div class="info-box-red">
            <h4>Generic Greetings</h4>
            <p>"Dear Customer" or "Dear Valued Member" instead of your actual name. Real companies use your name!</p>
          </div>
          
          <div class="info-box-red">
            <h4>Urgent Threats</h4>
            <p>"Account will be closed!" "Immediate action required!" "You have 24 hours!" Real companies give you reasonable time.</p>
          </div>
          
          <div class="info-box-red">
            <h4>Suspicious Email Addresses</h4>
            <p>amazon-security@gmail.com (FAKE) vs orders@amazon.com (REAL). Always check the part after the @ symbol!</p>
          </div>
          
          <div class="info-box-red">
            <h4>Grammar and Spelling Mistakes</h4>
            <p>"Youre account" "Imediate action" "Varify your identity" - Professional companies proofread their messages!</p>
          </div>
          
          <div class="info-box-red">
            <h4>Asks for Personal Information</h4>
            <p>Real companies NEVER ask for passwords, PINs, or Social Security numbers via email. Ever!</p>
          </div>
          
          <p class="bold-green">Now you're a phishing detective! 🕵️</p>
        </div>
      `
    },
    {
      id: 4,
      title: 'Your Phishing Protection Plan',
      content: `
        <div class="text-block">
          <div class="target-box">
            <h3>🛡️ THE GOLDEN RULE</h3>
            <p>When in doubt, go direct - never click email links!</p>
          </div>
          
          <div class="flex-left-right">
            <div class="bait-box">
              <h4 style="margin-top: 0; color: #856404;">Your 3-Step Safety Process:</h4>
              <p style="margin: 10px 0;"><strong>Step 1:</strong> DON'T click any links in the email</p>
              <p style="margin: 10px 0;"><strong>Step 2:</strong> Open a new browser window and type the company's website directly (like bankofamerica.com)</p>
              <p style="margin-bottom: 0;"><strong>Step 3:</strong> Log in to your account the normal way and check if there are any real alerts</p>
            </div>
          </div>
          
          <div class="info-box-blue">
            <h4 style="margin-top: 0;">Pro Tips That Save Money:</h4>
            <ul style="margin-bottom: 0;">
              <li>✅ Real banks will show alerts when you log in normally</li>
              <li>✅ When in doubt, call the company directly using the number on your card or statement</li>
              <li>✅ If it's urgent, they can wait 10 minutes for you to verify</li>
              <li>✅ Delete suspicious emails immediately - don't even keep them "just in case"</li>
            </ul>
          </div>
          
          <p class="bold-green">
            You now have phishing-proof armor! 🛡️
          </p>
        </div>
      `
    }
  ]
};