/**
 * spa.util_b.js
 * JavaScript browser utilities
 *
 * Compiled by Michael S. Mikowski
 * These are routines I have created and updated
 * since 1998, with inspiration from around the web.
 * MIT License
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.util_b = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      regex_encode_html  : /[&"'><]/g,
      regex_encode_noamp : /["'><]/g,
      html_encode_map    : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      }
    },

    decodeHtml,  encodeHtml, getEmSize, decodeArrayFromURIString;

  configMap.encode_noamp_map = $.extend(
    {}, configMap.html_encode_map
  );
  delete configMap.encode_noamp_map['&'];
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin decodeHtml
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  //
  decodeHtml = function ( str ) {
    return $('<div/>').html(str || '').text();
  };
  // End decodeHtml


  // Begin encodeHtml
  // This is single pass encoder for html entities and handles
  // an arbitrary number of characters
  //
  encodeHtml = function ( input_arg_str, exclude_amp ) {
    var
      input_str = String( input_arg_str ),
      regex, lookup_map
      ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex      = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex      = configMap.regex_encode_html;
    }
    return input_str.replace(regex,
      function ( match, name ) {
        return lookup_map[ match ] || '';
      }
    );
  };
  // End encodeHtml

  // Begin getEmSize
  // returns size of ems in pixels
  //
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // End getEmSize

  // Begin decodeArrayToURIComponent
  decodeArrayFromURIString = function(uriString){
    var result_array = [], parsed_uri_string, parsed_uri_string_keys;

    parsed_uri_string = JSON.parse('{"' + decodeURI(uriString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\s/g,'') + '"}');
    parsed_uri_string_keys = Object.keys(parsed_uri_string); // ["cart[0][id]"]
    for(var i = 0 ; i < parsed_uri_string_keys.length ; i++){
      var _key, _index, _value;
      _index = parseInt(parsed_uri_string_keys[i].split('[')[1].slice(0, -1));
      _key = parsed_uri_string_keys[i].split('][')[1].slice(0,-1);
      _value = parsed_uri_string[parsed_uri_string_keys[i]];
      if(result_array.length === 0 || result_array.length <= _index){
        result_array.push({});
      }

      result_array[_index][_key] = _value;
    }
    return result_array;
  };
  // End encodeArrayToURIComponent

  // export methods
  return {
    decodeHtml : decodeHtml,
    encodeHtml : encodeHtml,
    getEmSize  : getEmSize,
    decodeArrayFromURIString: decodeArrayFromURIString
  };
  //------------------- END PUBLIC METHODS ---------------------
}());

