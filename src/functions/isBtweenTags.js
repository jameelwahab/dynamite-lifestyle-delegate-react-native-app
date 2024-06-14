export function isBetweenTags(str, index) {
  // Ensure index is within the string bounds
  if (index < 0 || index >= str.length) {
    return { betweenTags: false, closingTagIndex: -1 };
  }

  // Find the last '<' before or at the index
  let startTagIndex = str.lastIndexOf('<', index);

  // If there is no '<' before or at the index, it's not between tags
  if (startTagIndex === -1) {
    return { betweenTags: false, closingTagIndex: -1 };
  }

  // Find the first '>' after the startTagIndex
  let endTagIndex = str.indexOf('>', startTagIndex);

  // If there is no '>' after the startTagIndex or it is before the index, it's not between tags
  if (endTagIndex === -1 || endTagIndex < index) {
    return { betweenTags: false, closingTagIndex: -1 };
  }

  // If we found both a starting '<' before the index and an ending '>' after the index
  return { betweenTags: true, closingTagIndex: endTagIndex };
}
