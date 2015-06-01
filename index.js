var _ = require('lodash');
require('Buffer');

var lookup = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/', '\0'
];

var equalizer = function (v) {
  return function (ch) {
    return ch == v;
  }
};

// todo doesn't handle anything that isn't a multiple of 4
var decode = function (inp) {
  var a = [];

  var s1, s2, s3, s4, o1, o2, o3;

  // we go 4 at a time
  // every four sextets contributes three octets
  for (var i = 0; i < inp.length; i++) {
    if ((s1 = _.findIndex(lookup, equalizer(inp[i]))) != -1) {
      // sextets
      s2 = _.findIndex(lookup, equalizer(inp[i + 1]));
      s3 = _.findIndex(lookup, equalizer(inp[i + 2]));
      s4 = _.findIndex(lookup, equalizer(inp[i + 3]));

      i += 3;

      // compounded octets
      o1 = (s1 << 2) + (s2 >> 4);
      // 15 = 001111, so &15 << 4 takes last six digits
      o2 = ((s2 & 15) << 4) + (s3 >> 2);
      // 3 = 000011, so &3 is the last two digits
      o3 = ((s3 & 3) << 6) + s4;

      a.push(o1);
      a.push(o2);
      a.push(o3);
    }
  }
  return new Buffer(a);
};

exports.decode = decode;