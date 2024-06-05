const routes = {

  //! ///    Navigators
  supportTicketNavigator: "SUPPORT_TICKET_NAVIGATOR",
  internalTicketNavigator: "INTERNAL_TICKET_NAVIGATOR",
  chatNavigator: "CHAT_NAVIGATOR",
  contactSupportNavigator: "CONTACT_SUPPORT_NAVIGATOR",
  dasboardNavigator: "MISSION_CONTROL_NAVIGATOR",
  feedNavigator: "COSMOS_FEED_NAVIGATOR",
  sourceFeedNavigator: "SOURCE_FEED_NAVIGATOR",
  allSourcesFeedNavigator: "ALL_SOURCE_FEED_NAVIGATOR",
  scheduledFeedNavigator: "SCHEDULED_FEED_NAVIGATOR",
  allMemberNavigator: "ALL_MEMBER_NAVIGATOR",
  memberNavigator: "MEMBERS_NAVIGATOR",
  nurtureNavigator: "NURTURE_NAVIGATOR",
  whatsappChatNavigator: "WHATSAPP_CHAT_NAVIGATOR",
  transactionNavigator: "TRANSACTION_NAVIGATOR",
  commissionNavigator: "COMMISSION_NAVIGATOR",
  paymentRquesNavigator: "PAYMENT_REQUEST_NAVIGATOR",
  portalNavigator: "PORTAL_NAVIGATOR",
  myPortalNavigator: "MY_PORTAL_NAVIGATOR",
  linksNavigator: "LINKS_NAVIGATOR",
  subscriptionNavigator: "SUBSCRIPTION_NAVIGATOR",
  membersAnswersNavigator: "MEMBERS_ANSWERS_NAVIGATOR",
  trainingNavigator: "TRAINING_NAVIGATOR",
  bookingNavigator: "BOOKING_NAVIGATOR",
  bookingConfigurationsNavigator: "BOOKING_CONFIGURATION_NAVIGATOR",
  _90daysPlanNavigator: "90_DAYS_PLAN_NAVIGATOR",
  _90daysTrackerNavigator: "90_DAYS_TRACKER_NAVIGATOR",
  sourcePodNavigator: "SOURCE_POD_NAVIGATOR",
  dynamitePodNavigator: "DYNAMITE_POD_NAVIGATOR",
  bookcallPodNavigator: "BOOKCALL_POD_NAVIGATOR",
  myRecordingNavigator: "MY_RECORDING_NAVIGATOR",
  vaultNavigator: "VAULT_NAVIGATOR",
  assessmentNavigator: "ASSESSMENT_NAVIGATOR",
  progressNavigator: "PROGRESS_NAVIGATOR",
  studyAssessmentNavigator: "STUDY_ASSESSMENT_NAVIGATOR",
  goalStatementCompleteNavigator: "GOAL_STATEMENT_COMPLETE_NAVIGATOR",
  goalStatementIncompleteNavigator: "GOAL_STATEMENT_INCOMPLETE_NAVIGATOR",
  goalStatementResponedNavigator: "GOAL_STATEMENT_RESPONDED_NAVIGATOR",
  selfImageCompleteNavigator: "SELF_IMAGE_COMPLETE_NAVIGATOR",
  selfImageIncompleteNavigator: "SELF_IMAGE_INCOMPLETE_NAVIGATOR",
  selfImageResponedNavigator: "SELF_IMAGE_RESPONDED_NAVIGATOR",
  digitalAssetNavigator: "DIGITAL_ASSET_NAVIGATOR",
  helpTechNavigator: "HELP_TECH_NAVIGATOR",
  dailyStreakPerformerNavigator: "DAYLY_STREAK_PERFORMANCE_NAVIGATOR",
  monthlyReportNavigator: "MONTHLY_REPORT_NAVIGATOR",
  broadcastNavigator: "BROADCAST_NAVIGATOR",
  quaterQuestionNavigator: "QUATER_QUESTION_NAVIGATOR",
  accountabilityTrackerNavigator: "ACCOUNTABILITY_TRACKER_NAVIGATOR",
  delegateReportNavigator: "DELEGATE_REPORT_NAVIGATOR",
  calendarGroupsNavigator: "CALENDAR_GROUPS_NAVIGATOR",
  calendarEventNavigator: "CALENDAR_EVENTS_NAVIGATOR",
  delegateEventsNavigator: "DELEGATE_EVENTS_NAVIGATOR",
  delegateCalendarEventNavigator: "DELEGATE_CALENDAR_EVENTS_NAVIGATOR",
  salesTeamNavigator: "SALES_TEAM_NAVIGATOR",
  salesPendingCommissionsNavigator: "SALE_PENDING_COMMISSION_NAVIGATOR",
  salesPaidCommissionsNavigator: "SALE_PAID_COMMISSION_NAVIGATOR",
  salesTeamTransactionsNavigator: "SALES_TEAM_TRANSACTION_NAVIGATOR",

  //! ///    Screens'

  //? AUth
  login: "LOGIN_SCREEN",
  splash: "SPLASH_SCREEN",
  forgotPassword: "FORGOT_PASSWORD_SCREEN",
  optScreen: "OPT_SCREEN",
  resetPassword: "RESET_PASSWORD_SCREEN",
  mainScreen: "MAIN_SCREEN",

  //? Support tickets
  supportTicketList: "SUPPORT_TICKET_LIST_SCREEN",
  supportTicketDeatail: "SUPPORT_TICKET_DETAIL_SCREEN",
  supportTicketReply: "SUPPORT_TICKET_REPLY_SCREEN",
  supportTicketNotes: "SUPPORT_TICKET_NOTES_SCREEN",
  sendReminderScreen: "SEND_REMINDER_SCREEN",

  //? Contect Support

  ticketList: "CONTACT_SUPPORT_TICKET_LIST_SCREEN",
  addTicket: "ADD_CONTACT_SUPPORT_TICKET_SCREEN",

  //? Settings
  otherSettings: "OTHER_SETTINGS_SCREEN",
  editProfile: "EDIT_PROFILE_SCREEN",
  changePassword: "CHANGE_PASSWORD_SCREEN",
  reminderSettings: "REMINDER_SETTINGS_SCREEN",
  zoomSettings: "ZOOM_SETTINGS_SCREEN",

  //? Notes
  addNote: "ADD_NOTE",
  notesListing: "NOTES_LISTING",

  //? chat
  chat: "CHAT_SETTINGS_SCREEN",
  chatList: "CHAT_LIST_SCREEN",
  chatMessageList: "CHAT_MESSAGE_LIST_SCREEN",
  startNewChat: "START_NEW_CHAT_SCREEN",


  //? Mission Control
  missionControlScreen: "MISSION_CONTROL_SCREEN",
  missionControlfilterScreen: "MISSION_CONTROL_FILTER_SCREEN",

  //? Feed 
  feedScreen: "COSMOS_FEED_SCREEN",
  allSourceFeedScreen: "ALL_SOURCE_FEED_SCREEN",
  sourceFeedScreen: "SOURCE_FEED_SCREEN",
  scheduleFeedScreen: "SCHEDULED_FEED_SCREEN",
  feedDetailScreen: "FEED_DETAIL_SCREEN",
  //? AllMembers
  allMemberScreens: "MEMBER_SCREEN",
  memberDetails: "MEMBER_DETAIL_SCREEN",
  memberAddNote: "MEMBER_ADD_NOTE",
  memberNotesListing: "MEMBER_NOTES_LISTING",
  memberSubscribersListing: "MEMBER_SUBSCRIPTION_LISTING",
  memberQuestionListing: "MEMBER_QUESTIONS_LISTING",
  memberProfile: "MEMBER_PROFILE",

  //? Questions
  genericQestionListing: "QUESTION_LISTING",
  addEditQuestions: "ADD_EDIT_QUESTIONS",
  answeredUserListing: "USER_LIST_WHO_ANSWERED",


  //? chat
  whtasappChat: "WHATSAPP_CHAT_SETTINGS_SCREEN",
  whtasappChatList: "WHATSAPP_CHAT_LIST_SCREEN",
  whtasappChatMessageList: "WHATSAPP_CHAT_MESSAGE_LIST_SCREEN",
  whtasappStartNewChat: "WHATSAPP_START_NEW_CHAT_SCREEN",


  //? Transactions
  transactionScreen: "TRANSACTION_SCREEN",
  transactionfilterScreen: "TRANSACTION_FILTER_SCREEN",
  //? Commissions
  commissionDetailScreen: "COMMISSION_DETAIL_SCREEN",

  //? Payment Request
  paymentRequestScreen: "PAYMENT_REQUEST_SCREEN",
  addEditPaymenyRequestScreen: "ADD_EDIT_PAYMENT_REQUEST_SCREEN",
  PaymenyRequestDetailScreen: "PAYMENT_REQUEST_DETAIL_SCREEN",


  //? Portals
  portalListScreen: "PORTAL_LIST_SCREEN",
  portalDetailScreen: "PORTAL_DETAIL_SCREEN",
  portalEventVidoScreen: "PORTAL_EVENT_VIDEO_SCREEN",
  portalChatList: "PORTAL_CHAT_LIST",
  portalAddEdit: "PORTAL_ADD_EDIT",
  portalLockSettings: "PORTAL_LOCK_SETTINGS",
  portalTimerSettings: "PORTAL_TIMER_SETTINGS",
  portalAddMembers: "PORTAL_UPLOAD_MEMBERS",
  portalMembersList: "PORTAL_UPLOAD_MEMBERS_LIST",
  portalAddEditMembers: "PORTAL_ADD_EDIT_MEMBERS",
  portalEventsList: "PORTAL_UPLOAD_EVENT_LIST",
  portalAddEditEvents: "PORTAL_ADD_EDIT_EVENT",

  portalCategoryList: "PORTAL_EVENT_CATEGORY_LIST",
  portalAddEditCategory: "PORTAL_EVENT_ADD_EDIT_CATEGORY",
  portalVideoList: "PORTAL_EVENT_CATEGORY_VIDEO_LIST",
  portalAddEditVideo: "PORTAL_EVENT_ADD_EDIT_VIDEO",
  portalVideoQuestionSettings: "PORTAL_VIDEO_QUESTION_SETTINGS",
  portalVideoQuestionManage: "PORTAL_VIDEO_MANAGE_QUESTION",

  //? Links
  linksListing: "LINKS_LISTING_SCREEN",

  //? Subscription
  subscriptionList: "SUBSCRIPTION_LISTING_SCREEN",
  subscriptionFilter: "SUBSCRIPTION_FILTER_SCREEN",

  //? Member Answer
  memberAnswersList: "MEMBER_ANSWER_LISTING_SCREEN",
  memberAnswersFilter: "MEMBER_ANSWER_FILTER_SCREEN",

  //? Training 

  traininglist: "TRAINING_LISTING_SCREEN",
  trainingDetail: "TRAINING_DETAIL_SCREEN",
  trainingLessonsList: "TRAINING_LESSONS_LISTING_SCREEN",
  trainingLessonDetail: "TRAINING_LESSON_DETAIL_SCREEN",
  trainingLessonRecording: "TRAINING_LESSON_RECORDING_SCREEN",

  //? Bookings
  bookingList: "BOOKINGS_LIST_SCREEN",
  bookingFilter: "BOOKINGS_FILTER_SCREEN",
  bookingAdd: "BOOKINGS_ADD_SCREEN",
  bookingNotesList: "BOOKINGS_NOTES_LIST_SCREEN",
  bookingAddNote: "BOOKINGS_ADD_NOTE_SCREEN",

  //? Bookings Configutaion
  bookingConfigurationScreen: "BOOKINGS_CONFIGURATION_SCREEN",


  //? 90 days
  _90daysPlan: "90_DAYS_PLAN_SCREEN",
  _90daysTracker: "90_DAYS_TRACKER_SCREEN",
  addEditEarnings: "ADD_EDIT_90_DAYS_PLAN_EARNING",

  //? Source pod
  sourcePodScreen: "SOURCE_POD_SCREEN",
  podAddScreen: "ADD_POD_SCREEN",
  podFilterScreen: "POD_FILTER_SCREEN",
  podDetailScreen: "POD_DETAIL_SCREEN",

  //? Book call pod
  bookcallPodScreen: "BOOKCALL_POD_SCREEN",

  //? Dynamite pod
  dynamitePodScreen: "DYNAMITE_POD_SCREEN",
  dynamitePodDetailScreen: "DYNITE_POD_DETAIL_SCREEN",

  //? My Recordings
  myRecordingsList: "MY_RECORDINGS_LIST_SCREEN",
  myRecordingsAddEdit: "MY_RECORDINGS_ADD_EDIT_SCREEN",
  myRecordingsDetail: "MY_RECORDING_DETAIL_SCREEN",

  //? Vault
  vaultList: "VAULT_LIST_SCREEN",

  //? Assessment
  assessmentList: "ASSESSMENT_LIST_SCREEN",
  assessmentDetail: "ASSESSMENT_DETAIL_SCREEN",
  assessmentNotesList: "ASSESSMENT_NOTES_LIST_SCREEN",
  assessmentNotesAddEdit: "ASSESSMENT_NOTES_ADD_EDIT_SCREEN",

  //? Progress
  progresssList: "PROGRESS_LIST_SCREEN",
  progresssFilter: "PROGRESS_FILTER_SCREEN",
  progresssAddEdit: "PROGRESS_ADD_EDIT_SCREEN",
  progresssNotesList: "PROGRESS_NOTES_LIST_SCREEN",
  progresssAddNote: "PROGRESS_ADD_NOTE_SCREEN",


  //? Study Assessment
  studyAssessmentList: "STUDY_ASSESSMENT_LIST_SCREEN",
  studyAssessmentQuestionList: "STUDY_ASSESSMENT_QUESTION_SCREEN",

  //? Goal Statement
  goalStatementCompleteScreen: "GOAL_STATEMENT_COMPLETE_SCREEN",
  goalStatementIncompleteScreen: "GOAL_STATEMENT_INCOMPLETE_SCREEN",
  goalStatementResponedScreen: "GOAL_STATEMENT_RESPONDED_SCREEN",
  goalStatmentDetail: "GOAL_STATEMENT_DETAIL_SCREEN",


  //? Self Image
  selfImageCompleteScreen: "SELF_IMAGE_COMPLETE_SCREEN",
  selfImageIncompleteScreen: "SELF_IMAGE_INCOMPLETE_SCREEN",
  selfImageResponedScreen: "SELF_IMAGE_RESPONDED_SCREEN",
  selfImageDetail: "SELF_IMAGE_DETAIL_SCREEN",
  selfImageAddReply: "SELF_IMAGE_DETAIL_ADD_REPLY_SCREEN",

  //? Help tech
  helptechListScreen: "HELP_TECH_LIST_SCREEN",
  helptechDetailScreen: "HELP_TECH_DETAIL_SCREEN",

  //? Digitall Assets
  digitalAssetCategoryListScreen: "DIGITALL_ASSETMENT_CATEGORY_LIST_SCREEN",
  digitalAssetByCategoryScreen: "DIGITALL_ASSETMENT_LIST_BY_CATEGORY_SCREEN",

  //? daily Streak Performance
  performanceStreakScreen: "PERFORMANCE_STREAK_SCREEN",
  performanceAnalysisScreen: "PERFORMANCE_ANALYSIS_SCREEN",
  performanceAnalysisFilterScreen: "PERFORMANCE_ANALYSIS_FILTER_SCREEN",

  //? Montly Report 
  monthyReportScreen: "MONTHY_REPORT_SCREEN",

  //? Broadcast Chat
  broadcastChatList: "BROADCAST_CHAT_LIST_SCREEN",
  broadcastChatMessageList: "BROADCAST_CHAT_MESSAGE_LIST_SCREEN",
  broadcastStartNewChat: "BROADCAST_START_NEW_CHAT_SCREEN",
  broadcastDetail: "BROADCAST_DETAIL_SCREEN",

  //? Quater Question
  quaterQuestionList: "QUATER_QUESTION_LIST_SCREEN",
  quaterQuestionDetail: "QUATER_QUESTION_DETAIL_SCREEN",

  //? Accountability Tracker
  accountabilityTrackerScreen: "ACCOUNTABILITY_TRACKER_SCREEN",
  accountabilityPastActivitesScreen: "ACCOUNTABILITY_PAST_ACTIVITIES_SCREEN",

  //? Delegate Report
  delegateReportScreen: "DELEGATE_REPORT_SCREEN",
  delegateReportFilterScreen: "DELEGATE_REPORT_FILTER_SCREEN",
  delegeteMonthlyReportScreen: "DELEGETE_MONTHLY_REPORT_SCREEN",
  delegateReportBookingsScreen: "DELEGATE_REPORT_BOOKINGS_SCREEN",
  delegateReportBookingsFilterScreen: "DELEGATE_REPORT_BOOKINGS_FILTER_SCREEN",
  delegateReportSalesScreen: "DELEGATE_REPORT_SALES_SCREEN",
  delegateReportSalesFilterScreen: "DELEGATE_REPORT_SALES_FILTER_SCREEN",
  delegateReportAccountablityTrackerScreen: "DELEGATE_REPORT_ACCOUNTABILTY_TRACKER_SCREEN",

  //? Notifications
  notificationList: "NOTIFICATION_LIST",

  //? Calendar Groups
  calendarGroupList: "CALENDAR_GROUP_LIST_SCREEN",
  calendarGroupAddEdit: "CALENDAR_GROUP_ADD_EDIT_SCREEN",
  calendarGroupDetail: "CALENDAR_GROUP_DETAIL_SCREEN",

  //? Calendar Events
  calendarEventsList: "CALENDAR_EVENTS_SCREEN",
  calendarEventDetail: "CALENDAR_EVENT_DETAIL_SCREEN",
  calendarEventsAddEdit: "CALENDAR_EVENTS_ADD_EDIT_SCREEN",
  calendarEventsAddEditNotification: "CALENDAR_EVENTS_ADD_EDIT_NOTIFICATIONS",



  //? Sales Team
  salesTeamListing: "SALES_TEAM_LISTING_SCREEN",
  salesTeamDetail: "SALES_TEAM_DETAIL_SCREEN",
  salesTeamAddEdit: "SALES_TEAM_ADD_EDIT_SCREEN",
  salesTeamFilterScreen: "SALES_TEAM_FILTER_SCREEN",
  
  //? Sales Paid
  salePidCommissionScreen: "SALES_PAID_COMMISSIONMENT_SCREEN",

  //? Sales Pending
  salePendingCommissionScreen: "SALES_PENDING_COMMISSIONMENT_SCREEN",

  //? Sales Team Transactions
  salesTeamTransactionsListingScreen: "SALES_TEAM_TRANSACTION_LISTING_SCREEN",
  salesTeamTransactionsAddEditScreen: "SALES_TEAM_TRANSACTION_ADD_EDIT_SCREEN",
}


export default routes;
