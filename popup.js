const retrieveDomain = async () => {
  const url = await new Promise((resolve) =>
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url;
      if ((url = tabs[0].url)) resolve(url);
    })
  );

  const domainWithProtocol = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/i
  )[0];

  const trimIndex = domainWithProtocol.includes("www")
    ? domainWithProtocol.indexOf("www.") + 4
    : domainWithProtocol.indexOf("//") + 2;

  const domain = domainWithProtocol.substring(trimIndex);
  return domain;
};

const hash = (domain) => {
  const shajs = require("sha.js");
  const hash = shajs("sha256").update(domain).digest("hex");
  return hash;
};

const output = (domain, hashedDomain) => {
  document.getElementById("domain-output").innerHTML = domain;
  document.getElementById("hash-output").value = hashedDomain;
};

document.getElementById("hash-btn").addEventListener("click", () => {
  const hashInput = document.getElementById("hash-input");
  const domain = hashInput.value;
  const hashedDomain = hash(domain);
  output(domain, hashedDomain);
});

window.onload = async () => {
  const domain = await retrieveDomain();
  const hashedDomain = hash(domain);
  output(domain, hashedDomain);
};
