/**
 * Retrieve the cookie with the specified name
 * @param {string} cname Name of the cookie
 */
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

/**
 * Deletes the specified cookie at the specified path.
 * @param {string} cname Name of the cookie
 * @param {string} path Path of the cookie (page it was created on)
 */
export function deleteCookie(cname, path) {
  if (getCookie(cname) !== "") {
    const cookie = cname + "=; ";
    const expiry = "expires=Thu, 01 Jan 1970 00:00:00 UTC; ";
    const cookiePath = "path=" + path + ";";
    const deleteCookie = cookie + expiry + cookiePath;
    document.cookie = deleteCookie;
  } else {
    console.log('Cookie ' + cname + 'not found');
  }
}