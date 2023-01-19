let _generatedUIDs = {};
export function generateLongId() {
  while (true) {
    var uid = Math.random().toString(36);

    if (!_generatedUIDs.hasOwnProperty(uid)) {
      _generatedUIDs[uid] = true;
      return uid;
    }
  }
}

export function generateUID() {
  while (true) {
    var uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
    if (!_generatedUIDs.hasOwnProperty(uid)) {
      _generatedUIDs[uid] = true;
      return uid;
    }
  }
}
