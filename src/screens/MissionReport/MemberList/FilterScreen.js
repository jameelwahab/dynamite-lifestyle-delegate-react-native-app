import {View, StyleSheet, ScrollView, Pressable, TextInput} from 'react-native';
import {MyButton, MyClearButton} from '../../../components/MyButton';
import {useState, useEffect} from 'react';
import {GET_MISSION_FILTER_LIST} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import {fonts} from '../../../utilities/fonts';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import routes from '../../../navigation/routes';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import {STRINGS} from '../../../utilities/strings';
import {Flex} from '../../../UIComponents/FlexViews';

const FilterScreen = ({navigation, route}) => {
  const [isCalendarModalVisible, setCalendarModalVisiblity] = useState(false);
  const {token} = useSelector(selectUser);
  const [duration, setDuration] = useState({from: '', to: ''});
  const [select, setSelected] = useState({
    title: '',
    from: 0,
    to: 0,
    _id: '',
    end_limit: 0,
  });
  const [list, setList] = useState([]);

  const getList = async () => {
    const res = await GET_MISSION_FILTER_LIST({token, navigation});
    if (res.code == 200) {
      setList(res.missions);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    setSelected(route.params.filter);
    setDuration({
      from: route?.params?.filter?.from || '',
      to: route?.params?.filter?.end_limit || '',
    });
  }, [route]);

  const handleSubmit = () => {
    navigation.navigate(routes.missionMembers, {
      filter: {...select, end_limit: duration.to},
    });
  };
  const filterTheList = (items, text) => {
    if (text.trim() == '') {
      return items;
    } else {
      return items.filter(x => {
        return (
          filterTxtForSearch(x.title).includes(filterTxtForSearch(text)) && x
        );
      });
    }
  };
  const filterTxtForSearch = txt =>
    txt
      .toLowerCase()
      .split('')
      .filter(e => e.trim().length)
      .join('');
  const CalendarModal = () => {
    return (
      <OptionModalWithSearch
        isVisible={isCalendarModalVisible}
        closeModal={() => setCalendarModalVisiblity(false)}
        filterTheList={filterTheList}
        onSelected={item => {
          -setCalendarModalVisiblity(false) -
            setSelected({
              _id: item?._id,
              title: item?.title,
              from: 1,
              to: item?.mission_duration,
            }) -
            setDuration({from: 1, to: item?.mission_duration});
        }}
        optionList={list}></OptionModalWithSearch>
    );
  };
  return (
    <RootView title={STRINGS.MISSION_REPORT_FILTER.filter}>
      {CalendarModal()}
      <Flex flex={1}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
          <View style={{height: 10}} />
          <Pressable
            onPress={() => setCalendarModalVisiblity(true)}
            style={styles.top_view_con}>
            <View style={styles.flex08}>
              <MyText>
                {select?.title || STRINGS.MISSION_REPORT_FILTER.missions}
              </MyText>
            </View>
            <View style={styles.iconsRow}>
              {select?.title && (
                <Pressable
                  style={styles.icons_container}
                  onPress={() => setSelected({title: '', from: 0, to: 0})}>
                  <Icon name="close" size={15} color={colors.lightText} />
                </Pressable>
              )}
              <View style={styles.spacer15} />
              <Pressable
                style={styles.icons_container}
                onPress={() => setCalendarModalVisiblity(true)}>
                <Icon name="caretdown" size={12} color={colors.primary} />
              </Pressable>
            </View>
          </Pressable>
          <View style={styles.spacer25} />
          {select?.title && (
            <>
              <MyText color={colors.primary}>
                {STRINGS.MISSION_REPORT_FILTER.durationFromTo}
                {duration.from}
                {STRINGS.MISSION_REPORT_FILTER.to}
                {duration.to}
              </MyText>
              <View style={styles.spacer10} />
              <View style={styles.date_form_con}>
                <MyInputs
                  handleTextChange={txt =>
                    txt < duration.to && setSelected({...select, from: txt})
                  }
                  label={STRINGS.MISSION_REPORT_FILTER.from}
                  max_length={select.to.toString().length}
                  placeholder={STRINGS.MISSION_REPORT_FILTER.placeholder1}
                  keyboardType="phone-pad"
                  icon={() => icons.calendar(colors.primary, 20)}
                  value={select.from}
                />
                <View style={styles.spacer10Width} />
                <MyInputs
                  label={STRINGS.MISSION_REPORT_FILTER.toLabel}
                  max_length={2}
                  handleTextChange={txt =>
                    txt <= duration.to && setSelected({...select, to: txt})
                  }
                  placeholder={STRINGS.MISSION_REPORT_FILTER.placeholder7}
                  icon={() => icons.calendar(colors.primary, 20)}
                  value={select.to}
                />
              </View>
            </>
          )}

          <View style={styles.spacer10} />

          <View style={styles.buttonRow}>
            <MyClearButton
              onPress={() =>
                setSelected({
                  title: '',
                  from: 0,
                  to: 0,
                  _id: '',
                  end_limit: 0,
                })
              }
              style={styles.clearButton}
              title={STRINGS.MISSION_REPORT_FILTER.clearFilter}
            />
            <View style={styles.flexOne}>
              <MyButton
                onPress={handleSubmit}
                title={STRINGS.MISSION_REPORT_FILTER.submit}
              />
            </View>
          </View>
        </ScrollView>
      </Flex>
    </RootView>
  );
};

const MyInputs = ({
  placeholder,
  label,
  handleTextChange,
  value,
  max_length = 1,
}) => {
  const [isFocused, setFocused] = useState(false);
  const [val, setVal] = useState(value);
  useEffect(() => {
    setVal(value);
  }, [value]);
  return (
    <View style={styles.inputColumn}>
      <MyText
        color={isFocused ? colors.primary : colors.lightText}
        style={styles.inputLabel}>
        {label}
      </MyText>
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={max_length}
        keyboardType="phone-pad"
        placeholderTextColor={colors.placeholder}
        value={val.toString()}
        onChangeText={handleTextChange}
        style={[
          styles.input,
          {borderColor: isFocused ? colors.primary : colors.lightText},
        ]}
      />
    </View>
  );
};
// Don't try to read it. Just rewrite the code i am too lazy to add variables

const styles = StyleSheet.create({
  date_form_con: {
    flex: 1,
    alignItem: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  top_view_con: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 10,
    borderColor: colors.lightText,
    borderRadius: 5,
  },
  list_sub_container: {
    padding: 10,
  },
  input: {
    height: 45,
    fontFamily: fonts.regular,
    includeFontPadding: false,
    flex: 1,
    paddingHorizontal: 10,
    color: colors.text,
    borderWidth: 1,
    borderRadius: 5,
  },
  icons_container: {
    height: 45,
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  spacer10: {
    height: 10,
  },
  flex08: {
    flex: 0.8,
  },
  iconsRow: {
    flexDirection: 'row',
  },
  spacer15: {
    width: 15,
  },
  spacer25: {
    height: 25,
  },
  spacer10Width: {
    width: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  inputColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  inputLabel: {
    marginLeft: 5,
    marginBottom: 10,
  },
});

export default FilterScreen;
