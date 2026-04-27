function calculateCIDR() {
  const input = document.getElementById("cidrInput").value.trim();
  const regex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!regex.test(input)) {
    alert("Please enter a valid CIDR (e.g., 192.168.1.10/24)");
    return;
  }

  const [ip, prefix] = input.split("/");
  const octets = ip.split(".").map(Number);
  const prefixLen = parseInt(prefix, 10);

  if (octets.some(o => o < 0 || o > 255) || prefixLen > 32) {
    alert("Invalid IP or CIDR prefix");
    return;
  }

  const mask = ~((1 << (32 - prefixLen)) - 1);
  const ipNum = octets.reduce((acc, o) => (acc << 8) + o, 0);
  const network = ipNum & mask;
  const broadcast = network | ~mask >>> 0;

  document.getElementById("network").innerText = numToIp(network);
  document.getElementById("broadcast").innerText = numToIp(broadcast);
  document.getElementById("first").innerText = numToIp(network + 1);
  document.getElementById("last").innerText = numToIp(broadcast - 1);

  const totalHosts = Math.pow(2, 32 - prefixLen);
  document.getElementById("total").innerText = totalHosts.toLocaleString();

  const progress = document.querySelector(".progress");
  progress.style.width = `${(prefixLen / 32) * 100}%`;

  document.getElementById("results").classList.remove("hidden");
}

function numToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join(".");
}
