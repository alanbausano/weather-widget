export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const numeric = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
  });
  return { day, numeric };
};
