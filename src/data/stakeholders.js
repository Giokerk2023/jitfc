// Core stakeholder types and their value propositions
export const stakeholderTypes = {
  CONSUMER: 'consumer',
  CREATOR: 'creator',
  MODERATOR: 'moderator'
};

export const initialStakeholders = {
  [stakeholderTypes.CONSUMER]: {
    title: "For Content Consumers",
    features: [
      {
        id: "rtv",
        title: "Real-time fact verification while watching",
        description: "Get instant fact-checking results as you watch videos"
      },
      {
        id: "eia",
        title: "Enhanced information accuracy",
        description: "Access verified information and sources"
      },
      {
        id: "cdv",
        title: "Community-driven truth validation",
        description: "Benefit from collective fact-checking efforts"
      }
    ],
    enabled: true
  },
  [stakeholderTypes.CREATOR]: {
    title: "For Content Creators",
    features: [
      {
        id: "icc",
        title: "Increased content credibility",
        description: "Build trust with your audience through verified content"
      },
      {
        id: "afc",
        title: "Automated fact-checking assistance",
        description: "Get AI-powered help in verifying your content"
      },
      {
        id: "ivt",
        title: "Improved viewer trust",
        description: "Enhance your channel's reputation"
      }
    ],
    enabled: true
  },
  [stakeholderTypes.MODERATOR]: {
    title: "For Moderators",
    features: [
      {
        id: "svp",
        title: "Streamlined verification process",
        description: "Efficient tools for content verification"
      },
      {
        id: "amt",
        title: "AI-assisted moderation tools",
        description: "Leverage AI to speed up fact-checking"
      },
      {
        id: "cfp",
        title: "Collaborative fact-checking platform",
        description: "Work together with other moderators"
      }
    ],
    enabled: true
  }
};

// Helper functions for stakeholder data management
export const getStakeholderData = (type) => initialStakeholders[type];
export const getAllStakeholders = () => Object.values(initialStakeholders);
export const getEnabledStakeholders = () => 
  Object.values(initialStakeholders).filter(s => s.enabled);