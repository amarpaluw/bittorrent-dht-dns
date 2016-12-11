var config = {
  mode: "fixed_servers",
  rules: {
    singleProxy: {
      scheme: "socks5",
      host: "127.0.0.1",
      port: 8888
    },
  }
};
chrome.proxy.settings.set(
    {value: config, scope: 'regular'},
    function() {});
