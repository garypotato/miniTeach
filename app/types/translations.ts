export interface TranslationsType {
  nav: {
    home: string;
    allCompanions: string;
    about: string;
    joinAsCompanion: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    browseCompanions: string;
    learnMore: string;
  };
  companions: {
    title: string;
    description: string;
    allCompanions: string;
    allCompanionsDescription: string;
    noCompanionsFound: string;
    noCompanionsMessage: string;
    locationFilterDisabled: string;
    locationDataUpdating: string;
    locationUnavailableMessage: string;
    noCompanionsInCities: string;
    expandSearchMessage: string;
    clearFilters: string;
    backToHome: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      registration: {
        title: string;
        description: string;
      };
      verification: {
        title: string;
        description: string;
      };
      browsing: {
        title: string;
        description: string;
      };
      contact: {
        title: string;
        description: string;
      };
      connection: {
        title: string;
        description: string;
      };
    };
    note: string;
  };
  features: {
    title: string;
    subtitle: string;
    imageAlt: string;
    educationStudents: {
      title: string;
      description: string;
    };
    qualityValue: {
      title: string;
      description: string;
    };
    legalSafe: {
      title: string;
      description: string;
    };
    flexible: {
      title: string;
      description: string;
    };
    bilingual: {
      title: string;
      description: string;
    };
    interactiveLearning: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      note: string;
    };
  };
  footer: {
    company: string;
    description: string;
    services: string;
    findCompanions: string;
    aboutUs: string;
    contact: string;
    contactMessage: string;
    support: string;
    helpCenter: string;
    safety: string;
    terms: string;
    connect: string;
    facebook: string;
    instagram: string;
    twitter: string;
    copyright: string;
  };
  language: {
    switch: string;
    english: string;
    chinese: string;
  };
  breadcrumb: {
    home: string;
    allCompanions: string;
    companion: string;
  };
  companionDetail: {
    childCompanion: string;
    available: string;
    aboutMe: string;
    qualifications: string;
    contactUs: string;
    getContactInfo: string;
    contactDescription: string;
    metafields: {
      wechat_id: string;
      major: string;
      education: string;
      language: string;
      age: string;
      location: string;
      age_group: string;
      blue_card: string;
      police_check: string;
      skill: string;
      certification: string;
      availability: string;
    };
    noDetails: {
      title: string;
      description: string;
      infoWeProvide: string;
      education: string;
      skills: string;
      languages: string;
      certifications: string;
      availability: string;
    };
  };
  searchFilter: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    searching: string;
    filterButton: string;
    clearAll: string;
    activeFilters: string;
    name: string;
    city: string;
    modal: {
      title: string;
      subtitle: string;
      searchByName: string;
      searchPlaceholder: string;
      filterByLocation: string;
      selectedCities: string;
      clearAll: string;
      cancel: string;
      searchCompanions: string;
      searching: string;
    };
    stats: {
      searchByName: string;
      findSpecific: string;
      filterByCity: string;
      browseByLocation: string;
      findFavorites: string;
      discoverTop: string;
    };
  };
  companionsList: {
    childCompanion: string;
    verified: string;
    educationalFocus: string;
    available: string;
    viewProfile: string;
    save: string;
    previous: string;
    next: string;
    showing: string;
    of: string;
    companions: string;
    jumpToPage: string;
  };
  modal: {
    loading: string;
    pleaseWait: string;
    success: string;
    operationCompleted: string;
    loadingPage: string;
    searchingCompanions: string;
  };
  faq: {
    title: string;
    question1: {
      title: string;
      description: string;
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
      step4: {
        title: string;
        description: string;
      };
      step5: {
        title: string;
        description: string;
      };
    };
    question2: {
      title: string;
      description: string;
    };
    question3: {
      title: string;
      description: string;
      point1: string;
      point2: string;
      point3: string;
      point4: string;
      conclusion: string;
    };
    question4: {
      title: string;
      description: string;
      point1: string;
      point2: string;
      point3: string;
      conclusion: string;
    };
    question5: {
      title: string;
      description: string;
    };
  };
  about: {
    hero: {
      title: string;
      subtitle: string;
    };
    story: {
      title: string;
      introduction: string;
      paragraph1: string;
      paragraph2: string;
      paragraph3: string;
    };
    mission: {
      title: string;
      forStudents: {
        title: string;
        description: string;
      };
      forFamilies: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      description: string;
      browseCompanions: string;
      contactUs: string;
    };
  };
  companionCreate: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      personalInfo: string;
      contactInfo: string;
      professionalInfo: string;
      additionalInfo: string;
      photos: string;
      requiredFields: string;
      optionalFields: string;
      firstName: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      lastName: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      userName: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      password: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      major: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      location: {
        label: string;
        placeholder: string;
        required: boolean;
        options: {
          sydney: string;
          melbourne: string;
          brisbane: string;
          goldCoast: string;
          adelaide: string;
        };
      };
      description: {
        label: string;
        placeholder: string;
        required: boolean;
      };
      wechatId: {
        label: string;
        placeholder: string;
      };
      education: {
        label: string;
        placeholder: string;
      };
      language: {
        label: string;
        placeholder: string;
        options: {
          english: string;
          mandarin: string;
          cantonese: string;
          spanish: string;
          french: string;
          japanese: string;
          korean: string;
          other: string;
        };
      };
      age: {
        label: string;
        placeholder: string;
      };
      ageGroup: {
        label: string;
        placeholder: string;
        options: {
          infants: string;
          toddlers: string;
          preschool: string;
          schoolAge: string;
          teenagers: string;
        };
      };
      blueCard: {
        label: string;
        placeholder: string;
        options: {
          yes: string;
          no: string;
          pending: string;
        };
      };
      policeCheck: {
        label: string;
        placeholder: string;
        options: {
          yes: string;
          no: string;
          pending: string;
        };
      };
      skill: {
        label: string;
        placeholder: string;
        options: {
          musicLessons: string;
          artCrafts: string;
          cooking: string;
          sportsFitness: string;
          languageTutoring: string;
          homeworkHelp: string;
          specialNeeds: string;
          firstAid: string;
        };
      };
      certification: {
        label: string;
        placeholder: string;
        options: {
          earlyChildhood: string;
          firstAid: string;
          cpr: string;
          specialEducation: string;
          tefl: string;
          montessori: string;
          musicEducation: string;
          other: string;
        };
      };
      availability: {
        label: string;
        placeholder: string;
        options: {
          weekdayMornings: string;
          weekdayAfternoons: string;
          weekdayEvenings: string;
          weekendMornings: string;
          weekendAfternoons: string;
          weekendEvenings: string;
          holidays: string;
          emergency: string;
        };
      };
      images: {
        label: string;
        description: string;
        dragText: string;
        maxFiles: string;
        supportedFormats: string;
      };
    };
    buttons: {
      submit: string;
      submitting: string;
      cancel: string;
      addMore: string;
      remove: string;
    };
    validation: {
      required: string;
      email: string;
      minLength: string;
      maxLength: string;
      passwordStrength: string;
      maxImages: string;
      imageSize: string;
      imageFormat: string;
    };
    success: {
      title: string;
      message: string;
      nextSteps: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      backToHome: string;
    };
    error: {
      title: string;
      message: string;
      tryAgain: string;
      contactSupport: string;
    };
  };
}
