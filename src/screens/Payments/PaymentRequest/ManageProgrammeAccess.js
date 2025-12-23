import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import RootView from '../../../components/RootView';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import ProgrammeAccessView from './components/ProgrammeAccessView';
import SearchView from '../../../components/SearchView';
import {MyButton} from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import MyLoader from '../../../components/MyLoader';
import {
  GET_PROGRAMS_AND_EVENTS,
  UPDATE_PROGRAMS_AND_EVENTS,
} from '../../../DAL/Payments';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import showToast from '../../../functions/showToast';
import MyRefreshControl from '../../../components/MyRefreshControl';
import {icons} from '../../../utilities/icons';
import {TextInput} from 'react-native';

const ManageProgrammeAccess = ({navigation, route}) => {
  const paramsForProgramAccess = route?.params?.paramsForProgramAccess;

  const {token} = useSelector(selectUser);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [programmeAccessList, setProgrammeAccessList] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const headerView = () => {
    return (
      <Flex style={styles.searchContainer}>
        {/* <SearchView /> */}
        <View style={styles.searchRoot}>
          <View>{icons.search(colors.placeholder, 20)}</View>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={colors.placeholder}
            placeholder="Search..."
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            value={searchText}
            onChangeText={text => setSearchText(text)}
            selectionColor={colors.selection}
            cursorColor={colors.white}
            keyboardAppearance="dark"
          />
        </View>
        <Flex style={styles.selectAllContainer}>
          <Row justifyContent="flex-end" style={{gap: 5}}>
            <MyText type="medium" color={colors.primary}>
              {STRINGS.MANAGE_PROGRAMME_ACCESS.selectAll}
            </MyText>
            <MyCheckBox onPress={onToggleSelectAll} value={selectAll} />
          </Row>
        </Flex>
      </Flex>
    );
  };
  const __renderItem =
    () =>
    ({item}) => {
      // console.log(item._id, selectedItems[item._id], !!selectedItems[item._id]);
      // console.log(selectedItems, item._id, 'selected____');
      const selectedObject = selectedItems[item._id] || null;
      return (
        <ProgrammeAccessView
          item={item}
          selectedObject={selectedObject}
          isSelected={!!selectedItems[item._id]}
          onChangeField={onUpdateProgrammeField}
          onToggle={id => {
            setSelectedItems(prev => {
              const updated = {...prev};

              if (updated[id]) {
                delete updated[id];
                setSelectAll(false);
              } else {
                updated[id] = {
                  ...item,
                  program_id: item._id,
                };
              }

              return updated;
            });
          }}
        />
      );
    };

  const getFilteredList = () => {
    if (!searchText.trim()) {
      return programmeAccessList;
    }

    return programmeAccessList.filter(item => {
      const searchLower = searchText.toLowerCase();
      return (
        item?.title?.toLowerCase().includes(searchLower) ||
        item?.program_access_type?.toLowerCase().includes(searchLower)
      );
    });
  };

  const onToggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems({});
    } else {
      const filteredList = getFilteredList();
      const allSelected = filteredList.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});
      setSelectedItems(allSelected);
    }

    setSelectAll(prev => !prev);
  };

  const onUpdateProgrammeField = (id, key, value) => {
    setProgrammeAccessList(prev =>
      prev.map(item => (item._id === id ? {...item, [key]: value} : item)),
    );

    setSelectedItems(prev => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          [key]: value,
        },
      };
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    manageProgramAccess();
  };

  const manageProgramAccess = async () => {
    try {
      let res = await GET_PROGRAMS_AND_EVENTS({
        token,
        navigation,
        id: paramsForProgramAccess?.paymentRequestId,
      });
      if (res?.code === 200) {
        setProgrammeAccessList(res?.programs);
        const obj = res?.payment_request?.programs.reduce((acc, curr) => {
          acc[curr.program_id] = curr;
          return acc;
        }, {});

        setSelectedItems(obj);
      }
    } catch (err) {
      showToast({
        body:
          err?.message || STRINGS.MANAGE_PROGRAMME_ACCESS.somethingWentWrong,
      });
    } finally {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const updateProgramsAndEvents = async () => {
    const selectedPrograms = Object.values(selectedItems).map(item => ({
      program_id: item.program_id || item._id,
      title: item.title,
      program_access_type: item.program_access_type,
      no_of_start_days: Number(item.no_of_start_days) || 0,
      no_of_limited_days: Number(item.no_of_limited_days) || 0,
    }));

    try {
      setLoader(true);
      let res = await UPDATE_PROGRAMS_AND_EVENTS({
        token,
        navigation,
        id: paramsForProgramAccess?.paymentRequestId,
        data: {program: selectedPrograms},
      });

      if (res?.code === 200) {
        showToast({
          body: STRINGS.MANAGE_PROGRAMME_ACCESS.updateSuccess,
          type: 'success',
        });
      } else {
        showToast({
          body:
            res?.message || STRINGS.MANAGE_PROGRAMME_ACCESS.somethingWentWrong,
          type: 'error',
        });
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const filteredList = getFilteredList();
    if (
      filteredList.length > 0 &&
      Object.keys(selectedItems).length === filteredList.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, programmeAccessList, searchText]);

  useEffect(() => {
    setLoader(true);
    manageProgramAccess();
  }, []);

  return (
    <RootView title={STRINGS.MANAGE_PROGRAMME_ACCESS.title}>
      <Flex flex={1}>
        <KeyboardAwareFlatList
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          data={getFilteredList()}
          keyExtractor={item => item?._id?.toString()}
          renderItem={__renderItem()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <MyRefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        />
        <MyButton
          title={STRINGS.MANAGE_PROGRAMME_ACCESS.update}
          style={styles.updateButton}
          onPress={updateProgramsAndEvents}
        />
        <MyLoader enable={loader} />
      </Flex>
    </RootView>
  );
};

export default ManageProgrammeAccess;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: colors.darkSecondary,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  selectAllContainer: {
    paddingTop: 10,
    borderColor: colors.white,
    paddingRight: 10,
  },
  separator: {
    height: 10,
  },
  updateButton: {
    marginVertical: 10,
  },
  searchRoot: {
    borderWidth: 1,
    borderColor: colors.border,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    height: '100%',
    color: colors.white,
  },
});
