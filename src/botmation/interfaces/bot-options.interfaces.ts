export interface BotOptions {
  /**
   * @description   Directory name for saving screenshots in
   */
  screenshots_directory: string

  /**
   * @description   Directory name for saving cookies in
   */
  cookies_directory: string

  /**
   * @description   Directory name for saving all things (screenshots, cookies, etc) in
   *                This is optional
   * 
   *                If you use it, all other directories (screenshots, cookies, etc) will be put inside this
   */
  parent_output_directory?: string
}