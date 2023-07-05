export const formatDate = (date) => {
  // Check if the input is a valid date
  if (isNaN(date) || !date) {
    return "Unknown";
  }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};
