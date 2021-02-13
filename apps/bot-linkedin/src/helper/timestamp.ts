// Helper for creating filenames that sort naturally
export const generateTimeStamp = (): string => {
  let x = new Date();

  // Title the screenshot file with a timestamp
  // "year-month-date-hours-minutes" ie "2020-8-21-13-20"
  return x.getFullYear() + '-' +
       ( x.getMonth() + 1 ) + '-' +
         x.getDate() + '-' +
         x.getHours() + '-' +
         x.getMinutes() + '-' +
         x.getSeconds();
}
