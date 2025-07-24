// src/services/houseService.ts

import { api } from './apiService'
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

  /**
   * 獲取房屋詳細資訊
   * @param houseId 房屋ID
   * @returns Promise<House> 房屋詳細資訊
   */
  getHouseInfo: async (houseId: string): Promise<House> => {
    return api.get<House>(
      `/service/house/${houseId}/info`,
      {},
      {
        auth: false, // 房屋詳情通常不需要認證
      }
    )
  },
  /**
   * 刪除房屋資訊
   * @param houseId 房屋ID
   * @returns Promise<any> 刪除房屋後的回應
   */
  deleteHouse: async (houseId: string): Promise<void> => {
    return api.del<void>(
      `/service/house/info`,
      {
        house_id: houseId,
      },
      {
        auth: true,
      }
    )
  },

  /**
   * 更新房屋資訊
   * @param formData 一個已經包含所有房屋資料和檔案的 FormData 實例
   * @returns Promise<any> 更新房屋後的回應
   */
  updateHouse: async (formData: FormData): Promise<any> => {
    return api.patch<any>('/service/house/info', formData, {
      auth: true, // 更新房屋需要認證
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
