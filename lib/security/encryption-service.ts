/**
 * 数据加密服务
 * 提供数据加密和解密功能
 */

// 加密算法
export enum EncryptionAlgorithm {
  AES = "aes",
  TRIPLE_DES = "triple-des",
  BLOWFISH = "blowfish",
}

// 加密模式
export enum EncryptionMode {
  CBC = "cbc",
  CFB = "cfb",
  OFB = "ofb",
  CTR = "ctr",
  GCM = "gcm",
}

// 加密配置
interface EncryptionConfig {
  algorithm: EncryptionAlgorithm
  mode: EncryptionMode
  keySize: number
}

// 默认加密配置
const DEFAULT_ENCRYPTION_CONFIG: EncryptionConfig = {
  algorithm: EncryptionAlgorithm.AES,
  mode: EncryptionMode.GCM,
  keySize: 256,
}

// 加密服务
export class EncryptionService {
  private static instance: EncryptionService
  private config: EncryptionConfig
  private encryptionKey: CryptoKey | null = null
  private isInitialized = false

  // 获取单例实例
  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService()
    }
    return EncryptionService.instance
  }

  // 私有构造函数
  private constructor(config: Partial<EncryptionConfig> = {}) {
    this.config = { ...DEFAULT_ENCRYPTION_CONFIG, ...config }
  }

  // 初始化加密服务
  public async initialize(key?: string): Promise<void> {
    if (this.isInitialized) return

    try {
      // 如果提供了密钥，使用它；否则生成新密钥
      if (key) {
        const keyData = this.base64ToArrayBuffer(key)
        this.encryptionKey = await this.importKey(keyData)
      } else {
        this.encryptionKey = await this.generateKey()
      }

      this.isInitialized = true
    } catch (error) {
      console.error("初始化加密服务失败:", error)
      throw new Error("初始化加密服务失败")
    }
  }

  // 检查是否已初始化
  private checkInitialized(): void {
    if (!this.isInitialized || !this.encryptionKey) {
      throw new Error("加密服务未初始化")
    }
  }

  // 生成加密密钥
  private async generateKey(): Promise<CryptoKey> {
    try {
      return await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: this.config.keySize,
        },
        true,
        ["encrypt", "decrypt"],
      )
    } catch (error) {
      console.error("生成加密密钥失败:", error)
      throw new Error("生成加密密钥失败")
    }
  }

  // 导入密钥
  private async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    try {
      return await window.crypto.subtle.importKey(
        "raw",
        keyData,
        {
          name: "AES-GCM",
        },
        false,
        ["encrypt", "decrypt"],
      )
    } catch (error) {
      console.error("导入加密密钥失败:", error)
      throw new Error("导入加密密钥失败")
    }
  }

  // 导出密钥
  public async exportKey(): Promise<string> {
    this.checkInitialized()

    try {
      const keyData = await window.crypto.subtle.exportKey("raw", this.encryptionKey!)
      return this.arrayBufferToBase64(keyData)
    } catch (error) {
      console.error("导出加密密钥失败:", error)
      throw new Error("导出加密密钥失败")
    }
  }

  // 加密数据
  public async encrypt(data: string): Promise<string> {
    this.checkInitialized()

    try {
      // 生成随机IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      // 将数据转换为ArrayBuffer
      const dataBuffer = new TextEncoder().encode(data)

      // 加密数据
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        this.encryptionKey!,
        dataBuffer,
      )

      // 将IV和加密数据合并
      const result = new Uint8Array(iv.length + encryptedBuffer.byteLength)
      result.set(iv)
      result.set(new Uint8Array(encryptedBuffer), iv.length)

      // 返回Base64编码的结果
      return this.arrayBufferToBase64(result)
    } catch (error) {
      console.error("加密数据失败:", error)
      throw new Error("加密数据失败")
    }
  }

  // 解密数据
  public async decrypt(encryptedData: string): Promise<string> {
    this.checkInitialized()

    try {
      // 将Base64编码的数据转换为ArrayBuffer
      const data = this.base64ToArrayBuffer(encryptedData)

      // 提取IV和加密数据
      const iv = data.slice(0, 12)
      const encryptedBuffer = data.slice(12)

      // 解密数据
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.encryptionKey!,
        encryptedBuffer,
      )

      // 返回解密后的字符串
      return new TextDecoder().decode(decryptedBuffer)
    } catch (error) {
      console.error("解密数据失败:", error)
      throw new Error("解密数据失败")
    }
  }

  // 加密对象
  public async encryptObject<T>(obj: T): Promise<string> {
    const json = JSON.stringify(obj)
    return this.encrypt(json)
  }

  // 解密对象
  public async decryptObject<T>(encryptedData: string): Promise<T> {
    const json = await this.decrypt(encryptedData)
    return JSON.parse(json) as T
  }

  // ArrayBuffer转Base64
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Base64转ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
}

// 获取加密服务实例
export function getEncryptionService(): EncryptionService {
  return EncryptionService.getInstance()
}

// 初始化加密服务
export async function initEncryptionService(key?: string): Promise<void> {
  const service = getEncryptionService()
  await service.initialize(key)
}
