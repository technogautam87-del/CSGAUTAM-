import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig } from './types';

export const INITIAL_SLIDER_PHOTOS: SliderPhoto[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    caption: 'Interactive Learning and Development Classrooms',
    captionHi: 'संवादात्मक शिक्षण और प्रयोगात्मक कक्षाएं (Interactive Classrooms)'
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    caption: 'Creative Learning Kits for Special Needs Students',
    captionHi: 'विशेष आवश्यकता वाले छात्रों के लिए रचनात्मक शिक्षण किट (Sensory Kits)'
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    caption: 'Fostering Independence and Inclusive Play Dynamics',
    captionHi: 'नन्हे सितारों में आत्मनिर्भरता और समावेशी खेल भावना का विकास'
  }
];

export const INITIAL_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-1998',
    year: 1998,
    title: 'A Promising Beginning',
    titleHi: 'एक आशाजनक शुरुआत (जन्म)',
    subtitle: 'Born in India',
    subtitleHi: 'भारत के हृदय स्थल में जन्म',
    category: 'Birth',
    categoryHi: 'जन्म',
    events: [
      'Born in a humble community with a passion to make a social impact.',
      'Raised with a deep sense of empathy for other children.'
    ],
    eventsHi: [
      'सामाजिक सेवा और सरोकार के संकल्प के साथ एक साधारण परिवार में जन्म।',
      'बचपन से ही अन्य बच्चों और पीड़ित मित्रों के प्रति गहरी सहानुभूति और सेवा भाव।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eb2?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'Every child begins their voyage with unique potential waiting to be noticed.',
    notesHi: 'प्रत्येक बच्चा अपनी विशिष्ट प्रतिभा के साथ जन्म लेता है, बस जरूरत है उसे प्यार से संवारने की।',
    achievements: ['The official beginning of an inspiring educational journey'],
    achievementsHi: ['एक अत्यंत प्रेरक शैक्षणिक यात्रा की शुरुआत']
  },
  {
    id: 'm-2013',
    year: 2013,
    title: 'Early Academic Focus',
    titleHi: 'प्रारंभिक शैक्षणिक एकाग्रता',
    subtitle: 'High School Completion',
    subtitleHi: 'हाई स्कूल की पूर्णता एवं स्वयंसेवा का आरंभ',
    category: 'Education',
    categoryHi: 'शिक्षा',
    events: [
      'Graduated senior secondary with distinction.',
      'Began volunteering at local community centers helping neurodivergent children.',
      'Developed a keen interest in psychological and physical development guidelines.'
    ],
    eventsHi: [
      'विशेष योग्यता (Distinction) के साथ वरिष्ठ माध्यमिक परीक्षा उत्तीर्ण की।',
      'न्यूरोडाइवर्जेंट बच्चों की मदद के लिए स्थानीय स्वयंसेवी संस्थाओं में योगदान शुरू किया।',
      'मनोवैज्ञानिक और शारीरिक बाल विकास के सिद्धांतों में विशेष रुचि विकसित की।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'This year cemented my philosophy: "Standard education teaches subjects; special teaching fosters souls."',
    notesHi: 'इस वर्ष ने मेरे जीवनदर्शन को दृढ़ किया: "सामान्य शिक्षा विषयों को सिखाती है; विशेष शिक्षण आत्मा को सींचता है।"',
    achievements: ['Outstanding Community Volunteer Award', 'Top rank in district level debate competition'],
    achievementsHi: ['उत्कृष्ट सामुदायिक स्वयंसेवक सम्मान', 'जिला स्तरीय वाद-विवाद प्रतियोगिता में प्रथम स्थान']
  },
  {
    id: 'm-2016',
    year: 2016,
    title: 'The Calling: Special Education',
    titleHi: 'जीवन का उद्देश्य: विशेष शिक्षा',
    subtitle: 'Professional Training & Certifications',
    subtitleHi: 'व्यावसायिक प्रशिक्षण और विशेष योग्यता प्रमाणपत्र',
    category: 'Special Education',
    categoryHi: 'विशेष शिक्षा',
    events: [
      'Enrolled in professional courses specializing in mental retrogression, Autism, and learning disabilities.',
      'Mastered Indian Sign Language (ISL) essentials and basics of tactile Braille printing for the visually impaired.',
      'Conducted action research on custom-made sensory toys.'
    ],
    eventsHi: [
      'बौद्धिक दिव्यांगता, ऑटिज़्म और अधिगम अक्षमताओं से जुड़े व्यावसायिक पाठ्यक्रमों में प्रवेश लिया।',
      'नेत्रहीनों के लिए स्पर्शनीय ब्रेल लिपि और मूक बधिरों के लिए भारतीय सांकेतिक भाषा (ISL) का गहन अभ्यास किया।',
      'बच्चों के अनुकूल विशेष स्पर्श संवेदी (Sensory Toys) खिलौनों पर अपना पहला शोध किया।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'Sensory stimulus is the bridge between cognitive stagnation and intellectual breakthrough for sensory-unique children.',
    notesHi: 'संवेदी प्रोत्साहन (Sensory Stimulus) विशेष बच्चों की सीखने की अक्षमता को दूर करने का सबसे सुंदर मार्ग है।',
    achievements: ['Lead Trainee of Special Pedagogical Practice', 'First Place in State Tactile Materials Exhibition'],
    achievementsHi: ['विशेष शैक्षणिक अभ्यास के सर्वश्रेष्ठ प्रशिक्षु', 'राज्य स्तरीय स्पर्शनीय शिक्षण सामग्री प्रदर्शनी में प्रथम पुरस्कार']
  },
  {
    id: 'm-2020',
    year: 2020,
    title: 'Pandemic Response & E-Learning',
    titleHi: 'महामारी प्रतिक्रिया और ई-लर्निंग हब',
    subtitle: 'Inclusive Virtual Classroom Models',
    subtitleHi: 'समावेशी वर्चुअल और डिजिटल क्लासरूम',
    category: 'Career',
    categoryHi: 'करियर',
    events: [
      'Completed professional graduation and launched remote digital consultation classrooms.',
      'Set up custom video guides and interactive games for parents keeping intellectually challenged kids active during lockdown.',
      'Designed over 50+ free downloadable adaptive worksheets.'
    ],
    eventsHi: [
      'विशेष अध्यापन में स्नातक पूर्ण कर ऑनलाइन दूरस्थ शिक्षण कक्षाओं की शुरुआत की।',
      'तालाबंदी के कठिन समय में विशेष बच्चों को सक्रिय रखने के लिए अभिभावक मार्गदर्शिका और संवेदी खेल विकसित किए।',
      '50 से अधिक निःशुल्क डाउनलोड करने योग्य रचनात्मक कार्यशीट और खेल डिजाइन किए।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'The pandemic threatened isolation for special needs students; we transformed that isolation into custom parent-supported playgrounds.',
    notesHi: 'महामारी ने बच्चों को अलग-थलग करने की चुनौती दी; हमने उस एकांत को संवेदी डिजिटल खेल के मैदानों में बदल दिया।',
    achievements: ['Selected as digital Special Educator of the Year (NGO Council)', 'Published first paper on "Home-Bound Special Assistance Programs"'],
    achievementsHi: ['NGO काउंसिल द्वारा "डिजिटल स्पेशल एजुकेटर ऑफ द ईयर" चयन', '"घर पर विशेष शिक्षण सहायता गाइड" लघु शोध-पत्र प्रकाशित']
  },
  {
    id: 'm-2023',
    year: 2023,
    title: 'A Catalyst in Public Classrooms',
    titleHi: 'राजकीय विद्यालयों में समावेशी क्रांति',
    subtitle: 'Full-time appointment as Special Teacher',
    subtitleHi: 'पूर्णकालिक राजकीय विशेष शिक्षक के रूप में नियुक्ति',
    category: 'Special Education',
    categoryHi: 'विशेष शिक्षा',
    events: [
      'Secured regular teaching appointment providing bespoke instruction to integrated classrooms.',
      'Engineered individual education programs (IEPs) for over 45 high-support-needs children.',
      'Organized multi-district sports events for kids of diverse abilities.'
    ],
    eventsHi: [
      'सर्वोच्च सरकारी चयन प्रक्रिया आयोग के माध्यम से नियमित विशेष शिक्षक के रूप में कार्यभार संभाला।',
      'गंभीर चुनौतियों से जूझ रहे 45 से अधिक प्यारे बच्चों के लिए सफल इंडिविजुअलाइज्ड एजुकेशन प्रोग्राम (IEP) तैयार किया।',
      'विभिन्न क्षमताओं वाले बच्चों के बीच सहयोग बढ़ाने के लिए राज्य स्तरीय खेल प्रतियोगिताओं का सफल आयोजन किया।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'A classroom is not a homogeneous factory. It is a garden, and some plants require specialized fertilizers, soil, and direct, patient rays of light.',
    notesHi: 'कक्षा कोई एकजैसी मशीनों का कारखाना नहीं है, बल्कि एक सुंदर बगीचा है जहाँ हर पौधे को विशेष खाद और प्रेम की आवश्यकता होती है।',
    achievements: ['Exceptional Educator Honour - District Administration Certificate', 'Best Classroom Integration Project Award'],
    achievementsHi: ['असाधारण शिक्षक सम्मान - जिला प्रशासन प्रमाण पत्र', 'सर्वश्रेष्ठ कक्षा समायोजन परियोजना पुरस्कार']
  },
  {
    id: 'm-2026',
    year: 2026,
    title: 'Digital Journey & Futuristic Horizon',
    titleHi: 'डिजिटल यात्रा एवं भविष्य के नए क्षितिज',
    subtitle: 'AI-assisted Digital Hub launch',
    subtitleHi: 'एआई-असिस्टेड डिजिटल हब और रिपोजिटरी लॉन्च',
    category: 'Achievement',
    categoryHi: 'उपलब्धि',
    events: [
      'Published online responsive portal designed with AI to act as a free-to-access toolkit repository.',
      'Partnered with leading developmental pediatricians for scalable diagnosis tools and parent referral resources.'
    ],
    eventsHi: [
      'एआई की मदद से डिज़ाइन किया गया मुफ़्त ऑनलाइन शिक्षण रिपोजिटरी पोर्टल और डिजिटल टूलकिट साझा योजना को सार्वजनिक किया।',
      'अभिभावकों के लिए अनुकूलित रेफरल टूल्स और बाल रोग विशेषज्ञों की डायरेक्टरी की शुरुआत की।'
    ],
    photos: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600'
    ],
    notes: 'Technology paired with absolute love and patience guarantees that no child is ever truly left behind.',
    notesHi: 'असीम प्रेम, धैर्य और उत्कृष्ट आधुनिक तकनीकी उपकरणों का संयोजन यह सुनिश्चित करता है कि कोई भी बच्चा पीछे न छूटे।',
    achievements: ['Initiation of India-wide Special Education digital toolkit sharing initiative'],
    achievementsHi: ['अखिल भारतीय स्तर पर विशेष शिक्षा डिजिटल टूल्स साझा योजना की शुरुआत']
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Adaptive Learning Kit for ADHD Students',
    titleHi: 'ADHD छात्रों के लिए अनुकूलित संवेदी शिक्षण किट',
    type: 'article',
    description: 'A comprehensive study on sensory boards, structured physical breaks, and gamified tasks that improve concentration in neurodivergent children.',
    descriptionHi: 'न्यूरोडाइवर्जेंट बच्चों में सहनशीलता, एकाग्रता और चंचलता को संतुलित करने के लिए विशेष संवेदी स्पर्श-बोर्ड और सचित्र पाठ योजनाओं का विस्तृत अध्ययन।',
    link: 'https://example.com/publications/adhd-kit',
    date: '2024-03-15',
    author: 'Chandrashekhar Gautam'
  },
  {
    id: 'pub-2',
    title: 'Departmental Guidelines on Classroom Inclusivity',
    titleHi: 'कक्षा समावेशिता और एकीकरण पर शासकीय दिशानिर्देश',
    type: 'departmental',
    description: 'Official departmental publication detailing standard operating protocols for integrating children with intellectual challenges into mainstream play sessions.',
    descriptionHi: 'बौद्धिक चुनौतियों से जूझ रहे बच्चों को नियमित खेल सत्रों और गतिविधियों में शामिल करने के लिए राज्य शिक्षा विभाग द्वारा तैयार आधिकारिक मानक संचालन नियम।',
    link: 'https://example.com/publications/inclusivity-guidelines',
    date: '2023-10-01',
    author: 'State Education Board (Co-authored by C. Gautam)'
  },
  {
    id: 'pub-3',
    title: 'Braille Tactile Toolkit & Exercises',
    titleHi: 'ब्रेल लिपि और स्पर्श शिक्षण टूलकिट एवं अभ्यास पुस्तिका',
    type: 'pdf',
    description: 'A full PDF handbook consisting of exercises, games, and sequential lesson plans to teach rudimentary tactile Braille reading and fine-motor coordination.',
    descriptionHi: 'नेत्रहीन बच्चों को खेल-खेल में प्रारंभिक ब्रेल लिपि सिखाने और हाथ की उंगलियों के समन्वय को सुदृढ़ करने के लिए गतिविधियों से युक्त पूर्ण पीडीएफ हैंडबुक।',
    link: 'https://example.com/publications/braille-guide.pdf',
    date: '2025-01-20',
    author: 'Chandrashekhar Gautam'
  },
  {
    id: 'pub-4',
    title: 'Understanding Indian Sign Language (ISL)',
    titleHi: 'भारतीय सांकेतिक भाषा (ISL) की सचित्र वर्णमाला और क्रियाएं',
    type: 'notes',
    description: 'Concise handy classroom notes compiled with flashcard illustrations representing basic verbs, pronouns, alphabet signs, and response symbols helper guides.',
    descriptionHi: 'मूक-बधिर विद्यार्थियों से संवाद के लिए दैनिक क्रियाओं, सर्वनामों और वर्णमाला को प्रदर्शित करने वाले चित्रों के साथ तैयार अत्यंत संक्षिप्त व्यावहारिक कक्षा नोट्स।',
    link: 'https://example.com/publications/isl-notes',
    date: '2022-06-12',
    author: 'Special Educator Resource Group'
  },
  {
    id: 'pub-5',
    title: 'Individual Education Program (IEP) Templates',
    titleHi: 'व्यक्तिगत शैक्षिक योजना (IEP) के रेडी-टू-यूज़ नियोजन फॉर्मैट',
    type: 'notes',
    description: 'Ready-to-fill planning grids detailing developmental target milestones, adaptive tools tracking pages, and behavioral review logs.',
    descriptionHi: 'शिक्षकों और अभिभावकों के लिए बाल विकास की प्रगति को रेखांकित करने वाले, संवेदी लक्ष्यों की ट्रैकिंग के लिए सरल तथा रेडी-टू-प्रिंट नियोजन ग्रिड।',
    link: 'https://example.com/publications/iep-templates',
    date: '2023-05-08',
    author: 'Chandrashekhar Gautam'
  },
  {
    id: 'pub-6',
    title: 'Special Education Board Exam Accommodation Guidelines',
    titleHi: 'दिव्यांग बोर्ड परीक्षार्थियों के लिए शासकीय परीक्षा रियायत नियम',
    type: 'departmental',
    description: 'Standard policies handbook highlighting exemptions, time provisions, sign interpreter allowances, and alternative scribe assignment rules.',
    descriptionHi: 'बोर्ड परीक्षा में सम्मिलित होने वाले दिव्यांग छात्रों के लिए अतिरिक्त समय सीमा, सह-लेखक (Scribe) सहायता और विशेष सांकेतिक दुभाषिया भत्तों की आधिकारिक पुस्तिका।',
    link: 'https://example.com/publications/board-exemptions',
    date: '2024-11-30',
    author: 'Directorate of Inclusive Education'
  }
];

export const INITIAL_NEWS_CUTTINGS: NewsCutting[] = [
  {
    id: 'news-1',
    title: 'Special Teacher Devotes Free Evenings to Needy Children',
    titleHi: 'विशेष शिक्षक शाम के समय गरीब व असमर्थ बच्चों को नि:शुल्क पढ़ाने में लीन',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400',
    source: 'National Education Herald',
    sourceHi: 'राष्ट्रीय शिक्षा हेराल्ड समाचार पत्र',
    date: '2024-05-12',
    summary: 'A detailed feature news story highlighting Chandrashekhar Gautam\'s custom evening camps which teach sensory arts to children suffering from cerebral palsy and mild autism free of charge.',
    summaryHi: 'सेरेब्रल पाल्सी और ऑटिज़्म से ग्रसित गरीब बच्चों के लिए चंद्रशेखर गौतम द्वारा चलाए जा रहे नि:शुल्क संध्याकालीन संवेदी कला शिविरों पर प्रकाश डालती विशेष खबर।'
  },
  {
    id: 'news-2',
    title: 'State Honors Special Educator for Revolutionary Learning Aid',
    titleHi: 'सर्वश्रेष्ठ शिक्षण सहायक सामग्री नवाचार के लिए राज्य स्तरीय शिक्षक सम्मान',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400',
    source: 'The Daily Chronicle',
    sourceHi: 'द डैली क्रॉनिकल न्यूज',
    date: '2023-11-20',
    summary: 'A glowing article describing the State Education Awards ceremony where Chandrashekhar\'s dynamic wooden block pattern set gained the top educational innovation honor.',
    summaryHi: 'राज्य पुरस्कार समारोह का जीवंत ब्योरा, जिसमें बुनियादी संवेदी गणित सीखने के विकास के लिए चंद्रशेखर द्वारा निर्मित पैटर्न सेट को सर्वश्रेष्ठ नवाचार घोषित किया गया।'
  },
  {
    id: 'news-3',
    title: 'Bringing Joy Back to Integrated Classrooms',
    titleHi: 'विशिष्ट खेल विधियों से बदला हमारे सरकारी स्कूलों का माहौल',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400',
    source: 'The Educational Spotlight',
    sourceHi: 'द एजुकेशनल स्पॉटलाइट',
    date: '2025-02-14',
    summary: 'An editorial detailing the success rate metrics of Inclusive Play methods across ten municipal schools, where student cohesion indices increased by 65 percent.',
    summaryHi: 'दस विभिन्न नगर निगम विद्यालयों में "समावेशी खेल विधि" लागू करने के उपरांत बच्चों के आपसी सामंजस्य और प्रसन्नता दर में रिकॉर्ड 65% की वृद्धि दर्ज।'
  }
];

export const INITIAL_VIDEOS: LiveVideo[] = [
  {
    id: 'v-1',
    title: 'Active Teaching Methods for Sensory Stimulation',
    titleHi: 'संवेदी प्रोत्साहन उत्तेजना के लिए सक्रिय शिक्षण विधियों का प्रदर्शन',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A live classroom demonstration showcasing how color contrast sheets, physical rhythm play, and soft acoustic triggers stimulate focusing capabilities in non-verbal students.',
    descriptionHi: 'गैर-मौखिक (non-verbal) रूप से संवाद करने वाले छात्रों में एकाग्रता और रुचि उत्पन्न करने की एक क्लासरूम डेमो वीडियो जिसमें रंगीन कागजों तथा मृदु संगीत तरंगों का प्रयोग है।',
    badge: 'Classroom Live Session',
    badgeHi: 'कक्षा प्रदर्शन'
  },
  {
    id: 'v-2',
    title: 'Individual Education Program (IEP) Formulation Tutorial',
    titleHi: 'व्यक्तिगत विशिष्ट शैक्षिक योजना (IEP) का प्रारूप तैयार कैसे करें',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A step-by-step masterclass guiding new special needs assistants through baseline reviews, smart goal settings, parent feedback cycles, and state documentation norms.',
    descriptionHi: 'एक विस्तृत मास्टरक्लास जिसमें नए सहायक शिक्षकों और अभिभावकों को लक्ष्य निर्धारण, साप्ताहिक ट्रैकिंग रिकॉर्ड और सरकारी नियमों के बारे में क्रमिक रूप से समझाया गया है।',
    badge: 'Teacher Masterclass',
    badgeHi: 'मास्टरक्लास'
  },
  {
    id: 'v-3',
    title: 'Creating Tactile Art Projects at Home',
    titleHi: 'घर पर आसानी से मिलने वाली शिक्षण सामग्री से स्पर्श संवेदी खिलौने बनाना',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A creative online livestream showing practical solutions using flour, sequence beads, grains, and recycled cardboard to make dynamic 3D learning collages.',
    descriptionHi: 'आटा, विभिन्न दालों, रंगीन मनकों और पुराने बक्सों के गत्तों की मदद से बच्चों के चलने, पकड़ने और छूकर समझने वाले खिलौने बनाने की एक मनोरंजक कार्यशाला।',
    badge: 'Livestream Workshop',
    badgeHi: 'लाइव कार्यशाला'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Best Special Teacher Award',
    titleHi: 'राज्य स्तर पर सर्वश्रेष्ठ विशेष शिक्षक सम्मान',
    category: 'State Recognition',
    categoryHi: 'राज्य स्तरीय सम्मान',
    date: '2024-09-05',
    description: 'Awarded by the Department of Education on Teachers Day for exemplary pedagogical contributions to integrated learning platforms.',
    descriptionHi: 'शिक्षा विभाग द्वारा शिक्षक दिवस के मुख्य पावन अवसर पर समेकित शिक्षा में क्रांतिकारी तथा उत्कृष्ट योगदान देने के लिए सम्मानित किया गया।',
    iconName: 'Award',
    issuer: 'State Ministry of Education',
    issuerHi: 'राज्य शिक्षा मंत्रालय',
    linkUrl: 'https://inclusive-education-gautam.org/docs/best_teacher_certificate.pdf',
    linkText: 'View State Honor Certificate',
    linkTextHi: 'आधिकारिक सम्मान पत्र देखें'
  },
  {
    id: 'ach-2',
    title: 'Inclusive Pedagogy Fellowship',
    titleHi: 'समावेशी अध्यापन राष्ट्रीय रिसर्च फैलोशिप',
    category: 'Professional Fellowship',
    categoryHi: 'व्यावसायिक शोध फैलोशिप',
    date: '2023-04-12',
    description: 'Honored with a national fellowship to research tactile instructional mediums for visually impaired students below 12 years.',
    descriptionHi: '12 वर्ष से कम आयु वाले दिव्यांग और दृष्टिबाधित बच्चों के विशिष्ट स्पर्श-आधारित अध्यापन साधनों के सृजन के लिए राष्ट्रीय फैलोशिप प्राप्त।',
    iconName: 'GraduationCap',
    issuer: 'National Council of Special Pedagogy',
    issuerHi: 'राष्ट्रीय विशेष शिक्षण परिषद',
    linkUrl: 'https://inclusive-education-gautam.org/docs/fellowship_grant.pdf',
    linkText: 'View Fellow Verification Letter',
    linkTextHi: 'फैलोशिप ग्रांट पत्र ऑनलाइन देखें'
  },
  {
    id: 'ach-3',
    title: 'Most Popular Inclusive Community Initiative',
    titleHi: 'सर्वाधिक लोकप्रिय समावेशी सामुदायिक खेल पहल पुरस्कार',
    category: 'Community impact',
    categoryHi: 'सामुदायिक प्रभाव',
    date: '2025-05-18',
    description: 'An appreciation plaque for mobilizing over 200 young adults as peer coaches during our Annual Unified Sports Festival.',
    descriptionHi: 'वार्षिक समेकित ग्रामीण खेल महोत्सव में 200 से अधिक युवाओं को वॉलंटियर व खेल प्रशिक्षक के रूप में सक्रिय करने के लिए मिला सम्मान पत्र।',
    iconName: 'Heart',
    issuer: 'Youth Developmental Foundation',
    issuerHi: 'युवा विकास फाउंडेशन',
    linkUrl: 'https://inclusive-education-gautam.org/docs/sports_appreciation.pdf',
    linkText: 'View Community Appreciation Plaque',
    linkTextHi: 'सामुदायिक प्रशंसा पत्र देखें'
  }
];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: 'soc-1', name: 'Facebook', url: 'https://facebook.com/gautam_special', iconName: 'Facebook', category: 'Social Network' },
  { id: 'soc-2', name: 'Instagram', url: 'https://instagram.com/gautam_educator', iconName: 'Instagram', category: 'Photography' },
  { id: 'soc-3', name: 'Youtube', url: 'https://youtube.com/@inclusive_classrooms', iconName: 'Youtube', category: 'Video Broadcast' },
  { id: 'soc-4', name: 'Official Website', url: 'https://inclusive-education-gautam.org', iconName: 'Globe', category: 'Professional Portal' }
];

export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  heroTitle: "Supporting Unique Potential",
  heroTitleHi: "असाधारण प्रतिभा का समर्थन",
  heroDesc: "Welcome to the digital hub of Chandrashekhar Gautam, a passionate Special Teacher. I believe standard instruction teaches subjects, whereas special teaching cultivates resilient, outstanding souls. Explore my chronological journey, publications, achievements, and adaptive resources.",
  heroDescHi: "चंद्रशेखर गौतम के डिजिटल हब में आपका स्वागत है, जो एक समर्पित विशेष शिक्षक (Special Teacher) हैं। मेरा दृढ़ विश्वास है कि सामान्य शिक्षा विषयों को सिखाती है, जबकि विशेष शिक्षा लचीली और साहसी आत्माओं को सींचती है। मेरी क्रोनोलॉजिकल जीवन यात्रा (Chronological Journey), शोध लेख (Publications), उपलब्धियां (Achievements) और शिक्षण संसाधनों को देखें।",
  
  teacherName: "Chandrashekhar Gautam",
  teacherNameHi: "चंद्रशेखर गौतम",
  teacherRole: "Senior Special Needs Educator",
  teacherRoleHi: "वरिष्ठ विशेष शिक्षक",
  teacherBio: "Senior special needs educator in public schools. Pioneer of Indian Sign Language guidelines and adaptive sensory learning kits for neurodivergent minds.",
  teacherBioHi: "शासकीय विद्यालयीन वरिष्ठ विशेष शिक्षक। दिव्यांग विद्यार्थियों के सशक्कीकरण, भारतीय सांकेतिक भाषा के विकास एवं संवेदी हस्तनिर्मित शैक्षिक किट निर्माण हेतु पूर्णतः समर्पित संकल्प।",
  teacherImageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300",

  card1Title: "Sensory Focus Pathways",
  card1TitleHi: "सेंसरी फोकस पाथवे",
  card1Desc: "We prioritize tactile pattern blocks, physical rhythmic loops, and bright visual schemas to stimulate cognitive learning in neurodivergent classrooms.",
  card1DescHi: "हम न्यूरोडाइवर्जेंट कक्षाओं में संज्ञानात्मक विकास को प्रोत्साहित करने के लिए स्पर्श ब्लॉकों, लयबद्ध संगीत प्रतिक्रियाओं और उज्ज्वल योजनाओं को प्राथमिकता देते हैं।",
  card1Color: "rose",
  card1Emoji: "🧠",

  card2Title: "Individualized IEP Guidance",
  card2TitleHi: "व्यक्तिगत IEP मार्गदर्शन",
  card2Desc: "Every child receives a dedicated individual learning program designed to match their natural pace of cognitive assimilation, keeping stress low and motivation high.",
  card2DescHi: "प्रत्येक बच्चे को उनकी सीखने की प्राकृतिक गति के अनुसार एक समर्पित इंडिविजुअलाइज्ड एजुकेशन प्रोग्राम (IEP) मिलता है, जिससे तनाव कम और विकास अधिक होता है।",
  card2Color: "amber",
  card2Emoji: "❤️",

  card3Title: "Unified Inclusive Communities",
  card3TitleHi: "एककृत समावेशी समुदाय",
  card3Desc: "Art festivals and unified play sessions connect mainstream children with special classrooms, weeding out social stigma through shared laughter.",
  card3DescHi: "कला उत्सव और खेल गतिविधियां सामान्य बच्चों को विशेष कक्षाओं से जोड़ते हैं, जिससे खेल-खेल में समाज की रूढ़ियों को दूर किया जा सके।",
  card3Color: "teal",
  card3Emoji: "🤝"
};

