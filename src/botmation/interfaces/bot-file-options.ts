/**
 * @description   Interface of the 1st inject in the higher order files()() BotAction
 *                Look at BotFilesAction's use of BotFilesInjects 
 *                
 *                There are helper methods for local file management that depend on this data structure
 *                ie In saving a file (like cookies), you can specify a parent directory (optional) in addition to the directory of the file domain
 *                  Currently, when it comes to local file management, Botmation comes with pre-built support for:
 *                    1) Taking Screenshots as PNG's
 *                    2) Capturing PDF's
 *                    3) Saving/Loading Cookies
 *                  Each one has their own respective directories to save in (but can be empty string for no directory, and all those directories can be put inside a parent directory ie "assets")
 */
export interface BotFileOptions {
  /**
   * @description   Directory name for saving screenshots in
   */
  screenshots_directory: string

  /**
   * @description   Directory name for saving PDF's in
   */
  pdfs_directory: string
  
  /**
   * @description   Directory name for saving cookies in
   */
  cookies_directory: string

  /**
   * @description   Directory name for storing all other directories (screenshots, cookies, etc) in
   *                This is optional
   * 
   *                If you use it, all other directories (screenshots, cookies, etc) will be put inside this directory
   * 
   * @note          While developing the library, the structure for saving files was /assets/cookies and /assets/screenshots
   *                But to open it up, you can override default `BotFileOptions` with whatever suits you
   * 
   *                The file Actions support Partial<BotFileOptions> so the ultimate fallback in terms of defaults is no directories
   *                All files, screenshots, pdf's, cookies are saved to the local directory of where the script executes
   */
  parent_output_directory?: string
}