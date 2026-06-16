export const STRINGS = {
  DATE_FORMATES: {
    DD_MM_YYYY: 'DD/MM/YYYY',
    YYYY_MM_DD: 'YYYY-MM-DD',
    YYYY_MM_DD_HH_MM_A: 'YYYY-MM-DD hh:mm A',
    HH_MM_A: 'hh:mm A',
  },
  GENERIC: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    N_A: 'N/A',
    STATUS: 'Status',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUBMIT: 'SUBMIT',
  },
  KEY_VALUES: {},

  // RESET PASSWORD SCREEN
  RESET_PASSWORD: {
    TITLE: 'Reset Password',
    NEW_PASSWORD: 'New Password*',
    CONFIRM_PASSWORD: 'Confirm Password*',
    UPDATE: 'Update',
    ENTER_NEW_PASSWORD: 'Please enter your new password',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  },

  // VERIFY ACCOUNT SCREEN
  VERIFY_ACCOUNT: {
    TITLE: 'Verify Your Account',
    ENTER_CODE_SENT: 'Enter 6 digit code sent to your ',
    CHECK_INBOX:
      'Please check your inbox and enter the verification code below to confirm your email address.',
    SUBMIT: 'Submit',
    DIDNT_RECEIVE_EMAIL: "Didn't receive an email?",
    RESEND_CODE_IN: 'Resend Code in ',
    RESEND_CODE: 'Resend Code',
    ENTER_6_DIGIT_CODE: 'Please enter 6-digit code',
    CODE_SENT: 'Code has been sent to your email',
    ERROR: 'Error',
    PASSWORD_CHANGED: 'Password Changed',
    PASSWORD_CHANGED_SUCCESS: 'Your password has been Changed Successfully!',
    LOGIN_ERROR: 'Login Error',
    PLEASE_TRY_AGAIN: 'Please try again.',
  },

  // START NEW CHAT SCREEN
  START_NEW_CHAT: {
    TITLE: 'New Message',
    PORTAL_EVENTS: 'Portal Events',
    SELECT_EVENT: 'Select your event from list below',
    SEARCH_PLACEHOLDER: 'Search...',
    PORTALS: 'Portals',
    NONE: 'None',
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  },

  // MEMBER DETAIL SCREEN
  MEMBER_DETAIL: {
    types: {
      allMember: 'all-member',
      member: 'member',
      nurture: 'nurture',
    },
    optionKeys: {
      notes: 'notes',
      subscription: 'subscription',
      manageMission: 'manage-mission',
      questionAnswer: 'question-answer',
      profile: 'profile',
      updateCall: 'update_call',
    },
    leadStatus: 'Lead Status',
    active: 'Active',
    inactive: 'Inactive',
    unlocked: 'Unlocked',
    locked: 'Locked',
    yes: 'Yes',
    no: 'No',
    showMore: 'Show More',
    showLess: 'Show Less',
    na: 'N/A',
    masterLink: 'Master Link',
    completed: 'completed',
    incomplete: 'Incomplete',
    expired: 'Expired',
    confirmDisableCall:
      'Are you sure you want to disable call functionality for this user?',
    confirmEnableCall:
      'Are you sure you want to enable call functionality for this user?',
    stats: {
      membershipExpire: 'Membership Expire',
      coins: 'Coins',
      appDownloaded: 'App Downloaded',
      referredUser: 'Reffered User',
      nurture: 'Nurture',
      delegate: 'Delegate',
      badgeLevel: 'Badge Level',
      wheelOfLife: 'Wheel of life',
      lastLoginActivity: 'Last Login Activity',
      phoneNumber: 'Phone Number',
      leadStatus: 'Lead Status',
      wheelOfLifeCompletedDate: 'Wheel of Life Completed Date',
      clientNote: 'Client Note',
      pages: 'Pages',
      programmes: 'Programmes',
      wheelOfLifeEnable: 'Wheel of Life Enable',
      dailyIntentionCoins: 'Daily Intention Coins',
      gratitudeCoins: 'Gratitude Coins',
      assessmentCoins: 'Assessment Coins',
      meditationCoins: 'Meditation Coins',
      goalStatement: 'Goal Statement',
      createdAt: 'Created At',
      registrationDate: 'Registration Date',
      status: 'Status',
      goal: 'Goal',
    },
  },

  // QUESTIONS LIST SCREEN
  QUESTIONS_LIST: {
    title: 'Questions Answers List',
    optionKeys: {
      answers: 'answers',
    },
    answersDetails: 'Answers Details',
    stats: {
      questionsCreatedFor: 'Questions Created For',
      moduleTitle: 'Module Title',
      answeredDate: 'Answered Date',
    },
  },

  // QUESTION COMPONENT
  QUESTION_COMPONENT: {
    questionStatement: 'Question Statement',
    showRepliesToClient: 'Show Replies to Client',
    viewDocument: 'View Document',
    replies: 'Replies',
  },

  // MEMBER MANAGE SCREEN
  MEMBER_MANAGE: {
    tabs: {
      mission: 'Mission',
      quest: 'Quest',
    },
    title: 'Title',
    missionDuration: 'Mission Duration',
    questDuration: 'Quest Duration',
    status: 'Status',
    inProgress: 'In Progress',
    completed: 'Completed',
    viewMore: 'View More...',
  },

  // MEMBER LIST SCREEN (MISSION)
  MISSION_MEMBER_LIST: {
    membersTitle: "'s Members",
    showing: 'Showing',
    of: 'of',
    filterBy: 'Filter by: ',
    inProgress: 'In Progress',
    completed: 'Completed',
    acceptTime: 'Accept Time',
    current: 'Current',
    startFrom: 'Start from',
    to: 'to',
    endDateFrom: 'End Date from',
    sortBy: 'Sort by: ',
    lowToHigh: 'Low to high',
    highToLow: 'High to low',
    coinsAttractFrom: 'Coins Attract from',
    clearFilter: 'Clear Filter',
    completedMembers: 'Completed Members',
    inProgressMembers: 'In Progress Members',
    totalRevenue: 'Total Revenue',
    startDate: 'Start Date',
    endDate: 'End Date',
    completedDays: 'Completed Days',
    acceptTimeBadge: 'Accept Time Badge',
    currentBadge: 'Current Badge',
    coinsAttracted: 'Coins Attracted',
    targetCoins: 'Target Coins',
    status: 'Status',
    csvFileDownloaded: 'CSV File Downloaded',
  },

  // MISSION REPORT SCREEN
  MISSION_REPORT: {
    report: "'s Report",
    note: 'Note: This member has not enabled content viewing for this mission, so the content is currently not visible to you. Once the member grants access, you will be able to view the content..',
    comparisonGraph: 'Comparison Graph',
    missionReportGraphOverview: 'Mission Report Graph Overview',
    detailOverview: 'Detail Overview',
    missionReportDetailOverview: 'Mission Report Detail Overview',
    gratitude: 'Gratitude',
    intentions: 'Intentions',
    contentQuestions: 'Content Questions',
    journal: 'Journal',
    interactiveLearningExperience: 'Interactive Learning Experience',
    gratitudeLabels: [
      'What are you grateful for today?',
      'Who do you want to send love to today?',
      'What do you desire most out of today?',
    ],
    dailyDynamiteLabels: [
      'Where will I focus my energy today?',
      'What am I committed to achieving today?',
      'What 1 decision or action can I take today?',
    ],
    journalPlaceholder:
      'What did you take away from todays lesson? Keep a note of all your aha moments! ',
  },

  // MISSION FILTER SCREEN
  MISSION_FILTER: {
    title: 'Filter',
    status: 'Status',
    all: 'All',
    sortBy: 'Sort by',
    lowToHigh: 'Low to high',
    highToLow: 'High to low',
    filterMemberByBadgeLevel: 'Filter Member by Badge Level*',
    currentUserBadgeLevel: 'Current User Badge level',
    searchByStartDate: 'Search By Start Date',
    startDateFrom: 'Start Date From',
    endDateFrom: 'End Date From',
    searchByEndDate: 'Search By End Date',
    searchByAttractedCoins: 'Search By Attracted Coins',
    coinFrom: 'Coin From*',
    coinTo: 'Coin To*',
    clearFilter: 'Clear Filter',
    submit: 'Submit',
    pleaseSelectFilterMember: 'Please Select the Filter Member by Badge Type',
    filterBadgeLevelNotSelected: 'Filter Badege Level Not Selected',
    noOptions: 'No options',
    completed: 'Completed',
    inProgress: 'In Progress',
    none: 'None',
    memberCurrentBadgeLevel: "Member's Current Badge Level",
    acceptanceTimeUserBadgeLevel: 'Acceptance Time User Badge Level',
  },

  // AUTOMATED GROUP LIST SCREEN
  AUTOMATED_GROUP_LIST: {
    title: 'Automated Groups',
    startDay: 'Start Day',
    endDay: 'End Day',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    noGroupsFound: 'No Groups found',
    deleteConfirmation: 'Are you sure you want to delete this Automated Group?',
    activeMembers: 'Active Members',
    allMembers: 'All Members',
    edit: 'Edit',
    delete: 'Delete',
    viewMembers: 'View Members',
  },

  // AUTOMATED GROUP DETAIL SCREEN
  AUTOMATED_GROUP_DETAIL: {
    excludeMembers: 'Exclude Members',
    excludeConfirmation: 'Are you sure you want to exclude these members?',
    allMemberList: 'ALL MEMBER LIST',
    excludedMemberList: 'EXCLUDED MEMBER LIST',
  },

  // CALENDAR GROUP DETAIL SCREEN
  CALENDAR_GROUP_DETAIL: {
    viewMore: 'View More',
    title: 'Title',
    duration: 'Duration',
    days: ' days',
    salePageTitle: 'Sale Page Title',
    clickFunnel: ' | Click Funnel',
    moon: ' | Moon',
    paymentPlan: 'Payment Plan',
    description: 'Description',
    programmes: 'Programmes',
    events: 'Events',
    excludeConfirmation: 'Are you sure you want to exclude these members?',
    dateSeparator: '   -   ',
    noExpiry: 'No Expiry',
    inactive: '   |   Inactive',
    grpType: {
      program: {
        tab: 'PROGRAMMES LIST',
        title: 'Programmes',
        variable: 'program',
      },
      event: {
        tab: 'EVENTS LIST',
        title: 'Events',
        variable: 'event',
      },
      sale_page: {
        tab: 'SALE PAGES LIST',
        title: 'Sale Pages',
        variable: 'event',
      },
      mission: {
        tab: 'MISSIONS LIST',
        title: 'Missions',
        variable: 'mission',
      },
    },
    tabList: {
      groupIndividualMemberList: 'GROUP INDIVIDUAL MEMBER LIST',
      excludedMemberList: 'EXCLUDED MEMBER LIST',
      allMemberList: 'ALL MEMBER LIST',
    },
  },

  // CALENDAR GROUP FILTER SCREEN
  CALENDAR_GROUP_FILTER: {
    title: 'Filter',
    groupBy: 'Group by',
    badgeLevel: 'Badge Level',
    clearFilter: 'Clear Filter',
    submit: 'Submit',
    selectBadgeLevels: 'Select Badge Levels',
    noOptions: 'No options',
    grpByTypes: {
      programme: 'Programmme',
      event: 'Event',
      salePage: 'Sale Page',
      missionsQuests: 'Missions \\ Quests',
    },
  },

  // CALENDAR GROUP LIST SCREEN
  CALENDAR_GROUP_LIST: {
    title: 'Groups',
    filterBy: 'Filter By: ',
    clearFilter: 'Clear Filter',
    noGroupsFound: 'No Groups found',
    deleteConfirmation: 'Are you sure you want to delete this earning?',
    viewMore: 'View More',
    clickFunnel: 'Click Funnel',
    moon: 'Moon',
    groupBy: {
      event: 'Event',
      program: 'Programme',
      sale_page: 'Sale Page',
      mission: 'Mission',
      badge_level: 'Badge Levels',
    },
    includeMembersOptions: {
      active: 'Active Members',
      all: 'All Members',
      no_prior_access: 'Members Without Any Prior Access',
    },
    stats: {
      type: 'Type',
      groupBy: 'Group By',
      members: 'Members',
      includeMembers: 'Include Members',
      badgeLevel: 'Badge Level',
      status: 'Status',
    },
    options: {
      edit: 'Edit',
      delete: 'Delete',
      viewDetail: 'View Detail',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
    },
  },

  // CALENDAR GROUP ADD/EDIT SCREEN
  CALENDAR_GROUP_ADD_EDIT: {
    titleEdit: 'Edit Group',
    titleAdd: 'Add Group',
    groupName: 'Group Name*',
    groupStatus: 'Group Status *',
    active: 'Active',
    inactive: 'Inactive',
    groupBy: 'Group By *',
    includeUsersOf: 'Include users of these',
    includeMembers: 'Include Members *',
    badgeLevel: 'Badge Level',
    programmes: 'Programmes',
    event: 'Event',
    salePages: 'Sale Pages',
    missionQuest: 'Mission | Quest',
    badgeLevels: 'Badge Levels',
    paymentPlans: 'Payment Plans',
    members: 'Members',
    excludeMembers: 'Exclude Members',
    submit: 'Submit',
    alert: 'Alert',
    pleaseEnterGroupName: 'Please enter group name',
    clickFunnel: 'Click Funnel',
    moon: 'Moon',
    modalTitles: {
      programme: 'Programme',
      event: 'Event',
      salePage: 'Sale Page',
      plan: 'Plan',
      member: 'Member',
      missionsAndQuests: 'Missions and Quests',
    },
    memberTypes: {
      nurturedAndDelegated: 'Nurture & Delegated',
      all: 'All',
    },
    groupByTypes: {
      programme: 'Programmme',
      event: 'Event',
      salePage: 'Sale Page',
      missionsQuests: 'Missions | Quests',
      badgeLevel: 'Badge Level',
    },
    infoHTML: {
      activeMembers: '<h4>Active Members</h4>',
      activeMembersDesc:
        '<p>Refers to users who currently have access to a {typeTitle}, and whose access has not yet expired.</p>',
      allMembers: '<h4>All Members</h4>',
      allMembersDesc:
        '<p>Refers to all users associated with a {typeTitle}, regardless of whether their access is currently active or has expired.</p>',
      noPriorAccess: '<h4>Members with No Prior Access</h4>',
      noPriorAccessDesc:
        '<p>This includes users who have never been granted access to the {typeTitle} at any point. It does not include users whose access was previously granted but has since expired.</p>',
      separator: '<h4/><h4/>',
    },
  },

  // CALL HISTORY NOTE MODAL
  CALL_HISTORY_NOTE_MODAL: {
    title: 'Call History Note',
    date: 'Date*',
    addToPersonalNotes: 'Would you like to add it to Personal Notes? *',
    yes: 'Yes',
    no: 'No',
    note: 'Note*',
    submit: 'Submit',
    alertTitle: 'Alert',
    noteEmpty: "Note can't be empty",
  },

  // CALENDAR VIEW
  CALENDAR_VIEW: {
    eventFrom: 'Event From:',
    eventTo: 'Event To:',
    iterationFrom: 'Iteration From:',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    noEventFound: 'No Event Found',
  },

  // TRANSACTIONS SCREEN
  TRANSACTION: {
    title: 'Transactions',
    showing: 'Showing',
    of: 'of',
    filteredBy: 'Filtered By:',
    all: 'All',
    noTransactionsFound: 'No Transactions Found',
    searchPlaceholder: 'Search...',
    preview: 'Preview',
    transactionType: 'Transaction Type',
    paymentMadeBy: 'Payment Made By (Transaction ID)',
    amount: 'Amount',
    teamDiego: 'Team Diego',
    referralCommission: 'Refferal Commission',
    referralUser: 'Refferal User',
    transactionReferralCommission: 'Transaction Refferal Commission',
    transactionReferral: 'Transaction Refferal',
    transactionDate: 'Transaction Date',
    totalTickets: 'Total Tickets',
    agreementPDF: 'Agreement PDF',
    createdBy: 'Created By',
    otherInformation: 'Other Information',
    discountInformation: 'Discount Information',
    transactionMode: 'Transaction Mode',
    deleteConfirmation: 'Are you sure you want to delete this subscription?',
    indexLabel: index => ` ${index + 1}.`,
    fullName: (first, last) => `${first} ${last}`,
    createdByFormat: (createdBy, platform) =>
      `${createdBy}${platform ? ' (' + platform + ')' : ''}`,
    delete: 'Delete',
  },

  // TRANSACTION FILTER SCREEN
  TRANSACTION_FILTER: {
    filter: 'Filter',
    transactionMode: 'Transaction Mode',
    clear: 'Clear',
    filterButton: 'Filter',
    all: 'All',
    sandBox: 'Sand Box',
    live: 'Live',
  },

  // TRANSACTION VIEW COMPONENT
  TRANSACTION_VIEW: {
    succeeded: 'succeeded',
    programAmount: 'Program Amount',
    transaction: 'Transaction',
    salePage: 'Sale Page',
    commissionAmount: 'Commission Amount',
    transactionMode: 'Transaction Mode',
    agreementPDF: 'Agreement PDF',
    marketingAffiliateCommission: 'Marketing Affiliate Commission',
    date: 'Date',
    preview: 'Preview',
  },

  // COMMISSION SCREEN
  COMMISSION: {
    title: 'Commission Detail',
    totalCommission: 'Total Commission',
    paidCommission: 'Paid Commission',
    pendingCommission: 'Pending Commission',
    noTransactionsFound: 'No Transactions Found',
  },

  // COMMISSION TRANSACTION VIEW COMPONENT
  COMMISSION_TRANSACTION_VIEW: {
    transactionDate: 'Transaction Date',
    credit: 'Credit',
    paid: 'Paid',
  },

  // PAYMENT REQUEST SCREEN
  PAYMENT_REQUEST: {
    showing: 'Showing',
    of: 'of',
    noPaymentRequestsFound: 'No Payment Requests Found',
    deleteConfirmation: 'Are you sure you want to delete this payment request?',
    cancelConfirmation: 'Are you sure you want to cancel this payment request?',
    // Options
    edit: 'Edit',
    delete: 'Delete',
    viewDetail: 'View Detail',
    agreementConfiguration: 'Agreement Configuration',
    manageProgrammeAccess: 'Manage Programme Access',
    manageProgressAccess: 'Manage Progress Access',
    copyBankPaymentLink: 'Copy Bank Payment Link',
    markRequestAsCancelled: 'Mark Request As Cancelled',
    markRequestAsPaid: 'Mark Request As Paid',
    // Sort options
    all: 'All',
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    cancelled: 'Cancelled',
  },

  // PAYMENT REQUEST DETAIL SCREEN
  PAYMENT_REQUEST_DETAIL: {
    title: 'Payment Request Transaction',
    enterCardDetails: 'Enter Card Details',
    cardNumberPlaceholder: 'Card Number...',
    pay: 'Pay',
    successful: 'Successful',
    failed: 'Failed',
    reminder: 'Reminder',
    email: 'Email',
    notification: 'Notification',
    message: 'Message',
    whatsapp: 'Whatsapp',
    sendReminder: 'Send Reminder',
    sendReminderConfirmation: 'Are you sure you want to send reminder ?',
    transactions: 'Transactions',
    requestType: 'Request Type',
    totalAmount: 'Total Amount:',
    initialDepositAmount: 'Initial Deposit Amount:',
    totalInstallments: 'Total Installments:',
    installmentsPlan: 'Installments Plan:',
    amount: 'Amount:',
    transactionNote: 'Transaction Note:',
    transactionDate: 'Transaction Date:',
    status: 'Status:',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    failed: 'Failed',
    reminderSentSuccess: 'Reminder sent successfully',
  },

  // BANK OPTION MODAL
  BANK_OPTION_MODAL: {
    title: 'Payment Request Detail',
    name: 'Name',
    email: 'Email',
    paymentInEuro: 'Payment in Euro',
    paymentInPound: 'Payment in Pound',
    copyBankUrl: 'Copy Bank Url',
    bankUrlCopied: 'Bank URL coppied to clipboard',
  },

  // MANAGE PROGRAMME ACCESS SCREEN
  MANAGE_PROGRAMME_ACCESS: {
    title: 'Manage Programme Access',
    selectAll: 'Select All',
    update: 'Update',
    updateSuccess: 'Programme Access Updated Successfully',
    somethingWentWrong: 'Something went wrong',
    programmeTitle: 'Programme Title',
    noOfStartDays: 'No of Start Days',
    noOfEndDays: 'No of End Days',
  },

  // PAYMENT REQUEST VIEW COMPONENT
  REQUEST_VIEW: {
    requestTitle: 'Request Title',
    product: 'Product',
    paymentTemplate: 'Payment Template',
    requestType: 'Request Type',
    totalAmount: 'Total Amount',
    initialAmount: 'Initial Amount',
    installmentAmount: 'Installment Amount',
    month: 'Month',
    salePage: 'Sale Page',
    considerPurchasingUser: 'Consider Purchasing User',
    leadStatus: 'Lead Status',
    firstPaid: 'First Paid',
    status: 'Status',
    paidOn: 'PAID on',
    cancelledOn: 'Cancelled on',
    processing: 'PROCESSING',
    pending: 'PENDING',
    active: 'ACTIVE',
    inactive: 'INACTIVE',
  },

  // ASSESSMENT LIST SCREEN
  ASSESSMENT_LIST: {
    attitudeCoins: 'Attitude Coins',
    delegate: 'Delegate',
    nurture: 'Nurture',
    completedDate: 'Completed Date',
    assessmentLevel: 'Assessment Level',
    showing: 'Showing',
    of: 'of',
    viewHistory: 'View History',
  },

  // ASSESSMENT DETAIL SCREEN
  ASSESSMENT_DETAIL: {
    assessmentHistory: 'Assessment History',
    completedDate: 'Completed Date: ',
    clientNotes: 'Client Notes',
    thoughts: 'THOUGHTS',
    feelings: 'FEELINGS',
    actions: 'ACTIONS',
  },

  // ASSESSMENT NOTES LIST SCREEN
  ASSESSMENT_NOTES_LIST: {
    title: 'Notes',
    noNotes: 'No notes',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirmation: 'Are you sure you want to delete this note?',
  },

  // ASSESSMENT NOTES ADD/EDIT SCREEN
  ASSESSMENT_NOTES_ADD_EDIT: {
    editNote: 'Edit Note',
    addNote: 'Add Note',
    cancel: 'Cancel',
    update: 'Update',
    save: 'Save',
    pleaseEnterNote: 'Please enter note',
  },

  // LOGIN SCREEN
  LOGIN: {
    welcomeTo: 'Welcome To',
    enterDetails: 'Enter your details below.',
    emailLabel: 'Email Address*',
    passwordLabel: 'Password*',
    forgotPassword: 'Forgot Password?',
    loginButton: 'LOGIN',
    enterEmail: 'Please enter your email',
    enterValidEmail: 'Please enter valid email',
    enterPassword: 'Please enter password',
    loginError: 'Login Error',
    tryAgain: 'Please try again',
  },

  // FORGOT PASSWORD SCREEN
  FORGOT_PASSWORD: {
    title: 'Forget Password',
    emailLabel: 'Email Address*',
    submitButton: 'Submit',
    enterEmail: 'Please enter your email address!',
    enterValidEmail: 'Please enter valid email address!',
  },

  // OTP SCREEN
  OTP: {
    title: 'Please check your email',
    description: 'Enter PIN Code here.',
    submitButton: 'Submit',
    enterCode: 'Please enter your 6 digit code!',
  },

  // AGREEMENT CONFIGURATION SCREEN
  AGREEMENT_CONFIGURATION: {
    title: 'Agreement Configuration',
    agreementDescription: 'Agreement Description*',
    agreementAlertDescription: 'Agreement Alert Description*',
    agreementDescriptionRequired: 'Agreement Description is Required',
    agreementAlertDescriptionRequired:
      'Agreement Alert Description is Required',
    error: 'Error',
    success: 'Success',
    updateSuccess: 'Agreement Configuration updated successfully',
    showAgreementPage: 'Show Agreement Page*',
    update: 'Update',
    yes: 'Yes',
    no: 'No',
  },

  // ADD PAYMENT REQUEST SCREEN
  ADD_PAYMENT_REQUEST: {
    addPaymentRequest: 'Add Payment Request',
    editPaymentRequest: 'Edit Payment Request',
    copyBankDetails: 'Copy Bank Details',
    alert: 'Alert',
    pleaseSelectCountry: 'Please select country',
    memberInfo: 'Member Info',
    existingMember: 'Existing Member',
    newMember: 'New Member',
    members: 'Members*',
    firstName: 'First Name*',
    lastName: 'Last Name*',
    email: 'Email*',
    chooseCountry: 'Choose a country',
    noCountrySelected: 'No Country Selected...',
    clear: 'Clear',
    paymentRequestInfo: 'Payment Request Info',
    paymentTemplate: 'Payment Template',
    requestTitle: 'Request Title*',
    status: 'Status',
    currency: 'Currency*',
    product: 'Product*',
    programme: 'Programme',
    paymentRequestType: 'Payment Request Type',
    totalAmount: 'Total Amount*',
    initialAmount: 'Initial Amount*',
    noOfInstallments: 'No. of Installments*',
    installmentsAmount: 'Installments Amount*',
    planPaymentType: 'Plan Payment Type*',
    noOfDays: 'No. of Days*',
    vatNumber: 'VAT Number',
    leadStatus: 'Lead Status',
    considerPurchasingUserAs: 'Consider Purchasing User As*',
    sourceMember: ' Source Member',
    salePages: 'Sale Pages',
    transactionNote: 'Transaction Note',
    submit: 'Submit',
    member: 'Member',
    active: 'Active',
    inactive: 'Inactive',
    dollar: 'Dollar',
    ukPounds: 'UK Pounds',
    euro: 'Euro',
    onetime: 'Onetime',
    recurring: 'Recurring',
    monthly: 'Monthly',
    weekly: 'Weekly',
    yearly: 'Yearly',
    custom: 'Custom',
  },

  // MARK AS PAID SCREEN
  MARK_AS_PAID: {
    member: 'Member',
    totalAmount: 'Total Amount',
    currency: 'Currency',
    transactionNote: 'Transaction Note *',
    transactionNoteRequired: 'Transaction note is not allowed to be empty',
    submit: 'Submit',
  },

  // BOOKINGS SCREEN
  BOOKINGS: {
    bookingPage: 'Booking Page',
    date: 'Date',
    memberNuture: "Member's Nuture",
    bookingStatus: 'Booking Status',
    showing: 'Showing',
    of: 'of',
    noPaymentRequestsFound: 'No Payment Requests Found',
    deleteConfirmation: 'Are you sure you want to delete this Booking?',
    startDate: 'Start Date: ',
    endDate: ' End Date: ',
    clearFilter: 'Clear Filter',
    // Options
    questionAnswersDetail: 'Question Answers Detail',
    bookingNotes: 'Booking Notes',
    delete: 'Delete',
    changeStatus: 'Change Status',
    edit: 'Edit',
    passBooking: 'Pass Booking',
  },

  // BOOKING FILTER SCREEN
  BOOKING_FILTER: {
    filter: 'Filter',
    filterByBookingDates: 'Filter By Booking Dates',
    from: 'From',
    to: 'To',
    selectBookingPages: 'Select Booking Pages',
    selectBookingStatus: 'Select Booking Status',
    sortBy: 'Sort By',
    clearFilter: 'Clear Filter',
    submit: 'Submit',
    bookingPage: 'Booking Page',
    bookingStatus: 'Booking Status',
    callBookedNewestFirst: 'Call booked Newest First',
    callBookedOldestFirst: 'Call booked Oldest First',
  },

  // ADD BOOKING SCREEN
  ADD_BOOKING: {
    passBooking: 'Pass Booking',
    editBooking: 'Edit Booking',
    addNewBooking: 'Add New Booking',
    member: 'Member*',
    delegate: 'Delegate*',
    pageTitle: 'Page Title*',
    bookingPage: 'Booking Page*',
    date: 'Date*',
    timeSlots: 'Time Slots*',
    isNotifyUser: 'Is Notify User',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    // Modal types
    memberType: 'Member',
    delegateType: 'Delegate',
    bookingPageType: 'Booking Page',
    timeSlotType: 'Time Slot',
    // Error messages
    memberNameEmpty: "Member's name can not be empty !",
    selectDelegate: 'Please select a Delegate!',
    bookingPageEmpty: 'Booking Page can not be empty !',
    dateEmpty: 'Date can not be empty !',
    timeSlotEmpty: 'Time Slot can not be empty !',
    alert: 'Alert',
  },

  // BOOKING NOTES LIST SCREEN
  BOOKING_NOTES_LIST: {
    bookingNotes: 'Booking Notes',
    admin: '(Admin)',
    consultant: '(Consultant)',
    createdAt: 'Created at: ',
    lastAction: 'Last Action: ',
    total: 'Total: ',
    noNotes: 'No notes',
    deleteConfirmation: 'Are you sure you want to delete this note?',
    // Options
    edit: 'Edit',
    delete: 'Delete',
    addToCalendarEvent: 'Add to Calendar Event',
  },

  // ADD NOTE SCREEN
  ADD_NOTE: {
    editNote: 'Edit Note',
    addNote: 'Add Note',
    addToPersonalNotes: 'Would you like to add it to Personal Notes?',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
    enterNote: 'Please enter note',
  },

  // CHANGE STATUS MODAL
  CHANGE_STATUS_MODAL: {
    changeBookingStatus: 'Change Booking Status',
    bookingStatus: 'Booking Status',
    addToPersonalNotes: 'Would you like to add it to Personal Notes? *',
    yes: 'Yes',
    no: 'No',
    note: 'Note',
    update: 'Update',
    status: 'Status',
    selectBookingStatus: 'Please select booking status',
    alert: 'Alert',
    statusChanged: 'Status Changed',
  },

  // APPOINTMENT CONFIGURATION SCREEN
  APPOINTMENT_CONFIGURATION: {
    from: 'From*',
    to: 'To*',
    duplicate: 'Duplicate',
    intervalType: 'Interval Type *',
    builtIn: 'Built In',
    custom: 'Custom',
    slotDuration: 'Slot Duration *',
    min15: '15 min',
    min30: '30 min',
    min45: '45 min',
    min60: '60 min',
    customDurationInMin: 'Custom Duration in Min',
    startDate: 'Start Date*',
    endDate: 'End Date*',
    weekdays: 'Weekdays *',
    save: 'Save',
    alert: 'Alert',
    selectIntervalType: 'Please Select Interval type of Interval ',
    enterSlotDuration: 'Please enter slot duration of Interval ',
    selectWeekdays: 'Please select weekdays of Interval ',
    duplicateConfirmation: 'Are you sure you want to duplicate this interval?',
    deleteConfirmation: 'Are you sure you want to delete this interval?',
    // Weekdays
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  },

  // LINKS LIST SCREEN
  LINKS_LIST: {
    showing: 'Showing',
    of: 'of',
    pageTitle: 'Page Title',
    copyUrl: 'Copy Url',
    url: 'URL',
    copyMainUrl: 'Copy Main URL ',
    copyAppointmentUrl: 'Copy Appointment URL ',
    preview: 'Preview ',
    appointmentUrlCopied: 'Appointment URL copied to clipboard',
    previewUrlCopied: 'Preview URL copied to clipboard',
    // Tabs
    salePages: 'SALE PAGES',
    bookingPages: 'BOOKING PAGES',
    funnels: 'FUNNELS',
    // Options
    copyMainUrlOption: 'Copy Main URL',
    copyAppointmentUrlOption: 'Copy Appointment URL',
    setCommission: 'Set Commission',
    manageSubTeamAccess: 'Manage Sub Team Access',
  },
  LINKS_PAYMENT_PLAN_LIST: {
    showing: 'Showing',
    of: 'of',
    paymentPlans: 'Payment Plans',
    planTitle: 'Plan Title',
    planType: 'Plan Type',
    noCommissionFound: 'No Commission Found!',
    manageSalesTeamCommission: 'Manage Sales Team Commission',
  },
  LINKS_SALES_COMMISSION: {
    title: 'Manage Sale Team Commisison',
    commissionAmount: 'Commission Amount',
    commissionMustBeLess: 'Commission amount must be less than',
    yourCommissionOnEveryTransaction: 'Your Commission on every transaction : ',
    noDataFound: 'No Data Found!',
    submit: 'Submit',
    alert: 'Alert',
  },
  SUB_TEAM_ACCESS: {
    title: 'Manage Sale Team Commisison',
    approved: 'Approved',
    pending: 'Pending',
    noDataFound: 'No Data Found!',
    saveChanges: 'Save Changes',
  },

  // MEMBER LIST SCREEN
  MEMBER_LIST: {
    allMembers: 'All Members',
    members: 'Members',
    nurtureMembers: 'Nurture Members',
    showing: 'Showing',
    of: 'of',
    filteredBy: 'Filtered By : ',
    seeAll: 'See All...',
    seeLess: 'See Less...',
    clearFilter: 'Clear Filter',
    saveFilter: 'Save Filter',
    search: 'Search...',
    membershipExpire: 'Membership Expire',
    coins: 'Coins',
    refferedUser: 'Reffered User',
    masterLink: 'Master Link',
    nurture: 'Nurture',
    delegate: 'Delegate',
    badgeLevel: 'Badge Level',
    lastLoginActivity: 'Last Login Activity',
    leadStatus: 'Lead Status',
    viewMore: 'View More...',
    na: 'N/A',
    active: 'Active',
    expired: 'Expired',
    inactive: 'Inactive',
    downloaded: 'Downloaded',
    notDownloaded: 'Not Downloaded',
    csvFileDownloaded: 'CSV File Downloaded',
    expireIn: 'Expire in',
    days: 'days',
    membershipExpiryStartDate: 'Membership Expiry Start Date : ',
    membershipExpiryEndDate: ' - Membership Expiry End Date : ',
    startDate: 'Start Date : ',
    endDate: ' - End Date : ',
    startCoins: 'Start Coins : ',
    endCoins: ' - End Coins : ',
    areYouSureDisableCall:
      'Are you sure you want to disable call functionality for this user?',
    areYouSureEnableCall:
      'Are you sure you want to enable call functionality for this user?',
    memberHasDownloadedApp: 'This Member has downloaded the app',
    memberHasNotDownloadedApp: 'This Member has not downloaded the app yet',
  },

  // LEAD MODAL
  LeadModal: {
    leadStatus: 'Lead Status',
    selectLeadStatusFromList: 'Select Lead Status from list below',
    editHistoryLeadStatus: 'Edit History Lead Status',
    changeLeadStatus: 'Change Lead Status',
    leadStatusLabel: 'Lead Status*',
    income: 'Income*',
    date: 'Date*',
    expiryDate: 'Expiry Date*',
    update: 'Update',
    selectLeadStatusPlaceholder: 'Please select the lead status',
    pleaseSelectLeadStatus: 'Please select lead status',
    alert: 'Alert',
    success: 'Success',
    updateLeadStatusConfirmation:
      'Are you sure you want to update lead status?',
  },

  // LEAD HISTORY MODAL
  LeadHistoryModal: {
    title: 'Lead Status History',
    searchPlaceholder: 'Search...',
    incomeValue: 'Income Value',
    currencySymbol: '£ ',
    actionInfo: 'Action Info',
    date: 'Date',
    expiryDate: 'Expiry Date',
    deleteConfirmation: 'Are you sure you want to delete it?',
    edit: 'Edit',
    delete: 'Delete',
  },

  // FILTER MODAL
  FilterModal: {
    title: 'Member Filter',
    filterFrom: 'Filter From',
    savedFilter: 'Saved Filter',
    salePages: 'Sale Pages',
    choosePlan: 'Choose Plan',
    chooseProgrammes: 'Choose Programmes',
    programmesStatus: 'Programmes Status',
    chooseNurture: 'Choose Nuture',
    chooseDelegate: 'Choose Delegate',
    leadStatus: 'Lead Status',
    badgeLevels: 'Badge Levels',
    memberStatus: 'Member Status',
    onlineStatus: 'Online Status',
    appDownloadedStatus: 'App Downloaded Status',
    membershipStatus: 'Membership Status',
    expireIn: 'Expire In',
    membershipExpiryStartDate: 'Membership Expiry Start Date',
    membershipExpiryEndDate: 'Membership Expiry End Date',
    dateRange: 'Date Range',
    startDate: 'Start Date*',
    endDate: 'End Date*',
    coinsRange: 'Coins Range',
    coinsFrom: 'Coins From*',
    coinsTo: 'Coins To*',
    applyFilter: 'Apply Filter',
    clearAll: 'Clear all',
    clear: 'Clear',
    nurture: 'Nurture',
    delegate: 'Delegate',
    alertTitle: 'Alert',
    selectDateRangeMessage: 'Please select a Start Date & End Date',
  },

  // SAVE FILTER MODAL
  SaveFilterModal: {
    title: 'Save Filter',
    filterName: 'Filter Name',
    save: 'Save',
    alertTitle: 'Alert',
    pleaseEnterFilterName: 'Please enter filter name',
  },

  Common: {
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    na: 'N/A',
  },

  // SUBSCRIPTION LIST SCREEN
  SUBSCRIPTION_LIST: {
    title: 'Member Subscriptions',
    searchPlaceholder: 'Search...',
    preview: 'Preview',
    product: 'Product',
    createdBy: 'Created By',
    subscriptionMode: 'Subscription Mode',
    nextInvoiceDate: 'Next Invoice Date',
    subscriptionDate: 'Subscription Date',
    subscriptionId: 'Subscription ID',
    card: 'Card',
    status: 'Status',
    pageTitle: 'Page Title',
    planTitle: 'Plan Title',
    referralUser: 'Referral User',
    agreementPDF: 'Agreement PDF',
    registerLink: 'Register Link',
    delete: 'Delete',
    deleteConfirmation: 'Are you sure you want to delete this subscription?',
    showingOfTotal: (current, total) => `Showing ${current} of ${total}`,
    indexLabel: index => ` ${index + 1}.`,
    expired: 'Expired',
    recurring: 'recurring',
    planTitleFormat: (title, access, isRecursion) =>
      `${title} (${isRecursion ? 'recurring' : access})`,
    fullName: (first, last) => `${first} ${last}`,
    quest: title => `Quest (${title})`,
    mission: title => `Mission (${title})`,
    paymentRequest: (title, type) => `Payment Request (${title} | ${type})`,
    salePage: (title, plan) => `Sale Page (${title} | ${plan})`,
    clickFunnels: name => `Click Funnels  (${name}})`,
    subscriptionIdCopied: 'Subscription ID copied Successfully',
    cardNumber: last4 => `**** **** **** ${last4}`,
    cancelationReason: `<h5 style="text-align: center;"> Cancellation Reason </h5>
        <p style="text-align: left;">`,
    viewCancelationRequest: 'View Cancelation Request',
  },

  // MEMBER NOTES LIST SCREEN
  MEMBER_NOTES_LIST: {
    title: 'Personal Notes',
    noNotes: 'No notes',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirmation: 'Are you sure you want to delete this note?',
    admin: '(Admin)',
    delegate: '(Delegate)',
    createdAt: 'Created at: ',
    lastAction: 'Last Action: ',
    fullName: (first, last) => `${first} ${last}`,
  },

  // MEMBER ADD/EDIT NOTE SCREEN
  MEMBER_ADD_NOTE: {
    addNote: 'Add Note',
    editNote: 'Edit Note',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
    pleaseEnterNote: 'Please enter note',
  },

  // MEMBER PROFILE SCREEN
  MEMBER_PROFILE: {
    error: 'Error',
    invalidContactNumber: 'Invalid contact number',
    providedContactNumberInvalid: 'Provided contact number is invalid',
    tabs: {
      wheelOfLife: 'Wheel of Life',
      questions: 'Questions',
      ninetyDays: '90 Days',
      subscriptions: 'Subscriptions',
      intentionsAnalysis: 'Intentions Analysis',
      calendarEvents: 'Calendar Events',
    },
  },

  // DAILY DYNAMITE GRAPH SCREEN
  DAILY_DYNAMITE_GRAPH: {
    title: 'Daily Dynamite',
  },

  // NINETY DAYS VIEW SCREEN
  NINETY_DAYS_VIEW: {
    graph: 'Graph',
    questions: 'Questions',
    noQuestionsFound: 'No Questions Found',
  },

  // QUESTIONS VIEW SCREEN
  QUESTIONS_VIEW: {
    lesson: 'Lesson',
    goalStatement: 'Goal Statement',
    event: 'Event',
  },

  // SMS MODAL
  SMS_MODAL: {
    title: 'SMS Message',
    messagePlaceholder: 'Message*',
    send: 'Send',
    sending: 'Sending',
    messageEmptyTitle: "Message can't be empty",
    messageEmptyBody: 'Please write message',
  },

  // ASSESSMENT QUESTIONS
  ASSESSMENT_QUESTIONS: {
    noQuestionsFound: 'No Questions Found',
  },

  // FEED SCREEN
  FEED_SCREEN: {
    postsNotFound: 'Posts not found',
    edit: 'Edit',
    delete: 'Delete',
    pin: 'Pin',
    unpin: 'Unpin',
    reportedBy: 'Reported By',
    message: 'Message',
    addAsPersonalNotes: 'Add as Personal Notes',
    approve: 'Approve',
    notifyUsers: 'Notify Users',
  },

  // FEED VIEW
  FEED_VIEW: {
    badges: 'Badges',
    reviewReason: 'Reivew Reason',
    reportedByUsers: 'This post has been reported by some users',
    live: 'Live',
    offline: 'Offline',
    liked: 'Liked',
    like: 'Like',
    comment: 'Comment',
    pollExpiredOn: 'Poll Expired on',
    pollExpiresOn: 'Poll Expires on',
    viewDetails: 'View Details',
    viewSurveyQuestionnaire: 'View Survey Questionnaire',
    surveyQuestionnaire: 'Survey Questionnaire',
    surveyExpiredOn: 'Survey Expired on',
    surveyExpiresOn: 'Survey Expires on',
  },

  // COMMENT MODAL
  COMMENT_MODAL: {
    comments: 'Comments',
    noCommentExist: 'No comment exist',
    editing: 'Editing',
    replyingTo: 'Replying to ',
    cancel: 'Cancel',
    writeComment: 'Write a comment...',
    liked: 'Liked',
    like: 'Like',
    reply: 'Reply',
    viewMoreReplies: 'View More Replies',
    viewReplies: replies => `View ${replies} Replies`,
    yourself: 'Yourself',
    deleteConfirmation: 'Are you sure you want to delete this comment?',
    enterCommentOrImage: 'Please enter comment or select image to send',
    edit: 'Edit',
    delete: 'Delete',
    message: 'Message',
  },

  // LIKE MODAL
  LIKE_MODAL: {
    likes: 'Likes',
    reportedUsers: 'Reported Users',
  },

  // LEADERBOARD
  LEADERBOARD: {
    monthlyLeadsLeaderboard: 'Monthly New Leads Leaderboard',
    weeklyLeadsLeaderboard: 'Weekly New Leads Leaderboard',
    links: 'Links',
    previewUrlCopied: 'Preview Url copied to clipboard',
  },

  // FEED EVENTS
  FEED_EVENTS: {
    currentEvents: 'Current Events',
    upcomingEvents: 'Upcoming Events',
  },

  // SURVEY MODAL
  SURVEY_MODAL: {
    survey: 'Survey',
    surveyExpired: 'Survey Expired',
    cantAnswerExpired: "You can't answer these question.",
    of: 'of',
    question: 'Question',
    next: 'NEXT',
    finish: 'FINISH',
    error: 'Error',
  },

  // NOTIFY USER
  NOTIFY_USER: {
    notifyUsers: 'Notify Users',
    notificationStatement: 'Notification Statement*',
    notificationDescription: 'Notification Description*',
    post: 'POST',
    posting: 'Post...',
    info: 'info',
    emptyFieldsMessage:
      'Notication statement and Notication description should be not be empty',
  },

  // ADD POST
  ADD_POST: {
    selectLevel: 'Select Level',
    feedType: 'Feed Type',
    selectMember: 'Select Member',
    whatsOnYourMind: firstName =>
      `What's on your mind${firstName ? ', ' + firstName : ''}?`,
    whatsOnYourMindPlaceholder: "What's on your mind?",
    event: 'Event',
    eventTitle: 'Event Title*',
    buttonText: 'Button Text*',
    buttonLink: 'Button Link*',
    buttonTextColor: 'Button Text event*',
    buttonBackgroundColor: 'Button background color*',
    buttonAlignment: 'Button Alignment',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    remove: 'Remove',
    cancel: 'CANCEL',
    done: 'DONE',
    updatePost: 'Update Post',
    createPost: 'Create Post',
    member: 'Member',
    publishDate: 'Publish Date*',
    publishTime: 'Publish Time*',
    dateTimeTimezone: 'Date and Time are in Europe/Dublin timezone',
    videoURL: 'Video URL',
    embedCode: 'Embeded Code',
    notifyUsers: 'Notify Users ?',
    notificationStatement: 'Notification Statement*',
    notificationDescription: 'Notification Description*',
    posting: 'POSTING...',
    post: 'POST',
    updating: 'updating...',
    update: 'Update',
  },

  // POLL DETAIL MODAL
  POLL_DETAIL_MODAL: {
    poll: 'Poll',
    pollStatement: 'Poll Statement',
    expiration: 'Expiration',
    expired: 'Expired',
    responses: 'Responses',
    optionStatement: 'Option Statement',
  },

  // POLL VIEW
  POLL_VIEW: {
    expiryDate: 'Expiry Date*',
    expiryTime: 'Expiry Time*',
    option: index => `Option ${index + 1}.`,
    allowMultipleSelection: 'Allow Multiple Selection',
    addOption: 'Add Option',
    makeResultPrivate: 'Make Result Private',
  },

  // SURVEY VIEW
  SURVEY_VIEW: {
    expiryDate: 'Expiry Date*',
    expiryTime: 'Expiry Time*',
    question: index => `Question ${index + 1}.`,
    option: index => `Option ${index + 1}.`,
    allowMultipleSelection: 'Allow multiple selection',
    addOption: 'Add Option',
    removeQuestion: 'Remove Question',
    addQuestion: 'Add Question',
    of: 'of',
    makeResultPrivate: 'Make Result Private',
  },

  // ADD PERSONAL NOTE MODAL
  ADD_PERSONAL_NOTE_MODAL: {
    title: 'Add as Personal Notes',
    members: 'Members*',
    addNote: 'Add Note',
    member: 'Member',
    alert: 'Alert',
    pleaseSelectMember: 'Please select a member',
    memberFormat: (firstName, email) => `${firstName} (${email})`,
  },

  // EDIT PROFILE SCREEN
  EDIT_PROFILE: {
    title: 'Edit Profile',
    firstName: 'First Name*',
    lastName: 'Last Name',
    email: 'Email*',
    contactNumber: 'Contact Number',
    address: 'Address*',
    city: 'City*',
    stateCountry: 'State/Country*',
    timeZone: 'Time Zone*',
    biography: 'Biography',
    biographyPlaceholder: 'Maximun limit 500 chracters',
    update: 'Update',
  },

  // CHANGE AFFILIATE ID SCREEN
  CHANGE_AFFILIATE_ID: {
    title: 'Change Affiliate Id',
    affiliateId: 'Affiliate Id*',
    save: 'Save',
    alert: 'Alert',
    pleaseEnterAffiliateId: 'Please enter your affiliate Id',
    note: `If you change your affiliate ID, the links you have already shared on your social media platforms will not be affected directly. However, any new members who use those old links will not be associated with you, as the ID has changed.\n\nTherefore, every time you change your affiliate ID, you will need to share the updated links again. It is important to update your affiliate ID at your own risk, knowing that the previously shared links will no longer track new leads to your account.`,
  },

  // OTHER SETTINGS SCREEN
  OTHER_SETTINGS: {
    title: 'Settings',
    version: 'Version:',
    versionNumber: '1.0.0',
    zoomSettings: 'Zoom Settings',
    welcomeReminderSettings: 'Welcome Reminder Settings',
    feedKeywords: 'Feed Keywords',
    changePassword: 'Change Password',
  },

  // ZOOM SETTINGS SCREEN
  ZOOM_SETTINGS: {
    title: 'Zoom Setting',
    publicKey: 'Zoom Api Public Key',
    secretKey: 'Zoom Api Secret Key',
    accountId: 'Zoom Account Id',
    submit: 'Submit',
    updatedSuccessfully: 'Updated successfully',
  },

  // REMINDER SETTINGS SCREEN
  REMINDER_SETTINGS: {
    title: 'Welcome Reminder Setting',
    update: 'Update',
    afterDays: 'After Days*',
    notifyTime: 'Notify Time',
    messageType: 'Messge Type',
    image: 'Image* (150 X 22)',
    embedCode: 'Embeded Code*',
    reminderMessage: 'Reminder Message',
    imageUploadFailed: 'Image Uploding Failed',
    updatedSuccessfully: 'Updated Successfully',
    typeGeneral: 'general',
    typeImage: 'image',
    typeVideo: 'video',
    autoMsgFirstName: 'First Name',
    autoMsgLastName: 'Last Name',
    autoMsgFullName: 'Full Name',
    infoForEditor: `
<Br/>
Below are the available short codes that will automatically be replaced with the member's details:
<Br/>
<span class='highlight-text'>{first_name}</span> – This will be replaced with the member's first name.
<Br/>
<span class='highlight-text'>{last_name}</span> – This will be replaced with the member's last name.
<Br/>
<span class='highlight-text'>{full_name}</span> – This will be replaced with the member's full name.
<Br/>
<span class='italic-text'>These codes can be used in messages to personalize communication with members.</span>
`,
  },

  // FEED KEYWORDS SCREEN
  FEED_KEYWORDS: {
    title: 'Feed Keywords',
    keywords: 'Keywords',
    update: 'Update',
    notification: 'Notification',
    message: 'Message',
    email: 'Email',
  },

  // CHANGE PASSWORD SCREEN
  CHANGE_PASSWORD: {
    title: 'Change Password',
    newPassword: 'New Password*',
    confirmPassword: 'Confirm Password*',
    pleaseEnterNewPassword: 'Please enter your new password',
    passwordsDoNotMatch: 'Passwords do not match',
    securityQuestion: 'For security reasons, would you like to:',
    logoutFromOtherDevices: 'Logout from other devices',
    logoutFromAllDevices: 'Logout from all devices',
    save: 'Save',
    passwordChangedTitle: 'Password Changed',
    passwordChangedBody: 'Your password has been Changed Successfully!',
  },

  // CHAT LIST SCREEN
  CHAT_LIST: {
    title: 'Messages',
    portalEvents: 'Portal Events',
    selectEvent: 'Select your event from list below',
    all: 'All',
    unread: 'Unread',
    portals: 'Portals',
    searchPlaceholder: 'Search...',
    photo: 'Photo',
    audio: 'Audio',
    video: 'Video',
    noChat: 'No Chat',
    none: 'None',
  },

  // DASHBOARD SCREEN
  DASHBOARD: {
    todayCommission: "Today's Commission",
    pendingCommission: 'Pending Commission',
    totalPaidCommission: 'Total Paid Commission',
    totalCommissionAttracted: 'Total Commission Attracted',
    latestBooking: 'Latest Booking',
    upcomingBooking: 'Upcoming Booking',
    latestTransactions: 'Latest Transactions',
    latestMemberAnswers: 'Latest Member Answers',
    moduleTitle: 'Module Title',
    answeredDate: 'Answered Date',
    bookingPage: 'Booking page',
    date: 'Date',
    bookingStatus: 'Booking Status',
    noDataExist: 'No Data Exist',
    viewAll: 'View All',
  },

  // MEMBER TICKETS SCREEN
  MEMBER_TICKETS: {
    title: 'Tickets List',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    venue: 'Venue',
    indexLabel: index => ` ${index + 1}.`,
  },

  // WHEEL OF LIFE
  WHEEL_OF_LIFE: {
    graph: 'Graph',
    questions: 'Questions',
    assessment: 'Assessment',
    intentionStatement: 'Intention Statement',
  },

  // MESSAGE LIST SCREEN
  MESSAGE_LIST: {
    markedAsUnread: 'Marked as Unread',
    audioFolder: 'Audio/',
    audioSavedSuccess: 'Audio have saved successfully',
    deleteConfirmation: 'Are you sure you want to delete this message?',
    noMessages: 'No Messages',
    markAsUnread: 'Mark as unread',
    download: 'Download',
    copy: 'Copy',
    addAsNote: 'Add as Note',
    edit: 'Edit',
    delete: 'Delete',
  },

  // LIVE CHAT COMPONENT
  LIVE_CHAT: {
    liveChat: 'Live Chat',
    chat: 'Chat',
    pleaseWriteSomething: 'Please write something to comment.',
    alert: 'Alert',
    deleteConfirmation: 'Are you sure you want to delete this message?',
    addNoteConfirmation:
      'Are you sure you want to add the comment as personal note?',
    editing: 'Editing',
    replyingTo: 'Replying to ',
    cancel: 'Cancel',
    writeReply: 'Write a reply...*',
    writeComment: 'Write a comment...*',
    liked: ' Liked',
    like: ' Like',
    reply: ' Reply',
    scrollToBottom: 'Scroll to Bottom ',
    error: 'Error',
    edit: 'Edit',
    delete: 'Delete',
    message: 'Message',
    addAsNote: 'Add as Note',
  },

  // AUTOMATED GROUP ADD/EDIT SCREEN
  AUTOMATED_GROUP_ADD_EDIT: {
    editTitle: 'Edit Automated Group',
    addTitle: 'Add Automated Group',
    groupName: 'Group Name *',
    groupStatus: 'Group Status *',
    active: 'Active',
    inactive: 'Inactive',
    groupStartDay: 'Group Start Day *',
    groupEndDay: 'Group End Day *',
    submit: 'Submit',
    alert: 'Alert',
    enterGroupName: 'Please enter Automated Group Name',
    enterStartDay: 'Please enter Automated Start Day',
    enterEndDay: 'Please enter Automated End Day',
  },

  // SCHEDULE SCREEN
  SCHEDULE: {
    defaultHeading: 'The Source Code',
    day: 'day',
    schedule: 'Schedule',
    coinsRewards: 'Coins Rewards',
  },

  // MISSION REPORT MEMBER LIST SCREEN
  MISSION_REPORT_MEMBER_LIST: {
    report: ' Report',
    showing: 'Showing ',
    of: ' of ',
    missionTitle: 'Mission Title',
    duration: 'Duration',
    days: ' days',
    acceptTimeBadge: 'Accept Time Badge',
    currentBadge: 'Current Badge',
    coinsEarned: 'Coins Earned',
    achievableCoins: 'Achievable Coins',
    startDate: 'Start Date',
    completedDate: 'Completed Date',
    daysLabel: 'Days: ',
    noMissionReportFound: 'No Mission Report Found',
  },

  // MISSION REPORT FILTER SCREEN
  MISSION_REPORT_FILTER: {
    filter: 'Filter',
    missions: 'Missions',
    durationFromTo: 'Duration from ',
    to: ' to ',
    from: 'From*',
    toLabel: 'To*',
    placeholder1: '1',
    placeholder7: '7',
    clearFilter: 'Clear Filter',
    submit: 'Submit',
  },

  // WHATSAPP CHAT LIST SCREEN
  WHATSAPP_CHAT_LIST: {
    title: 'WHATSAPP CHATS',
    all: 'All',
    unread: 'Unread',
    searchPlaceholder: 'Search...',
    noChat: 'No Chat',
    photo: 'Photo',
    audio: 'Audio',
    video: 'Video',
  },

  // WHATSAPP MESSAGE LIST SCREEN
  WHATSAPP_MESSAGE_LIST: {
    deleteConfirmation: 'Are you sure you want to delete this message?',
    selectTemplateError: 'Please select a Template',
    noMessages: 'No Messages',
    copy: 'Copy',
    addAsNote: 'Add as Note',
    edit: 'Edit',
    delete: 'Delete',
  },

  // WHATSAPP START NEW CHAT SCREEN
  WHATSAPP_START_NEW_CHAT: {
    title: 'New Chat',
    searchPlaceholder: 'Search...',
    none: 'None',
    online: 'Online',
    offline: 'Offline',
  },

  // BROADCAST CHAT LIST SCREEN
  BROADCAST_CHAT_LIST: {
    portalEvents: 'Portal Events',
    selectEventPrompt: 'Select your event from list below',
    searchPlaceholder: 'Search...',
    noChat: 'No Chat',
    photo: 'Photo',
    audio: 'Audio',
    video: 'Video',
    noMessageYet: 'No Message Yet',
    none: 'None',
  },

  // BROADCAST MESSAGE LIST SCREEN
  BROADCAST_MESSAGE_LIST: {
    deleteConfirmation: 'Are you sure you want to delete this message?',
    noMessages: 'No Messages',
    copy: 'Copy',
    edit: 'Edit',
    delete: 'Delete',
  },
  BROADCAST_MSG_VIEW: {
    publishedAt: 'This message was published at',
    willBePublishedOn: 'This message will be published on',
    time: 'time',
    placeholder: 'Write your message...',
    enterYourLink: 'Enter your link',
    title: 'Title',
    link: 'Link',
    cancel: 'CANCEL',
    add: 'ADD',
    broadcast: 'Broadcast',
    messageSchedule: 'Message Schedule',
    sendNow: 'Send Now',
    schedule: 'Schedule',
    publishDate: 'Publish Date *',
    publishTime: 'Publish Time *',
    publishDateTimeNote: 'Publish date and time is in Europe/Dublin timezone',
    addAsPersonalNote: 'Add as Personal Note',
    send: 'SEND',
    pleaseWriteSomething: 'Please write something',
    pleaseEnterTitle: 'Please enter title',
    pleaseEnterLink: 'Please enter link',
    linkNotValid: 'Link not valid',
    microphonePermissionDenied: 'Microphone permission denied',
    allowMicrophonePermission:
      'Please allow mircophone permission from app settings',
    error: 'Error',
  },
  BROADCAST_DETAIL: {
    noMemberFound: 'No Member Found!',
  },
  BROADCAST_START_NEW_CHAT: {
    editBroadcast: 'Edit Broadcast',
    newBroadcast: 'New Broadcast',
    titleLabel: 'Title*',
    groupLabel: 'Group*',
    memberLabel: 'Member*',
    save: 'Save',
    alert: 'Alert',
    pleaseEnterTitle: 'Please enter a title',
    pleaseSelectAtleastOne: 'Please select atleast one member or group',
    groupsList: 'Groups List',
    member: 'Member',
  },

  // CALENDAR EVENTS SCREEN
  CALENDAR_EVENTS: {
    month: 'month',
    week: 'week',
    day: 'day',
    dateFormat: 'MMM YYYY',
    noEventsFound: 'No Events Found',
    seeMore: 'See More',
    seeLess: 'See Less',
    active: 'Active',
    inactive: 'Inactive',
    groups: 'Groups',
    eventType: 'Event Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    members: 'Members',
    status: 'Status',
    deleteConfirmation: 'Are you sure you want to delete this event?',
    edit: 'Edit',
    delete: 'Delete',
  },
};
