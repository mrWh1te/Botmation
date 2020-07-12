/**
 * @deprecated
 * @description   Centralized way to configure all options
 */
export interface BotOptions {
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
 * @description    Injectable Value BotActions handling Files, ie directory names etc
 */
export interface BotFilesConfig {
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