import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const tasksData = {
  todo: ['Task 1', 'Task 2'],
  inProgress: ['Task 3'],
  done: ['Task 4'],
};

const Task = ({ task, column, onDrag, onDrop }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      zIndex.value = 10;
      runOnJS(onDrag)(task, column);
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      zIndex.value = 1;
      runOnJS(onDrop)(task, column, event.absoluteX, event.absoluteY);
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
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.task, animatedStyle]}>
        <Text>{task}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const Column = React.forwardRef(({ title, tasks, onDrag, onDrop }, ref) => (
  <View style={styles.column} ref={ref}>
    <Text style={styles.columnTitle}>{title}</Text>
    {tasks.map((task, index) => (
      <Task key={index} task={task} column={title} onDrag={onDrag} onDrop={onDrop} />
    ))}
  </View>
));

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(tasksData);
  const [draggedTask, setDraggedTask] = useState(null);
  const columnLayouts = useRef({});

  const columnRefs = {
    todo: useRef(null),
    inProgress: useRef(null),
    done: useRef(null),
  };

  useEffect(() => {
    setTimeout(() => {
      Object.keys(columnRefs).forEach((key) => {
        columnRefs[key].current.measure((x, y, width, height, pageX, pageY) => {
          columnLayouts.current[key] = { x: pageX, y: pageY, width, height };
        });
      });
    }, 500);
  }, []);

  const handleDrag = (task, column) => {
    setDraggedTask({ task, column });
  };

  const handleDrop = (task, column, x, y) => {
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
    }
    setDraggedTask(null);
  };

  return (
    <View style={styles.container}>
      {Object.keys(tasks).map((column) => (
        <Column
          key={column}
          title={column}
          tasks={tasks[column]}
          ref={columnRefs[column]}
          onDrag={handleDrag}
          onDrop={handleDrop}
        />
      ))}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
  },
  column: {
    flex: 1,
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
    // position: 'absolute',
    width: '80%',
    // zIndex:999
  },
});

export default App;
