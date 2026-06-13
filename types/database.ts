export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          baby_name: string | null;
          birth_type: string | null;
          phase_id: string | null;
          week_in_phase: number | null;
          village_scores: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name?: string;
          baby_name?: string | null;
          birth_type?: string | null;
          phase_id?: string | null;
          week_in_phase?: number | null;
          village_scores?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          baby_name?: string | null;
          birth_type?: string | null;
          phase_id?: string | null;
          week_in_phase?: number | null;
          village_scores?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recovery_plans: {
        Row: {
          id: string;
          user_id: string;
          version: number;
          content: Json;
          status: "generating" | "complete" | "error";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          version?: number;
          content?: Json;
          status?: "generating" | "complete" | "error";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          version?: number;
          content?: Json;
          status?: "generating" | "complete" | "error";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
