// regex: regular expression
// var myRegex = new RegExp(''); when recieve it from backend
var msg = "hello";
var regex = /hel/ // front end validation pattern
console.log(regex.test(msg));

msg = "web design";
regex = /[web]/ // w or e or b
regex = /web/ // w and e and b continously
regex = /web (design|development)/ // design or development
console.log(regex.test(msg));

// to check if phone number eg
regex = /^01[0125][0-9]{8}$/; // ^ -> must start with this regex, 01 and (0 or 1 or 2 or 5) and 8 times of range 0 to 9 
var phone = "01128394315";
console.log(regex.test(phone));

regex = /([0-7][1-9]|80)/ // 10 to 80, splitted in or -> to not match 88
console.log(regex.test("79"));
console.log(regex.test("85"));
regex = /([1-9][0-9]{2}|99)/ // 99 to 999 split to n of digits -> 99 or 100 to 999
console.log(regex.test("998"));
console.log(regex.test("56"));
// . is any char -> .{6} any 6 chars
// \. -> the . itself

