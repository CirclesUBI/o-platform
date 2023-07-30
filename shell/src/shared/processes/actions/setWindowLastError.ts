export const setWindowLastError = (context, event) => {
  window.o.lastError = event.data;
  console.log("EVENT", event);
};
