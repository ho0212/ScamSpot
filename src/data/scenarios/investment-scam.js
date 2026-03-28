export const investmentScamData = {
  title: 'Investment Scam',
  subtitle: 'Learn to identify fake investment opportunities',
  firstScene: 'scene1',
  theme: {
    headerGradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
    buttonGradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  howToPlay: [
    "You'll receive messages from 'Marcus', a crypto investor",
    "Evaluate each investment pitch carefully",
    "Choose how to respond at each stage",
    "Watch for warning signs of investment fraud!"
  ],
  redFlagsInfo: [
    "Guaranteed returns or 'risk-free' investments",
    "Pressure to invest quickly",
    "Unregistered investments or unlicensed brokers",
    "Complex strategies that don't make sense",
    "Testimonials that seem too good to be true"
  ],
  scenes: {
    intro: { type: 'intro' },
    scene1: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "Hey! I saw your comment on that finance forum. You seem interested in growing your wealth. I've been making INCREDIBLE returns with a new crypto trading platform - I'm talking 30% monthly returns, completely passive! Would you like to know more?",
      context: 'Day 1 - Direct Message',
      options: [
        { text: "30% monthly? That sounds too good to be true. Can you explain how it works?", next: 'scene2_cautious', safe: true },
        { text: "Wow! Yes, please tell me more! I'm definitely interested!", next: 'scene2_interested', safe: false }
      ]
    },
    scene2_cautious: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "I totally get the skepticism! But this is real. The platform uses advanced AI algorithms to trade cryptocurrency arbitrage opportunities 24/7. It's all automated. I've personally made $45,000 in just 3 months! Here are some screenshots of my account. You need to act fast though - they're only accepting 50 more members this month!",
      context: 'Day 1 - Later',
      redFlag: 'Pressure to act quickly',
      options: [
        { text: "Can you share the platform's registration details? I'd like to verify they're legitimate.", next: 'scene3_verify', safe: true },
        { text: "Those screenshots look amazing! How do I sign up?", next: 'scene3_signup', safe: false }
      ]
    },
    scene2_interested: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "I knew you'd get it! Most people don't understand opportunities like this. The platform is called CryptoMaxPro and it's revolutionizing passive income. Check out these testimonials from other members making thousands per week! But listen - they're closing enrollment in 48 hours. You need to get in NOW before it's too late!",
      context: 'Day 1 - Later',
      redFlag: 'Pressure to act quickly',
      options: [
        { text: "Wait, let me research this platform first. What's their company registration?", next: 'scene3_verify', safe: true },
        { text: "I don't want to miss out! What do I need to do?", next: 'scene3_signup', safe: false }
      ]
    },
    scene3_verify: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "Look, I appreciate due diligence, but you're overthinking this. The platform operates offshore for tax optimization - it's registered in the Cayman Islands. That's why you won't find it on US databases. The minimum investment is just $1,000 to start. I guarantee you'll see 30% returns in your first month or your money back! But seriously, spots are filling up fast...",
      context: 'Day 2',
      redFlag: 'Guarantee of returns',
      options: [
        { text: "No legitimate investment can guarantee returns. This is a red flag. I'm out.", next: 'scene4_walkaway', safe: true },
        { text: "A money-back guarantee sounds safe. Maybe I should invest...", next: 'scene4_considering', safe: false }
      ]
    },
    scene3_signup: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "Smart decision! Here's what you do: Create an account on CryptoMaxPro.biz and make your initial deposit. The minimum is $1,000, but I recommend starting with $5,000 - that's the 'Silver' tier which unlocks the premium AI algorithms. You'll see 30% monthly returns GUARANTEED. I've never seen anyone lose money with this!",
      context: 'Day 2',
      redFlag: 'Guarantee of returns',
      options: [
        { text: "Hold on - no investment can guarantee returns. I need to think about this.", next: 'scene4_walkaway', safe: true },
        { text: "Okay, I'll set up an account and deposit $5,000!", next: 'scene4_invested', safe: false }
      ]
    },
    scene4_walkaway: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "Wait wait wait! Okay, I'll be honest with you. I get a referral bonus for bringing in new investors - that's why I'm so excited to share this. But that doesn't change the fact that the returns are real! Tell you what - I'll personally mentor you and share my exact strategy. Just deposit $2,000 as a test. If you don't see profits in 30 days, I'll cover your losses from my own pocket. You literally cannot lose!",
      context: 'Day 2 - Later',
      redFlag: 'Offering personal guarantees',
      options: [
        { text: "This is clearly a scam. I'm blocking you and reporting this.", next: 'result_safe', safe: true },
        { text: "Well, if you'll cover any losses... maybe $2,000 is worth trying.", next: 'result_scammed', safe: false }
      ]
    },
    scene4_considering: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "Exactly! The money-back guarantee protects you completely. Look, I'll even sweeten the deal - if you invest $5,000 or more today, you'll get bumped to VIP status which gives you 40% monthly returns instead of 30%. Plus I'll throw in my personal trading masterclass ($500 value) for FREE. But this offer expires tonight at midnight!",
      context: 'Day 2 - Later',
      redFlag: 'Bonus offers and countdown pressure',
      options: [
        { text: "The more you talk, the sketchier this sounds. I'm done here.", next: 'result_safe', safe: true },
        { text: "40% returns AND a free course? Okay, I'm investing $5,000!", next: 'result_scammed', safe: false }
      ]
    },
    scene4_invested: {
      type: 'chat',
      character: 'Marcus Chen',
      avatar: '💼',
      message: "🎉 Congratulations! You've made an excellent decision. Your account is now active. You should see your first returns in 30 days. Oh, one more thing - to unlock the full 30% returns, you need to upgrade to the 'Gold' tier by depositing another $5,000. The Silver tier only gets 15% monthly. Want me to send you the upgrade link?",
      context: 'Day 3',
      redFlag: 'Requesting additional money after initial investment',
      options: [
        { text: "No way. I want to withdraw my $5,000 immediately. This is a scam!", next: 'result_safe_late', safe: true },
        { text: "I didn't know about the tiers! Okay, I'll deposit another $5,000...", next: 'result_scammed_more', safe: false }
      ]
    },
    result_safe: {
      type: 'result',
      outcome: 'safe',
      title: 'Excellent Decision!',
      description: 'You successfully avoided the investment scam!',
      showRedFlagsSpotted: true,
      sections: [
        {
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          heading: 'What You Did Right:',
          listStyle: 'check',
          listColor: 'text-green-800',
          list: [
            'You questioned unrealistic return promises',
            'You recognized high-pressure tactics',
            'You asked for verification and registration details',
            'You trusted your instincts when something felt wrong',
            'You blocked and reported the scammer'
          ]
        },
        {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900',
          heading: 'Key Lesson:',
          contentColor: 'text-gray-700',
          content: 'Legitimate investments NEVER guarantee returns. If someone promises risk-free high returns and pressures you to invest quickly, it\'s always a scam. Real investment advisors are registered, transparent, and never pressure you to make quick decisions.'
        }
      ]
    },
    result_safe_late: {
      type: 'result',
      outcome: 'safe',
      title: 'You Caught It In Time!',
      description: 'You realized it was a scam before losing more money',
      showRedFlagsSpotted: true,
      sections: [
        {
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-900',
          heading: 'What Happened:',
          contentColor: 'text-amber-800',
          content: 'You initially fell for the scam and deposited $5,000, but you recognized the red flags when they asked for more money. Unfortunately, your initial investment is likely gone, but you prevented further losses by stopping.'
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'What To Do Now:',
          listStyle: 'number',
          listColor: 'text-blue-800',
          list: [
            'Contact your bank immediately to report the fraud',
            'File a report with the FTC at reportfraud.ftc.gov',
            'Report to the Internet Crime Complaint Center (IC3)',
            'Change passwords if you shared any login credentials',
            'Monitor your accounts for unauthorized activity'
          ]
        }
      ]
    },
    result_scammed: {
      type: 'result',
      outcome: 'scammed',
      title: "You've Been Scammed",
      description: 'Unfortunately, you fell victim to the investment scam',
      showRedFlagsMissed: true,
      sections: [
        {
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          heading: 'What Happened:',
          contentColor: 'text-red-800',
          content: 'You sent money to a fraudulent "investment platform" that doesn\'t exist. The website, testimonials, and account screenshots were all fake. "Marcus" was a scammer who will disappear with your money.',
          nestedSection: {
            heading: 'The Reality:',
            textColor: 'text-red-900',
            listColor: 'text-red-800',
            list: [
              'CryptoMaxPro is not a real platform',
              'The screenshots and testimonials were fabricated',
              'There are no AI trading algorithms',
              'Your money was transferred to a scammer\'s account',
              'You will not see any returns or get your money back',
              'The money-back guarantee was fake'
            ]
          }
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'What You Should Do:',
          listStyle: 'number',
          listColor: 'text-blue-800',
          list: [
            'Contact your bank immediately',
            'File a report with the FTC and IC3',
            'Report to your local police',
            'Warn others by reporting the scam online',
            'Never invest based on unsolicited messages'
          ]
        }
      ]
    },
    result_scammed_more: {
      type: 'result',
      outcome: 'scammed',
      title: "You've Lost Even More Money",
      description: 'The scammers convinced you to invest additional funds',
      showRedFlagsMissed: true,
      sections: [
        {
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          heading: 'What Happened:',
          contentColor: 'text-red-800',
          content: 'You fell for a common scam tactic called "reloading" - after getting your initial investment, the scammer convinced you to send more money. You\'ve now lost $10,000 total. The scammers will keep asking for more until you stop sending money.',
          nestedSection: {
            heading: 'The Cycle Would Continue:',
            textColor: 'text-red-900',
            listColor: 'text-red-800',
            list: [
              'Next they\'d ask for "withdrawal fees" to access your returns',
              'Then "tax payments" before releasing your money',
              'Then "insurance fees" or "verification deposits"',
              'This continues until victims have nothing left',
              'All the while, no real investment exists'
            ]
          }
        },
        {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          heading: 'What You Must Do Now:',
          listStyle: 'number',
          listColor: 'text-blue-800',
          list: [
            'STOP sending any more money immediately',
            'Contact your bank and credit card companies',
            'File reports with FTC, IC3, and local police',
            'Block all communication with the scammer',
            'Seek support - scam victims often feel shame but you\'re not alone'
          ]
        }
      ]
    }
  }
}
