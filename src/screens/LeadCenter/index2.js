import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const tasksData = {
  todo: ['Task 1', 'Task 2', 'Task 5', 'Task 8'],
  inProgress: ['Task 3', 'Task 6', 'Task 9'],
  done: ['Task 4', 'Task 7', 'Task 10'],
};

const Task = ({ task, column, index, onDrag, onDrop, updateTaskLayout, draggingTaskIndex }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      zIndex.value = 999;
      runOnJS(onDrag)(task, column, index);
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      zIndex.value = 1;
      runOnJS(onDrop)(task, column, index, event.absoluteX, event.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    zIndex: zIndex.value,
    opacity: draggingTaskIndex === index ? 0.5 : 1, // Faded out effect for the dragged task
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.task, animatedStyle]} onLayout={(e) => updateTaskLayout(column, index, e.nativeEvent.layout)}>
        <Text>{task}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const Column = React.forwardRef(({ title, tasks, onDrag, onDrop, updateTaskLayout, draggingTaskIndex }, ref) => (
  <View style={styles.column} ref={ref}>
    <Text style={styles.columnTitle}>{title}</Text>
    {tasks.map((task, index) => (
      <Task
        key={index}
        task={task}
        column={title}
        index={index}
        onDrag={onDrag}
        onDrop={onDrop}
        updateTaskLayout={updateTaskLayout}
        draggingTaskIndex={draggingTaskIndex}
      />
    ))}
  </View>
));

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [draggingTaskIndex, setDraggingTaskIndex] = useState(null);
  const columnLayouts = useRef({});
  const columnRefs = useRef({});
  const taskLayouts = useRef({});

  useEffect(() => {
    const timer = setTimeout(() => {
      Object.keys(columnRefs.current).forEach((key) => {
        if (columnRefs.current[key]) {
          columnRefs.current[key].measure((x, y, width, height, pageX, pageY) => {
            columnLayouts.current[key] = { x: pageX, y: pageY, width, height };
          });
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [tasks]);

  const updateTaskLayout = (column, index, layout) => {
    if (!taskLayouts.current[column]) {
      taskLayouts.current[column] = [];
    }
    taskLayouts.current[column][index] = layout;
  };

  const handleDrag = (task, column, index) => {
    setDraggingTaskIndex(index);
    console.log('Dragging task:', task, 'from column:', column);
  };

  const handleDrop = (task, column, index, x, y) => {
    const newColumn = Object.keys(columnLayouts.current).find((key) => {
      const layout = columnLayouts.current[key];
      return x > layout.x && x < layout.x + layout.width && y > layout.y && y < layout.y + layout.height;
    });

    if (newColumn && newColumn !== column) {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        newTasks[column] = newTasks[column].filter((t) => t !== task);
        newTasks[newColumn].push(task);
        return newTasks;
      });
    } else if (newColumn === column) {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const taskList = newTasks[column];
        const [removedTask] = taskList.splice(index, 1);
        let dropIndex = taskList.length;
        for (let i = 0; i < taskList.length; i++) {
          const taskLayout = taskLayouts.current[column][i];
          if (y < taskLayout.y + taskLayout.height / 2) {
            dropIndex = i;
            break;
          }
        }
        taskList.splice(dropIndex, 0, removedTask);
        return newTasks;
      });
    }
    setDraggingTaskIndex(null);
  };

  const renderItem = ({ item }) => (
    <Column
      key={item}
      title={item}
      tasks={tasks[item]}
      ref={(ref) => (columnRefs.current[item] = ref)}
      onDrag={handleDrag}
      onDrop={handleDrop}
      updateTaskLayout={updateTaskLayout}
      draggingTaskIndex={draggingTaskIndex}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={Object.keys(tasks)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const App = () => (
  <GestureHandlerRootView style={styles.appContainer}>
    <KanbanBoard />
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  column: {
    width: 250,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  task: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    width: '80%',
  },
});

export default App;
