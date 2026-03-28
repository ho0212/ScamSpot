export const phishingScamData = {
  title: 'Phishing Attack',
  subtitle: 'Learn to identify and avoid phishing emails',
  firstScene: 'scene1',
  theme: {
    headerGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    buttonGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  howToPlay: [
    "You'll receive suspicious emails",
    "Examine each email carefully for red flags",
    "Decide how to respond safely",
    "Learn to protect yourself from phishing!"
  ],
  redFlagsInfo: [
    "Urgent or threatening language",
    "Suspicious sender email addresses",
    "Generic greetings instead of your name",
    "Requests for sensitive information",
    "Links that don't match the supposed sender"
  ],
  scenes: {
    intro: { type: 'intro' },
    scene1: {
      type: 'chat',
      character: 'Email Inbox',
      avatar: '📧',
      message: "FROM: <span class='font-bold'>security-alert@amaz0n-verify.com</span>\n\nSUBJECT: <span class='font-bold'>URGENT: Your Account Has Been Suspended!</span>\n\nDear Valued Customer,\n\nWe have detected unusual activity on your Amazon account. For your security, your account has been temporarily suspended. You must verify your identity within 24 hours or your account will be permanently closed and any pending orders cancelled.\n\nClick here to verify now: <span class='text-blue-600 underline'>amaz0n-verify.com/secure-login</span>\n\nAmazon Security Team",
      context: 'Monday Morning - Email Received',
      options: [
        { text: "This looks suspicious. Let me check the sender's email address and compare it to Amazon's real domain.", next: 'scene2_careful', safe: true },
        { text: "Oh no! I better click the link and verify immediately!", next: 'scene2_clicked', safe: false }
      ]
    },
    scene2_careful: {
      type: 'chat',
      character: 'Your Analysis',
      avatar: '🔍',
      message: "Good thinking! You notice several red flags:\n\n• The sender is 'amaz0n-verify.com' (with a zero, not an 'o')\n• Amazon's real domain is 'amazon.com'\n• It says 'Dear Valued Customer' instead of your name\n• It creates urgency with a 24-hour deadline\n• Real Amazon emails never ask you to click links to verify\n\nWhat should you do?",
      context: 'Examining the Email',
      redFlag: 'Suspicious sender address',
      options: [
        { text: "Delete the email and go directly to Amazon.com to check my account", next: 'scene3_safe_check', safe: true },
        { text: "Maybe I should click the link just to be safe...", next: 'scene2_clicked', safe: false }
      ]
    },
    scene2_clicked: {
      type: 'chat',
      character: 'Fake Website',
      avatar: '🌐',
      message: "You clicked the link and it opened a page that looks EXACTLY like Amazon's login page. The URL bar shows: 'amaz0n-verify.com/signin'\n\nThe page is asking for:\n\n• Your email\n• Your password\n• Your full name\n• Credit card number (last 4 digits for 'verification')\n\nIt looks legitimate, but something feels off...",
      context: 'Phishing Website Loaded',
      redFlag: 'Clicked suspicious link',
      options: [
        { text: "Wait - this URL is wrong and Amazon would never ask for credit card details like this. Close this immediately!", next: 'scene3_caught_it', safe: true },
        { text: "It looks real enough. I'll enter my information to verify my account.", next: 'scene3_entered_info', safe: false }
      ]
    },
    scene3_safe_check: {
      type: 'chat',
      character: 'Amazon Website',
      avatar: '🛒',
      message: "You navigated directly to www.amazon.com and logged in normally. Your account dashboard shows:\n\n✓ No security alerts\n✓ No suspended status\n✓ All orders processing normally\n✓ No unusual activity\n\nThe email was definitely a phishing scam! Your caution saved you from a potential disaster.",
      context: 'Checking Your Real Account',
      redFlag: 'Generic greeting instead of name',
      options: [
        { text: "I should report this phishing email to Amazon and delete it.", next: 'result_safe', safe: true }
      ]
    },
    scene3_caught_it: {
      type: 'chat',
      character: 'Your Browser',
      avatar: '🔐',
      message: "Smart move! You closed the fake website before entering any information. You notice your browser was actually showing security warnings that you almost missed.\n\nYou realize:\n\n• The site didn't have the padlock (HTTPS)\n• The URL was 'amaz0n-verify.com' not 'amazon.com'\n• Real Amazon would never ask for credit card verification via email link\n\nYou dodged a bullet, but you did click the malicious link.",
      context: 'Closed the Phishing Site',
      redFlag: 'Request for sensitive information',
      options: [
        { text: "I should run a virus scan and report this email immediately.", next: 'result_safe_but_clicked', safe: true }
      ]
    },
    scene3_entered_info: {
      type: 'chat',
      character: 'Fake Website',
      avatar: '⚠️',
      message: "After you submitted your information, the page showed a message: 'Thank you for verifying. Redirecting to your account...'\n\nBut instead, the page just closed. You try to access your real Amazon account and discover:\n\n🔴 You can't log in - password changed\n🔴 New charges on your credit card\n🔴 Your email password also compromised\n🔴 Identity theft in progress\n\nThe scammers now have everything they need.",
      context: '30 Minutes Later',
      redFlag: 'Entered credentials on fake site',
      options: [
        { text: "I need to act FAST to minimize damage!", next: 'result_scammed_damage_control', safe: true },
        { text: "Maybe I should just wait and see what happens...", next: 'result_scammed_worse', safe: false }
      ]
    },
    result_safe: {
      type: 'result',
      outcome: 'safe',
      title: 'Perfect Response!',
      description: 'You successfully identified and avoided the phishing attack!',
      showRedFlagsSpotted: true,
      sections: [
        {
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          heading: 'What You Did Right:',
          listStyle: 'check',
          listColor: 'text-green-800',
          list: [
            'You examined the sender\'s email address carefully',
            'You recognized the fake domain name',
            'You noted the generic greeting',
            'You went directly to the real website instead of clicking links',
            'You verified there was no actual problem',
            'You reported the phishing attempt'
          ]
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'How to Spot Phishing Emails:',
          listStyle: 'bullet',
          listColor: 'text-blue-800',
          list: [
            'Check sender address - hover over to see real email',
            'Look for spelling errors and suspicious domains',
            'Generic greetings like "Dear Customer" are red flags',
            'Urgent threats or deadlines are pressure tactics',
            'Never click links in suspicious emails',
            'Always navigate directly to websites',
            'Real companies never ask for passwords via email'
          ]
        },
        {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900',
          heading: 'Remember:',
          contentColor: 'text-gray-700',
          content: 'When in doubt, go directly to the company\'s official website by typing the URL yourself. Never click links in emails that create urgency or ask for personal information. Legitimate companies will never threaten to close your account via email.'
        }
      ]
    },
    result_safe_but_clicked: {
      type: 'result',
      outcome: 'safe',
      title: 'Close Call!',
      description: 'You clicked the link but caught the scam before it was too late',
      showRedFlagsSpotted: true,
      sections: [
        {
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-900',
          heading: 'What Happened:',
          contentColor: 'text-amber-800',
          content: 'You clicked the phishing link, which was risky, but you recognized the fake login page before entering any information. Clicking malicious links can sometimes install malware, so it\'s important to scan your device.'
        },
        {
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          heading: 'What You Did Right:',
          listStyle: 'check',
          listColor: 'text-green-800',
          list: [
            'You noticed the wrong URL in the address bar',
            'You recognized the site was asking for unusual information',
            'You closed the page before entering credentials',
            'You decided to run a security scan'
          ]
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'What To Do Now:',
          listStyle: 'number',
          listColor: 'text-blue-800',
          list: [
            'Run a full antivirus/malware scan on your device',
            'Clear your browser cache and cookies',
            'Report the phishing email to the real company',
            'Forward to reportphishing@apwg.org',
            'In the future, never click links in suspicious emails'
          ]
        }
      ]
    },
    result_scammed_damage_control: {
      type: 'result',
      outcome: 'scammed',
      title: 'You Were Phished - Act Fast!',
      description: 'You fell for the phishing attack, but quick action can minimize damage',
      showRedFlagsMissed: true,
      sections: [
        {
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          heading: 'What Happened:',
          contentColor: 'text-red-800',
          content: 'You entered your credentials on a fake website designed to steal your information. The scammers now have your Amazon password and possibly your email password if they\'re the same. They also have partial credit card information and your personal details.',
          nestedSection: {
            heading: 'Immediate Dangers:',
            textColor: 'text-red-900',
            listColor: 'text-red-800',
            list: [
              'Unauthorized purchases on your accounts',
              'Identity theft attempts',
              'Access to other accounts with same password',
              'Potential malware from clicking the link',
              'Your contacts may receive phishing from your email'
            ]
          }
        },
        {
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-900',
          heading: 'URGENT: Do This NOW (in order):',
          listStyle: 'number',
          listColor: 'text-orange-800',
          list: [
            'Change your Amazon password immediately',
            'Change your email password',
            'Enable two-factor authentication on all accounts',
            'Contact your credit card company to report fraud',
            'Check all accounts for unauthorized activity',
            'Run a complete antivirus scan',
            'Monitor your credit report for suspicious activity',
            'Report to Amazon and the FTC'
          ]
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'Lessons Learned:',
          listStyle: 'bullet',
          listColor: 'text-blue-800',
          list: [
            'Never click links in unexpected emails',
            'Always verify URLs match official domains',
            'Use different passwords for different accounts',
            'Enable two-factor authentication everywhere',
            'When in doubt, navigate directly to websites'
          ]
        }
      ]
    },
    result_scammed_worse: {
      type: 'result',
      outcome: 'scammed',
      title: 'Critical Security Breach',
      description: 'Delaying action has allowed maximum damage to occur',
      showRedFlagsMissed: true,
      sections: [
        {
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          heading: 'What Happened:',
          contentColor: 'text-red-800',
          content: 'By waiting instead of acting immediately, you gave scammers hours or days to exploit your stolen information. They\'ve had time to make purchases, access other accounts, steal your identity, and potentially lock you out of multiple services.',
          nestedSection: {
            heading: 'The Damage:',
            textColor: 'text-red-900',
            listColor: 'text-red-800',
            list: [
              'Thousands in fraudulent charges',
              'Multiple compromised accounts',
              'Your contacts received phishing emails from your account',
              'Identity theft is well underway',
              'Recovery will take months and be very difficult',
              'Credit score may be impacted'
            ]
          }
        },
        {
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-900',
          heading: 'What You MUST Do Immediately:',
          listStyle: 'number',
          listColor: 'text-orange-800',
          list: [
            'Contact ALL your banks and credit card companies',
            'Place a fraud alert on your credit reports',
            'Consider a credit freeze',
            'Change passwords on EVERY online account',
            'File a report with local police',
            'Report to FTC at IdentityTheft.gov',
            'Document all fraudulent charges',
            'Monitor credit reports closely for years'
          ]
        },
        {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900',
          heading: 'Critical Lesson:',
          contentColor: 'text-gray-700',
          content: 'When you realize you\'ve been phished, EVERY SECOND COUNTS. Immediate action is the difference between minor inconvenience and major identity theft. Never wait to see what happens - scammers work fast.'
        }
      ]
    }
  }
}
