export default interface iInterval {
  functionToRun : Function; /* function to run when interval ticks */
  interval : number; /* interval in milliseconds */
  running?: NodeJS.Timer /* interval returned from setInterval */
}