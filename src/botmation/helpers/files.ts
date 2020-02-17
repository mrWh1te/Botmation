const fs = require('fs')

/**
 * @description   Simple method to return a Promise to check it a file exists or not
 *                No matter what, the promise WILL resolve and will resolve TRUE or FALSE
 * @param filePath 
 * @return Promise<boolean>
 */
export const fileExist = (filePath: string): Promise<boolean> => 
  new Promise(resolve => {
    fs.access(filePath, fs.F_OK, (err: any) => {
      if (err) {
        // console.error(err)
        return resolve(false)
      }
      //file exists
      resolve(true)
    })
  })
   
/**
 * @description   Simple method to delete a file, promise based (used in cleaning up files created during tests)
 * @param filePath 
 */  
export const deleteFile = (filePath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.unlink(filePath, function (err: any) {
      if (err) return reject(err)

      // if no error, file has been deleted successfully
      return resolve()
    })
  })