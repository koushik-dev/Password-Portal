async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "add":
      chrome.storage.sync.set({ creds: request.creds }, () =>
        chrome.storage.sync.get(["creds"], (data) => sendResponse(data.creds))
      );
      return true
    default:
      // helps debug when request directive doesn't match
      alert(
        "Unmatched request of '" +
          request +
          "' from script to background.js from " +
          sender
      );
  }
});
