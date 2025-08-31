import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { verifyAdminCredentials, hashPassword, verifyPassword } from '@/lib/auth/admin-auth'

vi.mock('bcryptjs')

describe('Admin Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('hashes password with salt', async () => {
      const mockHash = '$2a$12$hashedpassword'
      ;(bcrypt.hash as any).mockResolvedValueOnce(mockHash)

      const result = await hashPassword('plainpassword')

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 12)
      expect(result).toBe(mockHash)
    })
  })

  describe('verifyPassword', () => {
    it('verifies correct password', async () => {
      ;(bcrypt.compare as any).mockResolvedValueOnce(true)

      const result = await verifyPassword('plainpassword', '$2a$12$hashedpassword')

      expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', '$2a$12$hashedpassword')
      expect(result).toBe(true)
    })

    it('rejects incorrect password', async () => {
      ;(bcrypt.compare as any).mockResolvedValueOnce(false)

      const result = await verifyPassword('wrongpassword', '$2a$12$hashedpassword')

      expect(result).toBe(false)
    })
  })

  describe('verifyAdminCredentials', () => {
    beforeEach(() => {
      process.env.ADMIN_USERNAME = 'admin'
      process.env.ADMIN_PASSWORD_HASH = '$2a$12$hashedpassword'
    })

    it('verifies valid admin credentials', async () => {
      ;(bcrypt.compare as any).mockResolvedValueOnce(true)

      const result = await verifyAdminCredentials('admin', 'correctpassword')

      expect(result).toBe(true)
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', '$2a$12$hashedpassword')
    })

    it('rejects invalid username', async () => {
      const result = await verifyAdminCredentials('wronguser', 'password')

      expect(result).toBe(false)
      expect(bcrypt.compare).not.toHaveBeenCalled()
    })

    it('rejects invalid password', async () => {
      ;(bcrypt.compare as any).mockResolvedValueOnce(false)

      const result = await verifyAdminCredentials('admin', 'wrongpassword')

      expect(result).toBe(false)
    })

    it('handles missing environment variables', async () => {
      delete process.env.ADMIN_USERNAME
      delete process.env.ADMIN_PASSWORD_HASH

      const result = await verifyAdminCredentials('admin', 'password')

      expect(result).toBe(false)
    })
  })
})