import routes from '../routes';
import StackSupportTicket from '../NestedStacks/StackSupportTicket';
import StackChat from '../NestedStacks/StackChat';
import StackInternalTickets from '../NestedStacks/StackInternalTicket';
import StackContactSupport from '../NestedStacks/StackContactSupport';
import StackMissionControl from '../NestedStacks/SackMisisonControl';
import StackFeed from '../NestedStacks/StackFeed';
import StackAllMember from '../NestedStacks/StackAllMembers';
import StackNurtureMembers from '../NestedStacks/StackNurtureMembers';
import StackMembers from '../NestedStacks/StackMembers';
import StackWhatsApp from '../NestedStacks/StackWhatsApp';
import StackTransactions from '../NestedStacks/StackTransactions';
import StackCommissions from '../NestedStacks/StackCommissions';
import StackPaymentsRequest from '../NestedStacks/StackPaymentsRequest';
import StackPortals from '../NestedStacks/StackPortals';
import StackMyPortals from '../NestedStacks/StackMyPortals';
import StackLinks from '../NestedStacks/StackLinks';
import StackSubscription from '../NestedStacks/StackSubscription';
import StackMembersAnswer from '../NestedStacks/StackMemberAnswer';
import StackTraining from '../NestedStacks/StackTraining';
import StackBookings from '../NestedStacks/StackBookings';
import StackBookingConfiguration from '../NestedStacks/StackBookingConfiguration';
import Stack90DaysPlan from '../NestedStacks/Stack90DaysPlan';
import Stack90DaysTracker from '../NestedStacks/Stack90DaysTracker';
import StackDynamitePod from '../NestedStacks/StackDynamitePods';
import StackSourcePod from '../NestedStacks/StackSourcePods';
import StackBookCallPod from '../NestedStacks/StackBookCallPods';
import StackRecordings from '../NestedStacks/StackRecordings';
import StackVault from '../NestedStacks/StackVault';
import StackAssessment from '../NestedStacks/StackAssessment';
import StackProgress from '../NestedStacks/StackProgress';
import StackStudyAssessment from '../NestedStacks/StackStudyAssessment';
import StackGoalStatementCompleted from '../NestedStacks/StackGoalStatementCompleted';
import StackGoalStatementIncompleted from '../NestedStacks/StackGoalStatementIncompleted';
import StackGoalStatementResponded from '../NestedStacks/StackGoalStatementResponded';
import StackSelfImageCompleted from '../NestedStacks/StackSelfImgeCompleted';
import StackSelfImageIncomplete from '../NestedStacks/StackSelfImgeIncomplete';
import StackSelfImageResponded from '../NestedStacks/StackSelfImgeResponded';
import StackDigitalAssets from '../NestedStacks/StackDigitalAsset';
import StackHelpTech from '../NestedStacks/StackHelpTech';
import StackDailyStreakPerformance from '../NestedStacks/StackDailyStreakPerformance';
import StackMonthReport from '../NestedStacks/StackMonthyReport';
import StackBroadcast from '../NestedStacks/StackBroadcastChat';
import StackQuaterQuestions from '../NestedStacks/StackQuaterQuestions';
import StackAcountabilityTracker from '../NestedStacks/StackAcountabilityTracker';
import StackDelegateReport from '../NestedStacks/StackDelegateReport';
import StackSalesTeam from '../NestedStacks/StackSalesTeam';
import StackSalesPendingCommission from '../NestedStacks/StackSalesPendingCommission';
import StackSalesPaidCommission from '../NestedStacks/StackSalesPaidCommission';
import StackSalesTeamTransaction from '../NestedStacks/StackSalesTeamTransaction';
import StackCalendarGroups from '../NestedStacks/StackCalendarGroups';
import StackCalendarEvents from '../NestedStacks/StackCalendarEvents';
import StackDelegateEvents from '../NestedStacks/StackDelegateEvents';
import StackLeadCenter from '../NestedStacks/StackLeadCenter';
import StackMissionReport from '../NestedStacks/SackMisisonReport';
import StackMission from '../NestedStacks/StackMission';
import StackFeedReview from '../NestedStacks/StackFeedReview';
import StackCommentReview from '../NestedStacks/StackCommentReview';
import StackUpdates from '../NestedStacks/StackUpdates';
import StackAffiliate from '../NestedStacks/StackAffiliate';
import StackTemplates from '../NestedStacks/StackTemplates';

export const ParentComponents = {
  mission_control: {
    key: routes.dasboardNavigator,
    component: StackMissionControl,
    params: {
      value: 'mission_control',
      key: '867a0259-dafe-40c0-82e4-55bc1d4e548f',
    },
  },
  the_cosmos: {
    key: routes.feedNavigator,
    component: StackFeed,
    params: {
      feedFor: 'the_cosmos',
      value: 'the_cosmos',
      key: '433f8aaf-59cf-46f1-a1d9-ac31d645946d',
    },
  },
  support_ticket: {
    key: routes.supportTicketNavigator,
    component: StackSupportTicket,
    params: {
      type: 'support_ticket',
      value: 'support_ticket',
      key: '83b8897f-5ef3-434d-bc5e-76142371f5e7',
    },
  },
  'internal-tickets': {
    key: routes.internalTicketNavigator,
    component: StackInternalTickets,
    params: {
      type: 'internal_ticket',
      value: 'internal-tickets',
      key: 'c47fa8a3-9f0d-469c-b78c-9f841c251a91',
    },
  },
  chat: {
    key: routes.chatNavigator,
    component: StackChat,
    params: {value: 'chat', key: '34ac8703-da69-4282-9f62-f5295cbcac8d'},
  },
  members: {
    key: null,
    component: null,
    params: {value: 'members', key: 'd2ff9f8b-20a8-4646-a08b-cbdfd931fb54'},
  },
  the_source_feed: {
    key: routes.sourceFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: 'the_source',
      title: 'The Source Feed',
      value: 'the_source_feed',
      key: '34e7b7db-b8c5-4d55-98fc-700d3c6cd357',
    },
  },
  all_source_feed: {
    key: routes.allSourcesFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: 'all_source',
      title: 'All Source Feed',
      value: 'all_source_feed',
      key: 'cbd826ec-9082-44c4-a94c-4af0bf98eeb9',
    },
  },
  scheduled_feeds: {
    key: routes.scheduledFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: 'scheduled',
      title: 'Schedule Feed',
      value: 'scheduled_feeds',
      key: '214ab401-1f91-45c6-9250-42df98cd20ee',
    },
  },
  support: {
    value: 'support',
    key: null,
    params: {
      value: 'support',
      key: 'c351eb22-6d51-4187-9111-f05872a6d4b8',
    },
  },
  whatsapp_chat: {
    key: routes.whatsappChatNavigator,
    component: StackWhatsApp,
    params: {
      value: 'whatsapp_chat',
      key: '3fd672ca-06bf-4c59-b66a-44880c8effca',
    },
  },
  payments: {
    key: null,
    component: null,
    params: {
      value: 'payments',
      key: '455ccc75-c8d3-41b3-856b-5a133a185c5b',
    },
  },
  portals: {
    key: routes.portalNavigator,
    component: StackPortals,
    params: {
      value: 'portals',
      key: 'c4406822-391b-4320-892f-ceb760f157c0',
    },
  },
  my_portals: {
    key: routes.myPortalNavigator,
    component: StackMyPortals,
    params: {
      value: 'my_portals',
      key: '2f8afe1f-58b9-4415-93a6-d2a65b3cfa5e',
    },
  },
  links: {
    key: routes.linksNavigator,
    component: StackLinks,
    params: {
      value: 'links',
      key: 'f6f13dcc-c828-4ee8-81e4-85b9a21f6308',
    },
  },

  member_answers_list: {
    key: routes.membersAnswersNavigator,
    component: StackMembersAnswer,
    params: {
      value: 'member_answers_list',
      key: 'c843ea03-df9e-4916-b59f-7357e79b90cb',
    },
  },
  subscription_list: {
    key: routes.subscriptionNavigator,
    component: StackSubscription,
    params: {
      value: 'subscription_list',
      key: '73e12b1a-5c26-4092-ac3c-571fd8738f67',
    },
  },
  delegate_training: {
    key: routes.trainingNavigator,
    component: StackTraining,
    params: {
      value: 'delegate_training',
      key: '50f33585-a162-43f2-9248-5ae844488772',
    },
  },
  appointment: {
    key: null,
    component: null,
    params: {value: 'appointment', key: '3bc7d829-9b1b-4cba-b657-39485b52f625'},
  },
  '90_day_plan': {
    key: null,
    component: null,
    params: {
      value: '90_day_plan',
      key: '08c114e9-3ce1-40c7-808f-0ac556f3b93c',
    },
  },
  delegate_pods: {
    key: null,
    component: null,
    params: {
      value: 'delegate_pods',
      key: '17fc7008-54ea-4917-b74a-05256563398e',
    },
  },
  dynamite_pods: {
    key: routes.dynamitePodNavigator,
    component: StackDynamitePod,
    params: {
      value: 'dynamite_pods',
      key: '14f2dd46-0399-43d7-b17d-cae069a6244a',
    },
  },
  your_recordings: {
    key: routes.myRecordingNavigator,
    component: StackRecordings,
    params: {
      value: 'your_recordings',
      key: '25a25c8b-b9c0-4f7d-b77d-074c97c55195',
    },
  },
  your_vault: {
    key: routes.vaultNavigator,
    component: StackVault,
    params: {
      value: 'your_vault',
      key: 'bc7d4e01-05aa-49a6-9bb6-09b90e44908d',
    },
  },
  attitude_assessment: {
    key: routes.assessmentNavigator,
    component: StackAssessment,
    params: {
      value: 'attitude_assessment',
      key: 'd855c0fa-6dd4-45f9-9fc9-f1bed80e2192',
    },
  },
  progress: {
    key: routes.progressNavigator,
    component: StackProgress,
    params: {
      value: 'progress',
      key: '93a6e107-c620-4ba4-81d9-64660b4fb4db',
    },
  },
  certification: {
    key: null,
    component: null,
    params: {
      value: 'certification',
      key: '9ebb9563-c76c-42d0-b2e5-de7a88bbf3c9',
    },
  },
  member_goal_statement: {
    key: null,
    component: null,
    params: {
      value: 'member_goal_statement',
      key: '75176cef-cff2-4741-8139-67ce23bdca6c',
    },
  },
  self_image: {
    key: null,
    component: null,
    params: {
      value: 'self_image',
      key: 'c31a3cf2-ff7a-4957-9546-9c104f68d96c',
    },
  },

  daily_streak_performance: {
    key: routes.dailyStreakPerformerNavigator,
    component: StackDailyStreakPerformance,
    params: {
      value: 'daily_streak_performance',
      key: 'aadbd7a3-91c1-40dd-bf24-532fc288d2659',
    },
  },

  performance_stats: {
    key: routes.monthlyReportNavigator,
    component: StackMonthReport,
    params: {
      value: 'performance_stats',
      key: 'aadbd7a3-91c1-40dd-bf24-8987688566hhh',
    },
  },

  broadcast_chats: {
    key: routes.broadcastNavigator,
    component: StackBroadcast,
    params: {
      value: 'broadcast_chats',
      key: 'aadbd7a3-91c1-40dd-bf24-898768876hhh',
    },
  },

  quarter_questions: {
    key: routes.quaterQuestionNavigator,
    component: StackQuaterQuestions,
    params: {
      value: 'quarter_questions',
      key: 'aadbd7a3-91c1-40dd-bf24-7846756776677887',
    },
  },

  daily_dynamite_accountabalility_tracker: {
    key: routes.accountabilityTrackerNavigator,
    component: StackAcountabilityTracker,
    params: {
      value: 'daily_dynamite_accountabalility_tracker',
      key: 'aadbd7a3-91c1-40dd-bf24-532fc288d265',
    },
  },

  accountability_tracker_report: {
    key: routes.delegateReportNavigator,
    component: StackDelegateReport,
    params: {
      value: 'accountability_tracker_report',
      key: 'aadbd7a3-91c1-40dd-bf24-532fc288d265555',
    },
  },

  calendar: {
    key: null,
    component: null,
    params: {
      value: 'calendar',
      key: '79fe1cf4-6cd7-42d0-a855-3fcf5fec045a',
    },
  },
  delegate_events: {
    key: routes.delegateEventsNavigator,
    component: StackDelegateEvents,
    params: {
      type: 'consultant_user',
      value: 'delegate_events',
      key: 'd2ff9f8b-20a8-4646-a08b-cbdfd931f454',
    },
  },
  // ? Sales Tab
  '/sales': {
    key: null,
    component: null,
    params: {
      value: '/sales',
      key: 'aadbd7a3-91c1-499dd-bf24-7846756776677887',
    },
  },
  mission_member_report: {
    key: null,
    component: null,
    params: {
      value: 'mission_member_report',
      key: '5bd62bab-3f70-471a-ad80-d788cd481c39',
    },
  },

  missions_levels: {
    key: routes.missionNavigator,
    component: StackMission,
    params: {
      value: 'missions_levels',
      key: 'ad108738-ebe0-428e-9810-55203ee509f7',
    },
  },

  content_reviews: {
    key: null,
    component: null,
    params: {
      value: 'content_reviews',
      key: '52f27c5a-44ba-44ba-b0f0-b0b150ea031b',
    },
  },

  'aadbd7a3-444444-40dd-bf24-7846756776677887': {
    key: routes.leadcenterNavigator,
    component: StackLeadCenter,
    params: {
      value: 'leads_center',
      key: 'aadbd7a3-444444-40dd-bf24-7846756776677887',
    },
  },

  // Update Tab
  updates: {
    key: routes.updates,
    component: StackUpdates,
    params: {
      value: 'updates',
      key: '39f49f30-5a18-4c38-9c91-ad8a89f7218b',
    },
  },

  campaign_url: {
    key: routes.affiliate,
    component: StackAffiliate,
    params: {
      value: 'campaign_url',
      key: 'c6148bbe-118f-492d-b1e7-bec092d7afec',
    },
  },

  templates: {
    key: routes.templates,
    component: StackTemplates,
    params: {
      value: 'templates',
      title: 'Templates',
      key: '0a3fc4be-fac3-46f2-a887-ae1e08f9d351',
    },
  },
};

export const ChildComponents = {
  review_feeds: {
    key: routes.feedReviewNavigator,
    component: StackFeedReview,
    params: {
      value: 'review_feeds',
      parentValue: 'content_reviews',
      key: '43a6bd01-07f9-4ef0-9279-905b683575ce',
      parentKey: '52f27c5a-44ba-44ba-b0f0-b0b150ea031b',
    },
  },

  review_comments: {
    key: routes.commentsReviewNavigator,
    component: StackCommentReview,
    params: {
      value: 'review_comments',
      parentValue: 'content_reviews',
      key: '43a6bd01-07f9-4ef0-lkklklklkl-905b683575ce',
      parentKey: '52f27c5a-44ba-44ba-b0f0-b0b150ea031b',
    },
  },

  inprogress_missions: {
    key: routes.InProgressMissionReportNavigator,
    component: StackMissionReport,
    params: {
      value: 'inprogress_missions',
      type: 'in_progress',
      key: 'hhfhhfhfhf-31d9-4154-b3a9-81619gdhb4va',
      parentKey: '5bd62bab-3f70-471a-ad80-d788cd481c39',
      parentValue: 'mission_member_report',
    },
  },
  completed_missions: {
    key: routes.completeMissionReportNavigator,
    component: StackMissionReport,
    params: {
      value: 'completed_missions',
      type: 'completed',
      parentValue: 'mission_member_report',
      key: 'hhfhhfhfhf-31d9-41bb-b3c9-81619fd1b49c',
      parentKey: '5bd62bab-3f70-471a-ad80-d788cd481c39',
    },
  },
  members: {
    key: routes.memberNavigator,
    component: StackMembers,
    params: {
      type: 'member',
      value: 'members',
      parentValue: 'members',
      key: '5f063d7b-640b-4088-a821-0b77a08b18c7',
      parentKey: 'd2ff9f8b-20a8-4646-a08b-cbdfd931fb54',
    },
  },
  nurture_members: {
    key: routes.nurtureNavigator,
    component: StackNurtureMembers,
    params: {
      type: 'nurture',
      value: 'nurture_members',
      parentValue: 'members',
      key: '06cafbd4-cee7-4723-acc5-ce265d01a148',
      parentKey: 'd2ff9f8b-20a8-4646-a08b-cbdfd931fb54',
    },
  },
  all_member_list: {
    key: routes.allMemberNavigator,
    component: StackAllMember,
    params: {
      type: 'all-member',
      value: 'all_member_list',
      parentValue: 'members',
      key: '9daa2af3-a55d-40e4-9821-c3fe4199d5ab',
      parentKey: 'd2ff9f8b-20a8-4646-a08b-cbdfd931fb54',
    },
  },
  contact_support: {
    key: routes.contactSupportNavigator,
    component: StackContactSupport,
    params: {
      value: 'contact_support',
      parentValue: 'support',
      key: '26ddb8b0-31d9-4154-b3a9-81619fd1b49c',
      parentKey: 'c351eb22-6d51-4187-9111-f05872a6d4b8',
    },
  },
  digital_assets: {
    key: routes.digitalAssetNavigator,
    component: StackDigitalAssets,
    params: {
      value: 'digital_assets',
      parentValue: 'support',
      key: '96eadc59-d4a6-44f3-b99e-14a87136de90',
      parentKey: 'c351eb22-6d51-4187-9111-f05872a6d4b8',
    },
  },
  help_tech: {
    key: routes.helpTechNavigator,
    component: StackHelpTech,
    params: {
      value: 'help_tech',
      parentValue: 'support',
      key: '50dc0ed7-7b87-4955-b1ad-13cb8a2fd52b',
      parentKey: 'c351eb22-6d51-4187-9111-f05872a6d4b8',
    },
  },
  transactions: {
    key: routes.transactionNavigator,
    component: StackTransactions,
    params: {
      value: 'transactions',
      parentValue: 'payments',
      key: '558ec2ba-49ca-4740-bb81-a0a29296d69d',
      parentKey: '455ccc75-c8d3-41b3-856b-5a133a185c5b',
    },
  },
  commission_detail: {
    key: routes.commissionNavigator,
    component: StackCommissions,
    params: {
      value: 'commission_detail',
      parentValue: 'payments',
      key: '443a08f7-f6e0-4fa7-81fb-5236e6e970de',
      parentKey: '455ccc75-c8d3-41b3-856b-5a133a185c5b',
    },
  },
  payment_request: {
    key: routes.paymentRquesNavigator,
    component: StackPaymentsRequest,
    params: {
      value: 'payment_request',
      parentValue: 'payments',
      key: '84a645c5-7979-49bc-9ca6-a4214336ec77',
      parentKey: '455ccc75-c8d3-41b3-856b-5a133a185c5b',
    },
  },
  bookings: {
    key: routes.bookingNavigator,
    component: StackBookings,
    params: {
      value: 'bookings',
      parentValue: 'appointment',
      key: '68cf2ca6-010a-4e51-94ee-26231efe87e5',
      parentKey: '3bc7d829-9b1b-4cba-b657-39485b52f625',
    },
  },
  schedule_appointment: {
    key: routes.bookingConfigurationsNavigator,
    component: StackBookingConfiguration,
    params: {
      value: 'schedule_appointment',
      parentValue: 'appointment',
      key: '6fbc5f59-7886-4d6d-b936-14636b4bdff9',
      parentKey: '3bc7d829-9b1b-4cba-b657-39485b52f625',
    },
  },
  '90_day_plan': {
    key: routes._90daysPlanNavigator,
    component: Stack90DaysPlan,
    params: {
      value: '90_day_plan',
      parentValue: '90_day_plan',
      type: 'delegate-90-day-questions',
      key: '9f051351-3edc-481c-ac23-85e09f4e2e11',
      parentKey: '08c114e9-3ce1-40c7-808f-0ac556f3b93c',
    },
  },
  '90_day_tracker': {
    key: routes._90daysTrackerNavigator,
    component: Stack90DaysTracker,
    params: {
      value: '90_day_tracker',
      parentValue: '90_day_plan',
      key: 'd2a962e6-b079-4eb3-8f67-c467d85323e6',
      parentKey: '08c114e9-3ce1-40c7-808f-0ac556f3b93c',
    },
  },
  source_pods: {
    key: routes.sourcePodNavigator,
    component: StackSourcePod,
    params: {
      value: 'source_pods',
      parentValue: 'delegate_pods',
      key: 'ee600ffb-0afa-449b-9b76-99761c01ed3d',
      parentKey: '17fc7008-54ea-4917-b74a-05256563398e',
      type: 'general',
    },
  },
  book_call_pods: {
    key: routes.bookcallPodNavigator,
    component: StackBookCallPod,
    params: {
      value: 'book_call_pods',
      parentValue: 'delegate_pods',
      key: '657bbdbb-661f-4ebb-8373-9c0c34485fb7',
      parentKey: '17fc7008-54ea-4917-b74a-05256563398e',
      type: 'booking',
    },
  },
  assessment_study: {
    key: routes.studyAssessmentNavigator,
    component: StackStudyAssessment,
    params: {
      value: 'assessment_study',
      parentValue: 'certification',
      key: '3bbea0ca-7d66-4225-9950-9ecec741637d',
      parentKey: '9ebb9563-c76c-42d0-b2e5-de7a88bbf3c9',
    },
  },
  goal_statement_complete: {
    key: routes.goalStatementCompleteNavigator,
    component: StackGoalStatementCompleted,
    params: {
      value: 'goal_statement_complete',
      parentValue: 'member_goal_statement',
      key: 'f18f9630-2dc1-4e42-a498-0a0e7e9407be',
      parentKey: '75176cef-cff2-4741-8139-67ce23bdca6c',
      type: 'complete',
    },
  },
  goal_statement_incomplete: {
    key: routes.goalStatementIncompleteNavigator,
    component: StackGoalStatementIncompleted,
    params: {
      value: 'goal_statement_incomplete',
      parentValue: 'member_goal_statement',
      key: '6777364d-4014-47d4-abd2-f488fa1c58bc',
      parentKey: '75176cef-cff2-4741-8139-67ce23bdca6c',
      type: 'incomplete',
    },
  },
  goal_statement_responded: {
    key: routes.goalStatementResponedNavigator,
    component: StackGoalStatementResponded,
    params: {
      value: 'goal_statement_responded',
      parentValue: 'member_goal_statement',
      module: 'goal_statement',
      key: '46eb45b0-1e4a-4903-b3a2-1f0823d990d7',
      parentKey: '75176cef-cff2-4741-8139-67ce23bdca6c',
      type: 'responded',
    },
  },
  self_image_completed: {
    key: routes.selfImageCompleteNavigator,
    component: StackSelfImageCompleted,
    params: {
      value: 'self_image_completed',
      parentValue: 'self_image',
      key: '1dbc99eb-1a68-40dc-8d60-102c23a026c9',
      parentKey: 'c31a3cf2-ff7a-4957-9546-9c104f68d96c',
      module: 'self_image',
      type: 'completed',
    },
  },
  self_image_incompleted: {
    key: routes.selfImageIncompleteNavigator,
    component: StackSelfImageIncomplete,
    params: {
      value: 'self_image_incompleted',
      parentValue: 'self_image',
      key: '45118873-02a7-4bc7-a181-3d501f7ad677',
      parentKey: 'c31a3cf2-ff7a-4957-9546-9c104f68d96c',
      module: 'self_image',
      type: 'incompleted',
    },
  },
  self_image_responded: {
    key: routes.selfImageResponedNavigator,
    component: StackSelfImageResponded,
    params: {
      value: 'self_image_responded',
      parentValue: 'self_image',
      key: '7ad62d39-8cea-4b72-8394-d270a12fe850',
      parentKey: 'c31a3cf2-ff7a-4957-9546-9c104f68d96c',
      module: 'self_image',
      type: 'responded',
    },
  },

  groups: {
    key: routes.calendarGroupsNavigator,
    component: StackCalendarGroups,
    params: {
      value: 'groups',
      parentValue: 'calendar',
      key: '62c5554e-72cb-4876-98b5-889ecb5e8db7',
      parentKey: '79fe1cf4-6cd7-42d0-a855-3fcf5fec045a',
    },
  },

  calendar_events: {
    key: routes.calendarEventNavigator,
    component: StackCalendarEvents,
    params: {
      value: 'calendar_events',
      parentValue: 'calendar',
      key: '38bdd187-f583-4b46-bbb9-20bd784bf241',
      parentKey: '79fe1cf4-6cd7-42d0-a855-3fcf5fec045a',
      type: '',
    },
  },

  teams: {
    key: routes.salesTeamNavigator,
    component: StackSalesTeam,
    params: {
      value: 'teams',
      parentValue: '/sales',
      key: 'hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49c',
      parentKey: 'aadbd7a3-91c1-499dd-bf24-7846756776677887',
    },
  },
  pending_commission: {
    key: routes.salesPendingCommissionsNavigator,
    component: StackSalesPendingCommission,
    params: {
      value: 'pending_commission',
      parentValue: '/sales',
      key: 'hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49a',
      parentKey: 'aadbd7a3-91c1-499dd-bf24-7846756776677887',
    },
  },
  paid_commission: {
    key: routes.salesPaidCommissionsNavigator,
    component: StackSalesPaidCommission,
    params: {
      value: 'paid_commission',
      parentValue: '/sales',
      key: 'hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49f',
      parentKey: 'aadbd7a3-91c1-499dd-bf24-7846756776677887',
    },
  },
  sales_team_transactions: {
    key: routes.salesTeamTransactionsNavigator,
    component: StackSalesTeamTransaction,
    params: {
      value: 'sales_team_transactions',
      parentValue: '/sales',
      key: 'hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49g',
      parentKey: 'aadbd7a3-91c1-499dd-bf24-7846756776677887',
    },
  },
};

// export const ParentComponents = {

// 	"867a0259-dafe-40c0-82e4-55bc1d4e548f": {
// 		key: routes.dasboardNavigator,
// 		component: StackMissionControl,
// 		params: {
// 			value: "mission_control",
// 			key: "867a0259-dafe-40c0-82e4-55bc1d4e548f"
// 		},
// 	},
// 	"433f8aaf-59cf-46f1-a1d9-ac31d645946d": {
// 		key: routes.feedNavigator,
// 		component: StackFeed,
// 		params: {
// 			feedFor: "the_cosmos",
// 			value: "the_cosmos",
// 			key: "433f8aaf-59cf-46f1-a1d9-ac31d645946d"
// 		}
// 	},
// 	"83b8897f-5ef3-434d-bc5e-76142371f5e7": {
// 		key: routes.supportTicketNavigator,
// 		component: StackSupportTicket,
// 		params: { type: "support_ticket", value: "support_ticket", key: "83b8897f-5ef3-434d-bc5e-76142371f5e7" }
// 	},
// 	'c47fa8a3-9f0d-469c-b78c-9f841c251a91': {
// 		key: routes.internalTicketNavigator,
// 		component: StackInternalTickets,
// 		params: { type: "internal_ticket", value: "internal-tickets", key: 'c47fa8a3-9f0d-469c-b78c-9f841c251a91' }
// 	},
// 	"34ac8703-da69-4282-9f62-f5295cbcac8d": {
// 		key: routes.chatNavigator,
// 		component: StackChat,
// 		params: { value: "chat", key: "34ac8703-da69-4282-9f62-f5295cbcac8d" }
// 	},
// 	"d2ff9f8b-20a8-4646-a08b-cbdfd931fb54": {
// 		key: null,
// 		component: null,
// 		params: { value: "members", key: "d2ff9f8b-20a8-4646-a08b-cbdfd931fb54" }
// 	},
// 	"34e7b7db-b8c5-4d55-98fc-700d3c6cd357": {
// 		key: routes.sourceFeedNavigator,
// 		component: StackFeed,
// 		params: {
// 			feedFor: "the_source",
// 			title: "The Source Feed",
// 			value: "the_source_feed",
// 			key: "34e7b7db-b8c5-4d55-98fc-700d3c6cd357"
// 		}
// 	},
// 	"cbd826ec-9082-44c4-a94c-4af0bf98eeb9": {
// 		key: routes.allSourcesFeedNavigator,
// 		component: StackFeed,
// 		params: {
// 			feedFor: "all_source",
// 			title: "All Source Feed",
// 			value: "all_source_feed",
// 			key: "cbd826ec-9082-44c4-a94c-4af0bf98eeb9"
// 		}
// 	},
// 	"214ab401-1f91-45c6-9250-42df98cd20ee": {
// 		key: routes.scheduledFeedNavigator,
// 		component: StackFeed,
// 		params: {
// 			feedFor: "scheduled",
// 			title: "Schedule Feed",
// 			value: "scheduled_feeds",
// 			key: "214ab401-1f91-45c6-9250-42df98cd20ee"
// 		}
// 	},
// 	"c351eb22-6d51-4187-9111-f05872a6d4b8": {
// 		value: "support",
// 		key: null,
// 		params: {
// 			value: "support",
// 			key: "c351eb22-6d51-4187-9111-f05872a6d4b8"
// 		}
// 	},
// 	"3fd672ca-06bf-4c59-b66a-44880c8effca": {
// 		key: routes.whatsappChatNavigator,
// 		component: StackWhatsApp,
// 		params: {
// 			value: "whatsapp_chat",
// 			key: "3fd672ca-06bf-4c59-b66a-44880c8effca"
// 		}
// 	},
// 	"455ccc75-c8d3-41b3-856b-5a133a185c5b": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "payments",
// 			key: "455ccc75-c8d3-41b3-856b-5a133a185c5b"
// 		}
// 	},
// 	"c4406822-391b-4320-892f-ceb760f157c0": {
// 		key: routes.portalNavigator,
// 		component: StackPortals,
// 		params: {
// 			value: "portals",
// 			key: "c4406822-391b-4320-892f-ceb760f157c0"
// 		}
// 	},
// 	"2f8afe1f-58b9-4415-93a6-d2a65b3cfa5e": {
// 		key: routes.myPortalNavigator,
// 		component: StackMyPortals,
// 		params: {
// 			value: "my_portals",
// 			key: "2f8afe1f-58b9-4415-93a6-d2a65b3cfa5e"
// 		}
// 	},
// 	"f6f13dcc-c828-4ee8-81e4-85b9a21f6308": {
// 		key: routes.linksNavigator,
// 		component: StackLinks,
// 		params: {
// 			value: "links",
// 			key: "f6f13dcc-c828-4ee8-81e4-85b9a21f6308"
// 		}
// 	},

// 	"c843ea03-df9e-4916-b59f-7357e79b90cb": {
// 		key: routes.membersAnswersNavigator,
// 		component: StackMembersAnswer,
// 		params: {
// 			value: "member_answers_list",
// 			key: "c843ea03-df9e-4916-b59f-7357e79b90cb"
// 		}
// 	},
// 	"73e12b1a-5c26-4092-ac3c-571fd8738f67": {
// 		key: routes.subscriptionNavigator,
// 		component: StackSubscription,
// 		params: {
// 			value: "subscription_list",
// 			key: "73e12b1a-5c26-4092-ac3c-571fd8738f67"
// 		}
// 	},
// 	"50f33585-a162-43f2-9248-5ae844488772": {
// 		key: routes.trainingNavigator,
// 		component: StackTraining,
// 		params: {
// 			value: "delegate_training",
// 			key: "50f33585-a162-43f2-9248-5ae844488772"
// 		}
// 	},
// 	"3bc7d829-9b1b-4cba-b657-39485b52f625": {
// 		key: null,
// 		component: null,
// 		params: { value: "appointment", key: "3bc7d829-9b1b-4cba-b657-39485b52f625" }
// 	},
// 	"08c114e9-3ce1-40c7-808f-0ac556f3b93c": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "90_day_plan",
// 			key: "08c114e9-3ce1-40c7-808f-0ac556f3b93c"
// 		}
// 	},
// 	"17fc7008-54ea-4917-b74a-05256563398e": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "delegate_pods",
// 			key: "17fc7008-54ea-4917-b74a-05256563398e"
// 		}
// 	},
// 	"14f2dd46-0399-43d7-b17d-cae069a6244a": {
// 		key: routes.dynamitePodNavigator,
// 		component: StackDynamitePod,
// 		params: {
// 			value: "dynamite_pods",
// 			key: "14f2dd46-0399-43d7-b17d-cae069a6244a"
// 		}
// 	},
// 	"25a25c8b-b9c0-4f7d-b77d-074c97c55195": {
// 		key: routes.myRecordingNavigator,
// 		component: StackRecordings,
// 		params: {
// 			value: "your_recordings",
// 			key: "25a25c8b-b9c0-4f7d-b77d-074c97c55195"
// 		}
// 	},
// 	"bc7d4e01-05aa-49a6-9bb6-09b90e44908d": {
// 		key: routes.vaultNavigator,
// 		component: StackVault,
// 		params: {
// 			value: "your_vault",
// 			key: "bc7d4e01-05aa-49a6-9bb6-09b90e44908d"
// 		}
// 	},
// 	"d855c0fa-6dd4-45f9-9fc9-f1bed80e2192": {
// 		key: routes.assessmentNavigator,
// 		component: StackAssessment,
// 		params: {
// 			value: "attitude_assessment",
// 			key: "d855c0fa-6dd4-45f9-9fc9-f1bed80e2192"
// 		}
// 	},
// 	"93a6e107-c620-4ba4-81d9-64660b4fb4db": {
// 		key: routes.progressNavigator,
// 		component: StackProgress,
// 		params: {
// 			value: "progress",
// 			key: "93a6e107-c620-4ba4-81d9-64660b4fb4db"
// 		}
// 	},
// 	"9ebb9563-c76c-42d0-b2e5-de7a88bbf3c9": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "certification",
// 			key: "9ebb9563-c76c-42d0-b2e5-de7a88bbf3c9"
// 		}
// 	},
// 	"75176cef-cff2-4741-8139-67ce23bdca6c": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "member_goal_statement",
// 			key: "75176cef-cff2-4741-8139-67ce23bdca6c"
// 		}
// 	},
// 	"c31a3cf2-ff7a-4957-9546-9c104f68d96c": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "self_image",
// 			key: "c31a3cf2-ff7a-4957-9546-9c104f68d96c"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-532fc288d2659": {
// 		key: routes.dailyStreakPerformerNavigator,
// 		component: StackDailyStreakPerformance,
// 		params: {
// 			value: "daily_streak_performance",
// 			key: "aadbd7a3-91c1-40dd-bf24-532fc288d2659"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-8987688566hhh": {
// 		key: routes.monthlyReportNavigator,
// 		component: StackMonthReport,
// 		params: {
// 			value: "performance_stats",
// 			key: "aadbd7a3-91c1-40dd-bf24-8987688566hhh"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-898768876hhh": {
// 		key: routes.broadcastNavigator,
// 		component: StackBroadcast,
// 		params: {
// 			value: "broadcast_chats",
// 			key: "aadbd7a3-91c1-40dd-bf24-898768876hhh"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-7846756776677887": {
// 		key: routes.quaterQuestionNavigator,
// 		component: StackQuaterQuestions,
// 		params: {
// 			value: "quarter_questions",
// 			key: "aadbd7a3-91c1-40dd-bf24-7846756776677887"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-532fc288d265": {
// 		key: routes.accountabilityTrackerNavigator,
// 		component: StackAcountabilityTracker,
// 		params: {
// 			value: "daily_dynamite_accountabalility_tracker",
// 			key: "aadbd7a3-91c1-40dd-bf24-532fc288d265"
// 		}
// 	},

// 	"aadbd7a3-91c1-40dd-bf24-532fc288d265555": {
// 		key: routes.delegateReportNavigator,
// 		component: StackDelegateReport,
// 		params: {
// 			value: "accountability_tracker_report",
// 			key: "aadbd7a3-91c1-40dd-bf24-532fc288d265555"
// 		}
// 	},

// 	"79fe1cf4-6cd7-42d0-a855-3fcf5fec045a": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "calendar",
// 			key: "79fe1cf4-6cd7-42d0-a855-3fcf5fec045a"
// 		}
// 	},
// 	"d2ff9f8b-20a8-4646-a08b-cbdfd931f454": {
// 		key: routes.delegateEventsNavigator,
// 		component: StackDelegateEvents,
// 		params: {
// 			type: "consultant_user",
// 			value: "delegate_events",
// 			key: "d2ff9f8b-20a8-4646-a08b-cbdfd931f454"
// 		}
// 	},
// 	//? Sales Tab
// 	"aadbd7a3-91c1-499dd-bf24-7846756776677887": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "/sales",
// 			key: "aadbd7a3-91c1-499dd-bf24-7846756776677887"
// 		}
// 	},
// 	"5bd62bab-3f70-471a-ad80-d788cd481c39": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "mission_member_report",
// 			key: "5bd62bab-3f70-471a-ad80-d788cd481c39"
// 		},
// 	},

// 	"ad108738-ebe0-428e-9810-55203ee509f7": {
// 		key: routes.missionNavigator,
// 		component: StackMission,
// 		params: {
// 			value: "missions",
// 			key: "ad108738-ebe0-428e-9810-55203ee509f7",
// 		}
// 	},

// 	"52f27c5a-44ba-44ba-b0f0-b0b150ea031b": {
// 		key: null,
// 		component: null,
// 		params: {
// 			value: "",
// 			key: "52f27c5a-44ba-44ba-b0f0-b0b150ea031b"
// 		},
// 	},

// 	// "aadbd7a3-444444-40dd-bf24-7846756776677887": {
// 	//   key: routes.leadcenterNavigator,
// 	//   component: StackLeadCenter,
// 	//   params: {
// 	//     value: "leads_center",
// 	//     key: "aadbd7a3-444444-40dd-bf24-7846756776677887"
// 	//   }
// 	// },

// 	// Update Tab
// 	"39f49f30-5a18-4c38-9c91-ad8a89f7218b": {
// 		key: routes.updates,
// 		component: StackUpdates,
// 		params: {
// 			value: "updates",
// 			key: "39f49f30-5a18-4c38-9c91-ad8a89f7218b"
// 		}
// 	},

// 	"c6148bbe-118f-492d-b1e7-bec092d7afec": {
// 		key: routes.affiliate,
// 		component: StackAffiliate,
// 		params: {
// 			value: "campaign_url",
// 			key: "c6148bbe-118f-492d-b1e7-bec092d7afec"
// 		}
// 	},

// 	"0a3fc4be-fac3-46f2-a887-ae1e08f9d351": {
// 	  key: routes.templates,
// 	  component: StackTemplates,
// 	  params: {
// 	    value: "templates",
// 	  title:"Templates",
// 	    key: "0a3fc4be-fac3-46f2-a887-ae1e08f9d351"
// 	  }
// 	},

// }

// export const ChildComponents = {

// 	"43a6bd01-07f9-4ef0-9279-905b683575ce": {
// 		key: routes.feedReviewNavigator,
// 		component: StackFeedReview,
// 		params: {
// 			value: "review_feeds",
// 			parentValue: "",
// 			key: "43a6bd01-07f9-4ef0-9279-905b683575ce",
// 			parentKey: "52f27c5a-44ba-44ba-b0f0-b0b150ea031b"
// 		}
// 	},

// 	"43a6bd01-07f9-4ef0-lkklklklkl-905b683575ce": {
// 		key: routes.commentsReviewNavigator,
// 		component: StackCommentReview,
// 		params: {
// 			value: "review_comments",
// 			parentValue: "",
// 			key: "43a6bd01-07f9-4ef0-lkklklklkl-905b683575ce",
// 			parentKey: "52f27c5a-44ba-44ba-b0f0-b0b150ea031b"
// 		}
// 	},

// 	"hhfhhfhfhf-31d9-4154-b3a9-81619gdhb4va": {
// 		key: routes.InProgressMissionReportNavigator,
// 		component: StackMissionReport,
// 		params: {
// 			type: "in_progress",
// 			key: "hhfhhfhfhf-31d9-4154-b3a9-81619gdhb4va",
// 			parentKey: "5bd62bab-3f70-471a-ad80-d788cd481c39"
// 		}
// 	},
// 	"hhfhhfhfhf-31d9-41bb-b3c9-81619fd1b49c": {
// 		key: routes.completeMissionReportNavigator,
// 		component: StackMissionReport,
// 		params: {
// 			type: "completed",
// 			parentValue: "members",
// 			key: "hhfhhfhfhf-31d9-41bb-b3c9-81619fd1b49c",
// 			parentKey: "5bd62bab-3f70-471a-ad80-d788cd481c39"
// 		}
// 	},
// 	"5f063d7b-640b-4088-a821-0b77a08b18c7": {
// 		key: routes.memberNavigator,
// 		component: StackMembers,
// 		params: {
// 			type: "member",
// 			value: "members",
// 			parentValue: "members",
// 			key: "5f063d7b-640b-4088-a821-0b77a08b18c7",
// 			parentKey: "d2ff9f8b-20a8-4646-a08b-cbdfd931fb54"
// 		}
// 	},
// 	"06cafbd4-cee7-4723-acc5-ce265d01a148": {
// 		key: routes.nurtureNavigator,
// 		component: StackNurtureMembers,
// 		params: {
// 			type: "nurture",
// 			value: "nurture",
// 			parentValue: "members",
// 			key: "06cafbd4-cee7-4723-acc5-ce265d01a148",
// 			parentKey: "d2ff9f8b-20a8-4646-a08b-cbdfd931fb54"
// 		}
// 	},
// 	"9daa2af3-a55d-40e4-9821-c3fe4199d5ab": {
// 		key: routes.allMemberNavigator,
// 		component: StackAllMember,
// 		params: {
// 			type: "all-member",
// 			value: "all_member_list",
// 			parentValue: "members",
// 			key: "9daa2af3-a55d-40e4-9821-c3fe4199d5ab",
// 			parentKey: "d2ff9f8b-20a8-4646-a08b-cbdfd931fb54"
// 		}
// 	},
// 	"26ddb8b0-31d9-4154-b3a9-81619fd1b49c": {
// 		key: routes.contactSupportNavigator,
// 		component: StackContactSupport,
// 		params: {
// 			value: "contact_support", parentValue: "support",
// 			key: "26ddb8b0-31d9-4154-b3a9-81619fd1b49c",
// 			parentKey: "c351eb22-6d51-4187-9111-f05872a6d4b8",
// 		}
// 	},
// 	"96eadc59-d4a6-44f3-b99e-14a87136de90": {
// 		key: routes.digitalAssetNavigator,
// 		component: StackDigitalAssets,
// 		params: {
// 			value: "digital_assets", parentValue: "support",
// 			key: "96eadc59-d4a6-44f3-b99e-14a87136de90",
// 			parentKey: "c351eb22-6d51-4187-9111-f05872a6d4b8",
// 		}
// 	},
// 	"50dc0ed7-7b87-4955-b1ad-13cb8a2fd52b": {
// 		key: routes.helpTechNavigator,
// 		component: StackHelpTech,
// 		params: {
// 			value: "help_tech", parentValue: "support",
// 			key: "50dc0ed7-7b87-4955-b1ad-13cb8a2fd52b",
// 			parentKey: "c351eb22-6d51-4187-9111-f05872a6d4b8",
// 		}
// 	},
// 	"558ec2ba-49ca-4740-bb81-a0a29296d69d": {
// 		key: routes.transactionNavigator,
// 		component: StackTransactions,
// 		params: {
// 			value: "transactions", parentValue: "payments",
// 			key: "558ec2ba-49ca-4740-bb81-a0a29296d69d",
// 			parentKey: "455ccc75-c8d3-41b3-856b-5a133a185c5b",
// 		}
// 	},
// 	"443a08f7-f6e0-4fa7-81fb-5236e6e970de": {
// 		key: routes.commissionNavigator,
// 		component: StackCommissions,
// 		params: {
// 			value: "commission_detail", parentValue: "payments",
// 			key: "443a08f7-f6e0-4fa7-81fb-5236e6e970de",
// 			parentKey: "455ccc75-c8d3-41b3-856b-5a133a185c5b",
// 		}
// 	},
// 	"84a645c5-7979-49bc-9ca6-a4214336ec77": {
// 		key: routes.paymentRquesNavigator,
// 		component: StackPaymentsRequest,
// 		params: {
// 			value: "payment_request", parentValue: "payments",
// 			key: "84a645c5-7979-49bc-9ca6-a4214336ec77",
// 			parentKey: "455ccc75-c8d3-41b3-856b-5a133a185c5b",
// 		}
// 	},
// 	"68cf2ca6-010a-4e51-94ee-26231efe87e5": {
// 		key: routes.bookingNavigator,
// 		component: StackBookings,
// 		params: {
// 			value: "bookings", parentValue: "appointment",
// 			key: "68cf2ca6-010a-4e51-94ee-26231efe87e5",
// 			parentKey: "3bc7d829-9b1b-4cba-b657-39485b52f625",
// 		}
// 	},
// 	"6fbc5f59-7886-4d6d-b936-14636b4bdff9": {
// 		key: routes.bookingConfigurationsNavigator,
// 		component: StackBookingConfiguration,
// 		params: {
// 			value: "schedule_appointment", parentValue: "appointment",
// 			key: "6fbc5f59-7886-4d6d-b936-14636b4bdff9",
// 			parentKey: "3bc7d829-9b1b-4cba-b657-39485b52f625",
// 		}
// 	},
// 	"9f051351-3edc-481c-ac23-85e09f4e2e11": {
// 		key: routes._90daysPlanNavigator,
// 		component: Stack90DaysPlan,
// 		params: {
// 			value: "90_day_plan", parentValue: "90_day_plan",
// 			type: "delegate-90-day-questions",
// 			key: "9f051351-3edc-481c-ac23-85e09f4e2e11",
// 			parentKey: "08c114e9-3ce1-40c7-808f-0ac556f3b93c",
// 		}
// 	},
// 	"d2a962e6-b079-4eb3-8f67-c467d85323e6": {
// 		key: routes._90daysTrackerNavigator,
// 		component: Stack90DaysTracker,
// 		params: {
// 			value: "90_day_tracker", parentValue: "90_day_plan",
// 			key: "d2a962e6-b079-4eb3-8f67-c467d85323e6",
// 			parentKey: "08c114e9-3ce1-40c7-808f-0ac556f3b93c",
// 		}
// 	},
// 	"ee600ffb-0afa-449b-9b76-99761c01ed3d": {
// 		key: routes.sourcePodNavigator,
// 		component: StackSourcePod,
// 		params: {
// 			value: "source_pods", parentValue: "delegate_pods",
// 			key: "ee600ffb-0afa-449b-9b76-99761c01ed3d",
// 			parentKey: "17fc7008-54ea-4917-b74a-05256563398e",
// 			type: "general"
// 		}
// 	},
// 	"657bbdbb-661f-4ebb-8373-9c0c34485fb7": {
// 		key: routes.bookcallPodNavigator,
// 		component: StackBookCallPod,
// 		params: {
// 			value: "book_call_pods", parentValue: "delegate_pods",
// 			key: "657bbdbb-661f-4ebb-8373-9c0c34485fb7",
// 			parentKey: "17fc7008-54ea-4917-b74a-05256563398e",
// 			type: "booking"
// 		}
// 	},
// 	"3bbea0ca-7d66-4225-9950-9ecec741637d": {
// 		key: routes.studyAssessmentNavigator,
// 		component: StackStudyAssessment,
// 		params: {
// 			value: "assessment_study", parentValue: "certification",
// 			key: "3bbea0ca-7d66-4225-9950-9ecec741637d",
// 			parentKey: "9ebb9563-c76c-42d0-b2e5-de7a88bbf3c9",
// 		}
// 	},
// 	"f18f9630-2dc1-4e42-a498-0a0e7e9407be": {
// 		key: routes.goalStatementCompleteNavigator,
// 		component: StackGoalStatementCompleted,
// 		params: {
// 			value: "complete",
// 			parentValue: "member_goal_statement",
// 			key: "f18f9630-2dc1-4e42-a498-0a0e7e9407be",
// 			parentKey: "75176cef-cff2-4741-8139-67ce23bdca6c",
// 			type: "complete"
// 		}
// 	},
// 	"6777364d-4014-47d4-abd2-f488fa1c58bc": {
// 		key: routes.goalStatementIncompleteNavigator,
// 		component: StackGoalStatementIncompleted,
// 		params: {
// 			value: "incomplete", parentValue: "member_goal_statement",
// 			key: "6777364d-4014-47d4-abd2-f488fa1c58bc",
// 			parentKey: "75176cef-cff2-4741-8139-67ce23bdca6c",
// 			type: "incomplete"
// 		}
// 	},
// 	"46eb45b0-1e4a-4903-b3a2-1f0823d990d7": {
// 		key: routes.goalStatementResponedNavigator,
// 		component: StackGoalStatementResponded,
// 		params: {
// 			value: "responded", parentValue: "member_goal_statement",
// 			module: "goal_statement",
// 			key: "46eb45b0-1e4a-4903-b3a2-1f0823d990d7",
// 			parentKey: "75176cef-cff2-4741-8139-67ce23bdca6c",
// 			type: "responded"
// 		}
// 	},
// 	"1dbc99eb-1a68-40dc-8d60-102c23a026c9": {
// 		key: routes.selfImageCompleteNavigator,
// 		component: StackSelfImageCompleted,
// 		params: {
// 			value: "completed", parentValue: "self_image",
// 			key: "1dbc99eb-1a68-40dc-8d60-102c23a026c9",
// 			parentKey: "c31a3cf2-ff7a-4957-9546-9c104f68d96c",
// 			module: "self_image", type: "completed"
// 		}
// 	},
// 	"45118873-02a7-4bc7-a181-3d501f7ad677": {
// 		key: routes.selfImageIncompleteNavigator,
// 		component: StackSelfImageIncomplete,
// 		params: {
// 			value: "incompleted", parentValue: "self_image",
// 			key: "45118873-02a7-4bc7-a181-3d501f7ad677",
// 			parentKey: "c31a3cf2-ff7a-4957-9546-9c104f68d96c",
// 			module: "self_image", type: "incompleted"
// 		}
// 	},
// 	"7ad62d39-8cea-4b72-8394-d270a12fe850": {
// 		key: routes.selfImageResponedNavigator,
// 		component: StackSelfImageResponded,
// 		params: {
// 			value: "responded", parentValue: "self_image",
// 			key: "7ad62d39-8cea-4b72-8394-d270a12fe850",
// 			parentKey: "c31a3cf2-ff7a-4957-9546-9c104f68d96c",
// 			module: "self_image", type: "responded"
// 		}
// 	},

// 	"62c5554e-72cb-4876-98b5-889ecb5e8db7": {
// 		key: routes.calendarGroupsNavigator,
// 		component: StackCalendarGroups,
// 		params: {
// 			value: "groups", parentValue: "calendar",
// 			key: "62c5554e-72cb-4876-98b5-889ecb5e8db7",
// 			parentKey: "79fe1cf4-6cd7-42d0-a855-3fcf5fec045a",
// 		}
// 	},

// 	"38bdd187-f583-4b46-bbb9-20bd784bf241": {
// 		key: routes.calendarEventNavigator,
// 		component: StackCalendarEvents,
// 		params: {
// 			value: "calendar_events", parentValue: "calendar",
// 			key: "38bdd187-f583-4b46-bbb9-20bd784bf241",
// 			parentKey: "79fe1cf4-6cd7-42d0-a855-3fcf5fec045a",
// 			type: ""
// 		}
// 	},

// 	"hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49c": {
// 		key: routes.salesTeamNavigator,
// 		component: StackSalesTeam,
// 		params: {
// 			value: "teams", parentValue: "/sales",
// 			key: "hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49c",
// 			parentKey: "aadbd7a3-91c1-499dd-bf24-7846756776677887",
// 		}
// 	},
// 	"hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49a": {
// 		key: routes.salesPendingCommissionsNavigator,
// 		component: StackSalesPendingCommission,
// 		params: {
// 			value: "pending_commission", parentValue: "/sales",
// 			key: "hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49a",
// 			parentKey: "aadbd7a3-91c1-499dd-bf24-7846756776677887",
// 		}
// 	},
// 	"hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49f": {
// 		key: routes.salesPaidCommissionsNavigator,
// 		component: StackSalesPaidCommission,
// 		params: {
// 			value: "paid_commission", parentValue: "/sales",
// 			key: "hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49f",
// 			parentKey: "aadbd7a3-91c1-499dd-bf24-7846756776677887",
// 		}
// 	},
// 	"hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49g": {
// 		key: routes.salesTeamTransactionsNavigator,
// 		component: StackSalesTeamTransaction,
// 		params: {
// 			value: "sales_team_transactions", parentValue: "/sales",
// 			key: "hhfhhfhfhf-31d9-4154-b3a9-81619fd1b49g",
// 			parentKey: "aadbd7a3-91c1-499dd-bf24-7846756776677887",
// 		}
// 	},

// }
