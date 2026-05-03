export type ServiceResult<T = Element> = 
  | {
        success: false,
        error: string
    }
  | {
        success: true,
        data: T
    }
