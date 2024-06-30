const convertTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleTimeString("en-US", options);
};

export default convertTime;
