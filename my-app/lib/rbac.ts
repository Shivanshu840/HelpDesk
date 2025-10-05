import { authService } from "./auth"

export type UserRole = "admin" | "agent" | "customer"

export const useUserRole = (): UserRole | null => {
  const user = authService.getUser()
  return user?.role || null
}

export const canCreateTicket = (role: UserRole | null): boolean => {
  return role === "customer" || role === "admin" || role === "agent"
}

export const canUpdateTicket = (role: UserRole | null): boolean => {
  return role === "agent" || role === "admin"
}

export const canDeleteTicket = (role: UserRole | null): boolean => {
  return role === "admin"
}

export const canManageSLA = (role: UserRole | null): boolean => {
  return role === "admin"
}

export const canViewAllTickets = (role: UserRole | null): boolean => {
  return role === "admin" || role === "agent"
}

export const canAssignTickets = (role: UserRole | null): boolean => {
  return role === "admin" || role === "agent"
}

export const isAdmin = (role: UserRole | null): boolean => {
  return role === "admin"
}

export const isAgent = (role: UserRole | null): boolean => {
  return role === "agent"
}

export const isCustomer = (role: UserRole | null): boolean => {
  return role === "customer"
}
