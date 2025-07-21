// src/services/houseService.ts

import { api } from './apiService' // 確保這是指向 axiosInstance 的 api 實例
import { House } from '@/types/house'

export const houseService = {
  /**
   * 獲取房屋列表
   * @returns Promise<House[]> 房屋列表
   */
  getHouseList: async (): Promise<House[]> => {
    return api.get<House[]>(
      '/service/house/list',
      {},
      {
        auth: false, // 房屋列表通常不需要認證
      }
    )
  },

  /**
   * 新增房屋資訊
   * @param formData 一個已經包含所有房屋資料和檔案的 FormData 實例
   * @returns Promise<AddHouseResponse> 新增房屋後的回應
   */
  addHouse: async (formData: FormData): Promise<any> => {
    return api.post<any>('/service/house/info', formData, {
      auth: true, // 如果這個 API 需要認證
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
