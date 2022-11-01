export function log(message:string, args?:any) {
  if (args) {
    console.log(message, args);
  } else {
    console.log(message);
  }
}