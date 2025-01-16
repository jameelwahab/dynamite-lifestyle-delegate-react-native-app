import { View, Text } from 'react-native'
import React from 'react'


function hexToRgb(hex, opacity = 1) {
  // Remove the hash (#) if it exists
  hex = hex.replace("#", "");

  // Parse the HEX string into RGB components
  let r, g, b;
  if (hex.length === 3) {
    // Handle shorthand HEX format (#RGB)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Handle full HEX format (#RRGGBB)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error("Invalid HEX color format.");
  }

  // Return the RGB or RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default hexToRgb