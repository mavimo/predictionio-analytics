/**
 * PredictionIO Analytics
 *
 * @description A simple application to track analytics events in PredictionIO.
 * @version     <%= version %>
 * @author      Marco Vito Moscaritolo
 * @copyright   Marco Vito Moscaritolo
 * @license     Simplified BSD
 *
 * Source:
 * Original
 * https://github.com/mavimo/predictionio-analytics
 */

/*jslint browser: true*/
/*global document, ActiveXObject */

var PIOA = function (URL) {
  // Cookie prefix.
  this._cookiePrefix = "__pioa_";
  // Increment to start new cookies.
  this._cookieVersion = "1";
  // Expireation time
  this._cookieExpiresMs = 63072000000;
  // Collector URL
  this._Url = URL;
};

PIOA.prototype.init = function () {
  this.initAnalyticsCookie();
};

PIOA.prototype.getUUID = function () {
  return this.initAnalyticsCookie();
};

PIOA.prototype.getCookieName = function () {
  return this._cookiePrefix + this._cookieVersion;
};

PIOA.prototype.identifyDomain = function (host) {
  // Strip the trailing :port if present.
  var subdomain = new RegExp('([^:]*):?.*').exec(host)[1];
  // Bail out for IPv4 addresses.  This function can't handle IPv6 addresses yet.
  if (new RegExp('^((\\d{1,3}\\.){3}\\d{1,3})(:\\d+)?$').exec(subdomain)) {
    return subdomain;
  }

  var domain_result = new RegExp('[^.]*\.([^.]*|..\...|...\...)$').exec(subdomain);
  if (domain_result && domain_result.length > 0) {
    return "." + domain_result[0];
  }

  return subdomain;
};

PIOA.prototype.initAnalyticsCookie = function () {
  var cookieName = this.getCookieName();
  var cookieValue = this.getCookie(cookieName);
  var uuid = null;

  if (cookieValue) {
    uuid = cookieValue[2];
  } else {
    uuid = this.uuid();

    var xmlhttp = this.getXmlHttpRequest();
    var url = this._Url + '?user_create=true&amp;user=' + uuid;
    xmlhttp.open('POST', url, true);
    xmlhttp.send();
  }

  var domain = this.identifyDomain(window.location.host);
  this.setCookie(cookieName, uuid, this._cookieExpiresMs, '/', domain);
  return uuid;
};

/**
 * Generate UUID.
 *
 * @return string
 */
PIOA.prototype.uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get cookie value.
 *
 * @return string
 */
PIOA.prototype.getCookie = function (cookieName) {
  var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)');
  var cookieMatch = cookiePattern.exec(document.cookie);
  return cookieMatch;
};

/**
 * Set cookie value
 */
PIOA.prototype.setCookie = function (cookieName, value, msToExpire, path, domain, secure) {
  var expiryDate;

  // Relative time to expire in milliseconds.
  if (msToExpire) {
    expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + msToExpire);
  }

  document.cookie = cookieName + '=' + encodeURIComponent(value) +
    (msToExpire ? ';expires=' + expiryDate.toGMTString() : '') +
    ';path=' + (path || '/') +
    (domain ? ';domain=' + domain : '') +
    (secure ? ';secure' : '');
};

// from https://gist.github.com/991713
PIOA.prototype.getXmlHttpRequest = function (s, a) {
  a = [a = "Msxml2.XMLHTTP", a + ".3.0", a + ".6.0"];
  do {
    try {
      s = a.pop();
      return new(s ? ActiveXObject : XMLHttpRequest)(s);
    } catch (e) {}
  } while (s);
};

PIOA.prototype.track = function (pageProperties) {
  var uuid = this.getUUID();
  var xmlhttp = this.getXmlHttpRequest();
  var url = this._Url + '?';

  for (var key in pageProperties) {
    url += key + '=' + pageProperties[key] + '&amp;';
  };

  url += 'user=' + uuid;
  xmlhttp.open('POST', url, true);
  xmlhttp.send();
};
