export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          department: string
          position: string
          hire_date: string
          status: string
          manager_id: number | null
          salary: number | null
          performance_rating: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          department: string
          position: string
          hire_date: string
          status?: string
          manager_id?: number | null
          salary?: number | null
          performance_rating?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          department?: string
          position?: string
          hire_date?: string
          status?: string
          manager_id?: number | null
          salary?: number | null
          performance_rating?: string | null
          avatar_url?: string | null
        }
      }
      departments: {
        Row: {
          id: number
          created_at: string
          name: string
          code: string
          manager_id: number | null
          parent_id: number | null
          headcount: number
          budget: number | null
          description: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          code: string
          manager_id?: number | null
          parent_id?: number | null
          headcount?: number
          budget?: number | null
          description?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          code?: string
          manager_id?: number | null
          parent_id?: number | null
          headcount?: number
          budget?: number | null
          description?: string | null
        }
      }
      performance_reviews: {
        Row: {
          id: number
          created_at: string
          employee_id: number
          review_period: string
          rating: string
          reviewer_id: number
          goals_achieved: number
          strengths: string | null
          areas_for_improvement: string | null
          comments: string | null
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          employee_id: number
          review_period: string
          rating: string
          reviewer_id: number
          goals_achieved?: number
          strengths?: string | null
          areas_for_improvement?: string | null
          comments?: string | null
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          employee_id?: number
          review_period?: string
          rating?: string
          reviewer_id?: number
          goals_achieved?: number
          strengths?: string | null
          areas_for_improvement?: string | null
          comments?: string | null
          status?: string
        }
      }
      notifications: {
        Row: {
          id: number
          created_at: string
          user_id: number
          title: string
          content: string
          type: string
          is_read: boolean
          is_archived: boolean
          priority: string
          action_url: string | null
          expiry_date: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: number
          title: string
          content: string
          type: string
          is_read?: boolean
          is_archived?: boolean
          priority?: string
          action_url?: string | null
          expiry_date?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: number
          title?: string
          content?: string
          type?: string
          is_read?: boolean
          is_archived?: boolean
          priority?: string
          action_url?: string | null
          expiry_date?: string | null
        }
      }
      salary_records: {
        Row: {
          id: number
          created_at: string
          employee_id: number
          effective_date: string
          amount: number
          currency: string
          reason: string
          approved_by: number | null
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          employee_id: number
          effective_date: string
          amount: number
          currency?: string
          reason: string
          approved_by?: number | null
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          employee_id?: number
          effective_date?: string
          amount?: number
          currency?: string
          reason?: string
          approved_by?: number | null
          status?: string
        }
      }
      onboarding_tasks: {
        Row: {
          id: number
          created_at: string
          employee_id: number
          task_name: string
          description: string | null
          due_date: string | null
          status: string
          assigned_to: number | null
          priority: string
          category: string
        }
        Insert: {
          id?: number
          created_at?: string
          employee_id: number
          task_name: string
          description?: string | null
          due_date?: string | null
          status?: string
          assigned_to?: number | null
          priority?: string
          category?: string
        }
        Update: {
          id?: number
          created_at?: string
          employee_id?: number
          task_name?: string
          description?: string | null
          due_date?: string | null
          status?: string
          assigned_to?: number | null
          priority?: string
          category?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
