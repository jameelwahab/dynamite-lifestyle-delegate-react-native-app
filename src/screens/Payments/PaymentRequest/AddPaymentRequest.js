import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {colors} from '../../../utilities/colors';
import MyInputs from '../../../components/MyInputs';
import {MyButton} from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import Collapsible from 'react-native-collapsible';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import {
  ADD_PAYMENT_REQUEST,
  EDIT_PAYMENT_REQUEST,
  GET_MEMBER_LIST_FOR_PAYMENT_REQUEST,
  GET_PAYMENT_TEMPLATE_AND_PROGRAMMES_LIST,
  GET_PRODUCT_LIST,
  GET_TEMPLATE_DETAIL,
  GET_DATE_LIST_PLAN,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import CountryModal from '../../../components/CountryModal';
import OptionModal from '../../../components/OptionModal';
import MyLoader from '../../../components/MyLoader';
import showToast from '../../../functions/showToast';
import {selectSettings} from '../../../redux/reducers/settingSlice';
import InfoModal from '../../../components/InfoModal';
import TitleView from '../../../components/TitleView';
import {icons} from '../../../utilities/icons';
import copyText from '../../../functions/copyText';
import extractTextFromHTML from '../../../functions/extractTextFromHTML';
import breakReference from '../../../functions/breakReference';
import {STRINGS} from '../../../utilities/strings';

const AddPaymentRequest = ({navigation, route}) => {
  const {editItem} = route?.params;
  const ref_info = useRef();
  const {token, access} = useSelector(selectUser);
  const {settings} = useSelector(selectSettings);
  const [isNewMember, setisNewMember] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState({
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    dial_code: '+44',
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberModalVisibility, setMemberModalVisibility] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [paymentTemplates, setPaymentTemplates] = useState([]);
  const [progammes, setProgammes] = useState([]);
  const [salePages, setSalePages] = useState([]);
  const [products, setProducts] = useState([]);
  const [countryModalVisibility, setCountryModalVisibility] = useState(false);
  const [showSalePages, setShowSalePages] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selected, updateSelected] = useState({
    template: null,
    title: '',
    status: statusList[0],
    currency: currencyList[1],
    product: null,
    programme: null,
    requestType: {title: 'Onetime', key: 'onetime'},
    totalAmount: '',
    vat: '',
    note: '',
    initialAmount: '',
    installments: '',
    installmentAmount: '',
    planType: null,
    noOfDays: '',
    leadStatus: null,
    purchasingUser: null,
    sale_pages: null,
    templateApplied: false,
  });

  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: '',
    titlekey: '',
    list: [],
  });
  const setSelected = updation => updateSelected({...selected, ...updation});
  const onMemberSelected = member => {
    setSelectedMember(member);
    setMemberModalVisibility(false);
  };

  const onSalePageSelect = page => {
    updateSelected({...selected, sale_pages: page});
    setShowSalePages(false);
  };

  const onOptionSelected = opt => {
    let {type} = optionModal;
    setOptionModal({isVisible: false, type: '', titlekey: '', list: []});
    setSelected({[type]: opt});
    if (type == 'template') {
      getTemplateDetail(opt?._id);
    }
  };

  const getMembers = async (searchText = '') => {
    let res = await GET_MEMBER_LIST_FOR_PAYMENT_REQUEST({
      navigation,
      token,
      searchText,
      memberType: memberTypeObj[access?.show_members_list_for_payment_request],
    });
    if (res.code == 200) {
      setMemberList(res?.members);
    }
  };

  const salePagefilter = (list, text) => {
    if (text?.trim() == '') {
      return list;
    } else {
      return list
        .slice()
        .filter(x =>
          x.sale_page_title.toLowerCase().includes(text.toLowerCase().trim()),
        );
    }
  };

  const getProducts = async () => {
    let res = await GET_PRODUCT_LIST({navigation, token});
    if (res.code == 200) {
      setProducts(res?.product);
    }
  };
  const getPaymentAndProgrammes = async () => {
    let res = await GET_PAYMENT_TEMPLATE_AND_PROGRAMMES_LIST({
      navigation,
      token,
    });
    if (res.code == 200) {
      setPaymentTemplates(res?.payment_template);
      setProgammes(res?.programs);
    }
  };

  const getDateListPlan = async () => {
    let res = await GET_DATE_LIST_PLAN({navigation, token});
    if (res.code == 200) {
      setSalePages(res?.sale_pages);
    }
  };

  const getTemplateDetail = async id => {
    let res = await GET_TEMPLATE_DETAIL({navigation, token, templateId: id});
    if (res.code == 200) {
      let data = res?.payment_template;
      let obj = {
        template: data,
        title: !!data?.title ? data?.title : '',
        status: statusList.find(x => x.key == true),
        currency: !!data?.currency
          ? currencyList.find(x => x.key == data?.currency)
          : null,
        product: !!data?.product ? data?.product : null,
        programme: !!data?.program ? data?.program : null,
        requestType: !!data?.template_type
          ? requestList.find(x => x.key == data?.template_type)
          : null,
        totalAmount: !!data?.total_amount ? data?.total_amount : '',
        vat: !!data?.vat_number ? data?.vat_number : '',
        note: !!data?.short_description ? data?.short_description : '',
        initialAmount: !!data?.initial_amount ? data?.initial_amount : '',
        installments: !!data?.no_of_installment ? data?.no_of_installment : '',
        // installmentAmount: !!data?.installment_amount ? data?.installment_amount : "",
        planType: !!data?.interval_type
          ? planTypeList.find(x => x.key == data?.interval_type)
          : '',
        noOfDays: !!data?.number_of_days ? data?.number_of_days : '',
        leadStatus: !!data?.lead_status?.title
          ? data?.lead_status?.title
          : null,
        purchasingUser: !!data?.consider_purchasing_user
          ? data?.consider_purchasing_user
          : null,
        sale_pages: !!data?.sale_page ? data?.sale_page : null,
        templateApplied: true,
      };
      setSelected(obj);
    }
  };

  const setInstallemtAmount = () => {
    if (selected.installments != '') {
      let installmentAmount =
        (selected?.totalAmount - selected?.initialAmount) /
        selected.installments;
      setSelected({installmentAmount: installmentAmount.toFixed(1)});
      // return installmentAmount;
    } else {
      setSelected({installmentAmount: ''});
    }
  };

  const addPaymentRequest = () => {
    if (!!!country && isNewMember) {
      showToast({
        title: STRINGS.ADD_PAYMENT_REQUEST.alert,
        body: STRINGS.ADD_PAYMENT_REQUEST.pleaseSelectCountry,
        type: 'info',
      });
      return;
    }
    let obj = {};
    if (isNewMember) {
      obj = {
        is_member_create: true,
        country: country?.code,
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      };
    } else {
      obj = {
        is_member_create: false,
        member_id: selectedMember?._id,
      };
    }
    obj = {
      ...obj,
      currency: selected?.currency?.key,
      payment_template: selected?.template?._id,
      product: selected?.product?._id,
      program_slug: selected?.programme?.program_slug,
      request_title: selected?.title,
      request_type: selected?.requestType?.key,
      show_on_consultant: 'all',
      status: selected?.status?.key,
      total_amount: selected?.totalAmount,
      transaction_note: selected?.note,
      vat_number: selected?.vat,
    };

    if (selected?.requestType?.key == 'recurring') {
      obj = {
        ...obj,
        request_iteration_type: selected?.planType?.key,
        initial_amount: selected?.initialAmount,
        month: selected?.installments,
      };
    }
    if (
      selected?.planType?.key == 'custom' &&
      selected?.requestType?.key == 'recurring'
    ) {
      obj = {
        ...obj,
        number_of_days: selected?.noOfDays,
      };
    }
    if (selected?.sale_pages !== null) {
      obj = {
        ...obj,
        sale_page: selected?.sale_pages?._id,
      };
    }

    if (!!editItem) {
      delete obj?.is_member_create;
      updatePaymentRequestAPI(obj);
    } else {
      createPaymentRequestAPI(obj);
    }
  };

  const createPaymentRequestAPI = async obj => {
    setLoader(true);
    let res = await ADD_PAYMENT_REQUEST({token, navigation, body: obj});
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setLoader(false);
      // console.log(breakReference(res?.payment_request))
      route?.params?.backScreenFunc?.(
        breakReference({
          ...res?.payment_request,
          payment_template: {
            ...res?.payment_request?.payment_template,
            lead_status: res?.payment_request?.lead_status,
          },
        }),
      );
      navigation.goBack();
    } else {
      setLoader(false);
    }
  };

  const updatePaymentRequestAPI = async obj => {
    setLoader(true);
    let res = await EDIT_PAYMENT_REQUEST({
      token,
      navigation,
      body: obj,
      slug: editItem?.payment_request_slug,
    });
    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      setLoader(false);
      console.log(res?.payment_request?.sale_page);
      route?.params?.backScreenFunc?.(
        breakReference({
          ...res?.payment_request,
          payment_template: {
            ...res?.payment_request?.payment_template,
            lead_status: res?.payment_request?.lead_status,
          },
        }),
      );
      navigation.goBack();
    } else {
      setLoader(false);
    }
  };

  const setEditableData = () => {
    setSelectedMember(editItem?.member);
    setSelected({
      template: !!editItem?.payment_template
        ? editItem?.payment_template
        : null,
      title: !!editItem?.request_title ? editItem?.request_title : '',
      status: editItem?.status
        ? statusList.find(x => x.key == editItem?.status)
        : statusList.find(x => x.key == true),
      currency: !!editItem?.currency
        ? currencyList.find(x => x.key == editItem?.currency)
        : null,
      product: !!editItem?.product ? editItem?.product : null,
      programme: !!editItem?.program ? editItem?.program : null,
      requestType: !!editItem?.request_type
        ? requestList.find(x => x.key == editItem?.request_type)
        : null,
      totalAmount: !!editItem?.total_amount ? editItem?.total_amount : '',
      initialAmount: !!editItem?.initial_amount ? editItem?.initial_amount : '',
      installments: !!editItem?.month ? editItem?.month : '',
      planType: !!editItem?.request_iteration_type
        ? planTypeList.find(x => x.key == editItem?.request_iteration_type)
        : null,
      noOfDays: !!editItem?.number_of_days ? editItem?.number_of_days : '',
      vat: !!editItem?.vat_number ? editItem?.vat_number : '',
      note: !!editItem?.transaction_note
        ? editItem?.transaction_note
        : editItem?.transaction_note,
      sale_pages: !!editItem?.sale_page ? editItem?.sale_page : null,
    });
  };

  const clearSelectedPaymentTemplate = () => {
    setSelected({
      template: null,
      title: '',
      status: statusList[0],
      currency: currencyList[1],
      product: null,
      programme: null,
      requestType: null,
      totalAmount: '',
      vat: '',
      note: '',
      initialAmount: '',
      installments: '',
      installmentAmount: '',
      planType: null,
      noOfDays: '',
      sale_pages: null,
      leadStatus: null,
      purchasingUser: null,
      templateApplied: false,
    });
  };

  useEffect(() => {
    setInstallemtAmount();
  }, [
    selected?.totalAmount,
    selected?.installmentAmount,
    selected?.installments,
  ]);

  useEffect(() => {
    if (!!editItem) {
      setEditableData();
    }
    getMembers();
    getPaymentAndProgrammes();
    getDateListPlan();
    getProducts();
  }, []);

  const infoheader = () => {
    return (
      <View style={styles.infoHeaderContainer}>
        {!!settings?.bank_payment_details && (
          <MyButton
            onPress={() =>
              copyText(extractTextFromHTML(settings?.bank_payment_details))
            }
            invert
            leftIcon={icons.copy}
            noCapitalize
            style={styles.copyBankButton}
            title={STRINGS.ADD_PAYMENT_REQUEST.copyBankDetails}
          />
        )}
      </View>
    );
  };

  const topView = () => {
    return (
      <View>
        <View style={styles.topView}>
          <TitleView
            title={
              !!editItem
                ? STRINGS.ADD_PAYMENT_REQUEST.editPaymentRequest
                : STRINGS.ADD_PAYMENT_REQUEST.addPaymentRequest
            }
          />
          <View style={styles.topBtnsView}>
            {!!settings?.bank_payment_details && (
              <TouchableOpacity
                onPress={() => {
                  ref_info?.current?.openModal(
                    settings?.bank_payment_details,
                    undefined,
                    true,
                  );
                }}>
                {icons.bank(colors.primary, 20)}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <RootView
      hideSubHeader
      //  title={!!editItem ? "Edit Payment Request" : "Add Payment Request"}
    >
      {topView()}
      <View style={styles.flex1}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* <MyTouchableInput label='Member Type*' /> */}

          <View style={styles.boxView}>
            <View style={styles.boxHeadingView}>
              <MyText type="bold" fontSize={16}>
                {STRINGS.ADD_PAYMENT_REQUEST.memberInfo}
              </MyText>
            </View>
            {!!!editItem && (
              <View style={styles.checkBoxRow}>
                <View style={styles.flex1}>
                  <MyCheckBox
                    onPress={() => setisNewMember(false)}
                    title={STRINGS.ADD_PAYMENT_REQUEST.existingMember}
                    value={!isNewMember}
                    circle
                  />
                </View>
                <View style={styles.flex1}>
                  <MyCheckBox
                    onPress={() => setisNewMember(true)}
                    title={STRINGS.ADD_PAYMENT_REQUEST.newMember}
                    value={isNewMember}
                    circle
                  />
                </View>
              </View>
            )}

            <Collapsible collapsed={isNewMember}>
              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.members}
                onPress={() => setMemberModalVisibility(true)}
                value={
                  !!selectedMember
                    ? `${selectedMember?.first_name} ${selectedMember?.last_name} (${selectedMember?.email})`
                    : null
                }
              />
            </Collapsible>

            <Collapsible collapsed={!isNewMember}>
              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.firstName}
                value={firstName}
                onChangeText={text => setFirstName(text)}
              />

              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.lastName}
                value={lastName}
                onChangeText={text => setLastName(text)}
              />

              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.email}
                value={email}
                onChangeText={text => setEmail(text)}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.chooseCountry}
                value={!!country ? `${country?.flag} ${country?.name}` : ''}
                onPress={() => setCountryModalVisibility(true)}
                placeholder={STRINGS.ADD_PAYMENT_REQUEST.noCountrySelected}
                subTextView={() =>
                  !!country && (
                    <Pressable
                      style={styles.clearbtnView}
                      onPress={() => setCountry(null)}>
                      <MyText color={colors.primary}>
                        {STRINGS.ADD_PAYMENT_REQUEST.clear}
                      </MyText>
                    </Pressable>
                  )
                }
              />
            </Collapsible>
          </View>

          <View style={[styles.boxView, styles.boxViewMarginTop]}>
            <View style={styles.boxHeadingView}>
              <MyText type="bold" fontSize={16}>
                {STRINGS.ADD_PAYMENT_REQUEST.paymentRequestInfo}
              </MyText>
            </View>

            <MyTouchableInput
              label={STRINGS.ADD_PAYMENT_REQUEST.paymentTemplate}
              onPress={() =>
                setOptionModal({
                  list: paymentTemplates,
                  type: 'template',
                  isVisible: true,
                  titlekey: 'title',
                })
              }
              value={!!selected?.template ? selected?.template?.title : ''}
              subTextView={() =>
                !!selected?.template && (
                  <Pressable
                    style={styles.clearbtnView}
                    onPress={clearSelectedPaymentTemplate}>
                    <MyText color={colors.primary}>
                      {STRINGS.ADD_PAYMENT_REQUEST.clear}
                    </MyText>
                  </Pressable>
                )
              }
            />

            <View
              opacity={!!selected?.template ? 0.6 : 1}
              pointerEvents={!!selected?.template ? 'none' : 'auto'}>
              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.requestTitle}
                value={selected?.title}
                onChangeText={text => setSelected({title: text})}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.status}
                onPress={() =>
                  setOptionModal({
                    list: statusList,
                    type: 'status',
                    isVisible: true,
                    titlekey: 'title',
                  })
                }
                value={!!selected?.status ? selected?.status?.title : ''}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.currency}
                onPress={() =>
                  setOptionModal({
                    list: currencyList,
                    type: 'currency',
                    isVisible: true,
                    titlekey: 'title',
                  })
                }
                value={!!selected?.currency ? selected?.currency?.title : ''}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.product}
                onPress={() =>
                  setOptionModal({
                    list: products,
                    type: 'product',
                    isVisible: true,
                    titlekey: 'name',
                  })
                }
                value={!!selected?.product ? selected?.product?.name : ''}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.programme}
                onPress={() =>
                  setOptionModal({
                    list: progammes,
                    type: 'programme',
                    isVisible: true,
                    titlekey: 'title',
                  })
                }
                value={!!selected?.programme ? selected?.programme?.title : ''}
              />

              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.paymentRequestType}
                onPress={() =>
                  setOptionModal({
                    list: requestList,
                    type: 'requestType',
                    isVisible: true,
                    titlekey: 'title',
                  })
                }
                value={
                  !!selected?.requestType ? selected?.requestType?.title : ''
                }
              />

              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.totalAmount}
                value={String(selected?.totalAmount)}
                onChangeText={text => setSelected({totalAmount: text})}
                keyboardType="numeric"
              />

              <Collapsible
                collapsed={selected?.requestType?.key != 'recurring'}>
                <MyInputs
                  label={STRINGS.ADD_PAYMENT_REQUEST.initialAmount}
                  value={String(selected?.initialAmount)}
                  onChangeText={text => setSelected({initialAmount: text})}
                  keyboardType="numeric"
                />

                <MyInputs
                  label={STRINGS.ADD_PAYMENT_REQUEST.noOfInstallments}
                  value={String(selected?.installments)}
                  onChangeText={text => setSelected({installments: text})}
                  keyboardType="numeric"
                />

                <MyInputs
                  editable={false}
                  label={STRINGS.ADD_PAYMENT_REQUEST.installmentsAmount}
                  value={String(selected?.installmentAmount)}
                  // onChangeText={(text) => setSelected({ installmentAmount: text })}
                  keyboardType="numeric"
                />

                <MyTouchableInput
                  label={STRINGS.ADD_PAYMENT_REQUEST.planPaymentType}
                  onPress={() =>
                    setOptionModal({
                      list: planTypeList,
                      type: 'planType',
                      isVisible: true,
                      titlekey: 'title',
                    })
                  }
                  value={!!selected?.planType ? selected?.planType?.title : ''}
                />

                <Collapsible
                  collapsed={
                    selected?.requestType?.key != 'recurring' ||
                    selected?.planType?.key != 'custom'
                  }>
                  <MyInputs
                    label={STRINGS.ADD_PAYMENT_REQUEST.noOfDays}
                    value={String(selected?.noOfDays)}
                    onChangeText={text => setSelected({noOfDays: text})}
                    keyboardType="numeric"
                  />
                </Collapsible>
              </Collapsible>

              <MyInputs
                label={STRINGS.ADD_PAYMENT_REQUEST.vatNumber}
                value={selected?.vat}
                onChangeText={text => setSelected({vat: text})}
              />

              {!!selected?.leadStatus && (
                <MyInputs
                  label={STRINGS.ADD_PAYMENT_REQUEST.leadStatus}
                  value={selected?.leadStatus}
                  onChangeText={text => setSelected({leadStatus: text})}
                />
              )}

              {!!selected?.purchasingUser && (
                <MyInputs
                  label={STRINGS.ADD_PAYMENT_REQUEST.considerPurchasingUserAs}
                  capitalizeSentence={true}
                  value={
                    selected?.purchasingUser[0].toUpperCase() +
                    selected?.purchasingUser.slice(
                      1,
                      selected?.purchasingUser.length,
                    ) +
                    STRINGS.ADD_PAYMENT_REQUEST.sourceMember
                  }
                  onChangeText={text => setSelected({purchasingUser: text})}
                />
              )}
              <MyTouchableInput
                label={STRINGS.ADD_PAYMENT_REQUEST.salePages}
                onPress={() => setShowSalePages(true)}
                value={
                  !!selected?.sale_pages
                    ? selected?.sale_pages?.sale_page_title
                    : ''
                }
              />
            </View>

            {/* <View
              pointerEvents={selected?.templateApplied ? 'none' : 'auto'}
              opacity={selected?.templateApplied ? 0.6 : 1}>
              <MyTouchableInput
                label="Sale Pages"
                onPress={() => setShowSalePages(true)}
                value={
                  !!selected?.sale_pages
                    ? selected?.sale_pages?.sale_page_title
                    : ''
                }
              />
            </View> */}

            <MyInputs
              label={STRINGS.ADD_PAYMENT_REQUEST.transactionNote}
              multiline
              value={selected?.note}
              onChangeText={text => setSelected({note: text})}
            />
          </View>

          <View style={styles.submitButtonContainer}>
            <MyButton
              title={STRINGS.ADD_PAYMENT_REQUEST.submit}
              onPress={addPaymentRequest}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>

      <OptionModalWithSearch
        isVisible={memberModalVisibility}
        closeModal={() => setMemberModalVisibility(false)}
        onSelected={onMemberSelected}
        title={STRINGS.ADD_PAYMENT_REQUEST.member}
        optionList={memberList}
        onSearchTextChange={text => getMembers(text)}
        renderText={({item}) => (
          <MyText>{`${item?.first_name} ${item?.last_name} (${item?.email})`}</MyText>
        )}
      />

      <OptionModalWithSearch
        isVisible={showSalePages}
        closeModal={() => setShowSalePages(false)}
        onSelected={onSalePageSelect}
        title={STRINGS.ADD_PAYMENT_REQUEST.salePages}
        optionList={salePages}
        filterTheList={salePagefilter}
        titleKey={'sale_page_title'}
      />

      <CountryModal
        closeModal={() => setCountryModalVisibility(false)}
        isVisible={countryModalVisibility}
        selectCountry={country => setCountry(country)}
      />

      <OptionModal
        isVisible={optionModal.isVisible}
        closeModal={() =>
          setOptionModal({isVisible: false, titlekey: '', type: '', list: []})
        }
        optionList={optionModal?.list}
        onSelected={onOptionSelected}
        titleKey={optionModal.titlekey}
      />

      <MyLoader enable={loader} />
      <InfoModal footer={infoheader} ref={ref_info} />
    </RootView>
  );
};

export default AddPaymentRequest;

const memberTypeObj = {
  all_members: 'all',
  nurture_members: 'nurture',
};
const statusList = [
  {title: STRINGS.ADD_PAYMENT_REQUEST.active, key: true},
  {title: STRINGS.ADD_PAYMENT_REQUEST.inactive, key: false},
];
const currencyList = [
  {title: STRINGS.ADD_PAYMENT_REQUEST.dollar, key: 'usd'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.ukPounds, key: 'gbp'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.euro, key: 'eur'},
];
const requestList = [
  {title: STRINGS.ADD_PAYMENT_REQUEST.onetime, key: 'onetime'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.recurring, key: 'recurring'},
];

const planTypeList = [
  {title: STRINGS.ADD_PAYMENT_REQUEST.monthly, key: 'month'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.weekly, key: 'week'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.yearly, key: 'year'},
  {title: STRINGS.ADD_PAYMENT_REQUEST.custom, key: 'custom'},
];
const styles = StyleSheet.create({
  boxView: {
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingTop: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  boxHeadingView: {
    position: 'absolute',
    top: -11,
    left: 5,
    // backgroundColor: colors.darkSecondary,
    paddingHorizontal: 5,
  },
  clearbtnView: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 5,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkSecondary,
    paddingBottom: 5,
  },
  topBtnsView: {flexDirection: 'row', alignItems: 'flex-end'},
});
