export const convertModel = async (file, targetFormat) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_format", targetFormat);

  const response = await axios.post(`${API_URL}/models/convert`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  return response;
};
