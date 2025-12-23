import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import RootView from '../../../components/RootView';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import ProgrammeAccessView from './components/ProgrammeAccessView';
import {__manageProgrammeAccessStyles} from './__style';
import SearchView from '../../../components/SearchView';
import {MyButton} from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import MyLoader from '../../../components/MyLoader';
import {
  GET_PROGRAMS_AND_EVENTS,
  UPDATE_PROGRAMS_AND_EVENTS,
} from '../../../DAL/Payments';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import showToast from '../../../functions/showToast';
import MyRefreshControl from '../../../components/MyRefreshControl';

const ManageProgrammeAccess = ({navigation, route}) => {
  const paramsForProgramAccess = route?.params?.paramsForProgramAccess;

  const {token} = useSelector(selectUser);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [programmeAccessList, setProgrammeAccessList] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);

  const headerView = () => {
    return (
      <Flex style={__manageProgrammeAccessStyles.searchContainer}>
        <SearchView />
        <Flex style={__manageProgrammeAccessStyles.selectAllContainer}>
          <Row justifyContent="flex-end">
            <MyText type="medium" color={colors.primary}>
              Select All{'  '}
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

  const onToggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems({});
    } else {
      const allSelected = programmeAccessList.reduce((acc, item) => {
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
        body: err?.message || 'Something went wrong',
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

    console.log(selectedPrograms, 'selected programs to be sent');

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
          body: 'Programme Access Updated Successfully',
          type: 'success',
        });
      } else {
        showToast({
          body: res?.message || 'Something went wrong',
          type: 'error',
        });
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (
      programmeAccessList.length > 0 &&
      Object.keys(selectedItems).length === programmeAccessList.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, programmeAccessList]);

  useEffect(() => {
    setLoader(true);
    manageProgramAccess();
  }, []);

  return (
    <RootView title="Manage Programme Access">
      <Flex flex={1}>
        <KeyboardAwareFlatList
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={headerView()}
          stickyHeaderIndices={[0]}
          data={programmeAccessList}
          keyExtractor={item => item?._id?.toString()}
          renderItem={__renderItem()}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <MyRefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        />
        <MyButton
          title="Update"
          style={{marginVertical: 10}}
          onPress={updateProgramsAndEvents}
        />
        <MyLoader enable={loader} />
      </Flex>
    </RootView>
  );
};

export default ManageProgrammeAccess;

const styles = StyleSheet.create({});
