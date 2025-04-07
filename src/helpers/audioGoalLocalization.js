const getField = (fieldBase, languageCode, data) => {
  // Construct dynamic field name based on the language code
  const fieldName = `${fieldBase}_${languageCode}`;
  // If the field for the selected language doesn't exist or is null, fallback to default language
  return data?.[fieldName] || data?.[`${fieldBase}_${"EN"}`] || null;
};

export const getLocalizedContent = (data, languageCode) => {
  // Default to English if the specified language is not found
  const defaultLanguage = languageCode;
  // Return the appropriate data for the selected language
  return {
    id: data?.id,
    authorName: data?.authorName, // Assuming this doesn't change with language
    bannerImage: data?.bannerImage, // Assuming this doesn't change with language
    description: getField("description", defaultLanguage, data),
    title: getField("title", defaultLanguage, data),
    link: getField("link", defaultLanguage, data),
    duration: getField("duration", defaultLanguage, data),
    premium: data?.premium,
    tags: data?.tags,
    playlistId:data?.playlistId
  };
};
