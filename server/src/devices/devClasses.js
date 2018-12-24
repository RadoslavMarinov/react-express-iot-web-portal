getDevice = function(id) {
  var devClass = id.substring(id.length - 2, id.length);
  switch (devClass) {
    case "11": {
      return {
        id: id,
        class: devClass,
        name: "BS2",
        displayName: "Device",
        endpoints: [
          {
            name: "sw1",
            displayName: "sw1"
          },
          {
            name: "sw2",
            displayName: "sw2"
          }
        ]
      };
      break;
    }
  }
};

module.exports = {
  getDevice: getDevice
};
