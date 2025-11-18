import CryptoJS from 'crypto-js'
import { toast } from 'sonner'

export const useEncryption = () => {
  const encryptFile = async (file: File, passphrase: string): Promise<Blob> => {
    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Encrypt the base64 string
      const encrypted = CryptoJS.AES.encrypt(base64, passphrase).toString()
      
      // Convert to blob
      const blob = new Blob([encrypted], { type: 'application/octet-stream' })
      return blob
    } catch (error) {
      console.error('Encryption error:', error)
      toast.error('Failed to encrypt file')
      throw error
    }
  }

  const decryptFile = async (
    encryptedBlob: Blob, 
    passphrase: string, 
    originalMimeType: string
  ): Promise<Blob> => {
    try {
      // Read encrypted blob as text
      const encryptedText = await encryptedBlob.text()
      
      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(encryptedText, passphrase)
      const decryptedBase64 = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedBase64) {
        throw new Error('Invalid passphrase')
      }

      // Convert base64 back to blob
      const byteCharacters = atob(decryptedBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: originalMimeType })
    } catch (error) {
      console.error('Decryption error:', error)
      toast.error('Failed to decrypt file. Check your passphrase.')
      throw error
    }
  }

  return { encryptFile, decryptFile }
}
