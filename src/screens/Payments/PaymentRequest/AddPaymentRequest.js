import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { colors } from '../../../utilities/colors'
import MyInputs from '../../../components/MyInputs'
import { MyButton } from '../../../components/MyButton'
import MyCheckBox from '../../../components/MyCheckBox'
import Collapsible from 'react-native-collapsible'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import { ADD_PAYMENT_REQUEST, EDIT_PAYMENT_REQUEST, GET_MEMBER_LIST_FOR_PAYMENT_REQUEST, GET_PAYMENT_TEMPLATE_AND_PROGRAMMES_LIST, GET_PRODUCT_LIST, GET_TEMPLATE_DETAIL } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import CountryModal from '../../../components/CountryModal'
import OptionModal from '../../../components/OptionModal'
import MyLoader from '../../../components/MyLoader'
import showToast from '../../../functions/showToast'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'


const AddPaymentRequest = ({ navigation, route }) => {
  const { editItem } = route?.params
  const { token } = useSelector(selectUser);
  const [isNewMember, setisNewMember] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState({
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "code": "GB",
    "dial_code": "+44"
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberModalVisibility, setMemberModalVisibility] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [paymentTemplates, setPaymentTemplates] = useState([]);
  const [progammes, setProgammes] = useState([]);
  const [products, setProducts] = useState([])
  const [countryModalVisibility, setCountryModalVisibility] = useState(false);
  const [loader, setLoader] = useState(false)
  const [selected, updateSelected] = useState({
    template: null, title: "", status: statusList[0], currency: currencyList[1], product: null,
    programme: null, requestType: { title: "Onetime", key: "onetime", }, totalAmount: "", vat: "", note: "",
    initialAmount: "", installments: "", installmentAmount: "", planType: null,
    noOfDays: ""
  })

  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: "",
    titlekey: "",
    list: []
  })
  const setSelected = (updation) => updateSelected({ ...selected, ...updation })
  const onMemberSelected = (member) => {
    console.log(member, "onMemberSelected")
    setSelectedMember(member);
    setMemberModalVisibility(false);
  }


  const onOptionSelected = (opt) => {
    console.log(opt, "opt")
    let { type } = optionModal;
    setOptionModal({ isVisible: false, type: "", titlekey: "", list: [] })
    setSelected({ [type]: opt });
    if (type == "template") {
      getTemplateDetail(opt?._id)

    }
  }

  const getMembers = async (searchText = "") => {
    let res = await GET_MEMBER_LIST_FOR_PAYMENT_REQUEST({ navigation, token, searchText });
    if (res.code == 200) {
      setMemberList(res?.members)
    }
  }

  const getProducts = async () => {
    let res = await GET_PRODUCT_LIST({ navigation, token, });
    if (res.code == 200) {
      setProducts(res?.product)
    }
  }
  const getPaymentAndProgrammes = async () => {
    let res = await GET_PAYMENT_TEMPLATE_AND_PROGRAMMES_LIST({ navigation, token });
    if (res.code == 200) {
      setPaymentTemplates(res?.payment_template);
      setProgammes(res?.programs);
    }
  }

  const getTemplateDetail = async (id) => {
    let res = await GET_TEMPLATE_DETAIL({ navigation, token, templateId: id });
    if (res.code == 200) {
      let data = res?.payment_template;
      let obj = {
        template: data,
        title: !!data?.title ? data?.title : "",
        status: statusList.find(x => x.key == true),
        currency: !!data?.currency ? currencyList.find(x => x.key == data?.currency) : null,
        product: !!data?.product ? data?.product : null,
        programme: !!data?.program ? data?.program : null,
        requestType: !!data?.template_type ? requestList.find(x => x.key == data?.template_type) : null,
        totalAmount: !!data?.total_amount ? data?.total_amount : "",
        vat: !!data?.vat_number ? data?.vat_number : "",
        note: !!data?.short_description ? data?.short_description : "",
        initialAmount: !!data?.initial_amount ? data?.initial_amount : "",
        installments: !!data?.no_of_installment ? data?.no_of_installment : "",
        // installmentAmount: !!data?.installment_amount ? data?.installment_amount : "",
        planType: !!data?.interval_type ? planTypeList.find(x => x.key == data?.interval_type) : "",
        noOfDays: !!data?.number_of_days ? data?.number_of_days : ""
      }
      setSelected(obj);
    }
  }

  const setInstallemtAmount = () => {
    if (selected.installments != "") {
      let installmentAmount = (selected?.totalAmount - selected?.initialAmount) / selected.installments;
      console.log("installmentAmount", installmentAmount)
      setSelected({ installmentAmount: installmentAmount.toFixed(1) });
      // return installmentAmount;
    } else {
      setSelected({ installmentAmount: "" });
    }

  }

  const addPaymentRequest = () => {
    if (!!!country && isNewMember) {
      showToast({ title: "Alert", body: "Please select country", type: "info" })
      return
    }
    let obj = {};
    if (isNewMember) {
      obj = {
        "is_member_create": true,
        country: country?.code,
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }
    } else {
      obj = {
        "is_member_create": false,
        "member_id": selectedMember?._id,
      }
    }
    obj = {
      ...obj,
      "currency": selected?.currency?.key,
      "payment_template": selected?.template?._id,
      "product": selected?.product?._id,
      "program_slug": selected?.programme?.program_slug,
      "request_title": selected?.title,
      "request_type": selected?.requestType?.key,
      "show_on_consultant": "all",
      "status": selected?.status?.key,
      "total_amount": selected?.totalAmount,
      "transaction_note": selected?.note,
      "vat_number": selected?.vat,
    }

    if (selected?.requestType?.key == "recurring") {
      obj = {
        ...obj,
        "request_iteration_type": selected?.planType?.key,
        "initial_amount": selected?.initialAmount,
        "month": selected?.installments,
      }
    }
    if (selected?.planType?.key == "custom" && selected?.requestType?.key == "recurring") {
      obj = {
        ...obj,
        number_of_days: selected?.noOfDays
      }
    }
    if (!!editItem) {
      delete obj?.is_member_create
      updatePaymentRequestAPI(obj)
    } else {
      createPaymentRequestAPI(obj);
    }
  }

  const createPaymentRequestAPI = async (obj) => {
    setLoader(true);
    let res = await ADD_PAYMENT_REQUEST({ token, navigation, body: obj });
    if (res.code == 200) {
      showToast({ "body": res?.message, type: "success" })
      setLoader(false);
      route?.params?.backScreenFunc?.(res?.payment_request);
      navigation.goBack();
    } else {
      setLoader(false);
    }

  }

  const updatePaymentRequestAPI = async (obj) => {
    setLoader(true);
    let res = await EDIT_PAYMENT_REQUEST({ token, navigation, body: obj, slug: editItem?.payment_request_slug });
    if (res.code == 200) {
      showToast({ "body": res?.message, type: "success" })
      setLoader(false);
      route?.params?.backScreenFunc?.(res?.payment_request);
      navigation.goBack();
    } else {
      setLoader(false);
    }

  }

  const setEditableData = () => {
    setSelectedMember(editItem?.member);
    setSelected({
      template: !!editItem?.payment_template ? editItem?.payment_template : null,
      title: !!editItem?.request_title ? editItem?.request_title : "",
      status: editItem?.status ? statusList.find(x => x.key == editItem?.status) : statusList.find(x => x.key == true),
      currency: !!editItem?.currency ? currencyList.find(x => x.key == editItem?.currency) : null,
      product: !!editItem?.product ? editItem?.product : null,
      programme: !!editItem?.program ? editItem?.program : null,
      requestType: !!editItem?.request_type ? requestList.find(x => x.key == editItem?.request_type) : null,
      totalAmount: !!editItem?.total_amount ? editItem?.total_amount : "",
      initialAmount: !!editItem?.initial_amount ? editItem?.initial_amount : "",
      installments: !!editItem?.month ? editItem?.month : "",
      planType: !!editItem?.request_iteration_type ? planTypeList.find(x => x.key == editItem?.request_iteration_type) : null,
      noOfDays: !!editItem?.number_of_days ? editItem?.number_of_days : "",
      vat: !!editItem?.vat_number ? editItem?.vat_number : "",
      note: !!editItem?.transaction_note ? editItem?.transaction_note : editItem?.transaction_note
    })
  }

  const clearSelectedPaymentTemplate = () => {
    setSelected({
      template: null, title: "",
      status: statusList[0],
      currency: currencyList[1], product: null,
      programme: null, requestType: null, totalAmount: "", vat: "", note: "",
      initialAmount: "", installments: "", installmentAmount: "", planType: null,
      noOfDays: ""
    })
  }

  useEffect(() => {
    setInstallemtAmount()
  }, [selected?.totalAmount, selected?.installmentAmount, selected?.installments])

  useEffect(() => {
    if (!!editItem) {
      setEditableData()
    }
    getMembers();
    getPaymentAndProgrammes()
    getProducts()
  }, [])

  return (
    <RootView title={!!editItem ? "Edit Payment Request" : "Add Payment Request"}>
      <View style={{ flex: 1, }}>
        <KeyboardAwareScrollView

          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          >

          {/* <MyTouchableInput label='Member Type*' /> */}


          <View style={__styles.boxView}>
            <View style={__styles.boxHeadingView}>
              <MyText type='bold' fontSize={16} >Member Info</MyText>
            </View>
            {!!!editItem &&
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <View style={{ flex: 1 }}>
                  <MyCheckBox onPress={() => setisNewMember(false)} title='Existing Member' value={!isNewMember} circle />
                </View>
                <View style={{ flex: 1 }}>
                  <MyCheckBox onPress={() => setisNewMember(true)} title='New Member' value={isNewMember} circle />
                </View>

              </View>}

            <Collapsible collapsed={isNewMember}>
              <MyTouchableInput
                label='Members*'
                onPress={() => setMemberModalVisibility(true)}
                value={!!selectedMember ? `${selectedMember?.first_name} ${selectedMember?.last_name} (${selectedMember?.email})` : null}
              />
            </Collapsible>


            <Collapsible collapsed={!isNewMember}>
              <MyInputs
                label='First Name*'
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />

              <MyInputs
                label='Last Name*'
                value={lastName}
                onChangeText={(text) => setLastName(text)} />

              <MyInputs
                label='Email*'
                value={email}
                onChangeText={(text) => setEmail(text)} />


              <MyTouchableInput
                label='Choose a country'
                value={!!country ? `${country?.flag} ${country?.name}` : ""}
                onPress={() => setCountryModalVisibility(true)}
                placeholder='No Country Selected...'
                subTextView={() => !!country && (
                  <Pressable
                    style={__styles.clearbtnView}
                    onPress={() => setCountry(null)}>
                    <MyText color={colors.primary} >Clear</MyText>
                  </Pressable>
                )}
              />
            </Collapsible>
          </View>


          <View style={[__styles.boxView, { marginTop: 30 }]}>
            <View style={__styles.boxHeadingView}>
              <MyText type='bold' fontSize={16} >Payment Request Info</MyText>
            </View>


            <MyTouchableInput
              label='Payment Template'
              onPress={() => setOptionModal({ list: paymentTemplates, type: "template", isVisible: true, titlekey: "title" })}
              value={!!selected?.template ? selected?.template?.title : ""}
              subTextView={() => !!selected?.template && (
                <Pressable
                  style={__styles.clearbtnView}
                  onPress={clearSelectedPaymentTemplate}>
                  <MyText color={colors.primary} >Clear</MyText>
                </Pressable>
              )}
            />



            <View
              opacity={!!selected?.template ? 0.6 : 1}
              pointerEvents={!!selected?.template ? "none" : "auto"}>
              <MyInputs
                label='Request Title*'
                value={selected?.title}
                onChangeText={(text) => setSelected({ title: text })}
              />

              <MyTouchableInput
                label='Status'
                onPress={() => setOptionModal({ list: statusList, type: "status", isVisible: true, titlekey: "title" })}
                value={!!selected?.status ? selected?.status?.title : ""}
              />

              <MyTouchableInput
                label='Currency*'
                onPress={() => setOptionModal({ list: currencyList, type: "currency", isVisible: true, titlekey: "title" })}
                value={!!selected?.currency ? selected?.currency?.title : ""}
              />

              <MyTouchableInput
                label='Product'
                onPress={() => setOptionModal({ list: products, type: "product", isVisible: true, titlekey: "name" })}
                value={!!selected?.product ? selected?.product?.name : ""}
              />

              <MyTouchableInput
                label='Programme'
                onPress={() => setOptionModal({ list: progammes, type: "programme", isVisible: true, titlekey: "title" })}
                value={!!selected?.programme ? selected?.programme?.title : ""}
              />

              <MyTouchableInput
                label='Payment Request Type'
                onPress={() => setOptionModal({ list: requestList, type: "requestType", isVisible: true, titlekey: "title" })}
                value={!!selected?.requestType ? selected?.requestType?.title : ""} />

              <MyInputs
                label='Total Amount*'
                value={String(selected?.totalAmount)}
                onChangeText={(text) => setSelected({ totalAmount: text })}
                keyboardType="numeric"
              />

              <Collapsible collapsed={selected?.requestType?.key != "recurring"}>

                <MyInputs
                  label='Initial Amount*'
                  value={String(selected?.initialAmount)}
                  onChangeText={(text) => setSelected({ initialAmount: text })}
                  keyboardType="numeric"
                />

                <MyInputs

                  label='No. of Installments*'
                  value={String(selected?.installments)}
                  onChangeText={(text) => setSelected({ installments: text })}
                  keyboardType="numeric"
                />

                <MyInputs
                  editable={false}
                  label='Installments Amount*'
                  value={String(selected?.installmentAmount)}
                  // onChangeText={(text) => setSelected({ installmentAmount: text })}
                  keyboardType="numeric"
                />

                <MyTouchableInput
                  label='Plan Payment Type*'
                  onPress={() => setOptionModal({ list: planTypeList, type: "planType", isVisible: true, titlekey: "title" })}
                  value={!!selected?.planType ? selected?.planType?.title : ""} />


                <Collapsible collapsed={selected?.requestType?.key != "recurring" || selected?.planType?.key != "custom"}>
                  <MyInputs
                    label='No. of Days*'
                    value={String(selected?.noOfDays)}
                    onChangeText={(text) => setSelected({ noOfDays: text })}
                    keyboardType="numeric"
                  />
                </Collapsible>
              </Collapsible>


              <MyInputs
                label='VAT Number'
                value={selected?.vat}
                onChangeText={(text) => setSelected({ vat: text })} />
            </View>

            <MyInputs
              label='Transaction Note'
              multiline
              value={selected?.note}
              onChangeText={(text) => setSelected({ note: text })} />
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
            <MyButton title='Submit' onPress={addPaymentRequest} />
          </View>
        </KeyboardAwareScrollView>
      </View>


      <OptionModalWithSearch
        isVisible={memberModalVisibility}
        closeModal={() => setMemberModalVisibility(false)}
        onSelected={onMemberSelected}
        title='Member'
        optionList={memberList}
        onSearchTextChange={(text) => getMembers(text)}
        renderText={({ item }) => <MyText>{`${item?.first_name} ${item?.last_name} (${item?.email})`}</MyText>}
      />

      <CountryModal
        closeModal={() => setCountryModalVisibility(false)}
        isVisible={countryModalVisibility}
        selectCountry={(country) => setCountry(country)}
      />

      <OptionModal
        isVisible={optionModal.isVisible}
        closeModal={() => setOptionModal({ isVisible: false, titlekey: "", type: "", list: [] })}
        optionList={optionModal?.list}
        onSelected={onOptionSelected}
        titleKey={optionModal.titlekey}
      />

      

      <MyLoader enable={loader} />

    </RootView>
  )
}

export default AddPaymentRequest
const statusList = [{ title: "Active", key: true, }, { title: "Inactive", key: false, }];
const currencyList = [
  { title: "Dollar", key: "usd", },
  { title: "UK Pounds", key: "gbp", },
  { title: "Euro", key: "eur", }];
const requestList = [
  { title: "Onetime", key: "onetime", },
  { title: "Recurring", key: "recurring", }];

const planTypeList = [
  { title: "Monthly", key: "month", },
  { title: "Weekly", key: "week", },
  { title: "Yearly", key: "year", },
  { title: "Custom", key: "custom", },];
const __styles = StyleSheet.create({
  boxView: {
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingTop: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: colors.secondary
  },
  boxHeadingView: {
    position: "absolute",
    top: -11,
    left: 5,
    // backgroundColor: colors.darkSecondary,
    paddingHorizontal: 5
  },
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },

})