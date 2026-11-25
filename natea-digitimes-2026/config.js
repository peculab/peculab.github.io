"use strict";

// Public settings. Keep the static HTML and social metadata aligned.
const EVENT_CONFIG = {
  "slug": "natea-digitimes-2026",
  "canonicalUrl": "https://peculab.github.io/natea-digitimes-2026/",
  "title": "AI, Semiconductors & Global Supply Chains: A Conversation with Colley Hwang",
  "headline": "AI, Semiconductors & Global Supply Chains",
  "subtitle": "A Conversation with Colley Hwang",
  "series": "Seattle Technology & Industry Forum 2026",
  "date": "2026-12-12",
  "time": "10:00",
  "endTime": "12:00",
  "timezone": "America/Los_Angeles",
  "region": "Greater Seattle Area, Washington, USA",
  "venueName": null,
  "venueAddress": null,
  "venueMapUrl": null,
  "eventLanguage": null,
  "eventCapacity": null,
  "registrationEnabled": true,
  "membershipEnrollmentEnabled": true,
  "memberTicketVerified": true,
  "registrationStatus": "open",
  "pricing": {
    "currency": "USD",
    "generalAdmission": 20,
    "annualMembership": 30,
    "studentMembership": 0,
    "lifetimeMembership": 300
  },
  "membership": {
    "year": 2027,
    "startDate": "2027-01-01",
    "endDate": "2027-12-31",
    "annualMemberComplimentaryAdmission": true,
    "studentMemberComplimentaryAdmission": null,
    "lifetimeMemberComplimentaryAdmission": null,
    "existingMemberComplimentaryAdmission": null,
    "separateEventTicketRequired": true
  },
  "urls": {
    "eventRegistration": "https://www.zeffy.com/en-US/ticketing/ai-semiconductors-and-global-supply-chains-a-conversation-with-colley-hwang",
    "membershipApplication": "https://forms.gle/pYDFZctFUzKXJVDAA",
    "membershipRegistration": "https://www.zeffy.com/en-US/ticketing/north-american-taiwanese-engineers-associations-memberships",
    "legacyInterestForm": "https://forms.gle/JnM8eeTEuwASzsoT8"
  },
  "speaker": {
    "name": "Colley Hwang",
    "organization": "DIGITIMES",
    "title": null,
    "biography": null,
    "photo": "assets/speakers/colley-hwang.jpg"
  },
  "organizerContactEmail": null,
  "refundPolicy": null,
  "accessibilityContact": null,
  "discussionThemesConfirmed": false,
  "recap": null,
  "shareDescription": "Join NATEA Seattle and NSF A3D3 Institute on December 12, 2026, for a conversation with Colley Hwang from DIGITIMES on AI, semiconductors, global supply chains, and Taiwan–U.S. technology collaboration. PecuLab is an event partner.",
  "analytics": {
    "enabled": false,
    "provider": null,
    "measurementId": null,
    "campaign": "colley_hwang_seattle_2026",
    "allowedSources": [
      "natea",
      "a3d3",
      "digitimes",
      "peculab",
      "ntu_alumni",
      "taiwan_chamber",
      "young_chamber",
      "taiwanzonia",
      "linkedin",
      "facebook",
      "line",
      "email",
      "interest_form"
    ],
    "allowedMedia": [
      "partner",
      "social",
      "email",
      "community"
    ],
    "allowedContent": []
  }
};

const ORGANIZATIONS = [
  {
    "id": "natea",
    "name": "NATEA Seattle",
    "role": "Event Organizer",
    "website": "https://www.linkedin.com/company/natea-seattle",
    "description": "Connecting professionals, engineers, researchers, entrepreneurs, and community leaders through professional engagement and Taiwan–U.S. collaboration.",
    "confirmed": true,
    "logoApproved": true,
    "logo": "../assets/bridge-network/natea-seattle-adapted.png",
    "logoWidth": 2172,
    "logoHeight": 724,
    "displayOrder": 1
  },
  {
    "id": "a3d3",
    "name": "NSF A3D3 Institute",
    "role": "Co-Organizer",
    "website": "https://a3d3.ai/",
    "description": "Accelerated AI Algorithms for Data-Driven Discovery. Advancing connections across AI, data-driven discovery, and scientific research.",
    "confirmed": true,
    "logoApproved": true,
    "logo": "assets/logos/a3d3.png",
    "logoWidth": 50,
    "logoHeight": 50,
    "displayOrder": 2
  },
  {
    "id": "digitimes",
    "name": "DIGITIMES",
    "role": "Featured Speaker Organization",
    "website": "https://www.digitimes.com/",
    "description": "Featuring Colley Hwang and bringing industry perspectives on AI, semiconductors, and global supply chains.",
    "confirmed": true,
    "logoApproved": true,
    "logo": "assets/logos/digitimes.svg",
    "logoWidth": 160,
    "logoHeight": 25,
    "displayOrder": 3
  },
  {
    "id": "peculab",
    "name": "PecuLab",
    "role": "Event Partner",
    "website": "https://peculab.github.io/",
    "description": "Supporting the forum as an event partner.",
    "confirmed": true,
    "logoApproved": true,
    "logo": "../assets/peculab-mark-clean.png",
    "displayOrder": 4
  }
];

const AGENDA = [
  {
    "title": "60-minute keynote by Colley Hwang",
    "startTime": null,
    "confirmed": true
  },
  {
    "title": "20 minutes of open networking",
    "startTime": null,
    "confirmed": true
  },
  {
    "title": "40-minute interview with Colley Hwang",
    "startTime": null,
    "confirmed": true
  }
];
