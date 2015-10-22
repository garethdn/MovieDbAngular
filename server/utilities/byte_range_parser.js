(function(){
  'use strict';

  /* global module:false */

  module.exports = {
    parse: parse
  };

  var maxBuffer, totalLength;

  function parse(rawRange, length, buffer) {
    if (!rawRange) {
      return;
    }

    maxBuffer = buffer;
    totalLength = length;

    var positions = transformFromRaw(rawRange);
    var range = getRange(positions);

    return range;
  }

  function transformFromRaw(rawRange) {
    return rawRange.replace(/bytes=/, "").split("-");
  }

  function getRange(positions) {
    parseInt(positions[0], 10);
    parseInt(positions[1], 10);

    var range = {
      start: undefined,
      end: undefined,
      error: undefined
    };
    
    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
    // 35.1 Byte Ranges

    // If a syntactically valid byte-range-set includes at least one byte-range-spec 
    // whose first-byte-pos is less than the current length of the entity-body, or at
    // least one suffix-byte-range-spec with a non-zero suffix-length, then the 
    // byte-range-set is satisfiable. Otherwise, the byte-range-set is unsatisfiable. 
    // If the byte-range-set is unsatisfiable, the server SHOULD return a response 
    // with a status of 416 (Requested range not satisfiable). Otherwise, the server 
    // SHOULD return a response with a status of 206 (Partial Content) containing the 
    // satisfiable ranges of the entity-body.
    if (positions[0] >= totalLength) {
      range.error = {
        statusCode: 416,
        description: 'First byte position must be less than the current length of the entity-body'
      };

      return range;
    }

    if (!positions[0] && positions[1] && positions === 0) {
      range.error = {
        statusCode: 416,
        description: 'Suffix-byte-range-spec must have a non-zero suffix-length'
      };

      return range;
    }

    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
    // 35.1 Byte Ranges

    // If the last-byte-pos value is present, it MUST be greater than or equal to the 
    // first-byte-pos in that byte-range-spec, or the byte- range-spec is syntactically 
    // invalid. The recipient of a byte-range- set that includes one or more 
    // syntactically invalid byte-range-spec values MUST ignore the header field that 
    // includes that byte-range- set.
    if (positions[1] && positions[1] < positions[0]) {
      return;
    }

    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
    // 35.1 Byte Ranges

    // If the last-byte-pos value is absent, or if the value is greater than or equal to 
    // the current length of the entity-body, last-byte-pos is taken to be equal to one 
    // less than the current length of the entity- body in bytes.
    if (!positions[1] || positions[1] >= totalLength) {
      range.end = totalLength - 1;
    }

    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
    // 35.1 Byte Ranges

    // A suffix-byte-range-spec is used to specify the suffix of the entity-body, of a 
    // length given by the suffix-length value. (That is, this form specifies the 
    // last N bytes of an entity-body.) If the entity is shorter than the specified 
    // suffix-length, the entire entity-body is used.
    if (!positions[0] && positions[1]) {
      if (totalLength < positions[1]) {
        range.start = 0;
      } else {
        range.start = totalLength - positions[1];
      }
      range.end = totalLength - 1;
    }

    return range;
  }

})();