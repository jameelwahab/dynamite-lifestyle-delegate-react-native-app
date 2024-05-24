import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyKeyboardAvoidingView = ({ noScrollView = false, children }) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS == "ios" ? (100 + insets.top) : 0}>
      {noScrollView ? children :
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {children}
        </ScrollView>}
    </KeyboardAvoidingView>
  )
}

export default MyKeyboardAvoidingView