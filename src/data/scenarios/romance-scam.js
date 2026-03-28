export const romanceScamData = {
  title: 'Romance Scam',
  subtitle: 'Learn to identify online dating scams',
  firstScene: 'scene1',
  theme: {
    headerGradient: 'bg-gradient-to-r from-pink-500 to-red-500',
    buttonGradient: 'bg-gradient-to-r from-pink-500 to-red-500',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  howToPlay: [
    "You'll chat with \"Sophie\" on a dating app",
    "Choose responses at each stage",
    "Different choices lead to different outcomes",
    "Watch for red flags and stay safe!"
  ],
  redFlagsInfo: [
    "Professing love very quickly",
    "Moving conversation off the platform",
    "Asking for money or financial help",
    "Elaborate stories about emergencies",
    "Refusing to video call or meet"
  ],
  scenes: {
    intro: { type: 'intro' },
    scene1: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "Hi there! 😊 I came across your profile and I have to say, you seem like such a genuine person. It's so rare to find that these days! I'm Sophie, I work as a fashion designer. What about you?",
      context: 'Day 1 - First Contact',
      options: [
        { text: "Thanks! Tell me more about yourself. Where are you based?", next: 'scene2_safe', safe: true },
        { text: "Aww thank you! You seem amazing too! Here's my number: [share number]", next: 'scene2_unsafe', safe: false }
      ]
    },
    scene2_safe: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "I'm originally from California but I'm currently working on a major fashion show project in Milan. It's a 6-month contract - great pay but quite isolating. The internet here is terrible! Would you mind if we moved to WhatsApp? Much easier to chat there. 📱",
      context: 'Day 1 - Later that evening',
      redFlag: 'Moved off platform',
      options: [
        { text: "I prefer to keep chatting here for now until we know each other better.", next: 'scene3_safe', safe: true },
        { text: "Sure, no problem! Here's my WhatsApp number.", next: 'scene3_moved', safe: false }
      ]
    },
    scene2_unsafe: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "Wow, you're so trusting and open! That's exactly what I love about you already. 💕 Most people are so guarded these days. I feel like we have a real connection. Let me text you right now!",
      context: 'Day 1 - Later that evening',
      redFlag: 'Love bombing',
      options: [
        { text: "Actually, let's slow down and chat here first.", next: 'scene3_safe', safe: true },
        { text: "I feel it too! Can't wait to hear from you! 😊", next: 'scene3_moved', safe: false }
      ]
    },
    scene3_safe: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "I totally understand and respect that. You're smart to be cautious. 😊 Can I at least send you some photos of me at work? I want you to see the real me. Also, I have to say... even though we just met, talking to you has been the highlight of my week. You're special.",
      context: 'Day 3 - After chatting for a few days',
      redFlag: 'Professing feelings too quickly',
      options: [
        { text: "That's sweet, but this feels very fast. Let's take our time getting to know each other.", next: 'scene4_cautious', safe: true },
        { text: "Aww you're so sweet! You're special to me too! 💕", next: 'scene4_lovebombed', safe: false }
      ]
    },
    scene3_moved: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "[WhatsApp Message] 💕 I'm so glad we can talk freely here! You know, I've been thinking... I've never felt this way about anyone so quickly. There's something about you that's different from everyone else. I think I'm falling for you. Is that crazy?",
      context: 'Day 3 - Now chatting on WhatsApp',
      redFlag: 'Professing feelings too quickly',
      options: [
        { text: "This is moving too fast for me. I think we should slow down.", next: 'scene4_cautious', safe: true },
        { text: "No it's not crazy! I feel the same way! 😍", next: 'scene4_lovebombed', safe: false }
      ]
    },
    scene4_cautious: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "You're right, I apologize if I came on too strong. It's just... being out here working long hours, it gets lonely. Hey, I've been meaning to tell you - this project pays really well. Once I'm done in 3 months, I'll have about $400,000 saved up. I'm thinking of starting my own fashion boutique. Maybe we could partner on something?",
      context: 'Day 5 - Conversation continues',
      redFlag: 'Discussing money and business plans prematurely',
      options: [
        { text: "Why are you bringing up money and business with someone you just met online?", next: 'scene5_suspicious', safe: true },
        { text: "That sounds exciting! What kind of business are you thinking?", next: 'scene5_interested', safe: false }
      ]
    },
    scene4_lovebombed: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "I knew you felt it too! ❤️ You make me so happy. I can't wait to finish this project and come see you in person. We're going to have such an amazing life together! Speaking of the project, I should tell you - when it's complete, I'm getting a $400,000 bonus. We could use it to start our future!",
      context: 'Day 5 - Planning the future',
      redFlag: 'Discussing money and business plans prematurely',
      options: [
        { text: "Wait, this doesn't feel right. We barely know each other and you're talking about money?", next: 'scene5_suspicious', safe: true },
        { text: "That's amazing! We could do so much with that! 🤩", next: 'scene5_interested', safe: false }
      ]
    },
    scene5_suspicious: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "Oh no, I didn't mean to make you uncomfortable! I just... okay, I'll be honest. Something happened. I was in a taxi accident yesterday and got injured. My travel insurance will cover it, but they need $2,500 upfront and it takes 2 weeks to process. I'm in pain and can't work until I get treatment. Could you help me? I'll pay you back $5,000 when my paycheck comes. I promise! 🙏",
      context: 'Day 6 - The emergency',
      redFlag: 'Emergency requiring immediate money',
      options: [
        { text: "This is a scam. I'm blocking you and reporting your profile.", next: 'result_safe', safe: true },
        { text: "Oh no! That sounds awful. Let me see if I can help...", next: 'result_scammed', safe: false }
      ]
    },
    scene5_interested: {
      type: 'chat',
      character: 'Sophie',
      avatar: '👩‍💼',
      message: "I'm so glad you're excited! But... I need to tell you something. To get my bonus released, I need to pay the Italian government a tax clearance fee of $7,000. It's just bureaucracy, but I don't have it right now because all my money is tied up in the project. Could you lend it to me? I'll give you back $15,000 in 2 weeks when I get paid! You'd be helping our future! 💰",
      context: 'Day 7 - The request for money',
      redFlag: 'Emergency requiring immediate money',
      options: [
        { text: "No way. This is clearly a scam. I'm reporting you.", next: 'result_safe', safe: true },
        { text: "Okay, I trust you. Let me send you the money.", next: 'result_scammed', safe: false }
      ]
    },
    result_safe: {
      type: 'result',
      outcome: 'safe',
      title: 'Well Done!',
      description: 'You successfully identified and avoided the romance scam!',
      showRedFlagsSpotted: true,
      sections: [
        {
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          heading: 'What You Did Right:',
          listStyle: 'check',
          listColor: 'text-green-800',
          list: [
            'You recognized the red flags early',
            'You questioned suspicious behavior',
            "You didn't send any money",
            'You reported the scammer'
          ]
        },
        {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-900',
          heading: 'Remember:',
          contentColor: 'text-gray-700',
          content: "Romance scammers create fake profiles and build emotional connections to manipulate victims into sending money. They often claim to be overseas workers, military personnel, or business people with elaborate stories. Never send money to someone you've only met online!"
        }
      ]
    },
    result_scammed: {
      type: 'result',
      outcome: 'scammed',
      title: "You've Been Scammed",
      description: 'Unfortunately, you fell victim to the romance scam',
      showRedFlagsMissed: true,
      sections: [
        {
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          heading: 'What Happened:',
          contentColor: 'text-red-800',
          content: 'You sent money to "Sophie" who was never a real person. The profile, photos, and story were all fake. Romance scammers use emotional manipulation to build trust quickly, then create emergencies to extract money from victims.',
          nestedSection: {
            heading: 'The Reality:',
            textColor: 'text-red-900',
            listColor: 'text-red-800',
            list: [
              '"Sophie" was likely operating from another country',
              'The photos were stolen from someone else',
              'There was no consulting project, no injury, no bonus',
              'Your money is gone and untraceable',
              'They would have continued asking for more'
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
            'Report the profile to the dating platform',
            'Contact your bank immediately',
            'Report to local police and scam authorities',
            'Never send money to anyone you meet online'
          ]
        }
      ]
    }
  }
}
