function removeUnderscore(str) {
  return str
    .replace(/_/g, ' ') // Replace all underscores with spaces
    .split(' ') // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(' '); // Join the words back with spaces
}

export default removeUnderscore;