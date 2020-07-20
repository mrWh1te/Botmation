/**
 * @deprecated
 * @description   Centralized way to configure all options
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
   * @note          While developing the library, the structure /assets/cookies and /assets/screenshots was in use
   *                But to open it up, you can override default `options` with these keys
   */
  parent_output_directory?: string
}

/**
 * @description   Type Gaurd for testing if is BotFileOptions
 * @param value 
 */
export const isBotFileOptions = (value: any): value is BotFileOptions => {
  if (!value) {
    return false
  }

  if (!value.screenshots_directory ||
      !value.pdfs_directory ||
      !value.cookies_directory) {
    return false
  }

  // we meet minimum requirements to match BotFileOptions interface
  return true
}